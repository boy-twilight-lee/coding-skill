# Stylesheet Language Examples

Owns Core Rule 1.

## Mandatory Rules

1. Prioritize the project's unified stylesheet-preprocessor convention. When modifying an existing component, preserve its original language, including CSS, Less, Sass, or SCSS; do not migrate it merely to match a different project default. For new components, first follow the unified project convention. If no unified convention determines the choice, select Less when the project supports Less or has no installed stylesheet preprocessor. If another preprocessor is installed and Less is unsupported, use the existing supported preference instead of introducing Less by personal preference. In a project without any preprocessor, select Less and establish its dependency and build support before compiling the new styles.

## Scenario 1: Select a Preprocessor and Preserve Existing Styles

Situation: select the style language for a new component or modify an existing component. Inspect the project convention, installed preprocessors, and active build configuration before choosing.

Apply this priority table:

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

Preserve the existing scoping mechanism, shared variables, and valid preprocessor syntax. A project-wide SCSS convention takes priority over the mere presence of an installed Less dependency when creating a new component.

**Negative example:**

Do not convert an existing SCSS component to Less just because Less is preferred for a new component in another situation:

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

Do not choose Less for a new component solely because a dependency is installed when the project is unified on another preprocessor. Do not emit Less syntax before the required compiler support is available in a project without a preprocessor.

## Review Checklist

- Existing components keep their original style language; new components follow the unified convention first, with Less selected only under the stated support or no-preprocessor conditions.
- Less dependencies and build support are ready before compiling Less styles, and the configured Vue scoping mechanism is preserved.
