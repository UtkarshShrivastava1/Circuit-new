import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import StatutorySettingsCard from "@/components/salary/StatutorySettingsCard";
import SalarySlipPreview from "@/components/salary/SalarySlipPreview";
import { useAuth } from "@/auth/AuthContext";
// import { getAllEmployees } from "@/services/attendanceService";
import { setStructure } from "@/services/payrollService";
// import api from "@/services/api";
import { toast } from "react-toastify";
import { MdCurrencyRupee } from "react-icons/md";
import { getMembers } from "@/services/memberService";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface Employee {
  _id: string;
  name: string;
  email: string;
}

interface CustomRow {
  id: string;
  label: string;
  amount: number;
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
  const [limitPF, setLimitPF] = useState(true);
  
  const [salaryData, setSalaryData] = useState({
    basic: 0,
    da: 0,
    hra: 0,
    special: 0,
    epf: 0,
    professionalTax: 0,
    customEarnings: [] as CustomRow[],
    customDeductions: [] as CustomRow[],
  });

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

  useEffect(() => {
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

    setSalaryData(prev => ({
      basic: Math.round(basic),
      da: 0, // For future use
      hra: Math.round(hra),
      special: Math.round(special),
      epf: Math.round(epfContribution),
      professionalTax: Math.round(professionalTax),
      customEarnings: prev.customEarnings || [],
      customDeductions: prev.customDeductions || [],
    }));
  }, [monthlyGross, limitPF]);

  const handleSaveStructure = async () => {
    if (!selectedEmployeeId || monthlyGross <= 0) {
      toast.error("Please select an employee and enter a valid gross salary.");
      return;
    }

    setGenerating(true);
    const calculatedGross = 
      salaryData.basic + 
      salaryData.da + 
      salaryData.hra + 
      salaryData.special + 
      salaryData.customEarnings.reduce((sum, item) => sum + item.amount, 0);

    const payload = {
      employeeId: selectedEmployeeId,
      monthlyGross: calculatedGross > 0 ? calculatedGross : monthlyGross,
      taxRegime: "new",
      limitPF,
      ...salaryData
    };

    try {
      // Important: Ensure this endpoint matches your admin.payroll.routes.js exactly
      await setStructure(auth.slug, payload);
      toast.success("Salary structure saved successfully!");
      // Reset form
      setSelectedEmployeeId("");
      setMonthlyGross(0);
      setSalaryData(prev => ({
        ...prev,
        customEarnings: [],
        customDeductions: [],
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to save salary structure.";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddCustomRow = (type: 'earning' | 'deduction') => {
    const key = type === 'earning' ? 'customEarnings' : 'customDeductions';
    setSalaryData(prev => ({
      ...prev,
      [key]: [...prev[key], { id: crypto.randomUUID(), label: '', amount: 0 }]
    }));
  };

  const handleChangeCustomRow = (type: 'earning' | 'deduction', id: string, field: 'label' | 'amount', value: string | number) => {
    const key = type === 'earning' ? 'customEarnings' : 'customDeductions';
    setSalaryData(prev => ({
      ...prev,
      [key]: prev[key].map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  const handleRemoveCustomRow = (type: 'earning' | 'deduction', id: string) => {
    const key = type === 'earning' ? 'customEarnings' : 'customDeductions';
    setSalaryData(prev => ({
      ...prev,
      [key]: prev[key].filter(row => row.id !== id)
    }));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT SIDE - CONFIGURATION */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="text-lg font-semibold text-base-content">
              Configure Salary
            </h3>
            
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
          <SalarySlipPreview 
            data={salaryData} 
            editable={true} 
            onChange={(key, value) => setSalaryData(prev => ({ ...prev, [key]: value }))}
            onAddCustomRow={handleAddCustomRow}
            onChangeCustomRow={handleChangeCustomRow}
            onRemoveCustomRow={handleRemoveCustomRow}
          />
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
            <Button variant="primary" onClick={handleSaveStructure} disabled={generating || !selectedEmployeeId || monthlyGross <= 0}>
              {generating && selectedEmployeeId ? "Saving..." : "Save Salary Structure"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
