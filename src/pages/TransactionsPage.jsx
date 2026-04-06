import { useState, useMemo, useCallback } from "react";
import { CATEGORIES, CAT_COLORS, ITEMS_PER_PAGE } from "../utils/constants";
import { fmt, fmtShort } from "../utils/helpers";
import { Icon } from "../components/common/Icon";
import { Modal } from "../components/common/Modal";
import { TxnForm } from "../components/features/TxnForm";

// Transactions table with search, sort, and filter
export function TransactionsPage({ transactions, role, onAdd, onEdit, onDelete }) {
  const [search, setSearch]      = useState("");
  const [typeFilter, setTypeFilter]    = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey,  setSortKey]   = useState("date");
  const [sortDir,  setSortDir]   = useState("desc");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTxn, setEditingTxn]   = useState(null);
  const [currentPage, setCurrentPage]  = useState(1);

  const filtered = useMemo(() => {
    let list = [...transactions];
    // Search by description and category
    if (search) {
      list = list.filter(t => 
        t.desc.toLowerCase().includes(search.toLowerCase()) || 
        t.cat.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Apply type and category filters
    if (typeFilter !== "all") list = list.filter(t => t.type === typeFilter);
    if (categoryFilter !== "all") list = list.filter(t => t.cat === categoryFilter);
    // Sort the results
    list.sort((a, b) => {
      let valA = a[sortKey], valB = b[sortKey];
      if (sortKey === "date") { 
        valA = new Date(valA); 
        valB = new Date(valB); 
      }
      return sortDir === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    return list;
  }, [transactions, search, typeFilter, categoryFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Toggle sort order when column header is clicked
  const toggleSort = (key) => { 
    if (sortKey === key) { 
      setSortDir(d => d === "asc" ? "desc" : "asc"); 
    } else { 
      setSortKey(key); 
      setSortDir("desc"); 
    } 
  };

  const colH = { color: "#6B7A99", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: 4 };

  // Export CSV
  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"], ...filtered.map(t => [t.date, t.desc, t.cat, t.type, t.amt])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="fade-in">
      {/* Search and filter toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <Icon name="search" size={15} color="#4A5A75" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search transactions..." style={{
              width: "100%", background: "#111827", border: "1px solid #1C2A42",
              borderRadius: 9, padding: "9px 12px 9px 36px", color: "#E2E8F4",
              fontFamily: "var(--font-body)", fontSize: 13, outline: "none"
            }}
            onFocus={e => e.target.style.borderColor = "#F0A500"}
            onBlur={e => e.target.style.borderColor = "#1C2A42"} />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={{
          background: "#111827", border: "1px solid #1C2A42", borderRadius: 9,
          padding: "9px 14px", color: "#94A3B8", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", cursor: "pointer"
        }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} style={{
          background: "#111827", border: "1px solid #1C2A42", borderRadius: 9,
          padding: "9px 14px", color: "#94A3B8", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", cursor: "pointer"
        }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={exportCSV} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
          background: "#111827", border: "1px solid #1C2A42", borderRadius: 9,
          color: "#94A3B8", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13,
          transition: "all 0.2s"
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2DD4BF"; e.currentTarget.style.color = "#2DD4BF"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C2A42"; e.currentTarget.style.color = "#94A3B8"; }}>
          <Icon name="export" size={14} color="currentColor" /> Export
        </button>
        {role === "admin" && (
          <button onClick={() => setAddModalOpen(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            background: "linear-gradient(135deg, #F0A500 0%, #C8861A 100%)",
            border: "none", borderRadius: 9, color: "#080C18",
            cursor: "pointer", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13,
            transition: "opacity 0.2s"
          }}>
            <Icon name="plus" size={14} color="#080C18" /> Add Transaction
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#111827", border: "1px solid #1C2A42", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1C2A42" }}>
                {[["date","Date"],["desc","Description"],["cat","Category"],["type","Type"],["amt","Amount"]].map(([k,l]) => (
                  <th key={k} onClick={() => toggleSort(k)} style={{ ...colH, padding: "13px 16px", textAlign: k === "amt" ? "right" : "left" }}>
                    {l} {sortKey === k && <span style={{ color: "#F0A500" }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
                {role === "admin" && <th style={{ ...colH, padding: "13px 16px" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={role === "admin" ? 6 : 5} style={{ textAlign: "center", padding: 40, color: "#4A5A75" }}>
                  <Icon name="search" size={28} color="#4A5A75" style={{ display: "block", margin: "0 auto 12px" }} />
                  No transactions found
                </td></tr>
              ) : visible.map((t, i) => (
                <tr key={t.id} style={{
                  borderBottom: "1px solid #1C2A4255",
                  transition: "background 0.15s",
                  cursor: "default"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#141D2E"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", color: "#6B7A99", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {t.date}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{t.desc}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
                      background: `${CAT_COLORS[t.cat] || "#4A5A75"}18`,
                      color: CAT_COLORS[t.cat] || "#6B7A99",
                      padding: "3px 9px", borderRadius: 6,
                      border: `1px solid ${CAT_COLORS[t.cat] || "#4A5A75"}30`
                    }}>
                      {t.cat}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                      color: t.type === "income" ? "#22C55E" : "#F43F5E",
                      background: t.type === "income" ? "#22C55E18" : "#F43F5E18",
                      padding: "3px 9px", borderRadius: 5, textTransform: "uppercase"
                    }}>{t.type}</span>
                  </td>
                  <td style={{
                    padding: "12px 16px", textAlign: "right",
                    fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600,
                    color: t.type === "income" ? "#22C55E" : "#F43F5E"
                  }}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amt)}
                  </td>
                  {role === "admin" && (
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditingTxn(t)} style={{
                          width: 30, height: 30, borderRadius: 7, border: "1px solid #1C2A42",
                          background: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s"
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#818CF8"; e.currentTarget.style.color = "#818CF8"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C2A42"; e.currentTarget.style.color = "#94A3B8"; }}>
                          <Icon name="edit" size={13} color="currentColor" />
                        </button>
                        <button onClick={() => onDelete(t.id)} style={{
                          width: 30, height: 30, borderRadius: 7, border: "1px solid #1C2A42",
                          background: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s"
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#F43F5E"; e.currentTarget.style.color = "#F43F5E"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C2A42"; e.currentTarget.style.color = "#94A3B8"; }}>
                          <Icon name="trash" size={13} color="currentColor" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #1C2A42" }}>
            <span style={{ color: "#4A5A75", fontSize: 12, fontFamily: "var(--font-mono)" }}>
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{
                  width: 30, height: 30, borderRadius: 7, border: "1px solid",
                  borderColor: p === currentPage ? "#F0A500" : "#1C2A42",
                  background: p === currentPage ? "#F0A50015" : "none",
                  color: p === currentPage ? "#F0A500" : "#6B7A99",
                  cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12,
                  transition: "all 0.15s"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction modals */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Transaction">
        <TxnForm onSave={t => { onAdd(t); setAddModalOpen(false); }} onClose={() => setAddModalOpen(false)} />
      </Modal>
      <Modal open={!!editingTxn} onClose={() => setEditingTxn(null)} title="Edit Transaction">
        <TxnForm initial={editingTxn} onSave={t => { onEdit(t); setEditingTxn(null); }} onClose={() => setEditingTxn(null)} />
      </Modal>
    </div>
  );
}
