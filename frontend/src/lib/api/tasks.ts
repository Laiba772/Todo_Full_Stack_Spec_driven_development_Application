// src/lib/api/tasks.ts
import apiClient from "@/lib/api/clients";
import { Task, TaskCreateRequest, TaskUpdateRequest, TaskListResponse } from "@/types/tasks";

// Get all tasks (paginated)
export const getTasks = async (page = 1, page_size = 20): Promise<TaskListResponse> => {
  const response = await apiClient.get<TaskListResponse>(`/tasks?page=${page}&page_size=${page_size}`);
  return response.data;
};

// Get single task
export const getTask = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${id}`);
  return response.data;
};

// Create task
export const createTask = async (data: TaskCreateRequest): Promise<Task> => {
  const response = await apiClient.post<Task>("/tasks", data);
  return response.data;
};

// Update task
export const updateTask = async (id: string, data: TaskUpdateRequest): Promise<Task> => {
  const response = await apiClient.put<Task>(`/tasks/${id}`, data);
  return response.data;
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};
