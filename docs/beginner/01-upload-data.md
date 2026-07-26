# Upload Data

Purpose: Add the file that starts the project.

Prerequisites: CSV, TSV, FASTA, GenBank, GFF3, SBOL XML, RDF/XML, or Turtle.

Steps:

1. Choose the project goal.
2. Select the file.
3. Confirm the detected format.
4. Review warnings.
5. Continue to validation or inspection.

Expected output: An uploaded artifact record with filename, type, byte size, SHA256 checksum, and temporary location.

Common errors: FASTA has no labels, the file is too large, or the MIME type does not match a text-based biology format.

Verify success: The checksum is visible and no raw sequence content appears in project metadata.

Next step: Validate files.
