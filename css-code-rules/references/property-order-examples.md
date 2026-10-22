# Property Order Examples

## Mandatory Rules

1. Group declarations by the aspect of element presentation they control. Every category stays contiguous: positioning and transforms; interaction; dimensions, clipping, and replaced-content fitting; margin/padding; visual appearance; typography; transition/animation; display/layout. Do not interleave unrelated categories or sort alphabetically. This order follows the supplied map-editor-back example.
2. Keep position offsets and transform together. Keep height and its constraints before width and its constraints. Keep background/borders/radius/shadow together, text properties together, transition/animation together, and display plus its flex/grid/alignment/gap properties together at the end.
3. Omit unused categories and ineffective or reset/default duplicates. The sequence is not a required property set. Do not add section comments or decorative blank lines between declaration categories; adjacency expresses the grouping.
4. Define local non-emitting mixins at the top of the common DOM ancestor scope. Place mixin calls where their emitted property group belongs. Put nested DOM/state/pseudo selectors after the owning declarations while preserving the DOM hierarchy.
5. Preserve effective shorthand/longhand precedence and deliberate compatibility fallbacks when organizing declarations; do not change behavior merely to sort. If active Stylelint requires a different order, follow the executable configuration and report the scoped conflict.

## Property Groups

| Order | Group | Illustrative properties |
| --- | --- | --- |
| Before declarations | Local non-emitting mixin definitions | Define at the top of the common DOM owner, not as a detached global helper. |
| 1 | Positioning, stacking, and transforms | position; left/right/top/bottom/inset; z-index; transform; transform-origin |
| 2 | Interaction | cursor; pointer-events; user-select; touch-action; resize |
| 3 | Dimensions, clipping, and fitting | height and its min/max constraints before width and its min/max constraints; aspect-ratio; box-sizing; overflow; object-fit; object-position |
| 4 | Outer and inner spacing | margin and its sides/logical forms; padding and its sides/logical forms |
| 5 | Visual appearance | background family; border family; border-radius; box-shadow; opacity; filter |
| 6 | Typography | font and font-* properties; line-height; color; text-align; text-overflow; white-space; letter/word spacing |
| 7 | Motion | transition family; animation family |
| 8 | Layout | display; flex family; grid family; align/justify family; gap family |
| After declarations | Nested selectors | DOM children, owner-local pseudo-elements/pseudo-classes and state branches |

The groups demonstrate relative order. A property's concrete role and cascade matter; examples assume the included values have a real purpose relative to the target's baseline. Native CSS implementation details remain the agent's project-specific decision. All fenced style examples here use Less.

## Scenario 1: The supplied back button

Retain the supplied order. Assume the button needs its padding, background, and border reset; actual code must still omit values already supplied by matched global rules.

**Positive example:**

```less
.map-editor-back {
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  height: 32px;
  width: 32px;
  padding: 0;
  background: transparent;
  border: 0;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Scenario 2: Floating toolbar

Keep positioning and stacking together, followed by contiguous sizing, visual, transition, and row-layout groups.

**Positive example:**

```less
.map-tools {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 20;
  user-select: none;
  height: 40px;
  padding: 4px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: box-shadow 160ms ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

## Scenario 3: Bounded scrollable list

Height and overflow form a sizing group; flex direction and gap stay in the final layout group.

**Positive example:**

```less
.cand-list {
  height: 320px;
  overflow-y: auto;
  padding: 12px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

## Scenario 4: Input and focus state

Keep border and radius together before typography, with transition after typography. The focus branch follows its own applicable categories.

**Positive example:**

```less
.cand-input {
  height: 36px;
  width: 240px;
  padding: 0 12px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 16px;
  line-height: 24px;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
}
```

## Scenario 5: Button with interaction states

Group each owner and state branch independently: transform precedes background on hover; cursor precedes opacity in the disabled branch.

**Positive example:**

```less
.map-btn {
  cursor: pointer;
  height: 36px;
  padding: 0 16px;
  background: #409eff;
  border: 0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  transition: background-color 160ms ease, transform 160ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    transform: translateY(-1px);
    background: #337ecc;
  }
  &.map-btn-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
```

## Scenario 6: Centered empty state

Keep text properties together and flex alignment last; text-align controls alignment within multiline text.

**Positive example:**

```less
.cand-empty {
  height: 160px;
  padding: 24px;
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;
  font-size: 16px;
  line-height: 24px;
  color: #909399;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
```

## Scenario 7: Card with shadow and movement

Background, border, radius, and shadow form one visual group; motion precedes layout.

**Positive example:**

```less
.cand-card {
  overflow: hidden;
  padding: 16px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 200ms ease, box-shadow 200ms ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
  }
}
```

## Scenario 8: Full-screen overlay

Fixed positioning, inset, and z-index remain adjacent, followed by background and centering layout.

**Positive example:**

```less
.map-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Scenario 9: Two-dimensional grid panel

For a real two-dimensional layout, display, row/column tracks, and gap stay together in the layout group.

**Positive example:**

```less
.map-grid {
  height: 360px;
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
}
```

## Scenario 10: Single-line text truncation

Overflow belongs with sizing and clipping; text-overflow and white-space stay with typography.

**Positive example:**

```less
.cand-name {
  width: 180px;
  overflow: hidden;
  font-size: 16px;
  line-height: 24px;
  color: #606266;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

## Scenario 11: Image fitting

For a replaced element such as img, group dimensions with object fitting before radius.

**Positive example:**

```less
.cand-img {
  height: 96px;
  width: 144px;
  object-fit: cover;
  object-position: 50% 30%;
  border-radius: 8px;
}
```

## Scenario 12: Draggable resizable panel

Cursor and resize form the interaction group; dimensions and the overflow needed for resizing form the sizing group.

**Positive example:**

```less
.map-panel {
  position: absolute;
  left: 16px;
  bottom: 16px;
  cursor: grab;
  resize: both;
  height: 200px;
  width: 320px;
  overflow: auto;
  padding: 16px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  &:active {
    cursor: grabbing;
  }
}
```

## Scenario 13: Mixin definition and call placement

Assume header and body are direct DOM children of cx-container. Define the common mixin at the owner top; because it emits only layout properties, place calls in the consumer layout group without skipping parents.

**Positive example:**

```less
.cx-container {
  .center() {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  position: relative;
  padding: 16px;
  border: 1px solid #dcdfe6;
  .cx-container-header {
    height: 40px;
    background: #f5f7fa;
    .center();
  }
  .cx-container-body {
    height: 160px;
    .center();
  }
}
```

## Scenario 14: Do Not Interleave Presentation Categories

**Negative example:**

```less
.map-editor-back {
  display: flex;
  position: absolute;
  background: transparent;
  align-items: center;
  left: 32px;
  height: 32px;
  transition: 0.3s;
  top: 50%;
  width: 32px;
  justify-content: center;
  transform: translateY(-50%);
  border: 0;
  cursor: pointer;
  padding: 0;
}
```

The same properties as Scenario 1 are interleaved across categories. Reorder them as in Scenario 1 without changing their values.

## Review Checklist

- Every presentation group is contiguous, with transform in positioning and motion before display/layout.
- Height precedes width; no unused category or reset/default duplicate is added.
- Mixin placement, DOM hierarchy, and owner-local pseudo/state branches are preserved.
- Grouping introduces no decorative blank lines or routine comments.
- Cascade, shorthand precedence, and compatibility behavior remain intact.
