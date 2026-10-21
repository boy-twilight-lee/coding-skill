# Code Quality Examples

## Mandatory Rules

1. Keep changes limited to the requested feature or defect. Preserve existing comments and do not reformat, rename, reorder imports, or rewrite unrelated code as drive-by cleanup.

2. Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

3. Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

4. Add a Chinese responsibility comment above major runtime declarations: business state, reactive records, refs, computed values, persistent class fields, business configuration, thresholds, mappings, and other values that define the module's behavior. Explain what the value controls, its scope or source, and relevant units, defaults, reset timing, or dependencies. Clear names do not exempt these declarations. One comment may cover a small contiguous group with one responsibility; do not add comments to every destructured result, loop variable, or short-lived intermediate. Use another language only when the project explicitly requires it or exact external terminology needs it. In a Vue SFC, follow the compiler-macro placement rules in `vue-code-rules`.

5. Add a Chinese responsibility comment above business functions, service methods, composables, and event handlers, including conventionally named load/save/submit/reset handlers. Describe the business action and its result or affected state; include parameter meaning, return meaning, sequencing, side effects, and failure ownership where relevant. Use JSDoc when callers benefit from a public contract, without repeating parameter types already expressed by TypeScript. Business callback registrations follow the same coverage; mechanical map/filter callbacks, obvious getters, and trivial language-level helpers may remain uncommented. Keep one-use callbacks inline and comment their containing registration rather than extracting a function only to create a comment target.

6. Inside a function or method, comment each meaningful business stage and important branch: validation and early exits, payload construction and conversion, request sequencing, response merging and state commits, interaction boundaries, fallback/retry/deduplication rules, side effects, and recovery or cleanup. Explain the stage's purpose, rule, or expected outcome even when the statements are easy to read. A function-level responsibility comment does not replace distinct internal rules, but a single-stage function does not need the same explanation twice. Group cohesive statements under one comment; do not narrate every assignment, call, or return. Derive reasons from code and verified contracts rather than inventing product requirements.

7. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

8. Do not leave meaningless blank lines in TypeScript or TSX. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside an opening or closing code block, blank lines between a comment and the declaration or statement it documents, or blank lines between tightly coupled imports, declarations, statements, object members, JSX nodes, or type members. Keep at most one intentional blank line between genuinely separate logical groups and remove every blank line that does not improve structural readability.

9. Document domain interfaces, type aliases, enums, and exported contracts with a concise Chinese comment describing their business role. Document important fields or members with units, source, allowed states, optional/null meaning, or consumer expectations where applicable. Do not exempt type-only declarations categorically. Mechanical utility types, generated/vendor declarations, and ordinary fields such as an unambiguous `id` or `name` need no repeated labels. Keep field documentation next to the field instead of duplicating it at each parameter or use site.

These rules describe the required coverage in code created or changed for the task. Naming and structure complement the comments; they are not a blanket exemption. Focused examples below omit unrelated module context and do not waive coverage elsewhere. Keep directly affected comments accurate, without expanding an ordinary feature change into repository-wide annotation work.

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

## Scenario 4: Document Business State and Domain Contracts

**Positive example:**

Document the role of business state even when its English name is clear. Small related declarations may share a responsibility comment:

```ts
// 当前详情页的候选人标识，用于关联加载和保存操作。
const candidateId = route.params.id
// 详情加载状态，控制页面的加载反馈。
let loading = false
```

Document units and conversions at their declaration:

```ts
// <zh: convert the API timestamp from seconds to the milliseconds expected by Date.>
const updatedAt = new Date(result.updatedAt * 1000)
```

Domain types also need responsibility comments and documentation for important fields:

```ts
/** 候选人列表查询条件，供列表请求与分页共同使用。 */
interface CandidateQuery {
  keyword: string
  /** 从 1 开始的页码，与服务端分页约定保持一致。 */
  pageNumber: number
  /** null 表示不限制职位。 */
  roleCode: number | null
}
/** 草稿保存状态，区分未保存修改、保存中和已同步。 */
type DraftStatus = 'dirty' | 'saving' | 'synced'
```

Do not repeat obvious field labels, annotate imports, or describe every temporary destructured response. Public parameter contracts belong with their function documentation rather than a separate comment on every parameter.

Class-level responsibility, persistent business fields, and service methods follow the same coverage:

```ts
/** 管理指定候选人的草稿保存流程及提交状态。 */
export class CandidateDraftService {
  // 当前服务实例绑定的候选人，保存操作始终使用此标识。
  private readonly candidateId: string
  // 草稿请求是否仍在处理中，在请求结束后恢复。
  private submitting = false

  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  /** 保存当前候选人的草稿；请求失败时由调用方处理错误。 */
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

These labels omit the state owner's responsibility and usage. Prefer the responsibility comments above. Likewise, a loop counter or temporary response destructuring needs no label unless it carries a business rule.

## Scenario 5: Document Business Functions and Event Handlers

**Positive example:**

Document each business entry point, including short handlers and predicates that encode domain policy:

```ts
// 将表单转换为候选人保存载荷，并把保存结果交给调用方。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

// 手机或邮箱任一存在即纳入可联系名单，不要求两者同时填写。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 当前列表中满足联系渠道要求的候选人，供后续联系操作使用。
const contactableCandidates = candidates.filter(hasValidContact)

// 记录用户选择的候选人，供当前页面后续操作使用。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

A short inline callback remains at its registration site. Document the business registration; a mechanical callback such as `items.map(item => item.id)` needs no separate narration:

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

The negative comment merely repeats the name and leaves the payload responsibility and return contract undocumented. Improve the comment rather than using the clear name as a reason to omit business documentation. Also document surprising contracts such as intentionally ignoring a background failure.

## Scenario 6: Document Business Stages and Important Branches

**Positive example:**

```ts
// <zh: save the candidate while preserving server validation errors for the caller.>
const submitCandidate = async () => {
  try {
    // 将表单转换为接口载荷，保存成功后返回服务端结果。
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // <zh: normalize field errors for display by the form layer.>
    normalizeFieldErrors(error)
    throw error
  }
}
```

The responsibility comment describes the whole operation; internal comments describe its request and error stages. Cover meaningful stages even when the code reads clearly, without annotating each assignment, call, or return. A single-stage function can be covered by its responsibility comment alone.

For a workflow with validation, a request, state updates, and cleanup, document those stages separately:

```ts
// 保存当前候选人并更新页面详情；失败时保留原详情供用户重试。
const saveCurrentCandidate = async () => {
  // 仅通过表单校验的数据可以进入保存流程。
  if (!(await formRef.value.validate())) return
  // 标记本次保存开始，供提交按钮展示处理中状态。
  saving.value = true
  try {
    // 使用表单构建接口载荷，等待服务端确认保存结果。
    const candidate = await saveCandidate(buildCandidatePayload(form))
    // 以服务端返回数据更新详情，保证页面展示已保存的内容。
    detail.value = candidate
  } catch (error) {
    // 在当前页面反馈保存失败，保留表单内容供修正或重试。
    Message.error(error.message)
  } finally {
    // 成功或失败都结束提交状态，允许用户继续操作。
    saving.value = false
  }
}
```

The same requirement applies to algorithms whose syntax is readable but whose business invariant is not. Explain the invariant once above the cohesive block:

```ts
// <zh: keep the drag anchor fixed when the pointer crosses it so the selected range does not jump.>
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

The comparison and assignments are easy to read, but the anchor rule is not recoverable without product context. A compatibility comment elsewhere in the function would not document this rule.

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

// 当前列表查询条件及其是否生效的派生状态，供筛选区使用。
const filters = ref(createDefaultFilters())
const hasActiveFilters = computed(() => hasFilters(filters.value))

// 使用当前筛选条件刷新候选人列表。
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
- Major business state, configuration, constants, computed values, functions, methods, composables, and handlers have responsibility comments even when their English names are clear.
- Domain types and important contract members document their role, units, states, defaults, or optional/null semantics without repeating obvious field labels.
- Key validation, conversion, request, state-commit, branch, side-effect, recovery, and cleanup stages have concise comments; a declaration comment or compatibility note does not replace distinct internal rules.
- Comments are concise, adjacent, written in Chinese unless a defined exception applies, and supported by code or verified contracts.
- Shared group comments and single-stage responsibility comments avoid duplication; imports, temporary variables, and mechanical callbacks receive no statement-by-statement narration.
- No comment is used to justify a pass-through wrapper, meaningless intermediate variable, or redundant guard.
- One-use callbacks that merely continue their owner workflow remain at the registration site, and private call paths do not repeat caller-guaranteed preconditions.
- Every blank line marks a real logical boundary.
