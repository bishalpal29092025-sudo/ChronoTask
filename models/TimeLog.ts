import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITimeLog extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: string;
  startedAt: Date;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const timeLogSchema = new Schema<ITimeLog>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TimeLog: Model<ITimeLog> =
  mongoose.models.TimeLog ||
  mongoose.model<ITimeLog>("TimeLog", timeLogSchema);

export default TimeLog;