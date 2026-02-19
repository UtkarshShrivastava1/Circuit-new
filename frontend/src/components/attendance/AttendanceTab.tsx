type AttendanceTab = "records" | "mark";

interface Props {
  value: AttendanceTab;
  onChange: (tab: AttendanceTab) => void;
}

export default function AttendanceTabs({ value, onChange }: Props) {
  return (
    <div className="mb-4 flex justify-center md:justify-start">
      <div
        className="
          flex gap-1 p-1 rounded-xl
          bg-base-200
          shadow-inner
        "
      >
        <button
          onClick={() => onChange("records")}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${
              value === "records"
                ? "bg-base-100 shadow text-primary"
                : "text-base-content/70 hover:bg-base-100/60"
            }
          `}
        >
          📋 Records
        </button>

        <button
          onClick={() => onChange("mark")}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${
              value === "mark"
                ? "bg-base-100 shadow text-primary"
                : "text-base-content/70 hover:bg-base-100/60"
            }
          `}
        >
          🕒 Mark Attendance
        </button>
      </div>
    </div>
  );
}
