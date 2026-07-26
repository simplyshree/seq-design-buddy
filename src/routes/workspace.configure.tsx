import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { CommandSnippet } from "@/components/workspace/CommandSnippet";
import { useMock } from "@/lib/mock-state";
import { Cpu, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/workspace/configure")({
  head: () => ({ meta: [{ title: "Configure — SeqTrainer" }, { name: "description", content: "Set up a reproducible benchmark." }] }),
  component: ConfigurePage,
});

const MODELS = [
  { name: "CNN baseline", compute: "Low", gpu: false, external: false, local: true, rec: true, desc: "Small convolutional baseline. Fast, honest starting point." },
  { name: "CNN-v2", compute: "Low-Med", gpu: false, external: false, local: true, rec: true, desc: "Deeper CNN with dropout. Still runs on CPU." },
  { name: "DNABERT2 frozen", compute: "Med", gpu: true, external: true, local: false, rec: true, desc: "Frozen transformer embeddings + classifier head." },
  { name: "DNABERT2 fine-tuning", compute: "High", gpu: true, external: true, local: false, rec: false, desc: "Full fine-tune. Needs A100-class GPU." },
  { name: "iPro-MP external", compute: "N/A", gpu: false, external: true, local: false, rec: false, desc: "External web tool for comparison only." },
];

function ConfigurePage() {
  const { compute, setStep, mode } = useMock();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string[]>(["CNN baseline","CNN-v2","DNABERT2 frozen"]);
  const toggle = (n: string) => setSelected((s) => s.includes(n) ? s.filter(x => x !== n) : [...s, n]);
  const cfg = { project: "example_promoter_project", seed: 42, models: selected, compute, quick_run: true, threshold_policy: "validation_only", metrics: ["MCC","AUPRC","AUROC","F1"] };
  return (
    <div>
      <PageHeader title="Benchmark configuration" description="Pick models and settings. We generate a reproducible run_config.json."
        actions={<Button onClick={() => { setStep("configure", "done"); setStep("run", "active"); nav({ to: "/workspace/run" }); }}>Continue to run <ArrowRight className="h-4 w-4" /></Button>} />
      <div className="rounded-md border border-primary/40 bg-primary/5 px-4 py-2.5 mb-6 flex items-center gap-2 text-sm">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span><b>Scientific rule:</b> thresholds are selected from validation data only. Test data is reserved for final reporting.</span>
      </div>
      <Tabs defaultValue={mode === "advanced" ? "advanced" : "beginner"} className="mb-6">
        <TabsList><TabsTrigger value="beginner">Beginner</TabsTrigger><TabsTrigger value="advanced">Advanced</TabsTrigger></TabsList>
        <TabsContent value="beginner" className="space-y-4 mt-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {MODELS.map((m) => {
              const on = selected.includes(m.name);
              const isModel = m.name.includes("DNABERT");
              return (
                <button key={m.name} onClick={() => toggle(m.name)} className={`text-left rounded-lg border p-4 transition-colors ${on ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`grid h-8 w-8 place-items-center rounded-md shrink-0 ${isModel ? "bg-model/15 text-model" : "bg-primary/15 text-primary"}`}><Cpu className="h-4 w-4" /></div>
                      <div className="font-medium text-sm truncate">{m.name}</div>
                    </div>
                    <Checkbox checked={on} className="shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-[10px]">Compute: {m.compute}</Badge>
                    {m.gpu && <Badge variant="secondary" className="text-[10px]">GPU recommended</Badge>}
                    {m.external && <Badge variant="secondary" className="text-[10px]">External weights</Badge>}
                    {m.local && <Badge variant="secondary" className="text-[10px]">Runs locally</Badge>}
                    {m.rec && <Badge className="text-[10px] bg-success text-success-foreground">Recommended</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Compute destination</Label><div className="mt-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">{compute}</div></div>
            <div><Label>Run size</Label>
              <Select defaultValue="quick"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="quick">Quick run (fewer epochs)</SelectItem><SelectItem value="full">Full run</SelectItem></SelectContent>
              </Select></div>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="mt-4">
          <Accordion type="multiple" defaultValue={["files","hp","eval"]}>
            <AccordionItem value="files"><AccordionTrigger>Data files & splits</AccordionTrigger>
              <AccordionContent className="grid gap-3 sm:grid-cols-3">
                <div><Label>Train file</Label><Input defaultValue="train.csv" className="mt-1.5" /></div>
                <div><Label>Validation file</Label><Input defaultValue="val.csv" className="mt-1.5" /></div>
                <div><Label>Test file</Label><Input defaultValue="test.csv" className="mt-1.5" /></div>
              </AccordionContent></AccordionItem>
            <AccordionItem value="hp"><AccordionTrigger>Hyperparameters</AccordionTrigger>
              <AccordionContent className="grid gap-3 sm:grid-cols-3">
                {[["Seed","42"],["Batch size","64"],["Learning rate","1e-4"],["Weight decay","1e-5"],["Dropout","0.2"],["Epochs","20"],["Early stopping","5"],["Sequence length","81"],["Repeats","3"]].map(([k,v]) => (
                  <div key={k}><Label>{k}</Label><Input defaultValue={v} className="mt-1.5" /></div>
                ))}
              </AccordionContent></AccordionItem>
            <AccordionItem value="eval"><AccordionTrigger>Evaluation & threshold</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div><Label>Threshold policy</Label>
                  <Select defaultValue="validation_only"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="validation_only">Select from validation (recommended)</SelectItem><SelectItem value="fixed">Fixed at 0.5</SelectItem></SelectContent>
                  </Select></div>
                <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Class balancing</label>
                <div><Label>Cross-validation folds</Label><Input defaultValue="5" className="mt-1.5" /></div>
              </AccordionContent></AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card><CardHeader><CardTitle className="text-base">Preview: run_config.json</CardTitle></CardHeader>
            <CardContent><CommandSnippet code={JSON.stringify(cfg, null, 2)} /></CardContent></Card>
        </div>
        <div><BeginnerBox what="Choose what to compare and where it will run." why="A frozen configuration is what makes runs reproducible." choose="Keep the three recommended models and 'Quick run' for your first try." /></div>
      </div>
    </div>
  );
}