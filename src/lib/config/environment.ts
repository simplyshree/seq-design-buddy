export type IntegrationMode = "disabled" | "mock" | "remote" | "self_hosted" | "instructions" | "local" | "external";

export type WorkspaceEnvironment = {
  benchlabBaseUrl?: string;
  benchlabMode: "disabled" | "mock" | "remote";
  seqtrainerRepoPath?: string;
  seqtrainerMode: "disabled" | "instructions" | "local";
  sbolValidatorBaseUrl?: string;
  sbolValidatorMode: "disabled" | "remote" | "self_hosted" | "mock";
  sbolCanvasUrl?: string;
  sbolCanvasMode: "disabled" | "external" | "self_hosted";
  uploadMaxBytes: number;
  tempRetentionHours: number;
};

function pick<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function readWorkspaceEnvironment(env: Record<string, string | undefined>): WorkspaceEnvironment {
  return {
    benchlabBaseUrl: env.BENCHLAB_BASE_URL,
    benchlabMode: pick(env.BENCHLAB_INTEGRATION_MODE, ["disabled", "mock", "remote"], "mock"),
    seqtrainerRepoPath: env.SEQTRAINER_REPO_PATH,
    seqtrainerMode: pick(env.SEQTRAINER_INTEGRATION_MODE, ["disabled", "instructions", "local"], "instructions"),
    sbolValidatorBaseUrl: env.SBOL_VALIDATOR_BASE_URL,
    sbolValidatorMode: pick(env.SBOL_VALIDATOR_MODE, ["disabled", "remote", "self_hosted", "mock"], "mock"),
    sbolCanvasUrl: env.SBOL_CANVAS_URL || "https://sbolcanvas.org",
    sbolCanvasMode: pick(env.SBOL_CANVAS_MODE, ["disabled", "external", "self_hosted"], "external"),
    uploadMaxBytes: Number(env.WORKSPACE_UPLOAD_MAX_BYTES || 25 * 1024 * 1024),
    tempRetentionHours: Number(env.WORKSPACE_TEMP_RETENTION_HOURS || 24),
  };
}
