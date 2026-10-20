# Design and Layout Examples

## Mandatory Rules

1. Reuse the repository's tokens, utilities, and existing semantic values for colors, spacing, radii, typography, and state. When an authoritative token manifest provides collections, modes, aliases, and Web code syntax, select the semantic token by intent, use the requested mode or collection default, resolve `aliasOf` recursively, and emit the documented Web syntax instead of inventing a CSS variable name. Verify that the resolved variable is actually defined in the application runtime; an unpublished design-library token or documentation entry alone does not make the variable usable. Avoid near-duplicate literal values. Use Less/Sass variables, mixins, and loops only where repetition makes ownership clearer.
2. Avoid CSS Grid. Use Flexbox plus `gap` for layouts unless Flexbox cannot correctly express a genuinely two-dimensional alignment requirement; Grid is allowed only as a last resort when it is demonstrably necessary. Use `flex: 1` for the region that fills remaining space and `flex-shrink: 0` for fixed-size regions. Add `overflow: hidden` wherever flex shrinking or ellipsis depends on it.
3. Respect the repository's existing target ownership. In a Vue project whose desktop and mobile implementations already live in separate page or component trees, `vue-code-rules` owns that architecture decision; keep styles with the affected target and do not bypass the boundary with a component-local media-query fork. In a genuinely shared responsive implementation, use the repository's established responsive strategy.
4. Use the repository's configured unit strategy. For these projects, write ordinary spacing, sizes, and typography in `px`; let the configured PostCSS conversion handle mobile `vw` output. Use viewport units only when the value represents an actual viewport relationship.
5. Prefer documented library CSS custom properties for local customization. Do not increase selector specificity or use `!important` when a scoped variable or ordinary nested selector is sufficient.

Use these scenarios to choose semantic values, layout primitives, target ownership, units, and local library customization.

## Scenario 1: Resolve and Reuse Existing Tokens

Situation: the repository has a token manifest with semantic and primitive collections, a default mode, alias relationships, and a Web syntax field.

**Positive example:**

Match by semantic intent, resolve the selected mode and every alias, verify the resulting variables are included in the application, and then use the manifest's Web syntax:

```less
.talent-card {
  background: var(--dh-background-bg-color-container);
  border: 1px solid var(--dh-border-component-border);
  color: var(--dh-text-text-color-primary);
}
```

Prefer semantic tokens such as text, background, border, status, brand, spacing, radius, and composite shadow tokens over their primitive aliases. Use a primitive only when the design meaning is genuinely primitive or no fitting semantic token exists.

**Negative example:**

Do not guess a variable name from a token label, use a token from the wrong mode, or reference a documented variable that the runtime does not define:

```less
.talent-card {
  color: var(--text-primary);
  box-shadow: var(--unpublished-shadow-card);
}
```

Do not introduce near-duplicate literals when verified semantic values already exist:

```less
.talent-card {
  padding: 15px;
  border: 1px solid #e4e7ec;
  border-radius: 7px;
  color: #303133;
}
```

Before adding a new token, search the repository and authoritative manifest for the same semantic purpose, not only the same literal value. A new variable is justified when the meaning is reusable and distinct, not merely because one declaration exists. If the design token is not published or injected yet, use the repository's current verified semantic value and report the limitation; do not silently emit a broken variable or broaden a local change into a token migration.

## Scenario 2: Build a One-Dimensional Row with Flexbox

Situation: a row has a fixed avatar and a title area that fills the remaining width and truncates long text.

**Positive example:**

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

**Negative example:**

Do not use Grid for that same one-dimensional talent row:

```less
.talent-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
}
```

## Scenario 3: Respect Target Ownership

**Positive example:**

First determine target ownership from the application architecture. When Vue already separates desktop and mobile implementations, keep each presentation change in the stylesheet owned by that target:

```text
src/pages/talent-list/index.less
src/pages-pc/talent-list/index.less
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

**Negative example:**

Do not recreate the other target inside either target-specific stylesheet with a component-local media-query fork:

```less
@media (max-width: 768px) {
  .talent-list {
    padding: 12px;
  }
}
```

CSS owns the presentation technique; `vue-code-rules` owns whether the component belongs to a shared tree or a target-specific tree. The existence of a media query elsewhere in the repository does not override the ownership of the component being changed.

## Scenario 4: Follow the Configured Unit Strategy

Situation: PostCSS converts ordinary mobile dimensions from `px` to `vw`.

**Positive example:**

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

**Negative example:**

Do not hand-convert that same card width and spacing:

```less
.talent-card {
  width: 85.3333vw;
  padding: 4.2667vw;
  font-size: 3.7333vw;
}
```

## Scenario 5: Customize a Library Locally

Situation: a documented Element Plus custom property controls the dialog radius.

**Positive example:**

Set the variable on the owning component root:

```less
.talent-dialog {
  --el-dialog-border-radius: 12px;
}
```

**Negative example:**

Do not escalate specificity or add `!important` when the variable handles the same behavior:

```less
.page .content .talent-dialog.el-dialog {
  border-radius: 12px !important;
}
```

If no documented variable exists, use the smallest ordinary nested or deep selector that reliably reaches the target. Confirm library documentation and rendered DOM before overriding internal selectors.

## Review Checklist

- Existing semantic tokens are reused before new literals or tokens are introduced.
- Token modes and aliases are resolved through the authoritative manifest, documented Web syntax is used, and runtime availability is verified.
- Flexbox handles one-dimensional layout; Grid has a demonstrated two-dimensional need.
- Fixed regions resist shrinking and flexible text regions can actually shrink.
- Target-specific presentation remains in the repository's target-specific tree.
- Units follow configured transformation rather than manual conversion.
- Library variables are preferred over specificity and `!important`.
