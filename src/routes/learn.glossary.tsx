import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/workspace/TopNav";
import { GLOSSARY } from "@/lib/mock-state";

export const Route = createFileRoute("/learn/glossary")({
  component: () => (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Glossary</h1>
        <dl className="mt-6 grid gap-3">
          {GLOSSARY.map((item) => (
            <div key={item.term} className="rounded-md border border-border bg-card p-4">
              <dt className="font-medium text-foreground">{item.term}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{item.def}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  ),
});
