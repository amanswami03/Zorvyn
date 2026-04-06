import { fmtShort } from "../../utils/helpers";

// Tooltip component for recharts
export const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0F172A", border: "1px solid #243047",
      borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-mono)",
      fontSize: 12, minWidth: 120
    }}>
      <div style={{ color: "#94A3B8", marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#F0A500", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span style={{ color: "#94A3B8" }}>{p.name}</span>
          <span>{fmtShort(p.value)}</span>
        </div>
      ))}
    </div>
  );
};
