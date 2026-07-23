// frontend/src/pages/Dashboard.tsx
import React from 'react';
import { Navbar } from '../components/Navbar';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Task metrics and management tables will be implemented in Step 8.
        </p>
      </main>
    </div>
  );
};