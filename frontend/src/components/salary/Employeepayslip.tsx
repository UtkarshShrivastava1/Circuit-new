import React, { useEffect, useState } from "react";
import { getMyHistory, downloadSlipPdf } from "@/services/payrollService";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";

export default function EmployeePayslip() {
  const { auth } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (auth.slug) {
      getMyHistory(auth.slug)
        .then((res) => {
          setHistory(res.data?.data || []);
        })
        .catch((err) => {
          toast.error("Failed to fetch salary history");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [auth.slug]);

  const handleDownload = async (slipId: string, month: string, year: number) => {
    setDownloading(slipId);
    try {
      const blob = await downloadSlipPdf(auth.slug, slipId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error("Failed to download payslip.");
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <div className="p-6">Loading your payslips...</div>;

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-content">
      <div className="overflow-x-auto">
        <table className="w-full text-left  text-base-content border-base-content">
          <thead>
            <tr className="bg-base-200">
              <th className="p-4 border-b border-base-300">Month / Year</th>
              <th className="p-4 border-b border-base-300">Gross Salary</th>
              <th className="p-4 border-b border-base-300">Net Salary</th>
              <th className="p-4 border-b border-base-300">Status</th>
              <th className="p-4 border-b border-base-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((slip) => (
              <tr key={slip._id} className="hover:bg-base-50 transition-colors">
                <td className="p-4 border-b border-base-200">{slip.month} / {slip.year}</td>
                <td className="p-4 border-b border-base-200">₹{slip.grossSalary}</td>
                <td className="p-4 border-b border-base-200">₹{slip.netSalary}</td>
                <td className="p-4 border-b border-base-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${slip.paymentStatus === 'PAID' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{slip.paymentStatus}</span>
                </td>
                <td className="p-4 border-b border-base-200">
                  <Button variant="outline" size="sm" className="border-base-content" onClick={() => handleDownload(slip._id, slip.month, slip.year)} disabled={downloading === slip._id}>
                    {downloading === slip._id ? "Downloading..." : "Download PDF"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}