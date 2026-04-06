import { useState } from "react";
import { CATEGORIES } from "../../utils/constants";
import { generateUniqueId } from "../../utils/helpers";

// Form for adding/editing transactions
export function TxnForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    date: new Date().toISOString().split("T")[0],
    desc: "", cat: "Food & Dining", amt: "", type: "expense"
  });
  
  // Helper to update form fields
  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  
  const fieldStyle = {
    width: "100%", background: "#0D1225", border: "1px solid #1C2A42",
    borderRadius: 8, padding: "10px 14px", color: "#E2E8F4",
    fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
    transition: "border-color 0.2s"
  };
  const labelStyle = { display: "block", color: "#94A3B8", fontSize: 12, marginBottom: 6, fontWeight: 500 };
  const rowStyle = { marginBottom: 16 };

  return (
    <div>
      <div style={rowStyle}>
        <label style={labelStyle}>Description</label>
        <input value={form.desc} onChange={e => updateField("desc", e.target.value)}
          placeholder="Enter description" style={fieldStyle}
          onFocus={e => e.target.style.borderColor = "#F0A500"}
          onBlur={e => e.target.style.borderColor = "#1C2A42"} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, ...rowStyle }}>
        <div>
          <label style={labelStyle}>Amount (₹)</label>
          <input type="number" value={form.amt} onChange={e => updateField("amt", e.target.value)}
            placeholder="0" style={fieldStyle}
            onFocus={e => e.target.style.borderColor = "#F0A500"}
            onBlur={e => e.target.style.borderColor = "#1C2A42"} />
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" value={form.date} onChange={e => updateField("date", e.target.value)}
            style={{ ...fieldStyle, colorScheme: "dark" }}
            onFocus={e => e.target.style.borderColor = "#F0A500"}
            onBlur={e => e.target.style.borderColor = "#1C2A42"} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, ...rowStyle }}>
        <div>
          <label style={labelStyle}>Type</label>
          <select value={form.type} onChange={e => updateField("type", e.target.value)}
            style={{ ...fieldStyle, cursor: "pointer" }}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={form.cat} onChange={e => updateField("cat", e.target.value)}
            style={{ ...fieldStyle, cursor: "pointer" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={{
          padding: "9px 20px", borderRadius: 8, border: "1px solid #1C2A42",
          background: "none", color: "#94A3B8", cursor: "pointer", fontFamily: "var(--font-body)",
          fontSize: 13, fontWeight: 500, transition: "all 0.2s"
        }}>Cancel</button>
        <button onClick={() => { if (form.desc && form.amt) onSave({ ...form, amt: parseFloat(form.amt), id: form.id || generateUniqueId() }); }}
          style={{
            padding: "9px 20px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #F0A500 0%, #C8861A 100%)",
            color: "#080C18", cursor: "pointer", fontFamily: "var(--font-head)",
            fontSize: 13, fontWeight: 700, transition: "opacity 0.2s"
          }}>Save Transaction</button>
      </div>
    </div>
  );
}
