"use client";

import { useEffect, useState } from "react";

import AnimatedStats from "@/components/dashboard/AnimatedStats";
import ProductivityChart from "@/components/dashboard/ProductivityChart";

type Activity = {
  id: string;
  task: string;
  startedAt: string;
  endedAt: string | null;
};

type RecentTask = {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Completed";
};

type WeeklyActivity = {
  day: string;
  seconds: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    totalTrackedSeconds: 0,
    todayTrackedSeconds: 0,
    tasksWorkedToday: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);

  const [activities, setActivities] = useState<Activity[]>([]);

  const [weeklyActivity, setWeeklyActivity] = useState<
    WeeklyActivity[]
  >([]);

  // Used to update active activity durations without calling
  // Date.now() directly during render.
  const [currentTime, setCurrentTime] = useState(() =>
    Date.now(),
  );

  /*
   * Fetch dashboard data
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/dashboard", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard.",
          );
        }

        setStats(data.stats);
        setRecentTasks(data.recentTasks);
        setActivities(data.todayActivities);
        setWeeklyActivity(data.weeklyActivity);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /*
   * Keep the current time updated every second.
   *
   * This allows active activity durations to update live
   * without calling Date.now() directly during render.
   */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-cyan-400">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Your productivity dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-zinc-400">
            See your tasks, tracked time, and daily progress in one
            place.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <AnimatedStats
          stats={stats}
          loading={loading}
        />

        {/* Productivity Chart */}
        <div className="mt-6">
          <ProductivityChart data={weeklyActivity} />
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Recent Tasks */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Your latest work.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {recentTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-500">
                    No tasks yet.
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Create a task to get started.
                  </p>
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/5"
                  >
                    <p className="font-medium text-white transition-colors group-hover:text-cyan-300">
                      {task.title}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : task.status === "In Progress"
                            ? "bg-violet-400/10 text-violet-400"
                            : "bg-amber-400/10 text-amber-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Activity */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Today&apos;s Activity
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Your recent time tracking.
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                ◷
              </div>
            </div>

            <div className="mt-6">
              {activities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-500">
                    No activity today.
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Start a timer to see your activity here.
                  </p>
                </div>
              ) : (
                <div className="relative space-y-0">
                  {activities.map((activity, index) => {
                    const started = new Date(
                      activity.startedAt,
                    );

                    const ended = activity.endedAt
                      ? new Date(activity.endedAt)
                      : null;

                    const formatTime = (date: Date) =>
                      date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                    /*
                     * Completed activities use their stored
                     * start/end timestamps.
                     *
                     * Active activities use currentTime,
                     * which is updated every second by state.
                     */
                    const durationSeconds = ended
                      ? Math.max(
                          0,
                          Math.floor(
                            (ended.getTime() -
                              started.getTime()) /
                              1000,
                          ),
                        )
                      : Math.max(
                          0,
                          Math.floor(
                            (currentTime -
                              started.getTime()) /
                              1000,
                          ),
                        );

                    const hours = Math.floor(
                      durationSeconds / 3600,
                    );

                    const minutes = Math.floor(
                      (durationSeconds % 3600) / 60,
                    );

                    const seconds = durationSeconds % 60;

                    const duration =
                      hours > 0
                        ? `${hours}h ${minutes}m`
                        : minutes > 0
                          ? `${minutes}m ${seconds}s`
                          : `${seconds}s`;

                    const isActive = !ended;

                    return (
                      <div
                        key={activity.id}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        {/* Timeline connector */}
                        {index < activities.length - 1 && (
                          <div className="absolute left-[7px] top-4 h-full w-px bg-white/10" />
                        )}

                        {/* Timeline indicator */}
                        <div className="relative z-10 mt-1">
                          <div
                            className={`h-4 w-4 rounded-full border-4 border-[#111116] ${
                              isActive
                                ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                                : "bg-zinc-600"
                            }`}
                          />
                        </div>

                        {/* Activity Card */}
                        <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {activity.task}
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                {formatTime(started)} —{" "}
                                {ended
                                  ? formatTime(ended)
                                  : "Active"}
                              </p>
                            </div>

                            {isActive && (
                              <span className="shrink-0 rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
                                Running
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-xs">
                            <span className="text-zinc-500">
                              Duration
                            </span>

                            <span
                              className={
                                isActive
                                  ? "font-medium text-cyan-400"
                                  : "font-medium text-zinc-300"
                              }
                            >
                              {duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}