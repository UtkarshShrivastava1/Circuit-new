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
import { useState } from "react";
import StatCard from "@/components/ui/StatCard";
import LeaveRequestTable from "@/components/Leave/LeaveRequestTable";
import LeaveFilters from "@/components/Leave/LeaveFilters";
import {
  MdBeachAccess,
  MdPendingActions,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";

import type { LeaveRequest } from "@/type/leave";

const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: "1",
    employee: "Alex Kumar",
    type: "casual",
    fromDate: "12 Feb 2026",
    toDate: "14 Feb 2026",
    reason: "Family function",
    status: "pending",
  },
];

export default function AdminLeaveDashboard() {
  const [requests, setRequests] =
    useState<LeaveRequest[]>(MOCK_LEAVES);

  const approve = (id: string) =>
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved" } : r
      )
    );

  const reject = (id: string) =>
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected" } : r
      )
    );

  return (
    <div className="space-y-6">
      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Available" value="12" icon={<MdBeachAccess />} />
        <StatCard title="Pending" value="3" variant="warning" icon={<MdPendingActions />} />
        <StatCard title="Approved" value="8" variant="success" icon={<MdCheckCircle />} />
        <StatCard title="Rejected" value="1" variant="error" icon={<MdCancel />} />
      </section>

      {/* FILTERS */}
      <LeaveFilters />

      {/* TABLE */}
      <LeaveRequestTable
        requests={requests}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  );
}
