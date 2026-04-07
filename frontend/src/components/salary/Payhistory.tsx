import React, { useEffect, useState } from "react";
import { getMonthlyList, markSlipPaid, downloadSlipPdf } from "@/services/payrollService";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

export default function Payhistory() {
  const { auth } = useAuth();
  const [slips, setSlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getMonthlyList(auth.slug, { month, year });
      setSlips(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch payroll history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.slug) fetchHistory();
  }, [auth.slug, month, year]);

  const handleMarkPaid = async (slipId: string) => {
    const transactionId = window.prompt("Enter Transaction/UTR Number:");
    if (!transactionId) return;

    try {
      await markSlipPaid(auth.slug, slipId, { transactionId, paymentMode: "NEFT" });
      toast.success("Marked as PAID");
      fetchHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDownload = async (slipId: string, empName: string) => {
    try {
      const blob = await downloadSlipPdf(auth.slug, slipId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${empName.replace(/\s+/g, '_')}_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Failed to download payslip.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4 items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-300">
        <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-48">
          {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
        </Select>
        <Select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-32">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Button variant="primary" onClick={fetchHistory} disabled={loading}>
          {loading ? "Loading..." : "Filter Results"}
        </Button>
      </div>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-base-200">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Net Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slips.map((slip) => (
              <tr key={slip._id} className="border-t border-base-300 hover:bg-base-50">
                <td className="p-4">{slip.employeeName || slip.employeeId}</td>
                <td className="p-4 font-semibold">₹{slip.netSalary}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${slip.paymentStatus === 'PAID' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{slip.paymentStatus}</span>
                </td>
                <td className="p-4 flex gap-2">
                  {slip.paymentStatus === "PENDING" && <Button variant="primary" size="sm" onClick={() => handleMarkPaid(slip._id)}>Mark Paid</Button>}
                  <Button variant="outline" size="sm" onClick={() => handleDownload(slip._id, slip.employeeName || 'Employee')}>Download</Button>
                </td>
              </tr>
            ))}
            {slips.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-base-content/60">No records found for this month.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}