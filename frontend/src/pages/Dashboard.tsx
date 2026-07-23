// frontend/src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { DashboardMetrics } from '../components/DashboardMetrics';
import { TaskControls } from '../components/TaskControls';
import { TaskList } from '../components/TaskList';
import { TaskModal, type TaskFormValues } from '../components/TaskModal';
import type { Task, TaskStats } from '../types/task';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & Pagination State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const limit = 5;

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load dashboard metrics:', error);
    }
  };

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

  useEffect(() => {
    setPage(1);
  }, [search, status, priority, sortBy]);

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

  // CRUD Actions
  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask.id}`, data);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
      fetchStats();
      fetchTasks();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
      fetchStats();
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Create Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Task Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor your progress, filter workflows, and manage daily assignments.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <Plus className="h-5 w-5" />
            Create Task
          </button>
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
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
        />

        {/* Task Form Modal (Create / Edit) */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedTask}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
};