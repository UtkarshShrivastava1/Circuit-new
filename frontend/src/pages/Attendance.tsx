// import PageContainer from "../components/ui/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import AttendanceTable from "../components/attendance/AttendanceTable";
import Pagination from "../components/ui/Pagination";
import { usePagination } from "../hooks/usePagination";
import CenteredContainer from "@/components/ui/CenteredContainer";

import type {
  AttendanceRecord,
  AttendanceStatus,
  UserRole,
} from "../type/attendance";
import MarkAttendanceCard from "@/components/attendance/MarkAttendanceCard";
import { useState } from "react";
import AttendanceFilters from "@/components/attendance/AttendanceFilter";
  type AttendanceTab = "records" | "mark";
export default function Attendance() {
  const role: UserRole = "admin" ; // change to "employee"


const [activeTab, setActiveTab] = useState<AttendanceTab>("records");
const [filters, setFilters] = useState<{
  name?: string;
  fromDate?: string;
  toDate?: string;
}>({});






  const records: AttendanceRecord[] = Array.from({ length: 100 }).map(
    (_, i) => {
      const status: AttendanceStatus =
        i % 3 === 0
          ? "pending"
          : i % 2 === 0
          ? "approved"
          : "rejected";

      return {
        id: String(i),
        employee: `Employee ${i + 1}`,
        date: "28 Jan 2026",
        checkIn: "09:15 AM",
        status,
      };
    }
  );

const filteredRecords = records.filter((r) => {
  // Name filter (admin only)
  if (filters.name) {
    if (
      !r.employee
        .toLowerCase()
        .includes(filters.name.toLowerCase())
    ) {
      return false;
    }
  }

  // Date filters
  const recordDate = new Date(r.date).getTime();

  if (filters.fromDate) {
    const from = new Date(filters.fromDate).getTime();
    if (recordDate < from) return false;
  }

  if (filters.toDate) {
    const to = new Date(filters.toDate).getTime();
    if (recordDate > to) return false;
  }

  return true;
});

const {
  page,
  setPage,
  totalPages,
  paginatedData,
} = usePagination(filteredRecords, 10);


  return (
    <div
    >
      {role === "employee" && (
        <div className="max-w-md bg-base-100 border border-base-300 rounded-lg p-6">
          <button className="btn btn-primary w-full">
            Mark Present
          </button>
          <p className="text-xs text-base-content/60 mt-3 text-center">
            Attendance will be validated by admin
          </p>
        </div>
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
      
    <AttendanceFilters
      isAdmin={role === "admin"}
      name={filters.name}
      fromDate={filters.fromDate}
      toDate={filters.toDate}
      onChange={setFilters}
    />

    <div className="mt-4">
      <AttendanceTable records={paginatedData} />
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
    </div>
  );
}
