# Declaration and Compatibility Examples

Use these scenarios to keep declarations readable, non-duplicated, compatible with project targets, and limited to the files changed by the task.

## Scenario 1: Decide Whether a Comment Is Justified

Situation: a selector contains an obvious color declaration.

Write the rule without narration:

```less
.talent-card {
  color: var(--text-color-primary);
}
```

Do not add a section label or a comment that restates the declaration:

```less
/* 卡片标题样式 */
.talent-card {
  /* 设置主要文字颜色 */
  color: var(--text-color-primary);
}
```

A concise Chinese comment is acceptable when a non-obvious external constraint cannot be expressed through structure or naming:

```less
.legacy-dialog {
  /* 兼容旧版 WebView 的滚动回弹缺陷 */
  -webkit-overflow-scrolling: touch;
}
```

The comment must explain why the unusual declaration exists. Remove commented-out code; version control already preserves history.

## Scenario 2: Use Blank Lines Only for Structure

Situation: a component has declarations followed by one nested selector.

Keep related content together:

```less
.talent-card {
  overflow: hidden;
  width: 320px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

One blank line may separate distinct nested selector groups:

```less
.talent-card {
  .talent-card-header {
    display: flex;
  }

  &.talent-card-disabled {
    cursor: not-allowed;
  }
}
```

Do not use leading, trailing, consecutive, or immediately-inside-block blank lines:

```less

.talent-card {

  width: 320px;


  padding: 16px;

}

```

Do not insert a blank line between a declaration group and its directly related nested selector merely out of habit. A blank line must communicate a real structural boundary.

## Scenario 3: Apply Declaration Category Order

Situation: one selector uses declarations from every category.

```less
.talent-card {
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  height: 120px;
  width: 320px;
  margin: 12px 0;
  padding: 16px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-small);
  font-size: 14px;
  line-height: 20px;
  color: var(--text-color-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 160ms ease;
  .talent-card-title {
  }
}
```

The category sequence is:

1. Positioning and overflow.
2. Interaction.
3. Dimensions, with height before width.
4. Margin and padding.
5. Background, border, radius, and effects.
6. Typography and color.
7. Display and layout.
8. Animation and transition.
9. Nested selectors.

The example demonstrates order, not a required declaration set. Omit every property that does not affect the result. If the active Stylelint configuration enforces another property order, follow that executable configuration and record the scoped exception rather than leaving the file lint-invalid.

## Scenario 4: Consolidate Duplicate Selector Blocks

Situation: one child selector was repeated for spacing, border, and layout edits.

Consolidate it beneath its nearest meaningful owner:

```less
.talent-card {
  .talent-card-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
  }
}
```

Do not separate the same selector by declaration category:

```less
.talent-card-header {
  padding: 12px 16px;
}

.talent-card-header {
  border-bottom: 1px solid var(--border-color);
}

.talent-card-header {
  display: flex;
  align-items: center;
}
```

Likewise, keep all child changes for one business state inside the parent's state block. Extract a reusable abstraction only when multiple real consumers share the behavior; simple consolidation does not automatically justify a mixin.

## Scenario 5: Use a Supported Compatibility Fallback

Situation: a concise modern selector would simplify a form-field error style, but the repository's target-browser matrix may not support it.

Do not assume support based on syntax familiarity:

```less
.form-field:has(.form-field-error-message) {
  border-color: var(--color-danger);
}
```

When the target matrix does not support that selector, expose a repository-approved state class from the component logic:

```less
.form-field {
  &.form-field-error {
    border-color: var(--color-danger);
  }
}
```

Before choosing a fallback:

1. Read the repository's Browserslist or documented target matrix.
2. Check whether the configured PostCSS or build tooling transforms the feature.
3. Prefer an existing project pattern over inventing a new compatibility layer.
4. Verify both the supported path and fallback behavior in the affected target.

The state-class fallback is illustrative. It is not a universal claim that `:has()` is unsupported; the repository's actual targets decide.

## Scenario 6: Format Only the Changed Style Files

Situation: a task changes `src/components/talent-card/index.less` while unrelated style files already contain formatting differences.

Run the repository's configured formatter against the changed file only. Do not format the entire style tree, because broad formatting can overwrite unrelated user work and obscure the functional diff.

After formatting, re-check the changed file for rules a generic formatter cannot enforce:

- Business-root ownership and nearest meaningful owner nesting.
- Correct `:deep(...)` consolidation.
- Meaningful blank lines.
- Required declaration category order.
- Duplicate blocks and redundant declarations.
- Target-browser compatibility.

Formatter success confirms syntax and configured formatting, not architectural compliance.

## Review Checklist

- Comments exist only for non-obvious constraints and explain why.
- Blank lines communicate real selector or logical boundaries.
- Declarations follow the required category order, or the active Stylelint order with the conflict reported.
- Nested selectors appear after declarations.
- Duplicate selector or state blocks are consolidated under their owners.
- Newer CSS features match actual target-browser and tooling support.
- Only changed style files are formatted and then manually rechecked.
