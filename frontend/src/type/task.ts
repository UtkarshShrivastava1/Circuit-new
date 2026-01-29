export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
  description?: string;
};
