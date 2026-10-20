# Scope and File Organization Examples

## Mandatory Rules

1. Preserve the project's chosen stylesheet language. Do not migrate CSS, Less, Sass, or SCSS merely for consistency. In the user's Vue projects, use Less for newly created component styles unless the target repository deliberately uses another solution.

2. Scope ordinary Vue component styles. In a Less-based project, use `<style lang="less" scoped>` in that attribute order. In a repository deliberately using CSS, Sass, SCSS, CSS Modules, or another configured solution, preserve that language or mechanism and its valid syntax. Use an unscoped style block only for true global rules or content rendered outside the component root.

3. Keep a component's extracted styles beside its entry point. Use the repository's matching extension, such as `index.less` beside `index.vue`, for one style file; introduce a `style/` directory only when scoped and unscoped styles genuinely must be isolated. Extract an inline component style block when its selector groups, nesting, states, deep or library overrides, or close coupling with a large template make the SFC materially harder to read or maintain. Line count may prompt a review but never determines the split by itself. Move the whole owned stylesheet to the sibling file and include it through the component's scoped style block; do not split the file by visual region.

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

Situation: the inline component style block in `index.vue` contains several cohesive selector groups, nested interaction states, and library overrides. Keeping those rules inline now obscures the component's template and script responsibilities, even though no line-count threshold decides the issue.

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
- Inline styles are extracted only when their actual complexity creates a maintenance or readability cost; line count is only a review signal.
- A single extracted component stylesheet stays beside its entry point.
- Multiple component stylesheets are split only by scope.
- Global assets and component-owned library overrides live with their actual owners.
