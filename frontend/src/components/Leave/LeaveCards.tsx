import StatusBadge from "@/components/ui/StatusBadge";
import type { LeaveRequest } from "@/type/leave";
import {
  MdBeachAccess,
  MdSick,
  MdWork,
  MdTimelapse,
  MdCalendarToday,
  MdVisibility,
  MdDelete,
} from "react-icons/md";


interface Props {
  requests: LeaveRequest[];
  onView: (leave: LeaveRequest) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICON = {
  casual: MdBeachAccess,
  sick: MdSick,
  paid: MdWork,
  "half-day": MdTimelapse,
};

export default function LeaveCards({
  requests,
  onView,
  onDelete,
}: Props) {
  if (requests.length === 0) {
    return (
      <div className="bg-base-100 border rounded-lg p-6 text-center text-sm text-base-content/60">
        No leave requests yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((leave) => {
        const Icon = TYPE_ICON[leave.type];

        return (
          <div
            key={leave.id}
            className="bg-base-100 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Icon size={20} className="text-primary" />
                <span className="font-semibold capitalize">
                  {leave.type.replace("-", " ")} Leave
                </span>
              </div>

              <StatusBadge status={leave.status} />
            </div>

            {/* DATE */}
            <div className="flex items-center gap-2 mt-3 text-sm text-base-content/70">
              <MdCalendarToday size={16} />
              <span>
                {leave.fromDate}
                {leave.toDate && ` → ${leave.toDate}`}
              </span>
            </div>

            {/* REASON */}
            <p className="mt-3 text-sm line-clamp-2">
              {leave.reason}
            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => onView(leave)}
                className="btn btn-sm btn-outline"
              >
                <MdVisibility size={16} />
                View
              </button>

              <button
                onClick={() => onDelete(leave.id)}
                className="btn btn-sm btn-error btn-outline"
              >
                <MdDelete size={16} />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}