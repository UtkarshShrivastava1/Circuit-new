import React from "react";
import type { SalesTask } from "../../pages/Sales/TasksList";

type EditTaskData = SalesTask & {
  description?: string;
  category?: string;
  team?: string;
  lead?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  dueTime?: string;
  reminderDateTime?: string;
  expectedDealValue?: number;
  opportunityStage?: string;
  probability?: number;
  closingDate?: string;
  region?: string;
  communicationType?: string;
  meetingMode?: "Online" | "Offline" | "";
  meetingLocation?: string;
  meetingLink?: string;
  completionNotes?: string;
  outcome?: string;
  reasonForDelay?: string;
  visibility?: string;
  tags?: string[];
  attachments?: any[];
};

interface Props {
  editModalOpen: boolean;
  taskToEdit: EditTaskData | null;
  setTaskToEdit: React.Dispatch<React.SetStateAction<SalesTask | null>>;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  salesReps: any[];
  getRepName: (id: string) => string;
  customers?: any[];
  teams?: any[];
   accounts: any[];
  accountsLoading: boolean;
}

const SalesEditTaskModal: React.FC<Props> = ({
  editModalOpen,
  taskToEdit,
  setTaskToEdit,
  setEditModalOpen,
  handleEditSubmit,
  salesReps,
  accounts,
  accountsLoading,
  getRepName,
  customers = [],
  teams = [],
}) => {
  console.log(accounts[0])
 const selectedRep = salesReps.find(
  (rep) => rep.memberId?._id === taskToEdit?.assignedTo
);
console.log(selectedRep)
const availableTeams = selectedRep?.team || [];

const selectedAccount = accounts.find(
  (account) => account._id === taskToEdit?.customer
);

const contactName = selectedAccount?.primaryContact
  ? `${selectedAccount.primaryContact.firstName || ""} ${
      selectedAccount.primaryContact.lastName || ""
    }`.trim()
  : "";

const contactPhone = selectedAccount?.primaryContact?.phone
  ? `${selectedAccount.primaryContact.phone.countryCode || ""} ${
      selectedAccount.primaryContact.phone.number || ""
    }`.trim()
  : "";

const contactEmail = selectedAccount?.primaryContact?.email || "";

  const updateField = (field: keyof EditTaskData, value: any) => {
    setTaskToEdit((prev) =>
      prev ? ({ ...prev, [field]: value } as SalesTask) : null
    );
  };

  const closeModal = () => {
    setEditModalOpen(false);
  };

  if (!taskToEdit) return null;

  const isOverdue =
    taskToEdit.dueDate &&
    new Date(taskToEdit.dueDate) < new Date() &&
    taskToEdit.status !== "Completed";

  return (
    <dialog className={`modal ${editModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-6xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-5">Edit Task</h3>

        <form onSubmit={handleEditSubmit} className="space-y-6">

          {/* BASIC DETAILS */}
          <section>
            <h4 className="font-semibold text-base mb-3">Basic Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">Task Title</label>
                <input
                  className="input input-bordered"
                  value={taskToEdit.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Task Type</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.type || ""}
                  onChange={(e) => updateField("type", e.target.value)}
                >
                  <option value="">Select Type</option>
                  {[
                    "Lead Follow-up",
                    "Client Meeting",
                    "Demo",
                    "Quotation",
                    "Proposal Submission",
                    "Contract Negotiation",
                    "Payment Collection",
                    "Upselling",
                    "Customer Visit",
                    "Other",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Category</label>
                <input
                  className="input input-bordered"
                  value={taskToEdit.category || ""}
                  onChange={(e) => updateField("category", e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">Priority</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.priority || "Medium"}
                  onChange={(e) => updateField("priority", e.target.value)}
                >
                  {["Low", "Medium", "High", "Urgent"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Status</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.status || "Pending"}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  {[
                    "Pending",
                    "In Progress",
                    "On Hold",
                    "Completed",
                    "Cancelled",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Description</label>
                <textarea
                  className="textarea textarea-bordered"
                  value={taskToEdit.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ASSIGNMENT */}
          <section>
            <h4 className="font-semibold text-base mb-3">Assignment</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Assigned To</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.assignedTo || ""}
                  onChange={(e) => {
    const repId = e.target.value;

    setTaskToEdit((prev) =>
      prev
        ? { ...prev, assignedTo: repId, team: "" }
        : prev
    );
  }}
                >
                  <option value="">Select Employee</option>
                  {salesReps.map((rep: any) => {
                    const id = rep.memberId?._id || rep._id;
                    const name =
                      rep.fullName || rep.memberId?.name || "Unknown";

                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Team</label>
             <select
             className="select select-bordered"
  value={taskToEdit?.team || ""}
  onChange={(e) =>
    setTaskToEdit((prev) =>
      prev ? { ...prev, team: e.target.value } : prev
    )
  }
  disabled={!selectedRep}
>
  <option value="">Select Team</option>

  {availableTeams.map((team: string) => (
    <option key={team} value={team}>
      {team}
    </option>
  ))}
</select>
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* CUSTOMER / LEAD */}
          <section>
            <h4 className="font-semibold text-base mb-3">Customer / Lead</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">Customer</label>
            <select
             className="select select-bordered"
  value={taskToEdit?.customer || ""}
  onChange={(e) => {
    const accountId = e.target.value;

    setTaskToEdit((prev) =>
      prev
        ? {
            ...prev,
            customer: accountId,
          }
        : prev
    );
  }}
  disabled={accountsLoading}
>
  <option value="">
    {accountsLoading ? "Loading customers..." : "Select Customer"}
  </option>

  {accounts.map((account) => (
    <option key={account._id} value={account._id}>
      {account.accountName || account.name}
    </option>
  ))}
</select>
              </div>

              <div className="form-control">
                <label className="label">Lead</label>
                <input
                  className="input input-bordered"
                  value={taskToEdit.lead || ""}
                  onChange={(e) => updateField("lead", e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">Contact Person</label>
                <input
                  className="input input-bordered"
                value={contactName}
               readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">Phone</label>
                <input
                 className="input input-bordered"
 value={contactPhone}
  readOnly
/>
              </div>

              <div className="form-control">
                <label className="label">Email</label>
                <input
                 className="input input-bordered"
 value={contactEmail}
  readOnly
/>

              </div>
            </div>
          </section>

          <div className="divider" />

          {/* SCHEDULING */}
          <section>
            <h4 className="font-semibold text-base mb-3">Scheduling</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                [
                  ["startDate", "Start Date", "date"],
                  ["dueDate", "Due Date", "date"],
                  ["dueTime", "Due Time", "time"],
                  ["reminderDateTime", "Reminder", "datetime-local"],
                  ["followUpDate", "Follow-up Date", "date"],
                ] as const
              ).map(([field, label, type]) => (
                <div className="form-control" key={field}>
                  <label className="label">{label}</label>
                  <input
                    type={type}
                    className="input input-bordered"
                    value={(taskToEdit[field] as string) || ""}
                    onChange={(e) => updateField(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* SALES DETAILS */}
          <section>
            <h4 className="font-semibold text-base mb-3">Sales Details</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">Expected Deal Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="input input-bordered"
                  value={taskToEdit.expectedDealValue ?? taskToEdit.dealValue ?? 0}
                  onChange={(e) =>
                    updateField("expectedDealValue", Number(e.target.value))
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">Opportunity Stage</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.opportunityStage || taskToEdit.stage || "N/A"}
                  onChange={(e) =>
                    updateField("opportunityStage", e.target.value)
                  }
                >
                  {[
                    "N/A",
                    "New Lead",
                    "Qualified",
                    "Proposal Sent",
                    "Negotiation",
                    "Won",
                    "Lost",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input input-bordered"
                  value={taskToEdit.probability ?? 0}
                  onChange={(e) =>
                    updateField("probability", Number(e.target.value))
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">Closing Date</label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={taskToEdit.closingDate || ""}
                  onChange={(e) => updateField("closingDate", e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">Region</label>
                <input
                  className="input input-bordered"
                  value={taskToEdit.region || ""}
                  onChange={(e) => updateField("region", e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* COMMUNICATION */}
          <section>
            <h4 className="font-semibold text-base mb-3">Communication</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">Communication Type</label>
                <input
                  className="input input-bordered"
                  value={taskToEdit.communicationType || ""}
                  onChange={(e) =>
                    updateField("communicationType", e.target.value)
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">Meeting Mode</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.meetingMode || ""}
                  onChange={(e) => updateField("meetingMode", e.target.value)}
                >
                  <option value="">Select Mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {taskToEdit.meetingMode === "Online" && (
                <div className="form-control">
                  <label className="label">Meeting Link</label>
                  <input
                    type="url"
                    className="input input-bordered"
                    value={taskToEdit.meetingLink || ""}
                    onChange={(e) => updateField("meetingLink", e.target.value)}
                  />
                </div>
              )}

              {taskToEdit.meetingMode === "Offline" && (
                <div className="form-control">
                  <label className="label">Meeting Location</label>
                  <input
                    className="input input-bordered"
                    value={taskToEdit.meetingLocation || ""}
                    onChange={(e) =>
                      updateField("meetingLocation", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </section>

          <div className="divider" />

          {/* PROGRESS & OUTCOME */}
          <section>
            <h4 className="font-semibold text-base mb-3">Progress & Outcome</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input input-bordered"
                  value={taskToEdit.progress ?? 0}
                  onChange={(e) =>
                    updateField("progress", Number(e.target.value))
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">Outcome</label>
                <input
                  className="input input-bordered"
                  value={taskToEdit.outcome || ""}
                  onChange={(e) => updateField("outcome", e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">Visibility</label>
                <select
                  className="select select-bordered"
                  value={taskToEdit.visibility || "Private"}
                  onChange={(e) => updateField("visibility", e.target.value)}
                >
                  <option value="Private">Private</option>
                  <option value="Team">Team</option>
                  <option value="Public">Public</option>
                </select>
              </div>

              <div className="form-control md:col-span-2 lg:col-span-3">
                <label className="label">Completion Notes</label>
                <textarea
                  className="textarea textarea-bordered"
                  value={taskToEdit.completionNotes || ""}
                  onChange={(e) =>
                    updateField("completionNotes", e.target.value)
                  }
                />
              </div>

              {(taskToEdit.status === "On Hold" || isOverdue) && (
                <div className="form-control md:col-span-2 lg:col-span-3">
                  <label className="label">Reason for Delay</label>
                  <textarea
                    className="textarea textarea-bordered"
                    value={taskToEdit.reasonForDelay || ""}
                    onChange={(e) =>
                      updateField("reasonForDelay", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="form-control md:col-span-2 lg:col-span-3">
                <label className="label">Tags (comma separated)</label>
                <input
                  className="input input-bordered"
                  value={(taskToEdit.tags || []).join(", ")}
                  onChange={(e) =>
                    updateField(
                      "tags",
                      e.target.value.split(",").map((tag) => tag.trim())
                    )
                  }
                />
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* ATTACHMENTS */}
          <section>
            <h4 className="font-semibold text-base mb-3">Attachments</h4>

            <input
              type="file"
              multiple
              className="file-input file-input-bordered w-full"
              onChange={(e) =>
                updateField(
                  "attachments",
                  Array.from(e.target.files || [])
                )
              }
            />

            <p className="text-xs text-base-content/60 mt-2">
              Select files to attach to this task.
            </p>
          </section>

          {/* ACTIONS */}
          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default SalesEditTaskModal;