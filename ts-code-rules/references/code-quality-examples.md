# Code Quality Examples

## Mandatory Rules

1. Keep changes limited to the requested feature or defect. Preserve existing comments and do not reformat, rename, reorder imports, or rewrite unrelated code as drive-by cleanup.

2. Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

3. Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

4. Add a concise comment for every declared variable and constant, including `const`, `let`, class fields, reactive state, refs, computed values, and destructured bindings. Place the comment immediately above the declaration and explain its business purpose or state meaning; never merely repeat the identifier or syntax. Write comments in Chinese unless another language is strictly necessary because the project explicitly mandates it, an external protocol or third-party term must be quoted exactly, or Chinese would make the technical meaning less accurate. Imports, function parameters, and type-only declarations do not require separate variable comments. In a Vue SFC, follow the declaration-comment and compiler-macro exceptions in `vue-code-rules`; do not apply this rule a second time with different placement.

5. Add a concise comment for every function, method, composable, callback, event handler, and lifecycle hook. Place the comment immediately above its declaration or definition and explain its responsibility, side effect, or return meaning. In a Vue SFC, use the callback and lifecycle comment placement defined by `vue-code-rules`. Extract an inline callback into a named, commented function only when it has an independent responsibility, real reuse, or a concrete testing or readability benefit. Keep a callback inline at its only registration site when it merely continues the containing action or API workflow and an adjacent comment can describe it clearly; callback length alone is not a reason to split the flow into a one-use handler.

6. Inside a function or method, comment only key business logic, non-obvious transformations, important branches, side effects, and error handling. Do not comment every statement or restate self-explanatory implementation details. Declaration-level comments required by rules 4 and 5 remain mandatory even when the implementation is obvious.

7. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

8. Do not leave meaningless blank lines in TypeScript or TSX. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside an opening or closing code block, blank lines between a required comment and its declaration, or blank lines between tightly coupled imports, declarations, statements, object members, JSX nodes, or type members. Keep at most one intentional blank line between genuinely separate logical groups and remove every blank line that does not improve structural readability.

## Scenario 1: Keep the Change Scoped

Situation: a defect fix changes one status branch in a service that also contains unrelated naming and formatting issues.

**Positive example:**

Change the defective branch and its directly affected imports, comments, tests, and types. Do not rename neighboring functions, reorder unrelated imports, or retain unrelated whole-file formatting changes. A formatter may process the changed file, but restore its formatting-only changes outside the affected regions against the pre-format state, preserving pre-existing user edits. Preserve existing comments unless the current change makes them inaccurate or obsolete.

If the defect is an inclusive retry boundary, keep the correction local:

```ts
// [Write in Chinese: determine whether the candidate synchronization task may still be retried.]
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

**Negative example:**

Do not combine the same boundary fix with an unrelated rename and return-shape change:

```ts
// [Write in Chinese: determine whether the candidate synchronization task may still be retried and return a wrapped result.]
export const evaluateCandidateSyncRetry = (retryCount: number) => {
  return { allowed: retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT }
}
```

Unrelated renaming, logging rewrites, or conversion of neighboring functions to a new abstraction enlarges regression risk and obscures the actual defect correction.

## Scenario 2: Avoid a One-Off Abstraction

**Positive example:**

Keep a clear one-time transformation at its call site:

```ts
// [Write in Chinese: store the candidate name required by the submission API.]
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

**Negative example:**

Do not create a wrapper that only renames or forwards one operation:

```ts
// [Write in Chinese: return the trimmed candidate name.]
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

// [Write in Chinese: store the submission payload for the current candidate.]
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

**Negative example:**

Before cleanup, the same changed path still contains the removed debugger dependency, console output, and pass-through wrapper:

```ts
import { debugCandidate, saveCandidate } from '@/apis'

// [Write in Chinese: forward the candidate save request.]
const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
// [Write in Chinese: store the submission payload for the current candidate.]
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
await submitCandidateRequest(candidatePayload)
```

Do not remove unrelated legacy code merely because it appears unused unless the task includes that cleanup and project tooling confirms it is safe. Cleanup follows ownership of the current change, not a file-wide desire for tidiness.

## Scenario 4: Comment Runtime Declarations

**Positive example:**

```ts
// [Write in Chinese: store the identifier of the candidate currently being edited.]
const candidateId = route.params.id
// [Write in Chinese: indicate whether the candidate details are loading.]
let loading = false
// [Write in Chinese: read the candidate information from the submission result.]
const { candidate, updatedAt } = result
```

Imports, parameters, interfaces, type aliases, and other type-only declarations do not need separate variable comments.

Class fields follow the same declaration rule, and methods follow the function rule:

```ts
export class CandidateDraftService {
  // [Write in Chinese: store the identifier of the candidate that owns the current draft.]
  private readonly candidateId: string
  // [Write in Chinese: indicate whether the current draft is being submitted.]
  private submitting = false

  // [Write in Chinese: create a draft service for the specified candidate.]
  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  // [Write in Chinese: submit the current candidate's draft content.]
  public async submit(payload: CandidateDraftPayload) {
    this.submitting = true
    try {
      await saveCandidateDraft(this.candidateId, payload)
    } finally {
      this.submitting = false
    }
  }
}
```

**Negative example:**

Avoid a comment that merely repeats the same declaration's identifier:

```ts
// [Write in Chinese: define candidateId.]
const candidateId = route.params.id
```

## Scenario 5: Comment Functions and Callbacks

**Positive example:**

```ts
// [Write in Chinese: submit candidate data and return the saved details.]
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

// [Write in Chinese: keep candidates that have valid contact details.]
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// [Write in Chinese: provide the list of candidates who can currently be contacted.]
const contactableCandidates = candidates.filter(hasValidContact)

// [Write in Chinese: handle selection of a candidate card.]
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

A short inline callback may remain when an immediately adjacent comment clearly describes it:

```ts
// [Write in Chinese: index candidate details by candidate identifier.]
const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]))
```

Extract an inline callback only when it has an independent responsibility, genuine reuse, focused testing value, or a concrete readability benefit beyond shortening its owner. Keep a one-use continuation inline even when it contains several related branches or side effects that form the same workflow.

**Negative example:**

Do not leave the same responsibility unexplained or replace it with a comment that repeats the function name:

```ts
// [Write in Chinese: define submitCandidate.]
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}
```

## Scenario 6: Limit Internal Comments to Important Logic

**Positive example:**

```ts
// [Write in Chinese: save the candidate while preserving server validation errors for the caller.]
const submitCandidate = async () => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // [Write in Chinese: normalize field errors for display by the form layer.]
    normalizeFieldErrors(error)
    throw error
  }
}
```

Do not narrate each assignment, call, or return. Declaration comments remain mandatory; internal comments are reserved for non-obvious transformations, branches, side effects, and error handling.

**Negative example:**

Do not narrate every step in that same submission flow:

```ts
// [Write in Chinese: save the candidate while preserving server validation errors for the caller.]
const submitCandidate = async () => {
  try {
    // [Write in Chinese: build the candidate payload.]
    const payload = buildCandidatePayload(form)
    // [Write in Chinese: call the candidate save API.]
    return await saveCandidate(payload)
  } catch (error) {
    // [Write in Chinese: call the field-error normalization function.]
    normalizeFieldErrors(error)
    // [Write in Chinese: throw the error.]
    throw error
  }
}
```

## Scenario 7: Use Blank Lines for Logical Regions

**Positive example:**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

// [Write in Chinese: store the current candidate filters.]
const filters = ref(createDefaultFilters())
// [Write in Chinese: indicate whether any filters are currently applied.]
const hasActiveFilters = computed(() => hasFilters(filters.value))

// [Write in Chinese: refresh the candidate list with the current filters.]
const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

Do not place a blank line between a required comment and its declaration, inside the opening or closing edge of a function, or between tightly coupled object members, type members, statements, or JSX nodes. Never use consecutive, leading, or trailing blank lines.

**Negative example:**

Do not separate the same comments from their declarations or split tightly coupled statements:

```ts
// [Write in Chinese: store the current candidate filters.]

const filters = ref(createDefaultFilters())

// [Write in Chinese: refresh the candidate list with the current filters.]
const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

## Scenario 8: Remove Redundant Wrappers, Intermediates, and Guards

**Positive example:**

Prefer the direct predicate and the verified callback contract:

```ts
// [Write in Chinese: determine whether the current search field requires SMS verification.]
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// [Write in Chinese: clear the previous SMS access signature when the phone number changes.]
watch(phone, () => {
  resetVerification()
})
```

**Negative example:**

Do not retain an extra function, variable, or condition in that same workflow just because it provides a place for a required declaration comment:

```ts
// [Write in Chinese: determine whether the current search field requires SMS verification.]
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ [Write in Chinese: this wrapper only forwards another predicate and has no independent responsibility.]
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// [Write in Chinese: clear the previous SMS access signature when the phone number changes.]
watch(phone, (currentPhone, previousPhone) => {
  // ❌ [Write in Chinese: this one-use intermediate variable adds no business meaning.]
  const hasChanged = currentPhone !== previousPhone
  // ❌ [Write in Chinese: the watcher already runs only when the source value changes, so this repeated check adds no protection.]
  if (!hasChanged) return
  resetVerification()
})
```

An intermediate value is still useful when it names a real business concept, is reused, enables type narrowing, or makes a complex expression materially clearer. A guard remains necessary when the caller, framework, or API can deliver the guarded state; verify that contract before simplifying it.

## Scenario 9: Keep One-Use Callback Workflows Together

**Positive example:**

Keep the callbacks where the workflow registers them, and remove only the guard guaranteed by the private call path:

```ts
// [Write in Chinese: verify the user-entered SMS code and store the search access signature.]
const verifyCurrentCode = async () => {
  if (status.value === 'verifying' || phone.value !== sentPhone.value) return
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// [Write in Chinese: accept verification-code input and verify it as soon as it reaches full length.]
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// [Write in Chinese: open the CAPTCHA and request an SMS code after successful validation.]
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({
    // [Write in Chinese: continue the SMS delivery flow after the CAPTCHA succeeds.]
    onOk: async (validate: string) => {
      status.value = 'sending'
      await sendPhoneVerificationCode({ phone: phone.value, validate })
      status.value = 'sent'
      startCountdown()
    }
  })
}
// [Write in Chinese: clear the associated verification code and access state in place when the phone number changes.]
watch(phone, () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
})
```

**Negative example:**

A named callback is not automatically clearer. In the same workflow, the following callbacks each have one registration site and no independent responsibility, while the verification function repeats a precondition already guaranteed by its only caller:

```ts
// ❌ [Write in Chinese: the verification function repeats a code-length check already guaranteed by its only caller.]
const verifyCurrentCode = async () => {
  if (
    status.value === 'verifying' ||
    code.value.length !== PHONE_VERIFICATION_CODE_LENGTH ||
    phone.value !== sentPhone.value
  ) {
    return
  }
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// [Write in Chinese: accept verification-code input and verify it as soon as it reaches full length.]
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// ❌ [Write in Chinese: this callback serves only handleRequestCode but has been extracted far away.]
const handleCaptchaVerified = async (validate: string) => {
  status.value = 'sending'
  await sendPhoneVerificationCode({ phone: phone.value, validate })
  status.value = 'sent'
  startCountdown()
}
// [Write in Chinese: open the CAPTCHA and request an SMS verification code.]
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({ onOk: handleCaptchaVerified })
}
// ❌ [Write in Chinese: this reset function is used only as the callback for this watcher.]
const resetVerification = () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
}
// [Write in Chinese: invalidate the previous SMS verification state when the phone number changes.]
watch(phone, resetVerification)
```

Extraction is appropriate when the callback is reused, has an independent business contract, needs focused tests, or materially reduces otherwise confusing nesting. A guard is appropriate when another caller can bypass the precondition. Verify callers before removing either structure.

## Review Checklist

- The diff contains only requested behavior and directly affected cleanup.
- Abstractions represent reuse, complexity, or responsibility.
- Change-owned dead code and debugging artifacts are removed.
- Every runtime declaration and function has a meaningful adjacent Chinese comment.
- Internal comments explain only important non-obvious logic.
- No comment is used to justify a pass-through wrapper, meaningless intermediate variable, or redundant guard.
- One-use callbacks that merely continue their owner workflow remain at the registration site, and private call paths do not repeat caller-guaranteed preconditions.
- Every blank line marks a real logical boundary.
