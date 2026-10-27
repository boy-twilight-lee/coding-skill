# Formatting and Final Review Examples

Owns Core Rule 14.

## Mandatory Rules

1. Retain the pre-format content. When restoring formatter-only changes, use that content rather than resetting to `HEAD`, which may omit pre-existing user edits. Report any whole-file check failure caused solely by untouched formatting. Re-check the final diff against these structure rules and the established local convention.

## Scenario 1: Format and Review a Stylesheet

Situation: `src/components/talent-card/index.less` contains user edits and needs the configured formatter followed by a stylesheet-specific review.

**Positive example:**

Retain the pre-format content, then run the repository's configured formatter:

```text
prettier --write src/components/talent-card/index.less
```

After formatting, re-check the changed file for rules a generic formatter cannot enforce:

- Actual DOM parent hierarchy, child order, and common-ancestor mixin placement.
- Correct `:deep(...)` consolidation.
- Whitespace follows [Blank Line Examples](blank-line-examples.md).
- Required declaration category order.
- Duplicate blocks and redundant declarations.
- Target-browser compatibility.

Formatter success confirms syntax and configured formatting, not compliance with all style rules.

## Review Checklist

- Formatter restoration uses pre-format content and preserves user edits; legacy formatting failures are reported.
- The final review covers stylesheet structure and behavior beyond formatter success.
