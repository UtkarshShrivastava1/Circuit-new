// import type { Project } from "../../type/project";

// interface Props {
//   project: Project;
//   open: boolean;
//   onClose: () => void;
//   onSave: (updated: Project) => void;
// }

// export default function EditProjectModal({
//   project,
//   open,
//   onClose,
//   onSave,
// }: Props) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-base-100 rounded-xl p-6 w-full max-w-md">
//         <h3 className="text-lg font-semibold mb-4">
//           Edit Project
//         </h3>

//         <div className="space-y-4">
//           <input
//             defaultValue={project.name}
//             className="input input-bordered w-full"
//           />

//           <select
//             defaultValue={project.status}
//             className="select select-bordered w-full"
//           >
//             <option value="Active">Active</option>
//             <option value="On Hold">On Hold</option>
//             <option value="Completed">Completed</option>
//           </select>
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <button className="btn btn-ghost" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="btn btn-primary"
//             onClick={() => onSave(project)}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import type { Project, Participant } from "../../type/project";
import api from "@/services/api";
import { useAuth } from "@/auth/AuthContext";

interface Props {
  project: Project | null; // project nullable for safety
  open: boolean;
  onClose: () => void;
  onSave: (updated: Project) => void;
}

interface OrgUser {
  _id: string;
  name: string;
  role: string;
}
export default function EditProjectModal({
  project,
  open,
  onClose,
  onSave,
}: Props) {
  // safety check
  if (!open || !project) return null;

  // states
  const [name, setName] = useState(project.name || "");
  const [status, setStatus] = useState<Project["status"]>(
    project.status || "Active",
  );
  const [startDate, setStartDate] = useState(project.startDate || "");
  const [endDate, setEndDate] = useState(project.endDate || "");
  const [domain, setDomain] = useState(project.domain || "");
  const [customDomain, setCustomDomain] = useState(project.customDomain || "");
  const [description, setDescription] = useState(project.description || "");
  const [participants, setParticipants] = useState<Participant[]>(
    project.participants || [],
  );
  const { auth } = useAuth();
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]); // for participant dropdown
  const [newParticipant, setNewParticipant] = useState<Participant>({
    user: "",
    role: "",
    responsibility: "",
  });

  // sync when project changes
  useEffect(() => {
    if (!project) return;
    setName(project.name || "");
    setStatus(project.status || "Active");
    setStartDate(project.startDate || "");
    setEndDate(project.endDate || "");
    setDomain(project.domain || "");
    setCustomDomain(project.customDomain || "");
    setDescription(project.description || "");
    setParticipants(project.participants || []);
    setNewParticipant({ user: "", role: "", responsibility: "" });
    const fetchParticipants = async () => {
      // fetch user details for participants if needed
      try {
        const res = await api.get(`/${auth.slug}/getMembers`);
        setOrgUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch participant details", err);
      }
    };
    fetchParticipants();
  }, [project]);
  console.log(orgUsers, "Org users for participant management");
  const formatDate = (d?: string | Date) =>
    d ? new Date(d).toISOString().split("T")[0] : "";

  // participants management
  const addParticipant = () => {
    if (
      !newParticipant.user ||
      !newParticipant.role ||
      !newParticipant.responsibility
    )
      return;
    // store only user id
    setParticipants([
      ...participants,
      {
        ...newParticipant,
        user:
          typeof newParticipant.user === "object"
            ? newParticipant.user._id
            : newParticipant.user,
      },
    ]);
    setNewParticipant({ user: "", role: "", responsibility: "" });
  };
  const removeParticipant = (userId: string) => {
    setParticipants(participants.filter((p) => p.user !== userId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-base-100 rounded-xl p-6 w-full max-w-md space-y-4 overflow-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold mb-2">Edit Project</h3>

        {/* Project fields */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Project Name"
        />
        {/* <select value={status} onChange={(e) => setStatus(e.target.value as Project["status"])} className="select select-bordered w-full">
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select> */}
        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
            )
          }
          className="select select-bordered w-full"
        >
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          value={formatDate(startDate)}
          onChange={(e) => setStartDate(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={formatDate(endDate)}
          onChange={(e) => setEndDate(e.target.value)}
          className="input input-bordered w-full"
          placeholder="End Date"
        />

        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Domain"
        />
        {domain === "Other" && (
          <input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Custom Domain"
          />
        )}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Description"
        />

        {/* Participants */}
        <div className="space-y-2">
          <h4 className="font-medium">Participants</h4>
          {participants.map((p) => {
            const user = orgUsers.find((u) => u._id === p.user); // find by _id
            return (
              <div key={p.user} className="flex items-center gap-2">
                <span className="flex-1">
                  {user ? user.name : p.user} ({p.role}) - {p.responsibility}
                </span>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => removeParticipant(p.user)}
                >
                  Remove
                </button>
              </div>
            );
          })}

          <div className="flex gap-2 mt-2">
            <select
              value={newParticipant.user}
              onChange={
                (e) =>
                  setNewParticipant({ ...newParticipant, user: e.target.value }) // always a string
              }
              className="select select-bordered flex-1"
            >
              <option value="">Select User</option>
              {orgUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <input
              value={newParticipant.role}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, role: e.target.value })
              }
              placeholder="Role"
              className="input input-bordered flex-1"
            />
            <input
              value={newParticipant.responsibility}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  responsibility: e.target.value,
                })
              }
              placeholder="Responsibility"
              className="input input-bordered flex-1"
            />
            <button className="btn btn-sm btn-primary" onClick={addParticipant}>
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onSave({
                ...project,
                name,
                status,
                startDate,
                endDate,
                domain,
                customDomain,
                description,
                participants,
              })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
