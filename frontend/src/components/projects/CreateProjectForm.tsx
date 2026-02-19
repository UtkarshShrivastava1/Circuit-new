


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
  className="bg-gray-50 rounded-2xl p-6 space-y-6 border border-gray-200 text-gray-700"
>

      {/* Project Name */}
      <div>
        <label className="block mb-1 text-gray-500">Project Name</label>
        <input
          required
          type="text"
          name="projectName"
          value={projectData.projectName}
          onChange={handleChange}
         className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

        />
      </div>

      {/* Project State */}
      <div>
        <label className="block mb-1 text-gray-500">Project State</label>
        <select
          required
          name="projectState"
          value={projectData.projectState}
          onChange={handleChange}
         className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-gray-500">Start Date</label>
          <input
            required
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
           className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

          />
        </div>

        <div>
          <label className="block mb-1 text-gray-500">End Date</label>
          <input
            required
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
           className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

          />
        </div>
      </div>

      {/* Domain */}
      <div>
        <label className="block mb-1 text-gray-500">Project Domain</label>
        <select
          required
          name="domain"
          value={projectData.domain}
          onChange={handleChange}
         className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

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
        <label className="block mb-1 text-gray-500">Description</label>
        <textarea
          required
          name="description"
          value={projectData.description}
          onChange={handleChange}
          rows={3}
        className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

        />
      </div>

      {/* Submit */}
      <button
  type="submit"
  className="w-full font-semibold bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition shadow-sm"
>
  Add Participants
</button>

    </form>
  );
};

export default CreateProjectForm;
