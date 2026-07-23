import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRecordDebtPayment, type Debt, debtRemaining } from "@/lib/debts/api";
import { formatMoney } from "@/lib/money/format";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  debt: Debt | null;
}

export function DebtPaymentDialog({ open, onOpenChange, debt }: Props) {
  const pay = useRecordDebtPayment();
  const [amount, setAmount] = useState("");

  const submit = async () => {
    if (!debt) return;
    const n = Number(amount);
    if (!n || n <= 0) return;
    await pay.mutateAsync({ debt, amount: n });
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        {debt && (
          <div className="space-y-4">
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">{debt.name}</div>
              <div className="text-muted-foreground text-xs">
                Remaining: {formatMoney(debtRemaining(debt))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pay.isPending || !amount}>
            {pay.isPending ? "Saving..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
