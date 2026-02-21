import { useState } from "react";
import Button from "@/components/ui/Button";
import ApplyLeaveModal from "@/components/Leave/ApplyLeaveModal";
import LeaveCards from "@/components/Leave/LeaveCards";
// import InfoCard from "@/components/Leave/TestCard";
import type { LeaveRequest } from "@/type/leave";

const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: "1",
    employee: "Abhay Kumar",
    type: "casual",
    fromDate: "12 Feb 2026",
    toDate: "14 Feb 2026",
    reason: "Family function",
    status: "pending",
  },
  {
    id: "2",
    employee: "V.Vinay Kumar",
    type: "casual",
    fromDate: "15 Feb 2026",
    toDate: "16 Feb 2026",
    reason: " function",
    status: "pending",
  },
  {
    id: "3",
    employee: "Alex Kumar",
    type: "casual",
    fromDate: "12 Feb 2026",
    toDate: "14 Feb 2026",
    reason: "High fever",
    status: "pending",
  },
  {
    id: "4",
    employee: "Jhon doe ",
    type: "casual",
    fromDate: "20 Feb 2026",
    toDate: "28 Feb 2026",
    reason: "Family function",
    status: "pending",
  },
];


export default function EmployeeLeaveDashboard() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] =
      useState<LeaveRequest[]>(MOCK_LEAVES);

      

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">My Leaves</h2>
          <p className="text-sm text-base-content/60">
            Track your leave requests
          </p>
        </div>

        <Button variant="primary" onClick={() => setOpen(true)}>
          Apply Leave
        </Button>
      </div>

      {/* CARDS */}
      <LeaveCards
       requests={requests}
/>


      {/* APPLY MODAL */}
      <ApplyLeaveModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(leave) => {
          console.log("Employee leave:", leave);
        }}
      />

      {/* <InfoCard/> */}
    </div>
  );
}
