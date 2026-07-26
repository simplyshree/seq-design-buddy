# Reproduce Run

Purpose: Package enough information for another person to repeat the work.

Prerequisites: Available configs, manifests, metrics, validation reports, and guides.

Steps:

1. Review included files.
2. Keep raw datasets excluded by default.
3. Opt in only if raw data can be shared.
4. Generate the bundle.
5. Read the project summary.

Expected output: A reproducibility bundle and summary.

Common errors: Accidentally sharing raw datasets, missing checksums, or omitting software versions.

Verify success: The summary lists inputs, checksums, split policy, model, threshold, metrics, export status, commits, and limitations.

Next step: Archive or start another project.
