export type ProjectStatus = "active" | "completed" | "on-hold";
export type ProjectFilter = "all" | ProjectStatus;

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number; // 0–100
  manager: string;
  teamCount: number;
  dueDate: string;
};
