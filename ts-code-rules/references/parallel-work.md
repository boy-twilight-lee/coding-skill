# Sequential and Parallel Dependencies

## Mandatory Rule

Keep dependent operations sequential. Use `Promise.all` only when operations are independent, may start together, and should share one failure boundary.

## Choose Work Ordering from Dependencies

**Positive example:**

Keep dependent work in order:

```ts
const profile = await fetchCandidateProfile(candidateId)
const permissions = await fetchCandidatePermissions(profile.roleId)
```

Start independent requests together only when their shared failure behavior is intended:

```ts
const [roles, benefits] = await Promise.all([
  fetchRoles(),
  fetchBenefits()
])
```

**Negative example:**

Do not start the permission request before the profile supplies its input:

```ts
const [profile, permissions] = await Promise.all([
  fetchCandidateProfile(candidateId),
  fetchCandidatePermissions(profile.roleId)
])
```

Do not parallelize merely to shorten code when one result controls whether the next operation is allowed.

## Review Checklist

- Dependent operations await their prerequisites.
- Parallel operations are independent and intentionally share a failure boundary.
- Work is not parallelized when an earlier result controls whether a later operation is allowed.
