import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export function BeginnerBox({
  what, why, choose, children,
}: { what: string; why: string; choose?: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 text-primary font-medium text-sm">
        <Lightbulb className="h-4 w-4" /> Beginner help
      </div>
      <dl className="mt-2 space-y-2 text-sm">
        <div>
          <dt className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">What happens here?</dt>
          <dd className="text-muted-foreground">{what}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Why is this needed?</dt>
          <dd className="text-muted-foreground">{why}</dd>
        </div>
        {choose && (
          <div>
            <dt className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">What should I choose?</dt>
            <dd className="text-muted-foreground">{choose}</dd>
          </div>
        )}
      </dl>
      {children}
    </div>
  );
}