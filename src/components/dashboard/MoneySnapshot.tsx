import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Landmark,
  ArrowDownCircle,
} from "lucide-react";

import { useAccountBalances, useTransactions } from "@/lib/money/api";
import { useDebts, debtRemaining } from "@/lib/debts/api";
import { formatMoney } from "@/lib/money/format";

export default function MoneySnapshot() {
  const { data: balances = [] } = useAccountBalances();
  const { data: transactions = [] } = useTransactions();
  const { data: debts = [] } = useDebts();

  // ==========================
  // CASH AVAILABLE
  // ==========================

  const cashAvailable = balances.reduce(
    (total, account) => total + Number(account.balance),
    0
  );

  // ==========================
  // TOTAL DEBT
  // ==========================

  const totalDebt = debts
    .filter((d) => d.status !== "paid")
    .reduce((sum, debt) => sum + debtRemaining(debt), 0);

  // ==========================
  // NET WORTH
  // ==========================

  const netWorth = cashAvailable - totalDebt;

  // ==========================
  // MONTHLY INCOME / EXPENSES
  // ==========================

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
      color: "text-blue-600",
      trend: "Across All Accounts",
    },
    {
      title: "Net Worth",
      value: formatMoney(netWorth),
      icon: Landmark,
      color: netWorth >= 0 ? "text-violet-600" : "text-red-600",
      trend: "Cash - Debt",
    },
    {
      title: "Income",
      value: formatMoney(income),
      icon: TrendingUp,
      color: "text-green-600",
      trend: "This Month",
    },
    {
      title: "Expenses",
      value: formatMoney(expenses),
      icon: TrendingDown,
      color: "text-red-600",
      trend: "This Month",
    },
    {
      title: "Outstanding Debt",
      value: formatMoney(totalDebt),
      icon: ArrowDownCircle,
      color: "text-orange-600",
      trend: `${debts.filter((d) => d.status !== "paid").length} Active Debt(s)`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="rounded-2xl hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>

              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>

            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {card.trend}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}