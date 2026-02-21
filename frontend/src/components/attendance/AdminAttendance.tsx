import React, { useState ,useMemo ,Suspense } from 'react'
const  AttendanceFilters = React.lazy (()=> import('./AttendanceFilter') ) ;
const EmptyState = React.lazy(()=> import("../ui/EmptyState"))
const AttendanceSummaryCards = React.lazy(()=> import("../attendance/AttendanceSummaryCards"))
// const AttendanceFilterDrawer = React.lazy(()=> import("../attendance/AttendanceFilterDrawer"))
import AttendanceFilterDrawer from '../attendance/AttendanceFilterDrawer';

const StatusPills = React.lazy(()=> import("./FilertByStatus"));
 import AttendanceMobileTopBar from "../attendance/AttendanceFilterDrawer"
 import AttendanceTable from "../attendance/AttendanceTable";

import useAttendanceFilters from "../attendance/UseAttendanceFilter";
import  {usePagination}  from "../../hooks/usePagination";
const Pagination = React.lazy(()=>import("../ui/Pagination"))
import type { AttendanceRecord } from '@/type/attendance';
import type { AttendanceStatus } from '@/type/attendance';
import {Clock ,NotepadText } from "lucide-react"




type AttendanceTab = "records" | "mark";
type Status = "all" | "approved" | "pending" | "rejected";

const AdminAttendance = () => {
  const role: UserRole = "admin"; // change to "employee"

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

       
       
       const monthlySummary = useMemo(() => {
         const present = records.filter(r => r.status === "approved").length;
         const pending = records.filter(r => r.status === "pending").length;
         const rejected = records.filter(r => r.status === "rejected").length;
       
         return {
           totalDays: records.length,
           present,
           pending,
           rejected,
           wfh: Math.floor(records.length * 0.2),
           halfDay: Math.floor(records.length * 0.1),
           attendancePercentage: Math.round((present / records.length) * 100),
         };
       }, [records]);


   const filteredRecords = useAttendanceFilters(records, filters, statusFilter);

   const { page, setPage, totalPages, paginatedData } = usePagination(filteredRecords, 10);

  // return (
  //    <>
  //         {filteredRecords.length === 0 ? (
  //           <EmptyState
  //             title="No attendance records"
  //             description="Attendance will appear here"
  //           />
  //         ) : (
  //           <>
  //             {/* TABS  */}
  //             <div className="mb-4">
  //               <div className="tabs tabs-boxed bg-base-200 inline-flex">
  //                 <button
  //                   className={`tab ${
  //                     activeTab === "records" ? "tab-active" : ""
  //                   }`}
  //                   onClick={() => setActiveTab("records")}
  //                 >
  //                   📋 Records
  //                 </button>

  //                 <button
  //                   className={`tab ${
  //                     activeTab === "mark" ? "tab-active" : ""
  //                   }`}
  //                   onClick={() => setActiveTab("mark")}
  //                 >
  //                   🕒  Attendance Summary
  //                 </button>
  //               </div>
  //             </div>

  //             {/* TAB CONTENT  */}
  //             {activeTab === "records" && (
  //               <>
  //                 {/* {/* FILTER BAR  */}

  //                 <AttendanceFilterDrawer
  //                   open={showFilters}
  //                   onClose={() => setShowFilters(false)}
  //                   filters={filters}
  //                   status={statusFilter}
  //                   onFilterChange={setFilters}
  //                   onStatusChange={setStatusFilter}
  //                   isAdmin={role === "admin"}
  //                 />

  //                 {/* DESKTOP FILTER BAR */}
  //                 <div className="hidden md:block bg-base-100 border border-base-300 rounded-lg p-4 space-y-3">
  //                   <AttendanceFilters
  //                     isAdmin={role === "admin"}
  //                     name={filters.name}
  //                     fromDate={filters.fromDate}
  //                     toDate={filters.toDate}
  //                     onChange={setFilters}
  //                   />

  //                   <StatusPills
  //                     value={statusFilter}
  //                     onChange={setStatusFilter}
  //                   />
  //                 </div>
  //                 <AttendanceMobileTopBar
  //                   isAdmin={role === "admin"}
  //                   name={filters.name}
  //                   fromDate={filters.fromDate}
  //                   toDate={filters.toDate}
  //                   onChange={setFilters}
  //                   onOpenFilters={() => setShowFilters(true)}
  //                 />

  //                 <div className="mt-4">
  //                   <Suspense fallback={<div>Loading...</div>} >

  //                   <AttendanceTable records={paginatedData} role={role} />
  //                   </Suspense>
  //                 </div>

  //                 <div className="flex justify-end mt-4">
  //                   <Pagination
  //                     page={page}
  //                     totalPages={totalPages}
  //                     onChange={setPage}
  //                   />
  //                 </div>
  //               </>
  //             )}


  //             {activeTab === "mark" && (<>
              
  //             <AttendanceSummaryCards summary={monthlySummary} />
              
  //              </>) 
              
              
  //             }
  //           </>
  //         )}
  //       </>
  // )

  return (
  <Suspense fallback={<div className="p-6">Loading...</div>}>
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
              className={`tab ${activeTab === "records" ? "tab-active" : ""} gap-2`}
              onClick={() => setActiveTab("records")}
            >
              <NotepadText/> Records
            </button>

            <button
              className={`tab ${activeTab === "mark" ? "tab-active" : ""} gap-2`}
              onClick={() => setActiveTab("mark")}
            >
              <Clock/> Attendance Summary
            </button>
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

        {activeTab === "mark" && (
          <AttendanceSummaryCards summary={monthlySummary} />
        )}
      </>
    )}
  </Suspense>
);

}

export default AdminAttendance
