import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import TimeLog from "@/models/TimeLog";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    const task = await Task.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found.",
        },
        { status: 404 }
      );
    }

    const activeTimer = await TimeLog.findOne({
      taskId: task._id,
      userId: session.user.id,
      endedAt: null,
    });

    if (!activeTimer) {
      return NextResponse.json(
        {
          success: false,
          message: "No active timer found for this task.",
        },
        { status: 404 }
      );
    }

    activeTimer.endedAt = new Date();

    await activeTimer.save();

    const durationMs =
      activeTimer.endedAt.getTime() -
      activeTimer.startedAt.getTime();

    const durationSeconds = Math.floor(durationMs / 1000);

    return NextResponse.json({
      success: true,
      message: "Timer stopped.",
      timeLog: activeTimer,
      durationSeconds,
    });
  } catch (error) {
    console.error(
      "POST /api/tasks/[id]/timer/stop error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to stop timer.",
      },
      { status: 500 }
    );
  }
}