import { taskSchema } from '../taskValidator';

describe('Task Validation Schema', () => {
    it('should pass with valid data', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);

        const validData = {
            title: 'Finish Frontend',
            description: 'Implement React logic',
            priority: 'High',
            status: 'Pending',
            due_date: futureDate.toISOString(),
        };

        const result = taskSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail if title is missing', () => {
        const data = {
            priority: 'High',
            status: 'Pending',
            due_date: new Date().toISOString(),
        };

        const result = taskSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('string');
        }
    });

    it('should fail if priority is invalid', () => {
        const data = {
            title: 'Test',
            priority: 'Urgent',
            status: 'Pending',
            due_date: new Date().toISOString(),
        };

        const result = taskSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Priority is required and must be Low, Medium, or High');
        }
    });

    it('should fail if due_date is in the past', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 2);

        const data = {
            title: 'Test Past Date',
            priority: 'Medium',
            status: 'Pending',
            due_date: pastDate.toISOString(),
        };

        const result = taskSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Due date cannot be earlier than today');
        }
    });
});