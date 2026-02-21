import StatusBadge from "@/components/ui/StatusBadge";
import type { LeaveRequest } from "@/type/leave";
import {
  MdBeachAccess,
  MdSick,
  MdWork,
  MdTimelapse,
  MdCalendarToday,
} from "react-icons/md";

interface Props {
  requests?: LeaveRequest[];
  empty?: boolean;
}

const TYPE_ICON = {
  casual: MdBeachAccess,
  sick: MdSick,
  paid: MdWork,
  "half-day": MdTimelapse,
};

export default function LeaveCards({
  requests = [],
  empty = false,
}: Props) {
  if (empty || requests.length === 0) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-lg p-6 text-center text-sm text-base-content/60">
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
            className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
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
            <p className="mt-3 text-sm text-base-content/80 line-clamp-2">
              {leave.reason || "No reason provided"}
            </p>

            {/* FOOTER */}
            <div className="mt-4 text-xs text-base-content/50">
              Request ID: {leave.id}
            </div>
          </div>
        );
      })}
    </div>
  );
}
