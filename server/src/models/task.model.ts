import mongoose, { Document, Schema } from "mongoose";


interface ITask extends Document {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Completed";
  userId: mongoose.Schema.Types.ObjectId; 
  dueDate?: Date; 
}

const taskSchema: Schema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      required: true,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    status: {
      type: String,
      required: true,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
