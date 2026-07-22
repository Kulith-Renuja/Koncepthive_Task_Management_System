// backend/src/routes/tasks.ts
import { Router, Response } from 'express';
import { pool } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { taskSchema } from '../validators/taskValidator';

const router = Router();

// Protect all task routes with authentication middleware
router.use(authenticateToken);

// GET /api/tasks - Retrieve tasks with Search, Filtering, Sorting, and Pagination
router.get('/', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        let { search, status, priority, sortBy, order, page, limit } = req.query;

        let query = 'SELECT * FROM tasks WHERE 1=1';
        const queryParams: any[] = [];
        let paramIndex = 1;

        // 1. Search by task title
        if (search) {
            query += ` AND title ILIKE $${paramIndex}`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        // 2. Filter by status
        if (status) {
            query += ` AND status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }

        // 3. Filter by priority
        if (priority) {
            query += ` AND priority = $${paramIndex}`;
            queryParams.push(priority);
            paramIndex++;
        }

        // 4. Sorting
        let sortColumn = 'created_at';
        if (sortBy === 'due_date') sortColumn = 'due_date';
        if (sortBy === 'oldest') sortColumn = 'created_at'; // handled by direction

        let sortDirection = 'DESC'; // Default: Newest created
        if (sortBy === 'oldest' || order === 'ASC') {
            sortDirection = 'ASC';
        }

        query += ` ORDER BY ${sortColumn} ${sortDirection}`;

        // 5. Pagination
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const offset = (pageNum - 1) * limitNum;

        query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limitNum, offset);

        const result = await pool.query(query, queryParams);

        // Get total count for pagination reference if needed
        const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
        const totalTasks = parseInt(countResult.rows[0].count);

        res.json({
            totalTasks,
            page: pageNum,
            limit: limitNum,
            tasks: result.rows,
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/tasks - Create a new task with validation
router.post('/', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        // Validate request body using Zod schema
        const validationResult = taskSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResult.error.issues.map(e => e.message)
            });
        }

        const { title, description, priority, status, due_date } = validationResult.data;

        const newQuery = `
      INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;

        const values = [title, description || '', priority, status, due_date];
        const result = await pool.query(newQuery, values);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error while creating task' });
    }
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // Validate request body
        const validationResult = taskSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationResult.error.issues.map(e => e.message)
            });
        }

        const { title, description, priority, status, due_date } = validationResult.data;

        const updateQuery = `
      UPDATE tasks 
      SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;

        const values = [title, description || '', priority, status, due_date, id];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error while updating task' });
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});

export default router;