import React, { useEffect, useState } from "react";
import { getMyHistory, downloadSlipPdf } from "@/services/payrollService";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function MyPayslips() {
  const { auth } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (auth.slug) {
      setLoading(true);
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

  if (loading) return <div>Loading your payslips...</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Breadcrumbs />

      <h2 className="text-2xl font-bold">My Payslips</h2>
      
      <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-base-200">
            <tr>
              <th className="p-4">Month / Year</th>
              <th className="p-4">Net Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4">Download</th>
            </tr>
          </thead>
          <tbody>
            {history.map((slip) => (
              <tr key={slip._id} className="border-t border-base-300">
                <td className="p-4">{slip.month} / {slip.year}</td>
                <td className="p-4">₹{slip.netSalary}</td>
                <td className="p-4">{slip.paymentStatus}</td>
                <td className="p-4">
                  <Button variant="outline" onClick={() => handleDownload(slip._id, slip.month, slip.year)} disabled={downloading === slip._id}>
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