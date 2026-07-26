import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/hub/SiteShell";
import { GLOSSARY } from "@/lib/hub-content";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Glossary | Seq Design Buddy" },
      { name: "description", content: "Plain-language definitions for the SeqTrainer ecosystem." },
    ],
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Reference
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Beginner glossary</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Short definitions for the terms you will see in BenchLab, SeqTrainer, Validator, and
            Canvas.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <Search className="h-4 w-4 text-primary" />
          <span>Use your browser's find command to jump to a term.</span>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {GLOSSARY.map(([term, definition]) => (
            <div key={term} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <dt className="font-semibold text-foreground">{term}</dt>
              <dd className="mt-2 text-sm leading-6 text-muted-foreground">{definition}</dd>
            </div>
          ))}
        </dl>
      </section>
    </SiteShell>
  );
}
