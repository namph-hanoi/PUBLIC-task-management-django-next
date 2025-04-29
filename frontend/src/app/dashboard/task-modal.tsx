'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/modal';
import { Task, useStoreTasks } from '@/features/states/tasks';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Popover } from '@/components/ui/popover'; // Make sure you have a Popover component or use a library
import { format } from 'date-fns';
import { DatePickerPopover } from '@/components/ui/date-picker-popover';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for Task form validation
const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.number(),
  date_due: z.string(),
  date_creation: z.string(),
}).superRefine((data, ctx) => {
  const due = new Date(data.date_due);
  const creation = new Date(data.date_creation);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (due < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['date_due'],
      message: 'Due date cannot be before today',
    });
  }
  if (due < creation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['date_due'],
      message: 'Due date cannot be before creation date',
    });
  }
});

type TaskFormSchema = z.infer<typeof TaskSchema>;

interface TaskModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
}


export const TaskModal: React.FC<TaskModalProps> = ({ taskId, isOpen, onClose }) => {
  const { tasks, updateTask } = useStoreTasks();
  const task = tasks.find(t => t.id === taskId) || null;

  // Set all task fields as defaultValues
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TaskFormSchema>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status ?? 1,
      date_due: task?.date_due,
      date_creation: task?.date_creation,
    },
  });

  useEffect(() => {
    reset({
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status ?? 1,
      date_due: task?.date_due,
      date_creation: task?.date_creation,
    });
  }, [task, isOpen, reset]);

  const date_due = watch('date_due');
  const date_creation = watch('date_creation');

  const onSubmit = (data: TaskFormSchema) => {
    if (task) {
      updateTask(task.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        date_due: data.date_due,
        date_creation: data.date_creation,
      });
      onClose();
    }
  };

  if (!task) return null;

  return (
    <Modal
      title={`Task #${task.id}`}
      description={`Edit details for "${task.title}"`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span className="block text-sm font-medium">Title</span>
          <input
            className="border rounded px-2 py-1 w-full"
            {...register('title')}
          />
          {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
        </label>
        <label>
          <span className="block text-sm font-medium">Description</span>
          <textarea
            className="border rounded px-2 py-1 w-full"
            {...register('description')}
          />
        </label>
        <label>
          <span className="block text-sm font-medium">Status</span>
          <select
            className="border rounded px-2 py-1 w-full"
            {...register('status')}
          >
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
            <option value={3}>Pending</option>
          </select>
        </label>
        <DatePickerPopover
          label="Due Date"
          value={date_due}
          minDate={date_creation ? new Date(date_creation) : undefined}
          onChange={date => {
            setValue(
              'date_due',
              date.toISOString().replace(/\.\d{3}Z$/, 'Z')
            )
          }}
        />
        {errors.date_due && <span className="text-red-500 text-xs">{errors.date_due.message}</span>}
        <DatePickerPopover
          label="Date Created"
          value={date_creation}
          onChange={date =>
            setValue(
              'date_creation',
              date.toISOString().replace(/\.\d{3}Z$/, 'Z')
            )
          }
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Save
        </button>
      </form>
    </Modal>
  );
};