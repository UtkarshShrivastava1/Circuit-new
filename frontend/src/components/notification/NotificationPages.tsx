import type { Notification } from "@/type/notification";
import { MdAttachFile, MdOpenInNew } from "react-icons/md";

interface Props {
  notifications: Notification[];
  currentUserId: string;
}

export default function NotificationPage({
  notifications,
  currentUserId,
}: Props) {
  // const visibleNotifications = notifications.filter(
  //   (n) =>
  //     n.targetUserIds.length === 0 || n.targetUserIds.includes(currentUserId),
  // );
  const visibleNotifications = notifications.filter(
    (n) =>
      n.targetUserIds.length === 0 ||
      n.targetUserIds.includes(currentUserId) ||
      n.createdBy === currentUserId,
  );
  return (
    <div className="space-y-6">
      {visibleNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm">No Notifications Yet </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleNotifications.map((n) => {
            const isUnread = !n.readBy.includes(currentUserId);

            return (
              <div
                key={n.id}
                className={`rounded-2xl p-5 shadow-sm border transition
    ${
      n.priority === "urgent"
        ? "border-l-4 border-red-500 bg-red-50"
        : "border-gray-200 bg-white"
    }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{n.title}</h3>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {n.message}
                </p>
                {n.attachmentUrl && (
                  <div className="mt-4">
                    <a
                      href={n.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-100 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                          <MdAttachFile size={18} />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700">
                            Attachment
                          </span>
                          <span className="text-xs text-gray-500">
                            Click to open file
                          </span>
                        </div>
                      </div>

                      <MdOpenInNew
                        size={18}
                        className="text-gray-400 group-hover:text-gray-600 transition"
                      />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
