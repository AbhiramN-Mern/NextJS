"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskFilter } from "@/types/todo";
import TodoItem from "./TodoItem";
import TaskFilters from "./TaskFilters";

interface TodoListProps {
  userId: string;
}

export default function TodoList({ userId }: TodoListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>("all");
  const [newTitle, setNewTitle] = useState("");
  const [inputError, setInputError] = useState("");

  // Load tasks from localStorage when userId changes or mounts
  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) return;

      if (!userId) {
        setTasks([]);
        setIsLoaded(false);
        return;
      }

      try {
        const storageKey = `todo-tasks-${userId}`;
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const validTasks: Task[] = parsed.filter(
              (t) =>
                t &&
                typeof t.id === "string" &&
                typeof t.title === "string" &&
                typeof t.completed === "boolean"
            );
            setTasks(validTasks);
          } else {
            setTasks([]);
          }
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Error reading tasks from localStorage:", err);
        setTasks([]);
      } finally {
        setIsLoaded(true);
      }
    });

    return () => {
      active = false;
    };
  }, [userId]);

  // Persist tasks to localStorage ONLY after initial loading is complete
  useEffect(() => {
    if (!isLoaded || !userId) return;

    try {
      const storageKey = `todo-tasks-${userId}`;
      window.localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (err) {
      console.error("Error saving tasks to localStorage:", err);
    }
  }, [tasks, isLoaded, userId]);

  // Handlers
  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setInputError("Please enter a task title");
      return;
    }

    const newTask: Task = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle("");
    setInputError("");
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleEditTask = (id: string, updatedTitle: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, title: updatedTitle, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Filter calculations
  const totalCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  if (!isLoaded) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple Summary */}
      <div className="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-3">
        <span>
          Total: <strong className="text-black">{totalCount}</strong>
        </span>
        <span>
          Active: <strong className="text-black">{activeCount}</strong>
        </span>
        <span>
          Completed: <strong className="text-black">{completedCount}</strong>
        </span>
      </div>

      {/* Add Task Input Form */}
      <div>
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (inputError) setInputError("");
            }}
            placeholder="Add a new task..."
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>
        {inputError && (
          <p className="mt-1 text-xs text-red-600">{inputError}</p>
        )}
      </div>

      {/* Filter Tabs */}
      <TaskFilters
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        totalCount={totalCount}
        activeCount={activeCount}
        completedCount={completedCount}
      />

      {/* Task List or Empty Message */}
      <div>
        {filteredTasks.length > 0 ? (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </ul>
        ) : totalCount === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No tasks yet. Add one above to get started!
          </p>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">
            No {currentFilter} tasks.
          </p>
        )}
      </div>

      {/* Clear Completed Tasks */}
      {completedCount > 0 && (
        <div className="pt-2 text-right">
          <button
            type="button"
            onClick={handleClearCompleted}
            className="text-xs text-gray-500 hover:text-red-600 hover:underline"
          >
            Clear completed ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}
