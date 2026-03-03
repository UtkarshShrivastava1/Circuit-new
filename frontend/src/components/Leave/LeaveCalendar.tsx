import { useMemo } from "react";
import type { LeaveRequest } from "@/type/leave";

interface Props {
  requests: LeaveRequest[];
  teamLeaves?: LeaveRequest[];
}

export default function LeaveCalendar({
  requests,
  teamLeaves = [],
}: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  /* ================= GENERATE DAYS ================= */

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysArray = useMemo(() => {
    const days: (number | null)[] = [];

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [month]);

  /* ================= HELPER ================= */

  const isLeaveDay = (
    day: number,
    type: "self" | "team"
  ) => {
    const dateStr = new Date(
      year,
      month,
      day
    )
      .toISOString()
      .split("T")[0];

    const source =
      type === "self" ? requests : teamLeaves;

    return source.find(
      (leave) =>
        leave.status === "approved" &&
        dateStr >= leave.fromDate &&
        dateStr <=
          (leave.toDate || leave.fromDate)
    );
  };

  /* ================= CONFLICT CHECK ================= */

  const hasConflict = (day: number) => {
    const selfLeave = isLeaveDay(day, "self");
    const teamLeave = isLeaveDay(day, "team");

    return selfLeave && teamLeave;
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-6">

      <h3 className="text-lg font-semibold mb-4">
        Leave Calendar
      </h3>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-base-content/60">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          )
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((day, index) => {
          if (!day)
            return (
              <div key={index} className="h-20" />
            );

          const self = isLeaveDay(day, "self");
          const team = isLeaveDay(day, "team");
          const conflict = hasConflict(day);

          return (
            <div
              key={index}
              className={`h-20 rounded-lg border p-2 text-sm relative
                ${
                  conflict
                    ? "bg-error/20 border-error"
                    : self
                    ? "bg-primary/20 border-primary"
                    : team
                    ? "bg-warning/20 border-warning"
                    : "bg-base-200"
                }`}
            >
              <div className="font-medium">
                {day}
              </div>

              {self && (
                <div className="absolute bottom-1 left-1 text-xs text-primary">
                  You
                </div>
              )}

              {team && (
                <div className="absolute bottom-1 right-1 text-xs text-warning">
                  Team
                </div>
              )}

              {conflict && (
                <div className="absolute top-1 right-1 text-xs text-error">
                  ⚠
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-primary/40 rounded" />
          Your Leave
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-warning/40 rounded" />
          Team Leave
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-error/40 rounded" />
          Conflict
        </div>
      </div>
    </div>
  );
}