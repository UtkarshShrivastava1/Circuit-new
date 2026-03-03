import { useState } from "react";
import Button from "@/components/ui/Button";
import ApplyLeaveModal from "@/components/Leave/ApplyLeaveModal";
import LeaveCards from "@/components/Leave/LeaveCards";
import LeaveDrawer from "@/components/Leave/LeaveDrawer";
import LeaveStats from "@/components/Leave/LeaveStats";
import LeaveBalanceDashboard from "@/components/Leave/LeaveBalanceDashboard";
import type { LeaveRequest } from "@/type/leave";
import LeaveCalendar from "./LeaveCalendar";
import LeavePolicy from "./LeavePolicy";
import MobileLeaveTabs from "@/components/Leave/MobileLeaveTabs";
import { useNotifications } from "@/context/NotificationContext";
import {
  MdDashboard,
  MdAssignment,
  MdAccountBalanceWallet,
  MdCalendarMonth,
  MdMenuBook,
} from "react-icons/md";


/* ================= DUMMY DATA ================= */

const DUMMY_REQUESTS: LeaveRequest[] = [
  {
    id: "1",
    employee: "Vinay Kumar",
    type: "casual",
    fromDate: "2026-02-10",
    toDate: "2026-02-12",
    reason: "Family Function",
    status: "approved",
  },
  {
    id: "2",
    employee: "Vinay Kumar",
    type: "sick",
    fromDate: "2026-03-02",
    toDate: "2026-03-02",
    reason: "Fever",
    status: "pending",
  },
  {
    id: "3",
    employee: "Vinay Kumar",
    type: "paid",
    fromDate: "2026-04-01",
    toDate: "2026-04-03",
    reason: "Vacation",
    status: "rejected",
  },
];

export default function EmployeeLeaveDashboard() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] =
    useState<LeaveRequest[]>(DUMMY_REQUESTS);

  const [selectedLeave, setSelectedLeave] =
    useState<LeaveRequest | null>(null);

    const { addNotification } = useNotifications();


  const [active, setActive] =
    useState<"overview" | "my-leaves" | "balance" | "calendar" | "policy">(
      "overview"
    );

   

  return (
    <div className="space-y-6 pb-20 md:pb-0">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
       

        <Button
          variant="primary"
          onClick={() => setOpen(true)}
        >
          Apply Leave
        </Button>
      </div>

      {/* ================= TABS ================= */}
      <div className="hidden md:block">
      <div className="tabs tabs-boxed w-fit">
        <button
          onClick={() => setActive("overview")}
          className={`tab  gap-1 ${
            active === "overview" ? "tab-active" : ""
          }`}
        >
        <MdDashboard/>  Overview
        </button>

        <button
          onClick={() => setActive("my-leaves")}
          className={`tab gap-1 ${
            active === "my-leaves"
              ? "tab-active"
              : ""
          }`}
        >
       <MdAssignment/>   My Leaves
        </button>

        <button
          onClick={() => setActive("balance")}
          className={`tab gap-1 ${
            active === "balance" ? "tab-active" : ""
          }`}
        >
        <MdAccountBalanceWallet/>  Leave Balance
        </button>
        <button
          onClick={() => setActive("calendar")}
          className={`tab gap-1 ${
            active === "calendar" ? "tab-active" : ""
          }`}
        >
         <MdCalendarMonth/> Leave Calendar
        </button>
        <button
          onClick={() => setActive("policy")}
          className={`tab gap-1 ${
            active === "policy" ? "tab-active" : ""
          }`}
        >
       <MdMenuBook/>   Leave Policy
        </button>
      </div>
      </div>

      {/* ================= TAB CONTENT ================= */}

      {active === "overview" && (
        <>
          <LeaveBalanceDashboard
            requests={requests}
          />

          <LeaveStats requests={requests} />
        </>
      )}

      {active === "my-leaves" && (
        <LeaveCards
          requests={requests}
          onView={(leave) =>
            setSelectedLeave(leave)
          }
          onDelete={(id) =>
            setRequests((prev) =>
              prev.filter((r) => r.id !== id)
            )
          }
        />
      )}

      {active === "balance" && (
        <LeaveBalanceDashboard
          requests={requests}
        />
      )}
      {active === "calendar" && (
        <LeaveCalendar
          requests={requests}
        />
      )}
      {active === "policy" && (
        <LeavePolicy
        
        />
      )}



      {/* ================= DRAWER ================= */}

      <LeaveDrawer
        leave={selectedLeave}
        onClose={() => setSelectedLeave(null)}
        onUpdate={(updated) =>
          setRequests((prev) =>
            prev.map((r) =>
              r.id === updated.id ? updated : r
            )
          )
        }
      />

      {/* ================= APPLY MODAL ================= */}

      <ApplyLeaveModal
  open={open}
  onClose={() => setOpen(false)}
  onSubmit={(leave) => {
    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      employee: "Vinay Kumar",
      ...leave,
    };

    setRequests((prev) => [
      newLeave,
      ...prev,
    ]);

    // ✅ ADD NOTIFICATION HERE
    addNotification({
      title: "Leave Applied",
      message: `Your ${leave.type} leave has been submitted.`,
      type: "info",
    });

    setOpen(false);
  }}
/>

<MobileLeaveTabs
  active={active}
  onChange={setActive}
/>
    </div>
  );
}