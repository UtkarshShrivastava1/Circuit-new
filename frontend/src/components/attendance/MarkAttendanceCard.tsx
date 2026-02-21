import { useEffect, useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import {
  MdBusiness,
  MdHomeWork,
  MdAccessTime
} from "react-icons/md";

type AttendanceMode = "office" | "wfh" | "half-day";
type AttendanceStatus = "not-marked" | "pending" | "approved";

export default function MarkAttendanceCard() {
  const [mode, setMode] = useState<AttendanceMode>("office");
  const [status, setStatus] = useState<AttendanceStatus>("not-marked");
  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeNow = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* ---------- LOCATION ---------- */
  const fetchLocation = () => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(
          `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        );
        setLoadingLocation(false);
      },
      () => {
        setLocation("Permission denied");
        setLoadingLocation(false);
      }
    );
  };

  useEffect(() => {
    if (mode === "office") fetchLocation();
    else setLocation(null);
  }, [mode]);

  const submitAttendance = () => {
    setStatus("pending");
  };

  return (
    <div className="max-w-md w-full rounded-2xl p-6 bg-base-100 neu">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Mark Attendance
          </h3>
          <p className="text-sm text-base-content/60">{today}</p>
        </div>

        {status !== "not-marked" && <StatusBadge status="pending" />}
      </div>

      {/* TIME */}
      <div className="mt-6 text-center">
        <p className="text-xs text-base-content/60">Check-in time</p>
        <p className="text-3xl font-semibold mt-1 text-base-content">
          {timeNow}
        </p>
      </div>

      {/* MODE SWITCH */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-2 text-base-content">
          Attendance Type
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "office", label: "Office", icon: <MdBusiness/>},
            { id: "wfh", label: "WFH", icon: <MdHomeWork/> },
            { id: "half-day", label: "Half Day", icon: <MdAccessTime/> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as AttendanceMode)}
              className={`
                rounded-xl py-3 text-sm font-medium
                transition-all
                ${mode === item.id ? "neu-inset text-primary" : "neu"}
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* LOCATION */}
      {mode === "office" && (
        <div className="mt-5 rounded-xl p-4 neu-inset">
          <p className="text-xs text-base-content/60 mb-1">Location</p>
          <p className="text-sm">
            {loadingLocation ? "Fetching location…" : location ?? "Not available"}
          </p>
        </div>
      )}

      {/* INFO */}
      {(mode === "wfh" || mode === "half-day") && (
        <p className="mt-4 text-xs text-base-content/60">
          {mode === "half-day"
            ? "Half-day attendance requires admin approval."
            : "Work from home attendance does not require location."}
        </p>
      )}

      {/* ACTION */}
      <div className="mt-6">
        {status === "not-marked" ? (
          <Button className="w-full" onClick={submitAttendance}>
            Submit Attendance
          </Button>
        ) : (
          <div className="rounded-xl p-4 text-center neu-inset">
            <p className="text-sm font-medium">Attendance submitted</p>
            <p className="text-xs text-base-content/60 mt-1">
              Awaiting admin approval
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
