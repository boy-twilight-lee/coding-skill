---
name: css-code-rules
description: "Apply mandatory stylesheet rules when editing or reviewing CSS, Less, Sass, SCSS, or Vue style blocks."
---

# CSS Code Rules

Apply every rule relevant to the CSS, Less, Sass, SCSS, or Vue style code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched styles solely to normalize them; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Core rules live in this entrypoint as a safety baseline; this does not make reference loading optional. References add detailed decision boundaries and review checklists, with examples only where concrete contrasts improve the decision.

In examples, `<zh: ...>` marks required Chinese comment content. Replace the marker with a concise Chinese comment expressing the enclosed meaning; never copy the marker into project code.

## Core Rules

1. Preserve the repository's stylesheet language. Use `<style lang="less" scoped>` for new Vue component styles only where the project uses the expected Less setup; otherwise preserve the configured language and scoping mechanism.
2. Keep component styles with their owner and ordinary Vue styles scoped. Extract an inline style block at 200 physical lines into one sibling stylesheet; do not split by visual region. Keep application-wide resets, tokens, utilities, and global library overrides in the established global style area.
3. Give each component a meaningful business root and keep owned selectors beneath it. Use the project's single-hyphen BEM-like naming, short unambiguous complete names, and consistent comprehensible abbreviations only when necessary. Teleported content may have a separate fully qualified root.
4. In nesting-capable styles, place descendants beneath their nearest meaningful owner, use `& >` only for a stable direct-child contract, and keep pseudo-classes and business states with their owner. Do not flatten component children or begin a nested selector with bare `>`.
5. In scoped nesting-capable styles, target deep selectors with `&:deep(...)` and consolidate rules under the nearest shared library-owned parent. In plain CSS without verified nesting support, use equivalent expanded selectors while preserving the business root and library ownership path.
6. Reuse established tokens, utilities, and semantic values. When a token manifest provides modes, aliases, and Web code syntax, resolve the requested or default mode, follow aliases to a concrete value, and emit the documented Web syntax only after verifying the variable is available at runtime. Prefer Flexbox plus `gap`; use Grid only for a genuinely two-dimensional requirement Flexbox cannot express. Apply `flex: 1`, `flex-shrink: 0`, and `overflow: hidden` only where their layout roles require them.
7. Preserve target ownership and the configured unit strategy. Do not bypass separate mobile/PC trees with component-local media-query forks, and do not hand-convert ordinary project values when configured tooling owns that conversion.
8. Prefer documented library custom properties and ordinary scoped selectors over specificity escalation or `!important`.
9. Do not repeat global reset behavior or ineffective declarations. Extract mixins, variables, utilities, or loops only after genuine repeated patterns exist.
10. Avoid routine style comments. Add only a concise Chinese comment for a non-obvious compatibility workaround, external-library constraint, or temporary exception that structure cannot express.
11. Use blank lines only between genuinely distinct selector groups. Order declarations by positioning and overflow; interaction; dimensions; spacing; visuals; typography; layout; animation. Put nested selectors after declarations unless active Stylelint configuration requires another order.
12. Consolidate duplicate selector blocks, verify newer CSS features against actual browser targets, format only changed style files, restore unrelated churn, and re-check the final diff.

## Required Reference Loading

Loading this entrypoint is not the complete workflow. After the initial repository inspection and before making implementation or review judgments, map every affected concern to the list below and read each matching reference in full. Every task covered by this skill must open at least one reference. When no route seems to match, read the closest reference instead of proceeding with only this entrypoint. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background.

- Read [Scope and File Organization Examples](references/scope-and-file-organization-examples.md) when deciding stylesheet language, Vue scope, extraction layout, ownership, or override placement.
- Read [Naming Examples](references/naming-examples.md) when deciding business roots, BEM names, abbreviations, or teleported-root names.
- Read [Nesting and Deep Selector Examples](references/nesting-and-deep-examples.md) when deciding ownership nesting, direct-child boundaries, deep selectors, pseudo-classes, or business states.
- Read [Design and Layout Examples](references/design-and-layout-examples.md) when resolving semantic or primitive token aliases and modes, deciding token runtime availability, layout choice, target-specific presentation, units, or library customization.
- Read [Reuse and Redundancy Examples](references/reuse-and-redundancy-examples.md) when removing ineffective declarations or extracting reusable variables, mixins, utilities, or loops.
- Read [Declaration and Compatibility Examples](references/declaration-and-compatibility-examples.md) when deciding comments, blank lines, declaration order, consolidation, browser support, fallbacks, or final formatting checks.

## Working Process

1. Before changing or reviewing styles, read the repository instructions and inspect the affected markup, owning component, neighboring styles, global resets and tokens, preprocessors, PostCSS setup, target-browser configuration, and formatter or lint scripts. Base layout and compatibility decisions on the rendered ownership structure and actual project configuration.

2. Complete the required reference loading before acting. For a Vue style block, also apply `vue-code-rules`; if the same SFC change touches TypeScript, apply `ts-code-rules` as well.

3. Keep selectors, overrides, extraction, and cleanup within the requested ownership boundary. Do not copy a local violation into new or changed styles merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception; do not use a style task to restructure unrelated markup or global styling.

4. After the change, inspect every changed style line against each applicable numbered rule and its reference checklist. Verify affected visual states when a preview or existing visual test is available. Run the smallest available targeted formatter, style lint, build, or affected test commands without rewriting unrelated files. If a rule, visual check, or automated check cannot be satisfied, report it explicitly instead of inferring correctness from valid syntax alone.
