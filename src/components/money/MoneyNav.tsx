import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  PiggyBank,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const links: NavLink[] = [
  { to: "/money-center", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/money-center/accounts", label: "Accounts", icon: Wallet },
  { to: "/money-center/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/money-center/income", label: "Income", icon: ArrowDownCircle },
  { to: "/money-center/expenses", label: "Expenses", icon: ArrowUpCircle },
  { to: "/money-center/transfers", label: "Transfers", icon: Repeat },
  { to: "/money-center/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/money-center/expected", label: "Expected", icon: Clock },
  { to: "/money-center/analytics", label: "Analytics", icon: BarChart3 },
];

export function MoneyNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 sticky top-14 z-[5] bg-background/85 backdrop-blur">
      <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-thin">
        {links.map((l) => {
          const active = l.exact ? path === l.to : path.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
