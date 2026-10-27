# Contract and Edit Preservation

Owns Core Rule 1.

## Mandatory Rule

Preserve existing public contracts and pre-existing user edits. Update comments when changed behavior makes them inaccurate or obsolete.

## Scenario 1: Preserve the Public Return Contract

Situation: a retry-boundary fix changes a boolean condition while consumers still expect a boolean return value.

**Positive example:**

Retain the existing public function name and boolean return shape so its consumers remain compatible.

The inclusive retry boundary still returns a boolean:

```ts
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

**Negative example:**

Changing the public name and replacing the boolean with an object breaks that existing consumer contract:

```ts
export const evaluateCandidateSyncRetry = (retryCount: number) => {
  return { allowed: retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT }
}
```

## Preserve User Edits during Formatting

Retain the pre-format content when a formatter may rewrite a file containing user edits. When restoring formatter-only changes, restore from that pre-format content rather than resetting the file to HEAD; HEAD may omit the user's uncommitted work.

## Review Checklist

- Existing public names, argument contracts, and return shapes remain compatible unless the task explicitly changes them.
- Pre-existing user edits survive formatting and restoration.
- Comments remain accurate after behavior changes.
