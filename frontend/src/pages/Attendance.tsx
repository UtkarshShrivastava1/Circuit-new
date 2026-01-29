// import PageContainer from "../components/ui/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import AttendanceTable from "../components/attendance/AttendanceTable";
import Pagination from "../components/ui/Pagination";
import { usePagination } from "../hooks/usePagination";

import type {
  AttendanceRecord,
  AttendanceStatus,
  UserRole,
} from "../type/attendance";

export default function Attendance() {
  const role: UserRole = "admin" ; // change to "employee"

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

  const {
    page,
    setPage,
    totalPages,
    paginatedData,
  } = usePagination(records, 10);

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
          {records.length === 0 ? (
            <EmptyState
              title="No attendance records"
              description="Attendance will appear here"
            />
          ) : (
            <>
              <AttendanceTable records={paginatedData} />
              <div className="flex justify-end mt-4 ">
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
    </div>
  );
}
