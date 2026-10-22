# Error Handling Ownership

## Mandatory Rule

Use `try/catch` only at the layer that can recover, translate, enrich, or report the error; otherwise let the rejection propagate.

## Handle Errors at Their Owner

A page may report a user-facing failure; an infrastructure boundary may translate or enrich an error. A catch that only rethrows without adding responsibility is unnecessary. Keep the original rejection path when the caller owns handling.

```ts
// <zh: load candidate details and synchronize the page state.>
const loadCandidate = async () => {
  try {
    // <zh: store the candidate details returned by the API.>
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    // <zh: report the load failure and delegate handling to the page error boundary.>
    reportCandidateLoadError(error)
    throw error
  }
}
```

Reporting and rethrowing is appropriate only when both actions belong to this boundary.

## Review Checklist

- Each catch owns recovery, reporting, enrichment, or translation.
- Errors propagate when the caller owns failure handling.
