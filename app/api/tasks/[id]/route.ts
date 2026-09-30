import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
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
    const body = await request.json();
    const { title, description, status } = body;

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and description are required.",
        },
        { status: 400 }
      );
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      {
        title,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const task = await Task.findOneAndDelete({
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

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete task.",
      },
      { status: 500 }
    );
  }
}