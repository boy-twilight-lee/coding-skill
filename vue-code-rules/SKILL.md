---
name: vue-code-rules
description: "Apply mandatory Vue 3 SFC and component-architecture rules when editing or reviewing Vue components, composables, pages, or layouts."
---

# Vue Code Rules

Apply every rule relevant to the Vue code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Detailed rules and examples live in references grouped by the decisions they govern. Read every reference matching the current task before acting. References are authoritative requirements, not optional background, and they do not weaken the rules.

In examples, `<zh: ...>` marks placeholder content for a justified Chinese comment. Replace the marker with concise Chinese text when the surrounding rule calls for that comment; never copy the marker into project code or add the comment mechanically when the code is already self-explanatory.

## Reference Routing

- Read [Template Examples](references/template-examples.md) when deciding SFC block order, list rendering, template expressions, component tags, slots, DOM depth, or semantic elements.
- Read [Class Binding Examples](references/class-binding-examples.md) when an element combines static, reusable, or conditional class sources.
- Read [Blank Line Examples](references/blank-line-examples.md) when deciding SFC block spacing, template whitespace, or JavaScript-script whitespace. TypeScript-script whitespace belongs to `ts-code-rules`; style-block whitespace belongs to `css-code-rules`.
- Read [Script Structure Examples](references/script-structure-examples.md) when ordering Vue imports, compiler macros, runtime declarations, or deciding whether Vue and Vue Router APIs need explicit imports.
- Read [Script Comment Examples](references/script-comment-examples.md) for Vue-specific compiler-macro, watcher, and lifecycle comment placement, and for the generic script baseline in JavaScript SFCs. For TypeScript SFCs, `ts-code-rules` owns the generic declaration, callback, internal-comment, and redundancy rules.
- Read [Component Structure Examples](references/component-structure-examples.md) when deciding component splits, composable extraction, naming, directory layout, public entries, or private ownership.
- Read [Complex Component Context Examples](references/complex-component-context-examples.md) before implementing or reviewing any `use**Context` composable, provider, injector, fallback, or consumer.
- Read [Application Architecture Examples](references/application-architecture-examples.md) when placing pages, components, layouts, or target-specific trees.

## Working Process

1. Before changing or reviewing Vue code, read the repository instructions and inspect the affected component, its nearest related components, and the relevant build, lint, formatter, and TypeScript configuration. Use that evidence for configuration-dependent decisions and to avoid unnecessary unrelated churn.

2. Determine which rule sections the task touches and read each matching reference before acting. When a Vue SFC contains TypeScript or style changes, load and apply `ts-code-rules` or `css-code-rules` as well; do not assume this skill replaces them.

3. Keep implementation and cleanup within the requested scope. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed Vue line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed Vue code, such as the repository's targeted formatter, lint, Vue type-check, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating formatting or visual inspection as proof of correctness.
