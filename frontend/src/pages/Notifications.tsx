import { useState } from "react";

import type { Notification } from "@/type/notification";

import NotificationPage from "@/components/notification/NotificationPages";
import SendNotificationModal from "@/components/notification/SendNotificationModal";
import {  MdSend } from "react-icons/md";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const currentUserId = "2";      // logged in user
  const currentUserRole = "admin"; 
// const currentUserRole = "employee"; 
  const members = [
    { id: "1", name: "Admin User" },
    { id: "2", name: "Rahul Sharma" },
    { id: "3", name: "Neha Singh" },
  ];

  const handleSend = (newNotification: Notification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 text-base-content">

      <div className="flex justify-between items-center">
       
<h1 className="text-2xl font-semibold text-base-content">Notifications</h1>
        {currentUserRole === "admin" && (
          <button
            className="flex items-center gap-2 px-4 py-2.5
rounded-xl bg-primary text-primary-content
text-sm font-medium hover:bg-primary/90
transition shadow-sm"
            onClick={() => setOpen(true)}
          >
             <MdSend size={18} />
            Send Notification
          </button>
        )}
      </div>

      <NotificationPage
        notifications={notifications}
        currentUserId={currentUserId}
      />

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
  );
}