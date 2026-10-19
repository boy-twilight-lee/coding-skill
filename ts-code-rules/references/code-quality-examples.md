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

Change the defective branch and its directly affected imports, comments, tests, and types. Do not rename neighboring functions, reorder unrelated imports, or retain unrelated whole-file formatting changes. A formatter may process the changed file, but restore its formatting-only changes outside the affected regions against the pre-format state, preserving pre-existing user edits. Preserve existing comments unless the current change makes them inaccurate or obsolete.

If the defect is an inclusive retry boundary, keep the correction local:

```ts
// 判断候选人同步任务是否仍允许重试。
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

Do not combine that fix with unrelated renaming, return-shape changes, logging rewrites, or conversion of neighboring functions to a new abstraction. Those changes enlarge regression risk and obscure the actual defect correction.

## Scenario 2: Avoid a One-Off Abstraction

Keep a clear one-time transformation at its call site:

```ts
// 保存提交接口需要的候选人姓名。
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

Do not create a wrapper that only renames or forwards one operation:

```ts
// 返回去除空格后的候选人姓名。
const getCandidateName = (name: string) => {
  return name.trim()
}
```

Extract when logic is reused, independently testable, genuinely complex, or forms a clear responsibility boundary.

## Scenario 3: Remove Only Change-Owned Dead Code

After an implementation change, remove imports, variables, types, debug logging, aliases, and wrappers made unused by that change:

Before cleanup, the changed path still contains a removed debugger dependency, console output, and a pass-through wrapper:

```ts
import { debugCandidate, saveCandidate } from '@/apis'

// 转发候选人保存请求。
const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
// 保存当前候选人的提交参数。
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
await submitCandidateRequest(candidatePayload)
```

After cleanup, keep only the imports and behavior required by the new path:

```ts
import { saveCandidate } from '@/apis'

// 保存当前候选人的提交参数。
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

Do not remove unrelated legacy code merely because it appears unused unless the task includes that cleanup and project tooling confirms it is safe. Cleanup follows ownership of the current change, not a file-wide desire for tidiness.

## Scenario 4: Comment Runtime Declarations

```ts
// 保存当前编辑的候选人标识。
const candidateId = route.params.id
// 标识候选人详情是否正在加载。
let loading = false
// 读取提交结果中的候选人信息。
const { candidate, updatedAt } = result
```

Avoid comments that repeat the identifier:

```ts
// 定义 candidateId。
const candidateId = route.params.id
```

Imports, parameters, interfaces, type aliases, and other type-only declarations do not need separate variable comments.

Class fields follow the same declaration rule, and methods follow the function rule:

```ts
export class CandidateDraftService {
  // 保存当前草稿所属的候选人标识。
  private readonly candidateId: string
  // 标识当前草稿是否正在提交。
  private submitting = false

  // 创建指定候选人的草稿服务。
  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  // 提交当前候选人的草稿内容。
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

## Scenario 5: Comment Functions and Callbacks

```ts
// 提交候选人数据并返回保存后的详情。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

// 保留拥有有效联系方式的候选人。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 提供当前可以联系的候选人列表。
const contactableCandidates = candidates.filter(hasValidContact)

// 处理候选人卡片的选择事件。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

A short inline callback may remain when an immediately adjacent comment clearly describes it:

```ts
// 按候选人标识建立详情索引。
const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]))
```

Extract an inline callback only when it has an independent responsibility, genuine reuse, focused testing value, or a concrete readability benefit beyond shortening its owner. Keep a one-use continuation inline even when it contains several related branches or side effects that form the same workflow.

## Scenario 6: Limit Internal Comments to Important Logic

```ts
// 保存候选人并向调用方保留服务端校验错误。
const submitCandidate = async () => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // 将字段错误标准化后交给表单层展示。
    normalizeFieldErrors(error)
    throw error
  }
}
```

Do not narrate each assignment, call, or return. Declaration comments remain mandatory; internal comments are reserved for non-obvious transformations, branches, side effects, and error handling.

## Scenario 7: Use Blank Lines for Logical Regions

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

// 保存当前候选人筛选条件。
const filters = ref(createDefaultFilters())
// 标识是否存在已应用的筛选条件。
const hasActiveFilters = computed(() => hasFilters(filters.value))

// 使用当前筛选条件刷新候选人列表。
const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

Do not place a blank line between a required comment and its declaration, inside the opening or closing edge of a function, or between tightly coupled object members, type members, statements, or JSX nodes. Never use consecutive, leading, or trailing blank lines.

## Scenario 8: Remove Redundant Wrappers, Intermediates, and Guards

Do not retain an extra function, variable, or condition just because it provides a place for a required declaration comment:

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ 仅转发另一个判断，没有独立职责。
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// 在手机号变化时清除原短信准入签名。
watch(phone, (currentPhone, previousPhone) => {
  // ❌ 一次性中间变量没有增加业务含义。
  const hasChanged = currentPhone !== previousPhone
  // ❌ watch 已保证基础值变化时才调用，重复判断没有保护作用。
  if (!hasChanged) return
  resetVerification()
})
```

Prefer the direct predicate and the verified callback contract:

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// 在手机号变化时清除原短信准入签名。
watch(phone, () => {
  resetVerification()
})
```

An intermediate value is still useful when it names a real business concept, is reused, enables type narrowing, or makes a complex expression materially clearer. A guard remains necessary when the caller, framework, or API can deliver the guarded state; verify that contract before simplifying it.

## Scenario 9: Keep One-Use Callback Workflows Together

A named callback is not automatically clearer. The following callbacks each have one registration site and no independent responsibility, while the verification function repeats a precondition already guaranteed by its only caller:

```ts
// ❌ 校验函数重复检查唯一调用方已经保证的验证码长度。
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
// 接收验证码输入并在达到完整位数后立即校验。
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// ❌ 该回调只服务于 handleRequestCode，却被拆到远处。
const handleCaptchaVerified = async (validate: string) => {
  status.value = 'sending'
  await sendPhoneVerificationCode({ phone: phone.value, validate })
  status.value = 'sent'
  startCountdown()
}
// 打开图形验证码并请求发送短信验证码。
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({ onOk: handleCaptchaVerified })
}
// ❌ 该重置函数只作为这一个 watcher 的回调。
const resetVerification = () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
}
// 在手机号变化时作废原短信验证状态。
watch(phone, resetVerification)
```

Keep the callbacks where the workflow registers them, and remove only the guard guaranteed by the private call path:

```ts
// 校验用户输入的短信验证码并保存查询准入签名。
const verifyCurrentCode = async () => {
  if (status.value === 'verifying' || phone.value !== sentPhone.value) return
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// 接收验证码输入并在达到完整位数后立即校验。
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// 打开图形验证码并在通过后请求发送短信验证码。
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({
    // 图形验证码通过后继续完成短信发送流程。
    onOk: async (validate: string) => {
      status.value = 'sending'
      await sendPhoneVerificationCode({ phone: phone.value, validate })
      status.value = 'sent'
      startCountdown()
    }
  })
}
// 在手机号变化时就地清理关联的验证码及准入状态。
watch(phone, () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
})
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
