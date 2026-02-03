import { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import DateField from "../ui/DateField";
import TagsInput from "../ui/TagsInput";
import AssigneeSelect from "../ui/AssigneeSelect";
import AttachmentInput from "../ui/AttachmentInput";
import type { Tag } from "../../type/tag";

/* ================= TYPES ================= */

type TaskStatus = "pending" | "in-progress" | "completed";
type Priority = "low" | "medium" | "high";

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority?: Priority;
  tags?: Tag[];
};

interface Props {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

type User = {
  id: string;
  name: string;
};

const ASSIGNEES: User[] = [
  { id: "1", name: "Alex Kumar" },
  { id: "2", name: "Rahul Sharma" },
  { id: "3", name: "Ankit Verma" },
  { id: "4", name: "Neha Singh" },
];

/* ================= COMPONENT ================= */

export default function NewTaskModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<User | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState<Tag[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

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
            className="text-2xl font-semibold border-0 px-0 bg-transparent focus:outline-none"
          />

          {/* META SECTION */}
          <div className="space-y-4">

            {/* ROW 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AssigneeSelect
                users={ASSIGNEES}
                value={assignee ?? undefined}
                onChange={setAssignee}
              />

              <DateField
                value={dueDate}
                onChange={setDueDate}
              />
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Priority)
                }
              >
                <option value="low">🟢 Low priority</option>
                <option value="medium">🟡 Medium priority</option>
                <option value="high">🔴 High priority</option>
              </Select>

              <TagsInput
                value={tags}
                onChange={setTags}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows={3}
            placeholder="Add description (optional)"
            className="textarea textarea-bordered w-full resize-none"
          />

          {/* ATTACHMENTS */}
          <div>
            <h4 className="text-sm font-medium text-base-content/70 mb-2">
              Attachments
            </h4>

            <AttachmentInput
              files={attachments}
              onChange={setAttachments}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-base-300 bg-base-200/40 rounded-b-2xl">
          <button className="btn btn-ghost btn-sm">
            Templates
          </button>

          <button
            className="btn btn-primary"
            disabled={!title || !assignee || !dueDate}
            onClick={() =>
              onCreate({
                id: crypto.randomUUID(),
                title,
                assignee: assignee!.name,
                dueDate,
                status: "pending",
                priority,
                tags,
              })
            }
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
