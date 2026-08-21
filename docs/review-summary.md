# Seq Design Buddy Review Summary

## Scope

This review covers the static educational hub currently deployed at
`https://seq-design-buddy.vercel.app/`. The review preserves its purpose: helping a
beginner understand how BenchLab, SeqTrainer, SBOL Validator, and SBOL Canvas relate.
It does not add uploads, databases, model execution, scientific claims, or backend services.

## Baseline

- Production branch configured in Vercel: `main`.
- Live deployment commit: `01fff809cbf3dde948077e44b36960479025311e`.
- Deployment metadata ref: `agent/vercel-hosting`.
- Audit branch: `audit/design-buddy-professional-review`.
- Baseline `npm run lint`: pass.
- Baseline `npm test`: pass, 14 tests.
- Baseline `npm run build`: pass.

The production preview command starts but the current TanStack preview plugin looks for an
absent dist/server/server.js. Browser smoke testing therefore used the supported Vite dev
server at http://127.0.0.1:4174/.

## Findings

### High priority

- Branch-specific SeqTrainer instructions need explicit fork/branch provenance because
  they are not the official repository's current default workflow.
- The static site must keep external-service boundaries obvious: no claims that this hub
  uploads, validates, trains, annotates, or renders files itself.

### Medium priority

- Long command examples need to remain readable at narrow widths and copyable without
  horizontal page overflow.
- Beginner users need a stronger distinction between plan-only output, dummy smoke tests,
  real model results, validation diagnostics, and visual design review.
- Every external link should have a reliable destination and every local route/asset should
  be covered by an integrity test.

### Low priority

- Improve heading hierarchy, focus visibility, status text, and responsive spacing where
  changes do not alter the educational content.
- Keep examples outside blank user input fields on the annotation prompt page.

## Review boundary

The proposed implementation is limited to evidence-backed content labels, link reliability,
accessibility, responsive presentation, and automated integrity checks. It will not merge
into `main`, change the Vercel production configuration, or replace the static hub with a
workflow application.
