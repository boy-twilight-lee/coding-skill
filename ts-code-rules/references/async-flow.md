# Async Flow

Owns Core Rule 8.

## Mandatory Rules

1. Prefer `await` to `.then()` for ordinary sequential work.
2. Keep dependent operations sequential. Use `Promise.all` only when operations are independent, may start together, and intentionally share one failure boundary. A preceding result may control permission to run the next operation even when its inputs are already known.
3. Never discard a Promise with unary `void`. Await it when completion matters; intentional background work must handle or explicitly report its own rejection.

## Scenario 1: Await a Sequential Result

**Positive example:**

```ts
const candidate = await getCandidate(candidateId)
detail.value = candidate
```

**Negative example:**

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

Await does not automatically require a catch. Read [Error Handling](error-handling.md) when adding or reviewing a failure boundary.

## Scenario 2: Choose Concurrency from Dependencies

**Positive example:**

Permissions depend on the loaded profile:

```ts
const profile = await fetchCandidateProfile(candidateId)
const permissions = await fetchCandidatePermissions(profile.roleId)
```

Roles and benefits may start together when their combined success/failure contract is intended:

```ts
const [roles, benefits] = await Promise.all([
  fetchRoles(),
  fetchBenefits()
])
```

**Negative example:**

Do not read the profile before its request has produced it:

```ts
const [profile, permissions] = await Promise.all([
  fetchCandidateProfile(candidateId),
  fetchCandidatePermissions(profile.roleId)
])
```

Do not parallelize merely to shorten code. A rejected `Promise.all` does not cancel other operations already started.

## Scenario 3: Own Background Failures

**Positive example:**

Wait for a save when later behavior depends on its result:

```ts
await saveCandidate(payload)
```

Exposure reporting may be non-blocking when the caller intentionally does not depend on completion and the operation owns rejection reporting:

```ts
const reportCandidateExposure = () => {
  reportExposureRequest().catch((error) => {
    reportTelemetryError(error)
  })
}

reportCandidateExposure()
```

This boundary adds failure ownership; it is not a pass-through wrapper. The reporting path must itself have an appropriate failure contract.

**Negative example:**

```ts
void saveCandidate(payload)
```

Removing `void` alone does not justify leaving a save unawaited. Make the completion and rejection contract explicit.

## Review Checklist

- Sequential work uses await; dependencies and execution permissions remain ordered.
- Parallel operations are independent and intentionally share a failure boundary.
- No Promise is discarded with unary void; background operations own their rejection path.
