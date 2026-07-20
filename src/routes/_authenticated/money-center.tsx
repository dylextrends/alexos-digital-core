import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MoneyNav } from "@/components/money/MoneyNav";

export const Route = createFileRoute("/_authenticated/money-center")({
  component: MoneyCenterLayout,
});

function MoneyCenterLayout() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <MoneyNav />
      <div className="animate-in fade-in duration-300">
        <Outlet />
      </div>
    </div>
  );
}
