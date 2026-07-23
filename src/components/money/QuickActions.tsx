import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowUpCircle, Repeat, Clock, PiggyBank } from "lucide-react";
import { TransactionFormDialog } from "./TransactionFormDialog";
import { ExpectedFormDialog } from "./ExpectedFormDialog";
import { BudgetFormDialog } from "./BudgetFormDialog";
import { monthKey } from "@/lib/money/format";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
}

export function QuickActions({ compact = false }: Props) {
  const [open, setOpen] = useState<
    null | "income" | "expense" | "transfer" | "expected" | "budget"
  >(null);

  const actions = [
    {
      key: "income",
      label: "Receive",
      icon: ArrowDownCircle,
      tone: "text-[color:var(--success)] border-[color:var(--success)]/30 bg-[color:var(--success)]/5",
    },
    {
      key: "expense",
      label: "Spend",
      icon: ArrowUpCircle,
      tone: "text-destructive border-destructive/30 bg-destructive/5",
    },
    {
      key: "transfer",
      label: "Transfer",
      icon: Repeat,
      tone: "text-primary border-primary/30 bg-primary/5",
    },
    {
      key: "expected",
      label: "Expected",
      icon: Clock,
      tone: "text-amber-600 border-amber-500/30 bg-amber-500/5",
    },
    {
      key: "budget",
      label: "Budget",
      icon: PiggyBank,
      tone: "text-violet-600 border-violet-500/30 bg-violet-500/5",
    },
  ] as const;

  return (
    <>
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        )}
      >
        {actions.map((a) => (
          <Button
            key={a.key}
            variant="outline"
            onClick={() => setOpen(a.key)}
            className={cn(
              "h-auto flex-col gap-2 py-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md",
              a.tone,
            )}
          >
            <a.icon className="h-5 w-5" />
            <span className="text-xs font-semibold">{a.label}</span>
          </Button>
        ))}
      </div>

      <TransactionFormDialog
        open={open === "income"}
        onOpenChange={(v) => !v && setOpen(null)}
        mode="income"
      />
      <TransactionFormDialog
        open={open === "expense"}
        onOpenChange={(v) => !v && setOpen(null)}
        mode="expense"
      />
      <TransactionFormDialog
        open={open === "transfer"}
        onOpenChange={(v) => !v && setOpen(null)}
        mode="transfer"
      />
      <ExpectedFormDialog open={open === "expected"} onOpenChange={(v) => !v && setOpen(null)} />
      <BudgetFormDialog
        open={open === "budget"}
        onOpenChange={(v) => !v && setOpen(null)}
        month={monthKey()}
      />
    </>
  );
}
