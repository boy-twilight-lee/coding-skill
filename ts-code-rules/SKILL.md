---
name: ts-code-rules
description: "Apply mandatory TypeScript rules when editing or reviewing TypeScript, TSX, or TypeScript inside Vue SFCs."
---

# TypeScript Code Rules

These rules are mandatory for changed or reviewed TypeScript; existing code does not waive them. Fix directly affected violations without migrating unrelated code. Higher-priority instructions prevail; project overrides apply only where a rule permits them. Report unavoidable conflicts and keep deviations minimal.

Keep positive and negative examples free of nonessential comments. Retain comments only to demonstrate a comment rule, spacing/placement, or an essential non-obvious constraint; put other explanations outside code fences. This presentation policy does not waive project-code comment coverage.

## Core Rules

1. Limit changes to the requested behavior and directly affected code. Preserve existing comments, public contracts, and user edits; avoid unrelated cleanup, renaming, formatting, or import reordering.
2. Keep simple one-use logic inline. Extract for real complexity, reuse, or an independent responsibility. Remove change-owned dead code, debugging, pass-through wrappers, meaningless intermediates, and caller-guaranteed guards.
3. Add concise Chinese business comments for major state, configuration, constants, functions, handlers, domain contracts, important fields, and key processing stages. Clear names do not waive coverage. Keep comments adjacent and supported by verified behavior; avoid mechanical narration and structures created only to hold comments.
4. Use blank lines only between genuinely separate logical regions. Never use consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
5. Order imports as third-party runtime, types, internal runtime, then UI modules; local types precede shared types. Prefer standard imports when type-only usage is safely erased. Use separate `import type` only when verified tooling or runtime contracts require it; never use inline `type` modifiers.
6. Use configured aliases and public entries across module boundaries. Do not climb two or more parent directories or reach into another owner's private implementation. Barrels re-export public declarations without business implementation.
7. Follow established source-layer ownership. Keep private constants, types, helpers, and state with their owner until real cross-owner reuse or an application-wide contract warrants promotion. Follow `vue-code-rules` for Vue owner structure.
8. Prefer `await` for ordinary sequential flow. Keep dependencies sequential; use `Promise.all` only for independent work with an intended shared failure boundary. Never discard a Promise with unary `void`; intentional background work owns its rejection path.
9. Catch only where the error can be recovered, translated, enriched, or reported; otherwise propagate it. Read the guaranteed `error.message` directly without narrowing or fallback branches.
10. Set operation-owned loading before the request and restore it through `finally`. Commit related response state without accidental partial updates; progressive commits require an intentional UI contract.
11. Verify new runtime APIs against actual TypeScript, runtime, browser, and polyfill targets. Transpilation does not supply missing runtime APIs.
12. Format only changed files. Restore unrelated formatter churn from the pre-format content, preserve user edits, and review the final diff. Report checks blocked by untouched legacy formatting.

## Required Reference Loading

After repository inspection and before implementation or review decisions, open and fully read every matching reference, including uncertain matches. Every task must read at least one; if none matches, read the closest. Each rule owns one reference. References are mandatory; mentioning or summarizing them does not replace reading them.

- Rule 1: Read [Change Scope](references/change-scope.md) for affected lines, public contracts, or preservation of existing work.
- Rule 2: Read [Abstraction and Cleanup](references/abstraction-and-cleanup.md) for extraction, simplification, dead code, wrappers, intermediates, or guards.
- Rule 3: Read [Business Comments](references/business-comments.md) for declaration, contract, callback, or processing-stage comments and example-comment policy.
- Rule 4: Read [Blank Lines](references/blank-lines.md) for declaration, statement, type-member, or JSX whitespace.
- Rule 5: Read [Imports](references/imports.md) for import order, type syntax, or compiler/bundler import behavior.
- Rule 6: Read [Public Entries](references/public-entries.md) for cross-module paths, aliases, exports, or barrels.
- Rule 7: Read [Application Architecture](references/application-architecture.md) for source layers, private helpers/types, services, stores, or shared utilities.
- Rule 8: Read [Async Flow](references/async-flow.md) for await, dependencies, parallel work, or unawaited operations.
- Rule 9: Read [Error Handling](references/error-handling.md) for catch ownership, rejection/cancellation policy, or error messages.
- Rule 10: Read [Loading and State](references/loading-state.md) for loading lifecycle, cleanup, response merging, or related state commits.
- Rule 11: Read [Runtime Compatibility](references/runtime-compatibility.md) for new APIs, target support, fallbacks, or polyfills.
- Rule 12: Read [Formatting and Review](references/formatting.md) for targeted formatting, restoration of unrelated changes, or final verification.

## Working Process

1. Inspect repository instructions, affected modules and callers, nearby types, and active TypeScript, build, runtime, lint, formatter, and test configuration.

2. Apply `vue-code-rules` to Vue SFCs and `css-code-rules` when changing their styles.

3. Check changed lines against applicable rules and reference checklists. Run targeted formatter, type-check, lint, or tests without rewriting unrelated files. Report unmet rules and unavailable or failed checks; compilation or formatting alone does not prove compliance.
