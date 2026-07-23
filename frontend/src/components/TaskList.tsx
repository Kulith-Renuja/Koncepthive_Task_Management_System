// frontend/src/components/TaskList.tsx
import React from 'react';
import type { Task } from '../types/task';
import { Spinner } from './Spinner';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  page: number;
  totalTasks: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  page,
  totalTasks,
  limit,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalTasks / limit) || 1;

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    };
    return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[priority] || ''}`}>{priority}</span>;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'In Progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${styles[status] || ''}`}>{status}</span>;
  };

  const isOverdue = (dueDateStr: string, status: string) => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDateStr) < today;
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
        <AlertCircle className="h-10 w-10 text-gray-400 dark:text-gray-600" />
        <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search query or filter options.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <th className="py-3.5 pl-6 pr-3">Title</th>
              <th className="px-3 py-3.5">Priority</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {tasks.map((task) => {
              const overdue = isOverdue(task.due_date, task.status);
              return (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="py-4 pl-6 pr-3 font-medium text-gray-900 dark:text-white">
                    <div>{task.title}</div>
                    {task.description && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</div>}
                  </td>
                  <td className="px-3 py-4">{getPriorityBadge(task.priority)}</td>
                  <td className="px-3 py-4">{getStatusBadge(task.status)}</td>
                  <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className={overdue ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                      {overdue && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-1.5 py-0.5 rounded">Overdue</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800 md:hidden">
        {tasks.map((task) => {
          const overdue = isOverdue(task.due_date, task.status);
          return (
            <div key={task.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-base">{task.title}</h4>
                {getPriorityBadge(task.priority)}
              </div>
              {task.description && <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>}
              <div className="flex items-center justify-between pt-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className={overdue ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                  {overdue && <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-1 py-0.5 rounded">Overdue</span>}
                </div>
                {getStatusBadge(task.status)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50 sm:px-6">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{(page - 1) * limit + 1}</span> to{' '}
          <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * limit, totalTasks)}</span> of{' '}
          <span className="font-medium text-gray-900 dark:text-white">{totalTasks}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};