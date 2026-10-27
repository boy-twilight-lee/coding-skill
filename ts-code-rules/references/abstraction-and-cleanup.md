# Abstraction and Change-Owned Cleanup

Owns Core Rule 5.

## Mandatory Rule

Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

## Scenario 1: Avoid a One-Off Abstraction

The asynchronous examples assume the page owns save-failure feedback through its existing `Message` API, with no duplicate reporting upstream. Positive and negative examples keep the same error handling so only the abstraction or cleanup differs.

**Positive example:**

Keep a clear one-time transformation at its call site:

```ts
const candidateName = form.name.trim()
try {
  await saveCandidate({ ...form, name: candidateName })
} catch (error) {
  Message.error(error.message)
}
```

**Negative example:**

Do not create a wrapper that only renames or forwards one operation:

```ts
const getCandidateName = (name: string) => {
  return name.trim()
}
```

```ts
try {
  await saveCandidate({ ...form, name: getCandidateName(form.name) })
} catch (error) {
  Message.error(error.message)
}
```

Extract when logic is reused, independently testable, genuinely complex, or forms a clear responsibility boundary.

## Scenario 2: Remove Only Change-Owned Dead Code

After an implementation change, remove imports, variables, types, debug logging, aliases, and wrappers made unused by that change:

**Positive example:**

After cleanup, keep only the imports and behavior required by the new path:

```ts
import { saveCandidate } from '@/apis'

const candidatePayload = buildCandidatePayload(form)
try {
  await saveCandidate(candidatePayload)
} catch (error) {
  Message.error(error.message)
}
```

**Negative example:**

Before cleanup, the same changed path still contains the removed debugger dependency, console output, and pass-through wrapper:

```ts
import { debugCandidate, saveCandidate } from '@/apis'

const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
try {
  await submitCandidateRequest(candidatePayload)
} catch (error) {
  Message.error(error.message)
}
```

Do not remove unrelated legacy code merely because it appears unused unless the task includes that cleanup and project tooling confirms it is safe. Cleanup follows ownership of the current change, not a file-wide desire for tidiness.

## Scenario 3: Remove Redundant Wrappers, Intermediates, and Guards

**Positive example:**

Prefer the direct predicate and the verified callback contract:

```ts
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

watch(phone, () => {
  resetVerification()
})
```

**Negative example:**

Do not retain an extra function, variable, or condition in that same workflow merely to create a name or comment target:

```ts
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

watch(phone, (currentPhone, previousPhone) => {
  const hasChanged = currentPhone !== previousPhone
  if (!hasChanged) return
  resetVerification()
})
```

An intermediate value is still useful when it names a real business concept, is reused, enables type narrowing, or makes a complex expression materially clearer. A guard remains necessary when the caller, framework, or API can deliver the guarded state; verify that contract before simplifying it.

The try/catch required around an await that can throw or reject by [Async and Try/Catch](async-and-try-catch.md) must not be removed as redundant, including a catch that preserves failure propagation by rethrowing. Follow that reference for meaningful handling and the documented exception for intentionally ignored failures. Do not retain a wrapper solely for an await verified not to throw or reject; preserve any catch needed for other throwing statements.

## Review Checklist

- Abstractions represent reuse, complexity, or an independent responsibility.
- Change-owned dead code and debugging artifacts are removed without unrelated legacy cleanup.
- No comment justifies a pass-through wrapper, meaningless intermediate, or redundant guard.
- One-use continuations remain inline unless extraction has concrete value; caller and framework contracts are verified before removing guards.
