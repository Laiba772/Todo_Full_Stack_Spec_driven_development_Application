"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getTask } from "@/lib/api/tasks";
import { useTasks } from "@/hooks/useTasks";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Task, TaskUpdateRequest } from "@/types/tasks";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;

  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please login to continue.
      </div>
    );
  }

  const { updateTask, deleteTask } = useTasks(user.id);

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
        const taskData = await getTask(user.id, taskId);
        setTask(taskData);
      } catch (err: any) {
        setError(err.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [taskId, user.id]);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading task...
      </div>
    );

  if (error || !task)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error || "Task not found"}
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black px-6 py-12 text-white">
      <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">

        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
          Edit Task
        </h2>

        <TaskForm
          mode="edit"
          initialData={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        <div className="mt-6 flex justify-end">
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Task
          </Button>
        </div>
      </div>

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
        <p className="text-gray-300">
          Are you sure you want to delete this task?
        </p>
        <p className="mt-2 font-semibold text-white">{task.title}</p>
        {task.description && (
          <p className="mt-1 text-gray-400">{task.description}</p>
        )}
      </Modal>
    </div>
  );
}
