'use client';

import { useEffect } from 'react';
import { useStoreTasks } from '@/features/states/tasks';
import { useGlobalStore } from '@/features/states/global';
import EmployerView from './employer-view.client';
import EmployeeView from './employee-view.client';

export default function DashboardClient() {
  const tasks = useStoreTasks((state) => state.tasks);
  const { user } = useGlobalStore();

  useEffect(() => {
    console.log('Tasks from store-tasks:', tasks);
  }, [tasks]);

  // Conditional dashboard view based on user role
  if (user?.user_role === 'employer') {
    return <EmployerView />;
  }
  if (user?.user_role === 'employee') {
    return <EmployeeView />;
  }

  return null;
}