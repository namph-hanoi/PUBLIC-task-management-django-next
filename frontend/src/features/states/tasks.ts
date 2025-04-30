import { toast } from 'sonner';
import { persist } from 'zustand/middleware';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { useGlobalStore } from './global';
import { NumberOrAll } from '@/app/task/page.client';

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
  refreshTasks: (params?: { assignee?: NumberOrAll | null; status?: NumberOrAll | null; ordering?: string }) => Promise<void>;
};

const storeTasksImpl = (set: any, get: any): StoreTasks => ({
  tasks: initialTasks,
  createTask: async (task) => {
    try {
      const now = new Date().toISOString();
      const payload = {
        ...task,
        date_creation: now,
        date_due: task.date_due || now,
      };
      const response = await fetch('/api/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      await get().refreshTasks();
      toast.success('Task created successfully');
    } catch (error: any) {
      toast.error('Failed to create task');
      console.error(error);
    }
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
      get().refreshTasks();
      toast.success('Task updated successfully');
    } catch (error: any) {
      toast.error('Failed to update task');
      console.error(error);
    }
  },
  deleteTask: (id) => {
    // set((state: StoreTasks) => ({
    //   tasks: state.tasks.filter((task) => task.id !== id)
    // }));
  },
  refreshTasks: async (params: {
    assignee?: NumberOrAll | null;
    status?: NumberOrAll | null;
    ordering?: string;
  } = {}) => {
    const optionAll = 'all' as NumberOrAll;
    try {
      const query = [];
      if (params.assignee && params.assignee !== optionAll) query.push(`assignee=${params.assignee}`);
      if (params.status && params.status !== optionAll) query.push(`status=${params.status}`);
      if (params.ordering) query.push(`ordering=${params.ordering}`);
      const queryString = query.length ? `?${query.join('&')}` : '';
      const res = await fetch(`/api/task/${queryString}`);
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
