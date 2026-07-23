import { Search, Bell, Sparkles, BookOpen, Quote } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDailyInspiration } from "@/lib/dashboard/inspiration";

export function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const inspiration = getDailyInspiration();

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      {/* ================= HERO ================= */}

      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 shadow-2xl">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm text-blue-100">{today}</p>

              <h1 className="mt-2 text-4xl lg:text-5xl font-bold text-white">
                {greeting()}, Alex 👋
              </h1>

              <p className="mt-3 text-blue-100 max-w-2xl">
                Welcome back to AlexOS. Your personal AI Operating System is ready.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                size="icon"
                className="bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur"
              >
                <Bell className="h-5 w-5 text-white" />
              </Button>

              <Button className="bg-white text-blue-700 hover:bg-slate-100 font-semibold shadow-lg">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
            </div>
          </div>

          {/* SEARCH */}

          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />

            <Input
              placeholder="Ask AlexOS anything..."
              className="h-14 rounded-2xl border-0 bg-white/95 backdrop-blur pl-12 text-base shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* ================= DAILY CARDS ================= */}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bible */}

        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-4">
              <BookOpen className="h-5 w-5" />

              <span>Daily Bible Verse</span>
            </div>

            <p className="text-slate-700 leading-7 text-[15px]">{inspiration.verse.text}</p>

            <p className="mt-5 font-bold text-emerald-700">{inspiration.verse.reference}</p>
          </CardContent>
        </Card>

        {/* Quote */}

        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-amber-700 font-semibold mb-4">
              <Quote className="h-5 w-5" />

              <span>Daily Success Quote</span>
            </div>

            <p className="italic text-slate-700 leading-7 text-[15px]">
              "{inspiration.quote.text}"
            </p>

            <p className="mt-5 font-bold text-amber-700">— {inspiration.quote.author}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
