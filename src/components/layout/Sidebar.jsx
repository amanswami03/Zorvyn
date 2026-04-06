import { Icon } from "../common/Icon";

// Left sidebar navigation
export function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const items = [
    { id: "dashboard",     label: "Dashboard",     icon: "dashboard"     },
    { id: "transactions",  label: "Transactions",  icon: "transactions"  },
    { id: "insights",      label: "Insights",      icon: "insights"      },
  ];

  return (
    <div style={{
      width: collapsed ? 64 : 220, flexShrink: 0,
      background: "#0D1225", borderRight: "1px solid #1C2A42",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
      overflow: "hidden"
    }}>
      {/* App logo & branding */}
      <div style={{
        height: 64, display: "flex", alignItems: "center",
        padding: collapsed ? "0 0 0 18px" : "0 20px",
        borderBottom: "1px solid #1C2A42", gap: 10, flexShrink: 0
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: "linear-gradient(135deg, #F0A500, #C8861A)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon name="wallet" size={16} color="#080C18" />
        </div>
        {!collapsed && (
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
            zor<span style={{ color: "#F0A500" }}>vyn</span>
          </div>
        )}
      </div>

      {/* Navigation menu items */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              display: "flex", alignItems: "center",
              gap: 11, padding: collapsed ? "10px 0" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 9, border: "none", cursor: "pointer",
              background: isActive ? "#F0A50015" : "transparent",
              color: isActive ? "#F0A500" : "#6B7A99",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: isActive ? 600 : 500,
              transition: "all 0.15s", whiteSpace: "nowrap",
              boxShadow: isActive ? "inset 0 0 0 1px #F0A50030" : "none"
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#FFFFFF08"; e.currentTarget.style.color = isActive ? "#F0A500" : "#94A3B8"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isActive ? "#F0A500" : "#6B7A99"; }}>
              {isActive && !collapsed && <div style={{ position: "absolute", left: 10, width: 3, height: 20, borderRadius: 2, background: "#F0A500" }} />}
              <Icon name={item.icon} size={17} color="currentColor" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Toggle sidebar collapse state */}
      <button onClick={() => setCollapsed(c => !c)} style={{
        margin: "12px 10px", padding: "10px", borderRadius: 9,
        background: "none", border: "1px solid #1C2A42", cursor: "pointer",
        color: "#4A5A75", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s"
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#F0A50040"; e.currentTarget.style.color = "#F0A500"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C2A42"; e.currentTarget.style.color = "#4A5A75"; }}>
        <Icon name="chevron_down" size={14} color="currentColor"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.25s" }} />
      </button>
    </div>
  );
}
