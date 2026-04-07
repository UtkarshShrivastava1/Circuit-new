import AdminLeaveDashboard from "../components/Leave/AdminDashboard";
import EmployeeLeaveDashboard from "../components/Leave/EmployeeLeaveDashboard";
import { useAuth } from "@/auth/AuthContext";

export default function LeavePage() {
  const { auth } = useAuth();
  const role = auth?.user?.role;

  if (role === "admin" || role === "owner") {
    return <AdminLeaveDashboard />;
  }

  return <EmployeeLeaveDashboard />;
}
