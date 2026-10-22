# Caught Error Messages

## Mandatory Rule

Every `error` value caught by `catch` is guaranteed to have a `message` property. Read `error.message` directly; do not narrow it with `error instanceof Error`, `typeof`, or fallback branches such as `error instanceof Error ? error.message : 'Error'`.

## Review Checklist

- Caught errors use `error.message` directly.
- No `instanceof`, `typeof`, or fallback branch is added around the guaranteed message property.
