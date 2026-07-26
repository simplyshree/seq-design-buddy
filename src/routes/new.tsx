import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TopNav } from "@/components/workspace/TopNav";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/new")({
  head: () => ({ meta: [{ title: "New project — SeqTrainer" }, { name: "description", content: "Set up a new sequence ML project." }] }),
  component: NewProject,
});

function NewProject() {
  const { projectName, setProjectName, goal, setGoal, fileType, setFileType, compute, setCompute } = useMock();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div><h1 className="text-2xl font-semibold text-foreground">New project</h1><p className="text-sm text-muted-foreground mt-1">Answer four questions. We'll recommend a path.</p></div>
        <Card>
          <CardHeader><CardTitle className="text-base">Project details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label htmlFor="pn">Project name</Label><Input id="pn" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1.5" /></div>
            <div><Label>What do you want to do?</Label>
              <Select value={goal} onValueChange={setGoal}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Benchmark promoter models">Benchmark promoter models</SelectItem>
                  <SelectItem value="Annotate promoters in a plasmid">Annotate promoters in a plasmid</SelectItem>
                  <SelectItem value="Validate and visualize a genetic design">Validate and visualize a genetic design</SelectItem>
                </SelectContent></Select></div>
            <div><Label>What file type do you have?</Label>
              <Select value={fileType} onValueChange={setFileType}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["CSV","TSV","FASTA","GenBank","GFF3","SBOL XML","RDF/XML","Turtle"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Where will heavy models run?</Label>
              <RadioGroup value={compute} onValueChange={setCompute} className="mt-2 grid gap-2 sm:grid-cols-2">
                {["Google Colab","Local computer","HPC cluster","I am not sure"].map((c) => (
                  <label key={c} className="flex items-center gap-2 rounded-md border border-border p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value={c} /> <span className="text-sm">{c}</span>
                  </label>
                ))}
              </RadioGroup></div>
          </CardContent>
        </Card>
        <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm"><div className="font-medium text-foreground">Recommended path</div>
            <p className="text-muted-foreground mt-1">You selected <b>{fileType}</b> and <b>{compute}</b>. We'll inspect the dataset, create a benchmark plan, and prepare {compute === "Google Colab" ? "Colab instructions" : compute === "HPC cluster" ? "an HPC (Slurm) recipe" : "a local run recipe"}.</p>
          </div>
        </div>
        <BeginnerBox what="This screen collects the minimum info needed to build a reproducible plan." why="Your file type and compute target decide which models are safe to recommend." choose="If unsure, keep CSV + Google Colab — it works for most classification tasks." />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => nav({ to: "/" })}>Cancel</Button>
          <Button onClick={() => nav({ to: "/workspace/upload" })}>Continue to upload</Button>
        </div>
      </main>
    </div>
  );
}