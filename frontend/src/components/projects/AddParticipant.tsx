
import { MdDelete } from "react-icons/md";

import { useAuth } from "@/auth/AuthContext";
import { useEffect, useState } from "react";
import { getMembers } from "@/services/memberService";
import { getOrganizationSlug } from "@/utils/auth";

import API from "@/api/axios";

interface User {
  _id: string;
  name: string;
  role: string;
}

interface Participant {
  userId: string;
  role: string;
  responsibility: string;
}

interface AddParticipantProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onCreate: () => void;
  creating: boolean;
}

export const AddParticipant: React.FC<AddParticipantProps> = ({
  participants,
  setParticipants,
  onCreate,
  creating,
}) => {
  
  const { auth } = useAuth(); // get org slug or id
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState<Participant>({
    userId: "",
    role: "",
    responsibility: "",
  });

  // Fetch org users from backend
  useEffect(() => {
    if (!auth.slug) return;

    const fetchUsers = async () => {
      try {
        const slug = auth.slug; // get slug from auth context or utility
        const res = await getMembers(slug);
        // await api.get(`/${auth.slug}/getMembers`);
        setUsers(res.data.members); 
      } catch (err) {
        console.error("Failed to fetch org users", err);
      }
    };
    fetchUsers();
  }, [auth.slug]);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add participant
  const handleAdd = () => {
    if (!form.userId || !form.role || !form.responsibility) {
      alert("Please fill all fields");
      return;
    }

    const alreadyExists = participants.some(
      (p) => p.userId === form.userId
    );

    if (alreadyExists) {
      alert("User already added!");
      return;
    }

    setParticipants([...participants, form]);
    setForm({ userId: "", role: "", responsibility: "" });
  };

  // Remove participant
  const handleDelete = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  // Map userId to name for display
  const getUserName = (id: string) =>
    users.find((u) => u._id === id)?.name || "Unknown";

  return (
    <div className="bg-base-200/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-base-300 space-y-6 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-base-content">
        Add Participant
      </h2>

      {/* User Dropdown */}
      <select
        name="userId"
        value={form.userId}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-content/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
      >
        <option value="">Select User</option>
        {users?.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} - {user.role}
          </option>
        ))}
      </select>

      {/* Role */}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-content/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
      >
        <option value="">Select Role</option>
        <option value="Member">Project Member</option>
        <option value="Manager">Project Manager</option>
      </select>

      {/* Responsibility */}
      <select
        name="responsibility"
        value={form.responsibility}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-content/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
      >
        <option value="">Select Responsibility</option>
        <option value="Frontend Development">Frontend Development</option>
        <option value="Backend Development">Backend Development</option>
        <option value="Full Stack Development">Full Stack Development</option>
        <option value="Testing">Testing</option>
        <option value="Debugging">Debugging</option>
        <option value="Deployment">Deployment</option>
        <option value="Content">Content</option>
        <option value="Research">Research</option>
        <option value="Maintain">Maintain</option>
        <option value="Design">Design</option>
      </select>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3 rounded-xl bg-primary text-primary-content font-semibold hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
      >
        Add Participant
      </button>

      {/* Participants List */}
      <div className="mt-6 space-y-3">
        <h3 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold">
          Project Members
        </h3>
        {participants?.length === 0 ? (
          <p className="text-gray-400 text-sm">No members added yet</p>
        ) : (
          participants?.map((p, index) => (
            <div
              key={index}
              className="bg-base-100 border border-base-300 p-4 rounded-xl flex justify-between items-start shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <p className="font-semibold text-base-content">
                  {getUserName(p.userId)}
                </p>
                <p className="text-sm text-base-content/60">Role: {p.role}</p>
                <p className="text-sm text-base-content/60">
                  {p.responsibility}
                </p>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="text-error hover:scale-110 transition-transform"
              >
                <MdDelete size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Project */}
      <button
        onClick={onCreate}
        disabled={creating}
        className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-content font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-60 active:scale-[0.98]"
      >
        {creating ? "Creating Project..." : "Create Project"}
      </button>
    </div>
  );
};