---
name: vue-code-rules
description: "Enforce the user's Vue 3 template, SFC, component-structure, naming, composition, and application-architecture rules. Use for any Vue code change or review, including .vue files, composables, pages, layouts, and component directories."
---

# Vue Code Rules

Apply every rule relevant to the Vue code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it. For TypeScript or style changes within a Vue file, also apply `ts-code-rules` or `css-code-rules` respectively.

Detailed examples live in references grouped by the same major rule sections as this file. Before acting, read every reference linked from each section that the task touches. References clarify the rules; they do not weaken them.

## Working Process

1. Before changing or reviewing Vue code, read the repository instructions and inspect the affected component, its nearest related components, and the relevant build, lint, formatter, and TypeScript configuration. Use that evidence for configuration-dependent decisions and to avoid unnecessary unrelated churn.

2. Determine which rule sections the task touches and read each matching reference before acting. When a Vue SFC contains TypeScript or style changes, load and apply `ts-code-rules` or `css-code-rules` as well; do not assume this skill replaces them.

3. Keep implementation and cleanup within the requested scope. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed Vue line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed Vue code, such as the repository's targeted formatter, lint, Vue type-check, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating formatting or visual inspection as proof of correctness.

## Template Rules

Read [Template Examples](references/template-examples.md) when deciding SFC block order, list rendering, template expressions, component tags, slots, DOM depth, or semantic elements.

1. Keep the SFC blocks that are present in strict relative order: `<template>`, then `<script>`, then `<style>`. Omit an unused block; never add an empty block solely to complete the sequence.

2. Render repeated UI from structured data with `v-for`; use a stable, unique key and never use an array index when item identity can change.

3. Keep business transformations and non-trivial conditions out of the template. Name them in computed state or functions so the template remains a readable declaration of the UI.

4. Use kebab-case custom component tags and self-close components that have no slots or child content.

5. Keep each component root and its template hierarchy aligned with the business responsibility. Use named slots for intentional extension points; do not add wrapper elements only to satisfy an abstract convention.

6. Avoid meaningless DOM. Do not nest elements solely for styling or layout when the target element can be styled directly. Keep the DOM shallow and node count low. Add a container only when it has a clear, independent layout, positioning, animation, interaction, or grouping responsibility, and give it a name that expresses that purpose.

7. In non-interactive business layout, prefer `div` for block grouping and `span` for inline content. Use `i` only for decorative icon placeholders and mark it appropriately when accessibility tooling requires it. Use native interactive elements such as `button`, `a`, `input`, and `label` when their behavior or accessibility semantics apply. Use landmarks, headings, lists, tables, and other semantic elements only when they express real document structure, SEO meaning, data relationships, or accessibility—not merely for browser-default styling.

8. When an element has multiple class sources, combine them in one bound `:class` array. Put permanent class strings, reusable class values, and conditional class objects in that array, and expand it across lines when needed to prevent an unreadably long attribute. Do not split the same element's classes across `class` and `:class`, or construct a long concatenated class string. A single static class may remain in `class`, and a lone dynamic object or value does not need an array wrapper.

## Blank Line Rules

Read [Blank Line Examples](references/blank-line-examples.md) when deciding whether whitespace separates real SFC or logical regions.

1. Do not leave meaningless blank lines anywhere in a Vue file, including its template, script, and style blocks. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, leading or trailing blank lines inside an SFC block, blank lines immediately inside an opening or closing code block, blank lines between a required comment and its declaration, or blank lines between tightly coupled statements or markup nodes.

2. Keep at most one intentional blank line between top-level SFC blocks or genuinely separate logical groups. Remove any blank line that does not make the component structure easier to understand.

## Script Structure Rules

Read [Script Structure Examples](references/script-structure-examples.md) when ordering Vue imports, compiler macros, runtime declarations, or deciding whether Vue and Vue Router APIs need explicit imports.

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

2. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

## Script Comment Rules

Read [Script Comment Examples](references/script-comment-examples.md) when documenting declarations, callbacks, watchers, lifecycle hooks, business branches, or side effects.

1. In every Vue `<script>` block, add a concise comment immediately above every declared variable or constant, including reactive state, refs, computed values, destructured bindings, and class fields. Explain the business purpose or state meaning instead of repeating the identifier. Write comments in Chinese unless another language is strictly necessary because the project explicitly mandates it, an external protocol or third-party term must be quoted exactly, or Chinese would make the technical meaning less accurate. Imports, function parameters, and type-only declarations do not require separate variable comments. Vue compiler macros are also explicit exceptions: never add a declaration comment immediately above `defineProps`, `withDefaults(defineProps(...))`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, or another compiler macro, including a variable or destructuring declaration that receives the macro's result.

2. Add a concise comment immediately above every function, method, composable, callback, event handler, watcher callback, and lifecycle hook. Explain its responsibility, side effect, or return meaning. An inline callback is sufficiently documented when an immediately adjacent comment above its containing API call, watcher, lifecycle call, object property, or declaration unambiguously describes the callback; do not insert a separate comment inside the expression merely to satisfy this rule. Extract an inline callback into a named, commented function only when it has an independent responsibility, real reuse, or a concrete testing or readability benefit. Keep a callback inline at its only registration site when it merely continues the containing action, watcher, lifecycle, or API workflow; callback length alone is not a reason to split the flow into a one-use `handle*` or reset function.

3. Inside functions and methods, comment only key business logic, non-obvious transformations, important branches, side effects, and error handling. Do not comment every statement. These declaration-level comment rules are mandatory for both JavaScript and TypeScript Vue scripts; TypeScript scripts must also follow `ts-code-rules`.

4. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, Vue, or the called API's verified contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

## Component Structure Rules

Read [Component Structure Examples](references/component-structure-examples.md) when deciding component splits, composable extraction, naming, directory layout, or private ownership.

Use this map for a directory-managed page or component. Omit optional directories and files until they have a real owner-specific purpose.

```text
<owner>/
|-- index.vue
|-- index.ts              Public component export
|-- index.less            Optional extracted local style
|-- component/
|   |-- simple-child.vue  Cohesive private child
|   `-- complex-child/
|       |-- index.vue
|       |-- index.ts
|       |-- component/    Child-private components
|       `-- hooks/        Child-private composables
|-- hooks/                Owner-private composables
|-- constants/            Owner-private constants
`-- type/                 Owner-private types
```

1. Split by independent UI responsibility, cohesive reusable behavior, or genuine maintenance difficulty. Keep tightly coupled template, state, and actions together; use a dedicated `use**Context` composable when shared state is repeatedly passed and updated across several component levels.
2. Use kebab-case for component files, directories, and custom tags. Use kebab-case for composable files except hooks inside `hooks/`, which use camelCase.
3. Every first-level page or component under the established page/component trees uses the directory form with `index.vue` and `index.ts`. Only a simple child inside an owner's private `component/` may use the single-file form; use a child directory when supporting files become meaningful.
4. A directory-managed component's `index.ts` re-exports `index.vue` and any intentional public types. Keep ordinary setup and styles in the SFC; add `index.less`, hooks, constants, types, or private children only when they provide real ownership or maintenance value.
5. Keep private units under their owner and each `.vue` file at or below 1000 lines. Promote a private child only after real cross-page reuse, update its public entry and consumers, and do not migrate unrelated components merely to normalize structure.

## Complex Component Context Rules

Read [Complex Component Context Examples](references/complex-component-context-examples.md) before implementing or reviewing any `use**Context` composable, provider, injector, fallback, or consumer.

1. Implement every composable named `use**Context` as a context facade that returns exactly two methods: `provide()` for the owning component and `inject()` for descendants. Keep it in the owning page or component's `hooks/` directory, and define a module-level, business-qualified context key.

2. Create all context-owned reactive state, computed values, template refs, watchers, side effects, and actions inside `provide()`. Assemble the public values into one `context` object, pass that exact object to Vue's `provide`, and return it so the owner and descendants share the same API and instances. Do not implement `use**Context` as a module-level reactive singleton or as unrelated standalone provider and injector functions.

3. Implement `inject()` with Vue's `inject` and a complete fallback object. The fallback must have exactly the same public fields as the provided `context`, with safe empty refs and no-op functions of the correct types; never omit a provided field, add an inject-only field, or use unsafe partial casting to conceal a mismatch.

4. Use the context only across the owning complex component subtree: call `use**Context().provide()` once in the owning component and `use**Context().inject()` in descendants. Do not call `provide()` in multiple descendants, and do not use this pattern as application-global state.

## Application Architecture

Read [Application Architecture Examples](references/application-architecture-examples.md) when placing pages, components, layouts, private modules, target-specific trees, dependencies, or utilities.

Use the established equivalents of these directories; optional target-specific trees exist only when the repository already separates those targets.

```text
src/
|-- pages/ (or views/)    Route-level page units
|-- pages-pc/             Optional target-specific pages
|-- components/           Cross-page reusable UI
|-- components-pc/        Optional target-specific reusable UI
|-- layout/               Page frames
|-- hooks/                Cross-page reusable composables
|-- styles/               Application-wide styles
`-- utils/                Cross-page stateless utilities
```

1. Preserve the established page tree and any mobile/PC separation. Do not create a competing tree or merge target-specific implementations through runtime device branches unless the request requires it.
2. Keep page-private components, hooks, and helpers beside the page. Promote them to a `src`-level directory only after actual cross-page reuse; organize promoted utilities by focused business domain or technical capability and export them through the directory entry.
3. Before hand-writing a substantial capability, inspect installed dependencies and wrappers. Add a package only with authorization and a demonstrated gap, after checking maintenance, provenance, target compatibility, bundle impact, and license; report unresolved commercial-use safety.
