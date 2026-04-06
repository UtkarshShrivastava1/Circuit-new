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
import { getProject, deleteProject } from "@/services/projectServices";
// import { getOrganizationSlug } from "@/utils/auth";

export default function Projects() {
  const { auth } = useAuth();
  const slug = auth.slug;

  // console.log("Auth in Projects:", auth);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectFilter>("all");

  // Helper to check roles
  const hasRole = (roles: string[]) => auth.user?.role ? roles.includes(auth.user?.role) : false;

  const canDelete = hasRole(["admin", "owner", "manager"]);
  const canEdit = hasRole(["admin", "owner"]);
 

// ------------------Delete Project------------------




  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
       
        const res = await getProject(slug);
        // api.get(`/projects/${auth.slug}/getProjects`, {
        //   params: filter !== "all" ? { projectState: filter } : {},
        // });
        const mappedProjects = (res.data?.projects || []).map((p: any) => ({
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
        setLoading(false);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [slug, filter]);

  const handleDeleteProject = async (id: string) => {
  try {
    await deleteProject(slug, id);

    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast .success("Project deleted");
    console.log("Project deleted");
  } catch (error) {
    console.error("Delete failed", error);
  }
};



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
           onUpdate={(updated) => {
             setProjects((prev) => 
               prev.map((p) => (p.id === updated.id ? updated : p))
             );
           }}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </ProjectDrawer>
    </div>
  );
}
