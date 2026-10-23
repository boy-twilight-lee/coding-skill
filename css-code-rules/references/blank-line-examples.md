# Blank Line Examples

Owns Core Rule 10.

## Mandatory Rules

1. Keep stylesheet code contiguous: no blank lines between ordinary declarations, property groups, nested children or siblings, pseudo-classes/elements, state or deep branches, at-rules, or local mixin definitions and calls. This also applies between independent top-level stylesheet roots. Do not use blank lines as logical grouping; preserve normal line breaks and use indentation and braces to express hierarchy rather than collapsing styles onto one line. Never leave file-leading, file-trailing, consecutive, or block-edge blank lines. Retain one normal final newline. For Vue style blocks, apply this rule inside the stylesheet without changing separators between SFC blocks. Check the final output after formatting and style fixes. All stylesheet examples follow this format except the explicit whitespace counterexample below.

## Scenario 1: Keep Component Styles Contiguous

### Positive example 1: Contiguous declarations and DOM branches

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

Assume the library DOM is verified to match this hierarchy.

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

```less
.cand-row {
  display: flex;
  gap: 8px;
  .center() {
    display: flex;
    align-items: center;
    justify-content: center;
  }
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

### Positive example 5: Contiguous top-level roots

```less
.map-editor {
  position: relative;
  display: flex;
}
.map-preview {
  overflow: hidden;
}
```

**Negative example:**

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

## Formatter and Linter Guidance

Prettier preserves existing single blank lines and has no option to forbid them. ESLint's JavaScript/TypeScript empty-line rules do not enforce whitespace inside Less files or Vue style blocks.

When style-tool configuration is part of the requested task, use Stylelint with `@stylistic/stylelint-plugin` and set `@stylistic/max-empty-lines` to `0`. Keep inherited `declaration-empty-line-before`, `rule-empty-line-before`, `at-rule-empty-line-before`, `comment-empty-line-before`, and `@stylistic/block-closing-brace-empty-line-before` rules consistent with that limit by setting them to `never` or disabling conflicting requirements. Use syntax parsers appropriate to the actual files, such as `postcss-less` for Less and `postcss-html` for Vue style blocks. Apply the configured Stylelint fix after formatting and inspect the final result. If that tool is unavailable, remove blank lines in the changed stylesheet regions directly; do not install dependencies or rewrite project configuration solely to satisfy a normal style edit.
