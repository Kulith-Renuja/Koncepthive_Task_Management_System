// backend/src/index.ts
import { errorHandler } from './middleware/errorHandler';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { pool } from './db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Must match your Vite frontend URL
    credentials: true // Crucial for allowing cookies to be sent and received
}));
app.use(express.json());
app.use(cookieParser()); // Initialize cookie-parser

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

// Error handling middleware (last middleware)
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await pool.query('SELECT 1');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});