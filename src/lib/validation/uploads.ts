import { createHash } from "node:crypto";
import type { BiologicalFileType, WorkflowStepId } from "../domain/types";

const EXTENSIONS: Record<string, BiologicalFileType> = {
  ".csv": "csv",
  ".tsv": "tsv",
  ".fa": "fasta",
  ".fasta": "fasta",
  ".fna": "fasta",
  ".gb": "genbank",
  ".gbk": "genbank",
  ".genbank": "genbank",
  ".gff": "gff3",
  ".gff3": "gff3",
  ".xml": "sbol-xml",
  ".sbol": "sbol-xml",
  ".rdf": "rdf-xml",
  ".ttl": "turtle",
};

const TEXT_MIME_ALLOWLIST = new Set([
  "text/csv",
  "text/tab-separated-values",
  "text/plain",
  "application/xml",
  "text/xml",
  "application/rdf+xml",
  "text/turtle",
  "application/octet-stream",
  "",
]);

export type UploadInspection = {
  filename: string;
  extensionType: BiologicalFileType;
  detectedType: BiologicalFileType;
  sha256: string;
  byteSize: number;
  warnings: string[];
  recommendedNextStep: WorkflowStepId;
};

export function sha256Hex(data: string | Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

export function sanitizeFilename(filename: string): string {
  const base = filename.replace(/\\/g, "/").split("/").pop() || "upload";
  const sanitized = base.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
  return sanitized === "." || sanitized === ".." || sanitized.length === 0 ? "upload" : sanitized;
}

export function fileTypeFromName(filename: string): BiologicalFileType {
  const lower = filename.toLowerCase();
  const extension = Object.keys(EXTENSIONS)
    .sort((a, b) => b.length - a.length)
    .find((ext) => lower.endsWith(ext));
  return extension ? EXTENSIONS[extension] : "unknown";
}

export function validateUploadBasics(input: {
  filename: string;
  mimeType?: string;
  byteSize: number;
  maxBytes: number;
}): string[] {
  const warnings: string[] = [];
  if (fileTypeFromName(input.filename) === "unknown") warnings.push("Unsupported file extension.");
  if (input.byteSize > input.maxBytes) warnings.push(`File exceeds the configured ${input.maxBytes} byte limit.`);
  if (!TEXT_MIME_ALLOWLIST.has(input.mimeType || "")) warnings.push(`Unexpected MIME type: ${input.mimeType}.`);
  return warnings;
}

export function detectBiologicalFormat(filename: string, sample: string): BiologicalFileType {
  const byName = fileTypeFromName(filename);
  const lower = filename.toLowerCase();
  const trimmed = sample.trimStart();
  if (trimmed.startsWith(">")) return "fasta";
  if (/^LOCUS\s+/m.test(sample) || /^FEATURES\s+/m.test(sample)) return "genbank";
  if (/^##gff-version\s+3/m.test(sample)) return "gff3";
  if (trimmed.includes("@prefix") || trimmed.includes(" a ")) return byName === "turtle" ? "turtle" : byName;
  if (trimmed.includes("<rdf:RDF") || trimmed.includes("http://sbols.org") || trimmed.includes("https://sbols.org")) {
    return byName === "rdf-xml" ? "rdf-xml" : "sbol-xml";
  }
  if (lower.endsWith(".xml")) return "unknown";
  return byName;
}

export function recommendNextStep(type: BiologicalFileType, hasLabels = false): WorkflowStepId {
  if ((type === "csv" || type === "tsv") && hasLabels) return "inspect";
  if (type === "fasta") return "inspect";
  if (type === "genbank") return "validate";
  if (type === "gff3" || type === "sbol-xml" || type === "rdf-xml" || type === "turtle") return "validate";
  return "upload";
}

export function inspectUpload(input: {
  filename: string;
  mimeType?: string;
  data: string | Uint8Array;
  sampleText: string;
  maxBytes: number;
  hasLabels?: boolean;
}): UploadInspection {
  const bytes = typeof input.data === "string" ? Buffer.byteLength(input.data) : input.data.byteLength;
  const extensionType = fileTypeFromName(input.filename);
  const detectedType = detectBiologicalFormat(input.filename, input.sampleText);
  const warnings = validateUploadBasics({
    filename: input.filename,
    mimeType: input.mimeType,
    byteSize: bytes,
    maxBytes: input.maxBytes,
  });
  if (detectedType === "fasta" && !input.hasLabels) {
    warnings.push("FASTA does not include labels by itself; supervised classification needs labels supplied separately.");
  }
  return {
    filename: sanitizeFilename(input.filename),
    extensionType,
    detectedType,
    sha256: sha256Hex(input.data),
    byteSize: bytes,
    warnings,
    recommendedNextStep: recommendNextStep(detectedType, input.hasLabels),
  };
}
