"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Task Management",
    description:
      "Create, organize, update, and complete your work from one focused workspace.",
    icon: "✓",
  },
  {
    number: "02",
    title: "Time Tracking",
    description:
      "Track exactly how much time you spend on each task with persistent timers.",
    icon: "◷",
  },
  {
    number: "03",
    title: "Productivity Insights",
    description:
      "Understand your work patterns through daily activity and weekly productivity data.",
    icon: "↗",
  },
];

const stats = [
  { value: "100%", label: "Your data" },
  { value: "24/7", label: "Time tracking" },
  { value: "1", label: "Focused workspace" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[150px]" />

        <div className="absolute left-[-200px] top-[45%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[150px]" />

        <div className="absolute right-[-200px] top-[65%] h-[500px] w-[500px] rounded-full bg-cyan-400/5 blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 transition-transform duration-300 group-hover:scale-105">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Chrono<span className="text-cyan-400">Task</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_28px_rgba(34,211,238,0.2)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pb-20 pt-24 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                Your time. Your tasks. One workspace.
              </div>

              <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-7xl">
                Turn your time
                <br />
                into{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  progress.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
                Manage your tasks, track where your time goes, and
                understand your productivity — all from one focused
                workspace.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]"
                >
                  Start tracking
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                {[
                  "Persistent time tracking",
                  "Personal productivity data",
                  "Simple focused workflow",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-zinc-500"
                  >
                    <span className="text-emerald-400">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product preview */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[40px] bg-cyan-400/5 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111116] shadow-2xl shadow-black/50">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  </div>

                  <span className="text-[10px] text-zinc-600">
                    CHRONOTASK
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                        Overview
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        Good afternoon
                      </p>
                    </div>

                    <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-right">
                      <p className="text-[9px] text-zinc-500">
                        TRACKED TODAY
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-cyan-400">
                        4h 32m
                      </p>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[
                      ["12", "Tasks"],
                      ["7", "Completed"],
                      ["4", "In progress"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <p className="text-lg font-semibold">
                          {value}
                        </p>
                        <p className="mt-1 text-[9px] text-zinc-500">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium">
                          Tracked Time
                        </p>
                        <p className="mt-1 text-[9px] text-zinc-600">
                          Last 7 days
                        </p>
                      </div>

                      <span className="text-[9px] text-cyan-400">
                        +18%
                      </span>
                    </div>

                    <div className="mt-5 flex h-28 items-end justify-between gap-2">
                      {[38, 58, 44, 76, 55, 88, 68].map(
                        (height, index) => (
                          <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{
                              duration: 0.7,
                              delay: 0.35 + index * 0.06,
                            }}
                            className={`w-full rounded-t-md ${
                              index === 5
                                ? "bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.18)]"
                                : "bg-cyan-400/20"
                            }`}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  {/* Current task */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                        ◷
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">
                          Build ChronoTask
                        </p>
                        <p className="mt-1 text-[9px] text-zinc-500">
                          Currently tracking
                        </p>
                      </div>
                    </div>

                    <span className="ml-3 shrink-0 text-xs font-semibold text-cyan-400">
                      01:42:18
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/5 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="px-6 py-8 text-center"
            >
              <p className="text-2xl font-semibold text-white">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-cyan-400">
              Everything in one place
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Focus on the work.
              <br />
              <span className="text-zinc-500">
                ChronoTask handles the tracking.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              A simple workflow for people who want to understand
              their work instead of just checking tasks off a list.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-cyan-400/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    {feature.icon}
                  </div>

                  <span className="text-xs text-zinc-600">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24 md:px-8 md:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-violet-500/10 p-8 text-center md:p-14"
        >
          <p className="text-sm font-medium text-cyan-400">
            Start today
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            Know where your time goes.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
            Create your workspace, start a task, and let ChronoTask
            turn your work into measurable progress.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_35px_rgba(34,211,238,0.22)]"
          >
            Create your account
            <span>→</span>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />

            <span className="text-sm font-medium">
              Chrono<span className="text-cyan-400">Task</span>
            </span>
          </div>

          <p className="text-xs text-zinc-600">
            Manage tasks. Track time. Understand your work.
          </p>

          <div className="flex items-center gap-5 text-xs text-zinc-500">
            <Link
              href="/login"
              className="transition-colors hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="transition-colors hover:text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}