import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import PageContainer from "../components/ui/PageContainer";

// import tab components
import ProjectTasks from "../components/projects/ProjectTasks";
import ProjectMembers from "../components/projects/ProjectMembers";
import ProjectActivity from "../components/projects/ProjectActivity";
import ProjectChat from "@/components/projects/ProjectChat";

type ProjectTab = "overview" | "tasks" | "members" | "activity" | "chat";

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
const tabFromUrl = searchParams.get("tab") as ProjectTab | null;
const [activeTab, setActiveTab] = useState<ProjectTab>(
  tabFromUrl || "overview"
);



  const project = {
    id,
    name: "Office ERP System",
    status: "active",
    description:
      "An internal ERP system to manage attendance, projects, tasks, and employees.",
    progress: 65,
    manager: "Alex Kumar",
    team: [
      { id: "1", name: "Alex Kumar", role: "Manager" },
      { id: "2", name: "Rahul Sharma", role: "Developer" },
      { id: "3", name: "Ankit Verma", role: "Designer" },
      { id: "4", name: "Neha Singh", role: "QA" },
    ],
    activity: [
      "Project created",
      "Attendance module completed",
      "Tasks module in progress",
      "New member added to project",
    ],
    tasks: [
      {
        id: "1",
        title: "Fix Payroll Bug",
        status: "in-progress",
        priority: "high",
        due: "2026-02-25",
      },
      {
        id: "2",
        title: "Client Demo Prep",
        status: "todo",
        priority: "medium",
        due: "2026-02-22",
      },
      {
        id: "3",
        title: "Attendance API",
        status: "completed",
        priority: "low",
        due: "2026-02-18",
      },
      {
        id: "4",
        title: "Dashboard UI",
        status: "in-progress",
        priority: "high",
        due: "2026-02-20",
      },
      {
        id: "5",
        title: "Form Ui",
        status: "pending",
        priority: "high",
        due: "2026-02-19",
      },
    ],
  };

  const latestTasks = [...project.tasks]
    .sort((a, b) => new Date(b.due).getTime() - new Date(a.due).getTime())
    .slice(0, 3);
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (t) => t.status === "completed",
  ).length;
  const inProgressTasks = project.tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const highPriorityTasks = project.tasks.filter((t) => t.priority === "high");
  const pendingTasks = project.tasks.filter(
    (t) => t.status === "pending",
  ).length;

  const today = new Date();
  const overdueTasks = project.tasks.filter(
    (t) => new Date(t.due) < today && t.status !== "completed",
  );

  const tabs: { key: ProjectTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "tasks", label: "Tasks" },
    { key: "members", label: "Members" },
    { key: "activity", label: "Activity" },
    { key: "chat", label: "Chat" },
  ];

  return (
    <PageContainer
      title={project.name}
      subtitle={`Managed by ${project.manager}`}
    >
      {/* ===== Tabs (ClickUp-style) ===== */}
      <div className="flex gap-2 border-b border-base-300 mb-6 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
             className={`px-4 py-2 text-sm font-medium transition flex-shrink-0
                ${
                 isActive
  ? "border-b-2 border-primary text-primary bg-primary/5"
  : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===== TAB CONTENT ===== */}

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-base-200 border border-base-300 rounded-lg p-4 text-center">
              <p className="text-xs text-base-content/60">Total Tasks</p>
              <p className="text-lg font-semibold text-base-content">{totalTasks}</p>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-lg p-4 text-center">
              <p className="text-xs text-base-content/60">Completed</p>
              <p className="text-lg font-semibold text-success">
                {completedTasks}
              </p>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-lg p-4 text-center">
              <p className="text-xs text-base-content/60">In Progress</p>
              <p className="text-lg font-semibold text-primary">
                {inProgressTasks}
              </p>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-lg p-4 text-center">
              <p className="text-xs text-base-content/60">Pending</p>
              <p className="text-lg font-semibold text-warning">
                {pendingTasks}
              </p>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-lg p-4 text-center">
              <p className="text-xs text-base-content/60">High Priority</p>
              <p className="text-lg font-semibold text-error">
                {highPriorityTasks.length}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-base-200 border border-base-300 rounded-lg p-6">
                <h3 className="font-semibold text-base-content mb-2">
                  Description
                </h3>
                <p className="text-sm text-base-content/70">
                  {project.description}
                </p>
              </div>
              <div className="bg-base-200 border border-base-300 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-base-content">High Priority Tasks</h3>

                {highPriorityTasks.length === 0 ? (
                  <p className="text-sm text-base-content/60">
                    No high priority tasks 🎉
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {highPriorityTasks.slice(0, 3).map((task) => (
                      <li key={task.id} className="flex justify-between">
                       <span className="text-base-content">{task.title}</span>
                        <span className="text-error text-xs">High</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-base-200 border border-base-300 rounded-lg p-6">
                <h3 className="font-semibold mb-3 text-base-content">Latest Tasks</h3>

                <ul className="space-y-2 text-sm">
                  {latestTasks.map((task) => (
                    <li key={task.id} className="flex justify-between">
                   <span className="text-base-content">{task.title}</span>
                      <span className="text-base-content/60 text-xs">
                        {task.due}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress */}
              <div className="bg-base-200 border border-base-300 rounded-lg p-6">
                <div className="flex justify-between text-sm text-base-content mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <progress
                  className="progress progress-primary w-full"
                  value={project.progress}
                  max={100}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {overdueTasks.length > 0 && (
                <div className="bg-error/5 border border-error/30 rounded-lg p-4 text-base-content">
                  <h3 className="font-semibold text-error mb-2">
                    ⚠ {overdueTasks.length} Overdue Tasks
                  </h3>

                  <ul className="text-sm space-y-1">
                    {overdueTasks.slice(0, 3).map((task) => (
                      <li key={task.id}>{task.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Team */}
              <div className="bg-base-200 border border-base-300 rounded-lg p-6">
                <h3 className="font-semibold text-base-content mb-3">
                  Team Members
                </h3>

                <ul className="space-y-2 text-sm">
                  {project.team.map((member) => (
                    <li
                      key={member.id}
                      className="flex justify-between text-base-content"
                    >
                      <span>{member.name}</span>
                      <span className="text-base-content/60">
                        {member.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activity */}
              <div className="bg-base-200 border border-base-300 rounded-lg p-6">
                <h3 className="font-semibold text-base-content mb-3">
                  Recent Activity
                </h3>

                <ul className="space-y-2 text-sm text-base-content/70">
                  {project.activity.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TASKS */}
      {activeTab === "tasks" && <ProjectTasks projectId={id!} />}

      {/* MEMBERS */}
      {activeTab === "members" && <ProjectMembers />}

      {/* ACTIVITY */}
      {activeTab === "activity" && <ProjectActivity />}
      {activeTab === "chat" && <ProjectChat />}
    </PageContainer>
  );
}
