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
import {
  ACCOUNT_ICONS,
  ACCOUNT_ICON_OPTIONS,
  ACCOUNT_TYPES,
  CURRENCIES,
} from "@/lib/money/constants";
import { useSaveAccount, type Account } from "@/lib/money/api";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  account?: Account | null;
}

export function AccountFormDialog({ open, onOpenChange, account }: Props) {
  const save = useSaveAccount();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("wallet");
  const [type, setType] = useState<Account["type"]>("bank");
  const [currency, setCurrency] = useState("KES");
  const [opening, setOpening] = useState("0");

  useEffect(() => {
    if (open) {
      setName(account?.name ?? "");
      setIcon(account?.icon ?? "wallet");
      setType(account?.type ?? "bank");
      setCurrency(account?.currency ?? "KES");
      setOpening(String(account?.opening_balance ?? 0));
    }
  }, [open, account]);

  const submit = async () => {
    if (!name.trim()) return;
    await save.mutateAsync({
      id: account?.id,
      name: name.trim(),
      icon,
      type,
      currency,
      opening_balance: Number(opening) || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? "Edit Account" : "New Account"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Equity Bank" />
          </div>

          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {ACCOUNT_ICON_OPTIONS.map((key) => {
                const Icon = ACCOUNT_ICONS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    className={cn(
                      "h-10 rounded-lg border grid place-items-center transition",
                      icon === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Account["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Opening Balance</Label>
            <Input
              type="number"
              step="0.01"
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
              disabled={!!account}
            />
            {account && (
              <p className="text-xs text-muted-foreground">
                Opening balance is locked after creation to keep history accurate.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
