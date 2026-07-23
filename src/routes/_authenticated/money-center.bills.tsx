import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Calendar as CalendarIcon,
  AlertCircle,
  CircleDollarSign,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  useBills,
  useSaveBill,
  useDeleteBill,
  useMarkBillPaid,
  type Bill,
  type BillFrequency,
} from "@/lib/money/bills";
import { useAccounts } from "@/lib/money/api";
import { EXPENSE_CATEGORIES } from "@/lib/money/constants";
import { formatMoney, formatDate } from "@/lib/money/format";

export const Route = createFileRoute("/_authenticated/money-center/bills")({
  component: BillsPage,
});

const FREQUENCIES: { value: BillFrequency; label: string }[] = [
  { value: "one_time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function daysUntil(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86_400_000);
}

function BillsPage() {
  const { data: bills = [], isLoading } = useBills();
  const { data: accounts = [] } = useAccounts();
  const del = useDeleteBill();
  const markPaid = useMarkBillPaid();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return bills.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [bills, statusFilter, search]);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const unpaid = bills.filter((b) => b.status === "pending");
  const totalUnpaid = unpaid.reduce((s, b) => s + Number(b.amount), 0);
  const upcoming7 = unpaid.filter((b) => {
    const d = daysUntil(b.due_date);
    return d >= 0 && d <= 7;
  });
  const dueThisMonth = unpaid.filter((b) => b.due_date.startsWith(monthKey));

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (b: Bill) => {
    setEditing(b);
    setDialogOpen(true);
  };

  const onDelete = async (b: Bill) => {
    if (!confirm(`Delete "${b.name}"?`)) return;
    await del.mutateAsync(b.id);
    toast.success("Bill deleted");
  };

  const onMarkPaid = async (b: Bill) => {
    await markPaid.mutateAsync(b);
    toast.success(
      b.frequency === "one_time" ? "Marked as paid" : "Paid — next due date scheduled",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills</h1>
          <p className="text-muted-foreground">Track recurring payments and stay ahead of due dates.</p>
        </div>
        <Button onClick={openNew} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Add Bill
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <KpiCard
          label="Upcoming (7 days)"
          value={`${upcoming7.length} bills`}
          hint={formatMoney(upcoming7.reduce((s, b) => s + Number(b.amount), 0))}
          icon={CalendarIcon}
          tone="text-primary"
        />
        <KpiCard
          label="Total Unpaid"
          value={formatMoney(totalUnpaid)}
          hint={`${unpaid.length} pending`}
          icon={AlertCircle}
          tone="text-destructive"
        />
        <KpiCard
          label="Due This Month"
          value={formatMoney(dueThisMonth.reduce((s, b) => s + Number(b.amount), 0))}
          hint={`${dueThisMonth.length} bills`}
          icon={CircleDollarSign}
          tone="text-amber-600"
        />
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-base">Your Bills</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-9 w-40"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No bills yet. Click <b>Add Bill</b> to create your first one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => {
                    const days = daysUntil(b.due_date);
                    const overdue = b.status === "pending" && days < 0;
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell className="text-muted-foreground">{b.category ?? "—"}</TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(b.due_date)}</div>
                          {b.status === "pending" && (
                            <div className={`text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                              {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? "today" : `in ${days}d`}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="capitalize text-sm text-muted-foreground">
                          {b.frequency.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={b.status === "paid" ? "secondary" : overdue ? "destructive" : "default"}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatMoney(Number(b.amount))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {b.status === "pending" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onMarkPaid(b)}
                                title="Mark paid"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => openEdit(b)} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => onDelete(b)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bill={editing}
        accounts={accounts}
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof CalendarIcon;
  tone: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-1 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={`h-4 w-4 ${tone}`} />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold tracking-tight">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function BillDialog({
  open,
  onOpenChange,
  bill,
  accounts,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bill: Bill | null;
  accounts: { id: string; name: string }[];
}) {
  const save = useSaveBill();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("Other");
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [frequency, setFrequency] = useState<BillFrequency>("monthly");
  const [accountId, setAccountId] = useState<string>("none");
  const [autoTx, setAutoTx] = useState(false);
  const [notes, setNotes] = useState("");

  // reset form when opened
  useMemo(() => {
    if (open) {
      setName(bill?.name ?? "");
      setAmount(bill ? String(bill.amount) : "");
      setCategory(bill?.category ?? "Other");
      setDueDate(bill?.due_date ?? new Date().toISOString().slice(0, 10));
      setFrequency(bill?.frequency ?? "monthly");
      setAccountId(bill?.account_id ?? "none");
      setAutoTx(bill?.auto_create_transaction ?? false);
      setNotes(bill?.notes ?? "");
    }
  }, [open, bill]);

  const submit = async () => {
    if (!name.trim() || !amount) {
      toast.error("Name and amount are required");
      return;
    }
    await save.mutateAsync({
      id: bill?.id,
      name: name.trim(),
      amount: Number(amount),
      category,
      due_date: dueDate,
      frequency,
      account_id: accountId === "none" ? null : accountId,
      auto_create_transaction: autoTx,
      notes: notes.trim() || null,
    });
    toast.success(bill ? "Bill updated" : "Bill created");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{bill ? "Edit Bill" : "New Bill"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as BillFrequency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Pay From Account (optional)</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoTx}
              onChange={(e) => setAutoTx(e.target.checked)}
              className="h-4 w-4"
            />
            Auto-create an expense transaction when marked paid
          </label>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
