# Seq Design Buddy Link Audit

Audit date: 2026-08-21  
Scope: source links, public assets, route links, commands, and external destinations in the live production baseline.

## External destinations

All external HTTPS destinations below returned HTTP 200 during the audit, including the branch-specific SeqTrainer paths in the linked `simplyshree/SeqTrainer` fork.

| Destination | Result | Notes |
| --- | --- | --- |
| `https://github.com/simplyshree/seqtrainer-benchlab` | Pass | Repository exists |
| BenchLab `main` README | Pass | Repository setup and capability source |
| BenchLab `main` `docs/intro_manual.md` | Pass | Beginner/advanced workflow source |
| `https://github.com/simplyshree/SeqTrainer` | Pass | Linked fork |
| SeqTrainer `annotation-mvp` tree | Pass | Fork-specific annotation source |
| SeqTrainer annotation README | Pass | Fork-specific quickstart |
| SeqTrainer promoter annotation plan | Pass | Fork-specific detail |
| SeqTrainer `annotation-sbol3-labeled-promoters` tree | Pass | Fork-specific export source |
| SeqTrainer SBOL3 export guide | Pass | SBOL3/SBOL2 compatibility source |
| `https://github.com/SynBioDex/SBOL-Validator` | Pass | Official source; current default branch is `master` |
| `https://validator.sbolstandard.org` | Pass | Official web application |
| `https://synbiodex.github.io/SBOL-Validator/` | Pass | API documentation destination |
| `https://github.com/SynBioDex/SBOLCanvas` | Pass | Official source; supported branch is `final` |
| `https://sbolcanvas.org` | Pass | Standalone Canvas application |
| `https://github.com/simplyshree/seq-design-buddy` | Pass | This repository |

## Local links and assets

The route inventory and build output cover `/`, `/tools/benchlab`, `/tools/seqtrainer`,
`/tools/sbol-validator`, `/tools/sbol-canvas`, `/workflow`, `/glossary`, and
`/annotation-prompt`. The public educational guide and supplied SBOL logo favicon both
exist in `public/` and are included by the build.

## Link risks

- GitHub branch pages can remain reachable while their contents evolve. The displayed
  branch and commit provenance must remain visible near branch-specific instructions.
- The external web tools are not controlled by this repository. A reachable homepage does
  not prove that a particular upload, conversion, or import succeeds.
- Commands contain local paths and environment assumptions. They are copyable examples,
  not guarantees of a user's installed environment.
- `localhost` and `127.0.0.1` strings are valid only as local instructions and must not be
  treated as deployed service links.

## Verification method

1. Extract all external URLs from source files.
2. Check each destination with an HTTP request and record status.
3. Verify repository branch names and commits with `git ls-remote`.
4. Verify local route and asset existence from the source tree and production build.
5. Add automated source-integrity checks for accidental placeholders, personal paths,
   insecure external links, missing assets, and required route coverage.
