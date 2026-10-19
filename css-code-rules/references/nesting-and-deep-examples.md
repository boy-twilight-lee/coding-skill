# Nesting and Deep Selector Examples

## Mandatory Rules

1. In Less/Sass, nest every child or descendant selector beneath its nearest meaningful owning selector, following component ownership and the stable DOM relationship. An owning selector is the nearest ancestor class that establishes layout, state, or behavior for that child; an incidental wrapper with no such responsibility does not create a required nesting level. Never leave component children as standalone root-level rules or flatten them merely to reduce nesting depth. Only true stylesheet roots, global rules, and separately rendered teleported roots may be top-level. Keep complete class names when nesting rather than generating opaque names through string concatenation. Use `& >` only when styling must be limited to direct children to prevent unintended descendant matches and that boundary is a stable part of the DOM contract. Otherwise use ordinary nested descendant selectors. Never begin a nested selector with a bare `>`.
2. In Vue scoped styles using Less/Sass or verified CSS nesting support through the build pipeline or target browsers, every deep selector must name its target directly through `&:deep(...)`; never call `:deep` without a selector argument. When multiple deep rules belong to the same library-owned subtree, put `&:deep(...)` on the nearest suitable shared parent and nest its descendants beneath it. Do not repeat `:deep` on those descendants. This applies equally to descendant and combinator selectors, pseudo-classes, and pseudo-elements: nest each one under the selector it belongs to inside the shared deep block. Multiple sibling `&:deep(...)` blocks are allowed only when the targets have no suitable shared library-owned parent below the component root, so their only common parent is the component root itself. Under these nesting-capable conditions, do not flatten the business root plus `:deep()` or scatter comma-separated deep rules. In plain CSS without verified nesting support, use equivalent expanded selectors such as `.business-root :deep(.library-parent .library-child)`, keeping every library-owned descendant inside the deep argument. Preserve the business root and library ownership path in each selector; this compatibility exception does not permit unscoped child rules.
3. When nesting is supported, nest pseudo-classes under their owning selector. Express business states as an explicit complete class chained to that owner; keep child changes inside the state block. In plain CSS without verified nesting support, expand pseudo-class and state selectors while preserving the same ownership and matching behavior.

The mandatory nesting forms below apply to Less/Sass or plain CSS with verified nesting support from the build pipeline or target browsers. For plain CSS without that support, use the equivalent expanded ownership selectors shown in Scenario 5. Do not migrate the stylesheet language solely to satisfy nesting syntax.

## Scenario 1: Mirror the Nearest Meaningful Ownership in Nesting

Situation: the DOM contains a card, its header, and a title owned by that header.

```vue
<div class="talent-card">
  <div class="talent-card-header">
    <span class="talent-card-title">Candidate</span>
  </div>
</div>
```

**Positive example:**

The header establishes layout ownership for the title, so retain it in Less:

```less
.talent-card {
  .talent-card-header {
    .talent-card-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

**Negative example:**

Do not float a child at the stylesheet root:

```less
.talent-card-title {
}
```

Do not skip a meaningful owner merely to reduce nesting depth:

```less
.talent-card {
  .talent-card-title {
  }
}
```

The rule follows ownership rather than an arbitrary maximum nesting depth. An incidental wrapper that has no class and establishes no layout, state, or behavior does not create a required nesting level. If the DOM hierarchy is needlessly deep, simplify the component markup and ownership model instead of flattening only the stylesheet.

## Scenario 2: Decide Whether a Direct-Child Selector Is Necessary

Situation: a menu applies separators only to its own items, while nested submenus contain the same `.menu-item` class.

**Positive example:**

The direct-child boundary prevents the parent menu from styling nested submenu items:

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid var(--border-color);
  }
}
```

For an ordinary descendant with no collision risk, use normal nesting:

```less
.talent-card {
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

**Negative example:**

Never start a nested selector with a bare combinator:

```less
.menu-list {
  > .menu-item {
  }
}
```

Do not add `& >` only because the current markup happens to be one level deep. Use it only when direct-child scope is a stable part of the component contract.

## Scenario 3: Consolidate Deep Library Selectors

Situation: several Arco Table descendants share an `.arco-table` ancestor.

**Positive example:**

Put `:deep` on the nearest useful shared library root, then nest all descendants, pseudo-classes, and pseudo-elements beneath their owners:

```less
.result-table {
  &:deep(.arco-table) {
    .arco-table-container {
      width: 100%;
    }

    .arco-table-th {
      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &::before {
        display: none;
      }

      .arco-table-cell {
        min-height: 40px;
      }
    }
  }
}
```

Sibling deep blocks are valid when no suitable shared library-owned ancestor exists below the component root:

```less
.profile-form {
  &:deep(.el-input__wrapper) {
    box-shadow: none;
  }

  &:deep(.el-select__wrapper) {
    min-height: 36px;
  }
}
```

**Negative example:**

Do not use an empty deep wrapper:

```less
.result-table {
  &:deep() {
    .arco-table-th {
    }
  }
}
```

Do not repeat `:deep` for descendants that share the same library root:

```less
.result-table {
  &:deep(.arco-table-container) {
  }

  &:deep(.arco-table-th) {
  }

  &:deep(.arco-table-cell) {
  }
}
```

Do not flatten or combine deep selectors outside the business root:

```less
.result-table:deep(.arco-table-cell),
.result-table:deep(.arco-table-th) {
}
```

The decision is based on the library DOM tree, not on whether the selectors appear next to each other in the stylesheet.

## Scenario 4: Keep Pseudo-classes and Business States with Their Owner

Situation: a card has hover behavior and an active state that changes a child title.

**Positive example:**

```less
.talent-card {
  &:hover {
    border-color: var(--color-primary);
  }

  &.talent-card-active {
    .talent-card-title {
      color: var(--color-primary);
    }
  }
}
```

Keep native pseudo-classes on the selector they modify. Represent application state with a complete business class, then place all state-dependent child changes inside that state block. Do not duplicate the state across separate root-level child selectors.

**Negative example:**

Do not flatten those same owner and state relationships into unrelated root selectors:

```less
.talent-card:hover {
  border-color: var(--color-primary);
}

.talent-card-active .talent-card-title {
  color: var(--color-primary);
}
```

## Scenario 5: Preserve Ownership in Plain CSS without Nesting Support

**Positive example:**

When neither the build pipeline nor the target browsers provide the required nesting support, keep plain CSS and expand the selectors. Pseudo-classes and business states retain their owning root:

```css
.talent-card .talent-card-header .talent-card-title {
  color: var(--text-color-primary);
}
.talent-card:hover {
  border-color: var(--color-primary);
}
.talent-card.talent-card-active .talent-card-header .talent-card-title {
  color: var(--color-primary);
}
```

In a Vue scoped CSS block, keep the library-owned path inside `:deep(...)` so descendant selectors are not accidentally scoped to the parent component:

```css
.result-table :deep(.arco-table .arco-table-th:first-child) {
  border-radius: 8px 0 0 8px;
}
.result-table :deep(.arco-table .arco-table-th .arco-table-cell) {
  min-height: 40px;
}
```

The repeated library ancestor is intentional in this compatibility form. Keep these related rules together. Bare child selectors, omitted business roots, and changes to descendant versus direct-child matching are not permitted by this exception.

**Negative example:**

Do not drop the same business root or move library descendants outside the deep argument:

```css
.talent-card-title {
  color: var(--text-color-primary);
}
.result-table :deep(.arco-table) .arco-table-th:first-child {
  border-radius: 8px 0 0 8px;
}
```

## Review Checklist

- With nesting support, every descendant is nested beneath its nearest meaningful layout, state, or behavior owner; otherwise expanded selectors preserve that path.
- Direct-child combinators express a stable boundary, using `& >` in nested form or the equivalent expanded selector in plain CSS without nesting support.
- Deep rules target named selectors and share the nearest useful library ancestor; expanded plain CSS keeps the full library-owned path inside each deep argument.
- Pseudo-classes and business-state child changes retain their owning selector in either syntax.
