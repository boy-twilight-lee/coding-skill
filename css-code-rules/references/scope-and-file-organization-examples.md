# Scope and File Organization Examples

Read the scenario that matches the current change. Each scenario explains the ownership decision, shows the preferred result, and identifies the failure mode to avoid.

## Scenario 1: Preserve the Existing Stylesheet Language

Situation: an existing Vue component uses SCSS, while newly created components in the user's usual Vue projects default to Less.

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

Do not convert an existing SCSS file to Less merely to match the default preference. First inspect neighboring components, build configuration, shared variables, and formatter rules. Repository intent wins over the default for new Vue styles.

## Scenario 2: Choose Scoped or Unscoped Vue Styles

Situation: a component owns ordinary DOM under its root and also configures a dropdown rendered through Teleport.

Keep ordinary component styles scoped:

```vue
<template>
  <div class="talent-select">
    <span class="talent-select-title">选择候选人</span>
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

Do not make the ordinary component root global:

```vue
<style lang="less">
.talent-select {
}
</style>
```

Do not use a generic teleported root such as `.popper` or `.dropdown`. A global selector must still identify the owning business component so it cannot leak into unrelated overlays.

## Scenario 3: Extract a Growing Component Style

Situation: `index.vue` has reached 200 lines of component styles.

For one scoped stylesheet, keep both files beside each other:

```text
talent-card/
|-- index.vue
`-- index.less
```

Import the extracted stylesheet through the scoped block so Vue continues to apply scope attributes:

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

## Review Checklist

- The stylesheet language matches deliberate repository usage.
- Ordinary component styles remain scoped.
- Teleported or global rules have a collision-resistant business root.
- A single extracted component stylesheet stays beside its entry point.
- Multiple component stylesheets are split only by scope.
- Global assets and component-owned library overrides live with their actual owners.
