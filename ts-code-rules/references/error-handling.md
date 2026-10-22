# Error Handling

Owns Core Rule 9.

## Mandatory Rules

1. Catch only at the layer that can recover, translate, enrich, or report the error; otherwise let the rejection propagate. A catch that only rethrows without adding responsibility is unnecessary.
2. Under this skill's guaranteed caught-error message contract, read `error.message` directly. Do not add `instanceof Error`, `typeof`, or fallback branches around that property. This is a skill contract, not a general JavaScript guarantee; report actual compiler or upstream-contract conflicts rather than silently changing the rule.

## Scenario 1: Handle Errors at Their Owner

**Positive example:**

This boundary records the loading failure and delegates further handling to its caller:

```ts
const loadCandidate = async () => {
  try {
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    reportCandidateLoadError(error)
    throw error
  }
}
```

Reporting and rethrowing is appropriate only when both actions belong to this boundary. A page may report a user-facing failure; infrastructure may translate or enrich it. When the caller owns all failure handling, allow rejection to propagate without a catch.

**Negative example:**

This catch adds no recovery, translation, context, or reporting:

```ts
const loadCandidate = async () => {
  try {
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    throw error
  }
}
```

## Scenario 2: Read the Guaranteed Message Directly

**Positive example:**

```ts
try {
  await saveCandidate(payload)
} catch (error) {
  Message.error(error.message)
}
```

**Negative example:**

```ts
try {
  await saveCandidate(payload)
} catch (error) {
  Message.error(error instanceof Error ? error.message : '保存失败')
}
```

The positive form depends on the declared message contract. If active catch-variable typing or an upstream error source conflicts with it, report the exact conflict and smallest necessary deviation according to the skill entrypoint.

## Review Checklist

- Every catch owns recovery, reporting, enrichment, or translation; otherwise errors propagate.
- Caught messages are read directly without narrowing or fallbacks around the guaranteed property.
- Actual typing or upstream-contract conflicts are reported rather than hidden.
