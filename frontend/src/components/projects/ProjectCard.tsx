

import StatusBadge from "../ui/StatusBadge";
import type { Project } from "../../type/project";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { MdChat } from "react-icons/md";

interface Props {
  project: Project;
  onOpen: () => void;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export default function ProjectCard({
  project,
  onOpen,
  onDelete,
  canDelete = true,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="group bg-base-200 border border-base-300 rounded-xl p-6 hover:shadow-lg transition relative w-full min-w-[280px] max-w-md">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-base-content text-lg break-words">
          {project.name}
        </h3>

        <div className="flex items-center gap-2">
          <StatusBadge
            status={
              project.status === "active" || project.status === "completed"
                ? "approved"
                : "pending"
            }
          />

          {canDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete project "${project.name}"?`)) {
                  onDelete(project.id);
                }
              }}
              className="btn btn-xs btn-ghost text-error hover:bg-error/10"
              title="Delete project"
            >
              <FaTrash className="w-3 h-4" />
            </button>
          )}
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
      <div className="flex items-center justify-between mt-4 text-xs text-base-content/70">
        <span className="flex items-center gap-1">
          <FaUser /> {project.teamCount}{" "}
        </span>
        <span className="flex items-center gap-1">
          <FaCalendarAlt /> {project.dueDate}
        </span>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-sm btn-outline flex-1" onClick={onOpen}>
            View
          </button>

          <button
            className="btn btn-sm btn-primary flex-1"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            Open
          </button>
          <button  onClick={() => navigate(`/projects/${project.id}?tab=chat`)} className="px-4 py-2 flex items-center gap-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
            <MdChat size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
