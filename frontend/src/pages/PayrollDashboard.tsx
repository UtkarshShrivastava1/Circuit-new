import React, { useEffect, useState } from "react";
import { getSummary, getMonthlyList, markSlipPaid } from "@/services/payrollService";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";

interface PayrollSummary {
  paid: number;
  pending: number;
  totalStaff: number;
  processedCount: number;
}

export default function PayrollDashboard() {
  const { auth } = useAuth();
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [monthlySlips, setMonthlySlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, listRes] = await Promise.all([
        getSummary(auth.slug),
        getMonthlyList(auth.slug, { month: currentMonth, year: currentYear })
      ]);
      setSummary(summaryRes.data?.data);
      setMonthlySlips(listRes.data?.data || []);
    } catch (error) {
      toast.error("Failed to load payroll dashboard data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.slug) {
      fetchDashboardData();
    }
  }, [auth.slug]);

  const handleMarkPaid = async (slipId: string) => {
    const transactionId = window.prompt("Enter Transaction/UTR Number:");
    if (!transactionId) return;

    try {
      await markSlipPaid(auth.slug, slipId, { transactionId, paymentMode: "NEFT" });
      toast.success("Payroll marked as PAID!");
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark as paid");
    }
  };

  if (loading) return <div>Loading Payroll Dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payroll Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
          <p className="text-sm text-base-content/70">Total Staff</p>
          <p className="text-2xl font-semibold">{summary?.totalStaff || 0}</p>
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
          <p className="text-sm text-base-content/70">Slips Processed</p>
          <p className="text-2xl font-semibold">{summary?.processedCount || 0}</p>
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
          <p className="text-sm text-base-content/70">Total Pending (₹)</p>
          <p className="text-2xl font-semibold text-warning">{summary?.pending || 0}</p>
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
          <p className="text-sm text-base-content/70">Total Paid (₹)</p>
          <p className="text-2xl font-semibold text-success">{summary?.paid || 0}</p>
        </div>
      </div>

      {/* Monthly Slips Table */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-base-200">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Gross Salary</th>
              <th className="p-4">Net Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {monthlySlips.map((slip) => (
              <tr key={slip._id} className="border-t border-base-300">
                <td className="p-4">{slip.employeeName || slip.employeeId}</td>
                <td className="p-4">₹{slip.grossSalary}</td>
                <td className="p-4">₹{slip.netSalary}</td>
                <td className="p-4">{slip.paymentStatus}</td>
                <td className="p-4">
                  {slip.paymentStatus === "PENDING" && (
                    <Button variant="primary" onClick={() => handleMarkPaid(slip._id)}>Mark Paid</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}