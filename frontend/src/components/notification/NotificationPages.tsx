import type { Notification } from "@/type/notification";

interface Props {
  notifications: Notification[];
  currentUserId: string;
}

export default function NotificationPage({
  notifications,
  currentUserId,
}: Props) {
  const visibleNotifications = notifications.filter(
    (n) =>
      n.targetUserIds.length === 0 ||
      n.targetUserIds.includes(currentUserId)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Notifications
      </h2>

      {visibleNotifications.map((n) => (
        <div
          key={n.id}
          className="bg-base-100 border border-base-300 rounded-xl p-4"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              {n.title}
            </h3>
            <span className="text-xs text-base-content/60">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-base-content/70">
            {n.message}
          </p>
        </div>
      ))}
    </div>
  );
}
