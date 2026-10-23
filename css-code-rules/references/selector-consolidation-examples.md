# Selector Consolidation Examples

Owns Core Rule 12.

## Mandatory Rules

1. Do not duplicate blocks for padding, border, layout, or state. Consolidate related child selectors under their parent and extract repeated patterns only when the reuse is real.

## Scenario 1: Consolidate Duplicate Selector Blocks

Situation: one child selector was repeated for spacing, border, and layout edits.

**Positive example:**

Consolidate it beneath its actual DOM parent, preserving the DOM hierarchy:

```less
.talent-card {
  .talent-card-header {
    padding: 12px 16px;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
  }
}
```

**Negative example:**

Do not separate the same selector by declaration category:

```less
.talent-card-header {
  padding: 12px 16px;
}
.talent-card-header {
  border-bottom: 1px solid #dcdfe6;
}
.talent-card-header {
  display: flex;
  align-items: center;
}
```

Likewise, keep all child changes for one business state inside the parent's state block. Extract a reusable abstraction only when multiple real consumers share the behavior; simple consolidation does not automatically justify a mixin.

## Review Checklist

- Duplicate selector or state blocks are consolidated under their owners.
