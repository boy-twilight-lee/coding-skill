# Compatibility Examples

Owns Core Rule 13.

## Mandatory Rules

1. Do not introduce CSS APIs, selectors, units, or properties with known target-browser compatibility problems. Confirm support or use the repository-approved fallback before adding newer features.

## Scenario 1: Use a Supported Compatibility Fallback

Situation: a concise modern selector would simplify a form-field error style, but the repository's target-browser matrix may not support it.

**Positive example:**

When the target matrix does not support that selector, expose a repository-approved state class from the component logic:

```less
.form-field {
  &.form-field-error {
    border-color: #f56c6c;
  }
}
```

Before choosing a fallback:

1. Read the repository's Browserslist or documented target matrix.
2. Check whether the configured PostCSS or build tooling transforms the feature.
3. Prefer an existing project pattern over inventing a new compatibility layer.
4. Verify both the supported path and fallback behavior in the affected target.

**Negative example:**

Do not use the modern selector for that same error state based only on syntax familiarity:

```less
.form-field:has(.form-field-error-message) {
  border-color: #f56c6c;
}
```

The state-class fallback is illustrative. It is not a universal claim that `:has()` is unsupported; the repository's actual targets decide.

## Review Checklist

- Newer CSS features match actual target-browser and tooling support.
