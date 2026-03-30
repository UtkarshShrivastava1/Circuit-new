import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DateField from "../ui/DateField";
import TagsInput from "../ui/TagsInput";
import AssigneeSelect from "../ui/AssigneeSelect";
import AttachmentInput from "../ui/AttachmentInput";
import Checklist from "../ui/CheckList";
import type { Tag } from "../../type/tag";

import { useAuth } from "@/auth/AuthContext";
import API from "@/api/axios";

/* ================= TYPES ================= */

type TaskStatus = "pending" | "in-progress" | "completed";
type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority?: Priority;
  tags?: Tag[];
  attachments?: File[];
  checklist?: { id: string; text: string; completed: boolean }[];
};

interface Props {
  onClose: () => void;
  onCreate: (task: Task) => void;
  projectId: string; // NEW
}

type User = {
  id: string;
  name: string;
};

/* ================= COMPONENT ================= */

export default function NewTaskModal({ onClose, onCreate, projectId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<User | null>(null);
  const [assignees, setAssignees] = useState<User[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState<Tag[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [checklist, setChecklist] = useState<
    { id: string; text: string; completed: boolean }[]
  >([]);
  const [creating, setCreating] = useState(false);

  const { auth } = useAuth();
  const handleCreateTask = async () => {
    try {
      setCreating(true);
      const formData = new FormData();
      const cleanedSubtasks = checklist
        .filter((item) => item.text.trim() !== "")
        .map((item) => ({
          title: item.text,
          completed: item.completed,
        }));
      console.log("FINAL TAGS:", tags);
      const cleanedTags = tags.map((t) => t.label);
      formData.append("tag", JSON.stringify(cleanedTags));
      formData.append("subtasks", JSON.stringify(cleanedSubtasks));

      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("status", "pending");
      formData.append("assignedTo", assignee?.id || "");
      formData.append("dueDate", dueDate);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const { data } = await API.post(
        `/tasks/${auth.slug}/addTasks/${projectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.success) {
        const t = data.data;

        onCreate({
          id: t._id,
          title: t.title,
          description: t.description,
          assignee: t.assignedTo?.name || "Unassigned",
          dueDate: new Date(t.dueDate).toLocaleDateString(),
          status: "pending",
          priority: t.priority,
          tags,
          attachments,
          checklist,
        });

        onClose();
      }
    } catch (error) {
      console.error("Task create error", error);
    } finally {
      setCreating(false);
    }
  };
  /* FETCH PARTICIPANTS */
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data } = await API.get(
          `/projects/${auth.slug}/getProjectParticipants/${projectId}`,
        );

        if (data.success) {
          setAssignees(data.participants);
        }
      } catch (error) {
        console.error("Error fetching participants", error);
      }
    };

    fetchParticipants();
  }, [projectId, auth.slug]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl border border-base-300">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <span className="badge badge-outline text-xs">TASK</span>
            <span className="text-sm text-base-content/60">
              Attendance Management
            </span>
          </div>

          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* TITLE */}
          <Input
            autoFocus
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold border-0 px-0 bg-transparent"
          />

          {/* META */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AssigneeSelect
                users={assignees} // UPDATED
                value={assignee ?? undefined}
                onChange={setAssignee}
              />

              <DateField value={dueDate} onChange={setDueDate} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value="low">🟢 Low priority</option>
                <option value="medium">🟡 Medium priority</option>
                <option value="high">🔴 High priority</option>
              </Select>

              <TagsInput value={tags} onChange={setTags} />
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows={3}
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full resize-none"
          />

          {/* ATTACHMENTS */}
          <AttachmentInput files={attachments} onChange={setAttachments} />

          {/* CHECKLIST */}
          <Checklist value={checklist} onChange={setChecklist} />
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-300 bg-base-200/40 rounded-b-2xl">
          <button className="btn btn-ghost btn-sm">Templates</button>

          <button
            className="btn btn-primary"
            disabled={!title || !assignee || !dueDate || creating}
            onClick={handleCreateTask}
          >
            {creating ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
