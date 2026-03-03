export type NotificationPriority =
  | "low"
  | "normal"
  | "urgent";

export type Notification = {
  id: string;
  title: string;
  message: string;
  attachmentUrl?: string;
  priority: NotificationPriority;
  targetUserIds: string[]; // [] = broadcast
  createdBy: string;
  createdAt: string;
  readBy: string[]; // user IDs
};
