import { MdClose, MdPerson, MdCalendarToday, MdFlag } from "react-icons/md";
import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import EditTaskModal from "./EditTaskModel";
import type { Task } from "../../type/task";

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskDrawer({
  task,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (!task) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* DRAWER */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-base-100 z-50 
                      border-l border-base-300 shadow-xl flex flex-col text-base-content">

        {/* HEADER */}
        <div className="flex items-start justify-between p-5 border-b border-base-300">
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge
                status={task.status === "completed" ? "approved" : "pending"}
              />
              <span className="text-xs text-base-content/60">
                Created on {task.createdAt}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <MdClose size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* DESCRIPTION */}
          <div>
            <p className="text-xs font-medium text-base-content/60 mb-1">
              Description
            </p>
            <p className="text-sm">
              {task.description || "No description provided"}
            </p>
          </div>

          {/* META */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-base-200 rounded-lg p-3 flex items-center gap-2">
              <MdPerson />
              <span className="text-sm">{task.assignee}</span>
            </div>

            <div className="bg-base-200 rounded-lg p-3 flex items-center gap-2">
              <MdCalendarToday />
              <span className="text-sm">{task.dueDate}</span>
            </div>

            <div className="bg-base-200 rounded-lg p-3 col-span-2 flex items-center gap-2">
              <MdFlag />
              <span className="text-sm capitalize">
                Priority: {task.priority}
              </span>
            </div>
          </div>

          {/* TAGS */}
          {task.tags?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-base-content/60 mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="badge badge-outline text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-base-300 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setEditingTask(task)}
          >
            Edit
          </Button>

          <Button
            variant="error"
            className="flex-1"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditTaskModal
        open={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(updatedTask) => {
          onUpdate(updatedTask);
          setEditingTask(null);
        }}
      />
    </>
  );
}
