import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPECTED_SOURCES } from "@/lib/money/constants";
import { useSaveExpected, type Expected } from "@/lib/money/api";
import { Slider } from "@/components/ui/slider";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Expected | null;
}

export function ExpectedFormDialog({ open, onOpenChange, editing }: Props) {
  const save = useSaveExpected();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<string>(EXPECTED_SOURCES[0]);
  const [amount, setAmount] = useState("");
  const [probability, setProbability] = useState(80);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setDate(editing.expected_date);
      setSource(editing.source);
      setAmount(String(editing.amount));
      setProbability(editing.probability);
      setDescription(editing.description ?? "");
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setSource(EXPECTED_SOURCES[0]);
      setAmount("");
      setProbability(80);
      setDescription("");
    }
  }, [open, editing]);

  const submit = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    await save.mutateAsync({
      id: editing?.id,
      expected_date: date,
      source,
      amount: amt,
      probability,
      description: description || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Expected" : "Add Expected Money"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Expected Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPECTED_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Probability</Label>
              <span className="text-sm font-medium text-primary">{probability}%</span>
            </div>
            <Slider
              value={[probability]}
              onValueChange={([v]) => setProbability(v)}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional note"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
