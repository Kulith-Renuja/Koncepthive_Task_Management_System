// frontend/src/types/task.ts
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}