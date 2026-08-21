import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const sourceFiles = [
  "README.md",
  "src/lib/hub-content.ts",
  "src/routes/index.tsx",
  "src/routes/tools.benchlab.tsx",
  "src/routes/tools.seqtrainer.tsx",
  "src/routes/tools.sbol-validator.tsx",
  "src/routes/tools.sbol-canvas.tsx",
  "src/routes/workflow.tsx",
  "src/routes/glossary.tsx",
  "src/routes/annotation-prompt.tsx",
  "src/components/hub/SiteShell.tsx",
].map(read);
const source = sourceFiles.join("\n");

test("all public guide routes and assets are present", () => {
  for (const route of [
    "src/routes/index.tsx",
    "src/routes/tools.benchlab.tsx",
    "src/routes/tools.seqtrainer.tsx",
    "src/routes/tools.sbol-validator.tsx",
    "src/routes/tools.sbol-canvas.tsx",
    "src/routes/workflow.tsx",
    "src/routes/glossary.tsx",
    "src/routes/annotation-prompt.tsx",
  ]) {
    assert.equal(existsSync(resolve(root, route)), true, "missing route: " + route);
  }
  for (const asset of ["public/favicon.png", "public/seq-trainer-educational-guide.pptx"]) {
    assert.equal(existsSync(resolve(root, asset)), true, "missing asset: " + asset);
  }
});

test("external links use HTTPS and contain no placeholder destination", () => {
  const hrefs = [...source.matchAll(/(?:href|website)\s*[:=]\s*["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(hrefs.length > 0);
  for (const href of hrefs.filter((href) => href.startsWith("http"))) {
    assert.match(href, /^https:\/\//, href);
    assert.doesNotMatch(href, /example\.com|your-domain|TODO/i, href);
  }
  assert.doesNotMatch(source, /href\s*=\s*["']http:\/\/(?:localhost|127\.0\.0\.1)/i);
});

test("published instructions contain no personal machine paths", () => {
  assert.doesNotMatch(source, /C:\\Users\\Sgoff|MYfile|PYThh/i);
});

test("static-only boundaries remain explicit", () => {
  assert.match(source, /does not upload files/i);
  assert.match(source, /does not .*run models/i);
  assert.doesNotMatch(source, /createServerFn|child_process|spawn\(|exec\(|fetch\(/i);
});

test("branch-specific source snapshots are named where they are used", () => {
  const seqtrainer = read("src/routes/tools.seqtrainer.tsx");
  assert.match(seqtrainer, /192fa76/);
  assert.match(seqtrainer, /d787cfa/);
  assert.match(seqtrainer, /not the current\s+default\s+branch/i);
  assert.match(read("src/routes/tools.sbol-canvas.tsx"), /final/);
});
