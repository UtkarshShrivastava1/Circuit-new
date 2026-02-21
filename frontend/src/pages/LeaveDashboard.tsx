import AdminLeaveDashboard from "../components/Leave/AdminDashboard";
import EmployeeLeaveDashboard from "../components/Leave/EmployeeLeaveDashboard";

type UserRole = "admin" | "employee";

export default function LeavePage() {
  const role: UserRole = "employee"; // from auth later

  if (role === "admin") {
    return <AdminLeaveDashboard />;
  }

  return <EmployeeLeaveDashboard />;
}
