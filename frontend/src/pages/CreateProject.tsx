// import { AddParticipant } from "@/components/projects/AddParticipant";
// import CreateProjectForm from "@/components/projects/CreateProjectForm";
// import  { useState } from "react";
// import { toast } from "react-toastify";

// const TABS = ["Project Info", "Participants"];
// interface Participant {
//   userId: string;
//   role: string;
//   responsibility: string;
// }
// const initialProjectState = {
//   projectName: "",
//   projectState: "ongoing",
//   startDate: "",
//   endDate: "",
//   domain: "",
//   description: "",
// };

// export const CreateProject = () => {
//   const [activeTab, setActiveTab] = useState("Project Info");
   
// const [projectData, setProjectData] = useState(initialProjectState);

// const [participants, setParticipants] = useState<Participant[]>([]);

// const [creating, setCreating] = useState(false);
// const handleTabClick = (tab: string) => {
//   if (tab === "Participants") {
//     // Validate project info first
//     if (!projectData.projectName.trim() || !projectData.domain.trim()) {
//       toast.error("Please fill project info before adding participants");
//       return;
//     }
//   }

//   setActiveTab(tab);
// };

// const handleCreateProject = async () => {
//   if (participants.length === 0) {
//     alert("Add at least one participant");
//     return;
//   }

//   try {
//     setCreating(true);

//     const finalPayload = {
//       ...projectData,
//       participants,
//     };

//     console.log("FINAL DATA:", finalPayload);

//     // future backend call here

//     //  Reset everything
//     setProjectData(initialProjectState);
//     setParticipants([]);
//     setActiveTab("Project Info");

// toast.success("Project created successfully");
  

//   } catch (error) {
//     console.error("Project creation failed");
//   } finally {
//     setCreating(false);
//   }
// };



//   return (
//     <div className="min-h-screen  flex justify-center items-start py-10 px-4">
      
//       {/* Main Card */}
//       <div className="w-full max-w-2xl bg-white backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/10">

//         {/* Heading */}
//         <h1 className="text-2xl font-semibold text-center mb-6">
//           Create New Project
//         </h1>

//         {/* Tabs */}
//         <div className="flex mb-6 bg-[#313b4a] rounded-lg p-1">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//                 onClick={() => handleTabClick(tab)}
//               className={`flex-1 py-2 rounded-md text-sm transition-all duration-300 ${
//                 activeTab === tab
//                   ? "bg-white text-black font-medium"
//                   : "text-gray-400"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div>
//           {activeTab === "Project Info" &&<CreateProjectForm
//   onNext={() => setActiveTab("Participants")}
//   projectData={projectData}
//   setProjectData={setProjectData}
// />
// }
//           {activeTab === "Participants" && <AddParticipant
//     participants={participants}
//     setParticipants={setParticipants}
//     onCreate={handleCreateProject}
//     creating={creating}
//   />}
//         </div>
//       </div>
//     </div>
//   );
// };


import { AddParticipant } from "@/components/projects/AddParticipant";
import CreateProjectForm from "@/components/projects/CreateProjectForm";
import { useState } from "react";
import { toast } from "react-toastify";

const TABS = ["Project Info", "Participants"];

interface Participant {
  userId: string;
  role: string;
  responsibility: string;
}

const initialProjectState = {
  projectName: "",
  projectState: "ongoing",
  startDate: "",
  endDate: "",
  domain: "",
  description: "",
};

 const CreateProject = () => {
  const [activeTab, setActiveTab] = useState("Project Info");
  const [projectData, setProjectData] = useState(initialProjectState);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [creating, setCreating] = useState(false);

  const handleTabClick = (tab: string) => {
    if (tab === "Participants") {
      if (!projectData.projectName.trim() || !projectData.domain.trim()) {
        toast.error("Please fill project info first");
        return;
      }
    }
    setActiveTab(tab);
  };

  const handleCreateProject = async () => {
    if (participants.length === 0) {
      toast.error("Add at least one participant");
      return;
    }

    try {
      setCreating(true);

      const finalPayload = {
        ...projectData,
        participants,
      };

      console.log("FINAL DATA:", finalPayload);

      setProjectData(initialProjectState);
      setParticipants([]);
      setActiveTab("Project Info");

      toast.success("Project created successfully 🎉");
    } catch (error) {
      console.error("Project creation failed",error);
    } finally {
      setCreating(false);
    }
  };
  console.log("running")
// return (
//   <div className="max-h-screen flex justify-center items-start py-16 px-4 overflow-x-scroll">

//     <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 border border-gray-200">

//       {/* Heading */}
//       <div className="mb-10 text-center">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Create New Project
//         </h1>
//         <p className="text-gray-500 text-sm mt-2">
//           Fill project details and assign team members
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
//         {TABS.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => handleTabClick(tab)}
//             className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
//               activeTab === tab
//                 ? "bg-white shadow text-gray-900"
//                 : "text-gray-500 hover:text-gray-800"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {activeTab === "Project Info" && (
//         <CreateProjectForm
//           onNext={() => setActiveTab("Participants")}
//           projectData={projectData}
//           setProjectData={setProjectData}
//         />
//       )}

//       {activeTab === "Participants" && (
//         <AddParticipant
//           participants={participants}
//           setParticipants={setParticipants}
//           onCreate={handleCreateProject}
//           creating={creating}
//         />
//       )}
//     </div>
//   </div>
// );


return (
  <div className="min-h-screen bg-base-100 px-4 py-6 sm:py-10 flex justify-center">
  <div className="w-full max-w-3xl bg-base-200/40 backdrop-blur-md border border-base-300 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8">
 
      {/* ================= HEADING ================= */}
      <div className="mb-8 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
        Create New Project
      </h1>
      <p className="text-sm text-base-content/60 mt-2">
        Fill in project details and assign team members
      </p>
      </div>

      {/* ================= TABS ================= */}
      {/* <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-6 sm:mb-8 bg-base-200 rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`
              flex-1 py-2 rounded-lg text-sm font-medium transition
              ${
                activeTab === tab
                  ? "bg-base-100 shadow text-base-content"
                  : "text-base-content/60 hover:text-base-content"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div> */}

      <div className="mb-6 sm:mb-8">
  <div className="flex bg-base-200 rounded-xl p-1">
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => handleTabClick(tab)}
        className={`
          flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300
          ${
            activeTab === tab
              ? "bg-base-100 shadow text-primary"
              : "text-base-content/60 hover:text-base-content"
          }
        `}
      >
        {tab}
      </button>
    ))}
  </div>
</div>

      {/* ================= TAB CONTENT ================= */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "Project Info" && (
          <CreateProjectForm
            onNext={() => setActiveTab("Participants")}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        )}

        {activeTab === "Participants" && (
          <AddParticipant
            participants={participants}
            setParticipants={setParticipants}
            onCreate={handleCreateProject}
            creating={creating}
          />
        )}
      </div>

    </div>
    </div>
);

};

export default CreateProject;