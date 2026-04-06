import { Icon } from "../common/Icon";
import { fmtShort } from "../../utils/helpers";

// Summary stat card with change indicator
export function SummaryCard({ label, value, change, icon, accent, delay = 0, animClass }) {
  const isPos = change >= 0;
  return (
    <div className={animClass} style={{
      background: "linear-gradient(145deg, #111827 0%, #141D2E 100%)",
      border: "1px solid #1C2A42", borderRadius: 14,
      padding: "20px 22px", position: "relative", overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${accent}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 90, height: 90,
        borderRadius: "50%", background: `${accent}12`,
        filter: "blur(10px)"
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#6B7A99", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            {label}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "#E2E8F4", letterSpacing: "-0.02em" }}>
            {fmtShort(value)}
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${accent}30`
        }}>
          <Icon name={icon} size={18} color={accent} />
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontFamily: "var(--font-mono)",
          color: isPos ? "#22C55E" : "#F43F5E",
          background: isPos ? "#22C55E18" : "#F43F5E18",
          padding: "2px 7px", borderRadius: 5
        }}>
          <Icon name={isPos ? "arrow_up" : "arrow_down"} size={11} color="currentColor" />
          {Math.abs(change).toFixed(1)}%
        </div>
        <span style={{ color: "#4A5A75", fontSize: 11 }}>vs last month</span>
      </div>
    </div>
  );
}
