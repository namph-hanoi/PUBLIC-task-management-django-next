'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/modal';
import { useStoreTasks } from '@/features/states/tasks';
import 'react-day-picker/dist/style.css';
import { DatePickerPopover } from '@/components/ui/date-picker-popover';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalStore } from '@/features/states/global';
import { useStoreEmployees } from '@/features/states/employees';
import { validateDirtyFields } from '@/lib/validate-dirty-fields';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.number(),
  date_due: z.string(),
  date_creation: z.string(),
  assignee: z.union([z.string(), z.number()]),
});

type TaskFormSchema = z.infer<typeof TaskSchema>;

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ isOpen, onClose }) => {
  const addTask = useStoreTasks(state => state.createTask);
  const { employees } = useStoreEmployees();
  const user = useGlobalStore(state => state.user);
  const isEmployee = user?.user_role === 'employee';

  const todayISO = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors, dirtyFields }
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 1,
      date_due: todayISO,
      date_creation: todayISO,
      assignee: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: '',
        status: 1,
        date_due: todayISO,
        date_creation: todayISO,
        assignee: '',
      });
    }
  }, [isOpen, reset]);

  const date_due = watch('date_due');
  const date_creation = watch('date_creation');

  const onSubmit = (data: TaskFormSchema) => {
    
    // const dirtyResult = validateDirtyFields(TaskSchema, data, dirtyFields);
    // if (!dirtyResult.success) {
    //   return;
    // }
    // const dirtyData = dirtyResult.data as TaskFormSchema;

    const due = new Date(data.date_due ?? data.date_due);
    due.setHours(0, 0, 0, 0);
    const creation = new Date(data.date_creation ?? data.date_creation);
    creation.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      (data.date_due && due < today) ||
      (data.date_due && data.date_creation && due < creation)
    ) {
      setError('date_due', { type: 'manual', message: 'Due date cannot be before today or creation date' });
      return;
    }
    

    addTask({
      ...data,
      status: Number(data.status ?? data.status),
      assignee: Number(data.assignee),
    });
    onClose();
  };

  return (
    <Modal
      title="Create New Task"
      description="Fill in the details to create a new task"
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
            onBlur={e => e.currentTarget.blur()}
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
              <option value="">Unassigned</option>
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
          onBlur={e => e.currentTarget.blur()}
        >
          Create
        </button>
      </form>
    </Modal>
  );
};