# Inspect Dataset

Purpose: Decide whether the input can support supervised benchmarking.

Prerequisites: A CSV/TSV dataset or sequence artifact.

Steps:

1. Detect sequence columns.
2. Detect label columns.
3. Count classes.
4. Summarize sequence lengths.
5. Read imbalance and metadata warnings.

Expected output: A dataset summary.

Common errors: No label column, only FASTA records, duplicate sequences, or strong class imbalance.

Verify success: The summary identifies both sequence and label columns for supervised classification.

Next step: Create a benchmark.
