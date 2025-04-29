'use client';

import { useEffect } from 'react';
import { useStoreTasks } from '@/features/states/tasks';

export default function OverviewClientLogger() {
  const tasks = useStoreTasks((state) => state.tasks);

  useEffect(() => {
    console.log('Tasks from store-tasks:', tasks);
  }, [tasks]);

  return null;
}