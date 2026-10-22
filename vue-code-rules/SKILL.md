---
name: vue-code-rules
description: "Apply mandatory Vue 3 SFC and component-architecture rules when editing or reviewing Vue components, composables, pages, or layouts."
---

# Vue Code Rules

These rules are mandatory for changed or reviewed Vue code; existing code does not waive them. Fix directly affected violations without migrating unrelated components. Higher-priority instructions prevail; project overrides apply only where a rule permits them. Report unavoidable conflicts and keep deviations minimal.

## Core Rules

1. Keep present SFC blocks in `<template>`, `<script>`, `<style>` order and omit empty blocks. Use kebab-case custom tags, and self-close components without content.
2. Use the minimum necessary DOM and nesting; add wrappers only when existing elements cannot meet the required behavior or layout. Prefer common tags such as `div`, `span`, `i`, `button`, and `input`; keep native controls for their behavior. Prohibit uncommon tags, landmark/sectioning containers, and invented tags. Do not add unrelated accessibility attributes unless the user explicitly requests accessibility compatibility.
3. Order each tag's attributes as directives, bindings, literal text, plain booleans, then events. `v-if` and `v-show` share highest priority; alternative-branch directives share that leading group. Bound booleans and dynamic class/style stay with bindings. Preserve meaningful within-group order, spread overrides, event behavior, and conditional sibling adjacency; do not reorder child nodes.
4. Combine multiple class sources in one `:class` array. Do not split the same element across `class` and `:class` or build long concatenated class strings.
5. Use blank lines only between genuinely separate SFC blocks or logical regions. Never use consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
6. Verify active Vite auto-import configuration before adding Vue or Vue Router imports. Omit explicit imports for covered runtime APIs; import uncovered APIs or APIs whose coverage cannot be verified.
7. Keep compiler macros at `<script setup>` scope, immediately after imports and before runtime logic. `defineExpose` goes last, except that top-level `await` requires initialized public bindings to be exposed before the first await.
8. Add concise Chinese business comments for major state, computed values, actions, handlers, contracts, watchers, lifecycle work, and key processing stages even when names are clear. Put watcher/lifecycle comments above registrations and contract documentation on members, without generic macro labels. Explain major template regions and rendering rules without per-node narration. Comment coverage and placement details belong to the matching reference.
9. Use kebab-case component files, directories, and tags. Follow the fixed owner structure: `index.vue`, `index.ts`, and only needed `component/`, `constants/`, `hooks/`, `type/`, plus `index.less` (or its existing-language equivalent) or a multi-file `style/`, never both. First-level units require directories; only simple private children may stay single files. Extracted child styles require directory form. Prohibit unrelated directories and loose helper files. Keep private functional helpers in hooks and shared stateless utilities in project utils. `index.ts` only forwards the default component and externally needed components, methods, modules, or types, including named instance types when needed.
10. Keep each `.vue` at or below 1000 lines. Consider cohesive children for complex templates and responsibility-focused hooks for large scripts; extract styles under `css-code-rules`. Avoid arbitrary line slicing. Preserve state/lifecycle ownership, component contracts, and style scope, and update public entries, consumers, and component discovery.
11. Every `provide`/`inject` scenario must follow the complete fixed context pattern, regardless of depth or value count. The owner-scoped `use**Context` facade returns only `provide()` and `inject()`. Create owned state inside `provide()`, provide and return the same complete context object, and inject an exactly matching safe fallback. Each owner provides once; descendants inject.

## Required Reference Loading

After repository inspection and before implementation or review decisions, open and fully read every matching reference, including uncertain matches. Every task must read at least one; if none matches, read the closest. Each rule owns one reference. References are mandatory; mentioning or summarizing them does not replace reading them.

- Rule 1: Read [Template Examples](references/template-examples.md) when deciding SFC block order, component tags, or slots.
- Rule 2: Read [DOM Structure Examples](references/dom-structure-examples.md) for DOM depth, tag restrictions, wrappers, or accessibility-attribute scope.
- Rule 3: Read [Template Attribute Order Examples](references/template-attribute-order-examples.md) for directive/attribute/event ordering or spread overrides.
- Rule 4: Read [Class Binding Examples](references/class-binding-examples.md) when combining class sources.
- Rule 5: Read [Blank Line Examples](references/blank-line-examples.md) for SFC, template, or JavaScript-script whitespace.
- Rule 6: Read [Auto-Import Examples](references/auto-import-examples.md) for Vue/Router imports and active Vite coverage.
- Rule 7: Read [Compiler Macro Examples](references/compiler-macro-examples.md) for macro placement or exposure around top-level await.
- Rule 8: Read [Script Comment Examples](references/script-comment-examples.md) for Vue business-comment coverage, placement, macro exceptions, or example-comment policy.
- Rule 9: Read [Component Structure Examples](references/component-structure-examples.md) for names, allowed directories, helper/style placement, public entries, or instance types.
- Rule 10: Read [Component Decomposition Examples](references/component-decomposition-examples.md) for file-size limits, split decisions, or post-split checks.
- Rule 11: Read [Provide/Inject Context Pattern](references/complex-component-context-examples.md) for every provide/inject implementation or review; follow its complete fixed example.

## Working Process

1. Inspect repository instructions, affected and related components, and active build, auto-import, lint, formatter, and TypeScript configuration.

2. Apply `ts-code-rules` to TypeScript scripts and `css-code-rules` to styles; those skills own their language-specific whitespace and generic code-quality rules.

3. Check changed lines against applicable rules and reference checklists. Run targeted formatter, lint, Vue type-check, or tests without rewriting unrelated files. Report unmet rules and unavailable or failed checks; formatting or visual inspection alone does not prove correctness.
