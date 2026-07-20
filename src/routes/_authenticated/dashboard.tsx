import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from "@/lib/modules";
import { ArrowUpRight, TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const kpis = [
  { label: "Net Worth", value: "—", delta: "+0.0%", icon: Wallet, positive: true },
  { label: "Monthly Cash Flow", value: "—", delta: "+0.0%", icon: TrendingUp, positive: true },
  { label: "Total Debt", value: "—", delta: "0.0%", icon: TrendingDown, positive: false },
  { label: "Goals On Track", value: "—", delta: "0", icon: Target, positive: true },
];

function Dashboard() {
  const navModules = modules.filter((m) => m.url !== "/dashboard");
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Executive Overview
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mt-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          A live snapshot of your personal and business operating system.
        </p>
      </header>

      {/* KPI Cards */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="relative overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {k.label}
              </CardTitle>
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center">
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
              className="group rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 shrink-0 rounded-md bg-primary/10 text-primary grid place-items-center">
                    <m.icon className="h-4 w-4" />
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
