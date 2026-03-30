import EmptyState from "../components/ui/EmptyState";
import ProjectGrid from "../components/projects/ProjectGrid";
import type { Project, ProjectFilter } from "../type/project";
import { useEffect, useState } from "react";
import ProjectDrawer from "../components/projects/ProjectDrawer";
import ProjectDetails from "../components/projects/ProjectDetails";
import ProjectGridSkeleton from "@/components/projects/ProjectGridSkeleton";
import ProjectFilters from "@/components/projects/ProjectFilters";
import { useAuth } from "@/auth/AuthContext";

import { toast } from "react-toastify";
import API from "@/api/axios";

export default function Projects() {
  const { auth } = useAuth();
  console.log("Auth in Projects:", auth);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectFilter>("all");

  // Helper to check roles
  const hasRole = (roles: string[]) =>
    auth.user?.role ? roles.includes(auth.user.role) : false;

  const canDelete = hasRole(["admin", "owner", "manager"]);
  const canEdit = hasRole(["admin", "owner"]);

  console.log("Role:", auth.user?.role, "canDelete?", canDelete);
  const handleDeleteProject = async (id: string) => {
    console.log("Attempting to delete project with id:", id);
    try {
      await API.delete(`/projects/${auth.slug}/deleteProject/${id}`);

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
      console.log("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Delete failed", error);
    }
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/projects/${auth.slug}/getProjects`, {
          params: filter !== "all" ? { projectState: filter } : {},
        });
        console.log("Projects fetched:", res.data.projects);
    

        const mappedProjects = res.data.projects.map((p: any) => {
          const managerUser = p.participants?.find((participant: any) =>
            participant.role?.includes("Manager")
          );
         
          return {
          ...p,
          id: p._id,
          name: p.projectName || "Untitled Project",
          status: p.projectState || "active",
          progress: 0,
          
          manager:  managerUser?.user?.name || "N/A",
          teamCount: p.participants?.length || 0,
          dueDate: p.endDate
            ? new Date(p.endDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "No deadline",
        }
        });

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.slug) {
      fetchProjects();
    }
  }, [auth.slug, filter]);

  const filteredProjects = projects;

  return (
    <div>
      {/* Project Filters */}
      <ProjectFilters value={filter} onChange={setFilter} />

      {/* Projects Grid */}
      {loading ? (
        <ProjectGridSkeleton />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title={`No ${filter === "all" ? "" : filter} projects`}
          description="Try switching filters or create a new project"
        />
      ) : (
        <div className="space-y-4">
          <ProjectGrid
            projects={filteredProjects}
            onOpen={(project) => setSelectedProject(project)}
            onDelete={canDelete ? handleDeleteProject : undefined}
          />
        </div>
      )}

      {/* Project Details Drawer */}
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
