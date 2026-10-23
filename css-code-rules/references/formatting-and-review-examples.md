# Formatting and Final Review Examples

Owns Core Rule 14.

## Mandatory Rules

1. Run the repository formatter only on changed style files. Retain the pre-format content and restore formatting-only changes outside the task's affected regions from that content, preserving user edits rather than resetting to `HEAD`. Keep formatting necessary for the changed syntax; report any whole-file check failure caused solely by untouched formatting instead of expanding the edit. Re-check the final diff against these structure rules and the established local convention.

## Scenario 1: Format Only the Changed Style Files

Situation: a task changes `src/components/talent-card/index.less` while unrelated style files already contain formatting differences.

**Positive example:**

Run the repository's configured formatter against the changed file only:

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

**Negative example:**

Do not broaden that same formatting task to every style file:

```text
prettier --write "src/**/*.less"
```

## Review Checklist

- Only changed style files are formatted; unrelated formatter changes are restored without losing user edits, and legacy formatting failures are reported.
