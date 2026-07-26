# Create Benchmark

Purpose: Build a fair model comparison plan.

Prerequisites: A labeled dataset summary.

Steps:

1. Use the same train, validation, and test files for every model.
2. Select MCC and AUPRC as primary metrics.
3. Reserve test data for final reporting only.
4. Choose model families.
5. Save the benchmark plan.

Expected output: `benchmark_plan.json` or equivalent project plan data.

Common errors: Tuning on test data, comparing models on different splits, or treating skipped runs as failed metrics.

Verify success: The plan states the split policy and threshold source.

Next step: Run in Colab or HPC when heavy models are selected.
