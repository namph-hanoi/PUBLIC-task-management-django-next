'use client';

import { useEffect, useState } from 'react';
import { useStoreTasks } from '@/features/states/tasks';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { TaskModal } from '../../components/task-modal';

const TaskPageClient = () => {
  const { tasks, refreshTasks } = useStoreTasks();

  const [selectedTask, setSelectedTask] = useState<null | { id: number }>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    refreshTasks();
  }, []);

  function clampText(text: string, maxLength: number) {
    if (!text) return '-';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  const handleRowClick = (task: { id: number }) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const statusMap: Record<number, string> = {
    1: 'In progress',
    2: 'Completed',
    3: 'Pending',
  };

  return (
    <div className="w-full">
      <div className='flex flex-1 flex-col space-y-4 w-full'>
      <h2 className='text-2xl font-bold tracking-tight'>Task Management</h2>
      <p>Welcome to the Task Management page. Here you can manage your tasks effectively.</p>
      <div className='overflow-x-auto w-full'>
        <h3 className='text-lg font-semibold mb-2'>All Tasks</h3>
        <div className="w-full">
        <Table>
          <TableHeader>
          <TableRow>
            <TableHead colSpan={2}>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead colSpan={3}>Status</TableHead>
            <TableHead colSpan={3}>Due Date</TableHead>
            <TableHead colSpan={1}>Date Created</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
            <TableCell colSpan={7} className='text-center'>
              No tasks available.
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
              <TableCell>
              {task.assignee_email || '-'}
              </TableCell>
              <TableCell colSpan={3}>
              {statusMap[task.status] || 'Other'}
              </TableCell>
              <TableCell colSpan={3}>
              {task.date_due ? new Date(task.date_due).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell colSpan={1}>
              {task.date_creation ? new Date(task.date_creation).toLocaleDateString() : '-'}
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
    </div>
  );
};

export default TaskPageClient;