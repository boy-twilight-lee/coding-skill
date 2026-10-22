# Formatting and Final Diff Review

## Mandatory Rule

Use the repository's configured Prettier formatter only on files changed for the task. Compare its output with the pre-format state and restore formatting-only changes outside the task's affected regions, preserving pre-existing user edits. Keep formatting adjustments necessary for the changed syntax. If a whole-file formatter check still fails solely on untouched formatting, report that limitation instead of broadening the edit silently. Re-check the final diff against these rules and the established local convention.

## Format Only Changed Files

**Positive example:**

Run the configured Prettier command only for TypeScript, TSX, or Vue files changed by the task. Do not format an entire directory when unrelated user changes may exist.

```text
prettier --write src/components/candidate-card/index.vue
```

Before formatting, retain the current file content so existing user edits can be distinguished from formatter output. After formatting, restore formatting-only changes outside the task's affected regions from that pre-format content, not from `HEAD`. Keep adjustments needed for the changed syntax. If a whole-file formatter check still fails because of untouched legacy formatting, report that limitation without expanding the edit or claiming the check passed.

After formatting, manually re-check rules Prettier cannot enforce:

- Change scope and absence of drive-by cleanup.
- Responsibility comments for business declarations and functions, plus comments for key processing stages, as required by the code-quality rules; clear names do not waive coverage, and mechanical statements need no narration.
- Meaningful blank lines.
- Import grouping and source-layer ownership.
- Awaited promises and intentional error paths.
- Target-runtime API support.

Formatter success does not prove architectural or compatibility compliance.

**Negative example:**

Do not broaden that same formatting task to the entire source tree:

```text
prettier --write src
```

## Review Checklist

- Only changed files are formatted with the repository's configured Prettier command.
- Unrelated formatter churn is restored from the pre-format content without losing existing user edits.
- Untouched legacy formatting failures are reported rather than hidden by expanding scope.
- The final diff is reviewed against every applicable rule; formatter success alone does not prove compliance.
