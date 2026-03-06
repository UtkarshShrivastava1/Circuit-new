import type { ProjectData } from "@/pages/CreateProject";
import React from "react";


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
    >,
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
      // className="bg-gray-50 rounded-2xl p-6 space-y-6  text-gray-700"
      className="space-y-5 sm:space-y-6"
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
          //  className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
          //  className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
        >
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-gray-500">Start Date</label>
          <input
            required
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            //  className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
            //  className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
          onChange={(e) => {
            const value = e.target.value;
            setProjectData((prev) => ({
              ...prev,
              domain: value,
              customDomain: value === "other" ? "" : prev.customDomain,
            }));
          }}
          className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
          <option value="other">Other</option>
        </select>
        {projectData.domain === "other" && (
          <input
            type="text"
            placeholder="Enter Custom Domain"
            value={projectData.customDomain || ""}
            onChange={(e) =>
              setProjectData((prev) => ({
                ...prev,
                customDomain: e.target.value,
              }))
            }
            className="w-full mt-3 px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
        )}
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
          // className="w-full p-3 rounded-xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
        />
      </div>

      {/* Submit */}
      {/* <button
  type="submit"
  className="w-full font-semibold bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition shadow-sm"
>
  Add Participants
</button> */}

      <div className="pt-4 sm:pt-6">
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-primary text-primary-content font-semibold hover:opacity-90 transition-all shadow-md"
        >
          Add Participants
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
