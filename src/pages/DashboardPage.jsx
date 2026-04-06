import { useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { SummaryCard } from "../components/features/SummaryCard";
import { ChartTip } from "../components/common/ChartTip";
import { Icon } from "../components/common/Icon";
import { fmtShort } from "../utils/helpers";
import { MONTHS, CAT_COLORS } from "../utils/constants";

// Main dashboard view showing overview charts
export function DashboardPage({ transactions }) {
  // Calculate monthly income/expense totals
  const monthly = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const m = MONTHS[new Date(t.date).getMonth()];
      if (!map[m]) map[m] = { month: m, income: 0, expense: 0 };
      if (t.type === "income") map[m].income += t.amt;
      else map[m].expense += t.amt;
    });
    return ["Jan","Feb","Mar","Apr","May","Jun"].map(m => ({
      ...map[m], month: m,
      balance: (map[m]?.income || 0) - (map[m]?.expense || 0)
    }));
  }, [transactions]);

  // Build cumulative balance trend from monthly data
  let running = 240000;
  const balanceTrend = monthly.map(m => {
    running += m.balance;
    return { month: m.month, balance: running };
  });

  // Group expenses by category for breakdown chart
  const catMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catMap[t.cat] = (catMap[t.cat] || 0) + t.amt;
  });
  const catData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => ({ cat, val }));

  // Calculate totals across all transactions
  const totalIncome  = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amt, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amt, 0);
  const balance      = totalIncome - totalExpense;

  // Get last 5 transactions sorted by date
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "4px 0" }}>
      {/* Summary Cards showing key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <SummaryCard label="Total Balance"  value={balance}       change={5.2}   icon="wallet"    accent="#F0A500" animClass="fade-up-1" />
        <SummaryCard label="Total Income"   value={totalIncome}   change={8.1}   icon="trend_up"  accent="#22C55E" animClass="fade-up-2" />
        <SummaryCard label="Total Expenses" value={totalExpense}  change={-3.4}  icon="activity"  accent="#F43F5E" animClass="fade-up-3" />
        <SummaryCard label="Investments"    value={60000}         change={12.0}  icon="shield"    accent="#818CF8" animClass="fade-up-4" />
      </div>

      {/* Display balance trend and spending breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 14 }} className="fade-up-5">
        {/* Balance Trend */}
        <div style={{
          background: "#111827", border: "1px solid #1C2A42",
          borderRadius: 14, padding: "20px 22px"
        }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Balance Trend</div>
            <div style={{ color: "#4A5A75", fontSize: 12 }}>Cumulative net worth over time</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={balanceTrend} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F0A500" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F0A500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C2A42" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#3A4A62" tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <YAxis stroke="#3A4A62" tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "var(--font-mono)" }} tickFormatter={fmtShort} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="balance" name="Balance" stroke="#F0A500" strokeWidth={2} fill="url(#balGrad)" dot={{ fill: "#F0A500", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div style={{
          background: "#111827", border: "1px solid #1C2A42",
          borderRadius: 14, padding: "20px 22px"
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Spending Breakdown</div>
            <div style={{ color: "#4A5A75", fontSize: 12 }}>By category</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={catData} dataKey="val" cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="none">
                  {catData.map((e, i) => <Cell key={i} fill={CAT_COLORS[e.cat] || "#4A5A75"} />)}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: "#0F172A", border: "1px solid #243047", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                      <div style={{ color: "#94A3B8" }}>{d.cat}</div>
                      <div style={{ color: CAT_COLORS[d.cat] || "#F0A500" }}>{fmtShort(d.val)}</div>
                    </div>
                  );
                }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7, overflowY: "auto", maxHeight: 160 }}>
              {catData.slice(0, 6).map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: CAT_COLORS[d.cat] || "#4A5A75", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#94A3B8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.cat}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#E2E8F4" }}>{fmtShort(d.val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly comparison and recent transactions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr", gap: 14 }} className="fade-up-6">
        <div style={{ background: "#111827", border: "1px solid #1C2A42", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Monthly Comparison</div>
            <div style={{ color: "#4A5A75", fontSize: 12 }}>Income vs Expenses per month</div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={monthly} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={3} barSize={14}>
              <CartesianGrid stroke="#1C2A42" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#3A4A62" tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <YAxis stroke="#3A4A62" tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "var(--font-mono)" }} tickFormatter={fmtShort} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="income"  name="Income"  fill="#22C55E" radius={[4,4,0,0]} opacity={0.85} />
              <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[4,4,0,0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: "#111827", border: "1px solid #1C2A42", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent Transactions</div>
          {recent.map((t, i) => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 0", borderBottom: i < recent.length - 1 ? "1px solid #1C2A4255" : "none"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${CAT_COLORS[t.cat] || "#4A5A75"}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${CAT_COLORS[t.cat] || "#4A5A75"}30`
                }}>
                  <Icon name="tag" size={14} color={CAT_COLORS[t.cat] || "#6B7A99"} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{t.desc}</div>
                  <div style={{ fontSize: 11, color: "#4A5A75" }}>{t.cat}</div>
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600,
                color: t.type === "income" ? "#22C55E" : "#F43F5E"
              }}>
                {t.type === "income" ? "+" : "-"}{fmtShort(t.amt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
