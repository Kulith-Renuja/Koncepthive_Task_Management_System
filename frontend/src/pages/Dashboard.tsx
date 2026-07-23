// frontend/src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { DashboardMetrics } from '../components/DashboardMetrics';
import { TaskControls } from '../components/TaskControls';
import { TaskList } from '../components/TaskList';
import type { Task, TaskStats } from '../types/task';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const limit = 5; // Items per page

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    }
  };

  // Fetch Tasks with parameters
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit, sortBy };
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.tasks);
      setTotalTasks(res.data.totalTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination to page 1 whenever filters or search change
  useEffect(() => {
    setPage(1);
  }, [search, status, priority, sortBy]);

  // Load data on dependency change
  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [page, search, status, priority, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSortBy('created_at');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Task Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor your progress, filter workflows, and manage daily assignments.
          </p>
        </div>

        {/* Dashboard Metric Cards */}
        <DashboardMetrics stats={stats} loading={!stats && loading} />

        {/* Control Bar: Search, Filter, Sort */}
        <TaskControls
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
        />

        {/* Paginated Responsive Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          page={page}
          totalTasks={totalTasks}
          limit={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </main>
    </div>
  );
};