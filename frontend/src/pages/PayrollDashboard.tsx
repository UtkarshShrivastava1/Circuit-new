import React, { useEffect, useState } from "react";
import { getSummary, getMonthlyList, markSlipPaid } from "@/services/payrollService";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import {
  MdBeachAccess,
  MdPendingActions,
  MdCancel,
  MdCheckCircle,
  MdCalendarMonth,
  MdAssignment,
  MdMenuBook,
} from "react-icons/md";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of records per page

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
      setCurrentPage(1); // Reset to first page on data load
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

  // Pagination calculations
  const totalPages = Math.ceil(monthlySlips.length / pageSize) || 1;
  const currentSlips = monthlySlips.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <div>Loading Payroll Dashboard...</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Breadcrumbs />

      <PageHeader title={"Payroll Dashboard"} subtitle={"Overview"} />
      {/* <h2 className="text-2xl font-bold">Payroll Dashboard</h2> */}

       <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <StatCard title="Total Staff" value={summary?.totalStaff || 0} text="info" variant="info" icon={<MdBeachAccess />} />
              <StatCard title="Slips Processed" value={summary?.processedCount  || 0} text="error" variant="error"  icon={<MdCheckCircle />} />
              <StatCard title="Total Pending (₹)" value={summary?.pending || 0} text="warning" variant="warning" icon={<MdPendingActions />} />
              <StatCard title="Total Paid (₹)" value={summary?.paid || 0} text="success" variant="success" icon={<MdCancel />} />
            </section>
      
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-base-content">
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300 border-l-4 border-l-primary">
          <p className="text-sm text-base-content/70">Total Staff</p>
          <p className="text-2xl font-semibold">{summary?.totalStaff || 0}</p>
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300 border-l-4 border-l-secondary">
          <p className="text-sm text-base-content/70">Slips Processed</p>
          <p className="text-2xl font-semibold">{summary?.processedCount || 0}</p>
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300 border-l-4 border-l-accent">
          <p className="text-sm text-base-content/70">Total Pending (₹)</p>
          <p className="text-2xl font-semibold text-warning">{summary?.pending || 0}</p>
        </div>
        <div className="p-4 bg-base-100 rounded-xl shadow-sm border border-base-300 border-l-4 border-l-success">
          <p className="text-sm text-base-content/70">Total Paid (₹)</p>
          <p className="text-2xl font-semibold text-success">{summary?.paid || 0}</p>
        </div>
      </div> */}

      {/* Monthly Slips Table */}
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden text-base-content">
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
            {currentSlips.map((slip) => (
              <tr key={slip._id} className="border-t border-base-300">
                <td className="p-4">{slip.employeeName || slip.employeeId}</td>
                <td className="p-4">₹{slip.grossSalary}</td>
                <td className="p-4">₹{slip.netSalary}</td>
                <td className="p-4">{slip.paymentStatus}</td>
                <td className="p-4">
                  {slip.paymentStatus === "PENDING" && (
                    <Button variant="primary" onClick={() => handleMarkPaid(slip._id)}>Mark Paid</Button>
                  )}

                  {slip.paymentStatus === "PAID" && (
                    <Button variant="primary" className="btn-disabled" onClick={() => handleMarkPaid(slip._id)}>Mark Paid</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="p-4 flex justify-center border-t border-base-300">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  );
}