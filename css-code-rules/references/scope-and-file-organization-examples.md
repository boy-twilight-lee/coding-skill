# Scope and File Organization Examples

## Mandatory Rules

1. Preserve the project's chosen stylesheet language. Do not migrate CSS, Less, Sass, or SCSS merely for consistency. In the user's Vue projects, use Less for newly created component styles unless the target repository deliberately uses another solution.

2. Scope ordinary Vue component styles. In a Less-based project, use `<style lang="less" scoped>` in that attribute order. In a repository deliberately using CSS, Sass, SCSS, CSS Modules, or another configured solution, preserve that language or mechanism and its valid syntax. Use an unscoped style block only for true global rules or content rendered outside the component root.

3. Keep a component's extracted styles beside its entry point. Use the repository's matching extension, such as `index.less` beside `index.vue`, for one style file; introduce a `style/` directory only when scoped and unscoped styles genuinely must be isolated. Extract the whole inline component style block when either mandatory trigger applies:

   - The block contains at least 80 non-blank lines, including selector, declaration, brace, at-rule, and comment lines.
   - The block contains at least four owned selector groups and at least two complexity signals: nesting three or more levels deep; three or more state, modifier, or pseudo-class branches; `:deep(...)` or third-party overrides; keyframes or complex animation; responsive, `@supports`, or container-query branches.

   Count one owned selector group for each block that owns a distinct descendant, component modifier or state, pseudo branch, deep override, or at-rule branch; a comma-separated selector list is one group. These thresholds are enforceable upper bounds for inline styles, not subjective review hints. Extract shorter styles as well when close coupling with a large template or another concrete maintenance problem justifies it. Move the whole owned stylesheet to the sibling file and include it through the component's scoped style block; do not split the file by visual region. When a named private child must gain a sibling stylesheet, convert it from `component/child-name.vue` to the directory-managed `component/child-name/index.vue`, `index.ts`, and matching `index.<ext>` form required by `vue-code-rules`.

4. Keep all styles for one component in one stylesheet. Do not split files by visual region or feature. Separate stylesheets are justified only when CSS scope itself requires it.

5. Keep application-wide resets, theme tokens, library overrides, and utilities in the repository's established `src/styles` files. Keep a component-specific Element Plus or Vant override within the owning component's root through `:deep`.

Read the scenario that matches the current change. Each scenario explains the ownership decision, shows the preferred result, and identifies the failure mode to avoid.

## Scenario 1: Preserve the Existing Stylesheet Language

Situation: an existing Vue component uses SCSS, while newly created components in the user's usual Vue projects default to Less.

**Positive example:**

Keep the existing component in SCSS:

```vue
<style lang="scss" scoped>
@use './index.scss';
</style>
```

Use Less for a new component only when the repository has not deliberately standardized on another solution:

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

Do not convert an existing SCSS file to Less merely to match the default preference. First inspect neighboring components, build configuration, shared variables, and formatter rules. Preserve the verified stylesheet language or mechanism, including CSS Modules or another configured solution, rather than emitting invalid Less-specific syntax.

**Negative example:**

Do not rewrite that same existing SCSS component as Less solely for consistency:

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

## Scenario 2: Choose Scoped or Unscoped Vue Styles

Situation: a component owns ordinary DOM under its root and also configures a dropdown rendered through Teleport.

**Positive example:**

Keep ordinary component styles scoped:

```vue
<template>
  <div class="talent-select">
    <span class="talent-select-title">Select a candidate</span>
  </div>
</template>

<style lang="less" scoped>
.talent-select {
  .talent-select-title {
    color: var(--text-color-primary);
  }
}
</style>
```

Give teleported content its own fully qualified root in an unscoped block:

```vue
<style lang="less">
.talent-select-popper {
  .talent-select-popper-option {
    color: var(--text-color-primary);
  }
}
</style>
```

**Negative example:**

Do not make the ordinary component root global:

```vue
<style lang="less">
.talent-select {
}
</style>
```

Do not use a generic teleported root such as `.popper` or `.dropdown`. A global selector must still identify the owning business component so it cannot leak into unrelated overlays.

## Scenario 3: Extract a Complex Component Style

Situation: the inline component style block in `index.vue` reaches 80 non-blank lines, or contains at least four owned selector groups plus two listed complexity signals. Keeping those rules inline is prohibited even if the component is used only once.

**Positive example:**

For one scoped stylesheet, keep both files beside each other:

```text
talent-card/
|-- index.vue
`-- index.less
```

Move the whole owned stylesheet rather than splitting it by visual region. Import the extracted stylesheet through the scoped block so Vue continues to apply scope attributes:

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

Do not move the import into a script entry point or a global style entry, because that changes the stylesheet's scope and ownership.

For a private `custom-range-editor.vue` child that meets a mandatory trigger, use directory form so the extracted stylesheet remains beside its owner:

```text
component/custom-range-editor/
|-- index.vue
|-- index.ts
`-- index.less
```

Leaving the triggered style block inside `custom-range-editor.vue` is a violation; being private, cohesive, or below the 1000-line Vue limit is not an exception to the style-extraction rule.

When scoped and unscoped rules genuinely need separate files, isolate them by scope:

```text
talent-select/
|-- index.vue
`-- style/
    |-- scoped.less
    `-- global.less
```

**Negative example:**

Do not split one component by visual region or feature:

```text
talent-card/
|-- header.less
|-- content.less
|-- actions.less
`-- states.less
```

That split makes selector ownership harder to follow and encourages duplicate parent or state blocks. Keep component-owned rules together unless scope itself requires separation.

## Scenario 4: Place Global and Component-Owned Rules

Situation: a project needs a reset, theme tokens, a shared utility, and a one-off Element Plus input adjustment.

**Positive example:**

Use the established application style area for application-wide ownership:

```text
src/styles/reset.less
src/styles/theme.less
src/styles/utilities.less
src/components/talent-form/index.less
```

Keep the one-off library override under the business component root:

```less
.talent-form {
  &:deep(.el-input__wrapper) {
    border-radius: var(--radius-medium);
  }
}
```

Move an override to the established global library-override file only when it intentionally applies to every matching library component across the application. Library ownership alone does not make a rule global; application breadth does.

**Negative example:**

Do not move that same one-off form override into the global style entry:

```less
/* src/styles/element-plus.less */
.el-input__wrapper {
  border-radius: var(--radius-medium);
}
```

## Review Checklist

- The stylesheet language and Vue style mechanism match verified repository usage.
- Ordinary component styles remain scoped.
- Teleported or global rules have a collision-resistant business root.
- Inline styles are extracted whenever either mandatory line-count or structural-complexity trigger is met; shorter styles are extracted only for a concrete maintenance or readability reason.
- A private single-file child that needs an extracted stylesheet is converted to directory form with `index.vue`, `index.ts`, and the sibling style file.
- A single extracted component stylesheet stays beside its entry point.
- Multiple component stylesheets are split only by scope.
- Global assets and component-owned library overrides live with their actual owners.
