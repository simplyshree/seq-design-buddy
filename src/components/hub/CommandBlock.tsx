import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CommandBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-md border border-border bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-slate-300">
        <span>{label}</span>
        <button
          type="button"
          onClick={copy}
          title={`Copy ${label}`}
          aria-label={`Copy ${label}`}
          className="rounded p-1.5 text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="max-h-[26rem] overflow-x-auto p-4 text-xs leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
