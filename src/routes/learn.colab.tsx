import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/workspace/TopNav";

export const Route = createFileRoute("/learn/colab")({
  component: () => <Guide title="Colab" lines={["Use Colab for GPU work that does not belong in the web app.", "Only open notebook links that exist in the selected SeqTrainer branch.", "Save artifacts before running the final runtime-disconnect cell."]} />,
});

function Guide({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-muted-foreground">
          {lines.map((line) => <li key={line}>{line}</li>)}
        </ol>
      </main>
    </div>
  );
}
