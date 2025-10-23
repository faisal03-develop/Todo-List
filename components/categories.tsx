'use client';

import { Task } from '@/components/list';

interface CategoriesProps {
  tasks: Task[];
}

export default function Categories({ tasks }: CategoriesProps) {
  const categories = [
    { name: 'Personal', color: 'bg-blue-500', count: tasks.filter(t => t.category === 'personal').length },
    { name: 'Work', color: 'bg-green-500', count: tasks.filter(t => t.category === 'work').length },
    { name: 'Shopping', color: 'bg-yellow-500', count: tasks.filter(t => t.category === 'shopping').length },
    { name: 'Health', color: 'bg-red-500', count: tasks.filter(t => t.category === 'health').length },
    { name: 'Other', color: 'bg-purple-500', count: tasks.filter(t => t.category === 'other').length },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${category.color} rounded-full mr-3`}></div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}