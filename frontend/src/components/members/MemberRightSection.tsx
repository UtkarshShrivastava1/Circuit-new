import { useState } from "react";

import ProjectGrid from "../projects/ProjectGrid";
import ProjectFilters from "../projects/ProjectFilters";
import type { Project } from "../../type/project";
import ProjectDrawer from "../projects/ProjectDrawer";
import ProjectDetails from "../projects/ProjectDetails";
import MemberTask from "./MemberTask";
import Tabs from "../ui/Tabs";

type Filter = "all" | "active" | "completed" | "on-hold";
type RightTab = "projects" | "tasks";

const memberTabs: { key: RightTab; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "tasks", label: "Tasks" },
];

export default function MemberRightSection({ memberId }: { memberId: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<RightTab>("projects");
  const [filter, setFilter] = useState<Filter>("all");



  const projects: Project[] = [
    {
      id: "p1",
      name: "Portfolio Website",
      manager: "Ritika",
      progress: 65,
      teamCount: 3,
      dueDate: "20 Feb 2026",
      status: "active",
      
    },
    {
      id: "p2",
      name: "Task Manager App",
      manager: "Ritika",
      progress: 100,
      teamCount: 5,
      dueDate: "10 Jan 2026",
      status: "completed",
    },
  ];

  //  FILTER LOGIC
  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter(
          (p) => p.status === filter
        );

  return (
    <div className="flex-1  ">
    
 <Tabs<RightTab>
        value={activeTab}
        onChange={setActiveTab}
        tabs={memberTabs}
      />

      {activeTab === "projects" && (
        <>
          {/* ✅ PROJECT FILTERS */}
          <ProjectFilters
            value={filter}
            onChange={setFilter}
          />

          {/* ✅ PROJECT GRID */}
          <ProjectGrid
            onOpen={(project) => setSelectedProject(project)}
            projects={filteredProjects}
            canDelete
          />
        </>
      )}
      <ProjectDrawer
              open={!!selectedProject}
              onClose={() => setSelectedProject(null)}
            >
              {selectedProject && (
                <ProjectDetails
                  project={selectedProject}
                  onClose={() => setSelectedProject(null)}
                />
              )}
            </ProjectDrawer>

      {activeTab === "tasks" && (
        <div className="bg-base-200 border border-base-300 rounded-xl p-6 text-sm text-base-content/60">
         <MemberTask  memberId={memberId}/>
        </div>
      )}
    </div>
  );
}
