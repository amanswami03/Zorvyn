import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { InsightsPage } from "./pages/InsightsPage";
import { RAW_TXN } from "./data/mockData";
import { STYLE } from "./styles/theme";

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("zorvyn_txns");
      return saved ? JSON.parse(saved) : RAW_TXN;
    } catch { return RAW_TXN; }
  });
  const [role, setRole] = useState("admin");
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("zorvyn_txns", JSON.stringify(transactions)); } catch {}
  }, [transactions]);

  const addTxn = useCallback(t => setTransactions(ts => [t, ...ts]), []);
  const editTxn = useCallback(t => setTransactions(ts => ts.map(x => x.id === t.id ? t : x)), []);
  const deleteTxn = useCallback(id => setTransactions(ts => ts.filter(x => x.id !== id)), []);

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <Header page={page} role={role} setRole={setRole} />
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {page === "dashboard" && <DashboardPage transactions={transactions} />}
            {page === "transactions" && <TransactionsPage transactions={transactions} role={role} onAdd={addTxn} onEdit={editTxn} onDelete={deleteTxn} />}
            {page === "insights" && <InsightsPage transactions={transactions} />}
          </div>
        </div>
      </div>
    </>
  );
}
