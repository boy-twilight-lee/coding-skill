---
name: ts-code-rules
description: "Apply mandatory TypeScript rules when editing or reviewing TypeScript, TSX, or TypeScript inside Vue SFCs."
---

# TypeScript Code Rules

Apply every rule relevant to the TypeScript or TSX created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Core rules live in this entrypoint as a safety baseline; this does not make reference loading optional. References add detailed decision boundaries and review checklists, with examples only where concrete contrasts improve the decision.

In examples, `<zh: ...>` marks placeholder content for a justified Chinese comment. Replace the marker with concise Chinese text when the surrounding rule calls for that comment; never copy the marker into project code or add the comment mechanically when the code is already self-explanatory.

## Core Rules

1. Keep changes limited to the requested feature or defect. Preserve existing comments and avoid unrelated reformatting, renaming, import reordering, or cleanup.
2. Keep simple one-off logic inline. Extract only for real complexity, reuse, or a clear responsibility boundary. Remove change-owned dead code, redundant wrappers, aliases, intermediates, and guards that add no correctness or meaning.
3. Add comments only for non-obvious business meaning, contracts, constraints, side effects, sequencing, transformations, branches, or error behavior. Prefer naming, types, and structure; place justified comments immediately above their target and use Chinese unless an exact external term or repository rule requires another language.
4. Use blank lines only to separate genuinely distinct logical regions. Never use consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
5. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules. Prefer standard imports when type-only usage is safely erased; use separate `import type` only when verified tooling or runtime contracts require it, and never use inline `type` modifiers.
6. Import other modules through configured aliases and public entries. Place application bootstrap, API, constant, service, state, ambient type, and shared utility modules in their established source layers. Keep private types and stateless helpers with their actual owner; promote them only after real reuse crosses that boundary, then expose them through the established public entry.
7. Prefer `await` for ordinary sequential flow, and use `Promise.all` only when operations are independent and their combined failure semantics are intended. Catch only where the error can be recovered, translated, enriched, or reported. Never discard a Promise with unary `void`; intentional fire-and-forget work must handle or report its own rejection. Set operation-owned loading before the request and restore it through `finally`.
8. Read `error.message` directly for caught errors. Do not add narrowing or fallback branches around the guaranteed `message` property.
9. Verify new runtime APIs against the actual TypeScript target, runtime versions, Browserslist, and polyfill strategy. Transpilation does not provide missing runtime APIs.
10. Keep transport wrappers thin, shared HTTP concerns centralized, and page or feature orchestration with its real owner. API modules own endpoint paths and transport-facing payloads; HTTP infrastructure owns request and response normalization; UI or feature owners own loading, user messages, navigation, list merging, and state commits.
11. Format only changed files, restore unrelated formatter churn, preserve pre-existing user edits, and re-check the final diff against these rules.

## Required Reference Loading

Loading this entrypoint is not the complete workflow. After the initial repository inspection and before making implementation or review judgments, map every affected concern to the list below and read each matching reference in full. Every task covered by this skill must open at least one reference. When no route seems to match, read the closest reference instead of proceeding with only this entrypoint. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background.

- Read [Code Quality Examples](references/code-quality-examples.md) when deciding change scope, abstraction, cleanup, declaration comments, callback comments, internal comments, redundant wrappers, or blank lines.
- Read [Imports, Type Syntax, and Public Entry Rules](references/imports-and-types.md) when adding, removing, grouping, or relocating imports, choosing type-import syntax, modeling object, union, intersection, or untrusted-boundary types, or selecting cross-module import paths and public entries.
- Read [TypeScript Application Architecture](references/application-architecture.md) when placing application bootstrap code, API or HTTP modules, constants, services, stores, ambient or shared types, stateless utilities, owner-private source-layer directories, or transport versus UI orchestration.
- Read [Async and Compatibility Examples](references/async-and-compatibility-examples.md) when handling promises, dependent or parallel work, loading state, errors, cancellation, fire-and-forget contracts, newer APIs, target support, or final formatting checks.

## Working Process

1. Before changing or reviewing TypeScript, read the repository instructions and inspect the affected module, its public callers, nearby types, and the relevant `tsconfig`, package scripts, lint, formatter, and test configuration. Confirm the actual runtime and browser targets before making compatibility decisions.

2. Complete the required reference loading before acting. For TypeScript inside a Vue SFC, also apply `vue-code-rules`; when the same change touches a Vue style block, apply `css-code-rules` as well.

3. Preserve public contracts and behavior outside the requested change. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed TypeScript line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed code, such as the repository's targeted formatter, TypeScript check, lint, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating compilation or formatting alone as proof of correctness.
