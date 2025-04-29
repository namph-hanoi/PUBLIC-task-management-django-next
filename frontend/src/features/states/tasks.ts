import { persist } from 'zustand/middleware';
import { create, StoreApi, UseBoundStore } from 'zustand';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: number;
  assignee: number;
  date_creation: string;
  date_due: string;
  created_at: string;
  updated_at: string;
}

const initialTasks: Task[] = [
  {
    "id": 10,
    "title": "Town shake wide such.",
    "description": "Animal score red market. Professor time everybody stage.",
    "status": 1,
    "assignee": 5,
    "date_creation": "2025-04-29T03:29:53.498718Z",
    "date_due": "2025-04-29T03:29:53.498719Z",
    "created_at": "2025-04-29T03:29:53.498787Z",
    "updated_at": "2025-04-29T03:29:53.498788Z"
  },
  {
    "id": 9,
    "title": "Agency outside focus.",
    "description": "Simple letter room newspaper. Short anything TV dream.\nCharacter property enter offer city commercial. Tend account recent.\nThing west land be water class. Four hospital myself money job training.",
    "status": 1,
    "assignee": 5,
    "date_creation": "2025-04-29T03:29:53.497835Z",
    "date_due": "2025-04-29T03:29:53.497842Z",
    "created_at": "2025-04-29T03:29:53.497925Z",
    "updated_at": "2025-04-29T03:29:53.497927Z"
  },
  {
    "id": 6,
    "title": "Billion within view end.",
    "description": "Community scene later southern theory he key. Recent might nature including.\nHeavy risk few hot. Success maintain wish box could might. Only ok card or design.",
    "status": 1,
    "assignee": 5,
    "date_creation": "2025-04-29T03:28:13.039713Z",
    "date_due": "2025-04-29T03:28:13.039714Z",
    "created_at": "2025-04-29T03:28:13.039784Z",
    "updated_at": "2025-04-29T03:28:13.039786Z"
  },
  {
    "id": 5,
    "title": "Dark community piece no positive.",
    "description": "Act pressure agency claim include. Available herself out mother. Ok also agree attention work finally health.",
    "status": 1,
    "assignee": 5,
    "date_creation": "2025-04-29T03:28:13.035393Z",
    "date_due": "2025-04-29T03:28:13.035395Z",
    "created_at": "2025-04-29T03:28:13.035501Z",
    "updated_at": "2025-04-29T03:28:13.035503Z"
  }
];

type StoreTasks = {
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'date_creation'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
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
  updateTask: (id, updates) => {
    set((state: StoreTasks) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      )
    }));
  },
  deleteTask: (id) => {
    set((state: StoreTasks) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }));
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
