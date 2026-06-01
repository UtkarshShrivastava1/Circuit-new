import { useState } from "react";

interface SalesItem {
  id: number;
  product: string;
  retailPrice: string;
  sellingPrice: string;
  quantity: string;
  total: string;
}

export default function NewOrderForm() {
  const [salesOwner] = useState("V VINAY Kumar");
  const [orderDate] = useState("30-May-2026");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [accountName, setAccountName] = useState("");
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [items, setItems] = useState<SalesItem[]>([]);
  const [nextId, setNextId] = useState(1);

  const addItem = () => {
    setItems([...items, { id: nextId, product: "", retailPrice: "", sellingPrice: "", quantity: "", total: "" }]);
    setNextId(nextId + 1);
  };

  const removeItem = (id: number) => setItems(items.filter((item) => item.id !== id));

  const updateItem = (id: number, field: keyof SalesItem, value: string) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "sellingPrice" || field === "quantity") {
        const sp = parseFloat(updated.sellingPrice) || 0;
        const qty = parseFloat(updated.quantity) || 0;
        updated.total = (sp * qty).toFixed(2);
      }
      return updated;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  const discountAmt = parseFloat(discount) || 0;
  const taxAmt = parseFloat(tax) || 0;
  const grandTotal = subtotal - discountAmt + taxAmt;

  const handleReset = () => {
    setDeliveryDate("");
    setAccountName("");
    setDiscount("");
    setTax("");
    setItems([]);
    setNextId(1);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 14, background: "#f5f6fa", minHeight: "100vh", padding: "24px 28px" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 600, color: "#1a1a2e" }}>New Order</h2>

      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e4e8f0", padding: "28px 32px" }}>
        {/* Fields */}
        <div style={{ display: "grid", gap: 18, maxWidth: 560 }}>
          <FormRow label="Sales Owner" required>
            <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", cursor: "default" }}>
              <span>{salesOwner}</span>
              <div style={{ display: "flex", gap: 6, color: "#888" }}>
                <span style={{ cursor: "pointer" }}>✕</span>
                <span style={{ cursor: "pointer" }}>⌄</span>
              </div>
            </div>
          </FormRow>

          <FormRow label="Order Date">
            <input style={{ ...inputStyle, background: "#f7f9fc", color: "#555" }} value={orderDate} readOnly />
          </FormRow>

          <FormRow label="Delivery Date" required>
            <input
              type="text"
              placeholder="dd-MMM-yyyy"
              style={inputStyle}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </FormRow>

          <FormRow label="Account Name" required>
            <div style={{ position: "relative" }}>
              <select
                style={{ ...inputStyle, appearance: "none", paddingRight: 32, color: accountName ? "#333" : "#aaa" }}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              >
                <option value="">-Select-</option>
                <option value="account1">Account 1</option>
                <option value="account2">Account 2</option>
              </select>
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888" }}>⌄</span>
            </div>
          </FormRow>
        </div>

        {/* Sales Item */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e", marginBottom: 12 }}>
            Sales Item <span style={{ color: "#e53935" }}>*</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 40 }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f4f6fb" }}>
                <th style={thStyle}></th>
                <th style={thStyle}>Sl. No.</th>
                <th style={thStyle}>Product <span style={{ color: "#e53935" }}>*</span></th>
                <th style={thStyle}>Retail Price</th>
                <th style={thStyle}>Selling Price <span style={{ color: "#e53935" }}>*</span></th>
                <th style={thStyle}>Quantity <span style={{ color: "#e53935" }}>*</span></th>
                <th style={thStyle}>Total <span style={{ color: "#e53935" }}>*</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td style={tdStyle}>
                    <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 14 }}>✕</button>
                  </td>
                  <td style={tdStyle}>
                    <input style={cellInput} value={idx + 1} readOnly />
                  </td>
                  <td style={tdStyle}>
                    <select
                      style={{ ...cellInput, color: item.product ? "#333" : "#aaa" }}
                      value={item.product}
                      onChange={(e) => updateItem(item.id, "product", e.target.value)}
                    >
                      <option value="">-Select-</option>
                      <option value="prod1">Product 1</option>
                      <option value="prod2">Product 2</option>
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <input style={{ ...cellInput, background: "#f7f9fc" }} value={item.retailPrice} placeholder="#######.##" readOnly />
                  </td>
                  <td style={tdStyle}>
                    <input style={cellInput} value={item.sellingPrice} placeholder="#######.##" onChange={(e) => updateItem(item.id, "sellingPrice", e.target.value)} />
                  </td>
                  <td style={tdStyle}>
                    <input style={cellInput} value={item.quantity} placeholder="#######" onChange={(e) => updateItem(item.id, "quantity", e.target.value)} />
                  </td>
                  <td style={tdStyle}>
                    <input style={{ ...cellInput, background: "#f7f9fc" }} value={item.total} placeholder="#######.##" readOnly />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button onClick={addItem} style={{ background: "none", border: "none", color: "#2e7d32", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
              + Add New
            </button>
          </div>
        </div>

        {/* Totals */}
        <div style={{ marginTop: 28, display: "grid", gap: 14, maxWidth: 400 }}>
          <FormRow label="Sub total" required>
            <input style={{ ...inputStyle, background: "#f7f9fc", color: "#555" }} value={subtotal ? subtotal.toFixed(2) : "#######.##"} readOnly />
          </FormRow>
          <FormRow label="Discount">
            <input style={inputStyle} value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </FormRow>
          <FormRow label="Tax">
            <input style={inputStyle} value={tax} onChange={(e) => setTax(e.target.value)} />
          </FormRow>
          <FormRow label="Grand Total">
            <input style={{ ...inputStyle, background: "#f7f9fc", color: "#555" }} value={grandTotal.toFixed(2)} readOnly />
          </FormRow>
        </div>

        {/* Actions */}
        <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
          <button style={{ background: "#2e7d32", color: "#fff", border: "none", borderRadius: 4, padding: "9px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            Submit
          </button>
          <button onClick={handleReset} style={{ background: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: 4, padding: "9px 20px", fontSize: 14, cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", gap: 12 }}>
      <label style={{ fontSize: 13.5, color: "#444", textAlign: "right" }}>
        {label} {required && <span style={{ color: "#e53935" }}>*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d0d6e0",
  borderRadius: 4,
  padding: "7px 10px",
  fontSize: 13.5,
  color: "#333",
  outline: "none",
  background: "#fff",
};

const thStyle: React.CSSProperties = {
  padding: "9px 10px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: 13,
  color: "#444",
  borderBottom: "1px solid #e4e8f0",
};

const tdStyle: React.CSSProperties = {
  padding: "6px 4px",
  borderBottom: "1px solid #f0f2f7",
  verticalAlign: "middle",
};

const cellInput: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d0d6e0",
  borderRadius: 3,
  padding: "5px 7px",
  fontSize: 13,
  color: "#333",
  outline: "none",
  background: "#fff",
};