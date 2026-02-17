import { AddParticipant } from "@/components/projects/AddParticipant";
import CreateProjectForm from "@/components/projects/CreateProjectForm";
import React, { useState } from "react";

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

export const CreateProject = () => {
  const [activeTab, setActiveTab] = useState("Project Info");
   
const [projectData, setProjectData] = useState(initialProjectState);

const [participants, setParticipants] = useState<Participant[]>([]);

const [creating, setCreating] = useState(false);

const handleCreateProject = async () => {
  if (participants.length === 0) {
    alert("Add at least one participant");
    return;
  }

  try {
    setCreating(true);

    const finalPayload = {
      ...projectData,
      participants,
    };

    console.log("FINAL DATA:", finalPayload);

    // future backend call here

    //  Reset everything
    setProjectData(initialProjectState);
    setParticipants([]);

  alert("Project Created Successfully");
  

  } catch (error) {
    console.error("Project creation failed");
  } finally {
    setCreating(false);
  }
};



  return (
    <div className="min-h-screen  flex justify-center items-start py-10 px-4">
      
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/10">

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create New Project
        </h1>

        {/* Tabs */}
        <div className="flex mb-6 bg-[#313b4a] rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-md text-sm transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-black font-medium"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "Project Info" &&<CreateProjectForm
  onNext={() => setActiveTab("Participants")}
  projectData={projectData}
  setProjectData={setProjectData}
/>
}
          {activeTab === "Participants" && <AddParticipant
    participants={participants}
    setParticipants={setParticipants}
    onCreate={handleCreateProject}
    creating={creating}
  />}
        </div>
      </div>
    </div>
  );
};
