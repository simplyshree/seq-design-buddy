import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/workspace/TopNav";
import { STANDARD_BUNDLE_FILES } from "@/lib/services/reproducibility";

export const Route = createFileRoute("/learn/artifacts")({
  component: () => (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">Artifacts</h1>
        <p className="mt-3 text-muted-foreground">Raw datasets are excluded from reproducibility bundles by default.</p>
        <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {STANDARD_BUNDLE_FILES.map((file) => <li key={file} className="rounded-md border border-border bg-card px-3 py-2">{file}</li>)}
        </ul>
      </main>
    </div>
  ),
});
