// backend/src/validators/taskValidator.ts
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High'], {
    message: 'Priority is required and must be Low, Medium, or High',
  }),
  status: z.enum(['Pending', 'In Progress', 'Completed'], {
    message: 'Status is required and must be Pending, In Progress, or Completed',
  }),
  due_date: z.string().refine((dateStr) => {
    const dueDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return dueDate >= today;
  }, {
    message: 'Due date cannot be earlier than today',
  }),
});