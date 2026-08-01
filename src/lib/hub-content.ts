import type { ComponentType } from "react";
import { FlaskConical, Palette, ShieldCheck, Table2 } from "lucide-react";

export type ToolId = "benchlab" | "seqtrainer" | "validator" | "canvas";

export type ToolSummary = {
  id: ToolId;
  name: string;
  purpose: string;
  when: string;
  avoid: string;
  input: string;
  output: string;
  runs: string;
  status: string;
  href: string;
  website?: string;
  icon: ComponentType<{ className?: string }>;
  primary?: boolean;
};

export const TOOL_SUMMARIES: ToolSummary[] = [
  {
    id: "benchlab",
    name: "SeqTrainer BenchLab",
    purpose:
      "Inspect labeled DNA datasets, plan a benchmark, run small baselines, and export reproducibility files.",
    when: "Use it first when you need to understand a labeled CSV/TSV or prepare a benchmark plan.",
    avoid: "Do not use it as a DNABERT2, iPro-MP, GPU, or HPC runner.",
    input: "Labeled CSV or TSV with sequence and label columns.",
    output: "run_config.json, benchmark_plan.json, manifests, and optional baseline metrics.",
    runs: "Your local computer; heavy training happens separately.",
    status: "Local web app, not part of this site.",
    href: "https://github.com/simplyshree/seqtrainer-benchlab",
    icon: Table2,
    primary: true,
  },
  {
    id: "seqtrainer",
    name: "SeqTrainer",
    purpose:
      "Run sequence model workflows and scan GenBank plasmids for computationally predicted promoters.",
    when: "Use it when you have a compatible checkpoint and want to annotate a plasmid or run a benchmark.",
    avoid: "Do not use dummy mode for scientific conclusions.",
    input: "GenBank plasmid, model checkpoint, and benchmark manifest for annotation.",
    output:
      "Annotated GenBank, predictions CSV, annotation manifest, and branch-specific SBOL files.",
    runs: "Local Python, Google Colab, or HPC, depending on the model.",
    status: "External Python project; this site only documents commands.",
    href: "https://github.com/simplyshree/SeqTrainer",
    icon: FlaskConical,
    primary: true,
  },
  {
    id: "validator",
    name: "SBOL Validator",
    purpose: "Check SBOL and related biological files and convert between supported formats.",
    when: "Use it after producing an SBOL design and before opening that design in Canvas.",
    avoid: "Do not treat it as a simulator or a model quality checker.",
    input: "SBOL, GenBank, FASTA, or GFF3 file, depending on the supported Validator version.",
    output: "Validation messages and, when requested, a converted file.",
    runs: "The official external Validator website.",
    status: "External web tool; no files pass through this site.",
    href: "https://github.com/SynBioDex/SBOL-Validator",
    website: "https://validator.sbolstandard.org",
    icon: ShieldCheck,
  },
  {
    id: "canvas",
    name: "SBOL Canvas",
    purpose: "View and edit genetic designs using SBOL symbols and visual glyphs.",
    when: "Use it as the final visualization step after validating an SBOL file.",
    avoid: "Do not upload SeqTrainer's SBOL3 .nt file when the Canvas workflow expects SBOL2 .rdf.",
    input: "A validated SBOL2 RDF/XML .rdf compatibility file imported through Canvas itself.",
    output: "A visual design that you save or export from Canvas.",
    runs: "The separate SBOL Canvas application.",
    status: "External design application; layout may need manual inspection.",
    href: "https://github.com/SynBioDex/SBOLCanvas",
    website: "https://sbolcanvas.org",
    icon: Palette,
  },
];

export const WORKFLOW_STAGES = [
  {
    number: "01",
    title: "Plan and benchmark",
    tool: "SeqTrainer BenchLab",
    input: "Labeled CSV or TSV",
    activities:
      "Inspect columns, class balance, preprocessing, and verified lightweight baselines.",
    output: "run_config.json, benchmark_plan.json, manifests, and optional metrics/predictions.",
    href: "/tools/benchlab",
  },
  {
    number: "02",
    title: "Annotate a plasmid",
    tool: "SeqTrainer",
    input: "GenBank plasmid, checkpoint, and benchmark manifest",
    activities:
      "Scan sequence windows, score possible promoters, preserve existing features, and add predicted features.",
    output: "Annotated .gb, predictions.csv, and annotation_manifest.json.",
    href: "/tools/seqtrainer",
  },
  {
    number: "03",
    title: "Validate the design",
    tool: "SBOL Validator",
    input: "SBOL .nt/.rdf, GenBank, FASTA, or GFF3 file",
    activities: "Validate only, or validate and convert using the official Validator.",
    output: "Validation report and optional converted file.",
    href: "/tools/sbol-validator",
  },
  {
    number: "04",
    title: "Visualize the design",
    tool: "SBOL Canvas",
    input: "SBOL2 RDF/XML .rdf file for the SeqTrainer Canvas handoff",
    activities: "Import through File -> Import, inspect glyphs, and edit or export in Canvas.",
    output: "A visual genetic design.",
    href: "/tools/sbol-canvas",
  },
] as const;

export const GLOSSARY = [
  ["Dataset", "A collection of examples, such as DNA sequences and their labels."],
  ["DNA sequence", "The A, C, G, and T letters that describe a biological sequence."],
  ["Label", "The target value attached to a sequence, such as promoter (1) or non-promoter (0)."],
  ["Benchmark", "A repeatable comparison of model approaches using the same data policy."],
  ["Benchmark plan", "A saved description of what you intend to run, even before model training."],
  ["Baseline model", "A simple reference model used to establish a starting point."],
  ["Train set", "Data used to fit model parameters."],
  [
    "Validation set",
    "Data used to choose settings or thresholds without touching the final test report.",
  ],
  ["Test set", "Held-back data reserved for final reporting."],
  ["Threshold", "A score cutoff used to turn a model score into a predicted class."],
  ["MCC", "Matthews correlation coefficient, a balanced metric for binary classification."],
  ["AUPRC", "Area under the precision-recall curve, useful when classes are imbalanced."],
  ["Checkpoint", "Saved model weights that can be reused for prediction or annotation."],
  ["Manifest", "A metadata file recording inputs, settings, provenance, and outputs."],
  ["GenBank", "A sequence file format that can hold a sequence and annotated biological features."],
  ["FASTA", "A simple sequence format that usually contains sequences but not supervised labels."],
  ["SBOL", "A standard for representing synthetic biology designs and their relationships."],
  ["SBOL2", "Version 2 of SBOL; SBOL Canvas commonly uses SBOL2 RDF/XML for visual import."],
  ["SBOL3", "Version 3 of SBOL; SeqTrainer's .nt export is the canonical machine-readable result."],
  ["RDF/XML", "An RDF serialization commonly saved as .rdf or .xml."],
  ["N-Triples", "A line-based RDF serialization commonly saved as .nt."],
  [
    "Sequence Ontology role",
    "A standard term that tells SBOL tools what kind of biological feature an item is.",
  ],
  [
    "Predicted promoter",
    "A promoter-like region proposed by a computational model, not confirmed by wet-lab evidence.",
  ],
  [
    "Compatibility output",
    "A second file written to help another tool import the design, even when it is not the canonical output.",
  ],
  [
    "Plan-only export",
    "A BenchLab export made without training; metrics or predictions can be empty.",
  ],
  [
    "Smoke test",
    "A quick check that the command and file-writing path work, not proof of scientific accuracy.",
  ],
  ["Promoter", "A DNA region involved in starting transcription."],
  [
    "Computational prediction",
    "A model-based result that still needs biological interpretation and validation.",
  ],
  ["Plasmid", "A circular or linear DNA molecule used to carry a genetic design."],
  ["Colab", "Google's hosted notebook environment, often used for GPU model runs."],
  ["HPC", "A high-performance computing system used for larger or longer jobs."],
] as const;
