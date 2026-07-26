import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/workspace/TopNav";

const guides = [
  ["Glossary", "/learn/glossary"],
  ["Colab", "/learn/colab"],
  ["HPC", "/learn/hpc"],
  ["Artifacts", "/learn/artifacts"],
] as const;

export const Route = createFileRoute("/learn")({
  component: Learn,
});

function Learn() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Learn SeqTrainer Workspace</h1>
        <p className="mt-3 text-muted-foreground">
          Beginner guides explain each step, what output to expect, and how to verify success.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {guides.map(([label, href]) => (
            <Link key={href} to={href} className="rounded-md border border-border bg-card p-4 text-sm hover:border-primary">
              {label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
