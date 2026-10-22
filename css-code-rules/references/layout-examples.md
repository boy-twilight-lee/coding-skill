# Layout Examples

Owns Core Rule 6.

## Mandatory Rules

1. Use Flexbox for one-dimensional arrangements along a row or column. Consider Grid only when the layout requires two-dimensional coordination of rows and columns.

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

## Review Checklist

- One-dimensional layouts use Flexbox; Grid is considered only for two-dimensional row-and-column coordination.
