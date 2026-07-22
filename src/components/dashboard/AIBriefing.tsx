import {
  Brain,
  Calendar,
  CircleDollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const briefing = [
  {
    title: "Today's Tasks",
    value: "4 Pending",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Customer Follow-ups",
    value: "12 Clients",
    icon: Users,
    color: "text-emerald-600",
  },
  {
    title: "Expected Cash",
    value: "KSh 0",
    icon: CircleDollarSign,
    color: "text-orange-600",
  },
  {
    title: "Business Growth",
    value: "+0%",
    icon: TrendingUp,
    color: "text-purple-600",
  },
];

export function AIBriefing() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>

        <div>
          <CardTitle>AI Briefing</CardTitle>

          <p className="text-sm text-muted-foreground mt-1">
            AlexOS daily summary and recommendations.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="font-medium">
            👋 Welcome back Alex.
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            You currently have no financial or CRM data connected.
            As you use AlexOS, this section will automatically summarize your
            business, banking, customers, goals and tasks.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {briefing.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-4 hover:bg-muted/40 transition"
            >
              <div className="flex justify-between items-center">
                <item.icon className={`h-5 w-5 ${item.color}`} />

                <span className="text-xs text-muted-foreground">
                  Live
                </span>
              </div>

              <h3 className="mt-4 text-sm font-medium">
                {item.title}
              </h3>

              <p className="text-xl font-bold mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
          <p className="font-medium">
            AI Recommendation
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            Connect your Money Center, CRM and Email modules to unlock
            intelligent financial forecasting, lead prioritization,
            reminders and business insights.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}