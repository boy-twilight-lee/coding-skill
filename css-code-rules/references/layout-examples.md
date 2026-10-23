# Layout Examples

Owns Core Rule 6.

## Mandatory Rules

1. Use Flexbox for one-dimensional arrangements along a row or column. Consider Grid only when the layout requires two-dimensional coordination of rows and columns.
2. Do not automatically pair `flex: 1` with `min-width: 0` in rows or `min-height: 0` in columns, including their logical-property equivalents. This is the skill's default engineering preference, not a CSS-standard prohibition. Use a zero minimum only for a demonstrated layout requirement that suitable overflow handling cannot satisfy without changing required behavior; do not invent an exception from hypothetical long text. Preserve meaningful explicit minimums such as the supplied canvas's `min-height: 500px`.
3. When a flex item's content-based automatic main-axis minimum prevents it from fitting its allocated space, prefer `overflow: hidden` on that item if clipping is permitted. With an automatic minimum, this gives the main-axis minimum a zero used value, allowing the item itself to flex below its content-based minimum. Use `overflow: auto` on the same item when it should scroll. Choose scroll ownership from the required behavior and existing DOM. Verify the available main-axis size, explicit minimums, clipping, and scrolling; preserve content that must remain visible and avoid unnecessary wrappers.
4. Use explicit `flex-shrink` only for a concrete business sizing requirement, such as the extra form panel retaining its content height. Overflow controls the affected item's overflow behavior and automatic minimum sizing; it does not change siblings' shrink factors. Check sibling sizes under the required content and container sizes before adding or removing a local shrink override.

## Sizing Mechanism and Overflow Choices

For ordinary flex items, the main-axis automatic minimum uses a content-based size when the computed overflow is non-scrollable. Scrollable overflow values make that automatic minimum's used value zero. This affects `min-width: auto` in a row and `min-height: auto` in a column; it does not rewrite their computed values to `0` or override an explicit minimum. See [Flexbox 4.5: Automatic Minimum Size](https://www.w3.org/TR/css-flexbox-1/#min-size-auto).

| Required behavior | Overflow on the flexible item | Sizing and interaction |
| --- | --- | --- |
| Fit allocated space and hide excess content | `hidden` | Releases the content-based automatic minimum; clips overflow without user scrolling, while programmatic scrolling remains possible. |
| Fit allocated space and scroll its own content | `auto` | Also releases the automatic minimum; the item itself owns user scrolling when content overflows. |
| Keep the existing inner region as scroll owner | `hidden` outside, `auto` inside | The outer flex item clips its overflow; the existing inner region owns user scrolling. |
| Keep overflow visible | `visible` | Retains the content-based main-axis automatic minimum; a verified zero-minimum exception can be needed. |
| Clip without creating a scroll container | `clip` | Is non-scrollable and does not provide the same automatic-minimum release as `hidden` when both overflow axes remain non-scrollable. |

These classifications follow [CSS Overflow 3.1](https://www.w3.org/TR/css-overflow-3/#overflow-properties). Check both computed overflow axes; a mixed-axis declaration can change the computed value. `hidden` and `clip` are not interchangeable for this sizing decision.

The `flex` shorthand controls growth, shrinkage, and the basis; `flex: 1` does not itself remove minimum-size constraints. Browser implementations normally expand it to `1 1 0%`; the zero percentage differs from a definite zero basis when the containing main size is indefinite. Supply the layout's real size constraint rather than assuming a percentage height creates one. See [MDN: flex](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex).

## Scenario 1: Use Flexbox for One Dimension and Consider Grid for Two

Situation: a row arranges items along one axis, while a schedule matrix requires coordinated time rows and weekday columns.

**Positive example:**

Use Flexbox for the one-dimensional row:

```less
.talent-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

Consider Grid for the two-dimensional schedule matrix:

```less
.schedule-matrix {
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  gap: 8px;
}
```

Choose from the dimensional relationship of the layout: a row or column arrangement uses Flexbox; coordinated row-and-column alignment is the case for considering Grid.

**Negative example:**

Do not choose Grid for the same one-dimensional row:

```less
.talent-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
}
```

## Scenario 2: Choose Clipping or Scrolling on the Flexible Item

Situation: the existing column editor has a host-constrained height, and `.map-edit-content` is its flexible child. Its content-based automatic minimum must not force it beyond the remaining space.

**Positive example: clipping on the item itself**

When excess content should be hidden, set clipping on the flexible item:

```less
.map-edit {
  display: flex;
  flex-direction: column;
  .map-edit-content {
    overflow: hidden;
    flex: 1;
  }
}
```

**Positive example: scrolling on the item itself**

When the same item should expose its overflowing content through scrolling, use `auto` directly:

```less
.map-edit {
  display: flex;
  flex-direction: column;
  .map-edit-content {
    overflow: auto;
    flex: 1;
  }
}
```

Both cases permit the item's automatic main-axis minimum to have a zero used value. Choose by the required user-visible overflow behavior. The same mechanism applies in a row's main axis.

## Scenario 3: Preserve an Existing Inner Scroll Owner

Situation: in the supplied map editor, `.map-edit-content` and `.map-edit-footer` are siblings. The content contains `.map-edit-body`; its card contains the canvas, and the extra form panel follows the card. The host already provides the editor's bounded height, and the active reset supplies border-box sizing. The footer stays outside the content viewport, the body owns scrolling, and the canvas must remain at least 500px high.

**Positive example:**

Keep the supplied DOM paths and only the declarations needed for this layout decision. `overflow: hidden` releases the content viewport's automatic main-axis minimum so `flex: 1` can fit it to the available space. This editor's existing body owns scrolling. The extra panel's `flex-shrink: 0` follows its business requirement to retain the form controls' content height.

```less
.map-edit {
  display: flex;
  flex-direction: column;
  .map-edit-content {
    overflow: hidden;
    flex: 1;
    .map-edit-body {
      height: 100%;
      overflow: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      .map-edit-card {
        display: flex;
        flex: 1;
        flex-direction: column;
        .map-edit-canvas {
          min-height: 500px;
          overflow: hidden;
          flex: 1;
        }
      }
      .map-edit-extra {
        flex-shrink: 0;
      }
    }
  }
  .map-edit-footer {
    padding: 30px;
  }
}
```

The explicit 500px canvas minimum still applies. Preserve required visible content and the existing scrolling behavior when adapting this example.

**Negative examples:**

Do not replace the established column viewport with an automatic zero-minimum pairing when no concrete business need requires it:

```less
.map-edit {
  display: flex;
  flex-direction: column;
  .map-edit-content {
    min-height: 0;
    flex: 1;
  }
}
```

Do not introduce the analogous row boilerplate solely because an item uses `flex: 1`:

```less
.map-pane {
  display: flex;
  .map-pane-content {
    min-width: 0;
    flex: 1;
  }
}
```

## Review Checklist

- One-dimensional layouts use Flexbox; Grid is considered only for two-dimensional row-and-column coordination.
- No automatic `flex: 1` plus zero-minimum pairing is present in either axis; exceptions have a demonstrated need, and meaningful business minimums remain intact.
- Overflow is set on the actual flex item whose automatic main-axis minimum needs to be released, with explicit minimums preserved and no confusion between computed and used values.
- `hidden` clips, `auto` can make the item itself scroll, and an existing inner scroll owner remains optional; `clip` is not substituted for `hidden` without checking sizing behavior.
- The actual containing size, DOM hierarchy, box sizing, clipping, scrolling, and sibling sizes support the chosen structure; no unnecessary wrapper is added.
- Explicit `flex-shrink` follows a verified business sizing requirement; overflow and sibling shrink factors are evaluated separately.
