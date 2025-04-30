'use client';

import { useEffect, useState } from 'react';
import { useStoreTasks } from '@/features/states/tasks';
import { useStoreEmployees } from '@/features/states/employees';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { TaskModal } from '../../components/task-modal';
import { TaskCreationModal } from '../../components/task-creation-modal';
import { useGlobalStore } from '@/features/states/global';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';


export type NumberOrAll = number | 'all';

const TaskPageClient = () => {
  const user = useGlobalStore(state => state.user);
  const { tasks, refreshTasks } = useStoreTasks();
  const { fetchEmployees } = useStoreEmployees();
  const router = useRouter();

  const [selectedTask, setSelectedTask] = useState<null | { id: number }>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creationModalOpen, setCreationModalOpen] = useState(false);

  const [selectedAssignee, setSelectedAssignee] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<number | 'all'>('all');

  const [activeSortField, setActiveSortField] = useState<string | null>(null);
  const [isAscendant, setIsAscendant] = useState<boolean>(false);

  const getTasks = (
    assignee: number | 'all',
    status: number | 'all',
    ordering?: string
  ) => {
    const params: { assignee?: NumberOrAll | null; status?: NumberOrAll | null; ordering?: string } = {};
    if (assignee && assignee !== 'all') params.assignee = assignee;
    if (status && status !== 'all') params.status = Number(status);
    if (ordering) params.ordering = ordering;
    refreshTasks(params);
  };

  const handleSort = (field: string) => {
    if (activeSortField === field) {
      setIsAscendant(prev => !prev);
    } else {
      setActiveSortField(field);
      setIsAscendant(false);
    }
  };

  // TODO: move to an util file
  function clampText(text: string, maxLength: number) {
    if (!text) return '-';
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }
  const statusMap: Record<number, string> = {
    1: 'In progress',
    2: 'Completed',
    3: 'Pending',
  };

  const handleRowClick = (task: { id: number }) => {
    setSelectedTask(task);
    setModalOpen(true);
  };


  useEffect(() => {
    const isEmployee = user?.user_role === 'employee';
    if (isEmployee) {
      router.push('/dashboard');
    } else {
      getTasks(
        selectedAssignee,
        selectedStatus,
        activeSortField ? (isAscendant ? activeSortField : `-${activeSortField}`) : undefined
      );
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Add this useEffect to listen to sorting changes
  useEffect(() => {
    if (activeSortField) {
      getTasks(
        selectedAssignee,
        selectedStatus,
        isAscendant ? activeSortField : `-${activeSortField}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSortField, isAscendant]);


  return (
    <div className="w-full">
      <div className='flex flex-1 flex-col space-y-4 w-full'>
        <h2 className='text-2xl font-bold tracking-tight'>Task Management</h2>
        <p>Welcome to the Task Management page. Here you can manage your tasks effectively.</p>
        {/* Add button to open task creation modal */}
        <div className="mb-4 flex items-center justify-between">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setCreationModalOpen(true)}
          >
            + Create Task
          </button>
          <div className="flex gap-2">
            {/* Employee Select */}
            <select
              className="border rounded px-2 py-1"
              value={selectedAssignee}
              onChange={e => {
                const value = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedAssignee(value);
                getTasks(
                  value,
                  selectedStatus,
                  activeSortField ? (isAscendant ? activeSortField : `-${activeSortField}`) : undefined
                );
              }}
            >
              <option value="all">All Employees</option>
              {useStoreEmployees.getState().employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_email}
                </option>
              ))}
            </select>
            {/* Status Select */}
            <select
              className="border rounded px-2 py-1"
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                getTasks(
                  selectedAssignee,
                  e.target.value,
                  activeSortField ? (isAscendant ? activeSortField : `-${activeSortField}`) : undefined
                );
              }}
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusMap).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='overflow-x-auto w-full'>
          <h3 className='text-lg font-semibold mb-2'>All Tasks</h3>
          <div className="w-full">
          <Table>
            <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead colSpan={3}>
                <button
                  className="flex items-center gap-1 w-full"
                  onClick={e => {
                    e.stopPropagation();
                    handleSort('status');
                  }}
                  style={{ width: '100%' }}
                >
                  Status
                  <span className={activeSortField === 'status' ? 'inline-flex' : 'invisible'}>
                    {activeSortField === 'status' && isAscendant ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>
              </TableHead>
              <TableHead colSpan={3}>
                <button
                  className="flex items-center gap-1 w-full"
                  onClick={e => {
                    e.stopPropagation();
                    handleSort('date_due');
                  }}
                  style={{ width: '100%' }}
                >
                  Due Date
                  <span className={activeSortField === 'date_due' ? 'inline-flex' : 'invisible'}>
                    {activeSortField === 'date_due' && isAscendant ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>
              </TableHead>
              <TableHead colSpan={1}>
                <button
                  className="flex items-center gap-1 w-full"
                  onClick={e => {
                    e.stopPropagation();
                    handleSort('date_creation');
                  }}
                  style={{ width: '100%' }}
                >
                  Date Created
                  <span className={activeSortField === 'date_creation' ? 'inline-flex' : 'invisible'}>
                    {activeSortField === 'date_creation' && isAscendant ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>
              </TableHead>
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
                  {task.date_due
                    ? new Date(task.date_due).toLocaleDateString('en-GB')
                    : '-'}
                </TableCell>
                <TableCell colSpan={1}>
                  {task.date_creation
                    ? new Date(task.date_creation).toLocaleDateString('en-GB')
                    : '-'}
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
      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </div>
  );
};

export default TaskPageClient;