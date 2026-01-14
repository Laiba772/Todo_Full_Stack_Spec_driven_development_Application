"use client";

import { useEffect, useState } from "react";
import { Task, TaskCreateRequest, TaskUpdateRequest, TaskListResponse } from "@/types/tasks";
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from "@/lib/api/tasks";

export const useTasks = (pageSize: number = 20) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response: TaskListResponse = await getTasks(pageNum, pageSize);
      setTasks(response.items);
      setPage(response.page);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (data: TaskCreateRequest) => {
    try {
      setLoading(true);
      const newTask = await apiCreateTask(data);
      setTasks(prev => [...prev, newTask]);
    } catch (err: any) {
      setError(err.message || "Failed to add task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, data: TaskUpdateRequest) => {
    try {
      setLoading(true);
      const updated = await apiUpdateTask(id, data);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err: any) {
      setError(err.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      await apiDeleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    await updateTask(taskId, { is_completed: !task.is_completed });
  };

  const goToPage = async (pageNum: number) => {
    await fetchTasks(pageNum);
  };

  useEffect(() => {
    fetchTasks(page);
  }, []);

  return {
    tasks,
    loading,
    error,
    pagination: { page, totalPages },
    refetch: fetchTasks,
    addTask,
    updateTask,
    createTask: addTask,
    deleteTask,
    toggleComplete,
    goToPage,
  };
};
