import { useState } from "react";
import Button from "@/components/ui/Button";
import ApplyLeaveModal from "@/components/Leave/ApplyLeaveModal";
import LeaveCards from "@/components/Leave/LeaveCards";

export default function EmployeeLeaveDashboard() {
  const [open, setOpen] = useState(false);

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
       requests={[
    {
      id: "1",
      type: "casual",
      fromDate: "12 Feb 2026",
      toDate: "14 Feb 2026",
      reason: "Family function",
      status: "approved",
    },
    {
      id: "2",
      type: "sick",
      fromDate: "10 Feb 2026",
      reason: "Fever",
      status: "pending",
    },
  ]}
/>


      {/* APPLY MODAL */}
      <ApplyLeaveModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(leave) => {
          console.log("Employee leave:", leave);
        }}
      />
    </div>
  );
}
