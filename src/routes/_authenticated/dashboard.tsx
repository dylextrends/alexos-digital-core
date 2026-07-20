import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { modules } from "@/lib/modules";
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  Receipt,
  CalendarPlus,
  UserPlus,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const kpis = [
  { label: "Net Worth", value: "—", delta: "+0.0%", icon: Wallet, positive: true },
  { label: "Monthly Cash Flow", value: "—", delta: "+0.0%", icon: TrendingUp, positive: true },
  { label: "Total Debt", value: "—", delta: "0.0%", icon: TrendingDown, positive: false },
  { label: "Goals On Track", value: "—", delta: "0", icon: Target, positive: true },
];

const quickActions = [
  { label: "Add Transaction", icon: Receipt, to: "/money-center" },
  { label: "New Contact", icon: UserPlus, to: "/people" },
  { label: "Schedule Event", icon: CalendarPlus, to: "/calendar" },
  { label: "Create Task", icon: Plus, to: "/tasks" },
];

function Dashboard() {
  const navModules = modules.filter((m) => m.url !== "/dashboard");
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Welcome */}
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-primary-foreground/70">
              {today}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
              Welcome back
            </h1>
            <p className="text-sm text-primary-foreground/80 mt-2 max-w-lg">
              Your personal and business operating system. Track finances, sales, goals and
              operations in one elegant workspace.
            </p>
          </div>
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary-foreground/10 grid place-items-center">
            <Wallet className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-2xl transition-shadow hover:shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {k.label}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <k.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
              <div
                className={`text-xs mt-1 ${
                  k.positive ? "text-[color:var(--success)]" : "text-muted-foreground"
                }`}
              >
                {k.delta} vs last period
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Actions + Recent Activity */}
      <section className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <Button
                key={a.label}
                asChild
                variant="outline"
                className="h-auto flex-col gap-2 py-4 rounded-xl"
              >
                <Link to={a.to}>
                  <a.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {a.label}
                  </span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <div className="mx-auto h-10 w-10 rounded-full bg-muted grid place-items-center mb-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">No activity yet</div>
              <p className="text-xs text-muted-foreground mt-1">
                Activity across your modules will appear here as you use Alex OS.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Module grid */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Modules</h2>
          <span className="text-xs text-muted-foreground">{navModules.length} available</span>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {navModules.map((m) => (
            <Link
              key={m.url}
              to={m.url}
              className="group rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{m.title}</div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {m.group}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{m.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
