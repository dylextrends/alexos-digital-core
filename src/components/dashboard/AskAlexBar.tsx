import { Search } from "lucide-react";

export default function AskAlexBar() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <Search className="h-5 w-5 text-muted-foreground" />

        <input
          type="text"
          placeholder='Ask AlexOS... e.g. "Can I afford this car?"'
          className="w-full bg-transparent outline-none"
        />
      </div>
    </div>
  );
}