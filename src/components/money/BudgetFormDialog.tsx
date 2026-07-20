import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/lib/money/constants";
import { useSaveBudget, type Budget } from "@/lib/money/api";
import { monthKey } from "@/lib/money/format";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  month: string;
  editing?: Budget | null;
}

export function BudgetFormDialog({ open, onOpenChange, month, editing }: Props) {
  const save = useSaveBudget();
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setCategory(editing?.category ?? EXPENSE_CATEGORIES[0]);
    setAmount(editing ? String(editing.amount) : "");
  }, [open, editing]);

  const submit = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    await save.mutateAsync({
      id: editing?.id,
      category,
      month: month || monthKey(),
      amount: amt,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Budget" : "New Budget"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={!!editing}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Monthly Budget</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
