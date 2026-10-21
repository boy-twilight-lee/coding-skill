# Reuse and Redundancy Examples

## Mandatory Rules

1. Define `box-sizing: border-box` once in the established global or top-level rule; never repeat it in components. When a fixed dimension already establishes the minimum size, do not repeat the corresponding minimum dimension or an equivalent fixed flex basis. Omit declarations that have no effect in the element's actual formatting context. Extract recurring layout, truncation, transition, or animation patterns into a focused Less/Sass mixin, variable, or established utility only after genuine repetition exists. Do not redeclare values already provided by the established global reset or browser defaults. Keep an otherwise redundant declaration only when it is necessary for a specific, observable layout or typographic result.

Use these scenarios to remove ineffective declarations and extract focused abstractions only after real repetition exists.

## Scenario 1: Remove Redundant Fixed-Size Declarations

Situation: a flex child has a fixed square size.

**Positive example:**

Keep only the declarations with distinct effects:

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }
}
```

**Negative example:**

Remove equivalent or ineffective declarations:

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    min-height: 40px;
    min-width: 40px;
    display: block;
    flex: 0 0 40px;
    flex-shrink: 0;
  }
}
```

Here the matching minimum dimensions repeat the fixed dimensions, `display: block` has no useful effect for this flex item, and the fixed flex basis duplicates the width while conflicting with the simpler shrink rule.

## Scenario 2: Distinguish Reset Noise from Observable Behavior

Situation: the global reset already defines box sizing and base element resets.

**Positive example:**

Keep only declarations that produce the intended card typography:

```less
.talent-card {
  font-size: 14px;
  line-height: 1;
}
```

**Negative example:**

Do not repeat the global reset on that same card:

```less
.talent-card {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1;
}
```

The decision depends on computed layout behavior. Do not remove a declaration solely because it resembles a default; verify whether it changes sizing, truncation, typography, or interaction on the matched element.

## Scenario 3: Extract a Repeated Pattern

Situation: two owned elements use the same inline-flex centering behavior and transition value.

**Positive example:**

After repetition is confirmed, extract focused abstractions:

```less
.inline-center-fixed() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.text-ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@motion-standard: transform 160ms ease;

.talent-card {
  .talent-card-action {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-badge {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-title {
    .text-ellipsis();
  }

  .talent-card-summary {
    .text-ellipsis();
  }
}
```

Keep the mixin focused on one recurring behavior. Do not create a broad mixin that also injects unrelated color, spacing, or component-specific dimensions. Do not extract a pattern used only once, because indirection would obscure ownership without creating reuse.

**Negative example:**

Do not extract that same pattern for only one consumer or mix unrelated component styling into it:

```less
.talent-action-style() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  padding: 8px;
  color: var(--color-primary);
}

.talent-card-action {
  .talent-action-style();
}
```

## Scenario 4: Use a Loop Only for a Stable Mechanical Sequence

Situation: six card delay modifiers follow the same naming rule and increase by the same interval.

**Positive example:**

Use a scoped Less loop when it makes the repeated relationship explicit:

```less
.talent-card {
  .generate-delay(@index) when (@index <= 6) {
    &.talent-card-delay-@{index} {
      transition-delay: (@index * 40ms);
    }
    .generate-delay(@index + 1);
  }
  .generate-delay(1);
}
```

The loop owns one predictable sequence, generates complete readable modifier names, and keeps the increment in one place. Do not use a loop for unrelated values, irregular business states, or a short one-off declaration set whose meaning becomes less visible through generation.

**Negative example:**

Do not force irregular business states into a numeric loop:

```less
.talent-card {
  .generate-state(@index) when (@index <= 3) {
    &.talent-card-state-@{index} {
      color: if(@index = 1, green, if(@index = 2, orange, red));
    }
    .generate-state(@index + 1);
  }
  .generate-state(1);
}
```

## Review Checklist

- Every declaration has a distinct observable effect.
- Mixins, utilities, and variables represent proven repetition with focused ownership.
- Loops are limited to stable mechanical sequences with readable generated selectors.
