import { useState, useEffect } from "react";
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
import { applyLeave, getMyLeaves, deleteLeave, updateLeave } from "@/services/leaveService";
import { getHolidays } from "@/services/holidayService";
import { getLeavePolicy } from "@/services/leavePolicyService";
import { toast } from "react-toastify";


export default function EmployeeLeaveDashboard() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [policy, setPolicy] = useState<any>(null);
  const [holidays, setHolidays] = useState<{ _id?: string; date: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLeave, setSelectedLeave] =
    useState<LeaveRequest | null>(null);

    const { addNotification } = useNotifications();


  const [active, setActive] =
    useState<"overview" | "my-leaves" | "balance" | "calendar" | "policy">(
      "overview"
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataStr = sessionStorage.getItem("user");
        if (!userDataStr) return;
        
        const user = JSON.parse(userDataStr);
        const organizationId = user.organization;

        const [response, holidaysRes, policyRes] = await Promise.all([
          getMyLeaves(organizationId),
          getHolidays(organizationId),
          getLeavePolicy(organizationId)
        ]);
        
        const fetchedLeaves: LeaveRequest[] = response.data.leaves.map((leave: any) => ({
          id: leave._id,
          employee: user.name || "Employee",
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
        toast.error("Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyLeave = async (leave: any) => {
    try {
      // 1. Get Organization ID and User context from Session Storage
      const userDataStr = sessionStorage.getItem("user");
      if (!userDataStr) {
        toast.error("User session not found.");
        addNotification({ title: "Error", message: "User session not found.", type: "error" });
        return;
      }
      
      const user = JSON.parse(userDataStr);
      const organizationId = user.organization;

      const payload = { ...leave, name: user.name };

      // 2. Call the backend API via leaveService
      const response = await applyLeave(organizationId, payload);
      const savedLeave = response.data.leave;
      console.log("Leave applied successfully:", savedLeave);

      // 3. Update local state with the new response from DB
      const newLeave: LeaveRequest = {
        id: savedLeave._id,
        employee: user.name || "Employee",
        type: savedLeave.leaveType,
        fromDate: savedLeave.startDate ? savedLeave.startDate.split("T")[0] : leave.fromDate,
        toDate: savedLeave.endDate ? savedLeave.endDate.split("T")[0] : leave.toDate,
        reason: savedLeave.reason,
        status: savedLeave.status,
      };

      setRequests((prev) => [newLeave, ...prev]);

      // 4. Trigger Success Notification & Close Modal
      toast.success(`Your ${leave.type} leave has been submitted successfully.`);
      addNotification({
        title: "Leave Applied",
        message: `Your ${leave.type} leave has been submitted successfully.`,
        type: "info",
      });

      setOpen(false);
    } catch (error: any) {
      console.error("Apply leave failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit leave request.";
      
      toast.error(errorMessage);
      addNotification({
        title: "Application Failed",
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleDeleteLeave = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
    if (!confirmDelete) return;

    try {
      const userDataStr = sessionStorage.getItem("user");
      if (!userDataStr) return;
      const user = JSON.parse(userDataStr);
      
      await deleteLeave(user.organization, id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Leave deleted successfully");
    } catch (error: any) {
      console.error("Delete leave failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete leave");
    }
  };

  const handleUpdateLeave = async (updatedLeave: any) => {
    try {
      const userDataStr = sessionStorage.getItem("user");
      if (!userDataStr) return;
      const user = JSON.parse(userDataStr);
      
      const response = await updateLeave(user.organization, updatedLeave.id, updatedLeave);
      const savedLeave = response.data.leave;
      
      setRequests((prev) =>
        prev.map((r) =>
          r.id === updatedLeave.id ? {
            ...r,
            type: savedLeave.leaveType,
            fromDate: savedLeave.startDate ? savedLeave.startDate.split("T")[0] : updatedLeave.fromDate,
            toDate: savedLeave.endDate ? savedLeave.endDate.split("T")[0] : updatedLeave.toDate,
            reason: savedLeave.reason,
          } : r
        )
      );
      toast.success("Leave updated successfully");
    } catch (error: any) {
      console.error("Update leave failed:", error);
      toast.error(error.response?.data?.message || "Failed to update leave");
    }
  };

   

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
            policy={policy}
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
          onDelete={handleDeleteLeave}
        />
      )}

      {active === "balance" && (
        <LeaveBalanceDashboard
          requests={requests}
          policy={policy}
        />
      )}
      {active === "calendar" && (
        <LeaveCalendar
          requests={requests}
          officeHolidays={holidays}
          wfhDays={[
            "2026-03-27",
            "2026-04-03"
          ]}
        />
      )}
      {active === "policy" && (
        <LeavePolicy
          policy={policy}
          isAdmin={false}
        />
      )}



      {/* ================= DRAWER ================= */}

      <LeaveDrawer
        leave={selectedLeave}
        onClose={() => setSelectedLeave(null)}
        onUpdate={handleUpdateLeave}
      />

      {/* ================= APPLY MODAL ================= */}

      <ApplyLeaveModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleApplyLeave}
      />

<MobileLeaveTabs
  active={active}
  onChange={setActive}
/>
    </div>
  );
}