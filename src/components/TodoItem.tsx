"use client";

import React, { useState, useRef, useEffect } from "react";
import { Task } from "@/types/todo";

interface TodoItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TodoItem({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditError("");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditError("Title cannot be empty");
      return;
    }
    onEditTask(task.id, trimmed);
    setIsEditing(false);
    setEditError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(task.title);
      setEditError("");
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <li className="flex items-center justify-between gap-3 border border-gray-200 rounded p-3 bg-white">
      {/* Left section: Checkbox + Title / Edit mode */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600"
          aria-label={
            task.completed ? "Mark incomplete" : "Mark complete"
          }
        />

        {isEditing ? (
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editError) setEditError("");
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm text-black focus:border-blue-500 focus:outline-none"
                placeholder="Edit task..."
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditError("");
                }}
                className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
            {editError && (
              <p className="text-xs text-red-600">{editError}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
            <span
              onClick={() => onToggleComplete(task.id)}
              className={`cursor-pointer text-sm truncate ${
                task.completed ? "line-through text-gray-400" : "text-black"
              }`}
            >
              {task.title}
            </span>
            <span className="shrink-0 text-xs text-gray-400">{formattedDate}</span>
          </div>
        )}
      </div>

      {/* Right section: Action Buttons */}
      {!isEditing && (
        <div className="flex items-center gap-2 text-xs shrink-0">
          {isConfirmingDelete ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-red-600 font-medium">Delete?</span>
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="font-bold text-red-600 hover:underline"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
