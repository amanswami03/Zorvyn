import { Icon } from "../common/Icon";

// Top header bar with page title and controls
export function Header({ page, role, setRole }) {
  const labels = { dashboard: "Dashboard", transactions: "Transactions", insights: "Insights" };
  return (
    <div style={{
      height: 64, borderBottom: "1px solid #1C2A42",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", flexShrink: 0, gap: 12
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18 }}>{labels[page]}</div>
        <div style={{ color: "#4A5A75", fontSize: 11 }}>Jan – Jun 2024  ·  Financial Overview</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* User role selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#111827", border: "1px solid #1C2A42", borderRadius: 10, padding: "6px 12px" }}>
          <Icon name={role === "admin" ? "shield" : "user"} size={14} color={role === "admin" ? "#F0A500" : "#818CF8"} />
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Role:</span>
          <select value={role} onChange={e => setRole(e.target.value)} style={{
            background: "transparent", border: "none", color: role === "admin" ? "#F0A500" : "#818CF8",
            fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, cursor: "pointer", outline: "none"
          }}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        {/* Display current access level */}
        <div style={{
          padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700,
          background: role === "admin" ? "#F0A50018" : "#818CF818",
          color: role === "admin" ? "#F0A500" : "#818CF8",
          border: `1px solid ${role === "admin" ? "#F0A50030" : "#818CF830"}`,
          letterSpacing: "0.05em", textTransform: "uppercase"
        }}>
          {role === "admin" ? "Full Access" : "Read Only"}
        </div>
        {/* Bell icon with notification badge */}
        <button style={{
          width: 38, height: 38, borderRadius: 9, background: "#111827",
          border: "1px solid #1C2A42", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#6B7A99", position: "relative",
          transition: "all 0.15s"
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#F0A50040"; e.currentTarget.style.color = "#F0A500"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C2A42"; e.currentTarget.style.color = "#6B7A99"; }}>
          <Icon name="bell" size={16} color="currentColor" />
          <div style={{ position: "absolute", top: 8, right: 9, width: 6, height: 6, borderRadius: "50%", background: "#F43F5E" }} />
        </button>
        {/* User avatar badge */}
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: "linear-gradient(135deg, #1C2A42, #243047)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid #243047", cursor: "pointer",
          fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13, color: "#94A3B8"
        }}>
          {role === "admin" ? "AD" : "VW"}
        </div>
      </div>
    </div>
  );
}
