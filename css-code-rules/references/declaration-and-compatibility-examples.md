# Declaration and Compatibility Examples

## Mandatory Rules

1. Avoid comments in CSS, Less, Sass, SCSS, and Vue `<style>` blocks. Do not add routine section labels, selector descriptions, declaration explanations, commented-out code, or comments that merely restate the stylesheet. Add a comment only when a non-obvious compatibility workaround, external-library constraint, or temporary exception cannot be expressed clearly through naming or structure; keep that exceptional comment concise, explain why it is necessary, and write it in Chinese unless another language is strictly necessary for an exact external term or project-mandated convention.

2. Do not leave meaningless blank lines in CSS, Less, Sass, SCSS, or Vue `<style>` blocks. A blank line is allowed only when one line materially separates distinct selector groups or logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside a selector or at-rule block, or blank lines between related declarations and nested selectors. Keep at most one intentional blank line between genuinely separate groups and remove every blank line that does not improve structural readability.

3. Within a selector, order declarations as: positioning and overflow; interaction; dimensions (height before width); margin and padding; background, border, radius, and effects; typography and color; display and layout; animation and transition. Put nested selectors after declarations. If the repository's active Stylelint configuration enforces a different property order, follow the executable configuration and report that scoped exception instead of producing lint-failing code.

4. Do not duplicate blocks for padding, border, layout, or state. Consolidate related child selectors under their parent and extract repeated patterns only when the reuse is real.

5. Do not introduce CSS APIs, selectors, units, or properties with known target-browser compatibility problems. Confirm support or use the repository-approved fallback before adding newer features.

6. Run the repository formatter only on changed style files. Compare with the pre-format state and restore formatting-only changes outside the task's affected regions while preserving pre-existing user edits. Keep formatting necessary for the changed syntax; report any whole-file check failure caused solely by untouched formatting instead of silently expanding the edit. Re-check the final diff against these structure rules and the established local convention.

Use these scenarios to keep declarations readable, non-duplicated, compatible with project targets, and limited to the files changed by the task.

## Scenario 1: Decide Whether a Comment Is Justified

Situation: a selector contains an obvious color declaration.

**Positive example:**

Write the rule without narration:

```less
.talent-card {
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

**Negative example:**

Do not add a section label or a comment that restates the same declaration:

```less
/* 卡片标题样式 */
.talent-card {
  /* 设置主要文字颜色 */
  color: var(--text-color-primary);
}
```

The comment must explain why the unusual declaration exists. Remove commented-out code; version control already preserves history.

## Scenario 2: Use Blank Lines Only for Structure

Situation: a component has declarations followed by one nested selector.

**Positive example:**

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

**Negative example:**

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

**Positive example:**

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

**Negative example:**

Do not reorder those same declarations by visual preference:

```less
.talent-card {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 160ms ease;
  color: var(--text-color-primary);
  font-size: 14px;
  line-height: 20px;
  box-shadow: var(--shadow-small);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
  padding: 16px;
  margin: 12px 0;
  width: 320px;
  height: 120px;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  .talent-card-title {
  }
}
```

## Scenario 4: Consolidate Duplicate Selector Blocks

Situation: one child selector was repeated for spacing, border, and layout edits.

**Positive example:**

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

**Negative example:**

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

**Positive example:**

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

**Negative example:**

Do not use the modern selector for that same error state based only on syntax familiarity:

```less
.form-field:has(.form-field-error-message) {
  border-color: var(--color-danger);
}
```

The state-class fallback is illustrative. It is not a universal claim that `:has()` is unsupported; the repository's actual targets decide.

## Scenario 6: Format Only the Changed Style Files

Situation: a task changes `src/components/talent-card/index.less` while unrelated style files already contain formatting differences.

**Positive example:**

Run the repository's configured formatter against the changed file only. Do not format the entire style tree, because broad formatting can overwrite unrelated user work and obscure the functional diff.

```text
prettier --write src/components/talent-card/index.less
```

Retain the pre-format content and restore formatting-only changes outside the task's affected regions from that content, preserving existing user edits rather than resetting to `HEAD`. Keep formatting required by the changed syntax. If a whole-file formatting check still fails solely because of untouched legacy formatting, report the failure instead of silently widening the task.

After formatting, re-check the changed file for rules a generic formatter cannot enforce:

- Business-root ownership and nearest meaningful owner nesting.
- Correct `:deep(...)` consolidation.
- Meaningful blank lines.
- Required declaration category order.
- Duplicate blocks and redundant declarations.
- Target-browser compatibility.

Formatter success confirms syntax and configured formatting, not architectural compliance.

**Negative example:**

Do not broaden that same formatting task to every style file:

```text
prettier --write "src/**/*.less"
```

## Review Checklist

- Comments exist only for non-obvious constraints and explain why.
- Blank lines communicate real selector or logical boundaries.
- Declarations follow the required category order, or the active Stylelint order with the conflict reported.
- Nested selectors appear after declarations.
- Duplicate selector or state blocks are consolidated under their owners.
- Newer CSS features match actual target-browser and tooling support.
- Only changed style files are formatted; unrelated formatter changes are restored without losing user edits, and legacy formatting failures are reported.
