// components/RecentActivity.tsx
"use client";

import { Task } from '@/components/list';

interface RecentActivityProps {
  tasks: Task[];
}

export default function RecentActivity({ tasks }: RecentActivityProps) {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getActivityIcon = (task: Task) => {
    if (task.completed) {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    );
  };

  const getActivityText = (task: Task) => {
    if (task.completed) {
      return `Completed "${task.title}"`;
    }
    return `Added "${task.title}"`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No recent activity</p>
        ) : (
          recentTasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3">
              {getActivityIcon(task)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {getActivityText(task)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()} at{' '}
                  {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}