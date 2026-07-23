import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAccountBalances,
  useAccounts,
  useBudgets,
  useExpected,
  useTransactions,
} from "@/lib/money/api";
import { formatMoney, monthKey } from "@/lib/money/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/_authenticated/money-center/analytics")({
  component: AnalyticsPage,
});

const CHART_COLORS = [
  "hsl(220 70% 50%)",
  "hsl(150 60% 45%)",
  "hsl(35 90% 55%)",
  "hsl(280 60% 55%)",
  "hsl(0 70% 55%)",
  "hsl(200 60% 50%)",
  "hsl(320 60% 55%)",
  "hsl(90 50% 45%)",
  "hsl(20 80% 55%)",
  "hsl(260 50% 55%)",
];

function AnalyticsPage() {
  const { data: txs = [] } = useTransactions({});
  const { data: accounts = [] } = useAccounts();
  const { data: balances = [] } = useAccountBalances();
  const { data: budgets = [] } = useBudgets(monthKey());
  const { data: expected = [] } = useExpected();

  const monthly = useMemo(() => {
    const map = new Map<string, { month: string; income: number; expense: number }>();
    for (const t of txs) {
      if (t.type !== "income" && t.type !== "expense") continue;
      const d = new Date(t.occurred_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const row = map.get(key) ?? { month: key, income: 0, expense: 0 };
      if (t.type === "income") row.income += Number(t.amount);
      else row.expense += Number(t.amount);
      map.set(key, row);
    }
    return [...map.values()]
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12)
      .map((r) => ({ ...r, cashflow: r.income - r.expense }));
  }, [txs]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of txs) {
      if (t.type !== "expense") continue;
      const k = t.category ?? "Other";
      map[k] = (map[k] ?? 0) + Number(t.amount);
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [txs]);

  const bySource = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of txs) {
      if (t.type !== "income") continue;
      const k = t.source ?? "Other";
      map[k] = (map[k] ?? 0) + Number(t.amount);
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [txs]);

  const budgetActual = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const spent: Record<string, number> = {};
    for (const t of txs) {
      if (t.type !== "expense") continue;
      if (new Date(t.occurred_at) < monthStart) continue;
      const k = t.category ?? "Other";
      spent[k] = (spent[k] ?? 0) + Number(t.amount);
    }
    return budgets.map((b) => ({
      name: b.category,
      budget: Number(b.amount),
      actual: spent[b.category] ?? 0,
    }));
  }, [txs, budgets]);

  const accountBalanceData = balances.map((b) => ({
    name: accounts.find((a) => a.id === b.account_id)?.name ?? "?",
    balance: Number(b.balance),
  }));

  const netWorthTrend = useMemo(() => {
    const sorted = [...txs]
      .filter((t) => t.status === "posted")
      .sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime());
    const opening = accounts.reduce((s, a) => s + Number(a.opening_balance), 0);
    let running = opening;
    const map = new Map<string, number>();
    for (const t of sorted) {
      const key = t.occurred_at.slice(0, 10);
      if (t.type === "income") running += Number(t.amount);
      else if (t.type === "expense") running -= Number(t.amount);
      else if (t.type === "adjustment") running += Number(t.amount);
      map.set(key, running);
    }
    return [...map.entries()].slice(-60).map(([date, value]) => ({ date, value }));
  }, [txs, accounts]);

  const expectedVsReceived = useMemo(() => {
    const pending = expected
      .filter((e) => e.status === "pending")
      .reduce((s, e) => s + Number(e.amount), 0);
    const received = expected
      .filter((e) => e.status === "received")
      .reduce((s, e) => s + Number(e.amount), 0);
    const cancelled = expected
      .filter((e) => e.status === "cancelled")
      .reduce((s, e) => s + Number(e.amount), 0);
    return [
      { name: "Pending", value: pending },
      { name: "Received", value: received },
      { name: "Cancelled", value: cancelled },
    ];
  }, [expected]);

  const money = (n: number) => formatMoney(n);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Visual insights across your money.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Income vs Expenses (last 12 months)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => money(v)} />
              <Legend />
              <Bar dataKey="income" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill={CHART_COLORS[4]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cash Flow Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: number) => money(v)} />
              <Line
                type="monotone"
                dataKey="cashflow"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Categories">
          {byCategory.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={95}>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => money(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Income Sources">
          {bySource.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" outerRadius={95}>
                  {bySource.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 1) % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => money(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Budget vs Actual (this month)">
          {budgetActual.length === 0 ? (
            <Empty label="No budgets for this month" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={budgetActual}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Legend />
                <Bar dataKey="budget" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" fill={CHART_COLORS[4]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Account Balances">
          {accountBalanceData.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={accountBalanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="name" fontSize={11} width={80} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Bar dataKey="balance" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Net Worth Trend">
          {netWorthTrend.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={netWorthTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Expected vs Received">
          {expected.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={expectedVsReceived}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Empty({ label = "No data yet" }: { label?: string }) {
  return (
    <div className="h-[260px] grid place-items-center text-sm text-muted-foreground border border-dashed rounded-xl">
      {label}
    </div>
  );
}
