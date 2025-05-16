export type Priority = "High" | "Medium" | "Low";
export type Status = "To Do" | "In Progress" | "Completed";

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
}
export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Completed" | "To Do" | "In Progress";
}

export interface TaskData {
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}