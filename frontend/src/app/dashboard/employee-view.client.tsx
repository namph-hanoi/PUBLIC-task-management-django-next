'use client';
import React, { useState, useEffect, memo } from 'react';
import { useGlobalStore } from '@/features/states/global';
import { useStoreTasks } from '@/features/states/tasks';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import PageContainer from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskModal } from './task-modal';

export default memo(function EmployeeView() {
  const { user } = useGlobalStore();
  const { tasks, refreshTasks } = useStoreTasks();

  const [selectedTask, setSelectedTask] = useState<null | { id: number }>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch tasks from API on mount
  useEffect(() => {
    refreshTasks();
  }, []);
  
  // Utility function to clamp text
  function clampText(text: string, maxLength: number) {
    if (!text) return '-';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  const handleRowClick = (task: { id: number }) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Employee Dashboard
          </h2>
        </div>

        <Card className='@container/card'>
          <CardHeader>
            <CardTitle className='text-xl'>
              Welcome, {user?.first_name || 'Employee'}
            </CardTitle>
            <p className='text-muted-foreground mt-2'>
              This is your employee dashboard view
            </p>
          </CardHeader>
        </Card>

        <div className='overflow-x-auto'>
          <h3 className='text-lg font-semibold mb-2'>Your Tasks</h3>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={2}>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead colSpan={3}>Status</TableHead>
                  <TableHead colSpan={3}>Due Date</TableHead>
                  <TableHead colSpan={1}>Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center'>
                      No tasks assigned.
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleRowClick(task)}
                    >
                      <TableCell colSpan={2}>{clampText(task.title || '-', 30)}</TableCell>
                      <TableCell title={task.description || '-'}>
                        {clampText(task.description || '-', 30)}
                      </TableCell>
                      <TableCell colSpan={3}>
                        {task.status === 1 ? 'Open' : 'Other'}
                      </TableCell>
                      <TableCell colSpan={3}>
                        {new Date(task.date_due).toLocaleDateString()}
                      </TableCell>
                      <TableCell colSpan={1} >
                        {new Date(task.date_creation).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <TaskModal
        taskId={selectedTask?.id ?? null}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedTask(null); }}
      />
    </>
  );
})