import { useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import TaskStatusSelect from "./TaskStatusSelect";

/* ================= TYPES ================= */

type TaskStatus = "pending" | "in-progress" | "completed";

type Task = {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
  description?: string;
};

type Role = "admin" | "manager" | "employee";

/* ================= MOCK DATA ================= */

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design dashboard UI",
    assignee: "Ankit",
    status: "completed",
    dueDate: "20 Jan 2026",
    description: "Create clean dashboard layout",
  },
  {
    id: "2",
    title: "Attendance API",
    assignee: "Rahul",
    status: "in-progress",
    dueDate: "02 Feb 2026",
  },
  {
    id: "3",
    title: "Role permissions",
    assignee: "Alex",
    status: "pending",
    dueDate: "10 Feb 2026",
  },
];
/*==================== Update task status optimistically ==================== */


/* ================= NEW TASK MODAL ================= */

function NewTaskModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-semibold mb-4">New Task</h3>

        <input
          className="input input-bordered w-full mb-3"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input input-bordered w-full mb-3"
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />

        <input
          type="date"
          className="input input-bordered w-full"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!title || !assignee || !dueDate}
            onClick={() =>
              onCreate({
                id: crypto.randomUUID(),
                title,
                assignee,
                dueDate,
                status: "pending",
              })
            }
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= TASK DRAWER ================= */

function TaskDrawer({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-full max-w-md bg-base-100 h-full p-6 border-l border-base-300">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-base-content">
            {task.title}
          </h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="text-sm text-base-content/60 mb-2">
          Assigned to <strong>{task.assignee}</strong>
        </p>

        <p className="text-sm text-base-content">
          Due: <strong>{task.dueDate}</strong>
        </p>
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function ProjectTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  // 🔹 Mock role (Week-1)
  const role: Role = "admin";

  const canEdit = role !== "employee";
  const canDelete = role === "admin";

  /* ---------- Optimistic Status Update ---------- */
  const updateTaskStatus = async (
  taskId: string,
  newStatus: TaskStatus
) => {
  // 1️⃣ Optimistic UI update
  setTasks((prev) =>
    prev.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    )
  );

  // 2️⃣ Simulate API call (remove later)
  try {
    await new Promise((res) => setTimeout(res, 400));
    // later → await api.updateTask(taskId, { status: newStatus });
  } catch (err) {
    console.error("Failed to update status", err);
    // optional rollback here
  }
};

  /* ---------- Delete ---------- */
  const deleteTask = (id: string) => {
    if (!confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedTask(null);
  };

  return (
    <>
      {/* TASK LIST */}
      <div className="bg-base-100 border border-base-300 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h3 className="font-semibold text-base-content">
            Tasks
          </h3>

          {canEdit && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowNewTask(true)}
            >
              + New Task
            </button>
          )}
        </div>

        <table className="table">
          <thead>
            <tr className="text-base-content/60">
              <th>Task</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Due</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="text-base-content hover:bg-base-200 cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <td>{task.title}</td>
                <td>{task.assignee}</td>

                {/* STATUS */}
                <td onClick={(e) => e.stopPropagation()}>
                  {canEdit ? (
                    // <select
                    //   className="select select-xs select-bordered"
                    //   value={task.status}
                    //   onChange={(e) =>
                    //     updateStatus(
                    //       task.id,
                    //       e.target.value as TaskStatus
                    //     )
                    //   }
                    // >
                    //   <option value="pending">Pending</option>
                    //   <option value="in-progress">
                    //     In Progress
                    //   </option>
                    //   <option value="completed">
                    //     Completed
                    //   </option>
                    // </select>
                    <TaskStatusSelect
                        value={task.status}
                        onChange={(s) => updateTaskStatus(task.id, s)}
                        disabled={role === "employee"}
                      />
                  ) : (
                    <StatusBadge
                      status={
                        task.status === "completed"
                          ? "approved"
                          : "pending"
                      }
                    />
                  )}
                </td>

                <td>{task.dueDate}</td>

                {/* ACTION */}
                <td
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canDelete && (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW TASK */}
      {showNewTask && (
        <NewTaskModal
          onClose={() => setShowNewTask(false)}
          onCreate={(task) => {
            setTasks((prev) => [...prev, task]);
            setShowNewTask(false);
          }}
        />
      )}

      {/* DRAWER */}
      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
