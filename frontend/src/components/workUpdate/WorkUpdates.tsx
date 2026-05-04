import { useEffect, useState } from "react";
import {
  getWorkUpdates,
  editWorkUpdate,
  deleteWorkUpdate,
} from "@/services/workUpdateService";
import { getProject } from "@/services/projectServices";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAuth } from "@/auth/AuthContext";

interface WorkUpdate {
  _id: string;
  description: string;
  attachments: string[];
  createdAt: string;
  createdBy: {
    name: string;
    _id: string;
  };
  projectId: {
    _id: string;

    projectName: string;
  };
}

const WorkUpdate = ({
  slug,
  projectId,
}: {
  slug: string;
  projectId?: string;
}) => {
  const { auth } = useAuth();

  const [updates, setUpdates] = useState<WorkUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  // edit states
  const [editProjectId, setEditProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [editingUpdate, setEditingUpdate] = useState<WorkUpdate | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editFiles, setEditFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProject(slug);
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, [slug]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await getWorkUpdates(slug, { projectId });
      setUpdates(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [slug, projectId]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This work update will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteWorkUpdate(slug, id);
      toast.success("Work update deleted successfully");
      await fetchUpdates();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete work update");
    }
  };

  const handleEditSave = async () => {
    if (!editingUpdate) return;

    try {
      const formData = new FormData();
      formData.append("description", editDescription);

      if (!projectId && editProjectId) {
        formData.append("projectId", editProjectId);
      }

      if (editFiles.length > 0) {
        editFiles.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      await editWorkUpdate(slug, editingUpdate._id, formData);

      toast.success("Work update updated successfully");

      setEditingUpdate(null);
      setEditFiles([]);
      setEditDescription("");

      await fetchUpdates();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update work update");
    }
  };
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-5">
      <h2 className="text-sm font-medium text-base-content mb-4">
        Work Updates
      </h2>

      {loading ? (
        <p className="text-sm text-base-content/60">Loading...</p>
      ) : updates.length === 0 ? (
        <p className="text-sm text-base-content/60">No work updates yet </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm text-base-content">
            {/* Header */}
            <thead>
              <tr className="border-b border-base-300 text-xs uppercase tracking-wide text-base-content/50">
                <th className="py-3 text-left min-w-[120px]">Project</th>
                <th className="py-3 text-left min-w-[200px]">Description</th>
                <th className="py-3 text-left min-w-[120px]">User</th>
                <th className="py-3 text-left min-w-[150px]">Files</th>
                <th className="py-3 text-left min-w-[150px]">Date</th>
                <th className="py-3 text-left min-w-[100px]">Action</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {updates.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-base-200 hover:bg-base-200/40 transition"
                >
                  <td className="py-3">{item.projectId?.projectName}</td>

                  <td className="py-3 max-w-[250px] truncate">
                    {item.description}
                  </td>

                  <td className="py-3">{item.createdBy?.name}</td>

                  <td className="py-3">
                    {item.attachments.length > 0 ? (
                      item.attachments.map((file, i) => (
                        <a
                          key={i}
                          href={file}
                          target="_blank"
                          className="block text-xs text-primary hover:underline"
                        >
                          📎 File {i + 1}
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-base-content/50">
                        No files
                      </span>
                    )}
                  </td>

                  <td className="py-3 text-xs text-base-content/50">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  <td className="py-3 flex gap-2 items-center">
                    {/* EDIT → only creator */}
                    {auth?.user?.userId === item.createdBy._id && (
                      <button
                        onClick={() => {
                          setEditingUpdate(item);
                          setEditDescription(item.description);
                          setEditProjectId(item.projectId?._id || "");
                          setEditFiles([]);
                        }}
                        className="text-primary hover:scale-110 transition"
                      >
                        <MdEdit size={16} />
                      </button>
                    )}

                    {/* DELETE → creator OR admin OR owner */}
                    {(auth?.user?.userId === item.createdBy._id ||
                      ["admin", "owner"].includes(auth?.user?.role)) && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-error hover:scale-110 transition"
                      >
                        <MdDelete size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUpdate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-2xl w-full max-w-md border border-base-300">
            <h2 className="text-sm font-medium mb-4 text-base-content">
              Edit Update
            </h2>

            {!projectId && (
              <select
                value={editProjectId}
                onChange={(e) => setEditProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-base-300 rounded-lg mb-3 bg-base-100"
              >
                <option value="">Select project</option>
                {projects.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            )}

            {/* Description */}
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-base-300 rounded-lg mb-3 bg-base-100"
            />

            {/* Files */}
            <input
              type="file"
              multiple
              onChange={(e) =>
                setEditFiles(e.target.files ? Array.from(e.target.files) : [])
              }
              className="text-xs mb-3"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingUpdate(null)}
                className="px-3 py-1 text-xs border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSave}
                className="px-3 py-1 text-xs bg-primary text-primary-content rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkUpdate;
