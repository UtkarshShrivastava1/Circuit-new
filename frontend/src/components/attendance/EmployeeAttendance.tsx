import React,{useState ,useMemo} from 'react'
const EmptyState = React.lazy(()=> import("../ui/EmptyState")) 
const  AttendanceFilters = React.lazy (()=> import('./AttendanceFilter') ) ;
const StatusPills = React.lazy(()=> import("./FilertByStatus"));
const AttendanceTable = React.lazy(()=> import("../attendance/AttendanceFilterDrawer"))
const MarkAttendanceCard = React.lazy(()=> import("../attendance/MarkAttendanceCard"))
const CenteredContainer =React.lazy(()=> import("@/components/ui/CenteredContainer"))
const AttendanceTabs = React.lazy(()=> import("../attendance/AttendanceTab"))
import useAttendanceFilters from "../attendance/UseAttendanceFilter";
import  {usePagination}  from "../../hooks/usePagination";
import type {
  AttendanceRecord,
  AttendanceStatus,
  UserRole,
} from "../../type/attendance";
const Pagination = React.lazy(()=>import("../ui/Pagination"))

type AttendanceTab = "records" | "mark";
type Status = "all" | "approved" | "pending" | "rejected";

const EmployeeAttendance = () => {

    const role: UserRole = "employee"; // change to "employee"
  
    const [activeTab, setActiveTab] = useState<AttendanceTab>("records");
     const [statusFilter, setStatusFilter] = useState<Status>("all");
  
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

     const { page, setPage, totalPages, paginatedData } = usePagination(
             filteredRecords,
             10,
           );

  return (
    <>
              {filteredRecords.length === 0 ? (
                <EmptyState
                  title="No attendance records"
                  description="Attendance will appear here"
                />
              ) : (
                <>
                  {/* TABS */}
                  {/* <div className="mb-4">
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
                  </div> */}
    
                  <AttendanceTabs
                      value={activeTab}
                      onChange={setActiveTab}
                    />
    
    
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

  )
}

export default EmployeeAttendance
