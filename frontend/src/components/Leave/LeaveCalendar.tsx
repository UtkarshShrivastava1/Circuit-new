import { useMemo } from "react";
import type { LeaveRequest } from "@/type/leave";

interface Props {
  requests: LeaveRequest[];
  teamLeaves?: LeaveRequest[];
  officeHolidays?: { date: string; title: string }[];
  wfhDays?: string[];
  isAdmin?: boolean;
  onDateClick?: (dateStr: string) => void;
}

export default function LeaveCalendar({
  requests,
  teamLeaves = [],
  officeHolidays = [],
  wfhDays = [],
  isAdmin = false,
  onDateClick,
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

  const getDateStr = (day: number) => {
    const d = new Date(year, month, day);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const isLeaveDay = (
    day: number,
    type: "self" | "team"
  ) => {
    const dateStr = getDateStr(day);

    const source =
      type === "self" ? requests : teamLeaves;

    return source.filter(
      (leave) =>
        leave.status === "approved" &&
        dateStr >= leave.fromDate &&
        dateStr <=
          (leave.toDate || leave.fromDate)
    );
  };

  /* ================= CONFLICT CHECK ================= */

  const hasConflict = (day: number) => {
    const selfLeaves = isLeaveDay(day, "self");
    const teamLeaves = isLeaveDay(day, "team");

    return selfLeaves.length > 0 && teamLeaves.length > 0;
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

          const dateStr = getDateStr(day);
          const selfLeaves = isLeaveDay(day, "self");
          const teamLeavesForDay = isLeaveDay(day, "team");
          const conflict = hasConflict(day);
          const holiday = officeHolidays.find((h) => h.date === dateStr);
          const isWfh = wfhDays.includes(dateStr);

          const isSelf = selfLeaves.length > 0;
          const isTeam = teamLeavesForDay.length > 0;

          return (
            <div
              key={index}
              onClick={() => onDateClick?.(dateStr)}
              className={`h-20 rounded-lg border p-2 text-sm relative
                ${onDateClick ? "cursor-pointer hover:border-primary transition-colors" : ""}
                ${
                  holiday
                    ? "bg-info/20 border-info"
                    : conflict
                    ? "bg-error/20 border-error"
                    : isSelf
                    ? "bg-primary/20 border-primary"
                    : isTeam
                    ? "bg-warning/20 border-warning"
                    : isWfh
                    ? "bg-success/20 border-success"
                    : "bg-base-200"
                }`}
            >
              <div className="font-medium">
                {day}
              </div>

              {holiday && (
                <div className="absolute top-1 right-1 text-xs text-info font-semibold truncate max-w-[80%]">
                  {holiday.title}
                </div>
              )}

              {isSelf && (
                <div className="absolute bottom-1 left-1 text-[10px] sm:text-xs font-semibold text-primary truncate max-w-[90%]">
                  {isAdmin 
                    ? selfLeaves.length === 1 
                      ? selfLeaves[0].employee 
                      : `${selfLeaves.length} on leave`
                    : "You"}
                </div>
              )}

              {isTeam && (
                <div className="absolute bottom-1 right-1 text-xs text-warning">
                  Team
                </div>
              )}

              {isWfh && !isSelf && !holiday && (
                <div className="absolute bottom-1 left-1 text-xs text-success font-medium">
                  WFH
                </div>
              )}

              {conflict && !holiday && (
                <div className="absolute top-1 right-1 text-xs text-error">
                  ⚠
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-primary/40 rounded" />
          {isAdmin ? "Employee Leave" : "Your Leave"}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-warning/40 rounded" />
          Team Leave
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-error/40 rounded" />
          Conflict
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-info/40 rounded" />
          Office Holiday
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-success/40 rounded" />
          WFH
        </div>
      </div>
    </div>
  );
}