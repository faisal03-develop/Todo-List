// components/TaskList.tsx
import { Task } from '@/components/list';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({
  tasks,
  filter,
  onFilterChange,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const filters = [
    { key: 'all' as const, label: 'All Tasks' },
    { key: 'active' as const, label: 'Active' },
    { key: 'completed' as const, label: 'Completed' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Filter Tabs */}
      <div className="border-b">
        <div className="flex">
          {filters.map((filterItem) => (
            <button
              key={filterItem.key}
              onClick={() => onFilterChange(filterItem.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                filter === filterItem.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No tasks found. Add a new task to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              priorityColor={getPriorityColor(task.priority)}
            />
          ))
        )}
      </div>
    </div>
  );
}