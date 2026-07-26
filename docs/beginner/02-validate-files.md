# Validate Files

Purpose: Check whether design files are readable and compatible with downstream tools.

Prerequisites: A GenBank, GFF3, SBOL XML, RDF/XML, Turtle, or other supported design artifact.

Steps:

1. Choose the artifact.
2. Run validation through the server-side validator adapter.
3. Read errors first, then warnings.
4. Convert format only when needed.
5. Save the validation report.

Expected output: A validation report and, when requested, a converted artifact.

Common errors: Invalid RDF/XML, unsupported SBOL version, missing sequence, or unavailable validator service.

Verify success: The report says valid or clearly explains why it is invalid.

Next step: Inspect the dataset or design.
