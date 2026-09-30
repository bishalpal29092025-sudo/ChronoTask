import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  userId: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;