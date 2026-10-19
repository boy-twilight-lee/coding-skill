# Design, Layout, and Reuse Examples

## Mandatory Rules

1. Reuse the repository's tokens, utilities, and existing semantic values for colors, spacing, radii, typography, and state. Avoid near-duplicate literal values. Use Less/Sass variables, mixins, and loops only where repetition makes ownership clearer.

2. Avoid CSS Grid. Use Flexbox plus `gap` for layouts unless Flexbox cannot correctly express a genuinely two-dimensional alignment requirement; Grid is allowed only as a last resort when it is demonstrably necessary. Use `flex: 1` for the region that fills remaining space and `flex-shrink: 0` for fixed-size regions. Add `overflow: hidden` wherever flex shrinking or ellipsis depends on it.

3. Respect the repository's existing target ownership. In a Vue project whose desktop and mobile implementations already live in separate page or component trees, `vue-code-rules` owns that architecture decision; keep styles with the affected target and do not bypass the boundary with a component-local media-query fork. In a genuinely shared responsive implementation, use the repository's established responsive strategy.

4. Use the repository's configured unit strategy. For these projects, write ordinary spacing, sizes, and typography in `px`; let the configured PostCSS conversion handle mobile `vw` output. Use viewport units only when the value represents an actual viewport relationship.

5. Prefer documented library CSS custom properties for local customization. Do not increase selector specificity or use `!important` when a scoped variable or ordinary nested selector is sufficient.

6. Define `box-sizing: border-box` once in the established global or top-level rule; never repeat it in components. When a fixed dimension already establishes the minimum size, do not repeat the corresponding minimum dimension or an equivalent fixed flex basis. Omit declarations that have no effect in the element's actual formatting context. Extract recurring layout, truncation, transition, or animation patterns into a focused Less/Sass mixin, variable, or established utility only after genuine repetition exists. Do not redeclare values already provided by the established global reset or browser defaults. Keep an otherwise redundant declaration only when it is necessary for a specific, observable layout or typographic result.

Use these scenarios to choose semantic values, layout primitives, units, local customization, and reusable abstractions without adding redundant CSS.

## Scenario 1: Reuse Existing Tokens

Situation: the repository already defines semantic spacing, border, radius, and text tokens.

Reuse those values:

```less
.talent-card {
  padding: var(--spacing-medium);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-medium);
  color: var(--text-color-primary);
}
```

Do not introduce near-duplicate literals:

```less
.talent-card {
  padding: 15px;
  border: 1px solid #e4e7ec;
  border-radius: 7px;
  color: #303133;
}
```

Before adding a new token, search the repository for the same semantic purpose, not only the same literal value. A new variable is justified when the meaning is reusable and distinct, not merely because one declaration exists.

## Scenario 2: Build a One-Dimensional Row with Flexbox

Situation: a row has a fixed avatar and a title area that fills the remaining width and truncates long text.

```less
.talent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }

  .talent-row-content {
    overflow: hidden;
    flex: 1;
    .talent-row-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

`flex-shrink: 0` protects the fixed avatar. `flex: 1` assigns remaining space to the content. `overflow: hidden` on the flexible region allows it to shrink and makes the nested ellipsis observable.

Do not use Grid for this row. Grid becomes reasonable only when both row and column tracks must align across multiple items and Flexbox cannot express the relationship correctly.

When a real two-dimensional matrix requires every row to share the same column tracks, Grid is an allowed last resort:

```less
.schedule-matrix {
  display: grid;
  grid-template-columns: 120px repeat(5, minmax(160px, 1fr));
  gap: 8px;
  .schedule-matrix-cell {
    min-height: 80px;
  }
}
```

This case is genuinely two-dimensional: both the time rows and weekday columns must remain aligned across independent cells. Do not use Grid when wrapping Flexbox rows, a table component, or a simpler one-dimensional flow already expresses the required relationship.

## Scenario 3: Respect Target Ownership

First determine target ownership from the application architecture. When Vue already separates desktop and mobile implementations, keep each presentation change in the stylesheet owned by that target:

```text
src/pages/talent-list/index.less
src/pages-pc/talent-list/index.less
```

Do not recreate the other target inside either stylesheet with a component-local media-query fork:

```less
@media (max-width: 768px) {
  .talent-list {
    padding: 12px;
  }
}
```

A media query remains valid when the repository intentionally uses one shared responsive implementation. In that architecture, keep both the base rule and its responsive adjustment in the shared owner:

```less
.talent-list {
  width: 100%;
}

@media (min-width: 1024px) {
  .talent-list {
    width: 960px;
  }
}
```

CSS owns the presentation technique; `vue-code-rules` owns whether the component belongs to a shared tree or a target-specific tree. The existence of a media query elsewhere in the repository does not override the ownership of the component being changed.

## Scenario 4: Follow the Configured Unit Strategy

Situation: PostCSS converts ordinary mobile dimensions from `px` to `vw`.

Write design dimensions in `px`:

```less
.talent-card {
  width: 320px;
  padding: 16px;
  font-size: 14px;
}
```

Reserve viewport units for a real viewport relationship:

```less
.full-screen-panel {
  min-height: 100vh;
}
```

Do not manually convert `320px` into a calculated `vw` value when the build pipeline owns that transformation. Manual conversion creates inconsistent output and bypasses the repository's configured exclusions and precision.

## Scenario 5: Customize a Library Locally

Situation: a documented Element Plus custom property controls the dialog radius.

Set the variable on the owning component root:

```less
.talent-dialog {
  --el-dialog-border-radius: 12px;
}
```

Do not escalate specificity or add `!important` when the variable handles the same behavior:

```less
.page .content .talent-dialog.el-dialog {
  border-radius: 12px !important;
}
```

If no documented variable exists, use the smallest ordinary nested or deep selector that reliably reaches the target. Confirm library documentation and rendered DOM before overriding internal selectors.

## Scenario 6: Remove Redundant Fixed-Size Declarations

Situation: a flex child has a fixed square size.

Keep only the declarations with distinct effects:

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }
}
```

Remove equivalent or ineffective declarations:

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    min-height: 40px;
    min-width: 40px;
    display: block;
    flex: 0 0 40px;
    flex-shrink: 0;
  }
}
```

Here the matching minimum dimensions repeat the fixed dimensions, `display: block` has no useful effect for this flex item, and the fixed flex basis duplicates the width while conflicting with the simpler shrink rule.

## Scenario 7: Distinguish Reset Noise from Observable Behavior

Situation: the global reset already defines box sizing and base element resets.

Do not repeat them in a component without a real need:

```less
.talent-card {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1;
}
```

Keep an otherwise common reset when it enables an observable layout result. A flexible text region often needs `min-width: 0` to shrink below its intrinsic content width:

```less
.talent-row {
  .talent-row-content {
    min-width: 0;
    flex: 1;
  }
}
```

The decision depends on computed layout behavior. Do not remove a declaration solely because it resembles a default; verify whether it changes sizing, truncation, typography, or interaction on the matched element.

## Scenario 8: Extract a Repeated Pattern

Situation: two owned elements use the same inline-flex centering behavior and transition value.

After repetition is confirmed, extract focused abstractions:

```less
.inline-center-fixed() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.text-ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@motion-standard: transform 160ms ease;

.talent-card {
  .talent-card-action {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-badge {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-title {
    .text-ellipsis();
  }

  .talent-card-summary {
    .text-ellipsis();
  }
}
```

Keep the mixin focused on one recurring behavior. Do not create a broad mixin that also injects unrelated color, spacing, or component-specific dimensions. Do not extract a pattern used only once, because indirection would obscure ownership without creating reuse.

## Scenario 9: Use a Loop Only for a Stable Mechanical Sequence

Situation: six card delay modifiers follow the same naming rule and increase by the same interval.

Use a scoped Less loop when it makes the repeated relationship explicit:

```less
.talent-card {
  .generate-delay(@index) when (@index <= 6) {
    &.talent-card-delay-@{index} {
      transition-delay: (@index * 40ms);
    }
    .generate-delay(@index + 1);
  }
  .generate-delay(1);
}
```

The loop owns one predictable sequence, generates complete readable modifier names, and keeps the increment in one place. Do not use a loop for unrelated values, irregular business states, or a short one-off declaration set whose meaning becomes less visible through generation.

## Review Checklist

- Existing semantic tokens are reused before new literals or tokens are introduced.
- Flexbox handles one-dimensional layout; Grid has a demonstrated two-dimensional need.
- Fixed regions resist shrinking and flexible text regions can actually shrink.
- Target-specific presentation remains in the repository's target-specific tree.
- Units follow configured transformation rather than manual conversion.
- Library variables are preferred over specificity and `!important`.
- Every declaration has a distinct observable effect.
- Mixins, utilities, and variables represent proven repetition with focused ownership.
- Loops are limited to stable mechanical sequences with readable generated selectors.
