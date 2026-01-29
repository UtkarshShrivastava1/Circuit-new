import StatusBadge from "../ui/StatusBadge";
import type { Project } from "../../type/project";
import { useNavigate } from "react-router-dom";


interface Props {
  project: Project;
  onOpen: () => void; // ✅ ADD THIS
}

export default function ProjectCard({ project, onOpen }: Props) {
const navigate = useNavigate();

  return (
    <div className="bg-base-200 border border-base-300 rounded-xl p-5 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-base-content">
          {project.name}
        </h3>

        <StatusBadge
          status={
            project.status === "active"
              ? "approved"
              : project.status === "completed"
              ? "approved"
              : "pending"
          }
        />
      </div>

      <p className="text-sm text-base-content/60 mt-1">
        Manager: <span className="font-medium">{project.manager}</span>
      </p>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-base-content/60 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>

        <progress
          className="progress progress-primary w-full h-2"
          value={project.progress}
          max={100}
        />
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-base-content/70">
        <span>👥 {project.teamCount} members</span>
        <span>📅 {project.dueDate}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button className="btn btn-sm btn-outline text-base-content"
         onClick={onOpen}
        disabled={!onOpen} // optional UX improvement
        >
          View
          </button>
       <button
        className="btn btn-sm btn-primary"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        Open
      </button>

      </div>
    </div>
  );
}
