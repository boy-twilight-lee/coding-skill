---
name: css-code-rules
description: "Apply the user's mandatory CSS, Less, Sass, and Vue component-style architecture, naming, nesting, layout, scope, reuse, and compatibility standards. Use whenever Codex writes, modifies, refactors, reviews, debugs, or completes CSS, Less, Sass, SCSS, or a Vue style block."
---

# CSS Code Rules

Apply all relevant rules below when working on CSS, Less, Sass, SCSS, or Vue `<style>` blocks. Preserve an established project convention when it deliberately differs, and keep changes scoped to the request.

Detailed examples live in references grouped by the same major rule sections as this file. Read only the matching reference before writing or reviewing an affected pattern. The references clarify these rules but do not override an established repository convention.

## Working Process

1. Before changing or reviewing styles, read the repository instructions and inspect the affected markup, owning component, neighboring styles, global resets and tokens, preprocessors, PostCSS setup, target-browser configuration, and formatter or lint scripts. Base layout and compatibility decisions on the rendered ownership structure and actual project configuration.

2. Determine which rule sections the task touches and read each matching reference before acting. For a Vue style block, also apply `vue-code-rules`; if the same SFC change touches TypeScript, apply `ts-code-rules` as well.

3. Keep selectors, overrides, extraction, and cleanup within the requested ownership boundary. If a local convention conflicts with a rule, follow higher-priority instructions and deliberate repository constraints, and do not use a style task to restructure unrelated markup or global styling.

4. After the change, inspect the diff against every relevant section below and verify the affected visual states when a preview or existing visual test is available. Run the smallest available targeted formatter, style lint, build, or affected test commands without rewriting unrelated files. If visual or automated verification is unavailable, state that limitation instead of inferring correctness from valid syntax alone.

## Scope and File Organization

Read [Scope and File Organization Examples](references/scope-and-file-organization-examples.md) when deciding stylesheet language, Vue scope, extraction layout, ownership, or override placement.

1. Preserve the project's chosen stylesheet language. Do not migrate CSS, Less, Sass, or SCSS merely for consistency. In the user's Vue projects, use Less for newly created component styles unless the target repository deliberately uses another solution.

2. Use `<style lang="less" scoped>` for ordinary Vue component styles, in that attribute order. Use an unscoped style block only for true global rules or content rendered outside the component root.

3. Keep a component's extracted styles beside its entry point. Use `index.less` beside `index.vue` for one style file; introduce a `style/` directory only when scoped and unscoped styles genuinely must be isolated. Extract a style block to a sibling file when it reaches 200 lines, then import it through the component's scoped style block.

4. Keep all styles for one component in one stylesheet. Do not split files by visual region or feature. Separate stylesheets are justified only when CSS scope itself requires it.

5. Keep application-wide resets, theme tokens, library overrides, and utilities in the repository's established `src/styles` files. Keep a component-specific Element Plus or Vant override within the owning component's root through `:deep`.

## Naming and Nesting

Read [Naming and Nesting Examples](references/naming-and-nesting-examples.md) when deciding business roots, BEM names, ownership nesting, direct-child boundaries, deep selectors, pseudo-classes, or business states.

1. Give every component a meaningful business root class and keep all of its owned selectors beneath that root. Teleported content may use a separate fully qualified business root because it is rendered outside the component tree.

2. Follow BEM semantics with a single hyphen between every part: `block-element-modifier`. Do not introduce `__` or `--` in project-owned class names. Library-owned selectors retain their library naming.

3. Describe a component, element, state, or business meaning in every class. Avoid ambiguous names and arbitrary suffix chains.

4. Prohibit overly long class names. First remove redundant ownership words, duplicated business terms, visual descriptions, and unnecessary suffixes while retaining enough meaning to identify the component, element, or state. Do not preserve a verbose name merely because it mirrors every DOM ancestor.

5. When a class name cannot be kept reasonably short after removing redundant wording, shorten repeated business segments with consistent, comprehensible character abbreviations. Prefer abbreviations already established by the repository or feature glossary, and use the same abbreviation for the same term throughout the ownership subtree. Never create ambiguous, opaque, concatenated, or arbitrary letter sequences merely to reduce character count.

6. In Less/Sass, every child or descendant selector must be nested inside the selector of its immediate owning parent, following the DOM and component ownership hierarchy. This is mandatory: never leave child selectors as standalone or root-level floating rules, and never flatten them merely to reduce nesting depth. Only true stylesheet roots, global rules, and separately rendered teleported roots may be top-level. Keep complete class names when nesting rather than generating opaque names through string concatenation. Do not overuse direct-child selectors: use `& >` only when styling must be limited to direct children to prevent unintended descendant matches and that direct-child boundary is a stable, meaningful part of the DOM contract. Do not use it merely because an element currently happens to be a direct child; use ordinary nested descendant selectors in all other cases. When a direct-child selector is justified, prefix it with `& >`; never begin a nested selector with a bare `>`.

7. In Vue scoped styles, every deep selector must name its target directly through `&:deep(...)`; never call `:deep` without a selector argument. When multiple deep rules belong to the same library-owned subtree, put `&:deep(...)` on the nearest suitable shared parent and nest its descendants beneath it. Do not repeat `:deep` on those descendants. This applies equally to descendant and combinator selectors, pseudo-classes, and pseudo-elements: nest each one under the selector it belongs to inside the shared deep block. Multiple sibling `&:deep(...)` blocks are allowed only when the targets have no suitable shared library-owned parent below the component root, so their only common parent is the component root itself. Do not write a long series of sibling `&:deep(...)` blocks when their selectors can be consolidated under one shared deep parent. Never flatten a business root plus `:deep()` into a standalone selector or scatter comma-separated deep rules.

8. Nest pseudo-classes under their owning selector. Express business states as an explicit complete class chained to that owner; keep child changes inside the state block.

## Design, Layout, and Reuse

Read [Design, Layout, and Reuse Examples](references/design-layout-and-reuse-examples.md) when deciding token use, layout choice, target-specific presentation, units, library customization, redundancy removal, or reusable abstractions.

1. Reuse the repository's tokens, utilities, and existing semantic values for colors, spacing, radii, typography, and state. Avoid near-duplicate literal values. Use Less/Sass variables, mixins, and loops only where repetition makes ownership clearer.

2. Avoid CSS Grid. Use Flexbox plus `gap` for layouts unless Flexbox cannot correctly express a genuinely two-dimensional alignment requirement; Grid is allowed only as a last resort when it is demonstrably necessary. Use `flex: 1` for the region that fills remaining space and `flex-shrink: 0` for fixed-size regions. Add `overflow: hidden` wherever flex shrinking or ellipsis depends on it.

3. Keep desktop and mobile presentation in the repository's separate page/component trees when they exist. Do not add component-local media-query forks for an implementation already split by target tree.

4. Use the repository's configured unit strategy. For these projects, write ordinary spacing, sizes, and typography in `px`; let the configured PostCSS conversion handle mobile `vw` output. Use viewport units only when the value represents an actual viewport relationship.

5. Prefer documented library CSS custom properties for local customization. Do not increase selector specificity or use `!important` when a scoped variable or ordinary nested selector is sufficient.

6. Define `box-sizing: border-box` once in the established global or top-level rule; never repeat it in components. When a fixed dimension already establishes the minimum size, do not repeat the corresponding minimum dimension or an equivalent fixed flex basis. Omit declarations that have no effect in the element's actual formatting context. Extract recurring layout, truncation, transition, or animation patterns into a focused Less/Sass mixin, variable, or established utility only after genuine repetition exists. Do not redeclare values already provided by the established global reset or browser defaults. Keep an otherwise redundant declaration only when it is necessary for a specific, observable layout or typographic result.

## Declaration and Compatibility Discipline

Read [Declaration and Compatibility Examples](references/declaration-and-compatibility-examples.md) when deciding comments, blank lines, declaration order, consolidation, browser support, fallbacks, or final formatting checks.

1. Avoid comments in CSS, Less, Sass, SCSS, and Vue `<style>` blocks. Do not add routine section labels, selector descriptions, declaration explanations, commented-out code, or comments that merely restate the stylesheet. Add a comment only when a non-obvious compatibility workaround, external-library constraint, or temporary exception cannot be expressed clearly through naming or structure; keep that exceptional comment concise, explain why it is necessary, and write it in Chinese unless another language is strictly necessary for an exact external term or project-mandated convention.

2. Do not leave meaningless blank lines in CSS, Less, Sass, SCSS, or Vue `<style>` blocks. A blank line is allowed only when one line materially separates distinct selector groups or logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside a selector or at-rule block, or blank lines between related declarations and nested selectors. Keep at most one intentional blank line between genuinely separate groups and remove every blank line that does not improve structural readability.

3. Within a selector, order declarations as: positioning and overflow; interaction; dimensions (height before width); margin and padding; background, border, radius, and effects; typography and color; display and layout; animation and transition. Put nested selectors after declarations.

4. Do not duplicate blocks for padding, border, layout, or state. Consolidate related child selectors under their parent and extract repeated patterns only when the reuse is real.

5. Do not introduce CSS APIs, selectors, units, or properties with known target-browser compatibility problems. Confirm support or use the repository-approved fallback before adding newer features.

6. Format only the changed style files with the repository formatter, then check the result against these structure rules and the established local convention.
