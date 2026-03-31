import React, { useState ,useMemo ,Suspense, useEffect } from 'react'
const  AttendanceFilters = React.lazy (()=> import('./AttendanceFilter') ) ;
const EmptyState = React.lazy(()=> import("../ui/EmptyState"))
const AttendanceSummaryCards = React.lazy(()=> import("../attendance/AttendanceSummaryCards"))
// const AttendanceFilterDrawer = React.lazy(()=> import("../attendance/AttendanceFilterDrawer"))
import AttendanceFilterDrawer from '../attendance/AttendanceFilterDrawer';

const StatusPills = React.lazy(()=> import("./FilertByStatus"));
//  import AttendanceMobileTopBar from "../attendance/AttendanceFilterDrawer"
 import AttendanceTable from "../attendance/AttendanceTable";

import useAttendanceFilters from "../attendance/UseAttendanceFilter";
import  {usePagination}  from "../../hooks/usePagination";
const Pagination = React.lazy(()=>import("../ui/Pagination"))
import type { AttendanceRecord, UserRole, AttendanceStatus } from '@/type/attendance';
import {Clock ,NotepadText } from "lucide-react"
import MobileTabs from '../attendance/MobileTabs';
import AttendanceMobileTopBar from './AttendanceMobileTopBar';
import { useAuth } from '@/auth/AuthContext';
import { getAllEmployees , getAttendance ,getManagerDepartments , getDepartmentEmployees} from '@/services/attendanceService';




type AttendanceTab = "records" | "mark";
type Status = "all" | "approved" | "pending" | "rejected";

const AdminAttendance = () => {
  const { auth } = useAuth();
  const user = auth?.user;
  const slug = auth?.slug;
  const role: UserRole = user?.role || "admin";
  console.log("role : " , role)

  const [activeTab, setActiveTab] = useState<AttendanceTab>("records");
   const [statusFilter, setStatusFilter] = useState<Status>("all");
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<{
       name?: string;
       fromDate?: string;
       toDate?: string;
     }>({});

    const [records, setRecords] = useState<(AttendanceRecord & { attendanceDocId: string; employeeId: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const refetch = () => setRefetchIndex(prev => prev + 1);

    useEffect(() => {
      if (slug) {
        setLoading(true);
       getAttendance(slug , filters  )
          .then((res) => {
            // The server returns { success: true, data: [...] }, we need to target the array
            const responseData = res.data?.data || res.data || [];
            const arr = Array.isArray(responseData) ? responseData : [];
            
            const formattedRecords: (AttendanceRecord & { attendanceDocId: string; employeeId: string })[] = [];
            arr.forEach((doc: any) => {
              const formattedDate = new Date(doc.date).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
              });

              (doc.records || []).forEach((record: any) => {
                const employeeName = typeof record.employee === "object" && record.employee?.name 
                  ? record.employee.name
                  : "Unknown";
                const employeeId = record.employee?._id;

                if (!employeeId) return; // Cannot perform actions without an employee ID

                const checkInTime = record.checkIn 
                  ? new Date(record.checkIn).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) 
                  : new Date(doc.createdAt || doc.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                let mappedStatus: AttendanceStatus = "pending";
                const backendStatus = (record.status || "").toUpperCase();
                if (backendStatus === "PRESENT" || backendStatus === "HALF_DAY") {
                    mappedStatus = "approved";
                } else if (backendStatus === "REJECTED" || backendStatus === "ABSENT") {
                    mappedStatus = "rejected";
                } // PENDING is the default

                formattedRecords.push({
                  id: record._id,
                  attendanceDocId: doc._id,
                  employeeId: employeeId,
                  employee: employeeName,
                  date: formattedDate,
                  checkIn: checkInTime,
                  status: mappedStatus,
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
           attendancePercentage: records.length > 0 ? Math.round((present / records.length) * 100) : 0,
         };
       }, [records]);


   const filteredRecords = useAttendanceFilters(records, filters, statusFilter);

   const { page, setPage, totalPages, paginatedData } = usePagination(filteredRecords, 10);

  if (loading) {
    return <div className="p-6 text-center">Loading attendance...</div>;
  }

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
    {/* <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4"> */}
    {filteredRecords.length === 0 ? (
      <EmptyState
        title="No attendance records"
        description="Attendance will appear here"
      />
    ) : (
      <>
        {/* TABS */}
        <div className="mb-4">
          <div className="tabs tabs-boxed bg-base-200 md:inline-flex hidden ">
          {/* <div className="hidden md:flex tabs tabs-boxed bg-base-200 w-fit"> */}
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
              <AttendanceTable records={paginatedData} role={role} onUpdate={refetch} />
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

    <MobileTabs active={activeTab} onChange={setActiveTab}/>
    {/* </div> */}
  </Suspense>
);

}

export default AdminAttendance
