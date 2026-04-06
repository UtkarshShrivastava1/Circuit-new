import type { Notification } from "@/type/notification";
import { Trash2 } from "lucide-react";
import { MdAttachFile, MdEdit, MdOpenInNew } from "react-icons/md";

interface Props {
  notifications: Notification[];
  currentUserId: string;
  currentUserRole: string;
  onEdit: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export default function NotificationPage({
  notifications,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelete,
}: Props) {
  const canManage = ["admin", "owner"].includes(currentUserRole);
  const visibleNotifications = notifications.filter((n) => {
    const targets = n.targetUserIds ?? [];

    return (
      n.createdBy === currentUserId || // sender always see
      targets.length === 0 || // no target = all
      targets.includes(currentUserId) || // specific user
      n.sendTo === "all" //
    );
  });
  return (
    <div className="space-y-6">
      {visibleNotifications.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 
bg-base-100 border border-base-300 
rounded-2xl shadow-sm text-base-content/60"
        >
          <p className=" text-sm">No Notifications Yet </p>
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
        ? "border-l-4 border-error bg-error/5"
        : "border-base-300 bg-base-100"
    }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base-content">
                      {n.title}
                    </h3>
                  </div>
              <div className="flex items-center gap-2">
                  <p className="text-xs text-base-content/60 mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                    {canManage && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(n)}
                          className="text-xs px-2 py-1 rounded-lg bg-base-200 hover:bg-base-300 transition"
                        >
                        <MdEdit size={16} />
                        </button>

                        <button
                          onClick={() => onDelete(n.id)}
                          className="text-xs px-2 py-1 rounded-lg bg-error/10 text-error hover:bg-error/20 transition"
                        >
                        <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-base-content/80 mt-3 leading-relaxed">
                  {n.message}
                </p>
                {n.attachments?.length > 0 && (
                  <div className="mt-4">
                    <a
                      href={n.attachments[0].fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-base-200 border border-base-300 rounded-xl px-4 py-3 hover:bg-base-300 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-base-300 text-base-content/70">
                          <MdAttachFile size={18} />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-base-content">
                            Attachment
                          </span>
                          <span className="text-xs text-base-content/60">
                            Click to open file
                          </span>
                        </div>
                      </div>

                      <MdOpenInNew
                        size={18}
                        className="text-base-content/50 group-hover:text-base-content transition"
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
