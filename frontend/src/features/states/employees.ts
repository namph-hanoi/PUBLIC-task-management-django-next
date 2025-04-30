// filepath: /app/src/features/states/employees.ts
import { toast } from 'sonner';
import { persist } from 'zustand/middleware';
import { create, StoreApi, UseBoundStore } from 'zustand';

export interface Employee {
  employee_id: number;
  employee_email: string;
  no_task_total: number;
  no_task_completed: number;
}

const initialEmployees: Employee[] = [];

type StoreEmployees = {
  employees: Employee[];
  createEmployee: (employee: Omit<Employee, 'id' | 'date_hired' | 'updated_at'>) => void;
  updateEmployee: (id: number, updates: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  fetchEmployees: () => Promise<void>;
};

const storeEmployeesImpl = (set: any, get: any): StoreEmployees => ({
  employees: initialEmployees,
  createEmployee: (employee) => {
    const now = new Date().toISOString();
    const newId = Math.max(0, ...get().employees.map((e: Employee) => e.id)) + 1;
    const newEmployee: Employee = {
      ...employee,
      // id: newId,
      // date_hired: now,
      // updated_at: now,
    };
    set((state: StoreEmployees) => ({ employees: [newEmployee, ...state.employees] }));
    toast.success('Employee created successfully');
  },
  updateEmployee: async (id, updates) => {
    try {
      const response = await fetch(`/api/employee/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      set((state: StoreEmployees) => ({
        // employees: state.employees.map((employee) =>
        //   employee.id === id
        //     ? { ...employee, ...updates, updated_at: new Date().toISOString() }
        //     : employee
        // )
      }));
      toast.success('Employee updated successfully');
    } catch (error: any) {
      toast.error('Failed to update employee');
      console.error(error);
    }
  },
  deleteEmployee: (id) => {
    set((state: StoreEmployees) => ({
      employees: state.employees.filter((employee) => employee.id !== id)
    }));
    toast.success('Employee deleted successfully');
  },
  fetchEmployees: async () => {
    try {
      const res = await fetch('/api/user/employee-summary/');
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      set(() => ({ employees: data }));
    } catch (error) {
      console.error(error);
    }
  }
});

type UseStoreEmployeesType = UseBoundStore<StoreApi<StoreEmployees>>;

export const useStoreEmployees: UseStoreEmployeesType =
  process.env.NODE_ENV === 'development'
    ? create(
        persist(
          require('zustand/middleware').devtools(storeEmployeesImpl, { name: 'store-employees' }),
          { name: 'store-employees' }
        )
      )
    : create(
        persist(storeEmployeesImpl, { name: 'store-employees' })
      );