import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn/hpc")({
  component: () => (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">HPC</h1>
      <p className="mt-3 text-muted-foreground">
        Prepare repository, environment, datasets, and weights before submission. Compute jobs should not clone GitHub, download packages, or fetch model files.
      </p>
    </>
  ),
});
