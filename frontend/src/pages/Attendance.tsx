// import PageContainer from "../components/ui/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import AttendanceTable from "../components/attendance/AttendanceTable";
import Pagination from "../components/ui/Pagination";
import { usePagination } from "../hooks/usePagination";
import CenteredContainer from "@/components/ui/CenteredContainer";
import { StatusPills } from "@/components/attendance/FilertByStatus";

import type {
  AttendanceRecord,
  AttendanceStatus,
  UserRole,
} from "../type/attendance";
import MarkAttendanceCard from "@/components/attendance/MarkAttendanceCard";
import { useState } from "react";
import AttendanceFilters from "@/components/attendance/AttendanceFilter";
import { useAttendanceFilters } from "@/components/attendance/UseAttendanceFilter";
import AttendanceFilterDrawer from "@/components/attendance/AttendanceFilterDrawer";
import AttendanceMobileTopBar from "@/components/attendance/AttendanceMobileTopBar";

type AttendanceTab = "records" | "mark";
type Status = "all" | "approved" | "pending" | "rejected";
export default function Attendance() {
  const role: UserRole = "employee"; // change to "employee"

  const [activeTab, setActiveTab] = useState<AttendanceTab>("records");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<{
    name?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const records: AttendanceRecord[] = Array.from({ length: 100 }).map(
    (_, i) => {
      const status: AttendanceStatus =
        i % 3 === 0 ? "pending" : i % 2 === 0 ? "approved" : "rejected";

      return {
        id: String(i),
        employee: `Employee ${i + 1}`,
        date: "28 Jan 2026",
        checkIn: "09:15 AM",
        status,
      };
    },
  );

  const filteredRecords = useAttendanceFilters(records, filters, statusFilter);

  //  records.filter((r) => {
  //   // Name filter (admin only)
  //   if (filters.name) {
  //     if (
  //       !r.employee
  //         .toLowerCase()
  //         .includes(filters.name.toLowerCase())
  //     ) {
  //       return false;
  //     }
  //   }

  //   // Date filters
  //   const recordDate = new Date(r.date).getTime();

  //   if (filters.fromDate) {
  //     const from = new Date(filters.fromDate).getTime();
  //     if (recordDate < from) return false;
  //   }

  //   if (filters.toDate) {
  //     const to = new Date(filters.toDate).getTime();
  //     if (recordDate > to) return false;
  //   }

  //   return true;
  // });

  const { page, setPage, totalPages, paginatedData } = usePagination(
    filteredRecords,
    10,
  );

  return (
    <div>
      {role === "employee" && (
        <>
          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No attendance records"
              description="Attendance will appear here"
            />
          ) : (
            <>
              {/* TABS */}
              <div className="mb-4">
                <div className="tabs tabs-boxed bg-base-200 inline-flex">
                  <button
                    className={`tab ${
                      activeTab === "records" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("records")}
                  >
                    📋 Records
                  </button>

                  <button
                    className={`tab ${
                      activeTab === "mark" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("mark")}
                  >
                    🕒 Mark Attendance
                  </button>
                </div>
              </div>

              {/* TAB CONTENT */}
              {activeTab === "records" && (
                <>
                  {/* FILTER BAR */}
                  <div className="bg-base-100 border border-base-300 rounded-lg p-4 space-y-3">
                    <AttendanceFilters
                      isAdmin={role === "employee"}
                      name={filters.name}
                      fromDate={filters.fromDate}
                      toDate={filters.toDate}
                      onChange={setFilters}
                    />

                    <StatusPills
                      value={statusFilter}
                      onChange={setStatusFilter}
                    />
                  </div>

                  <div className="mt-4">
                    <AttendanceTable records={paginatedData} role={role} />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onChange={setPage}
                    />
                  </div>
                </>
              )}

              {activeTab === "mark" && (
                <div className="min-h-[60vh] flex items-start justify-center pt-8">
                  <CenteredContainer maxWidth="lg">
                    <MarkAttendanceCard />
                  </CenteredContainer>
                </div>
              )}
            </>
          )}
        </>
      )}

      {role === "admin" && (
        <>
          {filteredRecords.length === 0 ? (
            <EmptyState
              title="No attendance records"
              description="Attendance will appear here"
            />
          ) : (
            <>
              {/* TABS  */}
              <div className="mb-4">
                <div className="tabs tabs-boxed bg-base-200 inline-flex">
                  <button
                    className={`tab ${
                      activeTab === "records" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("records")}
                  >
                    📋 Records
                  </button>

                  <button
                    className={`tab ${
                      activeTab === "mark" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("mark")}
                  >
                    🕒 Mark Attendance
                  </button>
                </div>
              </div>

              {/* TAB CONTENT  */}
              {activeTab === "records" && (
                <>
                  {/* {/* FILTER BAR  */}

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
                  <div className="hidden md:block bg-base-100 border border-base-300 rounded-lg p-4 space-y-3">
                    <AttendanceFilters
                      isAdmin={role === "admin"}
                      name={filters.name}
                      fromDate={filters.fromDate}
                      toDate={filters.toDate}
                      onChange={setFilters}
                    />

                    <StatusPills
                      value={statusFilter}
                      onChange={setStatusFilter}
                    />
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
                    <AttendanceTable records={paginatedData} role={role} />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onChange={setPage}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
