import { Search, Bell, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>

          <h1 className="text-4xl font-bold tracking-tight mt-1">
            {greeting()}, Alex 👋
          </h1>

          <p className="text-muted-foreground mt-2 max-w-2xl">
            Welcome back to AlexOS. Your personal AI operating system is ready.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assistant
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

        <Input
          placeholder="Ask AlexOS anything..."
          className="pl-12 h-14 rounded-2xl text-base"
        />
      </div>
    </div>
  );
}