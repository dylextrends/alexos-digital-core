import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { modules, moduleGroups } from "@/lib/modules";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  Receipt,
  CalendarPlus,
  UserPlus,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Zap,
  Eye,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const kpis = [
  { label: "Net Worth", value: "$0.00", delta: "+0.0%", icon: Wallet, positive: true, color: "text-primary" },
  { label: "Monthly Cash Flow", value: "$0.00", delta: "+0.0%", icon: TrendingUp, positive: true, color: "text-success" },
  { label: "Total Debt", value: "$0.00", delta: "0.0%", icon: TrendingDown, positive: false, color: "text-orange-500" },
  { label: "Goals On Track", value: "0", delta: "0%", icon: Target, positive: true, color: "text-purple-500" },
];

const quickActions = [
  { label: "Add Transaction", icon: Receipt, to: "/money-center", color: "bg-primary/10 text-primary" },
  { label: "New Goal", icon: Target, to: "/goals", color: "bg-purple-500/10 text-purple-600" },
  { label: "Create Task", icon: Plus, to: "/tasks", color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Schedule Event", icon: CalendarPlus, to: "/calendar", color: "bg-pink-500/10 text-pink-600" },
  { label: "New Contact", icon: UserPlus, to: "/people", color: "bg-indigo-500/10 text-indigo-600" },
  { label: "Log Payment", icon: Wallet, to: "/debt-management", color: "bg-orange-500/10 text-orange-600" },
];

const moduleHighlights = [
  {
    title: "Money Center",
    icon: Wallet,
    stats: [
      { label: "Accounts", value: "—" },
      { label: "Expenses", value: "$0.00" },
      { label: "Income", value: "$0.00" },
    ],
    action: "View Accounts",
    actionTo: "/money-center",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    title: "Goals & Objectives",
    icon: Target,
    stats: [
      { label: "Active", value: "0" },
      { label: "On Track", value: "0%" },
      { label: "Saved", value: "$0" },
    ],
    action: "View Goals",
    actionTo: "/goals",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    title: "Debt Management",
    icon: TrendingDown,
    stats: [
      { label: "Debts", value: "0" },
      { label: "Balance", value: "$0.00" },
      { label: "Next Due", value: "—" },
    ],
    action: "Manage Debt",
    actionTo: "/debt-management",
    gradient: "from-orange-600 to-orange-400",
  },
  {
    title: "Tasks & Projects",
    icon: CheckCircle2,
    stats: [
      { label: "Total", value: "0" },
      { label: "Done", value: "0%" },
      { label: "Overdue", value: "0" },
    ],
    action: "Manage Tasks",
    actionTo: "/tasks",
    gradient: "from-emerald-600 to-emerald-400",
  },
];

const activityFeed = [
  { action: "Dashboard initialized", time: "Just now", icon: Activity },
];

function Dashboard() {
  const navModules = modules.filter((m) => m.url !== "/dashboard");
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground shadow-xl">
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
                {today}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {timeOfDay()}, Alex
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-primary-foreground/85 leading-relaxed">
                Welcome to Alex OS Pro — your personal and business operating system. Command your
                money, people, goals and operations from one elegant, banking-grade workspace.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge>🔒 Bank-level security</Badge>
                <Badge>📊 Real-time analytics</Badge>
                <Badge>⚡ Lightning fast</Badge>
              </div>
            </div>
            <div className="hidden md:flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Zap className="h-12 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Dashboard */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Key Performance Indicators</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reports">
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-muted ${k.color}`}>
                  <k.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tracking-tight">{k.value}</p>
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  {k.positive ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 text-success" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-orange-500" />
                  )}
                  {k.delta} vs last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="group">
              <Card className="rounded-2xl border-border/60 hover:border-primary/40 hover:shadow-md transition-all h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${a.color} group-hover:scale-110 transition-transform`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium leading-tight">{a.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Modules */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Featured Modules</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {moduleHighlights.map((m) => (
            <Card key={m.title} className="rounded-2xl border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className={`h-1.5 w-full bg-gradient-to-r ${m.gradient}`} />
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white shadow-sm`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{m.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {m.stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-muted/50 p-3 text-center">
                      <p className="text-base font-semibold tracking-tight">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full rounded-xl" asChild>
                  <Link to={m.actionTo}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {m.action}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Activity & Insights */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {activityFeed.length > 0 ? (
                activityFeed.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-xl border border-dashed border-border/60 p-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No activity yet</p>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Accounts", value: "0", icon: Wallet, color: "text-primary bg-primary/10" },
                { label: "Goals", value: "0", icon: Target, color: "text-purple-600 bg-purple-500/10" },
                { label: "Debts", value: "0", icon: AlertCircle, color: "text-orange-600 bg-orange-500/10" },
                { label: "Tasks", value: "0", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-muted/50 p-3 flex flex-col items-center text-center">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-semibold">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Complete Module Browser */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">All Modules</h2>
          <span className="text-xs text-muted-foreground">{navModules.length} modules available</span>
        </div>

        <Tabs defaultValue={moduleGroups[0]} className="space-y-4">
          <TabsList className="flex flex-wrap h-auto">
            {moduleGroups.map((group) => (
              <TabsTrigger key={group} value={group}>{group}</TabsTrigger>
            ))}
          </TabsList>

          {moduleGroups.map((group) => (
            <TabsContent key={group} value={group}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {navModules
                  .filter((m) => m.group === group)
                  .map((m) => (
                    <Link key={m.url} to={m.url} className="group">
                      <Card className="rounded-2xl border-border/60 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                              <m.icon className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{m.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{m.description}</p>
                          </div>
                          <span className="inline-block text-[10px] uppercase tracking-wider text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                            {m.group}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Footer Tips */}
      <Card className="rounded-2xl border-dashed bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">Pro Tips</p>
              <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-muted-foreground">
                <li>• Use quick actions to rapidly create entries across modules</li>
                <li>• Visit Reports for deep analytics and export capabilities</li>
                <li>• Enable notifications in Settings for important updates</li>
                <li>• Connect external services in Settings for automated workflows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-primary-foreground ring-1 ring-white/20 backdrop-blur-sm">
      {children}
    </span>
  );
}
