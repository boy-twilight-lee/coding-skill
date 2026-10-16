---
name: ts-code-rules
description: "Enforce the user's TypeScript rules for code quality, comments, types, imports, async flow, source layers, formatting, and runtime compatibility. Use for any TypeScript or TSX change or review, including TypeScript Vue script blocks and TypeScript-backed architecture."
---

# TypeScript Code Rules

Apply every rule relevant to the TypeScript or TSX created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Detailed examples live in references grouped by the same major rule sections as this file. Before acting, read every reference linked from each section that the task touches. References clarify the rules; they do not weaken them.

## Working Process

1. Before changing or reviewing TypeScript, read the repository instructions and inspect the affected module, its public callers, nearby types, and the relevant `tsconfig`, package scripts, lint, formatter, and test configuration. Confirm the actual runtime and browser targets before making compatibility decisions.

2. Determine which rule sections the task touches and read each matching reference before acting. For TypeScript inside a Vue SFC, also apply `vue-code-rules`; when the same change touches a Vue style block, apply `css-code-rules` as well.

3. Preserve public contracts and behavior outside the requested change. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed TypeScript line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed code, such as the repository's targeted formatter, TypeScript check, lint, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating compilation or formatting alone as proof of correctness.

## Code Quality

Read [Code Quality Examples](references/code-quality-examples.md) when deciding change scope, abstraction, cleanup, declaration comments, callback comments, internal comments, or blank lines.

1. Keep changes limited to the requested feature or defect. Preserve existing comments and do not reformat, rename, reorder imports, or rewrite unrelated code as drive-by cleanup.

2. Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

3. Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

4. Add a concise comment for every declared variable and constant, including `const`, `let`, class fields, reactive state, refs, computed values, and destructured bindings. Place the comment immediately above the declaration and explain its business purpose or state meaning; never merely repeat the identifier or syntax. Write comments in Chinese unless another language is strictly necessary because the project explicitly mandates it, an external protocol or third-party term must be quoted exactly, or Chinese would make the technical meaning less accurate. Imports, function parameters, and type-only declarations do not require separate variable comments. In a Vue SFC, follow the declaration-comment and compiler-macro exceptions in `vue-code-rules`; do not apply this rule a second time with different placement.

5. Add a concise comment for every function, method, composable, callback, event handler, and lifecycle hook. Place the comment immediately above its declaration or definition and explain its responsibility, side effect, or return meaning. In a Vue SFC, use the callback and lifecycle comment placement defined by `vue-code-rules`. Extract an inline callback into a named, commented function only when it has an independent responsibility, real reuse, or a concrete testing or readability benefit. Keep a callback inline at its only registration site when it merely continues the containing action or API workflow and an adjacent comment can describe it clearly; callback length alone is not a reason to split the flow into a one-use handler.

6. Inside a function or method, comment only key business logic, non-obvious transformations, important branches, side effects, and error handling. Do not comment every statement or restate self-explanatory implementation details. Declaration-level comments required by rules 4 and 5 remain mandatory even when the implementation is obvious.

7. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

8. Do not leave meaningless blank lines in TypeScript or TSX. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside an opening or closing code block, blank lines between a required comment and its declaration, or blank lines between tightly coupled imports, declarations, statements, object members, JSX nodes, or type members. Keep at most one intentional blank line between genuinely separate logical groups and remove every blank line that does not improve structural readability.

## Imports and Source Layers

Read [Imports and Source Layers Examples](references/imports-and-source-layers-examples.md) when deciding barrel exports, import order, type placement, source ownership, private constants, or whether to extract a constant.

1. Ensure every directory directly under `src` exposes public content through `index.ts`, except `src/assets` and `src/pages`. Prefer those barrel exports over deep imports and never climb two or more parent directories; use the project's configured alias.

2. Order imports as third-party runtime dependencies, type-only dependencies, other internal runtime imports, then component imports. Prefer standard `import` declarations for types when the compiler and bundler safely erase type-only usage. Use `import type` when required by `verbatimModuleSyntax`, lint rules, package runtime exports, or another verified build constraint; do not use inline `type` modifiers. Within the type group, place component-local or module-local types before shared types. In Vue code, first apply the Vite auto-import inspection required by `vue-code-rules`: do not explicitly import a covered `vue` or `vue-router` runtime API, and apply this ordering rule only to APIs that still require imports.

3. Keep `.d.ts` declarations under `src/type`. Put complex or reusable component-private types in the owning sibling type module; allow concise inline prop literals where they improve readability. Do not declare non-trivial interfaces or type aliases inside a Vue `<script setup lang="ts">` block.

4. Put endpoint declarations in `src/apis`; keep application-wide request-client configuration and response normalization in `src/utils`. Promote page- or component-owned stateless helpers to `src/utils` only after actual cross-page reuse exists; sharing within one page or hypothetical future reuse does not qualify. Keep app-wide immutable values in `src/constants`, Pinia state in `src/store`, and route definitions and guards in `src/router`.

5. Keep a page or component's private `constants/` and `type/` directories beside the owner. Promote code to `src/constants` or `src/type` only when it has a clear cross-page consumer. Do not scatter status values, options, enums, or magic numbers through templates and implementation code.

6. Do not extract constants mechanically. Keep a value or configuration inline when it is used only once, is clear at the point of use, and is unlikely to change independently. Do not extract one-off component-library configuration merely to replace an inline literal. Create a named constant only when it provides real reuse, centralizes a shared source of truth, gives important business meaning to an otherwise unclear value, or must be maintained independently.

## Async and Compatibility

Read [Async and Compatibility Examples](references/async-and-compatibility-examples.md) when handling promises, errors, fire-and-forget contracts, newer APIs, target support, or final formatting checks.

1. Prefer `await` to `.then()` for ordinary sequential flow. Use `try/catch` only at the layer that can recover, translate, enrich, or report the error; otherwise let the rejection propagate. Do not discard a Promise with unary `void`. Await it when completion matters; for an intentional fire-and-forget boundary, ensure the operation handles or explicitly reports its own rejection.

2. Use APIs supported by the repository's actual TypeScript target, runtime versions, Browserslist, and polyfill strategy. Before introducing an API outside that verified baseline, confirm support in every target environment or use a project-approved fallback or polyfill. Do not assume transpilation supplies runtime APIs.

3. Use the repository's configured Prettier formatter only on files changed for the task. Compare its output with the pre-format state and restore formatting-only changes outside the task's affected regions, preserving pre-existing user edits. Keep formatting adjustments necessary for the changed syntax. If a whole-file formatter check still fails solely on untouched formatting, report that limitation instead of broadening the edit silently. Re-check the final diff against these rules and the established local convention.
