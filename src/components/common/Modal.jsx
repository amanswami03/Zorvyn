import { useEffect } from "react";
import { Icon } from "./Icon";

// Reusable modal dialog component
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(8,12,24,0.85)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease"
    }} onClick={onClose}>
      <div style={{
        background: "#111827", border: "1px solid #1C2A42",
        borderRadius: 16, width: "min(500px, 92vw)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)", animation: "fadeUp 0.25s ease"
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #1C2A42"
        }}>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16 }}>{title}</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94A3B8", borderRadius: 6, padding: 4,
            display: "flex", alignItems: "center",
            transition: "color 0.2s"
          }} onMouseEnter={e => e.target.style.color = "#E2E8F4"}
            onMouseLeave={e => e.target.style.color = "#94A3B8"}>
            <Icon name="close" size={18} color="currentColor" />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
