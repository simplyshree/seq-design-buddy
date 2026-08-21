import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const routeFiles = [
  "src/routes/index.tsx",
  "src/routes/tools.benchlab.tsx",
  "src/routes/tools.seqtrainer.tsx",
  "src/routes/tools.sbol-validator.tsx",
  "src/routes/tools.sbol-canvas.tsx",
  "src/routes/workflow.tsx",
  "src/routes/glossary.tsx",
  "src/routes/annotation-prompt.tsx",
];
const routeSource = routeFiles.map(read).join("\n");
const componentSource = [
  "src/components/hub/CommandBlock.tsx",
  "src/components/hub/ExternalToolLink.tsx",
  "src/components/hub/ToolCard.tsx",
]
  .map(read)
  .join("\n");

test("the homepage source defines exactly four tools in the requested order", () => {
  const content = read("src/lib/hub-content.ts");
  const ids = [...content.matchAll(/^\s+id: "([^"]+)"/gm)].map((match) => match[1]);
  assert.deepEqual(ids, ["benchlab", "seqtrainer", "validator", "canvas"]);
  assert.match(read("src/routes/index.tsx"), /TOOL_SUMMARIES\.map/);
});

test("the hub clearly disclaims uploads, compute, and tool execution", () => {
  const home = read("src/routes/index.tsx");
  assert.match(home, /does not upload files, run models/);
  assert.match(home, /Your files and models run in the original tools/);
  assert.doesNotMatch(
    routeSource,
    /Start new project|Start project|Run model|Start training|Validate now|Create project/,
  );
});

test("tool guides include source-grounded links and required annotation language", () => {
  const benchlab = read("src/routes/tools.benchlab.tsx");
  const seqtrainer = read("src/routes/tools.seqtrainer.tsx");
  const validator = read("src/routes/tools.sbol-validator.tsx");
  const canvas = read("src/routes/tools.sbol-canvas.tsx");
  assert.match(benchlab, /https:\/\/github\.com\/simplyshree\/seqtrainer-benchlab/);
  assert.match(seqtrainer, /GenBank/);
  assert.match(seqtrainer, /checkpoint/);
  assert.match(seqtrainer, /benchmark-manifest/);
  assert.match(seqtrainer, /Dummy mode checks only/);
  assert.match(seqtrainer, /annotation-mvp/);
  assert.match(seqtrainer, /annotation-sbol3-labeled-promoters/);
  assert.match(validator, /https:\/\/validator\.sbolstandard\.org/);
  assert.match(canvas, /https:\/\/sbolcanvas\.org/);
});

test("external links are safe and copy blocks do not execute commands", () => {
  const external = read("src/components/hub/ExternalToolLink.tsx");
  const command = read("src/components/hub/CommandBlock.tsx");
  assert.match(external, /target="_blank"/);
  assert.match(external, /rel="noreferrer noopener"/);
  assert.match(command, /navigator\.clipboard/);
  assert.doesNotMatch(componentSource, /child_process|exec\(|spawn\(|axios|fetch\(/);
});

test("the static hub has no file picker and no project workflow routes", () => {
  assert.doesNotMatch(routeSource, /type=["']file["']/i);
  assert.doesNotMatch(
    routeSource,
    /upload handler|server function|object storage|database|authentication/i,
  );
  for (const route of [
    "projects.new.tsx",
    "workspace.upload.tsx",
    "workspace.run.tsx",
    "workspace.annotate.tsx",
  ]) {
    assert.equal(
      existsSync(resolve(root, "src/routes", route)),
      false,
      `${route} should be removed`,
    );
  }
});

test("workflow exposes four paths and a concrete static handoff table", () => {
  const workflow = read("src/routes/workflow.tsx");
  assert.match(workflow, /WORKFLOW_STAGES\.map/);
  for (const phrase of [
    "Path A: Benchmark planning only",
    "Path B: Existing checkpoint annotation",
    "Path C: Annotation with SBOL export",
    "Path D: Visualize existing SBOL design",
    "Static file handoff table",
    "Source tool",
    "Output file",
    "Important limitation",
  ]) {
    assert.match(workflow, new RegExp(phrase));
  }
  assert.match(workflow, /Model training and checkpoint creation/);
});

test("GenBank, SBOL3, and Canvas compatibility handoffs are explicit", () => {
  const workflow = read("src/routes/workflow.tsx");
  const seqtrainer = read("src/routes/tools.seqtrainer.tsx");
  const validator = read("src/routes/tools.sbol-validator.tsx");
  const canvas = read("src/routes/tools.sbol-canvas.tsx");
  const combined = [workflow, seqtrainer, validator, canvas].join("\n");
  assert.match(combined, /annotated \.gb/);
  assert.match(combined, /predictions\.csv/);
  assert.match(combined, /annotation_manifest\.json/);
  assert.match(combined, /annotated\.nt/);
  assert.match(combined, /annotated_sbol2\.rdf/);
  assert.match(combined, /canonical SBOL3/);
  assert.match(combined, /SBOL2 RDF\/XML compatibility/);
  assert.match(canvas, /File -> Import/);
  assert.match(canvas, /Uploading \.nt instead of the \.rdf compatibility file/);
  assert.match(seqtrainer, /Do not upload the SBOL3/);
  assert.match(validator, /validation only/);
  assert.match(validator, /validation plus conversion/);
});

test("BenchLab and SeqTrainer warnings prevent beginner overclaiming", () => {
  const benchlab = read("src/routes/tools.benchlab.tsx");
  const seqtrainer = read("src/routes/tools.seqtrainer.tsx");
  assert.match(benchlab, /plan-only export/);
  assert.match(benchlab, /metrics and predictions are\s+empty/);
  assert.match(benchlab, /linear regression, random\s+forest, or gradient boosting/);
  assert.match(benchlab, /port 8001/);
  assert.match(benchlab, /port 8000/);
  assert.match(benchlab, /upload the matching dataset first/);
  assert.match(seqtrainer, /Dummy mode checks only/);
  assert.match(seqtrainer, /does not produce scientific predictions/);
  assert.match(seqtrainer, /same completed benchmark\s+run/);
  assert.match(seqtrainer, /CPU smoke check/);
  assert.match(seqtrainer, /dense DNABERT2 scans/);
});

test("the focused glossary covers SBOL and workflow vocabulary", () => {
  const glossary = read("src/lib/hub-content.ts");
  for (const term of ["Dataset", "Checkpoint", "Manifest", "SBOL", "Computational prediction"])
    assert.match(glossary, new RegExp(`"${term}"`));
  for (const term of [
    "SBOL2",
    "SBOL3",
    "RDF/XML",
    "N-Triples",
    "Sequence Ontology role",
    "Compatibility output",
    "Plan-only export",
    "Smoke test",
  ]) {
    assert.match(glossary, new RegExp(`"${term}"`));
  }
});

test("the annotation prompt is a copyable form with required benchmark fields", () => {
  const prompt = read("src/routes/annotation-prompt.tsx");
  const shell = read("src/components/hub/SiteShell.tsx");
  assert.match(shell, /Get SBOL annotation prompt/);
  assert.match(prompt, /createFileRoute\("\/annotation-prompt"\)/);
  assert.match(prompt, /Input GenBank file/);
  assert.match(prompt, /Model bundle folder/);
  assert.match(prompt, /Validation threshold/);
  assert.match(prompt, /Annotated GenBank output/);
  assert.match(prompt, /seqtrainer annotate promoters/);
  assert.match(read("src/components/hub/CommandBlock.tsx"), /navigator\.clipboard/);
  assert.match(prompt, /SBOL2 RDF\/XML output/);
  assert.match(prompt, /Optional benchmark files/);
  assert.match(prompt, /inputPath: ""/);
  assert.match(prompt, /modelBundle: ""/);
  assert.match(prompt, /Example: \{example\}/);
});

test("long command blocks wrap within their container", () => {
  const command = read("src/components/hub/CommandBlock.tsx");
  assert.match(command, /whitespace-pre-wrap/);
  assert.match(command, /break-words/);
  assert.doesNotMatch(command, /overflow-x-auto/);
});

test("the homepage exposes the attached educational guide", () => {
  const home = read("src/routes/index.tsx");
  const shell = read("src/components/hub/SiteShell.tsx");
  assert.match(home, /View educational guide/);
  assert.match(home, /seq-trainer-educational-guide\.pptx/);
  assert.match(shell, /Get educational guide/);
  assert.match(shell, /href="\/seq-trainer-educational-guide\.pptx"/);
  assert.equal(
    existsSync(resolve(root, "public/seq-trainer-educational-guide.pptx")),
    true,
    "the educational guide should be available as a public asset",
  );
});

test("the document head uses the supplied SBOL logo favicon", () => {
  const rootRoute = read("src/routes/__root.tsx");
  assert.match(rootRoute, /href: "\/favicon\.png\?v=sbol-20260821"/);
  assert.match(rootRoute, /type: "image\/png"/);
  assert.equal(existsSync(resolve(root, "public/favicon.png")), true);
});

test("build source stays static and credential-free", () => {
  const buildRelevant = [
    "package.json",
    "vite.config.ts",
    "src/routes/index.tsx",
    "src/routes/workflow.tsx",
    "src/routes/tools.benchlab.tsx",
    "src/routes/tools.seqtrainer.tsx",
    "src/routes/tools.sbol-validator.tsx",
    "src/routes/tools.sbol-canvas.tsx",
  ]
    .map(read)
    .join("\n");
  assert.doesNotMatch(
    buildRelevant,
    /process\.env|import\.meta\.env|API_KEY|TOKEN|SECRET|PASSWORD/,
  );
  assert.doesNotMatch(buildRelevant, /axios|fetch\(|createServerFn|server loader|upload handler/i);
});
