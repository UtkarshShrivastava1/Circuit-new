import { useState, useEffect } from "react";
import { MdClose, MdCurrencyRupee } from "react-icons/md";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type SalaryStructure  from "./SalaryStructureCard";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: SalaryStructure) => void;
  initialData?: SalaryStructure | null;
}

export default function SalaryStructureModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  if (!open) return null;

  const [form, setForm] = useState<SalaryStructure>({
    id: crypto.randomUUID(),
    name: "",
    basic: 0,
    hra: 0,
    allowances: 0,
    bonus: 0,
    deductions: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const netSalary =
    form.basic +
    form.hra +
    form.allowances +
    form.bonus -
    form.deductions;

  const handleChange = (key: keyof SalaryStructure, value: string) => {
    setForm({
      ...form,
      [key]: key === "name" ? value : Number(value),
    });
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
    open ? 'bg-black/40 opacity-100 visible' : 'bg-black/0 opacity-0 invisible pointer-events-none'
  }`}>
    <div className={`w-full max-w-xl bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden transform transition-all duration-300 ${
      open 
        ? 'scale-100 opacity-100 translate-y-0' 
        : 'scale-95 opacity-0 translate-y-4'
    }`}>
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-base-300">
        <h3 className="text-lg font-semibold">
          {initialData ? "Edit Salary Structure" : "Create Salary Structure"}
        </h3>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          <MdClose size={18} />
        </button>
      </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm text-base-content/70 mb-0.5 ml-0.5 ">
              Structure Name
            </label>
            
          <Input
            placeholder="Structure Name (e.g. Senior Developer)"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          </div>

          {/* COMPONENTS GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start flex-col">
              <label className="text-sm text-base-content/70 mb-0.5 ml-0.5 ">Basic Salary</label>

            <Input
              type="number"
              placeholder="Basic"
              value={form.basic}
              onChange={(e) => handleChange("basic", e.target.value)}
            />
            </div>


            <div>
              <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">HRA</label>
            <Input
              type="number"
              placeholder="HRA"
              value={form.hra}
              onChange={(e) => handleChange("hra", e.target.value)}
            />
            </div>


            <div>
              <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">Allowances</label>
            <Input
              type="number"
              placeholder="Allowances"
              value={form.allowances}
              onChange={(e) => handleChange("allowances", e.target.value)}
            />
            </div>


<div>
              <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">Bonus</label>
            <Input
              type="number"
              placeholder="Bonus"
              value={form.bonus}
              onChange={(e) => handleChange("bonus", e.target.value)}
            />
</div>


<div>
              <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">Deductions</label>  
            <Input
              type="number"
              placeholder="Deductions"
              value={form.deductions}
              onChange={(e) => handleChange("deductions", e.target.value)}
              className="col-span-2"
            />
</div>
          </div>

          {/* LIVE PREVIEW */}
          <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex justify-between items-center">
            <span className="font-medium text-base-content">
              Net Salary
            </span>

            <span className="text-xl font-semibold text-primary flex items-center gap-1">
              <MdCurrencyRupee size={20} />
              {netSalary.toLocaleString()}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-base-300 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!form.name}
            onClick={() => {
              onSave(form);
              onClose();
            }}
          >
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
