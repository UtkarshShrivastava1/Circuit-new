import { useState, useRef } from "react";

/* ─────────────────────────── types ─────────────────────────── */
interface SalesRepFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: "Male" | "Female";
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneCountry: string;
  phoneNumber: string;
  image: File | null;
  team: string;
}

interface AddSalesRepProps {
  teams?: { value: string; label: string }[];
  countries?: string[];
  onSubmit?: (data: SalesRepFormData) => void | Promise<void>;
  onReset?: () => void;
  isLoading?: boolean;
}

/* ─────────────────────────── static data ───────────────────── */
const PHONE_CODES = [
  { code: "+91",  flag: "🇮🇳" },
  { code: "+1",   flag: "🇺🇸" },
  { code: "+44",  flag: "🇬🇧" },
  { code: "+61",  flag: "🇦🇺" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+65",  flag: "🇸🇬" },
  { code: "+49",  flag: "🇩🇪" },
  { code: "+33",  flag: "🇫🇷" },
];

const DEFAULT_COUNTRIES = [
  "India", "United States", "United Kingdom", "Australia",
  "Canada", "Germany", "France", "Singapore", "UAE", "Other",
];

const DEFAULT_TEAMS = [
  { value: "north", label: "North Team" },
  { value: "south", label: "South Team" },
  { value: "east",  label: "East Team"  },
  { value: "west",  label: "West Team"  },
];

const EMPTY: SalesRepFormData = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "Male",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phoneCountry: "+91",
  phoneNumber: "",
  image: null,
  team: "",
};

/* ─────────────────────────── component ─────────────────────── */
export default function AddSalesRep({
  teams = DEFAULT_TEAMS,
  countries = DEFAULT_COUNTRIES,
  onSubmit,
  onReset,
  isLoading = false,
}: AddSalesRepProps) {
  const [form, setForm] = useState<SalesRepFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof SalesRepFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const set = <K extends keyof SalesRepFormData>(
    field: K,
    value: SalesRepFormData[K]
  ) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<Record<keyof SalesRepFormData, string>> = {};
    if (!form.firstName.trim()) e.firstName   = "First Name is required.";
    if (!form.email.trim())     e.email       = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone Number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    set("image", file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit?.(form);
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onReset?.();
  };

  /* ── shared styles ── */
  const inputBase =
    "w-full border rounded-md px-3 py-2 text-sm bg-base-100 text-base-content outline-none transition-colors focus:border-success placeholder:text-base-content/30";
  const inp = (field: keyof SalesRepFormData) =>
    `${inputBase} ${errors[field] ? "border-error" : "border-base-300"}`;

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <label className="text-sm text-base-content/80 whitespace-nowrap pt-2.5">
      {text}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
  );

  const Err = ({ field }: { field: keyof SalesRepFormData }) =>
    errors[field] ? (
      <p className="text-error text-xs mt-1">{errors[field]}</p>
    ) : null;

  const SubLabel = ({ text }: { text: string }) => (
    <p className="text-xs text-base-content/40 mt-1">{text}</p>
  );

  const Chevron = () => (
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );

  /* ── render ── */
  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-6 max-w-3xl">
        <h1 className="text-xl font-semibold text-base-content mb-6">
          Add Sales Rep
        </h1>

        <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-5">

          {/* Name */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Name" required />
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={inp("firstName")}
                />
                <SubLabel text="First Name" />
                <Err field="firstName" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={inp("lastName")}
                />
                <SubLabel text="Last Name" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Email" required />
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inp("email")}
              />
              <Err field="email" />
            </div>
          </div>

          {/* Gender */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Gender" />
            <div className="flex flex-col gap-2 pt-1">
              {(["Male", "Female"] as const).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={() => set("gender", g)}
                    className="radio radio-success radio-sm"
                  />
                  <span className="text-sm text-base-content">{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Address" />
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => set("addressLine1", e.target.value)}
                  className={inp("addressLine1")}
                />
                <SubLabel text="Address Line 1" />
              </div>
              <div>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => set("addressLine2", e.target.value)}
                  className={inp("addressLine2")}
                />
                <SubLabel text="Address Line 2" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className={inp("city")}
                  />
                  <SubLabel text="City / District" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    className={inp("state")}
                  />
                  <SubLabel text="State / Province" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                    className={inp("postalCode")}
                  />
                  <SubLabel text="Postal Code" />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <select
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      className={`${inp("country")} appearance-none pr-8 cursor-pointer`}
                    >
                      <option value="">-Select-</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <Chevron />
                  </div>
                  <SubLabel text="Country" />
                </div>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Phone Number" required />
            <div>
              <div
                className={`flex border rounded-md overflow-hidden focus-within:border-success transition-colors ${
                  errors.phoneNumber ? "border-error" : "border-base-300"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <select
                    value={form.phoneCountry}
                    onChange={(e) => set("phoneCountry", e.target.value)}
                    className="appearance-none bg-base-200 text-sm pl-2 pr-7 py-2 outline-none cursor-pointer h-full text-base-content border-r border-base-300"
                  >
                    {PHONE_CODES.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.flag} {p.code}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-base-content/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => set("phoneNumber", e.target.value)}
                  placeholder="81234 56789"
                  className="flex-1 px-3 py-2 text-sm bg-base-100 text-base-content outline-none placeholder:text-base-content/30"
                />
              </div>
              <Err field="phoneNumber" />
            </div>
          </div>

          {/* Image */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Image" />
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-between border border-base-300 rounded-md px-3 py-2 cursor-pointer hover:border-success transition-colors bg-base-100"
              >
                <span className="text-sm text-base-content/50">
                  {form.image ? form.image.name : "Select Image"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-base-content/40 flex-shrink-0">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border border-base-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Team */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Team" />
            <div className="relative">
              <select
                value={form.team}
                onChange={(e) => set("team", e.target.value)}
                className={`${inp("team")} appearance-none pr-8 cursor-pointer`}
              >
                <option value="">-Select-</option>
                {teams.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <Chevron />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn btn-success text-white normal-case px-6 text-sm min-h-0 h-9"
            >
              {isLoading
                ? <span className="loading loading-spinner loading-xs" />
                : "Submit"}
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

import AddSalesRep from "./AddSalesRep";
import { useNavigate } from "react-router-dom";

export default function AddSalesRepPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value as string | Blob);
      });
      await api.post("/sales/representatives", formData);
      toast.success("Sales rep added!");
      navigate("/sales/representatives");
    } catch {
      toast.error("Failed to add sales rep.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddSalesRep
      teams={[{ value: "north", label: "North Team" }]}
      countries={countryList}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}

──────────────────────────────────────────────────────────────── */