'use client';

import React, { useState } from 'react';
import { Task, TaskUpdateRequest } from '@/types/tasks';
import { Button } from '@/components/ui/Button';

interface TaskItemProps {
  task: Task;
  toggleComplete: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, data: TaskUpdateRequest) => Promise<void>;
  userId: string;
}

export function TaskItem({
  task,
  toggleComplete,
  deleteTask,
  updateTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const handleUpdate = async () => {
    try {
      await updateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <li className="group relative p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-purple-500/20 hover:scale-[1.01] transition-all duration-300">
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Task title"
          />

          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            placeholder="Description"
          />

          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdate}>
              Save
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                task.is_completed
                  ? 'line-through text-gray-400'
                  : 'text-white'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-sm mt-1 ${
                  task.is_completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => toggleComplete(task.id)}
              variant={task.is_completed ? 'secondary' : 'primary'}
            >
              {task.is_completed ? 'Undo' : 'Complete'}
            </Button>

            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              variant="secondary"
            >
              Edit
            </Button>

            <Button
              size="sm"
              onClick={() => deleteTask(task.id)}
              variant="danger"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
