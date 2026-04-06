import React, { useState, useEffect } from "react";
import { getEmployees, runMonthly } from "@/services/payrollService";
import { getMembers } from "@/services/memberService";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

export default function GeneratePaySlip() {
  const { auth } = useAuth();
  // console.log(auth.user)
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [manualAmount, setManualAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    if (auth.slug) {
      getEmployees(auth.slug)
        .then(res => setEmployees(res.data?.data || []))
        .catch(() => toast.error("Failed to load employees"));
    }
  }, [auth.slug]);

  const handleGenerate = async () => {
    if (selectedEmployees.length === 0) return toast.warning("Please select at least one employee.");

    setLoading(true);
    const payload = {
      month,
      year,
      employeeIds: selectedEmployees,
      manualAmount: manualAmount ? Number(manualAmount) : undefined
    };

    try {
      const res = await runMonthly(auth.slug, payload);
      console.log("Res : " ,res)
      toast.success(res.data?.message || "Payroll generated successfully!");
      setSelectedEmployees([]);
      setManualAmount("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to generate payroll";
      toast.error(msg);
      const details = error.response?.data?.details;
      if (details && details.length > 0) {
        toast.error(`Reason: ${details[0].reason}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedEmployees(employees.map(e => e._id));
  const deselectAll = () => setSelectedEmployees([]);

  return (
    <div className="bg-base-100 p-6 md:p-8 rounded-xl shadow-sm border border-base-300 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold border-b border-base-200 pb-4">Generate Payslips</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Select Month</label>
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full">
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Select Year</label>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      <div className="bg-base-50 p-4 rounded-xl border border-base-200">
        <label className="block text-sm font-bold mb-1">Manual Base Salary Override (Optional)</label>
        <p className="text-xs text-base-content/60 mb-3">Leave blank to use the employee's pre-configured default salary template.</p>
        <Input
          type="number"
          placeholder="₹ Enter gross amount"
          value={manualAmount}
          onChange={(e) => setManualAmount(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-md font-bold">Select Eligible Employees</label>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>Deselect All</Button>
          </div>
        </div>
        <div className="border border-base-300 rounded-lg max-h-64 overflow-y-auto p-2 space-y-1 bg-base-50">
          {employees.map(emp => (
            <label key={emp._id} className="flex items-center gap-3 p-3 hover:bg-base-200 rounded cursor-pointer transition-colors border border-transparent hover:border-base-300">
              <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={selectedEmployees.includes(emp._id)} onChange={() => toggleEmployee(emp._id)} />
              <span className="font-medium">{emp.name} <span className="text-xs font-normal text-base-content/60 ml-2 bg-base-300 px-2 py-1 rounded">{emp.department || "No Dept"}</span></span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="primary" className="w-full py-3 mt-4" onClick={handleGenerate} disabled={loading || selectedEmployees.length === 0}>
        {loading ? "Generating Payload..." : `Process Payroll for ${selectedEmployees.length} Employee(s)`}
      </Button>
    </div>
  );
}