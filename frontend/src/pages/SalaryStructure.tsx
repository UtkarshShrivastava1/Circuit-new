import { useState } from "react";
import { type SalaryStructure } from "../components/salary/SalaryStructureCard";
import SalaryStructureModal from "../components/salary/SalaryStructureModal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { MdAdd } from "react-icons/md";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { EMPLOYEES, type Employee } from "../type/Salary";
import StatutorySettingsCard from "@/components/salary/StatutorySettingsCard";
import SalarySlipPreview from "@/components/salary/SalarySlipPreview";

/* ---------- MOCK DATA ---------- */

// const INITIAL_STRUCTURES: SalaryStructure[] = [
//   {
//     id: "1",
//     name: "Salman Khan",
//     role: "Junior Developer",
//     basic: 25000,
//     hra: 8000,
//     allowances: 3000,
//     bonus: 2000,
//     deductions: 1500,
//   },
//   {
//     id: "2",
//     name: "Aamir Khan",
//     role: "Senior Developer",
//     basic: 50000,
//     hra: 15000,
//     allowances: 8000,
//     bonus: 5000,
//     deductions: 4000,
//   },
// ];

const INITIAL_STRUCTURES: Employee[] = [
  { Employee_id: "1", Employee_name: "Vinay Kumar" },
  { Employee_id: "2", Employee_name: "Rahul Sharma" },
  { Employee_id: "3", Employee_name: "Priya Patel" },
  { Employee_id: "4", Employee_name: "Amitabh Bachchan" },
  { Employee_id: "5", Employee_name: "Deepika Padukone" },
  { Employee_id: "6", Employee_name: "Salman Khan" },
  { Employee_id: "7", Employee_name: "Kareena Kapoor" },
];

/* ---------- COMPONENT ---------- */

export default function SalaryStructureDashboard() {
  const [structures, setStructures] =
    useState<SalaryStructure[]>(INITIAL_STRUCTURES);
  const [employeeNames] = useState<Employee[]>(EMPLOYEES);

  const [openModal, setOpenModal] = useState(false);
  const [editingStructure, setEditingStructure] =
    useState<SalaryStructure | null>(null);
  const [limitPF, setLimitPF] = useState(true);

  /* ---------- CREATE / UPDATE ---------- */

  const handleSave = (data: SalaryStructure) => {
    if (editingStructure) {
      // Update
      setStructures((prev) => prev.map((s) => (s.id === data.id ? data : s)));
      setEditingStructure(null);
    } else {
      // Create
      setStructures((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }
  };

  /* ---------- DELETE ---------- */

  const handleDelete = (id: string) => {
    if (!confirm("Delete this salary structure?")) return;

    setStructures((prev) => prev.filter((s) => s.id !== id));
  };

  /* ---------- EDIT ---------- */

  const handleEdit = (structure: SalaryStructure) => {
    setEditingStructure(structure);
    setOpenModal(true);
  };

  /* ---------- OPEN CREATE ---------- */

  const handleCreate = () => {
    setEditingStructure(null);
    setOpenModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        {/* <div>
          <h2 className="text-xl font-semibold text-base-content">
            Salary Structures
          </h2>
          <p className="text-sm text-base-content/60">
            Manage employee salary templates
          </p>
        </div> */}

        <Button variant="primary" onClick={handleCreate}>
          <MdAdd className="mr-1" size={18} />
          Add Structure
        </Button>
      </div>

      {/* CONTENT */}
      {structures.length === 0 ? (
        <EmptyState
          title="No salary structures"
          description="Create your first salary structure"
          action={
            <Button variant="primary" onClick={handleCreate}>
              Create Structure
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full h-fit   ">
            {/* LEFT SIDE */}
            <div className="bg-base-100 border-3 border-base-300 rounded-2xl p-6 shadow-sm space-y-2 h-fit ">
              <h3 className="text-lg font-semibold text-base-content">
                Target Selection
              </h3>

              {/* Select Employee */}
              <div className="space-y-2">
                <label className="text-xs text-base-content ">
                  Select Employee
                </label>

                <Select className="w-full text-base-content">
                  <option value="">Choose employee</option>
                  {employeeNames.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Monthly Gross */}
              <div className="space-y-2 ">
                <label className="text-xs text-base-content/60">
                  Monthly Gross
                </label>

                <Input
                
                  type="number"
                  placeholder="Enter amount"
                  className="w-full placeholder:text-base-content/60 text-base-content"
                />
              </div>
            </div>

            <div className="w-full mt-2  h-1/2">
              <StatutorySettingsCard checked={limitPF} onChange={setLimitPF} />
            </div>

          </div>
            <div className="w-full">
              <SalarySlipPreview
                data={{
                  basic: 5000,
                  da: 1000,
                  hra: 2000,
                  special: 1500,
                  epf: 0,
                  professionalTax: 200,
                }}
              />
            </div>
        </div>
      )}

      {/* MODAL */}
      <SalaryStructureModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingStructure(null);
        }}
        onSave={handleSave}
        initialData={editingStructure}
      />
    </div>
  );
}
