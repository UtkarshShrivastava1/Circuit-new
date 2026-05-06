import { useEffect, useRef, useState } from "react";
import { addWorkUpdate } from "@/services/workUpdateService";
import { getProject } from "@/services/projectServices";
import { toast } from "react-toastify";

interface Project {
  _id: string;
  projectName: string;
}

interface WorkUpdateFormProps {
  slug: string;
}

const WorkUpdateForm = ({ slug }: WorkUpdateFormProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProject(slug);
        console.log("Fetched projects:", data);
        setProjects(data.data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProjectId) {
      alert("Please select a project");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("description", description);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await addWorkUpdate(selectedProjectId, slug, formData);

      toast.success(response.message || "Work update submitted successfully");

      setSelectedProjectId("");
      setDescription("");
      setAttachments([]);

if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
    } catch (error) {
      console.error("Error submitting work update:", error);
      toast.error("Failed to submit work update");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="max-w-2xl mx-auto bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
  
  <h2 className="text-sm font-medium text-base-content mb-6">
    Submit Work Update
  </h2>

  <form onSubmit={handleSubmit} className="space-y-5">
    
    {/* Project Dropdown */}
    <div>
      <label className="block text-xs font-medium text-base-content/70 mb-2">
        Project
      </label>

      <select
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        className="w-full px-4 py-3 text-sm bg-base-100 text-base-content border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
        required
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.projectName}
          </option>
        ))}
      </select>
    </div>

    {/* Description */}
    <div>
      <label className="block text-xs font-medium text-base-content/70 mb-2">
        Work Description
      </label>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe today's progress..."
        rows={5}
        className="w-full px-4 py-3 text-sm bg-base-100 text-base-content border border-base-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        required
      />
    </div>

    {/* Attachments */}
    <div>
      <label className="block text-xs font-medium text-base-content/70 mb-2">
        Attach Files
      </label>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full text-sm text-base-content/70 
        file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 
        file:text-sm file:bg-base-200 file:text-base-content 
        hover:file:bg-base-300"
      />

      {/* Selected files preview */}
      {attachments.length > 0 && (
        <div className="mt-2 space-y-1">
          {attachments.map((file, i) => (
            <p key={i} className="text-xs text-base-content/60">
              📎 {file.name}
            </p>
          ))}
        </div>
      )}
    </div>

    {/* Submit Button */}
    <div className="pt-2">
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 text-sm font-medium bg-primary text-primary-content rounded-xl hover:opacity-90 disabled:opacity-50 transition-all duration-200"
      >
        {loading ? "Submitting..." : "Submit Update"}
      </button>
    </div>

  </form>
</div>
   
  );
};

export default WorkUpdateForm;
