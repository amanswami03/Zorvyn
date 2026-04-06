import { useMemo } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { ChartTip } from "../components/common/ChartTip";
import { Icon } from "../components/common/Icon";
import { fmtShort } from "../utils/helpers";
import { MONTHS, CAT_COLORS } from "../utils/constants";

// Analytics & insights view with KPIs and charts
export function InsightsPage({ transactions }) {
  // Separate expenses and income
  const expenses = transactions.filter(t => t.type === "expense");
  const incomes  = transactions.filter(t => t.type === "income");

  // Calculate category-wise spending
  const catTotals = useMemo(() => {
    const m = {};
    expenses.forEach(t => { m[t.cat] = (m[t.cat] || 0) + t.amt; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const highestCat = catTotals[0];

  // Build monthly income/expense summary
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
      savings: (map[m]?.income || 0) - (map[m]?.expense || 0)
    }));
  }, [transactions]);

  const totalIncome  = incomes.reduce((s, t) => s + t.amt, 0);
  const totalExpense = expenses.reduce((s, t) => s + t.amt, 0);
  const savingsRate  = ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1);
  const avgMonthlyExpense = (totalExpense / 6).toFixed(0);

  // Highest spend month
  const highMonth = [...monthly].sort((a, b) => b.expense - a.expense)[0];
  const bestSavingsMonth = [...monthly].sort((a, b) => b.savings - a.savings)[0];

  const InsightCard = ({ title, value, sub, accent, icon }) => (
    <div style={{
      background: "linear-gradient(145deg, #111827, #141D2E)",
      border: `1px solid ${accent}30`, borderRadius: 14, padding: "20px 22px",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: -15, right: -15, width: 80, height: 80, borderRadius: "50%", background: `${accent}15`, filter: "blur(8px)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ color: "#6B7A99", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>{title}</div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={15} color={accent} />
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: accent, marginBottom: 6 }}>{value}</div>
      <div style={{ color: "#4A5A75", fontSize: 12 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="fade-in">
      {/* Key performance indicators */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <InsightCard title="Savings Rate"          value={`${savingsRate}%`}        sub="Of total income saved"                icon="trend_up"   accent="#22C55E" />
        <InsightCard title="Highest Spend Category" value={highestCat?.[0] || "—"}  sub={`Total: ${fmtShort(highestCat?.[1])}`} icon="tag"        accent="#F0A500" />
        <InsightCard title="Avg Monthly Expense"   value={fmtShort(+avgMonthlyExpense)} sub="Average over 6 months"            icon="activity"   accent="#F43F5E" />
        <InsightCard title="Best Savings Month"    value={bestSavingsMonth?.month || "—"} sub={`Saved ${fmtShort(bestSavingsMonth?.savings)}`} icon="shield" accent="#818CF8" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Monthly savings and category breakdown */}
        <div style={{ background: "#111827", border: "1px solid #1C2A42", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Monthly Savings</div>
            <div style={{ color: "#4A5A75", fontSize: 12 }}>Net savings after expenses</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barSize={22}>
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#22C55E" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="savGradNeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#F43F5E" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C2A42" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#3A4A62" tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <YAxis stroke="#3A4A62" tick={{ fill: "#6B7A99", fontSize: 11, fontFamily: "var(--font-mono)" }} tickFormatter={fmtShort} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="savings" name="Savings" radius={[5,5,0,0]}>
                {monthly.map((e, i) => <Cell key={i} fill={e.savings >= 0 ? "#22C55E" : "#F43F5E"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Horizontal */}
        <div style={{ background: "#111827", border: "1px solid #1C2A42", borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Top Expense Categories</div>
            <div style={{ color: "#4A5A75", fontSize: 12 }}>Ranked by total spend</div>
          </div>
          {catTotals.slice(0, 7).map(([cat, val], i) => {
            const pct = (val / catTotals[0][1]) * 100;
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{cat}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: CAT_COLORS[cat] || "#94A3B8" }}>{fmtShort(val)}</span>
                </div>
                <div style={{ height: 5, background: "#1C2A42", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 3,
                    background: `linear-gradient(90deg, ${CAT_COLORS[cat] || "#4A5A75"}, ${CAT_COLORS[cat] || "#4A5A75"}88)`,
                    transition: "width 0.8s cubic-bezier(.4,0,.2,1)"
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated insights and recommendations */}
      <div style={{ background: "#111827", border: "1px solid #1C2A42", borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
          💡 Insights &amp; Recommendations
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
          {[
            { msg: `Your biggest expense category is ${highestCat?.[0]} (${fmtShort(highestCat?.[1])} total). Consider setting a budget limit.`, color: "#F0A500" },
            { msg: `You saved ${savingsRate}% of your income — ${+savingsRate > 20 ? "excellent! You're on track to financial health." : "aim for 20%+ savings rate."}`, color: "#22C55E" },
            { msg: `${highMonth?.month} was your highest expense month (${fmtShort(highMonth?.expense)}). Review discretionary spending.`, color: "#F43F5E" },
            { msg: `Freelance income adds ${fmtShort(transactions.filter(t=>t.cat==="Freelance").reduce((s,t)=>s+t.amt,0))} to your earnings — a great diversification strategy.`, color: "#818CF8" },
          ].map((o, i) => (
            <div key={i} style={{
              background: `${o.color}08`, border: `1px solid ${o.color}25`,
              borderRadius: 10, padding: "12px 15px", display: "flex", gap: 10, alignItems: "flex-start"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: o.color, marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{o.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
