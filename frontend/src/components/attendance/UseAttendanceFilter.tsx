import type { AttendanceRecord } from "@/type/attendance";

type Status = "all" | "approved" | "pending" | "rejected";

 function useAttendanceFilters(
  records: AttendanceRecord[],
  filters: {
    name?: string;
    fromDate?: string;
    toDate?: string;
  },
  statusFilter: Status
) {
  return records.filter((r) => {
    if (filters.name) {
      if (
        !r.employee
          .toLowerCase()
          .includes(filters.name.toLowerCase())
      ) {
        return false;
      }
    }

    if (statusFilter !== "all") {
      if (r.status !== statusFilter) {
        return false;
      }
    }

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
}

export default useAttendanceFilters;