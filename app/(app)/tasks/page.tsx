"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  createdAt: string;
  updatedAt: string;
};

type ActiveTimer = {
  taskId: string;
  startedAt: string;
  timeLogId: string;
};

const emptyForm = {
  title: "",
  description: "",
  status: "Pending" as Task["status"],
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [taskTotals, setTaskTotals] = useState<Record<string, number>>({});

  const [timerLoading, setTimerLoading] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("Pending");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // Load tasks
  // --------------------------------------------------

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/tasks");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks.");
        }

        setTasks(data.tasks);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : "Failed to load tasks.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // --------------------------------------------------
  // Load active timer
  // --------------------------------------------------

  useEffect(() => {
    const fetchActiveTimer = async () => {
      try {
        const response = await fetch("/api/tasks/timer/active");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch active timer.");
        }

        if (data.activeTimer) {
          setActiveTimer(data.activeTimer);
        }
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load active timer.",
        );
      }
    };

    fetchActiveTimer();
  }, []);

  // --------------------------------------------------
  // Load task time totals
  // --------------------------------------------------

  useEffect(() => {
    const fetchTaskTotals = async () => {
      try {
        const response = await fetch("/api/tasks/timelogs");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch time totals.");
        }

        setTaskTotals(data.totals || {});
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load time totals.",
        );
      }
    };

    fetchTaskTotals();
  }, []);

  // --------------------------------------------------
  // Live timer
  // --------------------------------------------------

  useEffect(() => {
    if (!activeTimer) {
      return;
    }

    const updateElapsedTime = () => {
      const startedAt = new Date(activeTimer.startedAt).getTime();

      const now = Date.now();

      setElapsedSeconds(Math.max(0, Math.floor((now - startedAt) / 1000)));
    };

    updateElapsedTime();

    const interval = window.setInterval(updateElapsedTime, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [activeTimer]);

  // --------------------------------------------------
  // Format timer
  // --------------------------------------------------

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  // --------------------------------------------------
  // Start timer
  // --------------------------------------------------

  const handleStartTimer = async (taskId: string) => {
    if (activeTimer) {
      setError(
        "You already have an active timer. Stop it before starting another.",
      );

      return;
    }

    try {
      setTimerLoading(true);
      setError("");

      const response = await fetch(`/api/tasks/${taskId}/timer`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start timer.");
      }

      setActiveTimer({
        taskId: data.timeLog.taskId,
        startedAt: data.timeLog.startedAt,
        timeLogId: data.timeLog._id,
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to start timer.",
      );
    } finally {
      setTimerLoading(false);
    }
  };

  // --------------------------------------------------
  // Stop timer
  // --------------------------------------------------

  const handleStopTimer = async (taskId: string) => {
    if (!activeTimer) {
      return;
    }

    const activeTaskId = activeTimer.taskId;

    try {
      setTimerLoading(true);
      setError("");

      const response = await fetch(`/api/tasks/${activeTaskId}/timer/stop`, {
        method: "POST",
      });

      const data = await response.json();

      /*
       * The timer may already have been stopped by another tab
       * or by a previous request. In that case, synchronize the
       * frontend instead of showing a confusing error.
       */
      if (response.status === 404) {
        setActiveTimer(null);
        setElapsedSeconds(0);

        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to stop timer.");
      }

      setActiveTimer(null);
      setElapsedSeconds(0);

      setTaskTotals((currentTotals) => ({
        ...currentTotals,
        [activeTaskId]:
          (currentTotals[activeTaskId] || 0) + data.durationSeconds,
      }));
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to stop timer.",
      );
    } finally {
      setTimerLoading(false);
    }
  };

  // --------------------------------------------------
  // Create task
  // --------------------------------------------------

  const handleCreateTask = async () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task.");
      }

      setTasks((currentTasks) => [data.task, ...currentTasks]);

      resetForm();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to create task.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Edit task
  // --------------------------------------------------

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((task) => task._id === taskId);

    if (!task) {
      return;
    }

    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);

    setEditingTask(task._id);
    setIsCreating(true);
    setError("");
  };

  // --------------------------------------------------
  // Update task
  // --------------------------------------------------

  const handleUpdateTask = async () => {
    if (!editingTask) {
      return;
    }

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/tasks/${editingTask}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task.");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingTask ? data.task : task,
        ),
      );

      resetForm();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to update task.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Delete task
  // --------------------------------------------------

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    if (activeTimer?.taskId === taskId) {
      setError("Stop the active timer before deleting this task.");

      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task.");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId),
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Failed to delete task.",
      );
    }
  };

  // --------------------------------------------------
  // Open create form
  // --------------------------------------------------

  const handleOpenCreateForm = () => {
    setEditingTask(null);

    setTitle(emptyForm.title);
    setDescription(emptyForm.description);
    setStatus(emptyForm.status);

    setError("");
    setIsCreating(true);
  };

  // --------------------------------------------------
  // Reset form
  // --------------------------------------------------

  const resetForm = () => {
    setIsCreating(false);
    setEditingTask(null);

    setTitle("");
    setDescription("");
    setStatus("Pending");

    setError("");
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <section className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div>
          <p className="text-sm font-medium text-cyan-400">Workspace</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Manage your work and keep your productivity moving.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
            >
              + Create Task
            </button>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create / Edit Form */}

        {isCreating && (
          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">
              {editingTask ? "Edit task" : "Create a new task"}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {editingTask
                ? "Update the details of your task."
                : "Add a task to your workspace."}
            </p>

            <div className="mt-6 space-y-5">
              {/* Title */}

              <div>
                <label className="text-sm font-medium text-zinc-300">
                  Task title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Build authentication"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/50"
                />
              </div>

              {/* Description */}

              <div>
                <label className="text-sm font-medium text-zinc-300">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setError("");
                  }}
                  placeholder="Describe what needs to be done..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-400/50"
                />
              </div>

              {/* Status */}

              <div>
                <label className="text-sm font-medium text-zinc-300">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as Task["status"]);

                    setError("");
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                >
                  <option value="Pending">Pending</option>

                  <option value="In Progress">In Progress</option>

                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Form Buttons */}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  disabled={saving}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingTask
                      ? "Save Changes"
                      : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-zinc-400">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
              <h2 className="text-lg font-semibold text-white">No tasks yet</h2>

              <p className="mt-2 text-sm text-zinc-500">
                Create your first task to get started.
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const isTimerActive = activeTimer?.taskId === task._id;

              const anotherTimerActive =
                activeTimer && activeTimer.taskId !== task._id;

              return (
                <div
                  key={task._id}
                  className={`rounded-2xl border p-6 transition-all ${
                    isTimerActive
                      ? "border-cyan-400/30 bg-cyan-400/[0.04] shadow-[0_0_30px_rgba(34,211,238,0.06)]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex flex-col gap-5">
                    {/* Task information */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-white">
                          {task.title}
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          {task.description}
                        </p>
                      </div>

                      <span className="w-fit shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                        {task.status}
                      </span>
                    </div>

                    {/* Timer */}

                    <div
                      className={`flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                        isTimerActive
                          ? "border-cyan-400/20 bg-cyan-400/5"
                          : "border-white/10 bg-black/10"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                          Time tracked
                        </p>

                        <div className="mt-1 flex items-center gap-3">
                          <span
                            className={`text-2xl font-semibold tabular-nums ${
                              isTimerActive ? "text-cyan-400" : "text-white"
                            }`}
                          >
                            {formatDuration(
                              (taskTotals[task._id] || 0) +
                                (isTimerActive ? elapsedSeconds : 0),
                            )}
                          </span>

                          {isTimerActive && (
                            <span className="flex items-center gap-2 text-xs text-cyan-400">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                              Tracking
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Timer button */}

                      {isTimerActive ? (
                        <button
                          type="button"
                          onClick={() => handleStopTimer(task._id)}
                          disabled={timerLoading}
                          className="rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {timerLoading ? "Stopping..." : "■ Stop Timer"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartTimer(task._id)}
                          disabled={timerLoading || Boolean(anotherTimerActive)}
                          className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {timerLoading
                            ? "Starting..."
                            : anotherTimerActive
                              ? "Another Timer Running"
                              : "▶ Start Timer"}
                        </button>
                      )}
                    </div>

                    {/* Task actions */}

                    <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => handleEditTask(task._id)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={isTimerActive}
                        className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
