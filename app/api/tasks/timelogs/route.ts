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

    const timeLogs = await TimeLog.find({
      userId: session.user.id,
    }).sort({ startedAt: -1 });

    const totals = timeLogs.reduce<
      Record<string, number>
    >((accumulator, timeLog) => {
      if (!timeLog.endedAt) {
        return accumulator;
      }

      const durationSeconds = Math.max(
        0,
        Math.floor(
          (timeLog.endedAt.getTime() -
            timeLog.startedAt.getTime()) /
            1000
        )
      );

      const taskId = timeLog.taskId.toString();

      accumulator[taskId] =
        (accumulator[taskId] || 0) + durationSeconds;

      return accumulator;
    }, {});

    return NextResponse.json({
      success: true,
      totals,
    });
  } catch (error) {
    console.error(
      "GET /api/tasks/timelogs error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate time totals.",
      },
      { status: 500 }
    );
  }
}