"use client"; // Add this at the very top

import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskInput from './TaskInput';
import Categories from '@/components/categories';
import RecentActivity from './RecentActivity';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  userId?: number;
}

const api_url = 'https://jsonplaceholder.typicode.com';

const todoApi = {
  async Todos(): Promise<any[]> {
    const response = await fetch(`${api_url}/todos?_limit=10`);
    if (!response.ok) throw new Error('Failed to Fetch Todo');
    return response.json();
  },

  async createNew(todo: Partial<Task>): Promise<any> {
    const response = await fetch(`${api_url}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error("Failed to Create New Todo.");
    return response.json();
  },

  async updateTodo(id: string, updates: Partial<Task>): Promise<any> {
    const response = await fetch(`${api_url}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to Update ToDo');
    return response.json();
  },

  async deleteTodo(id: string): Promise<any> {
    const response = await fetch(`${api_url}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete Todo');
    return response.json();
  },
};

// Changed component name to start with uppercase
const List = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTodos = await todoApi.Todos();

      const transformedTasks: Task[] = apiTodos.map((todo: any) => ({
        id: todo.id.toString(),
        title: todo.title,
        description: `This is a sample description for "${todo.title}"`,
        completed: todo.completed,
        dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        category: ['personal', 'work', 'shopping', 'health', 'other'][Math.floor(Math.random() * 5)],
        createdAt: new Date().toISOString(),
        userId: todo.userId,
      }));

      setTasks(transformedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to Load tasks');
      console.error('Error Loading Todos: ', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string, description: string, dueDate: string, priority: 'low' | 'medium' | 'high', category: string) => {
    try {
      setError(null);
      const newTask: Partial<Task> = {
        title,
        description,
        completed: false,
        dueDate,
        priority,
        category,
        createdAt: new Date().toISOString(),
      };
      const response = await todoApi.createNew(newTask);
      const createdTask: Task = {
        id: response.id.toString(),
        title: response.title || title,
        description: response.description || description,
        completed: response.completed || false,
        dueDate: response.dueDate || dueDate,
        priority: response.priority || priority,
        category: response.category || category,
        createdAt: response.createdAt || new Date().toISOString(),
      };
      setTasks(prev => [createdTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to Create Task');
      console.error('Error Creating task: ', err);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      setError(null);
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      await todoApi.updateTodo(id, { completed: !taskToUpdate.completed });

      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to Update task');
      console.error('Error Updating Task: ', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="mt-8 w-full flex justify-center">
        <div className="lg:col-span-2 space-y-6">
          <TaskInput onAddTask={addTask}
           />
          <TaskList
            tasks={filteredTasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
    </>
  );
}

export default List;