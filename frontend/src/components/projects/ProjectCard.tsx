import StatusBadge from "../ui/StatusBadge";
import type { Project } from "../../type/project";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { MdChat, MdFileOpen } from "react-icons/md";
import Swal from "sweetalert2";
import { useState } from "react";
import EditProjectModal from "./EditProjectModal";
import { updateProject } from "@/services/projectServices";
import { useAuth } from "@/auth/AuthContext";
import { Edit2 } from "lucide-react";

interface Props {
  project: Project;
  onOpen: () => void;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
  canEdit?: boolean;
  onUpdate?: (updated: Project) => void;
}

export default function ProjectCard({
  project,
  onUpdate,
  onDelete,
  canEdit,
  canDelete = true,
}: Props) {
  const navigate = useNavigate();
  console.log("ProjectCard render", canEdit);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const { auth } = useAuth();
  //  const handleSave = async (updated: Project) => {

  //     try {
  //       const payload = {
  //         projectName: updated.name,
  //         projectState: updated.status,
  //         startDate: updated.startDate,
  //         endDate: updated.endDate,
  //         domain: updated.domain,
  //         customDomain: updated.customDomain,
  //         description: updated.description,
  //         participants: updated.participants,
  //       };

  //       await updateProject(auth.slug, updated.id, payload);

  //       setEditProject(null);
  //       onUpdate?.(updated); // update parent list optimistically

  //     } catch (err) {
  //       console.error("Failed to update project", err);
  //     }
  //   };

  console.log("Rendering ProjectCard:", project);
  const handleSave = async (updated: Project) => {
    try {
      const payload = {
        projectName: updated.name,
        projectState: updated.status,
        startDate: updated.startDate,
        endDate: updated.endDate,
        domain: updated.domain,
        customDomain: updated.customDomain,
        description: updated.description,
        participants: updated.participants,
      };

      await updateProject(auth.slug, updated.id, payload);
      console.log(payload);
      // 🔥 IMPORTANT: remap for UI
      const mappedUpdated = {
        ...updated,
        manager:
          updated.participants?.find((p: any) => p.role === "Manager")?.user
            ?.name || "N/A",
        teamCount: updated.participants?.length || 0,
        dueDate: updated.endDate
          ? new Date(updated.endDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "No deadline",
      };

      setEditProject(null);
      onUpdate?.(mappedUpdated); // 👈 use mapped data
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  return (
    <div className="group bg-base-200 border border-base-300 rounded-xl p-6 hover:shadow-lg transition relative w-full h-full flex flex-col justify-between min-w-0">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3 ">
        <h3 className="font-semibold text-base-content text-lg break-words">
          {project.name}
        </h3>
       
        <div className="flex items-center gap-2">
          <StatusBadge
            status={
              project.status === "Active" || project.status === "Completed"
                ? "approved"
                : "pending"
            }
          />
       
         <div className="flex items-center ">
          {canDelete && onDelete && (
            <div className="lg:tooltip" data-tip="Delete project">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  Swal.fire({
                    title: "Are you sure?",
                    text: `Delete project "${project.name}"?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      onDelete(project.id);
                    }
                  });
                }}
                className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                title="Delete project"
              >
                <FaTrash className="w-3 h-4" />
              </button>

            </div>
          )}

          {canEdit && (
            <div className="tooltip tooltip-top" data-tip="Edit project">
              <button
                className="btn-xs btn-ghost btn text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditProject(project);
                }}
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* MANAGER */}
      <p className="text-sm text-base-content/60 mb-4">
        Manager: <span className="font-medium">{project.manager}</span>
      </p>

      {/* PROGRESS */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-base-content/60 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <progress
          className="progress progress-primary w-full h-3 rounded-lg"
          value={project.progress}
          max={100}
        />
      </div>

      {/* META */}
     {/* META */}
<div className="mt-4 flex items-center justify-between gap-4 text-xs text-base-content/70 flex-wrap sm:flex-nowrap">
  
  {/* Left Meta Info */}
  <div className="flex items-center gap-4 whitespace-nowrap">
    <span className="flex items-center gap-1">
      <FaUser /> {project.teamCount}
    </span>

    <span className="flex items-center gap-1">
      <FaCalendarAlt /> {project.dueDate}
    </span>
  </div>

  {/* Right Action Buttons */}
  <div className="flex items-center gap-3">
    <div className="tooltip tooltip-top" data-tip="View project">
      <button
        className="btn btn-sm btn-primary"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <MdFileOpen size={16} />
      </button>
    </div>

    <div className="tooltip tooltip-top" data-tip="Open chat">
      <button
        onClick={() => navigate(`/projects/${project.id}?tab=chat`)}
        className="btn btn-sm btn-outline"
      >
        <MdChat size={18} />
      </button>
    </div>
  </div>
</div>
      <EditProjectModal
        open={!!editProject}
        project={editProject!}
        onClose={() => setEditProject(null)}
        onSave={(updated) => {
          handleSave(updated);
        }}
      />
    </div>
  );
}
