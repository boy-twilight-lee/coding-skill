# Async and Try/Catch

Owns Core Rule 8.

## Mandatory Rules

1. Prefer `await` to `.then()` for ordinary asynchronous flow. A necessary condition for requiring try/catch around await is that the awaited operation can throw synchronously or reject its promise. If its implementation or documented contract confirms that neither can occur, do not use try/catch solely for that await. A success-only result type or the absence of observed failures does not establish this guarantee. When failure is possible or unverified, the await must be inside a try block with a catch in its current function, or in the module for top-level await. This includes return await and awaits inside conditions. A caller's catch or try/finally without catch is insufficient. Related awaits in one cohesive flow may share one try/catch. Keep any catch needed for other statements that can throw.
2. When catch is required by the failure condition above, keep it even when it does nothing; `catch {}` is allowed. Do not invent reporting or recovery merely to fill it. If failure must reach the caller, rethrow from the required catch. Both empty and rethrow-only catches are valid and must not be removed as redundant while the failure condition holds; select their behavior according to the operation's failure contract.
3. Under this skill's guaranteed caught-error message contract, read `error.message` directly without `instanceof Error`, `typeof`, or fallback branches. This is a skill contract, not a general JavaScript guarantee; report actual compiler or upstream-contract conflicts rather than silently changing the rule.

## Scenario 1: Keep Try/Catch Even When Catch Is Empty

Assume `getCandidate` can throw or reject. Lack of local handling does not make the operation non-throwing.

**Positive example:**

```ts
try {
  const candidate = await getCandidate(candidateId)
  detail.value = candidate
} catch {}
```

**Negative example:**

Do not omit the catch merely because no local handling is required or the caller handles failures:

```ts
const candidate = await getCandidate(candidateId)
detail.value = candidate
```

Do not replace ordinary sequential flow with a then chain:

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

## Scenario 2: Share a Catch across Related Awaits

**Positive example:**

```ts
try {
  const profile = await fetchCandidateProfile(candidateId)
  const permissions = await fetchCandidatePermissions(profile.roleId)
} catch {}
```

One cohesive flow does not require a separate wrapper for each await. Each await that can throw or reject must remain within the current function's try block; a catch outside a callback does not protect an await inside that callback.

## Scenario 3: Preserve the Caller's Failure Contract

**Positive example:**

When the caller must receive the save result or failure, retain return await and rethrow from catch:

```ts
const submitCandidate = async (): Promise<Candidate> => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    throw error
  }
}
```

An empty catch consumes the rejection. Use it when no handling or propagation is required; do not remove mandatory try/catch or substitute an empty catch for an existing propagation contract.

## Scenario 4: Read the Guaranteed Message Directly

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

## Scenario 5: Omit Try/Catch for a Verified Non-Throwing Operation

Assume the implementation of `readCachedCandidate` has been verified to always fulfill, including cache misses, without synchronous throws or promise rejection. The following state assignment also needs no exception handling.

**Positive example:**

```ts
const candidate = await readCachedCandidate(candidateId)
detail.value = candidate
```

**Negative example:**

Do not add an unreachable catch merely because this verified operation is asynchronous:

```ts
try {
  const candidate = await readCachedCandidate(candidateId)
  detail.value = candidate
} catch {}
```

## Review Checklist

- Verify whether the awaited operation can throw or reject. Operations confirmed to do neither do not use try/catch solely for await; do not infer this guarantee from result types or observed success.
- Every await with possible or unverified failure uses try/catch in its current function or top-level module, including return await and condition awaits. Preserve catches required by other throwing statements.
- Empty and rethrow-only catches remain allowed when the failure condition holds; related awaits may share one catch without unnecessary nesting.
- Catch behavior preserves the intended failure contract without invented reporting or recovery.
- Caught messages are read directly; actual typing or upstream-contract conflicts are reported.
