---
name: ts-code-rules
description: "Apply mandatory TypeScript rules when editing or reviewing TypeScript, TSX, or TypeScript inside Vue SFCs."
---

# TypeScript Code Rules

Apply every rule relevant to the TypeScript or TSX created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Each numbered core rule maps to exactly one reference. Related rules are grouped below for discovery; each reference owns one independently routed concern and may keep closely related subrules together. Core summaries are a safety baseline, not a substitute for loading the matching references.

In examples, `<zh: ...>` marks placeholder content for a Chinese comment. Replace the marker with concise Chinese text when the surrounding rule calls for that comment; never copy the marker into project code. Required business documentation still applies when identifiers are clear; omit only comments that add no responsibility, scope, contract, or rule information.

## Required Reference Loading

After the initial repository inspection and before making implementation or review judgments, map every affected concern to the grouped core rules below and read each matching reference in full. Match all affected concerns, not just the task's primary topic. Every task covered by this skill must open at least one reference; when no specific route seems to match, read Change Scope. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background. Group headings organize discovery and do not require loading unrelated references in the same group.

## Core Rules

### Code Quality

1. **Change scope** — Keep changes limited to the requested feature or defect. Preserve existing comments and avoid unrelated reformatting, renaming, import reordering, or cleanup. Read [Change Scope](references/change-scope.md) when deciding affected lines, cleanup boundaries, or preservation of existing work.
2. **Abstraction and cleanup** — Keep simple one-off logic inline; extract only for real complexity, reuse, or a clear responsibility boundary. Remove change-owned dead code and redundant wrappers, aliases, intermediates, and guards. Read [Abstraction and Change-Owned Cleanup](references/abstraction-and-cleanup.md) when extracting, simplifying, deleting, or assessing redundant code.
3. **Chinese business documentation** — Document major state, configuration, constants, business functions, methods, composables, handlers, domain types, important contract fields, and key processing stages or branches. Clear names do not waive coverage. Keep comments concise, adjacent, and supported by verified contracts; related declarations may share one comment, while imports, disposable locals, obvious accessors, and mechanical callbacks need no narration. Read [Chinese Business Documentation](references/business-comments.md) when creating, changing, or reviewing these declarations, callbacks, workflows, or their comments.
4. **Logical blank lines** — Separate only genuinely distinct logical regions; prohibit consecutive, leading, trailing, block-edge, comment-separating, and tightly-coupled blank lines. Read [Logical Blank Lines](references/blank-lines.md) when arranging declarations, statements, type members, or JSX whitespace.

### Imports and Module Boundaries

5. **Import order** — Group third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules; module-local types precede shared types. Read [Import Order](references/import-order.md) when adding, removing, grouping, or relocating imports.
6. **Type import syntax** — Prefer standard imports when type-only usage is safely erased; use separate `import type` only when verified tooling or runtime contracts require it, and never use inline `type` modifiers. Read [Type Import Syntax](references/type-imports.md) when selecting or reviewing type-only import syntax.
7. **Public entries** — Import other modules through configured aliases and public entries; keep private implementation behind its owner boundary. Read [Cross-Module Public Entries](references/public-entries.md) when choosing import paths, exposing exports, or changing module boundaries.

### Application Architecture

8. **Source-layer ownership** — Place bootstrap, API, routing, services, state, constants, ambient types, and shared utilities in their established source layers. Keep private types and stateless helpers with their owner until real cross-owner reuse or an application-wide contract warrants promotion. Read [TypeScript Application Architecture](references/application-architecture.md) when placing or moving source modules or owner-private directories.

### Async Flow and Errors

9. **Await sequential flow** — Prefer `await` for ordinary sequential work. Read [Await Sequential Flow](references/await-flow.md) when adding or changing asynchronous control flow.
10. **Parallel dependencies** — Keep dependent work sequential; use `Promise.all` only for independent operations with an intended shared failure boundary. Read [Sequential and Parallel Dependencies](references/parallel-work.md) when deciding request ordering or concurrency.
11. **Error ownership** — Catch only where the error can be recovered, translated, enriched, or reported; otherwise propagate it. Read [Error Handling Ownership](references/error-handling.md) when adding, changing, or reviewing catch boundaries, rejection handling, or cancellation error policy.
12. **Fire-and-forget work** — Never discard a Promise with unary `void`; intentional background work must handle or report its own rejection. Read [Fire-and-Forget Rejection Ownership](references/fire-and-forget.md) when starting unawaited work or reviewing its completion and failure contract.
13. **Loading and state commits** — Set operation-owned loading before the request, restore it through `finally`, and commit related state without accidental partial updates. Read [Loading Lifecycle and Related State Commits](references/loading-state.md) when managing request state, loading, cleanup, or response merging.
14. **Caught error messages** — Read `error.message` directly without narrowing or fallback branches around the guaranteed property. Read [Caught Error Messages](references/error-message.md) when accessing caught error messages.

### Runtime Compatibility

15. **Runtime APIs** — Verify new runtime APIs against the actual TypeScript target, runtime versions, Browserslist, and polyfill strategy; transpilation does not supply missing APIs. Read [Runtime API Compatibility](references/runtime-compatibility.md) when introducing APIs or deciding target support and fallbacks.

### Formatting and Verification

16. **Formatting scope** — Format only changed files, restore unrelated formatter churn, preserve pre-existing user edits, and re-check the final diff. Read [Formatting and Final Diff Review](references/formatting.md) when formatting changed files or performing final verification.

## Working Process

1. Before changing or reviewing TypeScript, read the repository instructions and inspect the affected module, its public callers, nearby types, and the relevant `tsconfig`, package scripts, lint, formatter, and test configuration. Confirm the actual runtime and browser targets before making compatibility decisions.

2. Complete the required reference loading before acting. For TypeScript inside a Vue SFC, also apply `vue-code-rules`; when the same change touches a Vue style block, apply `css-code-rules` as well.

3. Preserve public contracts and behavior outside the requested change. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed TypeScript line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed code, such as the repository's targeted formatter, TypeScript check, lint, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating compilation or formatting alone as proof of correctness.
