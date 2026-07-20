import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import {
  useAccounts,
  useCancelExpected,
  useExpected,
  useMarkExpectedReceived,
  type Expected,
} from "@/lib/money/api";
import { ExpectedFormDialog } from "@/components/money/ExpectedFormDialog";
import { formatDate, formatMoney } from "@/lib/money/format";
import { Check, Pencil, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/money-center/expected")({
  component: ExpectedPage,
});

function ExpectedPage() {
  const { data: pending = [] } = useExpected("pending");
  const { data: received = [] } = useExpected("received");
  const { data: cancelled = [] } = useExpected("cancelled");
  const { data: accounts = [] } = useAccounts();
  const markReceived = useMarkExpectedReceived();
  const cancel = useCancelExpected();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Expected | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [receiveTarget, setReceiveTarget] = useState<Expected | null>(null);
  const [receiveAccount, setReceiveAccount] = useState<string>("");

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (e: Expected) => {
    setEditing(e);
    setDialogOpen(true);
  };
  const startReceive = (e: Expected) => {
    setReceiveTarget(e);
    setReceiveAccount(accounts[0]?.id ?? "");
    setReceiveOpen(true);
  };
  const confirmReceive = async () => {
    if (!receiveTarget || !receiveAccount) return;
    await markReceived.mutateAsync({ expected: receiveTarget, accountId: receiveAccount });
    setReceiveOpen(false);
  };

  const pendingTotal = pending.reduce((s, e) => s + Number(e.amount), 0);
  const weightedTotal = pending.reduce((s, e) => s + (Number(e.amount) * e.probability) / 100, 0);

  const renderRow = (e: Expected) => (
    <TableRow key={e.id}>
      <TableCell className="text-sm whitespace-nowrap">{formatDate(e.expected_date)}</TableCell>
      <TableCell className="text-sm">{e.source}</TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">
        {e.description ?? "—"}
      </TableCell>
      <TableCell className="text-right font-semibold whitespace-nowrap">
        {formatMoney(e.amount)}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{e.probability}%</Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={
            e.status === "received" ? "default" : e.status === "cancelled" ? "destructive" : "secondary"
          }
          className="capitalize"
        >
          {e.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {e.status === "pending" && (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(e)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[color:var(--success)]"
              onClick={() => startReceive(e)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => cancel.mutate(e.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expected Money</h1>
          <p className="text-sm text-muted-foreground">
            Track upcoming income. Mark as received to log automatically.
          </p>
        </div>
        <Button onClick={openNew} className="rounded-xl">
          <Plus className="h-4 w-4 mr-1" /> Add Expected
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-1">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Pending Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-amber-600">{formatMoney(pendingTotal)}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-1">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Weighted (by %)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-primary">{formatMoney(weightedTotal)}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-1">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-[color:var(--success)]">
              {formatMoney(received.reduce((s, e) => s + Number(e.amount), 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle className="text-base">All Expected</CardTitle></CardHeader>
        <CardContent className={cn("overflow-x-auto")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...pending, ...received, ...cancelled].length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                    Nothing expected yet.
                  </TableCell>
                </TableRow>
              )}
              {pending.map(renderRow)}
              {received.map(renderRow)}
              {cancelled.map(renderRow)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExpectedFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />

      <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as Received</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {receiveTarget && (
              <div className="rounded-xl bg-muted/50 p-3 text-sm">
                <div className="font-medium">{receiveTarget.source}</div>
                <div className="text-muted-foreground">{formatMoney(receiveTarget.amount)}</div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Destination account</Label>
              <Select value={receiveAccount} onValueChange={setReceiveAccount}>
                <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReceiveOpen(false)}>Cancel</Button>
            <Button onClick={confirmReceive} disabled={markReceived.isPending || !receiveAccount}>
              {markReceived.isPending ? "Saving..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
