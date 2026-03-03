import { useState } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import type { LeaveRequest } from "@/type/leave";
import Button from "@/components/ui/Button";

interface Props {
  leave: LeaveRequest | null;
  onClose: () => void;
  onUpdate: (leave: LeaveRequest) => void;
}

export default function LeaveDrawer({
  leave,
  onClose,
  onUpdate,
}: Props) {
  if (!leave) return null;

  const [edited, setEdited] = useState({
    ...leave,
    attachments: leave.attachments || [],
  });

  /* ================= ADD ATTACHMENT ================= */
  const handleAddFiles = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    setEdited((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));
  };

  /* ================= REMOVE FILE ================= */
  const removeFile = (index: number) => {
    setEdited((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-md bg-base-100 h-full shadow-xl p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Leave Details
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="space-y-5">

          {/* TYPE */}
          <div>
            <label className="text-xs text-base-content/60">
              Type
            </label>
            <input
              value={edited.type}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  type: e.target.value,
                })
              }
              className="input input-bordered w-full"
            />
          </div>

          {/* FROM */}
          <div>
            <label className="text-xs text-base-content/60">
              From Date
            </label>
            <input
              value={edited.fromDate}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  fromDate: e.target.value,
                })
              }
              className="input input-bordered w-full"
            />
          </div>

          {/* TO */}
          <div>
            <label className="text-xs text-base-content/60">
              To Date
            </label>
            <input
              value={edited.toDate}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  toDate: e.target.value,
                })
              }
              className="input input-bordered w-full"
            />
          </div>

          {/* REASON */}
          <div>
            <label className="text-xs text-base-content/60">
              Reason
            </label>
            <textarea
              value={edited.reason}
              onChange={(e) =>
                setEdited({
                  ...edited,
                  reason: e.target.value,
                })
              }
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* ================= ATTACHMENTS ================= */}
          <div>
            <label className="text-xs text-base-content/60">
              Attachments
            </label>

            {/* Existing Files */}
            {edited.attachments.length > 0 ? (
              <div className="space-y-3 mt-2">
                {edited.attachments.map(
                  (file: any, index: number) => {
                    const isImage =
                      file.type?.startsWith("image/");

                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {isImage ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-base-200 flex items-center justify-center rounded-md text-xs">
                              FILE
                            </div>
                          )}

                          <div className="text-sm truncate max-w-[150px]">
                            {file.name}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            removeFile(index)
                          }
                          className="btn btn-xs btn-error btn-outline"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="text-xs text-base-content/50 mt-1">
                No attachments
              </p>
            )}

            {/* Add New */}
            <input
              type="file"
              multiple
              onChange={handleAddFiles}
              className="file-input file-input-bordered w-full mt-3"
            />
          </div>

          {/* SAVE */}
          <Button
            variant="primary"
            onClick={() => {
              onUpdate(edited);
              onClose();
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}