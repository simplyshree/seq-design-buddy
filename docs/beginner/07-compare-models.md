# Compare Models

Purpose: Read model results scientifically.

Prerequisites: Completed or skipped model runs with artifact records.

Steps:

1. Confirm every completed model used the same split files.
2. Sort by MCC and AUPRC first.
3. Review AUROC, accuracy, balanced accuracy, precision, recall, specificity, F1, and confusion matrix.
4. Keep skipped runs visible.
5. Do not invent missing metrics.

Expected output: A comparison report.

Common errors: Ranking by accuracy on imbalanced data or hiding skipped heavy models.

Verify success: Missing metrics are blank or skipped, never filled with fake values.

Next step: Annotate promoters.
