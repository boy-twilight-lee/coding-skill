---
name: vue-design-system-reuse
description: "Reuse existing project components and UI-library controls when converting desktop (PC) Figma or HTML interfaces into Vue. For mobile interfaces, apply this skill only when the agent determines that project-level reuse is appropriate; do not use it for Vue work unrelated to visual reconstruction."
---

# Vue Design System Reuse

Translate the design into the project's existing UI language before translating it into DOM. Preserve the project's component APIs, behavior, accessibility, validation, and theming instead of creating a parallel set of page-local controls.

This skill complements the project's Vue, TypeScript, and CSS rules. Load and follow those skills whenever their routing conditions apply.

## Scope

Apply this skill by default to desktop (PC) Figma-to-Vue and HTML-to-Vue work. For mobile interfaces, component reuse is not mandatory under this skill: the agent should decide case by case whether the project's shared components and UI-library controls fit the mobile interaction model, platform conventions, and implementation context.

## Mandatory Component Priority

Resolve every form control and common interactive control in this order:

1. Use a project-owned reusable component with the same responsibility, including secondarily developed wrappers in `components` or the project's equivalent shared-component directory.
2. Otherwise use the matching component from the UI library already installed and configured by the project.
3. If the library component has the required behavior but not the required appearance, adapt it through the project's theme package, design tokens, global component configuration, or established wrapper layer.
4. If neither a shared component nor a suitable library component exists, create a reusable project component in the established shared-component location. Compose installed library primitives where possible; do not implement the control only inside the converted page.

Project-owned wrappers outrank direct library use because they may encode validation, permissions, analytics, localization, value normalization, accessibility, or theme behavior that is not visible in a screenshot.

Apply this priority to text fields, text areas, selects, checkboxes, radios, switches, date and time pickers, uploads, form containers, validation messages, buttons, links styled as actions, dialogs, drawers, pagination, tabs, tables, tooltips, and other common controls. A Figma layer name or HTML tag is only a clue; match components by responsibility and behavior.

Do not place raw `button`, `input`, `select`, or `textarea` elements in the converted page. When no configured library primitive can preserve the required platform behavior, keep the native element inside an intentional shared component with a project-level contract.

## Choose Among Multiple UI Libraries

Apply this rule only after confirming that no project-owned wrapper already fulfills the responsibility:

1. Consider only installed libraries that provide the required behavior and whose project theme package, token layer, or theme entrypoint is present and actively loaded.
2. When several eligible libraries remain, use the one with the highest actual usage frequency in the repository.
3. Measure frequency from application imports, component usages, global registration, and existing shared wrappers. Do not infer popularity from the lockfile, transitive dependencies, documentation, or personal familiarity.
4. If usage is effectively tied, prefer the library already dominant in the affected product area, then the one whose existing theme and component API cover the design without page-local workarounds.

Keep one dominant library within the same page, form, or interaction flow when it can supply the required controls. Do not mix libraries merely to choose the closest visual default for each control. If the most-used themed library cannot provide a required behavior, use the next eligible themed library or a project-owned wrapper and record the reason for the exception.

If no installed library has an active project theme package, treat theme support as missing: extend the established project theme or create a shared wrapper around the dominant library rather than introducing an unthemed minority library into the page.

## High-Frequency and Complex Components Are Mandatory Reuse Targets

The priority and multi-library rules apply without exception to high-frequency and interaction-heavy components, including:

- Dialogs, modals, drawers, popovers, tooltips, dropdowns, and other overlays.
- Toasts, messages, notifications, confirmations, and other imperative feedback services.
- Tables, data grids, trees, tree selects, pagination, tabs, menus, and virtualized lists.
- Uploaders, date pickers, cascaders, transfer lists, autocomplete controls, and other composite inputs.

Their complexity makes reuse more important, not less. If a project-owned component or eligible library component has the required responsibility, use it even when its default appearance differs from the Figma or HTML source. A visual mismatch is not a missing capability and never justifies hand-written DOM, positioning, animation, focus management, keyboard handling, stacking, selection, sorting, expansion, virtualization, or notification lifecycle logic.

For visual differences, exhaust supported props, slots, variants, and size options first. The final visual fallback is to extend or reset the selected library's established theme package, design tokens, variables, or global defaults. Do not replace the component with a hand-written lookalike. Scope theme changes through the project's existing theme architecture so a screen-specific requirement does not unintentionally restyle unrelated screens.

Only a real behavior or contract gap may justify a new shared wrapper. Even then, compose the dominant themed library's primitive or service API wherever possible and keep the new contract in the established shared-component layer.

## Inspect Before Implementing

Before writing converted Vue code, inspect enough of the repository to prove the component choice:

- Package manifests and lockfiles for the installed UI library and exact version.
- Application bootstrap, plugin registration, auto-import configuration, aliases, and global component registration.
- When multiple UI libraries are installed, their active theme imports and relative usage frequency across source files and shared wrappers.
- Shared `components` directories, barrel exports, generated component declarations, stories, demos, tests, and nearby pages.
- Existing usages of likely components, including alternate names such as `app-*`, `base-*`, `common-*`, and domain-specific wrappers.
- For HTML sources, the original control semantics and interactions; remap them to the destination project's components instead of carrying over another framework's markup or classes.
- Component contracts for `v-model`, props, events, slots, form-item integration, validation, disabled/loading/error states, sizes, and accessibility.
- Theme entrypoints, token files, UI-library variable overrides, and established global defaults.

Use the project version, local types, and existing usage as the source of truth. Do not choose an API from memory or from the latest library documentation when the project uses another version.

Maintain a small mapping while implementing:

| Design or HTML role | Selected project component | Evidence | Adaptation |
| --- | --- | --- | --- |
| What the control does | Wrapper first, library second | Definition or existing usage path | Props, slots, tokens, or theme change |

The mapping may stay in working notes unless the user requests documentation, but the evidence must be established before code is written.

## Implement Through Existing Contracts

- Express visual differences through supported props, slots, variants, sizes, tokens, or theme configuration before adding local overrides.
- Prefer a systematic theme adjustment when the same Figma or HTML styling affects multiple controls. Do not reproduce a library component's internal DOM or depend on brittle internal selectors.
- Preserve labels, help text, required state, validation feedback, keyboard interaction, focus behavior, loading state, disabled state, and submitted values even when the source is only a static design.
- Preserve wrapper-level behavior found in existing components. Do not bypass a wrapper merely because using the library component directly looks shorter.
- Use project wrappers or the selected library's component and service APIs for overlays, notifications, tables, trees, and other interaction-heavy controls; never substitute hand-written versions to achieve a closer default appearance.
- Reuse the project's established form model and validation approach. Do not create a second validation path inside the page.
- Do not add or replace a UI-library dependency without explicit authorization. If the project has no usable primitive, create a shared project component within the requested implementation scope or report the missing decision when that would materially expand the task.
- Keep theme changes scoped to the established theme system. Do not modify unrelated screens to make one converted screen match.

## Required Reference Loading

Before implementing or reviewing a Figma-to-Vue or HTML-to-Vue conversion, read [Component Selection Examples](references/component-selection-examples.md) in full. Use its positive and negative examples to check the selected abstraction level and fallback behavior.

## Verification

Before finishing:

1. Recheck every form and common control against the priority order.
2. Confirm imports or auto-imports resolve to the selected project version.
3. Verify `v-model`, events, validation, loading, disabled, error, keyboard behavior, overlay lifecycle, and data-component state affected by the conversion.
4. Confirm visual adaptation uses the existing theme or token path where one exists.
5. Search the changed page for raw common controls, hand-written overlays or notifications, custom tables or trees, duplicated wrapper behavior, direct library use that bypasses a matching project wrapper, and unnecessary mixing of UI libraries.
6. Run the smallest relevant formatter, lint, type-check, tests, and build checks available in the repository.

Report any deliberate exception with the inspected alternatives and the reason none could satisfy the required behavior.
