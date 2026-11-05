# Abstraction and Change-Owned Cleanup

Owns Core Rule 5.

## Mandatory Rules

1. **Prohibit premature abstraction.** Keep simple one-use logic inline near its use. Extract a function, class, or composable only for real complexity, reuse, or an independent responsibility; do not split a continuous workflow into helpers without that value.
2. **Validate once at the boundary.** Validate external data at the boundary where it enters a trusted internal flow, then use the validated type contracts internally instead of repeating the same checks at every layer. Revalidate when data changes invalidate a guarantee or a new untrusted boundary is crossed. Type annotations and assertions do not replace runtime validation; new business conditions still require their own checks.
3. **Avoid redundant structures.** Remove pass-through wrappers and meaningless intermediates. Retain structures that add business meaning, reuse, type narrowing, material readability, or correctness. Do not create a wrapper, variable, callback extraction, or guard merely to give it a name or attach a comment.
4. **Limit cleanup to the current change.** Remove unused imports, variables, functions, types, temporary debugging, obsolete comments, and redundant aliases owned by the change. Do not expand this into unrelated legacy cleanup; separately requested cleanup still requires verification that removal is safe.

Preserve the try/catch required by [Async and Try/Catch](async-and-try-catch.md) when an awaited operation can throw or reject, including rethrow-only catches. Do not add a catch solely for an await verified not to throw or reject; preserve any catch needed for other throwing statements.

## Example Context

These excerpts use owner-provided forms, candidate records, state, and existing helpers. Each pair holds the business result constant and changes only the structure under discussion. Nonessential comments are omitted under the skill's example-presentation policy.

## Scenario 1: Inline a Simple One-Use Transformation

The name is trimmed only while building this payload; there is no separate normalization policy or other consumer.

**Positive example:**

```ts
const candidatePayload = { ...form, name: form.name.trim() }
```

**Negative example:**

The helper merely moves that one expression away from its only use.

```ts
const normalizeCandidateName = (name: string) => {
  return name.trim()
}
const candidatePayload = { ...form, name: normalizeCandidateName(form.name) }
```

## Scenario 2: Remove a Pass-Through Callback Wrapper

The existing `hasValidContact(candidate)` predicate already owns the contact rule and is compatible with `filter`. No argument adaptation, binding, or additional behavior is needed.

**Positive example:**

```ts
const contactableCandidates = candidates.filter(hasValidContact)
```

**Negative example:**

The new one-use callback only forwards the same candidate and result.

```ts
const checkCandidateContact = (candidate: Candidate) => {
  return hasValidContact(candidate)
}
const contactableCandidates = candidates.filter(checkCandidateContact)
```

## Scenario 3: Distinguish Meaningless and Useful Intermediates

Selecting a candidate only copies its identifier into the existing selection state.

**Positive example:**

```ts
selection.candidateId = candidate.id
```

**Negative example:**

The temporary name adds no business meaning, reuse, narrowing, or readability to this assignment.

```ts
const id = candidate.id
selection.candidateId = id
```

**Useful intermediate to retain:**

A named remaining quota expresses a business quantity and is consumed twice. It is not a redundant alias and should not be inlined merely to reduce declarations.

```ts
const remainingQuota = dailyQuota - submittedCount
const canSubmit = remainingQuota > 0
const quotaTip = formatQuotaTip(remainingQuota)
```

## Scenario 4: Remove Only a Verified Redundant Guard

Both versions first filter ordinary candidate data records to `ready`. No status changes occur between filtering and selection; adding an identifier to `selectedIds` does not mutate candidate status. The inner status check is therefore already guaranteed by the visible preceding filter.

**Positive example:**

```ts
candidates.filter((candidate) => candidate.status === 'ready').forEach((candidate) => {
  selectedIds.add(candidate.id)
})
```

**Negative example:**

```ts
candidates.filter((candidate) => candidate.status === 'ready').forEach((candidate) => {
  if (candidate.status !== 'ready') return
  selectedIds.add(candidate.id)
})
```

**Necessary guard to retain:**

When iterating the unfiltered list, non-ready candidates remain possible. Keep the guard that enforces the selection rule. A TypeScript annotation or an assumption about callers alone does not prove a runtime guarantee.

```ts
candidates.forEach((candidate) => {
  if (candidate.status !== 'ready') return
  selectedIds.add(candidate.id)
})
```

## Scenario 5: Validate External Data Once, Then Use Its Type Contract

An external candidate identifier arrives as `unknown`. The boundary parser owns validation that it is a string containing non-whitespace text. The returned string is an immutable value, so the guarantee remains valid during this internal assignment. Parsing is an independent boundary responsibility even with one caller.

**Positive example:**

The parser rejects invalid input once; the internal consumer uses the validated result directly.

```ts
const parseCandidateId = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('候选人标识无效')
  }
  return value
}
const candidateId = parseCandidateId(externalCandidateId)
selection.candidateId = candidateId
```

**Negative example:**

The internal consumer repeats the parser's string and nonempty checks on the unchanged value. Repeating this at more internal layers adds no guarantee.

```ts
const parseCandidateId = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('候选人标识无效')
  }
  return value
}
const candidateId = parseCandidateId(externalCandidateId)
if (typeof candidateId !== 'string' || candidateId.trim() === '') {
  throw new Error('候选人标识无效')
}
selection.candidateId = candidateId
```

A cast such as `externalCandidateId as string` would skip the parser rather than validate anything. A later edit or new external payload requires validation at its own boundary; authorization, current status, and other new business decisions are not duplicate input checks.

## Scenario 6: Extract a Genuinely Reused Responsibility

Draft and submit payloads follow the same verified normalization contract: trim the name, remove whitespace from the mobile number, and represent an unselected role as `null`. The helper owns that shared conversion; reuse is visible at both call sites.

**Positive example:**

```ts
const buildCandidatePayload = (form: CandidateForm) => {
  return {
    name: form.name.trim(),
    mobile: form.mobile.replace(/\s/g, ''),
    roleCode: form.roleCode ?? null
  }
}
const draftPayload = buildCandidatePayload(draftForm)
const submitPayload = buildCandidatePayload(submitForm)
```

**Negative example:**

Do not interpret the inline rule as a ban on extraction and duplicate this shared conversion at both call sites.

```ts
const draftPayload = {
  name: draftForm.name.trim(),
  mobile: draftForm.mobile.replace(/\s/g, ''),
  roleCode: draftForm.roleCode ?? null
}
const submitPayload = {
  name: submitForm.name.trim(),
  mobile: submitForm.mobile.replace(/\s/g, ''),
  roleCode: submitForm.roleCode ?? null
}
```

Extraction may also be justified by real complexity or an independent responsibility even with one consumer; the number of calls alone does not decide placement.

## Scenario 7: Clean Only Artifacts Owned by the Change

The changed save path no longer uses `debugCandidate` or the temporary debug output. The page already owns save-failure feedback through `Message`, without duplicate upstream reporting. Both examples preserve that failure handling.

**Positive example:**

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

The unused import, unused alias, and temporary log belong to this change and should not remain in its save path.

```ts
import { debugCandidate, saveCandidate } from '@/apis'

const candidatePayload = buildCandidatePayload(form)
const previousCandidatePayload = candidatePayload
console.log(candidatePayload)
try {
  await saveCandidate(candidatePayload)
} catch (error) {
  Message.error(error.message)
}
```

This cleanup does not authorize deleting a neighboring legacy export with unverified callers or changing unrelated naming and formatting.

## Review Checklist

- Simple one-use logic stays near its use; extraction has real complexity, reuse, or an independent responsibility.
- External data is validated at its trust boundary; internal consumers do not repeat checks of unchanged guarantees. Assertions are not validation, and new untrusted inputs or invalidated guarantees are checked again.
- Wrappers and intermediates add concrete value; guard removal follows a verified runtime contract, not an assumption. Comments do not justify redundant structure.
- Dead code and debugging owned by the change are removed without unrelated cleanup or public-contract changes.
- Necessary guards and required asynchronous failure handling remain intact.
