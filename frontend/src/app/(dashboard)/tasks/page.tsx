"use client";

import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";



import { useAuth } from "@/context/AuthContext"; // Add this import
import { TaskItem } from "@/components/tasks/TaskItem";

export default function TasksPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please sign in to view tasks.
      </div>
    );
  }

  const {
    tasks,
    loading,
    error,
    pagination,
    refetch,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    goToPage,
  } = useTasks(user.id);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Loading your tasks...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-400">
          My Tasks
        </h1>

        {/* Add Task */}
        <div className="mb-10 p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const title = (form.elements.namedItem('title') as HTMLInputElement).value;
              const description = (form.elements.namedItem('description') as HTMLInputElement).value;

              if (title) {
                await addTask({ title, description });
                form.reset();
                refetch(pagination.page);
              }
            }}
            className="space-y-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Task title"
              required
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-linear-to-r from-purple-500 to-cyan-500 hover:scale-105 transition-all shadow-lg"
            >
              + Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <h2 className="text-4xl font-semibold mb-4 text-center">Your Tasks</h2>

        <ul className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              updateTask={updateTask}
              userId={user.id}
            />
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-40 hover:bg-white/10 transition"
          >
            ← Previous
          </button>

          <span className="text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-40 hover:bg-white/10 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
