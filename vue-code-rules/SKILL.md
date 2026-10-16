---
name: vue-code-rules
description: "Apply the user's mandatory Vue 3 template, component structure, component naming, composition, and application architecture standards. Use whenever Codex writes, modifies, refactors, reviews, debugs, or completes Vue project code, including .vue components, composables, pages, layouts, and component directories."
---

# Vue Code Rules

Apply all relevant rules below when working on Vue project code. Preserve established project constraints when they deliberately differ, and keep changes scoped to the request. For TypeScript or style changes within a Vue file, also apply the `ts-code-rules` or `css-code-rules` skill respectively.

Detailed examples live in references grouped by the same major rule sections as this file. Read only the matching reference before writing or reviewing an affected pattern. The references clarify these rules but do not override an established repository convention.

## Working Process

1. Before changing or reviewing Vue code, read the repository instructions and inspect the affected component, its nearest related components, and the relevant build, lint, formatter, and TypeScript configuration. Identify deliberate local conventions before applying the defaults in this skill.

2. Determine which rule sections the task touches and read each matching reference before acting. When a Vue SFC contains TypeScript or style changes, load and apply `ts-code-rules` or `css-code-rules` as well; do not assume this skill replaces them.

3. Keep the implementation and cleanup within the requested scope. If a local convention conflicts with a rule, follow higher-priority instructions and deliberate repository constraints, and preserve the surrounding pattern unless the task explicitly asks to change it.

4. After the change, inspect the diff against every relevant section below. Run the smallest available checks that exercise the changed Vue code, such as the repository's targeted formatter, lint, Vue type-check, and affected tests. Avoid commands that rewrite unrelated files. If a relevant check cannot be run, state that limitation instead of treating formatting or visual inspection as proof of correctness.

## Template Rules

Read [Template Examples](references/template-examples.md) when deciding SFC block order, list rendering, template expressions, component tags, slots, DOM depth, or semantic elements.

1. Keep Vue single-file component blocks in strict order: `<template>`, then `<script>`, then `<style>`. Do not place script before template or style before script.

2. Render repeated UI from structured data with `v-for`; use a stable, unique key and never use an array index when item identity can change.

3. Keep business transformations and non-trivial conditions out of the template. Name them in computed state or functions so the template remains a readable declaration of the UI.

4. Use kebab-case custom component tags and self-close components that have no slots or child content.

5. Keep each component root and its template hierarchy aligned with the business responsibility. Use named slots for intentional extension points; do not add wrapper elements only to satisfy an abstract convention.

6. Avoid meaningless DOM. Do not nest elements solely for styling or layout when the target element can be styled directly. Keep the DOM shallow and node count low. Add a container only when it has a clear, independent layout, positioning, animation, interaction, or grouping responsibility, and give it a name that expresses that purpose.

7. In business component DOM, prefer `div` for block-level grouping, `span` for inline content, and `i` for icon placeholders. Minimize semantic tags and implement purely visual emphasis with CSS classes. Use semantic elements only deliberately for top-level page structure, SEO, or accessibility requirements.

8. When an element has multiple class sources, combine them in one bound `:class` array. Put permanent class strings, reusable class values, and conditional class objects in that array, and expand it across lines when needed to prevent an unreadably long attribute. Do not split the same element's classes across `class` and `:class`, or construct a long concatenated class string. A single static class may remain in `class`, and a lone dynamic object or value does not need an array wrapper.

## Blank Line Rules

Read [Blank Line Examples](references/blank-line-examples.md) when deciding whether whitespace separates real SFC or logical regions.

1. Do not leave meaningless blank lines anywhere in a Vue file, including its template, script, and style blocks. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, leading or trailing blank lines inside an SFC block, blank lines immediately inside an opening or closing code block, blank lines between a required comment and its declaration, or blank lines between tightly coupled statements or markup nodes.

2. Keep at most one intentional blank line between top-level SFC blocks or genuinely separate logical groups. Remove any blank line that does not make the component structure easier to understand.

## Script Structure Rules

Read [Script Structure Examples](references/script-structure-examples.md) when ordering Vue imports, compiler macros, runtime declarations, or deciding whether Vue and Vue Router APIs need explicit imports.

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. Place `defineExpose` at the very bottom of `<script setup>`, after all declarations, watchers, lifecycle calls, and other executable statements; nothing may follow it inside the script block.

2. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

## Script Comment Rules

Read [Script Comment Examples](references/script-comment-examples.md) when documenting declarations, callbacks, watchers, lifecycle hooks, business branches, or side effects.

1. In every Vue `<script>` block, add a concise comment immediately above every declared variable or constant, including reactive state, refs, computed values, destructured bindings, and class fields. Explain the business purpose or state meaning instead of repeating the identifier. Write comments in Chinese unless another language is strictly necessary because the project explicitly mandates it, an external protocol or third-party term must be quoted exactly, or Chinese would make the technical meaning less accurate. Imports, function parameters, and type-only declarations do not require separate variable comments. Vue compiler macros are also explicit exceptions: never add a declaration comment immediately above `defineProps`, `withDefaults(defineProps(...))`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, or another compiler macro, including a variable or destructuring declaration that receives the macro's result.

2. Add a concise comment immediately above every function, method, composable, callback, event handler, watcher callback, and lifecycle hook. Explain its responsibility, side effect, or return meaning. An inline callback is sufficiently documented when an immediately adjacent comment above its containing API call, watcher, lifecycle call, object property, or declaration unambiguously describes the callback; do not insert a separate comment inside the expression merely to satisfy this rule. Extract an inline callback into a named, commented function only when it has an independent responsibility, real reuse, or a concrete testing or readability benefit. Keep a callback inline at its only registration site when it merely continues the containing action, watcher, lifecycle, or API workflow; callback length alone is not a reason to split the flow into a one-use `handle*` or reset function.

3. Inside functions and methods, comment only key business logic, non-obvious transformations, important branches, side effects, and error handling. Do not comment every statement. These declaration-level comment rules are mandatory for both JavaScript and TypeScript Vue scripts; TypeScript scripts must also follow `ts-code-rules`.

4. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, Vue, or the called API's verified contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

## Component Structure Rules

Read [Component Structure Examples](references/component-structure-examples.md) when deciding component splits, composable extraction, naming, directory layout, or private ownership.

1. Split a component when it mixes independent responsibilities, contains a cohesive unit with real reuse, or becomes difficult to maintain as one file. Extract child components for independent UI responsibilities and composables for cohesive stateful behavior. Keep tightly coupled template, state, and actions together; do not split trivial code, continuous workflows, or arbitrary line ranges merely to reduce file size.

2. Extract reusable state, side effects, and business behavior into composables. When state, actions, or derived data travel through several component levels and are repeatedly updated, provide a dedicated `use**Context` composable with provide/inject instead of continuing prop/emit pass-through.

3. Name Vue component files and custom tags in kebab-case. Name composable files in kebab-case, except hooks inside a `hooks/` directory, which use camelCase.

4. Always use a kebab-case directory for each first-level page or component under `src/pages`, `src/views`, or `src/components`, and their existing target-specific equivalents such as `pages-pc` or `components-pc`, even when its implementation is simple. Each such unit must contain `index.vue` and an `index.ts` that exports the component. The single-file exception below applies only inside an owner's private `component/` directory; it does not permit files such as `src/components/user-avatar.vue` or `src/views/candidate-list.vue`.

5. Inside the private `component/` directories owned by pages, views, or components, use a single kebab-case file, such as `empty-hint.vue`, for a simple child whose template, script, and styles remain cohesive in one SFC. Do not add a child-named directory or separate export/style files merely for uniformity. Props, emits, a short script, or local styles alone do not justify splitting a private child. Use a child-named directory when that child needs meaningful supporting files, such as extracted logic, styles, private children, or hooks; then include both `index.vue` and `index.ts`.

6. Every directory-managed Vue component, including a page/view entry or a private child, must provide an `index.ts` that re-exports its `index.vue` default component. Export public types or other intended API there only when needed. Consumers reference the component directory through that export entry instead of importing its internal `index.vue`; retain higher-level public barrels where the project uses them. Keep `index.ts` as an export entry, not a container for extracted setup or business logic.

7. Keep ordinary setup logic and local styles inside the SFC by default. Extract focused logic, types, or constants only when they have a meaningful responsibility, reuse, or maintenance benefit; use `index.less` only when separate styles are justified and the project supports Less. A required component directory and `index.ts` do not require a separate style file or an `index.vue` + `index.ts` + `index.less` trio.

8. Put component-private child components in the owning component directory's `component/` and private composables in its `hooks/`. Apply the private-child rule independently at each nesting level. Keep each `.vue` file at or below 1000 total lines; split by responsibility rather than mechanically. When a private single-file child grows into a directory or is promoted to a first-level shared component, add its required `index.ts` and update affected imports and automatic component registration. Do not migrate unrelated components merely to normalize their layout.

## Complex Component Context Rules

Read [Complex Component Context Examples](references/complex-component-context-examples.md) before implementing or reviewing any `use**Context` composable, provider, injector, fallback, or consumer.

1. Implement every composable named `use**Context` as a context facade that returns exactly two methods: `provide()` for the owning component and `inject()` for descendants. Keep it in the owning page or component's `hooks/` directory, and define a module-level, business-qualified context key.

2. Create all context-owned reactive state, computed values, template refs, watchers, side effects, and actions inside `provide()`. Assemble the public values into one `context` object, pass that exact object to Vue's `provide`, and return it so the owner and descendants share the same API and instances. Do not implement `use**Context` as a module-level reactive singleton or as unrelated standalone provider and injector functions.

3. Implement `inject()` with Vue's `inject` and a complete fallback object. The fallback must have exactly the same public fields as the provided `context`, with safe empty refs and no-op functions of the correct types; never omit a provided field, add an inject-only field, or use unsafe partial casting to conceal a mismatch.

4. Use the context only across the owning complex component subtree: call `use**Context().provide()` once in the owning component and `use**Context().inject()` in descendants. Do not call `provide()` in multiple descendants, and do not use this pattern as application-global state.

## Application Architecture

Read [Application Architecture Examples](references/application-architecture-examples.md) when placing pages, components, layouts, private modules, target-specific trees, dependencies, or utilities.

1. Keep route-level orchestration in the project's established `src/pages` or `src/views` tree and, where present, its target-specific equivalents such as `src/pages-pc`. Do not introduce a competing page tree merely to rename the existing one. Keep reusable presentation and interaction units in `src/components` and, where present, `src/components-pc`. First-level pages and components use directories with `index.vue` and `index.ts`. Keep page frames in `src/layout`.

2. Keep a page's private `component/` and `hooks/` directories beside its page. Promote code to a `src`-level directory only after it has a clear cross-page consumer.

3. When a project has separate mobile and PC page/component trees, preserve that separation. Do not merge them through runtime device branches unless the request explicitly requires shared behavior.

4. Before hand-writing a capability, check the project's installed dependencies and then established third-party libraries. When an existing dependency or a mature library already implements the requirement reliably, use it instead of building a custom replacement. Introduce only actively maintained packages whose licenses and usage terms are verified as safe for commercial use; never use a package with unknown, restrictive, copyleft, source-available, or otherwise commercially risky licensing or provenance.

5. Extract every stateless utility function that can be reused beyond its current call site into `src/utils`. Organize utilities by business domain or technical capability in focused modules: extend the matching module when one exists, otherwise create a clearly named module. Export public utilities through `src/utils/index.ts`; do not place implementations directly in the barrel, leave reusable helpers inside Vue components or composables, or collect unrelated functions in vague catch-all files.
