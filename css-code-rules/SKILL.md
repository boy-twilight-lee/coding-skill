---
name: css-code-rules
description: "Apply mandatory stylesheet rules when editing or reviewing CSS, Less, Sass, SCSS, or Vue style blocks."
---

# CSS Code Rules

Apply every rule relevant to the CSS, Less, Sass, SCSS, or Vue style code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched styles solely to normalize them; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Detailed rules and examples live in references grouped by the decisions they govern. Read every reference matching the current task before acting. References are authoritative requirements, not optional background, and they do not weaken the rules.

In examples, `<zh: ...>` marks required Chinese comment content. Replace the marker with a concise Chinese comment expressing the enclosed meaning; never copy the marker into project code.

## Reference Routing

- Read [Scope and File Organization Examples](references/scope-and-file-organization-examples.md) when deciding stylesheet language, Vue scope, extraction layout, ownership, or override placement.
- Read [Naming Examples](references/naming-examples.md) when deciding business roots, BEM names, abbreviations, or teleported-root names.
- Read [Nesting and Deep Selector Examples](references/nesting-and-deep-examples.md) when deciding ownership nesting, direct-child boundaries, deep selectors, pseudo-classes, or business states.
- Read [Design and Layout Examples](references/design-and-layout-examples.md) when deciding token use, layout choice, target-specific presentation, units, or library customization.
- Read [Reuse and Redundancy Examples](references/reuse-and-redundancy-examples.md) when removing ineffective declarations or extracting reusable variables, mixins, utilities, or loops.
- Read [Declaration and Compatibility Examples](references/declaration-and-compatibility-examples.md) when deciding comments, blank lines, declaration order, consolidation, browser support, fallbacks, or final formatting checks.

## Working Process

1. Before changing or reviewing styles, read the repository instructions and inspect the affected markup, owning component, neighboring styles, global resets and tokens, preprocessors, PostCSS setup, target-browser configuration, and formatter or lint scripts. Base layout and compatibility decisions on the rendered ownership structure and actual project configuration.

2. Determine which rule sections the task touches and read each matching reference before acting. For a Vue style block, also apply `vue-code-rules`; if the same SFC change touches TypeScript, apply `ts-code-rules` as well.

3. Keep selectors, overrides, extraction, and cleanup within the requested ownership boundary. Do not copy a local violation into new or changed styles merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception; do not use a style task to restructure unrelated markup or global styling.

4. After the change, inspect every changed style line against each applicable numbered rule and its reference checklist. Verify affected visual states when a preview or existing visual test is available. Run the smallest available targeted formatter, style lint, build, or affected test commands without rewriting unrelated files. If a rule, visual check, or automated check cannot be satisfied, report it explicitly instead of inferring correctness from valid syntax alone.
