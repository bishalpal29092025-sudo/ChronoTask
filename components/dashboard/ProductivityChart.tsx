"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WeeklyActivity = {
  day: string;
  seconds: number;
};

type ProductivityChartProps = {
  data: WeeklyActivity[];
};

const formatHours = (seconds: number) => {
  const hours = seconds / 3600;

  if (hours >= 1) {
    return `${hours.toFixed(1)}h`;
  }

  const minutes = Math.round(seconds / 60);

  return `${minutes}m`;
};

export default function ProductivityChart({
  data,
}: ProductivityChartProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Tracked Time
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Your productivity over the last 7 days.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">
          ↗
        </div>
      </div>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.06)"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 12,
              }}
              tickFormatter={formatHours}
            />

            <Tooltip
              cursor={{
                fill: "rgba(255,255,255,0.03)",
              }}
              contentStyle={{
                background: "#111116",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#a1a1aa",
              }}
              formatter={(value) => [
                formatHours(Number(value)),
                "Tracked",
              ]}
            />

            <Bar
              dataKey="seconds"
              fill="#22d3ee"
              radius={[6, 6, 0, 0]}
              maxBarSize={42}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}