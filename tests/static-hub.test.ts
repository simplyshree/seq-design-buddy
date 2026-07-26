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
];
const routeSource = routeFiles.map(read).join("\n");

test("the homepage source defines exactly four tools in the requested order", () => {
  const content = read("src/lib/hub-content.ts");
  const ids = [...content.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ["benchlab", "seqtrainer", "validator", "canvas"]);
  assert.match(read("src/routes/index.tsx"), /TOOL_SUMMARIES\.map/);
});

test("the hub clearly disclaims uploads, compute, and tool execution", () => {
  const home = read("src/routes/index.tsx");
  assert.match(home, /does not upload files, run models/);
  assert.match(home, /Your files and models run in the original tools/);
  assert.doesNotMatch(routeSource, /Start new project|Start project|Run model|Start training/);
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
  assert.match(validator, /https:\/\/validator\.sbolstandard\.org/);
  assert.match(canvas, /https:\/\/sbolcanvas\.org/);
});

test("external links are safe and copy blocks do not execute commands", () => {
  const external = read("src/components/hub/ExternalToolLink.tsx");
  const command = read("src/components/hub/CommandBlock.tsx");
  assert.match(external, /target="_blank"/);
  assert.match(external, /rel="noreferrer noopener"/);
  assert.match(command, /navigator\.clipboard/);
  assert.doesNotMatch(command, /fetch\(|child_process|exec\(/);
});

test("the static hub has no file picker and no project workflow routes", () => {
  assert.doesNotMatch(routeSource, /type=["']file["']/i);
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

test("the four-stage workflow and focused glossary are present", () => {
  const workflow = read("src/routes/workflow.tsx");
  const glossary = read("src/lib/hub-content.ts");
  assert.match(workflow, /WORKFLOW_STAGES\.map/);
  assert.match(workflow, /Model training and checkpoint creation/);
  for (const term of ["Dataset", "Checkpoint", "Manifest", "SBOL", "Computational prediction"])
    assert.match(glossary, new RegExp(`"${term}"`));
});
