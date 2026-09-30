import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
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

    const tasks = await Task.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("GET /api/tasks error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tasks.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const task = await Task.create({
      userId: session.user.id,
      title,
      description,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tasks error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task.",
      },
      { status: 500 }
    );
  }
}