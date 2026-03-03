// import { useState, useEffect } from "react";
// import { MdClose, MdCurrencyRupee } from "react-icons/md";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// // import type SalaryStructure  from "./SalaryStructureCard";
// import type { SalaryStructure } from "./SalaryStructureCard";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: SalaryStructure) => void;
//   initialData?: SalaryStructure | null;
// }

// export default function SalaryStructureModal({
//   open,
//   onClose,
//   onSave,
//   initialData,
// }: Props) {
//   if (!open) return null;

//   const [form, setForm] = useState<SalaryStructure>({
//     id: crypto.randomUUID(),
//     name: "",
//     basic: 0,
//     hra: 0,
//     allowances: 0,
//     bonus: 0,
//     deductions: 0,
//   });

//   useEffect(() => {
//     if (initialData) {
//       setForm(initialData);
//     }
//   }, [initialData]);

//   const netSalary =
//     form.basic +
//     form.hra +
//     form.allowances +
//     form.bonus -
//     form.deductions;

//   const handleChange = (key: keyof SalaryStructure, value: string) => {
//     setForm({
//       ...form,
//       [key]: key === "name" ? value : Number(value),
//     });
//   };

//   return (
//     <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
//     open ? 'bg-black/40 opacity-100 visible' : 'bg-black/0 opacity-0 invisible pointer-events-none'
//   }`}>
//     <div className={`w-full max-w-xl bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden transform transition-all duration-300 ${
//       open 
//         ? 'scale-100 opacity-100 translate-y-0' 
//         : 'scale-95 opacity-0 translate-y-4'
//     }`}>
//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-base-300">
//         <h3 className="text-lg font-semibold">
//           {initialData ? "Edit Salary Structure" : "Create Salary Structure"}
//         </h3>
//         <button onClick={onClose} className="btn btn-sm btn-ghost">
//           <MdClose size={18} />
//         </button>
//       </div>

//         {/* BODY */}
//         <div className="p-6 space-y-5">

//           {/* NAME */}
//           <div>
//             <label className="text-sm text-base-content/70 mb-0.5 ml-0.5 ">
//               Structure Name
//             </label>
            
//           <Input
//             placeholder="Structure Name (e.g. Senior Developer)"
//             value={form.name}
//             onChange={(e) => handleChange("name", e.target.value)}
//           />
//           </div>

//           {/* COMPONENTS GRID */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-start flex-col">
//               <label className="text-sm text-base-content/70 mb-0.5 ml-0.5 ">Basic Salary</label>

//             <Input
//               type="number"
//               placeholder="Basic"
//               value={form.basic}
//               onChange={(e) => handleChange("basic", e.target.value)}
//             />
//             </div>


//             <div>
//               <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">HRA</label>
//             <Input
//               type="number"
//               placeholder="HRA"
//               value={form.hra}
//               onChange={(e) => handleChange("hra", e.target.value)}
//             />
//             </div>


//             <div>
//               <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">Allowances</label>
//             <Input
//               type="number"
//               placeholder="Allowances"
//               value={form.allowances}
//               onChange={(e) => handleChange("allowances", e.target.value)}
//             />
//             </div>


// <div>
//               <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">Bonus</label>
//             <Input
//               type="number"
//               placeholder="Bonus"
//               value={form.bonus}
//               onChange={(e) => handleChange("bonus", e.target.value)}
//             />
// </div>


// <div>
//               <label className="text-sm text-base-content/70 mb-0.5 ml-0.5">Deductions</label>  
//             <Input
//               type="number"
//               placeholder="Deductions"
//               value={form.deductions}
//               onChange={(e) => handleChange("deductions", e.target.value)}
//               className="col-span-2"
//             />
// </div>
//           </div>

//           {/* LIVE PREVIEW */}
//           <div className="bg-base-200 border border-base-300 rounded-xl p-4 flex justify-between items-center">
//             <span className="font-medium text-base-content">
//               Net Salary
//             </span>

//             <span className="text-xl font-semibold text-primary flex items-center gap-1">
//               <MdCurrencyRupee size={20} />
//               {netSalary.toLocaleString()}
//             </span>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="px-6 py-4 border-t border-base-300 flex justify-end gap-2">
//           <Button variant="ghost" onClick={onClose}>
//             Cancel
//           </Button>

//           <Button
//             variant="primary"
//             disabled={!form.name}
//             onClick={() => {
//               onSave(form);
//               onClose();
//             }}
//           >
//             {initialData ? "Update" : "Create"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { MdClose, MdCurrencyRupee, MdDelete } from "react-icons/md";
import Button from "@/components/ui/Button";
import LabeledInput from "@/components/ui/LabeledInput";
import type { SalaryStructure, SalaryComponent } from "./SalaryStructureCard";

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
    components: [
      {
        id: crypto.randomUUID(),
        label: "Basic Salary",
        amount: 0,
        type: "earning",
      },
    ],
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const addComponent = (type: "earning" | "deduction") => {
    const newComponent: SalaryComponent = {
      id: crypto.randomUUID(),
      label: "",
      amount: 0,
      type,
    };

    setForm({
      ...form,
      components: [...form.components, newComponent],
    });
  };

  const removeComponent = (id: string) => {
    setForm({
      ...form,
      components: form.components.filter((c) => c.id !== id),
    });
  };

  const updateComponent = (
    id: string,
    key: "label" | "amount",
    value: string
  ) => {
    setForm({
      ...form,
      components: form.components.map((c) =>
        c.id === id
          ? {
              ...c,
              [key]: key === "amount" ? Number(value) : value,
            }
          : c
      ),
    });
  };

  const totalEarnings = form.components
    .filter((c) => c.type === "earning")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalDeductions = form.components
    .filter((c) => c.type === "deduction")
    .reduce((sum, c) => sum + c.amount, 0);

  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">

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

          {/* Structure Name */}
          <div>
            {/* <label className="text-sm text-base-content/70 mb-1">
              Structure Name
            </label> */}
            <LabeledInput
            label="Structure Name"
              placeholder="Structure Name (e.g. Senior Developer)"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-2 gap-4">
            {form.components.map((comp) => (
              <div key={comp.id} className="relative">

                {/* Editable Label */}
                {/* <LabeledInput
                  label="Base Salary"
                  placeholder="Component Name"
                  value={comp.label}
                  onChange={(e) =>
                    updateComponent(comp.id, "label", e.target.value)
                  }
                 
                /> */}

                {/* Amount */}
                <LabeledInput
                label={`${comp.type === "earning" ? "Earning" : "Deduction"} Amount`}
                  type="number"
                  placeholder="Amount"
                  value={comp.amount}
                  onChange={(e) =>
                    updateComponent(comp.id, "amount", e.target.value)
                  }
                />

                {/* Delete Button */}
                <button
                  onClick={() => removeComponent(comp.id)}
                  className="absolute top-1 right-1 text-error text-lg"
                >
                  -
                </button>
              </div>
            ))}
          </div>

          {/* Add Buttons */}
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addComponent("earning")}
            >
              + Add Earning
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => addComponent("deduction")}
            >
              + Add Deduction
            </Button>
          </div>

          {/* Net Salary Preview */}
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