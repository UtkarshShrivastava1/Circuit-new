import type { Project } from "../../type/project";

interface Props {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Project) => void;
}

export default function EditProjectModal({
  project,
  open,
  onClose,
  onSave,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-base-100 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Edit Project
        </h3>

        <div className="space-y-4">
          <input
            defaultValue={project.name}
            className="input input-bordered w-full"
          />

          <select
            defaultValue={project.status}
            className="select select-bordered w-full"
          >
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(project)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
