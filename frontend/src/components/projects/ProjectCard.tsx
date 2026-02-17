// import StatusBadge from "../ui/StatusBadge";
// import type { Project } from "../../type/project";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   project: Project;
//   onOpen: () => void;
//   onDelete?: (id: string) => void;
//   canDelete?: boolean;
// }

// export default function ProjectCard({
//   project,
//   onOpen,
//   onDelete,
//   canDelete = false,
// }: Props) {
//   const navigate = useNavigate();

//   return (
//     <div className=" group bg-base-200 border border-base-300 rounded-xl p-5 hover:shadow-lg transition relative ">

     
//       {/* HEADER */}
//       <div className="flex items-start justify-between gap-5">
//         <h3 className="font-semibold text-base-content">
//           {project.name}
//         </h3>

//         <StatusBadge
//           status={
//             project.status === "active" || project.status === "completed"
//               ? "approved"
//               : "pending"
//           }
//         />

//          {/* DELETE (TOP RIGHT) */}
//       {canDelete && onDelete && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             if (confirm(`Delete project "${project.name}"?`)) {
//               onDelete(project.id);
//             }
//           }}
//           className="absolute top-3 right-3 btn btn-xs btn-ghost text-error 
//                      opacity-0 group-hover:opacity-100 transition"
//           title="Delete project"
//         >
//           🗑️
//         </button>
//       )}

//       </div>

//       {/* MANAGER */}
//       <p className="text-sm text-base-content/60 mt-1">
//         Manager: <span className="font-medium">{project.manager}</span>
//       </p>

//       {/* PROGRESS */}
//       <div className="mt-4">
//         <div className="flex justify-between text-xs text-base-content/60 mb-1">
//           <span>Progress</span>
//           <span>{project.progress}%</span>
//         </div>

//         <progress
//           className="progress progress-primary w-full h-2"
//           value={project.progress}
//           max={100}
//         />
//       </div>

//       {/* META */}
//       <div className="flex items-center justify-between mt-4 text-sm text-base-content/70">
//         <span>👥 {project.teamCount} members</span>
//         <span>📅 {project.dueDate}</span>
//       </div>

//       {/* ACTIONS */}
//       <div className="mt-5 grid grid-cols-2 gap-2">
//         <button
//           className="btn btn-sm btn-outline"
//           onClick={onOpen}
//         >
//           View
//         </button>

//         <button
//           className="btn btn-sm btn-primary"
//           onClick={() => navigate(`/projects/${project.id}`)}
//         >
//           Open
//         </button>
//       </div>
//     </div>
//   );
// }

import StatusBadge from "../ui/StatusBadge";
import type { Project } from "../../type/project";
import { useNavigate } from "react-router-dom";

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
  canDelete = false,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="group bg-base-200 border border-base-300 rounded-xl p-6 hover:shadow-lg transition relative w-full min-w-[280px] max-w-md">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base-content text-lg break-words">
          {project.name}
        </h3>

        <StatusBadge
          status={
            project.status === "active" || project.status === "completed"
              ? "approved"
              : "pending"
          }
        />

        {/* DELETE BUTTON */}
        {canDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete project "${project.name}"?`)) {
                onDelete(project.id);
              }
            }}
            className="absolute top-3 right-3 btn btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 transition"
            title="Delete project"
          >
            🗑️
          </button>
        )}
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
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-base-content/70 mb-4">
        <span>👥 {project.teamCount} members</span>
        <span>📅 {project.dueDate}</span>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="btn btn-sm btn-outline flex-1"
          onClick={onOpen}
        >
          View
        </button>

        <button
          className="btn btn-sm btn-primary flex-1"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Open
        </button>
      </div>
    </div>
  );
}
