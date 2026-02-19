import { useEffect, useState,useMemo } from "react";
import Button from "@/components/ui/Button";
import {
  MdViewList,
  MdDashboard,
  MdAssignment,
  MdHourglassEmpty,
  MdAutorenew,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";

import StatCard from "@/components/ui/StatCard";
import TaskTable from "@/components/task/TaskTable";
import TaskKanban from "@/components/task/TaskKanbanComponent";
import TaskDrawer from "@/components/task/TaskDrawer";
import TaskFilters from "@/components/task/TaskFilter";
import type { Task } from "@/type/task";
import TaskModal from "@/components/task/TaskModal";

/* ---------------- TYPES ---------------- */

type TaskView = "table" | "kanban";
type TaskFilter =
  | "all"
  | "this-week"
  | "high-priority"
  | "overdue";

/* ---------------- MOCK DATA ---------------- */

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Design dashboard UI",
    description:
      "Create a clean, responsive dashboard UI using Tailwind and DaisyUI.",
    assignee: "Ankit",
    status: "completed",
    priority: "high",
    dueDate: "2026-01-20",
    createdAt: "2026-01-10",
    tags: ["UI", "Dashboard"],
  },
  {
    id: "2",
    title: "Attendance API",
    description:
      "Build REST APIs for marking attendance and admin approvals.",
    assignee: "Rahul",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-02-02",
    createdAt: "2026-01-15",
    tags: ["Backend", "API"],
  },
  {
    id: "3",
    title: "Role permissions",
    description:
      "Define role-based permissions for admin, manager and employee.",
    assignee: "Alex",
    status: "pending",
    priority: "low",
    dueDate: "2026-02-10",
    createdAt: "2026-01-18",
    tags: ["Auth", "RBAC"],
  },
];

/* ---------------- CONSTANTS ---------------- */

const ITEMS_PER_PAGE = 10;

/* ---------------- COMPONENT ---------------- */

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [view, setView] = useState<TaskView>("table");
  const [activeFilter, setActiveFilter] =
    useState<TaskFilter>("all");
  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  /* ---------------- FILTER LOGIC ---------------- */

 const filteredTasks = useMemo(() => {
  const today = new Date();

  return tasks.filter((task) => {
    const due = new Date(task.dueDate);

    switch (activeFilter) {
      case "this-week":
        const diff =
          (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;

      case "high-priority":
        return task.priority === "high";

      case "overdue":
        return due < today && task.status !== "completed";

      default:
        return true;
    }
  });
}, [tasks, activeFilter]);


  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(
    filteredTasks.length / ITEMS_PER_PAGE
  );

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* ---------------- RESET PAGE ON CHANGE ---------------- */

  useEffect(() => {
    setPage(1);
  }, [activeFilter, view]);

  /* ---------------- RENDER ---------------- */


  const handleSave = (task: Task) => {
    console.log("New task:", task);
    // later → API call
  };

  return (
    <div className="space-y-6">
      {/* ================= STATS ================= */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<MdAssignment size={22} />}
        />

        <StatCard
          title="Pending"
          value={
            tasks.filter((t) => t.status === "pending")
              .length
          }
          variant="warning"
          icon={<MdHourglassEmpty size={22} />}
        />

        <StatCard
          title="In Progress"
          value={
            tasks.filter(
              (t) => t.status === "in-progress"
            ).length
          }
          variant="info"
          icon={<MdAutorenew size={22} />}
        />

        <StatCard
          title="Completed"
          value={
            tasks.filter(
              (t) => t.status === "completed"
            ).length
          }
          variant="success"
          icon={<MdCheckCircle size={22} />}
        />

        <StatCard
          title="Overdue"
          value={
            tasks.filter((t) => {
              const due = new Date(t.dueDate);
              return (
                due < new Date() &&
                t.status !== "completed"
              );
            }).length
          }
          variant="error"
          icon={<MdErrorOutline size={22} />}
        />
      </section>

      {/* ================= FILTER + VIEW ================= */}
      <section className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <TaskFilters
          value={activeFilter}
          onChange={setActiveFilter}
        />

        <div className="flex gap-2">
            <Button
        variant="primary"
        onClick={() => setOpen(true)}
      >
        + New Task
      </Button>


          <Button
            size="sm"
            variant={view === "table" ? "primary" : "outline"}
            onClick={() => setView("table")}
          >
            <MdViewList size={18} className="mr-1" />
            Table
          </Button>

          <Button
            size="sm"
            variant={
              view === "kanban" ? "primary" : "outline"
            }
            onClick={() => setView("kanban")}
          >
            <MdDashboard size={18} className="mr-1" />
            Kanban
          </Button>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-base-100 border border-base-300 rounded-xl p-4">
        {view === "table" && (
          <>
            <TaskTable
              tasks={paginatedTasks}
              onOpenTask={setSelectedTask}
            />

            {totalPages > 1 && (
              <div className="flex justify-end mt-4">
                <div className="join">
                  <button
                    className="btn btn-sm join-item"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((p) => p - 1)
                    }
                  >
                    Prev
                  </button>

                  <button className="btn btn-sm join-item btn-disabled">
                    Page {page} / {totalPages}
                  </button>

                  <button
                    className="btn btn-sm join-item"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((p) => p + 1)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {view === "kanban" && (
          <TaskKanban
            tasks={filteredTasks}
            setTasks={setTasks}
            onTaskSelect={setSelectedTask}
          />
        )}
      </section>

      {/* ================= DRAWER ================= */}
      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onDelete={(id) => {
          setTasks((prev) =>
            prev.filter((t) => t.id !== id)
          );
          setSelectedTask(null);
        }}
        onUpdate={(updatedTask) => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === updatedTask.id
                ? updatedTask
                : t
            )
          );
          setSelectedTask(updatedTask);
        }}
      />

       <TaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
