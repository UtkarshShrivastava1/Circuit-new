import { useState } from "react";
import { MdClose, MdCalendarToday, MdDescription } from "react-icons/md";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DateField from "@/components/ui/DateField";
import AttachmentInput from "@/components/ui/AttachmentInput";
import {
  MdBeachAccess,
  MdSick,
  MdWork,
  MdTimelapse,
} from "react-icons/md";

export const LEAVE_TYPES = [
  {
    value: "casual",
    label: "Casual Leave",
    icon: MdBeachAccess,
  },
  {
    value: "sick",
    label: "Sick Leave",
    icon: MdSick,
  },
  {
    value: "paid",
    label: "Paid Leave",
    icon: MdWork,
  },
  {
    value: "half-day",
    label: "Half Day",
    icon: MdTimelapse,
  },
];


interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: (leave: any) => void;
}

export default function ApplyLeaveModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  const [leave, setLeave] = useState({
    type: "casual",
    fromDate: "",
    toDate: "",
    reason: "",
    attachments: [] as File[],
    status: "pending",
  });

  const isHalfDay = leave.type === "half-day";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h3 className="text-lg font-semibold text-base-content">
            Apply Leave
          </h3>

          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 space-y-6">

          {/* LEAVE TYPE */}
          <div>
            <p className="text-xs font-medium text-base-content/60 mb-1">
              Leave Type
            </p>

            <Select
              value={leave.type}
              onChange={(e) =>
                setLeave({ ...leave, type: e.target.value })
              }
              className="w-full"
            >
              <option value="casual"><MdBeachAccess/> Casual Leave</option>
              <option value="sick"><MdSick/> Sick Leave</option>
              <option value="paid"><MdWork/> Paid Leave</option>
              <option value="half-day"><MdTimelapse/>  Half Day</option>
            </Select>

             
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateField
              label="From"
              value={leave.fromDate}
              onChange={(date) =>
                setLeave({ ...leave, fromDate: date })
              }
            />

            {!isHalfDay && (
              <DateField
                label="To"
                value={leave.toDate}
                onChange={(date) =>
                  setLeave({ ...leave, toDate: date })
                }
              />
            )}
          </div>

          {/* REASON */}
          <div>
            <p className="text-xs font-medium text-base-content/60 mb-1">
              Reason
            </p>

            <div className="relative">
              <MdDescription className="absolute left-3 top-3 text-base-content/40" />

              <textarea
                placeholder="Explain the reason for leave..."
                value={leave.reason}
                onChange={(e) =>
                  setLeave({ ...leave, reason: e.target.value })
                }
                className="textarea textarea-bordered w-full pl-10 resize-none border-2"
                rows={4}
              />
            </div>
          </div>

          {/* ATTACHMENTS */}
          <AttachmentInput
            files={leave.attachments}
            onChange={(files) =>
              setLeave({ ...leave, attachments: files })
            }
          />

          {/* PREVIEW */}
          <div className="bg-base-200 border border-base-300 rounded-lg p-4 text-sm">
            <p className="font-medium mb-1">Leave Summary</p>

            <p className="text-base-content/70">
              {leave.type} leave from{" "}
              <strong>{leave.fromDate || "—"}</strong>{" "}
              {!isHalfDay && (
                <>
                  to <strong>{leave.toDate || "—"}</strong>
                </>
              )}
            </p>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t border-base-300 flex justify-between items-center">
          <p className="text-xs text-base-content/60">
            Leave request will go for admin approval
          </p>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={!leave.fromDate || !leave.reason}
              onClick={() => {
                onSubmit?.(leave);
                onClose();
              }}
            >
              Submit Leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
