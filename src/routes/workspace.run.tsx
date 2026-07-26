import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { CommandSnippet } from "@/components/workspace/CommandSnippet";
import { useMock, type MockRun } from "@/lib/mock-state";
import { Play, Square, RefreshCw, ExternalLink, Download, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/workspace/run")({
  head: () => ({ meta: [{ title: "Run — SeqTrainer" }, { name: "description", content: "Run or launch model experiments." }] }),
  component: RunPage,
});

const INITIAL: MockRun[] = [
  { model: "CNN baseline", status: "completed", env: "Local CPU", mcc: 0.42, auprc: 0.61, auroc: 0.79, accuracy: 0.81, balancedAccuracy: 0.74, precision: 0.68, recall: 0.62, specificity: 0.86, f1: 0.65, threshold: 0.52 },
  { model: "CNN-v2", status: "running", env: "Colab T4", mcc: 0, auprc: 0, auroc: 0, accuracy: 0, balancedAccuracy: 0, precision: 0, recall: 0, specificity: 0, f1: 0, threshold: 0 },
  { model: "DNABERT2 frozen", status: "queued", env: "Colab T4", mcc: 0, auprc: 0, auroc: 0, accuracy: 0, balancedAccuracy: 0, precision: 0, recall: 0, specificity: 0, f1: 0, threshold: 0 },
  { model: "DNABERT2 fine-tuning", status: "skipped", env: "HPC A100", mcc: 0, auprc: 0, auroc: 0, accuracy: 0, balancedAccuracy: 0, precision: 0, recall: 0, specificity: 0, f1: 0, threshold: 0 },
];

function StatusBadge({ status }: { status: MockRun["status"] }) {
  const cls = { completed: "bg-success text-success-foreground", running: "bg-primary text-primary-foreground", queued: "bg-muted text-muted-foreground", failed: "bg-destructive text-destructive-foreground", skipped: "bg-warning text-warning-foreground" }[status];
  return <Badge className={cls}>{status}</Badge>;
}

function RunCard({ r }: { r: MockRun }) {
  const isModel = r.model.includes("DNABERT");
  return (
    <Card className={isModel ? "border-model/40" : ""}>
      <CardHeader className="pb-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
          <div className="min-w-0"><CardTitle className="text-base truncate">{r.model}</CardTitle>
            <div className="text-xs text-muted-foreground mt-1">{r.env} · seed 42 · dataset 8f3a2b1e…</div></div>
          <StatusBadge status={r.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {r.status === "running" && <><Progress value={62} /><div className="text-xs text-muted-foreground">Epoch 12 / 20 · training loss 0.42</div></>}
        {r.status === "completed" && <div className="text-xs text-success flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Finished · MCC {r.mcc.toFixed(2)} · AUPRC {r.auprc.toFixed(2)}</div>}
        {r.status === "skipped" && <div className="text-xs text-warning flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Skipped — requires A100 GPU allocation</div>}
        {r.status === "queued" && <div className="text-xs text-muted-foreground">Waiting to start…</div>}
        <div className="rounded border border-border bg-muted/40 p-2 text-[11px] font-mono text-muted-foreground max-h-20 overflow-y-auto">
          [12:04:11] Loading dataset (5550 seqs)…{"\n"}[12:04:12] Split checksum OK{"\n"}[12:04:14] Starting {r.model}…
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost"><Square className="h-3.5 w-3.5" /> Stop</Button>
          <Button size="sm" variant="ghost"><RefreshCw className="h-3.5 w-3.5" /> Retry</Button>
          <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /> Config</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RunPage() {
  const { runs: stateRuns, setRuns, setStep } = useMock();
  const nav = useNavigate();
  const [local, setLocal] = useState<MockRun[]>(stateRuns.length ? stateRuns : INITIAL);
  const complete = () => {
    const done: MockRun[] = local.map((r) => r.status === "skipped" ? r : ({
      ...r, status: "completed",
      mcc: r.mcc || 0.5 + Math.random() * 0.1, auprc: r.auprc || 0.65 + Math.random() * 0.1,
      auroc: r.auroc || 0.82, accuracy: r.accuracy || 0.84, balancedAccuracy: r.balancedAccuracy || 0.78,
      precision: r.precision || 0.72, recall: r.recall || 0.7, specificity: r.specificity || 0.88,
      f1: r.f1 || 0.71, threshold: r.threshold || 0.5,
    }));
    setLocal(done); setRuns(done); setStep("run", "warning"); setStep("compare", "active");
  };
  return (
    <div>
      <PageHeader title="Run experiments" description="Each row is one model. Launch locally, in Colab, on HPC, or via external API."
        actions={<>
          <Button variant="secondary" onClick={complete}><Play className="h-4 w-4" /> Simulate all complete</Button>
          <Button onClick={() => { setStep("run", "done"); setStep("compare", "active"); nav({ to: "/workspace/compare" }); }}>Continue to compare <ArrowRight className="h-4 w-4" /></Button>
        </>} />
      <Tabs defaultValue="colab" className="mb-6">
        <TabsList><TabsTrigger value="local">Local</TabsTrigger><TabsTrigger value="colab">Google Colab</TabsTrigger><TabsTrigger value="hpc">HPC</TabsTrigger><TabsTrigger value="external">iPro-MP external</TabsTrigger></TabsList>
        <TabsContent value="local" className="mt-4"><Card><CardContent className="pt-6 text-sm text-muted-foreground">CPU-friendly baselines run here. GPU models are launched on Colab or HPC.</CardContent></Card></TabsContent>
        <TabsContent value="colab" className="mt-4"><Card>
          <CardHeader><CardTitle className="text-base">Launch on Google Colab</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm"><ExternalLink className="h-4 w-4" /> Open Colab</Button>
              <Button size="sm" variant="secondary"><Download className="h-4 w-4" /> Copy setup cells</Button>
              <Button size="sm" variant="secondary"><Download className="h-4 w-4" /> Download run_config.json</Button>
            </div>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Runtime → Change runtime type → T4 GPU</li>
              <li>Mount data or upload from local</li>
              <li>Run all cells top to bottom</li>
              <li>Reminder: Colab disconnects idle runtimes — download outputs before closing.</li>
            </ul>
          </CardContent></Card></TabsContent>
        <TabsContent value="hpc" className="mt-4"><Card>
          <CardHeader><CardTitle className="text-base">HPC (Slurm)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Prepare env: <code>module load python/3.11 cuda/12.1</code></li>
              <li>Stage dataset to <code>$SCRATCH</code></li>
              <li>Submit with <code>sbatch run.slurm</code></li>
            </ul>
            <CommandSnippet label="run.slurm" code={`#!/bin/bash
#SBATCH --job-name=seqtrainer
#SBATCH --gres=gpu:a100:1
#SBATCH --time=04:00:00
#SBATCH --mem=32G

module load python/3.11 cuda/12.1
source .venv/bin/activate
python -m seqtrainer.run --config run_config.json`} />
            <div className="text-xs text-warning flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> This UI does not perform GPU training. It prepares configs and launch scripts.</div>
          </CardContent></Card></TabsContent>
        <TabsContent value="external" className="mt-4"><Card>
          <CardHeader><CardTitle className="text-base">iPro-MP external evaluation</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Submit sequences to iPro-MP for an external baseline. Results appear in the comparison view.</p>
            <Button size="sm"><ExternalLink className="h-4 w-4" /> Send to iPro-MP</Button>
          </CardContent></Card></TabsContent>
      </Tabs>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {local.map((r) => <RunCard key={r.model} r={r} />)}
      </div>
      <div className="mt-6"><BeginnerBox what="Each model gets its own run card. Status shows what's happening." why="Different models need different environments (CPU, GPU, external)." choose="Start with the local CNN baseline while Colab warms up." /></div>
    </div>
  );
}