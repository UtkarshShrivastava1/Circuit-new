


import React from "react";

interface ProjectData {
  projectName: string;
  projectState: string;
  startDate: string;
  endDate: string;
  domain: string;
  description: string;
}

interface Props {
  onNext: () => void;
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

const CreateProjectForm: React.FC<Props> = ({
  onNext,
  projectData,
  setProjectData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setProjectData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // page reload prevent
    onNext(); // go to participants tab
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0f172a] rounded-xl text-white p-6 space-y-4 text-sm"
    >
      {/* Project Name */}
      <div>
        <label className="block mb-1 text-gray-300">Project Name</label>
        <input
          required
          type="text"
          name="projectName"
          value={projectData.projectName}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-[#1e293b] border border-white/10 outline-none focus:border-white/30"
        />
      </div>

      {/* Project State */}
      <div>
        <label className="block mb-1 text-gray-300">Project State</label>
        <select
          required
          name="projectState"
          value={projectData.projectState}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-[#1e293b] border border-white/10"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-gray-300">Start Date</label>
          <input
            required
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] border border-white/10"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">End Date</label>
          <input
            required
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-[#1e293b] border border-white/10"
          />
        </div>
      </div>

      {/* Domain */}
      <div>
        <label className="block mb-1 text-gray-300">Project Domain</label>
        <select
          required
          name="domain"
          value={projectData.domain}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-[#1e293b] border border-white/10"
        >
          <option value="">Select Domain</option>
          <option value="web">Web Development</option>
          <option value="app">App Development</option>
          <option value="ai">AI / ML</option>
          <option value="socialMedia">Social Media</option>
          <option value="blockChain">Block Chain</option>
          <option value="contentWriting">Content Writing</option>
          <option value="contentCreation">Content Creation</option>
          <option value="testing">Testing</option>
          <option value="softwareDeveloper">Software Developer</option>
          
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 text-gray-300">Description</label>
        <textarea
          required
          name="description"
          value={projectData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 rounded-md bg-[#1e293b] border border-white/10"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full font-semibold bg-white text-black py-2 rounded-md hover:opacity-90 transition"
      >
        Add Participants
      </button>
    </form>
  );
};

export default CreateProjectForm;
