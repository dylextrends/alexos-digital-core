import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAccountBalances,
  useAccounts,
  useArchiveAccount,
  type Account,
} from "@/lib/money/api";
import { ACCOUNT_ICONS } from "@/lib/money/constants";
import { formatMoney } from "@/lib/money/format";
import { AccountFormDialog } from "@/components/money/AccountFormDialog";
import { Archive, ArchiveRestore, Pencil, Plus, Wallet } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/money-center/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  const [showArchived, setShowArchived] = useState(false);
  const { data: accounts = [], isLoading } = useAccounts(showArchived);
  const { data: balances = [] } = useAccountBalances();
  const archive = useArchiveAccount();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (a: Account) => {
    setEditing(a);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage where your money lives. Balances are calculated from transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="archived" checked={showArchived} onCheckedChange={setShowArchived} />
            <Label htmlFor="archived" className="text-sm">Show archived</Label>
          </div>
          <Button onClick={openNew} className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" /> New Account
          </Button>
        </div>
      </header>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
        {accounts.map((a) => {
          const bal = balances.find((b) => b.account_id === a.id);
          const Icon = ACCOUNT_ICONS[a.icon] ?? Wallet;
          const isArchived = a.status === "archived";
          return (
            <Card key={a.id} className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {a.type.replace("_", " ")} · {a.currency}
                      </div>
                    </div>
                  </div>
                  {isArchived && <Badge variant="secondary">Archived</Badge>}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Current Balance</div>
                  <div className="text-2xl font-semibold tracking-tight">
                    {formatMoney(bal?.balance ?? 0, a.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Opening: {formatMoney(a.opening_balance, a.currency)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(a)}
                    className="flex-1 rounded-lg"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archive.mutate({ id: a.id, archived: !isArchived })}
                    className="flex-1 rounded-lg"
                  >
                    {isArchived ? (
                      <>
                        <ArchiveRestore className="h-3.5 w-3.5 mr-1" /> Restore
                      </>
                    ) : (
                      <>
                        <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AccountFormDialog open={open} onOpenChange={setOpen} account={editing} />
    </div>
  );
}
