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
      userId: session.user.id,
      endedAt: null,
    });

    if (activeTimer) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have an active timer.",
          timeLog: activeTimer,
        },
        { status: 409 }
      );
    }

    const timeLog = await TimeLog.create({
      taskId: task._id,
      userId: session.user.id,
      startedAt: new Date(),
      endedAt: null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Timer started.",
        timeLog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tasks/[id]/timer error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to start timer.",
      },
      { status: 500 }
    );
  }
}