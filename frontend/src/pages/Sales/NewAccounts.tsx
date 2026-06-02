import { useState } from "react";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Other"
];

export default function NewAccountForm() {
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f7f8fa",
        minHeight: "100vh",
        padding: "0",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8eaed",
          padding: "18px 36px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 700,
            color: "#1a1d23",
            letterSpacing: "-0.2px",
          }}
        >
          New Account
        </h1>
      </div>

      {/* Form Body */}
      <div style={{ padding: "32px 36px", maxWidth: "760px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            border: "1px solid #e8eaed",
            padding: "32px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >

          {/* Account Owner */}
          <FormRow label="Account Owner" required>
            <Select placeholder="-Select-" options={["Alice Johnson", "Bob Smith", "Carol White"]} />
          </FormRow>

          {/* Lead */}
          <FormRow label="Lead">
            <Select placeholder="-Select-" options={["Lead A", "Lead B", "Lead C"]} />
          </FormRow>

          {/* Account Name */}
          <FormRow label="Account Name" required>
            <TextInput placeholder="" />
          </FormRow>

          {/* Name */}
          <FormRow label="Name">
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <TextInput placeholder="" />
                <FieldLabel>First Name</FieldLabel>
              </div>
              <div style={{ flex: 1 }}>
                <TextInput placeholder="" />
                <FieldLabel>Last Name</FieldLabel>
              </div>
            </div>
          </FormRow>

          {/* Email */}
          <FormRow label="Email" required>
            <TextInput placeholder="" type="email" />
          </FormRow>

          {/* Gender */}
          <FormRow label="Gender">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
              {(["Male", "Female"] as const).map((opt) => (
                <label
                  key={opt}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                >
                  <div
                    onClick={() => setGender(opt)}
                    style={{
                      width: "17px",
                      height: "17px",
                      borderRadius: "50%",
                      border: gender === opt ? "5px solid #28a745" : "2px solid #bcc0c7",
                      background: "#fff",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "border 0.15s",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#3d4046" }}>{opt}</span>
                </label>
              ))}
            </div>
          </FormRow>

          {/* Phone Number */}
          <FormRow label="Phone Number" required>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  background: "#fff",
                  fontSize: "14px",
                  color: "#3d4046",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🇮🇳 +91 <span style={{ fontSize: "10px", color: "#777" }}>▾</span>
              </div>
              <TextInput placeholder="81234 56789" style={{ flex: 1 }} />
            </div>
          </FormRow>

          {/* Billing Address */}
          <FormRow label="Billing Address" required>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <TextInput placeholder="" />
                <FieldLabel>Address Line 1</FieldLabel>
              </div>
              <div>
                <TextInput placeholder="" />
                <FieldLabel>Address Line 2</FieldLabel>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <TextInput placeholder="" />
                  <FieldLabel>City / District</FieldLabel>
                </div>
                <div style={{ flex: 1 }}>
                  <TextInput placeholder="" />
                  <FieldLabel>State / Province</FieldLabel>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <TextInput placeholder="" />
                  <FieldLabel>Postal Code</FieldLabel>
                </div>
                <div style={{ flex: 1 }}>
                  <Select placeholder="-Select-" options={COUNTRIES} />
                  <FieldLabel>Country</FieldLabel>
                </div>
              </div>
            </div>
          </FormRow>

          {/* Shipping Address */}
          <FormRow label="Shipping Address">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <TextInput placeholder="" />
                <FieldLabel>Address Line 1</FieldLabel>
              </div>
              <div>
                <TextInput placeholder="" />
                <FieldLabel>Address Line 2</FieldLabel>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <TextInput placeholder="" />
                  <FieldLabel>City / District</FieldLabel>
                </div>
                <div style={{ flex: 1 }}>
                  <TextInput placeholder="" />
                  <FieldLabel>State / Province</FieldLabel>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <TextInput placeholder="" />
                  <FieldLabel>Postal Code</FieldLabel>
                </div>
                <div style={{ flex: 1 }}>
                  <Select placeholder="-Select-" options={COUNTRIES} />
                  <FieldLabel>Country</FieldLabel>
                </div>
              </div>
            </div>
          </FormRow>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              paddingTop: "8px",
              borderTop: "1px solid #f0f1f3",
              marginTop: "4px",
            }}
          >
            <button
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "9px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.1px",
              }}
            >
              Save
            </button>
            <button
              style={{
                background: "#fff",
                color: "#555",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                padding: "9px 24px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────── */

function FormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "16px",
        alignItems: "start",
      }}
    >
      <label
        style={{
          fontSize: "14px",
          color: "#4b5057",
          fontWeight: 500,
          paddingTop: "9px",
          lineHeight: 1.4,
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#e53e3e", marginLeft: "2px" }}>*</span>
        )}
      </label>
      <div>{children}</div>
    </div>
  );
}

function TextInput({
  placeholder,
  type = "text",
  style = {},
}: {
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "8px 11px",
        fontSize: "14px",
        color: "#1a1d23",
        background: "#fff",
        outline: "none",
        transition: "border-color 0.15s",
        ...style,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#28a745")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
    />
  );
}

function Select({
  placeholder,
  options,
}: {
  placeholder: string;
  options: string[];
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        defaultValue=""
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          padding: "8px 32px 8px 11px",
          fontSize: "14px",
          color: "#1a1d23",
          background: "#fff",
          appearance: "none",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          fontSize: "11px",
          color: "#777",
        }}
      >
        ▾
      </span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "4px 0 0",
        fontSize: "11.5px",
        color: "#9ca3af",
        letterSpacing: "0.1px",
      }}
    >
      {children}
    </p>
  );
}