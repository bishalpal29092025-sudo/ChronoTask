import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import TimeLog from "@/models/TimeLog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    await connectDB();

    const userId = session.user.id;

    const tasks = await Task.find({
      userId,
    });

    const timeLogs = await TimeLog.find({
      userId,
    }).sort({ startedAt: -1 });

    const recentTasks = tasks
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map((task) => ({
        id: task._id.toString(),
        title: task.title,
        status: task.status,
      }));

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed",
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress",
    ).length;

    const pendingTasks = tasks.filter(
      (task) => task.status === "Pending",
    ).length;

    const totalTrackedSeconds = timeLogs.reduce((total, timeLog) => {
      if (!timeLog.endedAt) {
        return total;
      }

      const duration = Math.floor(
        (timeLog.endedAt.getTime() - timeLog.startedAt.getTime()) / 1000,
      );

      return total + Math.max(0, duration);
    }, 0);

    const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const seconds = timeLogs.reduce((total, timeLog) => {
        if (!timeLog.endedAt) {
          return total;
        }

        if (timeLog.startedAt >= date && timeLog.startedAt < nextDate) {
          const duration = Math.floor(
            (timeLog.endedAt.getTime() - timeLog.startedAt.getTime()) / 1000,
          );

          return total + Math.max(0, duration);
        }

        return total;
      }, 0);

      return {
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        seconds,
      };
    });

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayTimeLogs = timeLogs.filter(
      (timeLog) =>
        timeLog.startedAt >= startOfDay && timeLog.startedAt <= endOfDay,
    );

    const todayTrackedSeconds = todayTimeLogs.reduce((total, timeLog) => {
      if (!timeLog.endedAt) {
        return total;
      }

      const duration = Math.floor(
        (timeLog.endedAt.getTime() - timeLog.startedAt.getTime()) / 1000,
      );

      return total + Math.max(0, duration);
    }, 0);

    const tasksWorkedToday = new Set(
      todayTimeLogs.map((timeLog) => timeLog.taskId.toString()),
    ).size;

    const todayActivities = todayTimeLogs.map((timeLog) => {
      const task = tasks.find(
        (item) => item._id.toString() === timeLog.taskId.toString(),
      );

      return {
        id: timeLog._id.toString(),
        task: task?.title || "Unknown task",
        startedAt: timeLog.startedAt,
        endedAt: timeLog.endedAt,
      };
    });

    return NextResponse.json({
      success: true,

      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        totalTrackedSeconds,
        todayTrackedSeconds,
        tasksWorkedToday,
      },

      recentTasks,
      todayActivities,
      weeklyActivity,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics.",
      },
      { status: 500 },
    );
  }
}
