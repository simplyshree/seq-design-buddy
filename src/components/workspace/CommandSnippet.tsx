import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommandSnippet({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-md border border-border bg-muted/40">
      {label && <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border">{label}</div>}
      <div className="flex items-start gap-2 p-3">
        <pre className="flex-1 overflow-x-auto text-xs text-foreground font-mono whitespace-pre">{code}</pre>
        <Button size="sm" variant="ghost"
          onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}