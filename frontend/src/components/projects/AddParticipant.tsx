import React, { useState } from "react";

interface User {
  id: string;
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
  creating:boolean;
}


export const AddParticipant = ({
  participants,
  setParticipants,
  onCreate,
  creating
}: AddParticipantProps
) => {
 
  const [users] = useState<User[]>([
    { id: "1", name: "Ritika", role: "Admin" },
    { id: "2", name: "Rahul", role: "Developer" },
    { id: "3", name: "Ananya", role: "Designer" },
  ]);
  

const handleCreate = async () => {
 onCreate();
};

 


  const [form, setForm] = useState<Participant>({
    userId: "",
    role: "",
    responsibility: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.userId || !form.role) return;

   const alreadyExists = participants.some(
  (p: Participant) => p.userId === form.userId
);

if (alreadyExists) {
  alert("User already added!");
  return;
}

setParticipants([...participants, form]);

    setForm({
      userId: "",
      role: "",
      responsibility: "",
    });
  };

  const handleDelete = (index: number) => {
    const updated = participants.filter((_: Participant, i:number) => i !== index);
    setParticipants(updated);
  };

  const getUserName = (id: string) => {
    return users.find((u) => u.id === id)?.name;
  };

  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-xl space-y-4 text-sm">
      <h2 className="text-xl font-semibold mb-4">Add Participant</h2>

      {/* User Dropdown */}
      <select
        name="userId"
        value={form.userId}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-[#1e293b] outline-none"
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} - {user.role}
          </option>
        ))}
      </select>

      {/* Role */}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded bg-[#1e293b] outline-none"
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
        className="w-full p-2 mb-3 rounded bg-[#1e293b] outline-none"
      >
        <option value="">Select Responsibility</option>
        <option value="Development">Development</option>
        <option value="Frontend">Frontend</option>
        <option value="Backend">Backend</option>
        <option value="Full Stack">Full Stack</option>
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
        className="w-full font-semibold bg-white text-black py-2 rounded hover:opacity-90 transition"
      >
        Add Participant
      </button>

      {/* Participants List */}
    {/* Participants Section */}
<div className="mt-6 space-y-3">
  <h3 className="font-semibold">Project Members</h3>

  {participants.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No members added yet
    </p>
  ) : (
    participants.map((p: Participant, index: number) => (
      <div
        key={index}
        className="bg-[#1e293b] p-3 rounded flex justify-between items-start"
      >
        <div>
          <p className="font-medium">
            {getUserName(p.userId)}
          </p>
          <p className="text-sm text-gray-400">
            Role: {p.role}
          </p>
          <p className="text-sm text-gray-400">
            {p.responsibility}
          </p>
        </div>

        <button
          onClick={() => handleDelete(index)}
          className="text-red-400 text-sm"
        >
          Delete
        </button>
      </div>
    ))
  )}
</div>


<button
  onClick={handleCreate}
  disabled={creating}
  className="w-full cursor-pointer font-semibold mt-6 bg-white text-black py-2 rounded disabled:opacity-60"
>
  {creating ? "Creating Project..." : "Create Project"}
</button>


</div>
   
  );
};
