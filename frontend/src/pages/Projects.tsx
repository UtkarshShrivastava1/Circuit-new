import EmptyState from "../components/ui/EmptyState";
import ProjectGrid from "../components/projects/ProjectGrid";
import type {  Project, ProjectFilter } from "../type/project";
import { useState } from "react";
import ProjectDrawer from "../components/projects/ProjectDrawer";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectGridSkeleton from "@/components/projects/ProjectGridSkeleton";
import ProjectFilters from "@/components/projects/ProjectFilters";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const loading = false; // later from API
  const [filter, setFilter] = useState<ProjectFilter >("all");

  const projects: Project[] = [
    {
      id: "1",
      name: "Office ERP System",
      status: "active",
      progress: 65,
      manager: "Alex Kumar",
      teamCount: 6,
      dueDate: "15 Feb 2026",
    },
    {
      id: "2",
      name: "Client Portal",
      status: "on-hold",
      progress: 30,
      manager: "Rahul Sharma",
      teamCount: 3,
      dueDate: "10 Mar 2026",
    },
    {
      id: "3",
      name: "Mobile App",
      status: "completed",
      progress: 100,
      manager: "Ankit Verma",
      teamCount: 5,
      dueDate: "05 Jan 2026",
    },
  ];

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      {loading ? (
        <ProjectGridSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Create your first project to get started"
          action={
            <button className="btn btn-outline btn-sm">Create Project</button>
          }
        />
      ) : (
        <div className="space-y-4">
          <ProjectFilters value={filter} onChange={setFilter} />
          <ProjectGrid
               projects={filteredProjects} // ✅ FIX
            onOpen={(project) =>
              setSelectedProject(project)}
          />
        </div>
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
    </div>
  );
}
