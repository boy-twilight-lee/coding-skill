---
name: ts-code-rules
description: "Apply mandatory TypeScript rules when editing or reviewing TypeScript, TSX, or TypeScript inside Vue SFCs."
---

# TypeScript Code Rules

Apply every rule relevant to the TypeScript or TSX created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Detailed rules and examples live in references grouped by the decisions they govern. Read every reference matching the current task before acting. References are authoritative requirements, not optional background, and they do not weaken the rules.

## Reference Routing

- Read [Code Quality Examples](references/code-quality-examples.md) when deciding change scope, abstraction, cleanup, declaration comments, callback comments, internal comments, redundant wrappers, or blank lines.
- Read [Imports and Type Organization Rules](references/imports-and-types.md) when adding, removing, grouping, or relocating imports and types, or when selecting module boundaries and public entries.
- Read [Async and Compatibility Examples](references/async-and-compatibility-examples.md) when handling promises, errors, fire-and-forget contracts, newer APIs, target support, or final formatting checks.

## Working Process

1. Before changing or reviewing TypeScript, read the repository instructions and inspect the affected module, its public callers, nearby types, and the relevant `tsconfig`, package scripts, lint, formatter, and test configuration. Confirm the actual runtime and browser targets before making compatibility decisions.

2. Determine which rule sections the task touches and read each matching reference before acting. For TypeScript inside a Vue SFC, also apply `vue-code-rules`; when the same change touches a Vue style block, apply `css-code-rules` as well.

3. Preserve public contracts and behavior outside the requested change. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed TypeScript line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed code, such as the repository's targeted formatter, TypeScript check, lint, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating compilation or formatting alone as proof of correctness.
