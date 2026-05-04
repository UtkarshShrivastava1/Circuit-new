import React, { useState, useMemo, Suspense, useEffect } from "react";
const AttendanceFilters = React.lazy(() => import("./AttendanceFilter"));
const EmptyState = React.lazy(() => import("../ui/EmptyState"));
const AttendanceSummaryCards = React.lazy(
  () => import("../attendance/AttendanceSummaryCards"),
);
// const AttendanceFilterDrawer = React.lazy(()=> import("../attendance/AttendanceFilterDrawer"))
import AttendanceFilterDrawer from "../attendance/AttendanceFilterDrawer";

const StatusPills = React.lazy(() => import("./FilertByStatus"));
//  import AttendanceMobileTopBar from "../attendance/AttendanceFilterDrawer"
import AttendanceTable from "../attendance/AttendanceTable";

import useAttendanceFilters from "../attendance/UseAttendanceFilter";
import type {
  AttendanceRecord,
  UserRole,
  AttendanceStatus,
} from "@/type/attendance";
import { Clock, NotepadText } from "lucide-react";
import MobileTabs from "../attendance/MobileTabs";
import AttendanceMobileTopBar from "./AttendanceMobileTopBar";
import { useAuth } from "@/auth/AuthContext";
import { getAttendance } from "@/services/attendanceService";
import Button from "../ui/Button";

type AttendanceTab = "records" | "mark";
type Status = "all" | "approved" | "pending" | "absent";

const AdminAttendance = () => {
  const { auth } = useAuth();
  const user = auth?.user;
  const userId = user?.userId;
  const slug = auth?.slug;
  const role: UserRole = user?.role || "admin";

  const [activeTab, setActiveTab] = useState<AttendanceTab>("records");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<{
    name?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const [records, setRecords] = useState<
    (AttendanceRecord & {
      attendanceDocId: string;
      employeeId: string;
      mode?: string;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex((prev) => prev + 1);

  // Listen for real-time notifications (e.g. attendanceMarked) and auto-refresh the table

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getAttendance(slug, filters)
        .then((res) => {
          // The server returns { success: true, data: [...] }, we need to target the array
          const responseData = res.data?.data || res.data || [];
          const arr = Array.isArray(responseData) ? responseData : [];

          const formattedRecords: (AttendanceRecord & {
            attendanceDocId: string;
            employeeId: string;
            mode?: string;
          })[] = [];
          arr.forEach((doc: any) => {
            const formattedDate = new Date(doc.date).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              },
            );

            (doc.records || []).forEach((record: any) => {
              const employeeName =
                typeof record.employee === "object" && record.employee?.name
                  ? record.employee.name
                  : "Unknown";
              const employeeId = record.employee?._id;

              if (!employeeId) return; // Cannot perform actions without an employee ID

              const checkInTime = record.checkIn
                ? new Date(record.checkIn).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date(doc.createdAt || doc.date).toLocaleTimeString(
                    "en-IN",
                    { hour: "2-digit", minute: "2-digit" },
                  );

              let mappedStatus: AttendanceStatus = "pending";
              const backendStatus = (record.status || "").toUpperCase();
              if (backendStatus === "PRESENT" || backendStatus === "HALF_DAY") {
                mappedStatus = "approved";
              } else if (
                backendStatus === "REJECTED" ||
                backendStatus === "ABSENT"
              ) {
                mappedStatus = "absent";
              } // PENDING is the default

              formattedRecords.push({
                id: record._id,
                attendanceDocId: doc._id,
                employeeId: employeeId,
                employee: employeeName,
                date: formattedDate,
                checkIn: checkInTime,
                status: mappedStatus,
                mode: record.mode || "office",
              });
            });
          });

          setRecords(formattedRecords);
        })
        .catch((error) => {
          console.error("Failed to fetch attendance records", error);
          setRecords([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug, filters, refetchIndex]);

  const monthlySummary = useMemo(() => {
    const present = records.filter((r) => r.status === "approved").length;
    const pending = records.filter((r) => r.status === "pending").length;
    const absent = records.filter((r) => r.status === "absent").length;

    return {
      totalDays: records.length,
      present,
      pending,
      absent,
      wfh: Math.floor(records.length * 0.2),
      halfDay: Math.floor(records.length * 0.1),
      attendancePercentage:
        records.length > 0 ? Math.round((present / records.length) * 100) : 0,
    };
  }, [records]);

  const filteredRecords = useAttendanceFilters(records, filters, statusFilter);

  if (loading) {
    return <div className="p-6 text-center">Loading attendance...</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center h-screen bg-base-100">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg font-medium text-base-content/70">
            Loading...
          </p>
        </div>
      }
    >
      {/* <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4"> */}
      {/* {filteredRecords.length === 0 ? (
      <EmptyState
        title="No attendance records"
        description="Attendance will appear here"
      />
    ) : (
    )} */}
      <>
        {/* TABS */}
        <div className="mb-5 mt-4">
          <div className="tabs tabs-boxed bg-base-200 md:inline-flex hidden gap-2 p-1 rounded-lg">
            <Button
              className={`
      tab gap-2 px-3 py-1.5 rounded-md font-medium transition-all duration-200
      ${
        activeTab === "records"
          ? "text-base-content/80 bg-base-100  shadow-sm"
          : "text-white hover:text-base-content hover:bg-base-100/60"
      }
    `}
              onClick={() => setActiveTab("records")}
            >
              <NotepadText size={18} /> Records
            </Button>

            <Button
              className={`
      tab gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-200
      ${
        activeTab === "mark"
          ? " text-base-content/80 bg-base-100 shadow-sm"
          : "text-white hover:text-base-content hover:bg-base-100/60"
      }
    `}
              onClick={() => setActiveTab("mark")}
            >
              <Clock size={18} /> Attendance Summary
            </Button>
          </div>
        </div>

        {activeTab === "records" && (
          <>
            <AttendanceFilterDrawer
              open={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              status={statusFilter}
              onFilterChange={setFilters}
              onStatusChange={setStatusFilter}
              isAdmin={role === "admin"}
            />

            {/* DESKTOP FILTER BAR */}
            {/* <div className="hidden md:flex flex-col gap-4 bg-base-100 border border-base-200 shadow-sm rounded-xl p-5">
              <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                Filter Records
              </h3>

              <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-end w-full">
                <div className="flex-1 w-full">
                  <AttendanceFilters
                    isAdmin={role === "admin"}
                    name={filters.name}
                    fromDate={filters.fromDate}
                    toDate={filters.toDate}
                    onChange={setFilters}
                  />
                </div>

                <div className="w-full xl:w-auto flex-shrink-0">
                  <label className="text-xs text-base-content/60 block mb-1.5">
                    Status
                  </label>
                  <StatusPills
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                </div>
              </div>
            </div> */}
<div className="hidden md:flex flex-col gap-3  border border-base-200 shadow-sm rounded-xl p-3 bg-white/40">
  <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide">
    Filter Records
  </h3>

  <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end w-full">
    
    <div className="flex-1 w-full">
      <AttendanceFilters
        isAdmin={role === "admin"}
        name={filters.name}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onChange={setFilters}
      />
    </div>

    <div className="w-full xl:w-auto flex-shrink-0">
      <label className="text-xs text-base-content/60 font-medium block mb-1">
        Status
      </label>
      <div className="scale-[0.95] origin-left">
        <StatusPills
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>
    </div>

  </div>
</div>
            <AttendanceMobileTopBar
              isAdmin={role === "admin"}
              name={filters.name}
              fromDate={filters.fromDate}
              toDate={filters.toDate}
              onChange={setFilters}
              onOpenFilters={() => setShowFilters(true)}
            />

            <div className="mt-4">
              <AttendanceTable
                records={filteredRecords}
                role={role}
                onUpdate={refetch}
              />
            </div>
          </>
        )}

        {activeTab === "mark" && (
          <AttendanceSummaryCards summary={monthlySummary} />
        )}
      </>

      <MobileTabs active={activeTab} onChange={setActiveTab} />
      {/* </div> */}
    </Suspense>
  );
};

export default AdminAttendance;
