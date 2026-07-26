import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Package } from "lucide-react";

export const Route = createFileRoute("/workspace/reproduce")({
  head: () => ({ meta: [{ title: "Reproducibility — SeqTrainer" }, { name: "description", content: "Download a full reproducibility bundle." }] }),
  component: ReproducePage,
});

const FILES = [
  "run_config.json","metrics.csv","metrics.json","predictions.csv","manifest.json",
  "history.csv","dataset_manifest.json","requirements.lock.txt","environment.yml",
  "Dockerfile.repro","colab_instructions.md","hpc_instructions.md",
  "annotated.gb","design.sbol.xml","validation_report.txt",
];
const CHECKLIST: [string, boolean][] = [
  ["Dataset checksum recorded", true], ["Split files recorded", true], ["Seed recorded", true],
  ["Validation-selected threshold recorded", true], ["Model revision recorded", true],
  ["Environment recorded", true], ["Git commit recorded", true],
  ["Raw dataset excluded from bundle (unless opted in)", true],
];

function ReproducePage() {
  return (
    <div>
      <PageHeader title="Reproducibility bundle" description="Everything a colleague would need to re-run this project."
        actions={<Button><Package className="h-4 w-4" /> Download complete project bundle</Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Artifacts</CardTitle></CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {FILES.map((f) => (
                  <li key={f} className="grid grid-cols-[minmax(0,1fr)_auto] items-center py-2 gap-3">
                    <span className="font-mono text-sm truncate">{f}</span>
                    <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Reproducibility checklist</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {CHECKLIST.map(([label, checked]) => (
                <label key={label} className="flex items-start gap-2 text-sm">
                  <Checkbox checked={checked} className="mt-0.5" /><span>{label}</span>
                </label>
              ))}
            </CardContent>
          </Card>
          <BeginnerBox what="A single download containing config, metrics, predictions, and instructions." why="Reproducibility means someone else can run this and get the same numbers." choose="Leave 'raw dataset excluded' checked unless you're sharing internally." />
        </div>
      </div>
    </div>
  );
}