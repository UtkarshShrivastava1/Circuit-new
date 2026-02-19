import StatusBadge from "../ui/StatusBadge";
import type { Project } from "../../type/project";
import { useNavigate } from "react-router-dom";
import { FaUser ,FaCalendarAlt ,FaTrash } from 'react-icons/fa';

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
    <div className="group bg-base-200 border border-base-300 rounded-xl p-5 hover:shadow-lg transition relative">

     
      {/* HEADER */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-base-content">
          {project.name}
        </h3>

        <StatusBadge
          status={
            project.status === "active" || project.status === "completed"
              ? "approved"
              : "pending"
          }
        />

         {/* DELETE (TOP RIGHT) */}
      {canDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete project "${project.name}"?`)) {
              onDelete(project.id);
            }
          }}
          className="absolute top-3 right-3 btn btn-xs btn-ghost text-error 
                     opacity-0 group-hover:opacity-100 transition"
          title="Delete project"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      )}

      </div>

      {/* MANAGER */}
      <p className="text-sm text-base-content/60 mt-1">
        Manager: <span className="font-medium">{project.manager}</span>
      </p>

      {/* PROGRESS */}
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

      {/* META */}
      <div className="flex items-center justify-between mt-4 text-xs text-base-content/70">
        <span className="flex items-center gap-1" ><FaUser/> {project.teamCount} </span>
        <span className="flex items-center gap-1"><FaCalendarAlt/> {project.dueDate}</span>
      </div>

      {/* ACTIONS */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className="btn btn-sm btn-outline"
          onClick={onOpen}
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
// import StatusBadge from "../ui/StatusBadge";
// import type { Project } from "../../type/project";
// import { useNavigate } from "react-router-dom";
// import  Button  from "../ui/Button";
// import { FaUser ,FaCalendarAlt ,FaTrash } from 'react-icons/fa';
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
//     <div
//       className="
//         group relative rounded-2xl p-5 bg-base-200
//         border border-base-300
//         transition-all duration-300
//         shadow-[6px_6px_14px_rgba(0,0,0,0.25),-6px_-6px_14px_rgba(255,255,255,0.7)]
//         hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.25),inset_-4px_-4px_10px_rgba(255,255,255,0.6)]
//       "
//     >
//       {/* DELETE */}
//       {canDelete && onDelete && (
//         <Button
//           onClick={(e) => {
//             e.stopPropagation();
//             if (confirm(`Delete project "${project.name}"?`)) {
//               onDelete(project.id);
//             }
//           }}
//           className="
//             absolute top-3 right-3
//             w-8 h-8 rounded-full flex items-center justify-center
//             bg-base-200 text-error
//             shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.6)]
//             opacity-0 group-hover:opacity-100 transition
//             hover:scale-95
//           "
//           title="Delete project"
//         >
//           <FaTrash className="w-4 h-4" />
//         </Button>
//       )}

//       {/* HEADER */}
//       <div className="flex items-start justify-between gap-2">
//         <h3 className="font-semibold text-base-content leading-tight">
//           {project.name}
//         </h3>

//         <StatusBadge
//           status={
//             project.status === "active" ||
//             project.status === "completed"
//               ? "approved"
//               : "pending"
//           }
//         />
//       </div>

//       {/* MANAGER */}
//       <p className="text-sm text-base-content/60 mt-1">
//         Manager{" "}
//         <span className="font-medium text-base-content">
//           {project.manager}
//         </span>
//       </p>

//       {/* PROGRESS */}
//       <div className="mt-4">
//         <div className="flex justify-between text-xs text-base-content/60 mb-1">
//           <span>Progress</span>
//           <span>{project.progress}%</span>
//         </div>

//         <progress
//           className="progress progress-primary w-full h-2 rounded-full"
//           value={project.progress}
//           max={100}
//         />
//       </div>

//       {/* META */}
//       <div className="flex items-center justify-between mt-4 text-sm text-base-content/70">
//         <span className="flex items-center gap-1">
//            <FaUser /> {project.teamCount}
//         </span>
//         <span className="flex items-center gap-1">
//           <FaCalendarAlt /> {project.dueDate}
//         </span>
//       </div>

//       {/* ACTIONS */}
//       <div className="mt-5 grid grid-cols-2 gap-3">
//         <Button
//           className="
//             btn btn-sm btn-outline
//             shadow-[2px_2px_6px_rgba(0,0,0,0.25),-2px_-2px_6px_rgba(255,255,255,0.6)]
//             hover:scale-95 transition
//           "
//           onClick={onOpen}
//         >
//           View
//         </Button>

//         <Button
//           className="
//             btn btn-sm btn-primary
//             shadow-[2px_2px_6px_rgba(0,0,0,0.25)]
//             hover:scale-95 transition
//             text-black
//           "
//           onClick={() => navigate(`/projects/${project.id}`)}
//         >
//           Open
//         </Button>
//       </div>
//     </div>
//   );
// }
