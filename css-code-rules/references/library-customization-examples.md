# Component Library Customization Examples

Owns Core Rule 7.

## Mandatory Rules

1. Apply this customization rule only to third-party component libraries; it does not impose requirements on other business styles. For a component-library override, prefer a documented library custom property or an ordinary scoped/deep selector rather than unnecessary specificity or `!important`.

## Scenario 1: Customize a Library Locally

Situation: customize an Element Plus dialog. This example assumes the installed library version documents and consumes `--el-dialog-border-radius`. Verify that support and the rendered owning element before using it. The custom property is necessary here to demonstrate the library's official customization API; ordinary business-style examples use concrete literals.

**Positive example:**

For this component-library case only, set the documented variable on the owning component root:

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

Within component-library customization, if no supported documented variable exists, use the smallest ordinary nested or deep selector that reliably reaches the target. Confirm the installed library version, documentation, and rendered DOM before overriding internals. This example does not prescribe CSS variables for ordinary business styles.

## Review Checklist

- The customization rule is applied only to component-library overrides.
- Any retained custom property demonstrates a necessary official library API whose installed-version support and target element are checked; other examples use concrete literals.
