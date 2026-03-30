import { useEffect, useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import TaskStatusSelect from "./TaskStatusSelect";
import Pagination from "../ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import NewTaskModal from "./NewTaskModal";
import Swal from "sweetalert2";

import API from "@/api/axios";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";

/* ================= TYPES ================= */

type TaskStatus = "pending" | "in-progress" | "completed";
type Subtask = {
  _id?: string;
  title: string;
  completed: boolean;
};
type Task = {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  dueDate: string;
  description?: string;
  createdAt?: string;
  priority?: string;
  tags: string[];
  attachments: string[];
  subtasks?: Subtask[];
  isEditing?: boolean;
};

type Role = "admin" | "manager" | "employee" | "owner";

interface Props {
  projectId: string;
}

/* ================= TASK DRAWER ================= */

function TaskDrawer({
  projectId,
  task,
  onClose,
  onToggleSubtask,
  canEditTask,
}: {
  projectId: string;
  canEditTask: boolean;
  task: Task;
  onClose: () => void;
  onToggleSubtask: (
    taskId: string,
    subtaskId: string,
    completed: boolean,
  ) => Promise<void>;
}) {
  const { auth } = useAuth();
  const [isEditing, setIsEditing] = useState(task.isEditing || false);
  const [editedTask, setEditedTask] = useState(task);
  const [newSubtask, setNewSubtask] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    setEditedTask((prev) => ({
      ...prev,
      subtasks: [
        ...(prev.subtasks || []),
        {
          title: newSubtask,
          completed: false,
        },
      ],
    }));

    setNewSubtask("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append("title", editedTask.title);
      formData.append("description", editedTask.description || "");
      formData.append("priority", editedTask.priority || "medium");
      formData.append("status", editedTask.status);
      formData.append("dueDate", editedTask.dueDate);

      formData.append("subtasks", JSON.stringify(editedTask.subtasks || []));

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      await API.put(
        `/tasks/${auth.slug}/updateTask/${projectId}/${task.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Task Updated Successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error updating task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-base-content/30 backdrop-blur-sm flex justify-end z-50">
      <div className="w-full max-w-md bg-base-100 h-full p-6 border-l border-base-300 overflow-y-auto">
        <div className="flex justify-between mb-4">
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* TITLE */}
        {/* <input
          className="input input-bordered w-full mb-3"
          value={editedTask.title}
          disabled={!isEditing}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
        /> */}
        {isEditing ? (
          <input
            className="input input-bordered w-full mb-3"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
          />
        ) : (
          <p className="text-lg font-semibold mb-3">{task.title}</p>
        )}
        {isEditing ? (
          <input
            type="date"
            className="input input-bordered w-full"
            value={editedTask.dueDate?.split("T")[0]}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
          />
        ) : (
          <p className="mb-3">
            Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}
          </p>
        )}
        {/* DESCRIPTION */}
        {isEditing ? (
          <textarea
            className="textarea textarea-bordered w-full mb-3"
            placeholder="Description"
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
        ) : (
          <div className="mb-3">
            <p className="text-sm text-base-content/60">Description</p>
            <p>{task.description || "No description"}</p>
          </div>
        )}

        {/* PRIORITY */}
        {isEditing ? (
          <select
            className="select select-bordered w-full mb-3"
            value={editedTask.priority}
            onChange={(e) =>
              setEditedTask({ ...editedTask, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        ) : (
          <div className="mb-3">
            <p className="text-sm text-base-content/60">Priority</p>
            <p className="capitalize">{task.priority}</p>
          </div>
        )}
        {/* SUBTASKS */}
        <div className="mb-4">
          <p className="font-medium mb-2">Subtasks</p>

          {editedTask.subtasks?.map((sub, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              {/* Checkbox should work for everyone */}
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => {
                  onToggleSubtask(task.id, sub._id, sub.completed);

                  const updated = [...(editedTask.subtasks || [])];
                  updated[index].completed = !sub.completed;

                  setEditedTask({
                    ...editedTask,
                    subtasks: updated,
                  });
                }}
              />

              {/* Only editable for admins/managers */}
              {isEditing ? (
                <input
                  className="input input-bordered input-sm w-full"
                  value={sub.title}
                  onChange={(e) => {
                    const updated = [...(editedTask.subtasks || [])];
                    updated[index].title = e.target.value;
                    setEditedTask({ ...editedTask, subtasks: updated });
                  }}
                />
              ) : (
                <span
                  className={
                    sub.completed ? "line-through text-base-content/50" : ""
                  }
                >
                  {sub.title}
                </span>
              )}
            </div>
          ))}

          {/* ADD SUBTASK */}
          {isEditing && (
            <div className="flex gap-2 mt-2">
              <input
                className="input input-bordered input-sm w-full"
                placeholder="New subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAddSubtask}
              >
                Add
              </button>
            </div>
          )}
        </div>
        {/* ATTACHMENTS */}

        <div className="mb-4">
          <p className="font-medium mb-2">Attachments</p>

          {/* View Mode */}
          {!isEditing &&
            task.attachments?.map((file, i) => (
              <a
                key={i}
                href={file}
                target="_blank"
                className="link link-primary block"
              >
                View Attachment
              </a>
            ))}

          {/* Edit Mode */}
          {isEditing && (
            <>
              <input
                type="file"
                multiple
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />

              {files.length > 0 && (
                <div className="text-sm mt-2">
                  {files.map((file, i) => (
                    <p key={i}>{file.name}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* SAVE BUTTON */}
        {isEditing && (
          <button
            className="btn btn-primary w-full mt-4"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function ProjectTasks({ projectId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  const { auth } = useAuth();

  const canEditTask = ["admin", "owner", "manager"].includes(auth.user?.role);

  const canDelete = ["admin", "owner"].includes(auth.user?.role);

  /* ================= FETCH TASKS ================= */

  const toggleSubtask = async (
    taskId: string,
    subtaskId: string,
    completed: boolean,
  ) => {
    try {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks?.map((sub) =>
                  sub._id === subtaskId
                    ? { ...sub, completed: !completed }
                    : sub,
                ),
              }
            : task,
        ),
      );

      setSelectedTask((prev) => {
        if (!prev || prev.id !== taskId) return prev;

        return {
          ...prev,
          subtasks: prev.subtasks?.map((sub) =>
            sub._id === subtaskId ? { ...sub, completed: !completed } : sub,
          ),
        };
      });

      await API.patch(
        `/tasks/${auth.slug}/updateSubtaskStatus/${projectId}/${taskId}/${subtaskId}`,
      );
    } catch (error) {
      console.error("Subtask update failed", error);
    }
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get(`/tasks/${auth.slug}/getTasks/${projectId}`);
        console.log("Fetched tasks:", res.data.data); // Debug log

        const formattedTasks = res.data.data.map((t: any) => ({
          id: t._id,
          title: t.title,
          assignee: t.assignedTo?.[0]?.name || "Unassigned",
          status: t.status.toLowerCase(),
          dueDate: t.dueDate,
          description: t.description,
          createdAt: new Date(t.createdAt).toLocaleDateString("en-GB"),
          priority: t.priority,
          tags: t.tag || [],
          attachments: t.attachments || [],
          subtasks: t.subtasks || [],
        }));

        setTasks(formattedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    if (auth.slug && projectId) {
      fetchTasks();
    }
  }, [auth.slug, projectId]);

  /* ---------- Optimistic Status Update ---------- */

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await API.patch(
        `/tasks/${auth.slug}/updateTaskStatus/${projectId}/${taskId}`,
        { status: newStatus },
      );
    } catch (err) {
      console.error("Status update failed", err);
      setTasks(previousTasks);
    }
  };

  /* ---------- Delete ---------- */
  const deleteTask = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      const { data } = await API.delete(
        `/tasks/${auth.slug}/deleteTask/${projectId}/${id}`,
      );

      if (data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setSelectedTask(null);
      }
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  /* ---------- Pagination ---------- */

  const { page, setPage, totalPages, paginatedData } = usePagination(tasks, 5);

  return (
    <>
      {/* TASK LIST */}
      <div className="bg-base-200 border border-base-content/10 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-base-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h3 className="font-semibold text-base-content">Tasks</h3>

          {canEditTask && (
            <button
              className="btn btn-sm btn-primary w-full sm:w-auto"
              onClick={() => setShowNewTask(true)}
            >
              + New Task
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="py-16 text-center text-base-content/60">
            No Tasks Found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table min-w-[600px]">
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
                {paginatedData.map((task) => (
                  <tr
                    key={task.id}
                    className="text-base-content hover:bg-base-300 cursor-pointer"
                    onClick={() =>
                      setSelectedTask({ ...task, isEditing: false })
                    }
                  >
                    <td>{task.title}</td>
                    <td>{task.assignee}</td>

                    <td onClick={(e) => e.stopPropagation()}>
                      {canEditTask ? (
                        <TaskStatusSelect
                          value={task.status}
                          onChange={(s) => updateTaskStatus(task.id, s)}
                          disabled={auth.user?.role === "employee"}
                        />
                      ) : (
                        <StatusBadge
                          status={
                            task.status === "completed" ? "approved" : "pending"
                          }
                        />
                      )}
                    </td>

                    <td>
                      {new Date(task.dueDate).toLocaleDateString("en-GB")}
                    </td>

                    <td
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canEditTask && (
                        <button
                          className="btn btn-xs btn-outline m-1.5"
                          onClick={() =>
                            setSelectedTask({
                              ...task,
                              isEditing: true,
                            })
                          }
                        >
                          Edit
                        </button>
                      )}

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
        )}

        <div className="flex justify-center sm:justify-end p-4 border-t border-base-300">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* NEW TASK */}
      {showNewTask && (
        <NewTaskModal
          projectId={projectId}
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
          projectId={projectId}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleSubtask={toggleSubtask}
          canEditTask={canEditTask}
        />
      )}
    </>
  );
}
