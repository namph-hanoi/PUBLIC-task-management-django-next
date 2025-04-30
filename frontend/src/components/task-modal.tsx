'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/modal';
import { Task, useStoreTasks } from '@/features/states/tasks';
import 'react-day-picker/dist/style.css';
import { DatePickerPopover } from '@/components/ui/date-picker-popover';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalStore } from '@/features/states/global'
import { useStoreEmployees } from '@/features/states/employees';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.number(),
  date_due: z.string(),
  date_creation: z.string(),
  assignee: z.union([z.string(), z.number()]).optional(),
});

type TaskFormSchema = z.infer<typeof TaskSchema>;

interface TaskModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

// TODO: Move this function to a utils file
function validateDirtyFields(schema: typeof TaskSchema, data: any, dirtyFields: any) {
  const dirtyKeys = Object.keys(dirtyFields);
  const dirtyData = dirtyKeys.reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {} as any);
  const partialSchema = schema.pick(
    dirtyKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  return partialSchema.safeParse(dirtyData);
}


export const TaskModal: React.FC<TaskModalProps> = ({ taskId, isOpen, onClose }) => {
  const { tasks, updateTask } = useStoreTasks();
  const { employees } = useStoreEmployees(); // Get employees from store
  const task = tasks.find(t => t.id === taskId) || null;

  // Get current user from global store
  const user = useGlobalStore(state => state.user);
  const isEmployee = user?.user_role === 'employee';

  const { register, handleSubmit, reset, setValue, watch, setError, formState: { errors, dirtyFields } } = useForm<TaskFormSchema>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status ?? 1,
      date_due: task?.date_due,
      date_creation: task?.date_creation,
      assignee: task?.assignee ?? '', // Set default assignee if available
    },
  });
  if (task) debugger
  useEffect(() => {
    reset({
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status ?? 1,
      date_due: task?.date_due,
      date_creation: task?.date_creation,
      assignee: task?.assignee ?? '',
    });
  }, [task, isOpen, reset]);

  const date_due = watch('date_due');
  const date_creation = watch('date_creation');

  const onSubmit = (data: TaskFormSchema) => {
    const updatedFields = validateDirtyFields(TaskSchema, data, dirtyFields);
    if (!updatedFields.success) {
      return;
    }

    const errors: Record<string, string> = {};
    const due = new Date(data.date_due);
    due.setHours(0, 0, 0, 0);
    const creation = new Date(data.date_creation);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dirtyFields.date_due || dirtyFields.date_creation) {
      if (due < today) {
        errors.date_due = 'Due date cannot be before today';
      }
      if (due < creation) {
        errors.date_due = 'Due date cannot be before creation date';
      }
    }

    if (Object.keys(errors).length > 0) {
      if (errors.date_due) {
        setError('date_due', { type: 'manual', message: errors.date_due });
      }
      return;
    }

    if (task) {
      updateTask(task.id, {
        ...updatedFields.data
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
            disabled={isEmployee}
          />
          {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
        </label>
        <label>
          <span className="block text-sm font-medium">Description</span>
          <textarea
            className="border rounded px-2 py-1 w-full"
            {...register('description')}
            disabled={isEmployee}
          />
        </label>
        <label>
          <span className="block text-sm font-medium">Status</span>
          <select
            className="border rounded px-2 py-1 w-full"
            {...register('status', { valueAsNumber: true })}
            value={String(watch('status'))}
            onChange={e => {
              setValue(
                'status', Number(e.target.value),
                { shouldDirty: true, shouldValidate: true }
              );
            }}
            onBlur={e => e.currentTarget.blur()} // Ensures select loses focus after change
          >
            <option value="1">In Progress</option>
            <option value="2">Completed</option>
            <option value="3">Pending</option>
          </select>
        </label>
        <DatePickerPopover
          label="Due Date"
          value={date_due}
          minDate={date_creation ? new Date(date_creation) : undefined}
          onChange={date => {
            setValue(
              'date_due',
              date.toISOString().replace(/\.\d{3}Z$/, 'Z'),
              { shouldDirty: true, shouldValidate: true }
            )
          }}
          disabled={isEmployee}
        />
        {errors.date_due && <span className="text-red-500 text-xs">{errors.date_due.message}</span>}
        <DatePickerPopover
          label="Date Created"
          value={date_creation}
          onChange={date =>
            setValue(
              'date_creation',
              date.toISOString().replace(/\.\d{3}Z$/, 'Z'),
              { shouldDirty: true, shouldValidate: true }
            )
          }
          disabled={isEmployee}
        />
          {!isEmployee && (
            <label>
              <span className="block text-sm font-medium">Assignee</span>
              <select
                className="border rounded px-2 py-1 w-full"
                {...register('assignee')}
                disabled={isEmployee}
                value={watch('assignee') ?? ''}
                onChange={e => {
                  setValue('assignee', e.target.value, { shouldDirty: true, shouldValidate: true });
                }}
              >
                {/* <option value="">Unassigned</option> */}
                {employees.map((emp: any) => (
                  <option key={emp.employee_id ?? emp.id} value={emp.employee_id ?? emp.id}>
                    {emp.employee_email}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              type="submit"
              onBlur={e => e.currentTarget.blur()} // Ensures select loses focus after change
            >
            Save
          </button>
      </form>
    </Modal>
  );
};
