// import React from "react";
// import type { Product } from "@/type/salesProduct";

// interface EditProductModalProps {
//   editModalOpen: boolean;
//   setEditModalOpen: (open: boolean) => void;
//   productToEdit: Product | null; // Keep this as it's used for form values
//   setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
//   handleEditSubmit: (editedProduct: Product) => Promise<void>; // Updated signature
// }

// export const EditProductModal: React.FC<EditProductModalProps> = ({
//   editModalOpen,
//   setEditModalOpen,
//   productToEdit,
//   setProductToEdit,
//   handleEditSubmit,
// }) => {
//   return (
//     <dialog className={`modal ${editModalOpen ? "modal-open" : ""}`}>
//       <div className="modal-box max-w-3xl">
//         <h3 className="font-bold text-lg mb-4">Edit Product</h3>
//         {productToEdit && (
//           <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(productToEdit); }} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Product Name</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.productName} onChange={(e) => setProductToEdit({...productToEdit, productName: e.target.value})} required />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Product Code</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.productCode} onChange={(e) => setProductToEdit({...productToEdit, productCode: e.target.value})} required />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">SKU</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.sku || ""} onChange={(e) => setProductToEdit({...productToEdit, sku: e.target.value})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Barcode</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.barcode || ""} onChange={(e) => setProductToEdit({...productToEdit, barcode: e.target.value})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Product Type</span></label>
//                 <select className="select select-bordered w-full" value={productToEdit.productType} onChange={(e) => setProductToEdit({...productToEdit, productType: e.target.value as any})}>
//                   <option value="ERP">ERP</option>
//                   <option value="CRM">CRM</option>
//                   <option value="SaaS">SaaS</option>
//                   <option value="POS">POS</option>
//                   <option value="HRMS">HRMS</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Software Category</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.softwareCategory || ""} onChange={(e) => setProductToEdit({...productToEdit, softwareCategory: e.target.value})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Brand</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.brand || ""} onChange={(e) => setProductToEdit({...productToEdit, brand: e.target.value})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Selling Price (₹)</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.sellingPrice || undefined} onChange={(e) => setProductToEdit({...productToEdit, sellingPrice: Number(e.target.value)})} required />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Cost Price (₹)</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.costPrice || undefined} onChange={(e) => setProductToEdit({...productToEdit, costPrice: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Stock Quantity</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.stockQuantity || undefined} onChange={(e) => setProductToEdit({...productToEdit, stockQuantity: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Reorder Level</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.reorderLevel || undefined} onChange={(e) => setProductToEdit({...productToEdit, reorderLevel: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Stock Status</span></label>
//                 <select className="select select-bordered w-full" value={productToEdit.stockStatus} onChange={(e) => setProductToEdit({...productToEdit, stockStatus: e.target.value as any})}>
//                   <option value="In Stock">In Stock</option>
//                   <option value="Low Stock">Low Stock</option>
//                   <option value="Out Of Stock">Out Of Stock</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Status</span></label>
//                 <select className="select select-bordered w-full" value={productToEdit.status} onChange={(e) => setProductToEdit({...productToEdit, status: e.target.value as any})}>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                   <option value="Discontinued">Discontinued</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">License Type</span></label>
//                 <select className="select select-bordered w-full" value={productToEdit.licenseType} onChange={(e) => setProductToEdit({...productToEdit, licenseType: e.target.value as any})}>
//                   <option value="One Time">One Time</option>
//                   <option value="Monthly">Monthly</option>
//                   <option value="Yearly">Yearly</option>
//                   <option value="Lifetime">Lifetime</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Activation Type</span></label>
//                 <select className="select select-bordered w-full" value={productToEdit.activationType} onChange={(e) => setProductToEdit({...productToEdit, activationType: e.target.value as any})}>
//                   <option value="License Key">License Key</option>
//                   <option value="Email">Email</option>
//                   <option value="Domain">Domain</option>
//                   <option value="Device">Device</option>
//                   <option value="API Key">API Key</option>
//                 </select>
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Validity Days</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.validityDays || undefined} onChange={(e) => setProductToEdit({...productToEdit, validityDays: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Max Users</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.maxUsers || undefined} onChange={(e) => setProductToEdit({...productToEdit, maxUsers: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Max Devices</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.maxDevices || undefined} onChange={(e) => setProductToEdit({...productToEdit, maxDevices: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Tax (%)</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.tax || undefined} onChange={(e) => setProductToEdit({...productToEdit, tax: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Discount (%)</span></label>
//                 <input type="number" className="input input-bordered w-full" value={productToEdit.discount || undefined} onChange={(e) => setProductToEdit({...productToEdit, discount: Number(e.target.value)})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Warehouse</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.warehouse || ""} onChange={(e) => setProductToEdit({...productToEdit, warehouse: e.target.value})} />
//               </div>
//               <div className="form-control">
//                 <label className="label"><span className="label-text">Unit of Measure (UoM)</span></label>
//                 <input type="text" className="input input-bordered w-full" value={productToEdit.uom || ""} onChange={(e) => setProductToEdit({...productToEdit, uom: e.target.value})} />
//               </div>
//               <div className="form-control col-span-1 md:col-span-2">
//                 <label className="label"><span className="label-text">Description</span></label>
//                 <textarea className="textarea textarea-bordered w-full" value={productToEdit.description || ""} onChange={(e) => setProductToEdit({...productToEdit, description: e.target.value})}></textarea>
//               </div>
//             </div>
//             <div className="modal-action">
//               <button type="button" className="btn btn-ghost" onClick={() => setEditModalOpen(false)}>Cancel</button>
//               <button type="submit" className="btn btn-primary">Save Changes</button>
//             </div>
//           </form>
//         )}
//       </div>
//     </dialog>
//   );
// };

// 1. Field
const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

// 2. SectionHeading
const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mb-6">
    <h3 className="text-base font-bold text-gray-900">{title}</h3>
    <p className="mt-1 text-xs text-gray-500">{description}</p>
  </div>
);

// 3. TextInput
const TextInput = ({
  label,
  field,
  value,
  update,
  type = "text",
  placeholder = "",
  min,
  max,
}: {
  label: string;
  field: string;
  value: any;
  update: (field: string, value: any) => void;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}) => (
  <Field label={label}>
    <input
      type={type}
      min={min}
      max={max}
      className={inputClass}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) =>
        update(
          field,
          type === "number"
            ? e.target.value === ""
              ? ""
              : Number(e.target.value)
            : e.target.value,
        )
      }
    />
  </Field>
);

// 4. SelectInput
const SelectInput = ({
  label,
  field,
  value,
  update,
  options,
}: {
  label: string;
  field: string;
  value: any;
  update: (field: string, value: any) => void;
  options: string[];
}) => (
  <Field label={label}>
    <select
      className={inputClass}
      value={value || ""}
      onChange={(e) => update(field, e.target.value)}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </Field>
);

// 5. Toggle
const Toggle = ({
  label,
  field,
  value,
  update,
}: {
  label: string;
  field: string;
  value: any;
  update: (field: string, value: any) => void;
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <input
      type="checkbox"
      className="toggle toggle-primary toggle-sm"
      checked={Boolean(value)}
      onChange={(e) => update(field, e.target.checked)}
    />
  </label>
);
import React, { useState } from "react";
import type { Product } from "@/type/salesProduct";
import {
  X,
  Package,
  IndianRupee,
  ShieldCheck,
  Globe,
  Image,
  Search,
  Plus,
  Trash2,
} from "lucide-react";

interface EditProductModalProps {
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  productToEdit: Product | null;
  setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
  handleEditSubmit: (editedProduct: Product) => Promise<void>;
}

type Tab =
  | "basic"
  | "pricing"
  | "license"
  | "platform"
  | "features"
  | "publishing"
  | "seo";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "Basic Info", icon: Package },
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "license", label: "Licensing", icon: ShieldCheck },
  { id: "platform", label: "Platforms & Links", icon: Globe },
  { id: "features", label: "Features & Plans", icon: Plus },
  { id: "publishing", label: "Publishing & Media", icon: Image },
  { id: "seo", label: "SEO", icon: Search },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";

const platforms = ["windows", "macos", "linux", "android", "ios", "web"];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  editModalOpen,
  setEditModalOpen,
  productToEdit,
  setProductToEdit,
  handleEditSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [saving, setSaving] = useState(false);

  if (!editModalOpen || !productToEdit) return null;

  // Use a flexible local type for schema fields.
  const product = productToEdit as Product & Record<string, any>;

  const update = (field: string, value: any) => {
    setProductToEdit((prev) =>
      prev ? ({ ...prev, [field]: value } as Product) : prev,
    );
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    const updated = [...(product[field] || [])];
    updated[index] = value;
    update(field, updated);
  };

  const addArrayItem = (field: string, value: any) => {
    update(field, [...(product[field] || []), value]);
  };

  const removeArrayItem = (field: string, index: number) => {
    update(
      field,
      (product[field] || []).filter((_: any, i: number) => i !== index),
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await handleEditSubmit(productToEdit);
    } finally {
      setSaving(false);
    }
  };

  // const Field = ({
  //   label,
  //   children,
  //   className = "",
  // }: {
  //   label: string;
  //   children: React.ReactNode;
  //   className?: string;
  // }) => (
  //   <div className={className}>
  //     <label className={labelClass}>{label}</label>
  //     {children}
  //   </div>
  // );

  // const TextInput = ({
  //   label,
  //   field,
  //   type = "text",
  //   placeholder = "",
  //   min,
  //   max,
  // }: {
  //   label: string;
  //   field: string;
  //   type?: string;
  //   placeholder?: string;
  //   min?: number;
  //   max?: number;
  // }) => (
  //   <Field label={label}>
  //     <input
  //       type={type}
  //       min={min}
  //       max={max}
  //       className={inputClass}
  //       value={product[field] ?? ""}
  //       placeholder={placeholder}
  //       onChange={(e) =>
  //         update(
  //           field,
  //           type === "number"
  //             ? e.target.value === ""
  //               ? ""
  //               : Number(e.target.value)
  //             : e.target.value
  //         )
  //       }
  //     />
  //   </Field>
  // );

  // const SelectInput = ({
  //   label,
  //   field,
  //   options,
  // }: {
  //   label: string;
  //   field: string;
  //   options: string[];
  // }) => (
  //   <Field label={label}>
  //     <select
  //       className={inputClass}
  //       value={product[field] || ""}
  //       onChange={(e) => update(field, e.target.value)}
  //     >
  //       <option value="">Select {label}</option>
  //       {options.map((option) => (
  //         <option key={option} value={option}>
  //           {option}
  //         </option>
  //       ))}
  //     </select>
  //   </Field>
  // );

  const SectionHeading = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div className="mb-6">
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );

  const Toggle = ({ label, field }: { label: string; field: string }) => (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="checkbox"
        className="toggle toggle-primary toggle-sm"
        checked={Boolean(product[field])}
        onChange={(e) => update(field, e.target.checked)}
      />
    </label>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Package size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Edit Product
                </h2>
                <p className="text-xs text-gray-500">
                  Update your product information
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditModalOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product summary */}
        <div className="shrink-0 border-b border-gray-100 bg-gray-50/70 px-5 py-3 sm:px-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {product.productType || "Product"}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {product.productName || "Untitled Product"}
            </span>
            <span className="text-xs text-gray-400">
              Code: {product.productCode || "—"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          {/* Navigation */}
          <div className="shrink-0 overflow-x-auto border-b border-gray-100 px-4 sm:px-6">
            <div className="flex min-w-max gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 px-3 py-3.5 text-xs font-semibold transition ${
                      active
                        ? "border-violet-600 text-violet-700"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            {/* BASIC INFORMATION */}
            {activeTab === "basic" && (
              <div>
                <SectionHeading
                  title="Basic Information"
                  description="Manage your product's identity and general details."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextInput
                    label="Product Name *"
                    field="productName"
                    value={product.productName}
                    update={update}
                    placeholder="Enter product name"
                  />

                  <TextInput
                    label="Product Code *"
                    field="productCode"
                    value={product.productCode}
                    update={update}
                    placeholder="Enter product code"
                  />
{/* 
                  <TextInput
                    label="SKU"
                    field="sku"
                    value={product.sku}
                    update={update}
                    placeholder="Enter SKU"
                  /> */}

                  {/* <TextInput
                    label="Barcode"
                    field="barcode"
                    value={product.barcode}
                    update={update}
                    placeholder="Enter barcode"
                  /> */}
                  <SelectInput
                    label="Product Type"
                    field="productType"
                    value={product.productType}
                    update={update}
                    options={["ERP", "CRM", "SaaS", "POS", "HRMS", "Other"]}
                  />
                 <SelectInput
  label="Software Category"
  field="softwareCategory"
  value={product.softwareCategory}
  update={update}
  options={[
    "Business Intelligence",
    "Project Management",
    "Marketing Automation",
    "Cloud Storage",
    "Cybersecurity",
  ]}
/>
                  <TextInput
                    label="Version"
                    field="version"
                    value={product.version}
                    update={update}
                    placeholder="e.g. 1.0.0"
                  />
                  <SelectInput
                    label="Release Channel"
                    field="releaseChannel"
                    value={product.releaseChannel}
                    update={update}
                    options={["Stable", "Beta", "Alpha"]}
                  />
                  <Field label="Description" className="md:col-span-2">
                    <textarea
                      rows={4}
                      className={`${inputClass} resize-none`}
                      value={product.description || ""}
                      placeholder="Describe your product..."
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* PRICING */}
            {activeTab === "pricing" && (
              <div>
                <SectionHeading
                  title="Pricing & Taxes"
                  description="Configure product pricing, taxes and discounts."
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      field: "sellingPrice",
                      label: "Selling Price",
                      icon: "₹",
                    },
                    {
                      field: "costPrice",
                      label: "Cost Price",
                      icon: "₹",
                    },
                    {
                      field: "tax",
                      label: "Tax Percentage",
                      icon: "%",
                    },
                    {
                      field: "discount",
                      label: "Discount Percentage",
                      icon: "%",
                    },
                  ].map((item) => (
                    <div
                      key={item.field}
                      className="rounded-xl border border-gray-200 bg-gray-50/70 p-4"
                    >
                      <label className={labelClass}>{item.label}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">
                          {item.icon}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={
                            item.field === "tax" || item.field === "discount"
                              ? 100
                              : undefined
                          }
                          className="w-full bg-transparent text-xl font-bold text-gray-900 outline-none"
                          value={product[item.field] ?? ""}
                          onChange={(e) =>
                            update(
                              item.field,
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LICENSING */}
            {activeTab === "license" && (
              <div>
                <SectionHeading
                  title="License & Activation"
                  description="Set product licensing rules and usage limits."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <SelectInput
                    label="License Type"
                    field="licenseType"
                    value={product.licenseType}
                    update={update}
                    options={["One Time", "Monthly", "Yearly", "Lifetime"]}
                  />

                  <SelectInput
                    label="Activation Type"
                    field="activationType"
                    value={product.activationType}
                    update={update}
                    options={[
                      "License Key",
                      "Email",
                      "Domain",
                      "Device",
                      "API Key",
                    ]}
                  />
                  <TextInput
                    label="Validity Days"
                    field="validityDays"
                    value={product.validityDays}
                    update={update}
                    type="number"
                    min={0}
                    placeholder="Enter validity days"
                  />

                  <TextInput
                    label="Maximum Users"
                    field="maxUsers"
                    value={product.maxUsers}
                    update={update}
                    type="number"
                    min={0}
                    placeholder="Enter maximum users"
                  />

                  <TextInput
                    label="Maximum Devices"
                    field="maxDevices"
                    value={product.maxDevices}
                    update={update}
                    type="number"
                    min={0}
                    placeholder="Enter maximum devices"
                  />
                </div>
              </div>
            )}

            {/* PLATFORMS AND LINKS */}
            {activeTab === "platform" && (
              <div>
                <SectionHeading
                  title="Platform Support & Links"
                  description="Choose supported platforms and manage product URLs."
                />

                <div className="mb-7">
                  <label className={`${labelClass} mb-3`}>
                    Supported Platforms
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {platforms.map((platform) => {
                      const selected = (product.platformSupport || []).includes(
                        platform,
                      );

                      return (
                        <label
                          key={platform}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm capitalize transition ${
                            selected
                              ? "border-violet-300 bg-violet-50 text-violet-700"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-xs"
                            checked={selected}
                            onChange={(e) => {
                              const current = product.platformSupport || [];
                              update(
                                "platformSupport",
                                e.target.checked
                                  ? [...current, platform]
                                  : current.filter(
                                      (item: string) => item !== platform,
                                    ),
                              );
                            }}
                          />
                          {platform}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextInput
                    label="Software Download URL"
                    field="softwareDownloadUrl"
                    value={product.softwareDownloadUrl}
                    update={update}
                    placeholder="https://..."
                  />

                  <TextInput
                    label="Documentation URL"
                    field="documentationUrl"
                    value={product.documentationUrl}
                    update={update}
                    placeholder="https://..."
                  />

                  <TextInput
                    label="Demo URL"
                    field="demoUrl"
                    value={product.demoUrl}
                    update={update}
                    placeholder="https://..."
                  />

                  <TextInput
                    label="Release Notes URL"
                    field="releaseNotesUrl"
                    value={product.releaseNotesUrl}
                    update={update}
                    placeholder="https://..."
                  />

                  {/* <TextInput
                    label="Video URL"
                    field="videoUrl"
                    value={product.videoUrl}
                    update={update}
                    placeholder="https://..."
                  /> */}
                </div>
              </div>
            )}

            {/* FEATURES AND PLANS */}
            {activeTab === "features" && (
              <div>
                <SectionHeading
                  title="Features & Plans"
                  description="Manage product features, pricing plans and tags."
                />

                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Product Features
                      </h4>
                      <p className="text-xs text-gray-500">
                        Add features available in this product.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addArrayItem("features", { name: "" })}
                      className="flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                    >
                      <Plus size={14} /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(product.features || []).map(
                      (feature: any, index: number) => (
                        <div key={index} className="flex gap-2">
                          <input
                            className={inputClass}
                            placeholder="Feature name"
                            value={feature.name || ""}
                            onChange={(e) =>
                              updateArrayItem("features", index, {
                                ...feature,
                                name: e.target.value,
                              })
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("features", index)}
                            className="rounded-xl border border-red-100 px-3 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ),
                    )}

                    {(!product.features || product.features.length === 0) && (
                      <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
                        No features added yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-8 border-t border-gray-100 pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Pricing Plans
                      </h4>
                      <p className="text-xs text-gray-500">
                        Configure plans offered with this product.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("plans", {
                          name: "",
                          price: undefined,
                          billingCycle: "Monthly",
                          features: [],
                        })
                      }
                      className="flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                    >
                      <Plus size={14} /> Add Plan
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(product.plans || []).map((plan: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500">
                            PLAN {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem("plans", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field label="Plan Name">
                            <input
                              className={inputClass}
                              value={plan.name || ""}
                              placeholder="e.g. Professional"
                              onChange={(e) =>
                                updateArrayItem("plans", index, {
                                  ...plan,
                                  name: e.target.value,
                                })
                              }
                            />
                          </Field>

                          <Field label="Price">
                            <input
                              type="number"
                              min={0}
                              className={inputClass}
                              value={plan.price ?? ""}
                              onChange={(e) =>
                                updateArrayItem("plans", index, {
                                  ...plan,
                                  price:
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                })
                              }
                            />
                          </Field>

                          <Field label="Billing Cycle">
                            <select
                              className={inputClass}
                              value={plan.billingCycle || "Monthly"}
                              onChange={(e) =>
                                updateArrayItem("plans", index, {
                                  ...plan,
                                  billingCycle: e.target.value,
                                })
                              }
                            >
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                              <option value="One Time">One Time</option>
                            </select>
                          </Field>

                          <Field label="Select Plan Features">
  <div className="space-y-2 rounded-xl border border-gray-200 p-3">
    {(product.features || []).filter((feature: any) => feature.name?.trim()).length > 0 ? (
      (product.features || [])
        .filter((feature: any) => feature.name?.trim())
        .map((feature: any, featureIndex: number) => {
          const selected = (plan.features || []).includes(feature.name);

          return (
            <label
              key={featureIndex}
              className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm transition ${
                selected
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={selected}
                onChange={(e) => {
                  const currentFeatures = plan.features || [];

                  updateArrayItem("plans", index, {
                    ...plan,
                    features: e.target.checked
                      ? [...currentFeatures, feature.name]
                      : currentFeatures.filter(
                          (name: string) => name !== feature.name
                        ),
                  });
                }}
              />

              {feature.name}
            </label>
          );
        })
    ) : (
      <p className="py-3 text-center text-xs text-gray-400">
        Please add product features first.
      </p>
    )}
  </div>
</Field>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Product Tags
                      </h4>
                      <p className="text-xs text-gray-500">
                        Add searchable tags for this product.
                      </p>
                    </div>
                   
                  </div>

                <Field label="Tags">
  <div className="flex flex-wrap gap-2">
    {["SaaS", "CRM", "ERP", "Cloud", "Business"].map((tag) => {
      const selected = (product.tags || []).includes(tag);

      return (
        <label
          key={tag}
          className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
            selected
              ? "border-violet-300 bg-violet-100 text-violet-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-violet-300"
          }`}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={selected}
            onChange={(e) => {
              const currentTags = product.tags || [];

              update(
                "tags",
                e.target.checked
                  ? [...currentTags, tag]
                  : currentTags.filter((item: string) => item !== tag)
              );
            }}
          />
          {selected && "✓ "}{tag}
        </label>
      );
    })}
  </div>
</Field>
                </div>
              </div>
            )}

            {/* PUBLISHING AND MEDIA */}
            {activeTab === "publishing" && (
              <div>
                <SectionHeading
                  title="Publishing & Media"
                  description="Manage product visibility, status and media URLs."
                />

                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Toggle label="Show on Website" field="showOnWebsite" />
                  <Toggle label="Allow Free Trial" field="allowTrial" />
                  <Toggle label="Allow Demo" field="allowDemo" />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <SelectInput
                    label="Product Status"
                    field="status"
                    value={product.status}
                    update={update}
                    options={["Active", "Inactive", "Discontinued"]}
                  />
                  <SelectInput
                    label="Publish Status"
                    field="publishStatus"
                    value={product.publishStatus}
                    update={update}
                    options={["Published", "Draft", "Archived"]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TextInput
                    label="Logo URL"
                    field="logoUrl"
                    value={product.logoUrl}
                    update={update}
                    placeholder="https://..."
                  />

                  <TextInput
                    label="Banner URL"
                    field="bannerUrl"
                    value={product.bannerUrl}
                    update={update}
                    placeholder="https://..."
                  />

                  <Field
                    label="Screenshot URLs (one URL per line)"
                    className="md:col-span-2"
                  >
                    <textarea
                      rows={4}
                      className={`${inputClass} resize-none`}
                      value={(product.screenshotUrls || []).join("\n")}
                      placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                      onChange={(e) =>
                        update(
                          "screenshotUrls",
                          e.target.value
                            .split("\n")
                            .map((v: string) => v.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* SEO */}
            {activeTab === "seo" && (
              <div>
                <SectionHeading
                  title="SEO Settings"
                  description="Improve how your product appears in search results."
                />

                <div className="space-y-5">
                  <TextInput
                    label="Meta Title"
                    field="metaTitle"
                    value={product.metaTitle}
                    update={update}
                    placeholder="Enter meta title"
                  />
                  <Field label="Meta Description">
                    <textarea
                      rows={4}
                      className={`${inputClass} resize-none`}
                      value={product.metaDescription || ""}
                      placeholder="Write a short description for search engines..."
                      onChange={(e) =>
                        update("metaDescription", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Keywords">
                    <textarea
                      rows={3}
                      className={`${inputClass} resize-none`}
                      value={product.keywords || ""}
                      placeholder="Enter keywords separated by commas"
                      onChange={(e) => update("keywords", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-white px-5 py-4 sm:px-7">
            <p className="hidden text-xs text-gray-400 sm:block">
              Changes will be saved to your product record.
            </p>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setEditModalOpen(false)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
