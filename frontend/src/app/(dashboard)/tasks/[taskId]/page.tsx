"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getTask } from "@/lib/api/tasks";
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Task, TaskUpdateRequest } from "@/types/tasks";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;
  const { user } = useAuth();
  const { updateTask, deleteTask } = useTasks();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;

      try {
        setLoading(true);
        const taskData = await getTask(taskId);
        setTask(taskData);
      } catch (err: any) {
        setError(err.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleSubmit = async (data: TaskUpdateRequest) => {
    if (!taskId) return;

    setIsSubmitting(true);
    try {
      await updateTask(taskId, data);
      router.push("/tasks");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!taskId) return;

    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      router.push("/tasks");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete task");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => router.push("/tasks");

  if (loading) return <p>Loading task...</p>;
  if (error || !task) return <p>Error loading task: {error || "Not found"}</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2>Edit Task</h2>

      <TaskForm
        mode="edit"
        initialData={task}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
        Delete Task
      </Button>

      <Modal
        isOpen={showDeleteModal}
        title="Delete Task?"
        onClose={() => setShowDeleteModal(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this task?</p>
        <p>{task.title}</p>
        {task.description && <p>{task.description}</p>}
      </Modal>
    </div>
  );
}
