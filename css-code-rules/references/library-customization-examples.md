# Component Library Customization Examples

Owns Core Rule 7.

## Mandatory Rules

1. Apply this customization rule only to third-party component libraries; it does not impose requirements on other business styles. For a component-library override, prefer a documented library custom property or an ordinary scoped/deep selector rather than unnecessary specificity or `!important`.

## Scenario 1: Customize a Library Locally

Situation: customize an Element Plus dialog. Verify that the installed library version documents and consumes `--el-dialog-border-radius`, and that the variable is set on the rendered owning element.

**Positive example:**

Set the documented variable on the owning component root:

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

If no supported documented variable exists, use the smallest ordinary nested or deep selector that reliably reaches the target. Confirm the installed library version, documentation, and rendered DOM before overriding internals.

## Review Checklist

- The customization rule is applied only to component-library overrides.
- Library custom properties have verified installed-version support and are set on the owning element.
