# Code Quality Examples

## Mandatory Rules

1. Keep changes limited to the requested feature or defect. Preserve existing comments and do not reformat, rename, reorder imports, or rewrite unrelated code as drive-by cleanup.

2. Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

3. Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

4. Comment a runtime declaration only when its business meaning, units, lifecycle, invariant, data origin, or relationship cannot be made clear through naming, types, and nearby structure. Do not comment self-explanatory variables, constants, class fields, reactive state, refs, computed values, or destructured bindings merely because they are declarations. Place a justified comment immediately above the declaration, explain the non-obvious information, and write it in Chinese unless the project explicitly mandates another language, an external protocol or third-party term must be quoted exactly, or Chinese would make the technical meaning less accurate. Imports, function parameters, and type-only declarations do not require separate declaration comments. In a Vue SFC, follow the placement and compiler-macro rules in `vue-code-rules`.

5. Comment a function, method, composable, callback, event handler, or lifecycle hook only when its contract, responsibility, side effect, sequencing constraint, error behavior, or return meaning is not clear from its name, signature, and immediate context. Do not narrate obvious accessors, predicates, short transformations, or conventionally named handlers. Place a justified comment immediately above the declaration or containing registration site. In a Vue SFC, use the callback and lifecycle placement defined by `vue-code-rules`. Extract an inline callback only when it has an independent responsibility, real reuse, or a concrete testing or readability benefit; never extract one solely to create a comment target.

6. Inside a function or method, comment only key business logic, non-obvious transformations, important branches, side effects, and error handling. Explain why the code needs an unusual step or constraint rather than narrating what each statement does. Remove a comment when clearer naming or structure makes it redundant.

7. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

8. Do not leave meaningless blank lines in TypeScript or TSX. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside an opening or closing code block, blank lines between a comment and the declaration or statement it documents, or blank lines between tightly coupled imports, declarations, statements, object members, JSX nodes, or type members. Keep at most one intentional blank line between genuinely separate logical groups and remove every blank line that does not improve structural readability.

## Scenario 1: Keep the Change Scoped

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

## Scenario 2: Avoid a One-Off Abstraction

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

## Scenario 3: Remove Only Change-Owned Dead Code

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

## Scenario 4: Comment Only Non-Obvious Runtime Declarations

**Positive example:**

Self-explanatory declarations do not need comments:

```ts
const candidateId = route.params.id
let loading = false
const { candidate, updatedAt } = result
```

Add a comment when the declaration contains a non-obvious unit or contract that naming and types do not fully convey:

```ts
// <zh: convert the API timestamp from seconds to the milliseconds expected by Date.>
const updatedAt = new Date(result.updatedAt * 1000)
```

Imports, parameters, interfaces, type aliases, and other type-only declarations do not need separate declaration comments.

Class fields and methods follow the same decision rule. Keep clear members uncommented, and document only a non-obvious invariant or failure behavior:

```ts
export class CandidateDraftService {
  private readonly candidateId: string
  private submitting = false

  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  public async submit(payload: CandidateDraftPayload) {
    this.submitting = true
    try {
      await saveCandidateDraft(this.candidateId, payload)
    } finally {
      // <zh: allow a retry after either a successful save or a rejected request.>
      this.submitting = false
    }
  }
}
```

**Negative example:**

Do not add comments that merely translate identifiers or syntax into prose:

```ts
// <zh: store the candidate identifier.>
const candidateId = route.params.id
// <zh: indicate whether loading is active.>
let loading = false
```

These comments add no information that the names, types, and initializers do not already provide.

## Scenario 5: Comment Functions and Callbacks When Needed

**Positive example:**

Clear predicates, transformations, and event handlers may remain uncommented:

```ts
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
const contactableCandidates = candidates.filter(hasValidContact)

const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

A short inline callback may remain at its registration site. Add a comment only when it conveys a non-obvious contract:

```ts
// <zh: exposure reporting is best-effort and must not block navigation.>
router.afterEach(() => {
  reportCandidateExposure().catch(reportTelemetryError)
})
```

Extract an inline callback only when it has an independent responsibility, genuine reuse, focused testing value, or a concrete readability benefit beyond shortening its owner. Keep a one-use continuation inline even when it contains several related branches or side effects that form the same workflow.

**Negative example:**

Do not comment a function by restating its name:

```ts
// <zh: submit candidate data.>
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}
```

Do not omit the explanation when a surprising contract cannot be recovered from the code, such as intentionally swallowing a background failure. Prefer expressing the contract through a clear API first, then add a concise comment if the reason remains non-obvious.

## Scenario 6: Limit Internal Comments to Important Logic

**Positive example:**

```ts
// <zh: save the candidate while preserving server validation errors for the caller.>
const submitCandidate = async () => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // <zh: normalize field errors for display by the form layer.>
    normalizeFieldErrors(error)
    throw error
  }
}
```

Do not narrate each assignment, call, or return. A declaration-level comment follows the same non-obviousness test; internal comments are reserved for transformations, branches, side effects, and error handling whose reason is not already clear.

**Negative example:**

Do not narrate every step in that same submission flow:

```ts
// <zh: save the candidate while preserving server validation errors for the caller.>
const submitCandidate = async () => {
  try {
    // <zh: build the candidate payload.>
    const payload = buildCandidatePayload(form)
    // <zh: call the candidate save API.>
    return await saveCandidate(payload)
  } catch (error) {
    // <zh: call the field-error normalization function.>
    normalizeFieldErrors(error)
    // <zh: throw the error.>
    throw error
  }
}
```

## Scenario 7: Use Blank Lines for Logical Regions

**Positive example:**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

const filters = ref(createDefaultFilters())
const hasActiveFilters = computed(() => hasFilters(filters.value))

const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

When a comment is justified, keep it attached to the declaration or statement it documents. Do not place blank lines inside the opening or closing edge of a function or between tightly coupled object members, type members, statements, or JSX nodes. Never use consecutive, leading, or trailing blank lines.

**Negative example:**

Do not separate the same comments from their declarations or split tightly coupled statements:

```ts
// <zh: retain server-provided defaults so reset restores the original query contract.>

const filters = ref(createDefaultFilters())

const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

## Scenario 8: Remove Redundant Wrappers, Intermediates, and Guards

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

- The diff contains only requested behavior and directly affected cleanup.
- Abstractions represent reuse, complexity, or responsibility.
- Change-owned dead code and debugging artifacts are removed.
- Runtime declarations and functions receive comments only when naming, types, signatures, and nearby structure do not communicate the needed business meaning or contract.
- Justified comments are concise, adjacent to what they document, and written in Chinese unless a defined exception applies.
- Internal comments explain why important non-obvious logic, constraints, side effects, or error paths exist instead of narrating statements.
- No comment is used to justify a pass-through wrapper, meaningless intermediate variable, or redundant guard.
- One-use callbacks that merely continue their owner workflow remain at the registration site, and private call paths do not repeat caller-guaranteed preconditions.
- Every blank line marks a real logical boundary.
