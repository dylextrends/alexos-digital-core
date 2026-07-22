import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { modules, moduleGroups } from "@/lib/modules";
import { ArrowUpRight } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import AskAlexBar from "@/components/dashboard/AskAlexBar";
import { AIBriefing } from "@/components/dashboard/AIBriefing";
import MoneySnapshot from "@/components/dashboard/MoneySnapshot";
import { QuickActions } from "@/components/dashboard/QuickActions";
import BusinessSnapshot from "@/components/dashboard/BusinessSnapshot";
import TodaysMission from "@/components/dashboard/TodaysMission";
import RecentActivity from "@/components/dashboard/RecentActivity";
import IntelligenceFeed from "@/components/dashboard/IntelligenceFeed";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navModules = modules.filter((m) => m.url !== "/dashboard");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero + greeting */}
      <DashboardHeader />

      {/* Ask AlexOS */}
      <AskAlexBar />

      {/* AI Briefing: Bills Due, Cash Available, Debt Progress, AI Recommendation */}
      <AIBriefing />

      {/* Money Snapshot replaces the old KPI cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Money Snapshot</h2>
          <p className="text-sm text-muted-foreground">
            Your financial position at a glance.
          </p>
        </div>
        <MoneySnapshot />
      </section>

      {/* Quick Actions */}
      <QuickActions />

      {/* Business Snapshot replaces Featured Modules */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Business Snapshot</h2>
          <p className="text-sm text-muted-foreground">
            Revenue, customers, vehicle sales, CRM, marketing and profit.
          </p>
        </div>
        <BusinessSnapshot />
      </section>

      {/* Today's Mission replaces Quick Stats */}
      <TodaysMission />

      {/* Recent Activity + Personal Intelligence Feed */}
      <section className="grid gap-4 lg:grid-cols-2">
        <RecentActivity />
        <IntelligenceFeed />
      </section>

      {/* All Modules — unchanged tabs, groups and navigation */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">All Modules</h2>
          <span className="text-xs text-muted-foreground">
            {navModules.length} modules available
          </span>
        </div>
        <Tabs defaultValue={moduleGroups[0]} className="space-y-4">
          <TabsList className="flex flex-wrap h-auto">
            {moduleGroups.map((group) => (
              <TabsTrigger key={group} value={group}>
                {group}
              </TabsTrigger>
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
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {m.description}
                            </p>
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
    </div>
  );
}
