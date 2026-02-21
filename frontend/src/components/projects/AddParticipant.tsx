import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

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
<div className="bg-base-200/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-base-300 space-y-6 transition-all">

      <h2 className="text-xl font-semibold mb-4">Add Participant</h2>

      {/* User Dropdown */}
      <select
        name="userId"
        value={form.userId}
        onChange={handleChange}
        // className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
      // className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
      //  className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
  // className="w-full font-semibold bg-gray-800 text-white py-3 rounded-xl hover:bg-black transition"
  className="w-full py-3 rounded-xl bg-primary text-primary-content font-semibold hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
>
  Add Participant
</button>


      {/* Participants List */}
    {/* Participants Section */}
<div className="mt-6 space-y-3">
<h3 className="text-sm uppercase tracking-wide text-base-content/60 font-semibold">
  Project Members
</h3>

  {participants.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No members added yet
    </p>
  ) : (
    participants.map((p: Participant, index: number) => (
     <div
  key={index}
  // className="bg-white border border-gray-200 p-4 rounded-2xl flex justify-between items-start shadow-sm"
  className="bg-base-100 border border-base-300 p-4 rounded-xl flex justify-between items-start shadow-sm hover:shadow-md transition-all"
>

        <div>
          <p className="font-semibold text-base-content">
            {getUserName(p.userId)}
          </p>
          <p 
          // className="text-sm text-gray-400"
          className="text-sm text-base-content/60"
          
          >
            Role: {p.role}
          </p>
          <p 
          // className="text-sm text-gray-400"
          className="text-sm text-base-content/60"
          
          >
            {p.responsibility}
          </p>
        </div>

        <button
          onClick={() => handleDelete(index)}
          // className="text-red-400 text-sm cursor-pointer"
          className="text-error hover:scale-110 transition-transform"
        >
         <MdDelete size={18}/>
        </button>
      </div>
    ))
  )}
</div>


<button
  onClick={handleCreate}
  disabled={creating}
  // className="w-full font-semibold mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60"
  className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-content font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-60 active:scale-[0.98]"
>
  {creating ? "Creating Project..." : "Create Project"}
</button>


</div>
   
  );
};
