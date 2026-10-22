# Abstraction and Change-Owned Cleanup

## Mandatory Rule

Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

## Avoid a One-Off Abstraction

**Positive example:**

Keep a clear one-time transformation at its call site:

```ts
// <zh: store the candidate name required by the submission API.>
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

**Negative example:**

Do not create a wrapper that only renames or forwards one operation:

```ts
// <zh: return the trimmed candidate name.>
const getCandidateName = (name: string) => {
  return name.trim()
}
```

```ts
await saveCandidate({ ...form, name: getCandidateName(form.name) })
```

Extract when logic is reused, independently testable, genuinely complex, or forms a clear responsibility boundary.

## Remove Only Change-Owned Dead Code

After an implementation change, remove imports, variables, types, debug logging, aliases, and wrappers made unused by that change:

**Positive example:**

After cleanup, keep only the imports and behavior required by the new path:

```ts
import { saveCandidate } from '@/apis'

// <zh: store the submission payload for the current candidate.>
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

**Negative example:**

Before cleanup, the same changed path still contains the removed debugger dependency, console output, and pass-through wrapper:

```ts
import { debugCandidate, saveCandidate } from '@/apis'

// <zh: forward the candidate save request.>
const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
// <zh: store the submission payload for the current candidate.>
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
await submitCandidateRequest(candidatePayload)
```

Do not remove unrelated legacy code merely because it appears unused unless the task includes that cleanup and project tooling confirms it is safe. Cleanup follows ownership of the current change, not a file-wide desire for tidiness.

## Remove Redundant Wrappers, Intermediates, and Guards

**Positive example:**

Prefer the direct predicate and the verified callback contract:

```ts
// <zh: determine whether the current search field requires SMS verification.>
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// <zh: clear the previous SMS access signature when the phone number changes.>
watch(phone, () => {
  resetVerification()
})
```

**Negative example:**

Do not retain an extra function, variable, or condition in that same workflow merely to create a name or comment target:

```ts
// <zh: determine whether the current search field requires SMS verification.>
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ <zh: this wrapper only forwards another predicate and has no independent responsibility.>
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// <zh: clear the previous SMS access signature when the phone number changes.>
watch(phone, (currentPhone, previousPhone) => {
  // ❌ <zh: this one-use intermediate variable adds no business meaning.>
  const hasChanged = currentPhone !== previousPhone
  // ❌ <zh: the watcher already runs only when the source value changes, so this repeated check adds no protection.>
  if (!hasChanged) return
  resetVerification()
})
```

An intermediate value is still useful when it names a real business concept, is reused, enables type narrowing, or makes a complex expression materially clearer. A guard remains necessary when the caller, framework, or API can deliver the guarded state; verify that contract before simplifying it.

## Review Checklist

- Abstractions represent reuse, complexity, or an independent responsibility.
- Change-owned dead code and debugging artifacts are removed without unrelated legacy cleanup.
- No comment justifies a pass-through wrapper, meaningless intermediate, or redundant guard.
- One-use continuations remain inline unless extraction has concrete value; caller and framework contracts are verified before removing guards.
