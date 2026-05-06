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
  MdEventBusy,
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
      <div className="flex flex-col items-center justify-center p-12 bg-base-100 border border-base-300 rounded-2xl border-dashed">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/40">
          <MdEventBusy size={32} />
        </div>
        <h3 className="text-lg font-medium text-base-content mb-1">
          No Leave Requests
        </h3>
        <p className="text-sm text-base-content/60 max-w-sm text-center">
          You haven't applied for any leaves yet. When you do, they will appear here.
        </p>
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