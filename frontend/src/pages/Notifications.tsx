

import { useState } from "react";
import type { Notification } from "@/type/notification";

import NotificationPage from "@/components/notification/NotificationPages";
import SendNotificationModal from "@/components/notification/SendNotificationModal";

import { MdSend, MdNotificationsNone } from "react-icons/md";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const currentUserId = "2";
  const currentUserRole = "admin";

  const members = [
    { id: "1", name: "Admin User" },
    { id: "2", name: "Rahul Sharma" },
    { id: "3", name: "Neha Singh" },
  ];

  const handleSend = (newNotification: Notification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <div className="p-4 sm:p-6 text-base-content">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Notifications
          </h1>

          {currentUserRole === "admin" && (
            <button
              className="flex items-center justify-center gap-2 px-4 py-2.5
              rounded-xl bg-primary text-primary-content
              text-sm font-medium hover:bg-primary/90
              transition shadow-sm w-full sm:w-auto"
              onClick={() => setOpen(true)}
            >
              <MdSend size={18} />
              Send Notification
            </button>
          )}
        </div>

        {/* Notification Content */}
        {notifications.length === 0 ? (
          <div className="border border-base-300 rounded-2xl p-10 text-center bg-base-100 shadow-sm">
            
            <div className="flex justify-center mb-4">
              <MdNotificationsNone size={42} className="text-base-content/40" />
            </div>

            <h2 className="text-lg font-medium mb-1">
              No Notifications Yet
            </h2>

            <p className="text-sm text-base-content/60">
              Notifications you receive will appear here.
            </p>
          </div>
        ) : (
          <NotificationPage
            notifications={notifications}
            currentUserId={currentUserId}
          />
        )}

        {/* Modal */}
        {currentUserRole === "admin" && (
          <SendNotificationModal
            open={open}
            onClose={() => setOpen(false)}
            onSend={handleSend}
            members={members}
            currentAdminId={currentUserId}
          />
        )}
      </div>
    </div>
  );
}