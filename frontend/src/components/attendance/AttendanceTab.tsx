import {Clock ,NotepadText } from "lucide-react"

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
          onClick={() => onChange("mark")}
          className={`
           flex gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${
              value === "mark"
                ? "bg-base-100 shadow text-primary"
                : "text-base-content/70 hover:bg-base-100/60"
            }
          `}
        >
          <Clock/> Mark Attendance
        </button>

        <button
          onClick={() => onChange("records")}
          className={`
            flex gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all
            ${
              value === "records"
                ? "bg-base-100 shadow text-primary"
                : "text-base-content/70 hover:bg-base-100/60"
            }
          `}
        >
          <NotepadText/> Records
        </button>

        
      </div>
    </div>
  );
}
