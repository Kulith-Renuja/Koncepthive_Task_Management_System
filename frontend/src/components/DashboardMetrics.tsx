// frontend/src/components/DashboardMetrics.tsx
import React from 'react';
import type { TaskStats } from '../types/task';
import { ListTodo, Clock, PlayCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardMetricsProps {
  stats: TaskStats | null;
  loading: boolean;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ stats, loading }) => {
  const cards = [
    { label: 'Total Tasks', value: stats?.total || 0, icon: ListTodo, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/40' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: PlayCircle, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
    { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/40' },
    { label: 'Overdue', value: stats?.overdue || 0, icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
            <div className={`rounded-lg p-3 ${card.bg}`}>
              <Icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};