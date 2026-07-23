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
import {
  Car,
  Shield,
  GraduationCap,
  Home,
  Plane,
  Heart,
  Target,
  Briefcase,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { useSaveGoal, type Goal } from "@/lib/goals/api";
import { cn } from "@/lib/utils";

export const GOAL_ICONS: Record<string, LucideIcon> = {
  target: Target,
  car: Car,
  shield: Shield,
  graduation: GraduationCap,
  home: Home,
  plane: Plane,
  heart: Heart,
  briefcase: Briefcase,
  piggy: PiggyBank,
};

const CATEGORIES = [
  "Savings",
  "Emergency",
  "Vehicle",
  "Education",
  "Home",
  "Travel",
  "Business",
  "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goal?: Goal | null;
}

export function GoalFormDialog({ open, onOpenChange, goal }: Props) {
  const save = useSaveGoal();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("target");
  const [category, setCategory] = useState("Savings");
  const [target, setTarget] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [status, setStatus] = useState<Goal["status"]>("active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setName(goal?.name ?? "");
      setIcon(goal?.icon ?? "target");
      setCategory(goal?.category ?? "Savings");
      setTarget(String(goal?.target_amount ?? 0));
      setTargetDate(goal?.target_date ?? "");
      setStatus(goal?.status ?? "active");
      setNotes(goal?.notes ?? "");
    }
  }, [open, goal]);

  const submit = async () => {
    if (!name.trim()) return;
    await save.mutateAsync({
      id: goal?.id,
      name: name.trim(),
      icon,
      category,
      target_amount: Number(target) || 0,
      target_date: targetDate || null,
      status,
      notes: notes.trim() || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "New Goal"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Goal Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Audi Fund"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Icon</Label>
            <div className="grid grid-cols-9 gap-2">
              {Object.entries(GOAL_ICONS).map(([key, Icon]) => (
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
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Goal["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="achieved">Achieved</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Target Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Target Date</Label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
