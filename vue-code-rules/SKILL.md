---
name: vue-code-rules
description: "Apply mandatory Vue 3 SFC and component-architecture rules when editing or reviewing Vue components, composables, pages, or layouts."
---

# Vue Code Rules

Apply every rule relevant to the Vue code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Core rules live in this entrypoint as a safety baseline; this does not make reference loading optional. References add detailed decision boundaries and review checklists, with examples only where concrete contrasts improve the decision.

In examples, `<zh: ...>` marks placeholder content for a Chinese comment. Replace the marker with concise Chinese text when the surrounding rule calls for that comment; never copy the marker into project code. Required business documentation still applies when identifiers are clear; omit only comments that add no responsibility, scope, contract, or rule information.

## Core Rules

1. Keep present SFC blocks in `<template>`, `<script>`, `<style>` order and omit empty blocks. Keep business transformations out of templates, use kebab-case custom tags, and self-close components without content.
2. Keep the DOM shallow and aligned with business responsibility. Add wrappers only for a real layout, positioning, animation, interaction, or grouping role. Use native interactive or semantic elements only when their behavior or document meaning applies.
3. Combine multiple class sources in one `:class` array. Do not split the same element across `class` and `:class` or build long concatenated class strings.
4. Use blank lines only between genuinely separate SFC blocks or logical regions. Never use consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
5. Keep compiler macros at `<script setup>` scope. Put macros other than `defineExpose` immediately after imports and before runtime logic. Put `defineExpose` last unless top-level `await` requires exposed bindings to be initialized and exposed before the first await.
6. Verify Vite auto-import configuration before adding Vue or Vue Router imports. Omit an explicit import only when the exact runtime API is covered by active configuration.
7. Document major business state and computed values, actions and event handlers, prop/event/model/slot contracts, business watchers, lifecycle work, and key interaction or transformation stages with concise Chinese comments even when their names are clear. Put watcher and lifecycle responsibility comments above the containing call, and explain distinct internal rules above their own cohesive blocks. Document contract members instead of adding generic compiler-macro declaration comments. In multi-region templates, annotate major business regions and significant rendering or interaction rules without labeling every node. Naming, simple syntax, or a compatibility comment elsewhere does not replace this coverage.
8. Use kebab-case component files, directories, and tags. First-level pages and components use directory form with `index.vue` and `index.ts`; only simple private children may remain single files. A private child that requires an extracted stylesheet is no longer a simple single-file child and must use directory form. Keep each `.vue` file at or below 1000 lines. When another component needs the instance type, export a named instance type from the component public entry, such as `export type DrawerInstance = InstanceType<typeof Drawer>`.
9. Every scenario involving Vue `provide` or `inject` must follow the fixed context pattern in [Provide/Inject Context Pattern](references/complex-component-context-examples.md), regardless of subtree depth or how many values are shared. Use an owner-scoped `use**Context` facade returning exactly `provide()` and `inject()`. Create state inside `provide()`, provide and return the same complete context object, and make `inject()` return an exactly matching safe fallback. The complete example defines the required implementation structure, not an optional illustration.

## Required Reference Loading

Loading this entrypoint is not the complete workflow. After the initial repository inspection and before making implementation or review judgments, map every affected concern to the list below and read each matching reference in full. Every task covered by this skill must open at least one reference. When no route seems to match, read the closest reference instead of proceeding with only this entrypoint. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background.

- Read [Template Examples](references/template-examples.md) when deciding SFC block order, template expressions, component tags, slots, DOM depth, or semantic elements.
- Read [Class Binding Examples](references/class-binding-examples.md) when an element combines static, reusable, or conditional class sources.
- Read [Blank Line Examples](references/blank-line-examples.md) when deciding SFC block spacing, template whitespace, or JavaScript-script whitespace. TypeScript-script whitespace belongs to `ts-code-rules`; style-block whitespace belongs to `css-code-rules`.
- Read [Script Structure Examples](references/script-structure-examples.md) when ordering Vue imports, compiler macros, runtime declarations, or deciding whether Vue and Vue Router APIs need explicit imports.
- Read [Script Comment Examples](references/script-comment-examples.md) for business-state, contract, watcher, lifecycle, and template-region comment coverage and placement, and for the generic script baseline in JavaScript SFCs. For TypeScript SFCs, `ts-code-rules` owns the generic declaration, callback, internal-comment, and redundancy rules.
- Read [Component Structure Examples](references/component-structure-examples.md) when deciding component naming, directory layout, public entries, exported instance types, or private-file organization.
- Read [Provide/Inject Context Pattern](references/complex-component-context-examples.md) before implementing or reviewing any Vue `provide` or `inject` scenario, including its facade, key, fallback, and consumers. Follow its complete fixed example.

## Working Process

1. Before changing or reviewing Vue code, read the repository instructions and inspect the affected component, its nearest related components, and the relevant build, lint, formatter, and TypeScript configuration. Use that evidence for configuration-dependent decisions and to avoid unnecessary unrelated churn.

2. Complete the required reference loading before acting. When a Vue SFC contains TypeScript or style changes, load and apply `ts-code-rules` or `css-code-rules` as well; do not assume this skill replaces them.

3. Keep implementation and cleanup within the requested scope. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed Vue line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed Vue code, such as the repository's targeted formatter, lint, Vue type-check, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating formatting or visual inspection as proof of correctness.
