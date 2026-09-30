import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
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
        { status: 401 }
      );
    }

    await connectDB();

    const activeTimer = await TimeLog.findOne({
      userId: session.user.id,
      endedAt: null,
    }).sort({ startedAt: -1 });

    if (!activeTimer) {
      return NextResponse.json({
        success: true,
        activeTimer: null,
      });
    }

    return NextResponse.json({
      success: true,
      activeTimer: {
        taskId: activeTimer.taskId.toString(),
        timeLogId: activeTimer._id.toString(),
        startedAt: activeTimer.startedAt,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/tasks/timer/active error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch active timer.",
      },
      { status: 500 }
    );
  }
}