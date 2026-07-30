import { Lightbulb } from "lucide-react";

export function BeginnerNote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
      <div className="flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>{children}</div>
      </div>
    </aside>
  );
}

export function ScientificWarning({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-md border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-semibold">Scientific caution</p>
      <p className="mt-1">{children}</p>
    </aside>
  );
}
