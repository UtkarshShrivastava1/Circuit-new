
import { useEffect, useState, useMemo } from "react";
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
import MobileTabs from "@/components/task/MobileTabs";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import API from "@/api/axios";
import NewTaskModal from "@/components/projects/NewTaskModal";

/* ---------------- TYPES ---------------- */

type TaskView = "table" | "kanban";
type TaskFilter = "all" | "this-week" | "high-priority" | "overdue";

/* ---------------- CONSTANTS ---------------- */

const ITEMS_PER_PAGE = 10;

/* ---------------- COMPONENT ---------------- */

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<TaskView>("table");
  const { auth } = useAuth();

  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"table" | "kanban">("table");

  console.log("Auth in Tasks:", auth);

  /* ---------------- FETCH TASKS ---------------- */

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/tasks/${auth.slug}/getTasks`);
      console.log("Tasks fetched:", res.data);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [auth?.slug]);

  const handleDeleteTask = async (task: Task) => {
    try {
      const res = await API.delete(
        `/tasks/${auth.slug}/deleteTask/${task.projectId}/${task._id}`,
      );

      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));

        toast.success("Task deleted");
        setSelectedTask(null);
      }
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task,
      ),
    );
  };
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

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  /* ---------------- RESET PAGE ---------------- */

  useEffect(() => {
    setPage(1);
  }, [activeFilter, view]);

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return <div className="p-6">Loading tasks...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ================= STATS ================= */}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<MdAssignment size={22} />}
        />

        <StatCard
          title="Pending"
          value={tasks.filter((t) => t.status === "pending").length}
          variant="warning"
          icon={<MdHourglassEmpty size={22} />}
        />

        <StatCard
          title="In Progress"
          value={tasks.filter((t) => t.status === "in-progress").length}
          variant="info"
          icon={<MdAutorenew size={22} />}
        />

        <StatCard
          title="Completed"
          value={tasks.filter((t) => t.status === "completed").length}
          variant="success"
          icon={<MdCheckCircle size={22} />}
        />

        <StatCard
          title="Overdue"
          value={
            tasks.filter((t) => {
              const due = new Date(t.dueDate);
              return due < new Date() && t.status !== "completed";
            }).length
          }
          variant="error"
          icon={<MdErrorOutline size={22} />}
        />
      </section>

      {/* ================= FILTER + VIEW ================= */}

      <section className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <TaskFilters value={activeFilter} onChange={setActiveFilter} />

        <div className="md:flex flex-wrap gap-2 w-full lg:w-auto hidden">
          <Button
            variant="primary"
            onClick={() => setOpen(true)}
            className="flex-1 sm:flex-none"
          >
            + New Task
          </Button>

          <Button
            size="sm"
            variant={active === "table" ? "primary" : "outline"}
            onClick={() => setActive("table")}
          >
            <MdViewList size={18} className="mr-1" />
            Table
          </Button>

          <Button
            size="sm"
            variant={active === "kanban" ? "primary" : "outline"}
            onClick={() => setActive("kanban")}
          >
            <MdDashboard size={18} className="mr-1" />
            Kanban
          </Button>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="bg-base-100 border border-base-300 rounded-xl p-3 sm:p-5">
        {active === "table" && (
          <>
            <TaskTable
              tasks={paginatedTasks}
              onOpenTask={(task) => {
                setSelectedTask(task);
                setDrawerMode("view");
              }}
              onEditTask={(task) => {
                setSelectedTask(task);
                setDrawerMode("edit");
              }}
              onDeleteTask={handleDeleteTask}
            />

            {totalPages > 1 && (
              <div className="flex justify-center sm:justify-end mt-4">
                <div className="join w-full sm:w-auto">
                  <button
                    className="btn btn-sm join-item"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Prev
                  </button>

                  <button className="btn btn-sm join-item btn-disabled">
                    Page {page} / {totalPages}
                  </button>

                  <button
                    className="btn btn-sm join-item"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {active === "kanban" && (
          <div className="overflow-x-auto">
            <TaskKanban
              tasks={filteredTasks}
              setTasks={setTasks}
              onTaskSelect={setSelectedTask}
            />
          </div>
        )}
      </section>

      {/* ================= DRAWER ================= */}

      <TaskDrawer
        task={selectedTask}
        mode={drawerMode}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdated}
      />

      <MobileTabs active={active} onChange={setActive} />

      {open && (
        <NewTaskModal
          onClose={() => setOpen(false)}
          onCreate={async () => {
            await fetchTasks();
            setOpen(false);
            toast.success("Task created");
          }}
        />
      )}
    </div>
  );
}
