# Annotate Promoters

Purpose: Use a trained model to mark computational promoter predictions in GenBank.

Prerequisites: GenBank input, selected model, checkpoint, benchmark manifest, and threshold.

Steps:

1. Choose the GenBank file.
2. Select model family and checkpoint.
3. Use the validation-selected threshold by default.
4. Set window, step, strand, topology, and merge settings.
5. Generate outputs.

Expected output: Annotated GenBank, predictions CSV, and annotation manifest.

Common errors: Checkpoint and manifest mismatch, replacing known annotations, or presenting predictions as experimentally validated.

Verify success: New features are labeled computational predictions.

Next step: Export SBOL.
