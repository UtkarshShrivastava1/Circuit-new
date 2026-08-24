import { useAuth } from "@/auth/AuthContext";
import { updateAccount, updateContact } from "@/services/salesService";
import { useEffect, useState } from "react";

import { entitySchemas } from "./schema/entitySchemas";
import { getSalesReps } from "@/services/salesRepServices";

type Props = {
  open: boolean;
  mode: "view" | "edit";
  type: "contact" | "account" | "lead";
  data: any;
  onClose: () => void;
  onSave?: (data: any) => void;
};

export default function EntityDrawer({
  open,
  mode,
  type,
  data,
  onClose,
  onSave,
}: Props) {
  const [salesReps, setSalesReps] = useState<any[]>([]);
 
  const [form, setForm] = useState<any>({});
  const [editMode, setEditMode] = useState(mode === "edit");
  const isAccount = type === "account";
const isContact = type === "contact";
const {auth}=useAuth();
  const slug=auth?.slug;
useEffect(() => {
  if (!slug) return;

  const fetchSalesReps = async () => {
    try {
      const res = await getSalesReps(slug);
      setSalesReps(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch sales reps:", error);
    }
  };

  fetchSalesReps();
}, [slug]);

  console.log("Sales Reps:", salesReps);
//  console.log("Drawer data:", data);
  // sync data when drawer opens
  // useEffect(() => {
  //   setForm(data || {});
  //   setEditMode(mode === "edit");
  // }, [data, open, mode]);
// console.log("PROP MODE:", mode);
// console.log("STATE EDITMODE:", editMode);
useEffect(() => {
   setEditMode(mode === "edit");
  if (!data) return;

  if (isAccount) {
    setForm({
      ...data,
      primaryContact: data.primaryContact || {},
      phone: data.primaryContact?.phone || {},
    });
  } else {
    setForm(data);
  }

 
}, [data, open, mode]);

  if(!slug){
    return null;
  }
  if (!open) return null;
const fullName = isAccount
  ? data?.accountName
  : data?.firstName && data?.lastName
    ? `${data.firstName} ${data.lastName}`
    : data?.name || "Unknown";
  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
const handleSave = async () => {
  try {
    const payload = isAccount
      ? {
          ...form,
          primaryContact: {
            ...form.primaryContact,
            phone: form.primaryContact?.phone,
          },
        }
      : {
          ...form,
          phone: {
            number: form?.phone?.number,
          },
        };

    const api = isAccount
      ? updateAccount
      : updateContact;

    const res = await api(slug, form._id, payload);

  onSave?.(res.data.data); // 👈 ye
setForm(res.data.data);  // 👈 ye bhi
setEditMode(false);
    // console.log("API Response", res.data);
    setEditMode(false);
  } catch (err) {
    console.error(err);
  }
};
const getValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
const setValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  const newObj = { ...obj };

  let temp = newObj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      temp[key] = value;
    } else {
      temp[key] = { ...temp[key] || {} };
      temp = temp[key];
    }
  });

  return newObj;
};
const title =
  type === "account"
    ? form?.accountName
    : `${form?.firstName || ""} ${form?.lastName || ""}`;
    console.log("ACCOUNT OWNER:", getValue(form, "accountOwner"));
console.log("ACCOUNT OWNER:", form?.accountOwner)
return (
  <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
    <div className="w-full max-w-2xl bg-base-100 h-full shadow-xl flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>

          <p className="text-sm text-gray-500">
            {isAccount
              ? form?.industry
              : form?.company}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {!editMode && (
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}

          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="p-3 border-b flex gap-2">
        <button className="btn btn-sm btn-primary">
          Call
        </button>

        <button className="btn btn-sm btn-outline">
          Email
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 overflow-auto flex-1">
        <div className="grid grid-cols-2 gap-4 text-sm">

          {entitySchemas[type]?.map((field: any) => (
           
//             <FieldEdit
//   key={field.key}
//   fieldKey={field.key}
//   label={field.label}
//   value={getValue(form, field.key)}
//   editable={editMode}
//   salesReps={salesReps}
//     accountOwner={form?.accountOwner}
//   onChange={(val: any) =>
//     setForm((prev: any) =>
//       setValue(prev, field.key, val)
//     )
//   }
// />
<FieldEdit
  key={field.key}
  fieldKey={field.key}
  label={field.label}
  value={getValue(form, field.key)}
  editable={editMode}
  salesReps={salesReps}
  accountOwner={form?.accountOwner}
  assignedRep={form?.assignedRep}
  onChange={(val: any) => {
    if (field.key === "accountOwner.name") {
      setForm((prev: any) => ({
        ...prev,
        accountOwner: val,
      }));
    } else if (field.key === "assignedRep.name") {
      setForm((prev: any) => ({
        ...prev,
        assignedRep: val,
      }));
    } else {
      setForm((prev: any) =>
        setValue(prev, field.key, val)
      );
    }
  }}
/>

          ))}

        </div>
      </div>

      {/* FOOTER */}
      {editMode && (
        <div className="p-3 border-t flex justify-end gap-2">
          <button
            className="btn btn-sm"
            onClick={() => {
              setForm(data);
              setEditMode(false);
            }}
          >
            Cancel
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}

    </div>
  </div>
);
}
// function FieldEdit({ label, value, editable, onChange }: any) {
//   const isDate =
//     label === "Created At" ||
//     label === "Updated At";

//   const displayValue =
//     isDate && value
//       ? new Date(value).toLocaleString("en-IN", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : value;
//   return (
//     <div className="bg-base-200 p-3 rounded-lg">
//       <div className="text-xs text-gray-500">{label}</div>

//      {editable ? (
//   <input
//     className="w-full bg-transparent outline-none font-medium"
//     value={value || ""}
//     maxLength={10}
//     onChange={(e) => {
//       const val = e.target.value;

//       if (/^\d*$/.test(val)) {
//         onChange?.(val);
//       }
//     }}
//   />
// ) : (
//   <div className="font-medium break-words">
//     {displayValue || "-"}
//   </div>
// )}
//     </div>
//   );
// }
function FieldEdit({
  label,
  value,
  editable,
  onChange,
  fieldKey,
  accountOwner,

  assignedRep,
  
  salesReps=[],
}: any) {
  const isDate =
    label === "Created At" ||
    label === "Updated At" ||
     fieldKey === "dob";

const displayValue =
  isDate && value
    ? fieldKey === "dob"
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date(value).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
    : value;
  const accountTypeOptions = [
    "Individual",
    "Business",
    "Enterprise",
    "Distributor",
    "Retailer",
    "Partner",
  ];

  const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Manufacturing",
    "Education",
    "Retail",
    "Other",
  ];

  const countryOptions = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "UAE",
    "Other",
  ];

  const paymentTermsOptions = [
    "Immediate",
    "Net 15",
    "Net 30",
    "Net 60",
  ];
  const leadSourceOptions = [
  "Website",
  "Referral",
  "Social Media",
  "Email",
  "Cold Call",
  "Advertisement",
  "Other",
];

const statusOptions = [
 "Active",
    "Inactive",
    "Prospect",
    "Customer",
    "VIP",
    "Blocked",
];

const genderOptions = [
  "Male",
  "Female",
  "Other",
];
const countryCodeOptions = [
  "+91",
  "+1",
  "+44",
  "+61",
  
  "+49",
  "+33",
  "+65",
  "+971",
];
  const isSelect =
  fieldKey === "accountOwner.name" ||
fieldKey === "assignedRep.name" ||
    fieldKey === "accountType" ||
    fieldKey === "industry" ||
    fieldKey === "billingAddress.country" ||
    fieldKey === "shippingAddress.country" ||
      fieldKey === "leadSource" ||
  fieldKey === "status" ||
  fieldKey === "gender"||
  fieldKey === "phone.countryCode"||
    fieldKey === "paymentTerms";

  const getOptions = () => {
    switch (fieldKey) {
      case "accountType":
        return accountTypeOptions;

      case "industry":
        return industryOptions;

      case "billingAddress.country":
      case "shippingAddress.country":
        return countryOptions;

      case "paymentTerms":
        return paymentTermsOptions;
      
      case "leadSource":
      return leadSourceOptions;

    case "status":
      return statusOptions;

    case "gender":
      return genderOptions;
    case "phone.countryCode":
      return countryCodeOptions;
      default:
        return [];
    }
  };
console.log("FIELD:", fieldKey, "VALUE:", value);

  return (
    <div className="bg-base-200 p-3 rounded-lg">
      <div className="text-xs text-gray-500 mb-1">
        {label}
      </div>

    {editable ? (
  fieldKey === "accountOwner.name" || fieldKey === "assignedRep.name" ? (
    <select
      className="select select-bordered select-sm w-full"
      value={
        fieldKey === "accountOwner.name"
          ? accountOwner?._id || ""
          : assignedRep?._id || ""
      }
      onChange={(e) => {
        const selectedRep = salesReps.find(
          (rep: any) =>
            (rep.memberId?._id || rep._id) === e.target.value
        );

        if (!selectedRep) return;

        const repObject = {
          _id: selectedRep.memberId?._id || selectedRep._id,
          name: selectedRep.memberId?.name || selectedRep.name,
          email: selectedRep.memberId?.email || selectedRep.email,
        };

        onChange?.(repObject);
      }}
    >
      <option value="">-Select Rep-</option>

      {salesReps.map((rep: any) => (
        <option
          key={rep.memberId?._id || rep._id}
          value={rep.memberId?._id || rep._id}
        >
          {rep.memberId?.name || rep.name}
        </option>
      ))}
    </select>): fieldKey === "sameAsBilling" ? (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
        checked={!!value}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="text-sm">Same as Billing</span>
    </label>

  ) : isSelect ? (
    <select
      className="select select-bordered select-sm w-full"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">-Select-</option>

      {getOptions().map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

  ) : fieldKey === "description" ? (
    <textarea
      className="textarea textarea-bordered w-full font-medium"
      value={value || ""}
      rows={3}
      onChange={(e) => onChange?.(e.target.value)}
    />

  ) : fieldKey === "annualRevenue" ? (
    <input
      type="number"
      className="input input-bordered input-sm w-full"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />

  ) : fieldKey === "website" ? (
    <input
      type="url"
      className="input input-bordered input-sm w-full"
      value={value || ""}
      placeholder="https://www.company.com"
      onChange={(e) => onChange?.(e.target.value)}
    />

  ) : (
   <input
  type={  fieldKey === "dob"
    ? "date"
    :fieldKey === "phone.number" ? "tel" : fieldKey === "email" ? "email" : "text"}
  className="input input-bordered input-sm w-full font-medium"
 value={
  fieldKey === "dob" && value
    ? new Date(value).toISOString().split("T")[0]
    : value || ""
}
  maxLength={fieldKey === "phone.number" ? 10 : undefined}
  inputMode={fieldKey === "phone.number" ? "numeric" : undefined}
  onChange={(e) => {
    let val = e.target.value;

    if (fieldKey === "phone.number") {
      // Only digits
      val = val.replace(/\D/g, "");

      // Maximum 10 digits
      val = val.slice(0, 10);
    }

    onChange?.(val);
  }}
/>
  )
) : (
  <div className="font-medium break-words">
    {displayValue || "-"}
  </div>
)}
    </div>
  );
}