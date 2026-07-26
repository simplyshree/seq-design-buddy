import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/workspace/TopNav";

export const Route = createFileRoute("/learn/hpc")({
  component: () => (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">HPC</h1>
        <p className="mt-3 text-muted-foreground">
          Prepare repository, environment, datasets, and weights before submission. Compute jobs should not clone GitHub, download packages, or fetch model files.
        </p>
      </main>
    </div>
  ),
});
