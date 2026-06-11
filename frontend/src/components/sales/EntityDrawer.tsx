// // import React, { useEffect, useState } from "react";
// // import { contactSchema } from "./schemas/contactSchema";
// // export const schemaRegistry = {
// //   contact: contactSchema,
 
// // };
// // export default function EntityDrawer({
// //   open,
// //   mode,
// //   type,
// //   data,
// //   onClose,
// //   onSave,
// // }: any) {
// //   const [form, setForm] = useState<any>({});

// //   useEffect(() => {
// //     setForm(data || {});
// //   }, [data]);

// //   if (!open) return null;

// //   const fields = schemaRegistry[type];

// //   return (
// //     <div className="fixed right-0 top-0 w-[400px] h-full bg-base-100 shadow-xl z-50 p-4">

// //       {/* HEADER */}
// //       <div className="flex justify-between mb-4">
// //         <h2>{mode === "view" ? "View" : "Edit"} Contact</h2>
// //         <button onClick={onClose}>X</button>
// //       </div>

// //       {/* FORM */}
// //       {fields.map((field: any) => (
// //         <div key={field.key} className="mb-3">
// //           <label className="text-xs">{field.label}</label>

// //           <input
// //             className="input input-sm input-bordered w-full"
// //             value={form[field.key] || ""}
// //             disabled={mode === "view"}
// //             onChange={(e) =>
// //               setForm({ ...form, [field.key]: e.target.value })
// //             }
// //           />
// //         </div>
// //       ))}

// //       {/* FOOTER */}
// //       {mode === "edit" && (
// //         <div className="flex gap-2 mt-4">
// //           <button className="btn btn-primary btn-sm" onClick={() => onSave(form)}>
// //             Save
// //           </button>
// //           <button className="btn btn-ghost btn-sm" onClick={onClose}>
// //             Cancel
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import { useState } from "react";
// import { MdClose, MdCall, MdEmail } from "react-icons/md";

// type Props = {
//   open: boolean;
//   mode: "view" | "edit";
//   type: "contact" | "account" | "lead";
//   data: any;
//   onClose: () => void;
//   onSave?: (data: any) => void;
// };

// export default function EntityDrawer({
//   open,
//   mode,
//   type,
//   data,
//   onClose,
//   onSave,
// }: Props) {
  
//   if (!open) return null;

//   const fullName =
//     data?.firstName + " " + data?.lastName || data?.name || "Unknown";

//   return (
//     <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
//       <div className="w-full max-w-2xl bg-base-100 h-full shadow-xl overflow-hidden flex flex-col">

//         {/* HEADER */}
//         <div className="p-4 border-b flex justify-between items-center">
//           <div>
//             <h2 className="text-xl font-bold">{fullName}</h2>
//             <p className="text-sm text-gray-500">{data?.company}</p>
//           </div>

//           <button onClick={onClose}>
//             <MdClose size={22} />
//           </button>
//         </div>

//         {/* ACTIONS */}
//         <div className="p-3 flex gap-2 border-b">
//           <button className="btn btn-sm btn-primary gap-2">
//             <MdCall /> Call
//           </button>
//           <button className="btn btn-sm btn-outline gap-2">
//             <MdEmail /> Email
//           </button>
//         </div>

//         {/* TABS */}
       

//         {/* BODY */}
//         <div className="p-4 overflow-auto flex-1">

//           {/* OVERVIEW */}
        
//             <div className="grid grid-cols-2 gap-4 text-sm">

//               <Field label="First Name" value={data?.firstName} />
//               <Field label="Last Name" value={data?.lastName} />

//               <Field label="Email" value={data?.email} />
//               <Field
//                 label="Phone"
//                 value={data?.phone?.number}
//               />

//               <Field label="Company" value={data?.company} />
//               <Field label="Department" value={data?.department} />

//               <Field label="Designation" value={data?.designation} />
//               <Field label="Lead Source" value={data?.leadSource} />

//               <Field label="Status" value={data?.status} />
//               <Field label="Gender" value={data?.gender} />

//               <Field
//                 label="Assigned Rep"
//                 value={data?.assignedRep?.name}
//               />

//               <Field label="City" value={data?.address?.city} />
//               <Field label="State" value={data?.address?.state} />

//               <Field label="Alt Email" value={data?.altEmail} />
//               <Field label="Alt Phone" value={data?.altPhoneNumber} />
//             </div>
      

//         </div>

//         {/* FOOTER (EDIT MODE) */}
//         {mode === "edit" && (
//           <div className="p-3 border-t flex justify-end gap-2">
//             <button className="btn btn-sm" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="btn btn-sm btn-primary">
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* reusable field */
// function Field({ label, value }: any) {
//   return (
//     <div className="bg-base-200 p-3 rounded-lg">
//       <div className="text-xs text-gray-500">{label}</div>
//       <div className="font-medium break-words">
//         {value || "-"}
//       </div>
//     </div>
//   );
// }


import { useAuth } from "@/auth/AuthContext";
import { updateAccount, updateContact } from "@/services/salesService";
import { useEffect, useState } from "react";

import { entitySchemas } from "./schema/entitySchemas";

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
  const [form, setForm] = useState<any>({});
  const [editMode, setEditMode] = useState(mode === "edit");
  const isAccount = type === "account";
const isContact = type === "contact";
 console.log("Drawer data:", data);
  // sync data when drawer opens
  // useEffect(() => {
  //   setForm(data || {});
  //   setEditMode(mode === "edit");
  // }, [data, open, mode]);
console.log("PROP MODE:", mode);
console.log("STATE EDITMODE:", editMode);
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
  const {auth}=useAuth();
  const slug=auth?.slug;
  if(!slug){
    return null;
  }
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
    console.log("API Response", res.data);
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
            <FieldEdit
              key={field.key}
              label={field.label}
              value={getValue(form, field.key)}
              editable={editMode}
              onChange={(val: any) =>
                setForm((prev: any) =>
                  setValue(prev, field.key, val)
                )
              }
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
function FieldEdit({ label, value, editable, onChange }: any) {
  const isDate =
    label === "Created At" ||
    label === "Updated At";

  const displayValue =
    isDate && value
      ? new Date(value).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : value;
  return (
    <div className="bg-base-200 p-3 rounded-lg">
      <div className="text-xs text-gray-500">{label}</div>

      {editable ? (
        <input
          className="w-full bg-transparent outline-none font-medium"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <div className="font-medium break-words">
          {displayValue || "-"}
        </div>
      )}
    </div>
  );
}