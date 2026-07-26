import type { BenchmarkPlan, ModelFamily } from "../domain/types";

const COMMANDS: Record<ModelFamily, string[]> = {
  "cnn-reference": ["python", "-m", "seqtrainer.benchmarks.cnn"],
  "cnn-v2": ["python", "-m", "seqtrainer.benchmarks.cnn_v2"],
  "dnabert2-frozen": ["python", "-m", "seqtrainer.benchmarks.dnabert2_frozen"],
  "dnabert2-finetune": ["python", "-m", "seqtrainer.benchmarks.dnabert2_finetune"],
  "ipro-mp-external": ["python", "-m", "seqtrainer.external.ipro_mp_prepare"],
};

export type SafeCommand = { executable: string; args: string[]; cwd: string; outputDir: string };

export function buildSafeSeqTrainerCommand(input: {
  repoPath: string;
  allowlistedRepoPaths: string[];
  outputDir: string;
  plan: BenchmarkPlan;
  modelFamily: ModelFamily;
}): SafeCommand {
  if (!input.allowlistedRepoPaths.includes(input.repoPath)) {
    throw new Error("SeqTrainer repository path is not allowlisted.");
  }
  if (!input.plan.modelFamilies.includes(input.modelFamily)) {
    throw new Error("Requested model is not present in the validated benchmark plan.");
  }
  const [executable, ...baseArgs] = COMMANDS[input.modelFamily];
  return {
    executable,
    args: [
      ...baseArgs,
      "--plan-json",
      `${input.outputDir}/benchmark_plan.json`,
      "--output-dir",
      input.outputDir,
    ],
    cwd: input.repoPath,
    outputDir: input.outputDir,
  };
}
