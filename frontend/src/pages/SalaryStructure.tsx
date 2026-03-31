import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import StatutorySettingsCard from "@/components/salary/StatutorySettingsCard";
import SalarySlipPreview from "@/components/salary/SalarySlipPreview";
import { useAuth } from "@/auth/AuthContext";
import { getAllEmployees } from "@/services/attendanceService";
import { generatePayroll } from "@/services/payrollService";
import { toast } from "react-toastify";
import { MdCurrencyRupee } from "react-icons/md";
import { getMembers } from "@/services/memberService";

interface Employee {
  _id: string;
  name: string;
  email: string;
}

/* ---------- COMPONENT ---------- */

export default function SalaryStructureDashboard() {
  const { auth } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [monthlyGross, setMonthlyGross] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [limitPF, setLimitPF] = useState(true);

  useEffect(() => {
    if (auth.slug) {
      setLoading(true);
      getMembers(auth.slug)
        .then((res) => {
        
          setEmployees(res.data?.members || []);
        })
        .catch((err) => {
          console.error("Failed to fetch employees", err);
          toast.error("Failed to fetch employees.");
        })
        .finally(() => setLoading(false));
    }
  }, [auth.slug]);

  const salaryComponents = useMemo(() => {
    const gross = monthlyGross > 0 ? monthlyGross : 0;

    // Basic is 50% of Gross
    const basic = gross * 0.5;

    // HRA is 40% of Basic
    const hra = basic * 0.4;

    // Special Allowance is the remainder
    const special = gross - basic - hra;

    // EPF is 12% of Basic, capped at 15000 if limitPF is true
    let epfContribution = 0;
    if (limitPF && basic > 15000) {
      epfContribution = 15000 * 0.12;
    } else {
      epfContribution = basic * 0.12;
    }

    // Professional Tax (simple slab for example)
    const professionalTax = gross > 10000 ? 200 : 0;

    const totalDeductions = epfContribution + professionalTax;
    const netSalary = gross - totalDeductions;

    return {
      basic: Math.round(basic),
      da: 0, // For future use
      hra: Math.round(hra),
      special: Math.round(special),
      epf: Math.round(epfContribution),
      professionalTax: Math.round(professionalTax),
      grossSalary: Math.round(gross),
      deductions: Math.round(totalDeductions),
      netSalary: Math.round(netSalary),
    };
  }, [monthlyGross, limitPF]);

  const handleGenerate = async () => {
    if (!selectedEmployeeId || monthlyGross <= 0) {
      toast.error("Please select an employee and enter a valid gross salary.");
      return;
    }

    setGenerating(true);
    const payload = {
      employeeId: selectedEmployeeId,
      month,
      year,
      basicSalary: salaryComponents.basic,
      allowances: salaryComponents.hra + salaryComponents.special,
      deductions: salaryComponents.deductions,
      bonus: 0, // Bonus can be added later
    };

    try {
      await generatePayroll(auth.slug, payload);
      toast.success("Payroll generated successfully!");
      // Reset form
      setSelectedEmployeeId("");
      setMonthlyGross(0);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to generate payroll.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE - CONFIGURATION */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="text-lg font-semibold text-base-content">
              Generate Payroll
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full text-base-content">
                {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
              </Select>
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full text-base-content">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
            
            <Select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full text-base-content" disabled={loading}>
              <option value="">{loading ? "Loading..." : "Choose employee"}</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </Select>
            
            <div className="relative">
              <MdCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
              <Input
                type="number"
                placeholder="Enter Monthly Gross"
                value={monthlyGross || ""}
                onChange={(e) => setMonthlyGross(Number(e.target.value))}
                className="w-full placeholder:text-base-content/60 text-base-content pl-8"
              />
            </div>
          </div>
          <StatutorySettingsCard checked={limitPF} onChange={setLimitPF} />
        </div>

        {/* RIGHT SIDE - PREVIEW */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <SalarySlipPreview data={salaryComponents} />
          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={handleGenerate} disabled={generating || !selectedEmployeeId || monthlyGross <= 0}>
              {generating ? "Generating..." : "Generate & Save Payroll"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
