import { useState } from "react";

/* ─────────────────────────── types ─────────────────────────── */
interface ProductFormData {
  productGroup: string;
  productName: string;
  productCode: string;
  unitPrice: string;
  description: string;
}

interface NewProductProps {
  /** List of product groups for the dropdown */
  productGroups?: string[];
  /** Called with form data on submit */
  onSubmit?: (data: ProductFormData) => void | Promise<void>;
  /** Called on reset */
  onReset?: () => void;
  /** Loading state (e.g. while API call is in progress) */
  isLoading?: boolean;
}

const defaultGroups = [
  "Electronics",
  "Software",
  "Hardware",
  "Services",
  "Accessories",
];

const emptyForm: ProductFormData = {
  productGroup: "",
  productName: "",
  productCode: "",
  unitPrice: "",
  description: "",
};

/* ─────────────────────────── component ─────────────────────── */
export default function NewProduct({
  productGroups = defaultGroups,
  onSubmit,
  onReset,
  isLoading = false,
}: NewProductProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  /* ── helpers ── */
  const set = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const next: Partial<ProductFormData> = {};
    if (!form.productGroup) next.productGroup = "Product Group is required.";
    if (!form.productName.trim()) next.productName = "Product Name is required.";
    if (!form.productCode.trim()) next.productCode = "Product Code is required.";
    if (!form.unitPrice.trim()) {
      next.unitPrice = "Unit Price is required.";
    } else if (isNaN(Number(form.unitPrice)) || Number(form.unitPrice) < 0) {
      next.unitPrice = "Enter a valid price.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit?.(form);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setErrors({});
    onReset?.();
  };

  /* ── field styles ── */
  const inputClass = (field: keyof ProductFormData) =>
    `w-full border rounded-md px-3 py-2 text-sm bg-base-100 text-base-content outline-none transition-colors focus:border-success ${
      errors[field] ? "border-error" : "border-base-300"
    }`;

  /* ── label ── */
  const Label = ({
    text,
    required,
  }: {
    text: string;
    required?: boolean;
  }) => (
    <label className="text-sm text-base-content/80 whitespace-nowrap pt-2">
      {text}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
  );

  /* ── render ── */
  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-6 max-w-3xl">
        {/* Page heading */}
        <h1 className="text-xl font-semibold text-base-content mb-6">
          New Product
        </h1>

        {/* Form card */}
        <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-5">

          {/* Product Group */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Product Group" required />
            <div>
              <div className="relative">
                <select
                  value={form.productGroup}
                  onChange={(e) => set("productGroup", e.target.value)}
                  className={`${inputClass("productGroup")} appearance-none pr-8 cursor-pointer`}
                >
                  <option value="">-Select-</option>
                  {productGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {/* chevron */}
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {errors.productGroup && (
                <p className="text-error text-xs mt-1">{errors.productGroup}</p>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Product Name" required />
            <div>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
                className={inputClass("productName")}
                placeholder=""
              />
              {errors.productName && (
                <p className="text-error text-xs mt-1">{errors.productName}</p>
              )}
            </div>
          </div>

          {/* Product Code */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Product Code" required />
            <div>
              <input
                type="text"
                value={form.productCode}
                onChange={(e) => set("productCode", e.target.value)}
                className={inputClass("productCode")}
                placeholder=""
              />
              {errors.productCode && (
                <p className="text-error text-xs mt-1">{errors.productCode}</p>
              )}
            </div>
          </div>

          {/* Unit Price */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Unit Price" required />
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => set("unitPrice", e.target.value)}
                className={inputClass("unitPrice")}
                placeholder="#######.##"
              />
              {errors.unitPrice && (
                <p className="text-error text-xs mt-1">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Description" />
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={5}
              className="w-full border border-base-300 rounded-md px-3 py-2 text-sm bg-base-100 text-base-content outline-none resize-none transition-colors focus:border-success"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-base-300 pt-4 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn btn-success text-white normal-case px-6 text-sm min-h-0 h-9"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Submit"
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="btn btn-outline normal-case px-6 text-sm min-h-0 h-9"
            >
              Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── usage example ─────────────────────

import NewProduct from "./NewProduct";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function NewProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/sales/products", data);
      toast.success("Product created!");
      navigate("/sales/products");
    } catch (err) {
      toast.error("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewProduct
      productGroups={["Electronics", "Software", "Hardware"]}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}

──────────────────────────────────────────────────────────────── */