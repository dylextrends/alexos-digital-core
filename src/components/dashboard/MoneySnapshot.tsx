import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet, Landmark, ArrowDownCircle } from "lucide-react";

import { useAccountBalances, useTransactions } from "@/lib/money/api";
import { useDebts, debtRemaining } from "@/lib/debts/api";
import { formatMoney } from "@/lib/money/format";

export default function MoneySnapshot() {
  const { data: balances = [] } = useAccountBalances();
  const { data: transactions = [] } = useTransactions();
  const { data: debts = [] } = useDebts();

  const cashAvailable = balances.reduce((total, account) => total + Number(account.balance), 0);

  const totalDebt = debts
    .filter((d) => d.status !== "paid")
    .reduce((sum, debt) => sum + debtRemaining(debt), 0);

  const netWorth = cashAvailable - totalDebt;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.occurred_at);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear &&
      t.status === "posted"
    );
  });

  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const cards = [
    {
      title: "Cash Available",
      value: formatMoney(cashAvailable),
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      subtitle: "Across All Accounts",
    },
    {
      title: "Net Worth",
      value: formatMoney(netWorth),
      icon: Landmark,
      gradient: netWorth >= 0 ? "from-violet-500 to-purple-600" : "from-red-500 to-rose-600",
      bg: netWorth >= 0 ? "bg-violet-50" : "bg-red-50",
      iconBg: netWorth >= 0 ? "bg-violet-100" : "bg-red-100",
      iconColor: netWorth >= 0 ? "text-violet-700" : "text-red-700",
      subtitle: "Cash - Debt",
    },
    {
      title: "Income",
      value: formatMoney(income),
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      subtitle: "This Month",
    },
    {
      title: "Expenses",
      value: formatMoney(expenses),
      icon: TrendingDown,
      gradient: "from-orange-500 to-red-500",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-700",
      subtitle: "This Month",
    },
    {
      title: "Outstanding Debt",
      value: formatMoney(totalDebt),
      icon: ArrowDownCircle,
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      subtitle: `${debts.filter((d) => d.status !== "paid").length} Active Debt(s)`,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className={`overflow-hidden border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${card.bg}`}
          >
            <div className={`h-2 w-full bg-gradient-to-r ${card.gradient}`} />

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight">{card.value}</h2>
                </div>

                <div
                  className={`h-14 w-14 rounded-2xl ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.gradient}`}
                  style={{ width: "70%" }}
                />
              </div>

              <p className="mt-4 text-xs font-medium text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
