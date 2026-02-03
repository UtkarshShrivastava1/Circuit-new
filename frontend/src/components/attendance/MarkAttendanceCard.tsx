import { useEffect, useState } from "react";
import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";

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

  /* ---------- SUBMIT ---------- */
  const submitAttendance = () => {
    setStatus("pending");

    // later → API payload
    /*
      {
        date,
        mode,
        location,
        checkInTime,
      }
    */
  };

  return (
    <div className="max-w-md w-full bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            Mark Attendance
          </h3>
          <p className="text-sm text-base-content/60">
            {today}
          </p>
        </div>

        {status !== "not-marked" && (
          <StatusBadge status="pending" />
        )}
      </div>

      {/* TIME */}
      <div className="mt-5 text-center">
        <p className="text-xs text-base-content/60">Check-in time</p>
        <p className="text-3xl font-semibold text-base-content mt-1">
          {timeNow}
        </p>
      </div>

      {/* MODE SELECT */}
     {/* MODE SELECT */}
<div className="mt-6">
  <p className="text-sm font-medium text-base-content mb-2">
    Attendance Type
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
    <Button
      variant={mode === "office" ? "primary" : "outline"}
      className="h-10 flex  items-center justify-center gap-1"
      onClick={() => setMode("office")}
    >
      <span className="text-lg">🏢</span>
      <span className="text-xs text-base-content">Office</span>
    </Button>

    <Button
      variant={mode === "wfh" ? "primary" : "outline"}
      className="h-10 flex  items-center justify-center gap-1"
      onClick={() => setMode("wfh")}
    >
      <span className="text-lg">🏠</span>
      <span className="text-xs text-base-content">WFH</span>
    </Button>

    <Button
      variant={mode === "half-day" ? "primary" : "outline"}
      className="h-10 flex  items-center justify-center gap-1 "
      onClick={() => setMode("half-day")}
    >
      <span className="text-lg">⏳</span>
      <span className="text-xs text-base-content">Half Day</span>
    </Button>
  </div>
</div>


      {/* LOCATION (Office only) */}
      {mode === "office" && (
        <div className="mt-4 bg-base-200 border border-base-300 rounded-lg p-3">
          <p className="text-xs text-base-content/60 mb-1">
            Location
          </p>

          {loadingLocation ? (
            <p className="text-sm">Fetching location…</p>
          ) : (
            <p className="text-sm text-base-content">
              {location ?? "Not available"}
            </p>
          )}
        </div>
      )}

      {/* INFO */}
      {(mode === "half-day" || mode === "wfh") && (
        <div className="mt-4 text-xs text-base-content/60">
          {mode === "half-day"
            ? "Half day attendance requires admin approval"
            : "Work from home attendance does not require location"}
        </div>
      )}

      {(mode === "wfh" || mode === "half-day") && (
  <textarea
    className="textarea textarea-bordered w-full"
    placeholder={
      mode === "wfh"
        ? "Reason for WFH"
        : "Reason for Half Day"
    }
    value={reason}
    onChange={(e) => setReason(e.target.value)}
  />
)}


      

      {/* ACTION */}
      <div className="mt-6">
        {status === "not-marked" ? (
         <Button
            variant="primary"
            className="w-full"
            disabled={status !== "not-marked"}
            onClick={submitAttendance}
          >
            Submit Attendance
          </Button>
        ) : (
          <div className="bg-base-200 border border-base-300 text-base-content rounded-lg p-4 text-center">
            <p className="text-sm font-medium">
              Attendance submitted
            </p>
            <p className="text-xs text-base-content/60 mt-1">
              Awaiting admin approval
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
