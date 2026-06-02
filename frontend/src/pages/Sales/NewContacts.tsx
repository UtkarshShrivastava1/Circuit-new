import { useState } from "react";

/* ─────────────────────────── types ─────────────────────────── */
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
}

interface NewContactProps {
  countries?: string[];
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
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

const EMPTY: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCountry: "+91",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  description: "",
};

/* ─────────────────────────── component ─────────────────────── */
export default function NewContact({
  countries = DEFAULT_COUNTRIES,
  onSubmit,
  onReset,
  isLoading = false,
}: NewContactProps) {
  const [form, setForm] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  /* ── helpers ── */
  const set = <K extends keyof ContactFormData>(field: K, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<Record<keyof ContactFormData, string>> = {};
    if (!form.email.trim())       e.email       = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phoneNumber.trim()) e.phoneNumber  = "Phone Number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit?.(form);
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
    onReset?.();
  };

  /* ── shared styles ── */
  const inputBase =
    "w-full border rounded-md px-3 py-2 text-sm bg-base-100 text-base-content outline-none transition-colors focus:border-success placeholder:text-base-content/30";
  const inp = (field: keyof ContactFormData) =>
    `${inputBase} ${errors[field] ? "border-error" : "border-base-300"}`;

  /* ── sub-components ── */
  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <label className="text-sm text-base-content/80 whitespace-nowrap pt-2.5">
      {text}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
  );

  const Err = ({ field }: { field: keyof ContactFormData }) =>
    errors[field] ? <p className="text-error text-xs mt-1">{errors[field]}</p> : null;

  const SubLabel = ({ text }: { text: string }) => (
    <p className="text-xs text-base-content/40 mt-1">{text}</p>
  );

  /* ── render ── */
  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-6 max-w-3xl">
        <h1 className="text-xl font-semibold text-base-content mb-6">New Contact</h1>

        <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-5">

          {/* Name */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Name" />
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  className={inp("firstName")}
                />
                <SubLabel text="First Name" />
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

          {/* Phone Number */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Phone Number" required />
            <div>
              <div
                className={`flex border rounded-md overflow-hidden focus-within:border-success transition-colors ${
                  errors.phoneNumber ? "border-error" : "border-base-300"
                }`}
              >
                {/* Country code picker */}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {/* Number input */}
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

          {/* Address */}
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label text="Address" />
            <div className="space-y-3">
              {/* Line 1 */}
              <div>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => set("addressLine1", e.target.value)}
                  className={inp("addressLine1")}
                />
                <SubLabel text="Address Line 1" />
              </div>
              {/* Line 2 */}
              <div>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => set("addressLine2", e.target.value)}
                  className={inp("addressLine2")}
                />
                <SubLabel text="Address Line 2" />
              </div>
              {/* City / State */}
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
              {/* Postal / Country */}
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
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                  <SubLabel text="Country" />
                </div>
              </div>
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

import NewContact from "./NewContact";
import { useNavigate } from "react-router-dom";

export default function NewContactPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/sales/contacts", data);
      toast.success("Contact created!");
      navigate("/sales/contacts");
    } catch {
      toast.error("Failed to create contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewContact
      countries={countryList}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}

──────────────────────────────────────────────────────────────── */