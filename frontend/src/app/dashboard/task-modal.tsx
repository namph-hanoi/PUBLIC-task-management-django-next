'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Task, useStoreTasks } from '@/features/states/tasks';

interface TaskModalProps {
  taskId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ taskId, isOpen, onClose }) => {
  const { tasks, updateTask } = useStoreTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (taskId !== null) {
      const found = tasks.find(t => t.id === taskId) || null;
      setTask(found);
      setTitle(found?.title || '');
      setDescription(found?.description || '');
    }
  }, [taskId, tasks, isOpen]);

  const handleSave = () => {
    if (task) {
      updateTask(task.id, { title, description });
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
      <div className="flex flex-col gap-4">
        <label>
          <span className="block text-sm font-medium">Title</span>
          <input
            className="border rounded px-2 py-1 w-full"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label>
          <span className="block text-sm font-medium">Description</span>
          <textarea
            className="border rounded px-2 py-1 w-full"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};