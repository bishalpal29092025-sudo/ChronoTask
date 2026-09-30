"use client";

import { motion } from "framer-motion";

type DashboardStats = {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalTrackedSeconds: number;
  todayTrackedSeconds: number;
  tasksWorkedToday: number;
};

type AnimatedStatsProps = {
  stats: DashboardStats;
  loading: boolean;
};

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

export default function AnimatedStats({
  stats,
  loading,
}: AnimatedStatsProps) {
  const cards = [
    {
      label: "Total Tasks",
      value: stats.totalTasks.toString(),
      description: "All your tasks",
      valueClass: "text-white",
      icon: "✓",
      iconClass: "bg-cyan-400/10 text-cyan-400",
    },
    {
      label: "Completed",
      value: stats.completedTasks.toString(),
      description: "Finished tasks",
      valueClass: "text-emerald-400",
      icon: "✓",
      iconClass: "bg-emerald-400/10 text-emerald-400",
    },
    {
      label: "Tracked Today",
      value: formatDuration(stats.todayTrackedSeconds),
      description: "Time tracked today",
      valueClass: "text-cyan-400",
      icon: "◷",
      iconClass: "bg-cyan-400/10 text-cyan-400",
    },
    {
      label: "In Progress",
      value: stats.inProgressTasks.toString(),
      description: "Active tasks",
      valueClass: "text-violet-400",
      icon: "→",
      iconClass: "bg-violet-400/10 text-violet-400",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
          }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold ${card.iconClass}`}
            >
              {card.icon}
            </div>

            <span className="text-xs text-zinc-600">
              {card.label}
            </span>
          </div>

          <p
            className={`text-3xl font-semibold ${
              loading
                ? "animate-pulse text-zinc-600"
                : card.valueClass
            }`}
          >
            {loading ? "—" : card.value}
          </p>

          <p className="mt-2 text-xs text-zinc-500">
            {card.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}