import { useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Notification } from "@/type/notification";

interface Member {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: (notification: Notification) => void;
  members: Member[];
  currentAdminId: string;
}

export default function SendNotificationModal({
  open,
  onClose,
  onSend,
  members,
  currentAdminId,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "urgent">(
    "normal",
  );
  const [target, setTarget] = useState("all");
  if (!open) return null;
  const handleSend = () => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      title,
      message,
      priority,
      targetUserIds: target === "all" ? [] : [target],
      createdBy: currentAdminId,
      createdAt: new Date().toISOString(),
      readBy: [],
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
    };

    onSend(newNotification);
    setTitle("");
    setMessage("");
    setPriority("normal");
    setTarget("all");
    setFile(null);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-base-content/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-base-100 border-base-300 text-base-content w-full max-w-lg rounded-xl p-8 shadow-2xl border space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-base-content">
              New Notification
            </h3>
            <p className="text-sm text-base-content/60 mt-1">
              Send a message to employees
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-base-200 transition"
          >
            <MdClose size={20} className="text-base-content/60" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content">Title</label>
          <Input
            placeholder="Enter notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content">Message</label>
         <textarea
  className="w-full rounded-xl border border-base-300 bg-base-100 p-3 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            rows={4}
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        {/* Attachment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Attachment (optional)
          </label>

          {!file ? (
            <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed  rounded-xl cursor-pointertransition border-base-300 hover:border-primary text-base-content/60 text-sm ">
              Click to upload file
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between bg-base-200 border-base-300  border rounded-xl px-4 py-2 text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-base-content">{file.name}</span>
                <span className="text-xs text-base-content/60">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>

              <button
                onClick={() => setFile(null)}
                className="text-base-content/60 hover:text-error transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Priority + Target */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Send To</label>
            <Select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="all">All Employees</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <button
            disabled={!title.trim() || !message.trim()}
            onClick={handleSend}
            className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}
