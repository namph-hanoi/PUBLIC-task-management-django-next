'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/modal';
import { Task, useStoreTasks } from '@/features/states/tasks';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Popover } from '@/components/ui/popover'; // Make sure you have a Popover component or use a library
import { format } from 'date-fns';

// Reusable DatePickerPopover component
interface DatePickerPopoverProps {
  label: string;
  value?: string;
  onChange: (date: Date) => void;
}

const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({ label, value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const dateObj = value ? new Date(value) : undefined;
  console.log(open)
  return (
    <label>
      <span className="block text-sm font-medium">{label}</span>
        <div
          className="border rounded px-2 py-1 w-full text-left bg-white"
          onClick={() => {
            setOpen(prevState => !prevState);
          }}
        >
          {dateObj ? format(dateObj, 'yyyy-MM-dd') : <span className="text-gray-400">Select date</span>}
        </div>
      <Popover open={open} onOpenChange={setOpen}>
        {open && (
          <div className="absolute z-50 mt-2 p-2 bg-white rounded shadow">
            <DayPicker
              mode="single"
              selected={dateObj}
              onSelect={date => {
                if (date) {
                  onChange(date);
                  setOpen(false);
                }
              }}
            />
          </div>
        )}
      </Popover>
    </label>
  );
};

interface TaskModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
}


export const TaskModal: React.FC<TaskModalProps> = ({ taskId, isOpen, onClose }) => {
  const { tasks, updateTask } = useStoreTasks();
  const task = tasks.find(t => t.id === taskId) || null;

  // Set all task fields as defaultValues
  const { register, handleSubmit, reset, setValue, watch } = useForm<Task>({
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

  const onSubmit = (data: Task) => {
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
          onChange={date => {
            setValue(
              'date_due',
              date.toISOString().replace(/\.\d{3}Z$/, 'Z')
            )
          }
          }
        />
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