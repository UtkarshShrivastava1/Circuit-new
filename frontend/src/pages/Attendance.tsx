// import PageContainer from "../components/ui/PageContainer";
// import EmptyState from "../components/ui/EmptyState";
// import AttendanceTable from "../components/attendance/AttendanceTable";
// import Pagination from "../components/ui/Pagination";
// import { usePagination } from "../hooks/usePagination";
// import CenteredContainer from "@/components/ui/CenteredContainer";
// import { StatusPills } from "@/components/attendance/FilertByStatus";

import React from "react";

import type {
  UserRole,
} from "../type/attendance";
// import MarkAttendanceCard from "@/components/attendance/MarkAttendanceCard";
// import { useState,useMemo } from "react";
// import AttendanceFilters from "@/components/attendance/AttendanceFilter";
// import { useAttendanceFilters } from "@/components/attendance/UseAttendanceFilter";
// import AttendanceFilterDrawer from "@/components/attendance/AttendanceFilterDrawer";
// import AttendanceMobileTopBar from "@/components/attendance/AttendanceMobileTopBar";
// import AttendanceSummaryCards from "@/components/attendance/AttendanceSummaryCards";
// import AttendanceTabs from "@/components/attendance/AttendanceTab";

const EmployeeAttendanceView = React.lazy(()=> import("../components/attendance/EmployeeAttendance"))
const AdminAttendanceView = React.lazy(()=> import("../components/attendance/AdminAttendance"))


// type Status = "all" | "approved" | "pending" | "rejected";
export default function Attendance() {
  const role: UserRole = "admin"; // change to "employee"

  
//   const [statusFilter, setStatusFilter] = useState<Status>("all");
//   const [showFilters, setShowFilters] = useState(false);


  

//   const [filters, setFilters] = useState<{
//     name?: string;
//     fromDate?: string;
//     toDate?: string;
//   }>({});

//   const records: AttendanceRecord[] = Array.from({ length: 100 }).map(
//     (_, i) => {
//       const status: AttendanceStatus =
//         i % 3 === 0 ? "pending" : i % 2 === 0 ? "approved" : "rejected";

//       return {
//         id: String(i),
//         employee: `Employee ${i + 1}`,
//         date: "28 Jan 2026",
//         checkIn: "09:15 AM",
//         status,
//       };
//     },
//   );

 

//   //  records.filter((r) => {
//   //   // Name filter (admin only)
//   //   if (filters.name) {
//   //     if (
//   //       !r.employee
//   //         .toLowerCase()
//   //         .includes(filters.name.toLowerCase())
//   //     ) {
//   //       return false;
//   //     }
//   //   }

//   //   // Date filters
//   //   const recordDate = new Date(r.date).getTime();

//   //   if (filters.fromDate) {
//   //     const from = new Date(filters.fromDate).getTime();
//   //     if (recordDate < from) return false;
//   //   }

//   //   if (filters.toDate) {
//   //     const to = new Date(filters.toDate).getTime();
//   //     if (recordDate > to) return false;
//   //   }

//   //   return true;
//   // });

//   const { page, setPage, totalPages, paginatedData } = usePagination(
//     filteredRecords,
//     10,
//   );

// const monthlySummary = useMemo(() => {
//   const present = records.filter(r => r.status === "approved").length;
//   const pending = records.filter(r => r.status === "pending").length;
//   const rejected = records.filter(r => r.status === "rejected").length;

//   return {
//     totalDays: records.length,
//     present,
//     pending,
//     rejected,
//     wfh: Math.floor(records.length * 0.2),
//     halfDay: Math.floor(records.length * 0.1),
//     attendancePercentage: Math.round((present / records.length) * 100),
//   };
// }, [records]);



  return (
    <>
<div>
  {role === "employee"
    ? <EmployeeAttendanceView />
    : <AdminAttendanceView />
  }
</div>
    </>
    

    
  );
}
