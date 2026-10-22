# Blank Line Examples

Owns Core Rule 10.

## Mandatory Rules

1. Keep the complete body of each component selector contiguous: no blank lines between ordinary declarations, nested children or siblings, pseudo-classes/elements, state or deep branches, or local mixin definitions and calls. Do not use blank lines as logical grouping within a component; indentation and braces provide the hierarchy. Never leave file-leading, file-trailing, consecutive, or block-edge blank lines. At most one optional blank line may separate genuinely independent top-level stylesheet roots. A normal final newline is retained.

## Scenario 1: Keep Component Styles Contiguous

The examples below demonstrate contiguous component bodies across ordinary nesting, states, deep branches, and mixins.

### Positive example 1: Contiguous declarations and DOM branches

Place child selectors immediately after declarations; sibling header/body branches are contiguous too.

```less
.cand-card {
  padding: 16px;
  background: #fff;
  .cand-card-header {
    height: 40px;
    display: flex;
    align-items: center;
    .cand-card-title {
      font-weight: 600;
    }
  }
  .cand-card-body {
    padding: 12px 0;
  }
}
```

### Positive example 2: Contiguous pseudo and state branches

Keep owner declarations, hover, and business states adjacent without blank-line separators.

```less
.cand-card {
  cursor: pointer;
  border: 1px solid #dcdfe6;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  &.cand-card-active {
    border-color: #409eff;
  }
}
```

### Positive example 3: Contiguous deep branches

Assume the library DOM is verified to match this hierarchy. Deep blocks, descendants, and adjacent deep branches contain no blank lines.

```less
.cand-form {
  &:deep(.el-input) {
    .el-input__wrapper {
      padding: 0 12px;
      .el-input__inner {
        height: 36px;
      }
    }
  }
  &:deep(.el-select) {
    .el-select__wrapper {
      height: 36px;
    }
  }
}
```

### Positive example 4: Contiguous mixin definitions and consumers

Keep the mixin at the common DOM owner top, with no blank line after its definition or between subsequent declarations and consumers.

```less
.cand-row {
  .center() {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  display: flex;
  gap: 8px;
  .cand-row-avatar {
    height: 32px;
    width: 32px;
    .center();
  }
  .cand-row-action {
    cursor: pointer;
    height: 32px;
    width: 32px;
    .center();
  }
}
```

**Negative example:**

Do not insert blank lines inside the component, even to separate declarations or sibling selectors:

```less
.cand-card {

  padding: 16px;


  display: flex;

  .cand-card-title {

    font-weight: 600;

  }

  .cand-card-desc {
    line-height: 24px;
  }

}
```

## Review Checklist

- Component roots contain no blank lines, including between sibling, pseudo/state/deep, or mixin blocks; independent top-level roots have at most one optional separator.
