import { useState } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { calculateSalary } from "../../utils/salaryCalculator";
import type { Employee, SalaryStructure } from "../../type/payslip";

/* MOCK DATA */

const EMPLOYEES: Employee[] = [
  { id: "1", name: "Vinay Kumar", role: "Developer", salaryStructureId: "1" },
  { id: "2", name: "Rahul Sharma", role: "Designer", salaryStructureId: "2" },
];

const STRUCTURES: SalaryStructure[] = [
  {
    id: "1",
    name: "Developer Structure",
    basic: 30000,
    hra: 10000,
    allowances: 5000,
    bonus: 2000,
    deductions: 3000,
  },
  {
    id: "2",
    name: "Designer Structure",
    basic: 25000,
    hra: 8000,
    allowances: 4000,
    bonus: 1500,
    deductions: 2500,
  },
];

export default function GeneratePayslip() {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [preview, setPreview] = useState<any>(null);

  const handleGenerate = () => {
    const employee = EMPLOYEES.find(e => e.id === employeeId);
    if (!employee) return;

    const structure = STRUCTURES.find(
      s => s.id === employee.salaryStructureId
    );

    if (!structure) return;

    const result = calculateSalary(structure);

    setPreview({
      employee,
      structure,
      ...result,
    });
  };

  return (
    <div className="space-y-6">

      {/* Selection Section */}
      <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-4 text-base-content">

        <h2 className="text-lg font-semibold">Generate Payslip</h2>

        <Select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="">Select Employee</option>
          {EMPLOYEES.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} - {emp.role}
            </option>
          ))}
        </Select>

        <input
          type="month"
          className="input input-bordered w-full"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!employeeId || !month}
          className="text-base-content"
        >
          Generate Preview
        </Button>
      </div>

      {/* Preview Section */}
      {/* {preview && (
        <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-4">

          <h3 className="font-semibold">
            Payslip Preview – {preview.employee.name}
          </h3>

          <div className="text-sm space-y-2">

            <div className="flex justify-between">
              <span>Basic</span>
              <span>₹ {preview.structure.basic}</span>
            </div>

            <div className="flex justify-between">
              <span>HRA</span>
              <span>₹ {preview.structure.hra}</span>
            </div>

            <div className="flex justify-between">
              <span>Allowances</span>
              <span>₹ {preview.structure.allowances}</span>
            </div>

            <div className="flex justify-between">
              <span>Bonus</span>
              <span>₹ {preview.structure.bonus}</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold">
              <span>Gross</span>
              <span>₹ {preview.gross}</span>
            </div>

            <div className="flex justify-between text-error">
              <span>Deductions</span>
              <span>₹ {preview.totalDeductions}</span>
            </div>

            <div className="flex justify-between text-primary font-bold">
              <span>Net Pay</span>
              <span>₹ {preview.netPay}</span>
            </div>

          </div>
        </div>
      )} */}

      {preview && (
  <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-sm">

    <h3 className="font-semibold text-lg mb-4 text-base-content">
      Payslip Preview – {preview.employee.name}
    </h3>

    <div className="space-y-3 text-sm">

      <div className="flex justify-between text-base-content/80">
        <span>Basic</span>
        <span>₹ {preview.structure.basic}</span>
      </div>

      <div className="flex justify-between text-base-content/80">
        <span>HRA</span>
        <span>₹ {preview.structure.hra}</span>
      </div>

      <div className="flex justify-between text-base-content/80">
        <span>Allowances</span>
        <span>₹ {preview.structure.allowances}</span>
      </div>

      <div className="flex justify-between text-base-content/80">
        <span>Bonus</span>
        <span>₹ {preview.structure.bonus}</span>
      </div>

      <div className="border-t border-base-300 my-3"></div>

      <div className="flex justify-between text-accent font-semibold">
        <span>Gross</span>
        <span>₹ {preview.gross}</span>
      </div>

      <div className="flex justify-between text-error">
        <span>Deductions</span>
        <span>₹ {preview.totalDeductions}</span>
      </div>

      <div className="flex justify-between text-primary font-bold text-base">
        <span>Net Pay</span>
        <span>₹ {preview.netPay}</span>
      </div>

    </div>
  </div>
)}
    </div>
  );
}
