# Run Colab

Purpose: Use a notebook runtime for model work that does not belong in the web app.

Prerequisites: A benchmark plan, staged dataset, and an existing notebook path from the selected branch.

Steps:

1. Open only a notebook that exists in the selected branch.
2. Run installation cells.
3. Upload or mount the dataset and config.
4. Run benchmark commands.
5. Download artifacts.
6. Run the final disconnect cell after saving artifacts.

Expected output: Metrics, predictions, manifests, and optional checkpoints.

Common errors: Notebook path does not exist, dataset not uploaded, or runtime disconnects before artifacts are saved.

Verify success: Downloaded files include metrics and manifest artifacts.

Next step: Compare models.
