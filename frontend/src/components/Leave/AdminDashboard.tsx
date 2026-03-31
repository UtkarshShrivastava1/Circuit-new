// import { useState } from "react";
// import Button from "@/components/ui/Button";
// import StatCard from "@/components/ui/StatCard";
// import LeaveRequestTable from "@/components/Leave/LeaveRequestTable";
// import ApplyLeaveModal from "@/components/Leave/ApplyLeaveModal";
// import LeaveFilters from "@/components/Leave/LeaveFilters";

// import {
//   MdBeachAccess,
//   MdPendingActions,
//   MdCancel,
//   MdCheckCircle,
//   MdAssignment,
//   MdEditCalendar,
// } from "react-icons/md";

// import type { LeaveRequest } from "@/type/leave";

// /* ================= TYPES ================= */
// type LeaveTab = "requests" | "apply";
// type UserRole = "admin" | "employee";

// /* ================= MOCK DATA ================= */
// const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
//   {
//     id: "1",
//     employee: "Alex Kumar",
//     type: "casual",
//     fromDate: "12 Feb 2026",
//     toDate: "14 Feb 2026",
//     reason: "Family function",
//     status: "pending",
//   },
//   {
//     id: "2",
//     employee: "Rahul Sharma",
//     type: "sick",
//     fromDate: "10 Feb 2026",
//     reason: "Fever",
//     status: "approved",
//   },
//   {
//     id: "3",
//     employee: "Neha Singh",
//     type: "half-day",
//     fromDate: "08 Feb 2026",
//     reason: "Personal work",
//     status: "pending",
//   },
// ];

// /* ================= COMPONENT ================= */
// export default function LeaveDashboard() {
//   const role: UserRole = "admin"; // later from auth
//   const [activeTab, setActiveTab] = useState<LeaveTab>("requests");
//   const [openApplyModal, setOpenApplyModal] = useState(false);

//   const [leaveRequests, setLeaveRequests] =
//     useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);

//   /* ---------- ACTIONS ---------- */
//   const approveLeave = (id: string) => {
//     setLeaveRequests((prev) =>
//       prev.map((r) =>
//         r.id === id ? { ...r, status: "approved" } : r
//       )
//     );
//   };

//   const rejectLeave = (id: string) => {
//     setLeaveRequests((prev) =>
//       prev.map((r) =>
//         r.id === id ? { ...r, status: "rejected" } : r
//       )
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* ================= HEADER ================= */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-base-content">
//             Leave Management
//           </h2>
//           <p className="text-sm text-base-content/60">
//             Track and manage employee leaves
//           </p>
//         </div>

//         <Button
//           variant="primary"
//           onClick={() => setOpenApplyModal(true)}
//         >
//           + Apply Leave
//         </Button>
//       </div>

//       {/* ================= SUMMARY ================= */}
//       <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <StatCard
//           title="Available"
//           value="12"
//           icon={<MdBeachAccess size={22} />}
//         />
//         <StatCard
//           title="Used"
//           value="6"
//           variant="info"
//           icon={<MdCheckCircle size={22} />}
//         />
//         <StatCard
//           title="Pending"
//           value="2"
//           variant="warning"
//           icon={<MdPendingActions size={22} />}
//         />
//         <StatCard
//           title="Rejected"
//           value="1"
//           variant="error"
//           icon={<MdCancel size={22} />}
//         />
//       </section>

//       {/* ================= TABS ================= */}
//       <div className="tabs tabs-boxed bg-base-200 inline-flex">
//         <button
//           className={`tab flex items-center gap-2 ${
//             activeTab === "requests" ? "tab-active" : ""
//           }`}
//           onClick={() => setActiveTab("requests")}
//         >
//           <MdAssignment size={18} />
//           Leave Requests
//         </button>

//         <button
//           className={`tab flex items-center gap-2 ${
//             activeTab === "apply" ? "tab-active" : ""
//           }`}
//           onClick={() => setActiveTab("apply")}
//         >
//           <MdEditCalendar size={18} />
//           Apply Leave
//         </button>
//       </div>

//       {/* ================= CONTENT ================= */}
//       {activeTab === "requests" && (
//         <>
//           {role === "admin" && <LeaveFilters />}

//           <div className="mt-4">
//             <LeaveRequestTable
//               requests={leaveRequests}
//               onApprove={approveLeave}
//               onReject={rejectLeave}
//             />
//           </div>
//         </>
//       )}

//       {activeTab === "apply" && (
//         <div className="flex justify-center pt-6">
//           <Button
//             variant="primary"
//             onClick={() => setOpenApplyModal(true)}
//           >
//             Apply Leave
//           </Button>
//         </div>
//       )}

//       {/* ================= APPLY MODAL ================= */}
//       <ApplyLeaveModal
//         open={openApplyModal}
//         onClose={() => setOpenApplyModal(false)}
//         onSubmit={(leave) => {
//           setLeaveRequests((prev) => [
//             ...prev,
//             {
//               id: crypto.randomUUID(),
//               employee: "You",
//               status: "pending",
//               ...leave,
//             },
//           ]);
//         }}
//       />
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import LeaveRequestTable from "@/components/Leave/LeaveRequestTable";
// import LeaveFilters from "@/components/Leave/LeaveFilters";
import {
  MdBeachAccess,
  MdPendingActions,
  MdCancel,
  MdCheckCircle,
  MdCalendarMonth,
  MdAssignment,
  MdMenuBook,
} from "react-icons/md";
import { toast } from "react-toastify";

import { getAllLeaves, updateLeaveStatus, bulkUpdateLeaveStatus } from "@/services/leaveService";
import { getHolidays, addHoliday, updateHoliday, deleteHoliday } from "@/services/holidayService";
import { getLeavePolicy, updateLeavePolicy } from "@/services/leavePolicyService";
import type { LeaveRequest } from "@/type/leave";
import LeaveCalendar from "./LeaveCalendar";
import AddHolidayDrawer from "./AddHolidayDrawer";
import LeavePolicy from "./LeavePolicy";
import MobileLeaveTabs from "./MobileLeaveTabs";
import { getOrganizationSlug } from "@/utils/auth";
import { useAuth } from "@/auth/AuthContext";



export default function AdminLeaveDashboard() {
  const {auth } = useAuth();
   const slug = auth.slug;
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [holidays, setHolidays] = useState<{ _id?: string; date: string; title: string; description?: string }[]>([]);
  const [policy, setPolicy] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"requests" | "calendar" | "policy">("requests");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHoliday, setSelectedHoliday] = useState<{ _id?: string; date: string; title: string; description?: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);



    useEffect(() => {
      const fetchData = async () => {
        try {
         
          
                 if (!slug) {
                   toast.error("User data not found. Please log in again.");
                   return;
                 }
          
          const [leavesRes, holidaysRes, policyRes] = await Promise.all([
            getAllLeaves(slug),
            getHolidays(slug),
            getLeavePolicy(slug)
          ]);
          
          const fetchedLeaves: LeaveRequest[] = leavesRes.data.leaves.map((leave: any) => ({
            id: leave._id,
            employee: leave.name || leave.user?.name || "Employee",
            type: leave.leaveType,
            fromDate: leave.startDate ? leave.startDate.split("T")[0] : "",
            toDate: leave.endDate ? leave.endDate.split("T")[0] : "",
            reason: leave.reason,
            status: leave.status,
          }));
          
          setRequests(fetchedLeaves);
          setHolidays(holidaysRes.data.holidays || []);
          setPolicy(policyRes.data.policy || null);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
    
      fetchData();
    }, []);


  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
   
       if (!slug) {
         toast.error("User data not found. Please log in again.");
         return;
       }

      await updateLeaveStatus(slug, id, { status });
      
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success(`Leave ${status} successfully`);
    } catch (error: any) {
      console.error(`Failed to ${status} leave:`, error);
      toast.error(error.response?.data?.message || `Failed to update leave status`);
    }
  };

  const approve = (id: string) => handleStatusUpdate(id, "approved");
  const reject = (id: string) => handleStatusUpdate(id, "rejected");

  const handleBulkStatusUpdate = async (ids: string[], status: "approved" | "rejected") => {
    try {
    
       if (!slug) {
         toast.error("User data not found. Please log in again.");
         return;
       }

      await bulkUpdateLeaveStatus(slug, { leaveIds: ids, status });
      
      setRequests((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
      toast.success(`Selected leaves ${status} successfully`);
    } catch (error: any) {
      console.error(`Failed to ${status} selected leaves:`, error);
      toast.error(error.response?.data?.message || `Failed to update selected leave statuses`);
    }
  };

  const bulkApprove = (ids: string[]) => handleBulkStatusUpdate(ids, "approved");
  const bulkReject = (ids: string[]) => handleBulkStatusUpdate(ids, "rejected");

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;

  const handleDateClick = (dateStr: string) => {
    const existingHoliday = holidays.find((h) => h.date === dateStr);
    setSelectedDate(dateStr);
    setSelectedHoliday(existingHoliday || null);
    setIsDrawerOpen(true);
  };

  const handleAddOrUpdateHoliday = async (data: { date: string; title: string; description: string }) => {
    try {
     
      
      if (selectedHoliday?._id) {
        const response = await updateHoliday(slug , selectedHoliday._id, data);
        setHolidays((prev) => prev.map((h) => h._id === selectedHoliday._id ? response.data.holiday : h));
        toast.success("Holiday updated successfully");
      } else {
        const response = await addHoliday(slug, data);
        setHolidays((prev) => [...prev, response.data.holiday]);
        toast.success("Holiday published to calendar successfully");
      }
      
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Failed to save holiday");
      console.error(error);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
     
      await deleteHoliday(slug , id);
      setHolidays((prev) => prev.filter((h) => h._id !== id));
      toast.success("Holiday deleted successfully");
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Failed to delete holiday");
      console.error(error)
    }
  };

  const handleSavePolicy = async (policyData: any) => {
    try {
   
   
       if (!slug) {
         toast.error("User data not found. Please log in again.");
         return;
       }
      
      const response = await updateLeavePolicy(slug, policyData);
      setPolicy(response.data.policy);
      toast.success("Leave policy updated successfully!");
    } catch (error) {
      toast.error("Failed to update leave policy.");
      console.error(error)
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={total} icon={<MdBeachAccess />} />
        <StatCard title="Pending" value={pending} variant="warning" icon={<MdPendingActions />} />
        <StatCard title="Approved" value={approved} variant="success" icon={<MdCheckCircle />} />
        <StatCard title="Rejected" value={rejected} variant="error" icon={<MdCancel />} />
      </section>

      {/* FILTERS */}
      {/* <LeaveFilters /> */}

      {/* TABS */}
      <div className="hidden md:block">
        <div className="tabs tabs-boxed w-fit">
          <button
            onClick={() => setActiveTab("requests")}
            className={`tab gap-1 ${activeTab === "requests" ? "tab-active" : ""}`}
          >
            <MdAssignment /> Leave Requests
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`tab gap-1 ${activeTab === "calendar" ? "tab-active" : ""}`}
          >
            <MdCalendarMonth /> Calendar
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`tab gap-1 ${activeTab === "policy" ? "tab-active" : ""}`}
          >
            <MdMenuBook /> Policy Configuration
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "requests" && (
        <LeaveRequestTable
          requests={requests}
          onApprove={approve}
          onReject={reject}
          onBulkApprove={bulkApprove}
          onBulkReject={bulkReject}
        />
      )}
      
      {activeTab === "calendar" && (
        <LeaveCalendar
          requests={requests}
          isAdmin={true}
          officeHolidays={holidays}
          onDateClick={handleDateClick}
        />
      )}

      {activeTab === "policy" && (
        <LeavePolicy
          policy={policy}
          isAdmin={true}
          onSave={handleSavePolicy}
        />
      )}

      <AddHolidayDrawer
        open={isDrawerOpen}
        date={selectedDate}
        holiday={selectedHoliday}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddOrUpdateHoliday}
        onDelete={handleDeleteHoliday}
      />

      <MobileLeaveTabs
        active={activeTab}
        onChange={(tab) => setActiveTab(tab)}
        tabs={[
          { key: "requests", icon: MdAssignment },
          { key: "calendar", icon: MdCalendarMonth },
          { key: "policy", icon: MdMenuBook },
        ]}
      />
    </div>
  );
}
