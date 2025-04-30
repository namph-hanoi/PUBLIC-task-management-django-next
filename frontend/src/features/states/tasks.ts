import { toast } from 'sonner';
import { persist } from 'zustand/middleware';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { useGlobalStore } from './global';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: number;
  assignee: number;
  date_creation: string;
  date_due: string;
  created_at: string;
  updated_at: string;
  assignee_email?: string;
}

const initialTasks: Task[] = [];

type StoreTasks = {
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'date_creation'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  refreshTasks: () => Promise<void>; // <-- Change signature to no args, returns Promise<void>
};

const storeTasksImpl = (set: any, get: any): StoreTasks => ({
  tasks: initialTasks,
  createTask: (task) => {
    const now = new Date().toISOString();
    const newId = Math.max(0, ...get().tasks.map((t: Task) => t.id)) + 1;
    const newTask: Task = {
      ...task,
      id: newId,
      created_at: now,
      updated_at: now,
      date_creation: now,
    };
    set((state: StoreTasks) => ({ tasks: [newTask, ...state.tasks] }));
  },
  updateTask: async (id, updates) => {
    try {
      // Get user role from global store
      const user = useGlobalStore.getState().user;
      let filteredUpdates = updates;
      if (user?.user_role === 'employee') {
        // Only allow status update for employees
        filteredUpdates = { status: updates.status };
      }
      const response = await fetch(`/api/task/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredUpdates),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      set((state: StoreTasks) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...filteredUpdates, updated_at: new Date().toISOString() }
            : task
        )
      }));
      toast.success('Task updated successfully');
    } catch (error: any) {
      toast.error('Failed to update task');
      console.error(error);
    }
  },
  deleteTask: (id) => {
    set((state: StoreTasks) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }));
  },
  refreshTasks: async () => {
    try {
      const res = await fetch('/api/task/');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      set(() => ({ tasks: data }));
    } catch (error) {
      console.error(error);
    }
  }
});

type UseStoreTasksType = UseBoundStore<StoreApi<StoreTasks>>;

export const useStoreTasks: UseStoreTasksType =
  process.env.NODE_ENV === 'development'
    ? create(
        persist(
          require('zustand/middleware').devtools(storeTasksImpl, { name: 'store-tasks' }),
          { name: 'store-tasks' }
        )
      )
    : create(
        persist(storeTasksImpl, { name: 'store-tasks' })
      );
