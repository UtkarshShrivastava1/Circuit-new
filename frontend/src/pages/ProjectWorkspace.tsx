import { useParams } from "react-router-dom";
import { useState } from "react";
import PageContainer from "../components/ui/PageContainer";

// import tab components
import ProjectTasks from "../components/projects/ProjectTasks";
import ProjectMembers from "../components/projects/ProjectMembers";
import ProjectActivity from "../components/projects/ProjectActivity";

type ProjectTab = "overview" | "tasks" | "members" | "activity";

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<ProjectTab>("overview");

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
  };

  const tabs: { key: ProjectTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "tasks", label: "Tasks" },
    { key: "members", label: "Members" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <PageContainer
      title={project.name}
      subtitle={`Managed by ${project.manager}`}
    >
      {/* ===== Tabs (ClickUp-style) ===== */}
      <div className="flex gap-2 border-b border-base-300 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "border-b-2 border-primary text-primary"
                    : "text-base-content/60 hover:text-base-content"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-base-100 border border-base-300 rounded-lg p-6">
              <h3 className="font-semibold text-base-content mb-2">
                Description
              </h3>
              <p className="text-sm text-base-content/70">
                {project.description}
              </p>
            </div>

            {/* Progress */}
            <div className="bg-base-100 border border-base-300 rounded-lg p-6">
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
            {/* Team */}
            <div className="bg-base-100 border border-base-300 rounded-lg p-6">
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
            <div className="bg-base-100 border border-base-300 rounded-lg p-6">
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
      )}

      {/* TASKS */}
      {activeTab === "tasks" && <ProjectTasks />}

      {/* MEMBERS */}
      {activeTab === "members" && <ProjectMembers />}

      {/* ACTIVITY */}
      {activeTab === "activity" && <ProjectActivity />}
    </PageContainer>
  );
}
