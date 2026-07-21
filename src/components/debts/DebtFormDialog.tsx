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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveDebt, type Debt } from "@/lib/debts/api";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  debt?: Debt | null;
}

const CATEGORIES = ["Loan", "Credit Card", "Mortgage", "Family", "Business", "Other"];

export function DebtFormDialog({ open, onOpenChange, debt }: Props) {
  const save = useSaveDebt();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Loan");
  const [principal, setPrincipal] = useState("0");
  const [rate, setRate] = useState("0");
  const [minPay, setMinPay] = useState("0");
  const [paid, setPaid] = useState("0");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<Debt["priority"]>("medium");
  const [status, setStatus] = useState<Debt["status"]>("active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setName(debt?.name ?? "");
      setCategory(debt?.category ?? "Loan");
      setPrincipal(String(debt?.principal ?? 0));
      setRate(String(debt?.interest_rate ?? 0));
      setMinPay(String(debt?.minimum_payment ?? 0));
      setPaid(String(debt?.amount_paid ?? 0));
      setDue(debt?.due_date ?? "");
      setPriority(debt?.priority ?? "medium");
      setStatus(debt?.status ?? "active");
      setNotes(debt?.notes ?? "");
    }
  }, [open, debt]);

  const submit = async () => {
    if (!name.trim()) return;
    await save.mutateAsync({
      id: debt?.id,
      name: name.trim(),
      category,
      principal: Number(principal) || 0,
      interest_rate: Number(rate) || 0,
      minimum_payment: Number(minPay) || 0,
      amount_paid: Number(paid) || 0,
      due_date: due || null,
      priority,
      status,
      notes: notes.trim() || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{debt ? "Edit Debt" : "New Debt"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Lender / Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. KCB Personal Loan" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Debt["priority"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Principal</Label>
              <Input type="number" step="0.01" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Interest Rate (%)</Label>
              <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Minimum Payment</Label>
              <Input type="number" step="0.01" value={minPay} onChange={(e) => setMinPay(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Amount Paid</Label>
              <Input type="number" step="0.01" value={paid} onChange={(e) => setPaid(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Debt["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="defaulted">Defaulted</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save Debt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
