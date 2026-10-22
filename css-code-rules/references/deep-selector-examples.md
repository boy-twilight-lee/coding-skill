# Deep Selector Examples

Owns Core Rule 5.

The examples demonstrate preprocessor nesting. For native CSS, choose the implementation according to the actual project configuration and browser support; no native-CSS fallback template is prescribed.

## Mandatory Rules

1. In Vue scoped styles using Less/Sass/SCSS, every deep selector must name its target directly through `&:deep(...)`; never call `:deep` without a selector argument. When multiple deep rules belong to the same library-owned subtree, put `&:deep(...)` on the nearest suitable shared parent and nest its descendants beneath it. Do not repeat `:deep` on those descendants. This applies equally to descendant and combinator selectors, pseudo-classes, and pseudo-elements: nest each one under the selector it belongs to inside the shared deep block. Multiple sibling `&:deep(...)` blocks are allowed only when the targets have no suitable shared library-owned parent below the component root, so their only common parent is the component root itself. Under these nesting-capable conditions, do not flatten the business root plus `:deep()` or scatter comma-separated deep rules.

## Scenario 1: Consolidate Deep Library Selectors

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

## Review Checklist

- Deep rules target named selectors and share the nearest useful library ancestor.
