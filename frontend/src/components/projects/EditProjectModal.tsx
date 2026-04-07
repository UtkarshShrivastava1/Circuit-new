
import { useState, useEffect } from "react";
import type { Project, Participant } from "../../type/project";
import { useAuth } from "@/auth/AuthContext";

import { getMembers } from "@/services/memberService";

interface Props {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Project) => void;
}

interface OrgUser {
  _id: string;
  name: string;
  role: string;
}

const roles = ["Member", "Manager"];

const responsibilities = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Debugging",
  "Content",
  "Research",
  "Maintain",
  "UI Design",
  "Testing",
  "Deployment",
];

const domains = [
  "Web Development",
  "App Development",
  "AI/ML",
  "Social Media",
  "Block Chain",
  "Content Creation",
  "Content Writing",
  "Testing",
  "Software Development",
  "Other",
];

export default function EditProjectModal({
  project,
  open,
  onClose,
  onSave,
}: Props) {
  const { auth } = useAuth();

  const [name, setName] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [domain, setDomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);

  const [newParticipant, setNewParticipant] = useState<Participant>({
    user: "",
    role: "",
    responsibility: "",
  });

  useEffect(() => {
    if (!project) return;

    setName(project.name || "");
    setStatus(project.status || "Active");
    setStartDate(project.startDate || "");
    setEndDate(project.endDate || "");
    setDomain(project.domain || "");
    setCustomDomain(project.customDomain || "");
    setDescription(project.description || "");

    setParticipants(
      (project.participants || []).map((p) => ({
        ...p,
        user: typeof p.user === "object" ? p.user._id : p.user,
      }))
    );
  }, [project]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers(auth.slug); // fetch members using the service
        setOrgUsers(res.data.members || res.data.users || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMembers();
  }, [auth.slug]);

  if (!open || !project) return null;

  const formatDate = (d?: string | Date) =>
    d ? new Date(d).toISOString().split("T")[0] : "";

  const addParticipant = () => {
    if (
      !newParticipant.user ||
      !newParticipant.role ||
      !newParticipant.responsibility
    )
      return;

    const alreadyExists = participants.some(
      (p) => p.user === newParticipant.user
    );

    if (alreadyExists) return;

    setParticipants([
      ...participants,
      {
        ...newParticipant,
        user: newParticipant.user,
      },
    ]);

    setNewParticipant({
      user: "",
      role: "",
      responsibility: "",
    });
  };

  const removeParticipant = (userId: string) => {
    setParticipants(participants.filter((p) => p.user !== userId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-base-100 rounded-xl p-6 w-full max-w-md space-y-4 overflow-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold">Edit Project</h3>

        {/* Project Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Project Name"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Project["status"])}
          className="select select-bordered w-full"
        >
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Dates */}
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={(e) => setStartDate(e.target.value)}
          className="input input-bordered w-full"
        />

        <input
          type="date"
          value={formatDate(endDate)}
          onChange={(e) => setEndDate(e.target.value)}
          className="input input-bordered w-full"
        />

        {/* Domain */}
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Domain</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Custom Domain */}
        {domain === "Other" && (
          <input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter Custom Domain"
          />
        )}

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Description"
        />

        {/* Participants */}
        <div>
          <h4 className="font-medium mb-2">Participants</h4>

          {participants.map((p) => {
            const user = orgUsers.find((u) => u._id === p.user);

            return (
              <div key={p.user} className="flex items-center gap-2 mb-2">
                <span className="flex-1">
                  {user?.name || "Unknown"} ({p.role}) - {p.responsibility}
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

          {/* Add Participant */}
          <div className="flex gap-2 mt-2">
            <select
              value={newParticipant.user}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  user: e.target.value,
                })
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

            <select
              value={newParticipant.role}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  role: e.target.value,
                })
              }
              className="select select-bordered flex-1"
            >
              <option value="">Role</option>
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              value={newParticipant.responsibility}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  responsibility: e.target.value,
                })
              }
              className="select select-bordered flex-1"
            >
              <option value="">Responsibility</option>
              {responsibilities.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <button className="btn btn-primary btn-sm" onClick={addParticipant}>
              Add
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
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