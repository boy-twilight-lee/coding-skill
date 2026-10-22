# Stylesheet Language Examples

Owns Core Rule 1.

## Mandatory Rules

1. Inspect the project convention, installed preprocessors, and active build configuration, then choose through the priority table below. Preserve the existing scoping mechanism, shared variables, and valid preprocessor syntax.

## Scenario 1: Select a Preprocessor and Preserve Existing Styles

Apply this priority table when adding or modifying a component:

| Situation | Required choice |
| --- | --- |
| Modify an existing SCSS, Sass, Less, or CSS component | Preserve that component's original language, even if the current project default differs. |
| Add a component where the project is unified on SCSS, Sass, or Less | Follow that unified convention, even when another preprocessor is also available. |
| Add a component without a unified convention, and Less is supported | Select Less. |
| Add a component without a unified convention, and no preprocessor is installed | Select Less and establish its dependency and build support before compiling. |
| Add a component without a unified convention, and only another preprocessor is supported | Follow the existing supported preference; do not introduce Less merely by preference. |

**Positive example:**

Preserve an existing SCSS component when modifying it. The same form also applies to a new component when the project is unified on SCSS:

```vue
<style lang="scss" scoped>
@use './index.scss';
</style>
```

For a new component without a unified convention, choose Less if it is already supported or no preprocessor is installed. In the latter case, establish Less support before using this block:

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

**Negative example:**

The Less block above is wrong when it replaces an existing SCSS component merely by preference, overrides a unified convention for another preprocessor, or is emitted before the required compiler support is available.

## Review Checklist

- Existing components keep their original style language; new components follow the unified convention first, with Less selected only under the stated support or no-preprocessor conditions.
- Less dependencies and build support are ready before compiling Less styles, and the configured Vue scoping mechanism is preserved.
