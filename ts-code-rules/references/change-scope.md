# Change Scope

## Mandatory Rule

Keep changes limited to the requested feature or defect. Preserve existing comments and do not reformat, rename, reorder imports, or rewrite unrelated code as drive-by cleanup.

## Keep the Change Scoped

Situation: a defect fix changes one status branch in a service that also contains unrelated naming and formatting issues.

**Positive example:**

Change the defective branch and its directly affected imports, comments, tests, and types. Do not rename neighboring functions, reorder unrelated imports, or retain unrelated whole-file formatting changes. A formatter may process the changed file, but restore its formatting-only changes outside the affected regions against the pre-format state, preserving pre-existing user edits. Preserve existing comments unless the current change makes them inaccurate or obsolete.

If the defect is an inclusive retry boundary, keep the correction local:

```ts
// <zh: determine whether the candidate synchronization task may still be retried.>
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

**Negative example:**

Do not combine the same boundary fix with an unrelated rename and return-shape change:

```ts
// <zh: determine whether the candidate synchronization task may still be retried and return a wrapped result.>
export const evaluateCandidateSyncRetry = (retryCount: number) => {
  return { allowed: retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT }
}
```

Unrelated renaming, logging rewrites, or conversion of neighboring functions to a new abstraction enlarges regression risk and obscures the actual defect correction.

## Review Checklist

- The diff contains only requested behavior and directly affected imports, comments, types, tests, and cleanup.
- Existing comments and pre-existing user edits are preserved unless the task makes them inaccurate or obsolete.
