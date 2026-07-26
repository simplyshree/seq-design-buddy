import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dna, FlaskConical, ShieldCheck, Palette, ArrowRight, Play, Upload, Table2, Settings2, BarChart3, ScanSearch, FileDown, CheckCircle2 } from "lucide-react";
import { TopNav } from "@/components/workspace/TopNav";
import { useMock } from "@/lib/mock-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SeqTrainer Workspace — Home" },
      { name: "description", content: "Guided workspace for benchmarking DNA sequence models and designing genetic parts." },
      { property: "og:title", content: "SeqTrainer Workspace" },
      { property: "og:description", content: "Upload, validate, benchmark, annotate, and export biological sequence designs." },
    ],
  }),
  component: Index,
});

const GOALS = [
  { title: "Benchmark promoter models", desc: "Compare CNN, DNABERT2, and external tools on labeled data." },
  { title: "Annotate promoters in a plasmid", desc: "Use a trained model to scan a GenBank file for likely promoters." },
  { title: "Validate and visualize a design", desc: "Check an SBOL or GenBank file and open it in SBOL Canvas." },
];
const TOOLS = [
  { name: "BenchLab", icon: Table2, desc: "Dataset inspection & experiment setup." },
  { name: "SeqTrainer", icon: FlaskConical, desc: "Model benchmarking & promoter annotation." },
  { name: "SBOL Validator", icon: ShieldCheck, desc: "Validate and convert design files." },
  { name: "SBOL Canvas", icon: Palette, desc: "Visualize and edit genetic designs." },
];
const FLOW = [
  { label: "Upload", icon: Upload }, { label: "Validate", icon: ShieldCheck }, { label: "Inspect", icon: Table2 },
  { label: "Configure", icon: Settings2 }, { label: "Run", icon: Play }, { label: "Compare", icon: BarChart3 },
  { label: "Annotate", icon: ScanSearch }, { label: "Export", icon: FileDown }, { label: "Visualize", icon: Palette },
];

function Index() {
  const { loadExample } = useMock();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <Card className="border-primary/40">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary text-xs font-medium"><Dna className="h-4 w-4" /> NEW PROJECT</div>
              <CardTitle>Start a new project</CardTitle>
              <CardDescription>Choose your goal, file type, and where models will run.</CardDescription>
            </CardHeader>
            <CardContent><Button onClick={() => nav({ to: "/new" })}>Start new project <ArrowRight className="h-4 w-4" /></Button></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium"><CheckCircle2 className="h-4 w-4" /> EXAMPLE</div>
              <CardTitle>Continue example promoter project</CardTitle>
              <CardDescription>Pre-loaded with realistic mock data through the annotation step.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" onClick={() => { loadExample(); nav({ to: "/workspace/compare" }); }}>Open example <ArrowRight className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        </div>
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Pick a goal</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {GOALS.map((g) => (
              <Card key={g.title} className="hover:border-primary/50 transition-colors">
                <CardHeader><CardTitle className="text-base">{g.title}</CardTitle><CardDescription>{g.desc}</CardDescription></CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Four tools, one workflow</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((t) => (
              <Card key={t.name}>
                <CardHeader>
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-foreground"><t.icon className="h-4 w-4" /></div>
                  <CardTitle className="text-sm mt-2">{t.name}</CardTitle>
                  <CardDescription className="text-xs">{t.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">The workflow</h2>
          <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
            <ol className="flex items-center gap-2 min-w-max">
              {FLOW.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-foreground">
                    <s.icon className="h-3.5 w-3.5 text-primary" /> {s.label}
                  </div>
                  {i < FLOW.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </li>
              ))}
            </ol>
          </div>
        </section>
        <div className="mt-8 text-center"><Link to="/workspace/upload" className="text-sm text-primary hover:underline">Skip intro → go to workspace</Link></div>
      </main>
    </div>
  );
}
