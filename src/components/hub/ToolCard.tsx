import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ExternalToolLink } from "./ExternalToolLink";
import type { ToolSummary } from "@/lib/hub-content";

export function ToolCard({ tool }: { tool: ToolSummary }) {
  return (
    <article
      className={`flex h-full flex-col rounded-lg border bg-card p-5 shadow-sm ${tool.primary ? "border-primary/30" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-accent text-accent-foreground">
          <tool.icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {tool.primary ? "Start here" : "Later step"}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{tool.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.purpose}</p>
      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-foreground">When to use it</dt>
          <dd className="mt-1 text-muted-foreground">{tool.when}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Do not use it when</dt>
          <dd className="mt-1 text-muted-foreground">{tool.avoid}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Expected input</dt>
          <dd className="mt-1 text-muted-foreground">{tool.input}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Expected output</dt>
          <dd className="mt-1 text-muted-foreground">{tool.output}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Where it runs</dt>
          <dd className="mt-1 text-muted-foreground">{tool.runs}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Part of this site?</dt>
          <dd className="mt-1 text-muted-foreground">{tool.status}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <ExternalToolLink href={tool.href}>Open repository</ExternalToolLink>
        {tool.website && <ExternalToolLink href={tool.website}>Open website</ExternalToolLink>}
        <Link
          to={`/tools/${tool.id === "validator" ? "sbol-validator" : tool.id === "canvas" ? "sbol-canvas" : tool.id}`}
          className="inline-flex items-center gap-1.5 px-1 py-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Read instructions <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
