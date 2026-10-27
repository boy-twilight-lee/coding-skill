# Business Comments

Owns Core Rule 6.

## Ownership

This reference is the canonical source for generic script-comment coverage, wording, placement, and syntax. `vue-code-rules` also applies it to JavaScript Vue scripts without importing unrelated TypeScript rules. Vue-specific registration placement, compiler-macro exceptions, and the prohibition on adding template comments belong to [Vue-Specific Comment Rules](../../vue-code-rules/references/script-comment-examples.md).

## Example Presentation

Keep positive and negative examples free of nonessential comments. Retain comments only when demonstrating a comment rule, spacing/placement, or an essential non-obvious constraint; put ordinary explanations outside code fences. Focused examples do not waive actual project-code comment coverage. Use actual Chinese comments rather than placeholder markers.

## Mandatory Rules

1. Add concise Chinese responsibility comments above major business declarations, including state, refs, reactive records, computed values, persistent fields, configuration, thresholds, and mappings. Explain their role, scope/source, and relevant units, defaults, reset timing, or dependencies. Clear names do not waive coverage. A small contiguous group with one responsibility may share a comment.
2. Document business functions, methods, composables, handlers, and callback registrations by their action and result or affected state. Include parameter meaning, return contract, sequencing, side effects, and failure ownership where relevant. Prefer `//` for ordinary responsibility comments, including public declarations; use JSDoc only when a concrete documentation-tooling or structured-tag requirement calls for it, without repeating TypeScript parameter types. Keep one-use callbacks inline and comment the registration rather than extracting a comment target.
3. Document each meaningful internal stage or important branch at its smallest cohesive block: validation/early exit, conversion, request sequencing, merging/state commits, interaction boundaries, fallback/retry/deduplication, side effects, recovery, and cleanup. A function comment does not replace distinct internal rules; a single-stage function needs no duplicate explanation. Derive reasons from code and verified contracts.
4. Document domain interfaces, type aliases, enums, and exported contracts. Important members describe units, source, allowed states, defaults, optional/null meanings, or consumer expectations where relevant. Keep member contracts next to members instead of repeating them at every use.
5. Keep comments adjacent and accurate. Do not narrate imports, temporary destructuring, loop variables, mechanical map/filter callbacks, obvious accessors, trivial language helpers, mechanical utility types, generated/vendor declarations, or self-evident id/name fields. Use another language only for an explicit project requirement or necessary exact external term. Apply the linked Vue-specific rules when reviewing Vue code.
6. Prefer `//` whenever an ordinary comment fits on one line, including comments on interfaces, type aliases, and contract members. Do not default to single-line `/* ... */` or `/** ... */`. For a cohesive explanation that genuinely needs multiple lines, consider `/* ... */`; several `//` lines remain valid when clearer. Do not pad a short comment into multiple lines merely to justify a block.

Never introduce a wrapper, intermediate, or guard only to hold a comment; apply [Abstraction and Cleanup](abstraction-and-cleanup.md). Cover affected code without expanding an ordinary change into repository-wide annotation work.

## Scenario 1: Explain State and Contract Semantics

**Positive example:**

```ts
// 当前详情页的候选人标识，用于关联加载和保存操作。
const candidateId = route.params.id
// 详情加载状态，控制页面的加载反馈。
let loading = false

// 将接口返回的秒级时间戳转换为 Date 所需的毫秒值。
const updatedAt = new Date(result.updatedAt * 1000)
```

Type-only declarations also carry business contracts:

```ts
// 候选人列表查询条件，供列表请求与分页共同使用。
interface CandidateQuery {
  keyword: string
  // 从 1 开始的页码，与服务端分页约定保持一致。
  pageNumber: number
  // null 表示不限制职位。
  roleCode: number | null
}
// 草稿保存状态，区分未保存修改、保存中和已同步。
type DraftStatus = 'dirty' | 'saving' | 'synced'
```

**Negative example:**

These labels repeat names without documenting ownership or use:

```ts
// 候选人标识。
const candidateId = route.params.id
// 是否正在加载。
let loading = false
```

## Scenario 2: Describe Business Entry Points and Registrations

**Positive example:**

```ts
// 将表单转换为候选人保存载荷，并把保存结果交给调用方。
const submitCandidate = async (): Promise<Candidate> => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    throw error
  }
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

Keep one-use callbacks at the registration site. This page owns load-failure feedback through its existing `Message` API, without duplicate reporting upstream:

```ts
// 路由切换完成后刷新候选人列表。
router.afterEach(async () => {
  try {
    await loadCandidates()
  } catch (error) {
    Message.error(error.message)
  }
})
```

A callback may be extracted for independent responsibility, genuine reuse, focused testing value, or a concrete readability benefit; merely shortening its owner or creating a comment target is insufficient.

**Negative example:**

This comment omits payload responsibility and the return contract:

```ts
// 提交候选人数据。
const submitCandidate = async (): Promise<Candidate> => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    throw error
  }
}
```

## Scenario 3: Document Distinct Processing Stages

**Positive example:**

```ts
// 保存当前候选人并更新页面详情；失败时保留原详情供用户重试。
const saveCurrentCandidate = async () => {
  try {
    // 仅通过表单校验的数据可以进入保存流程。
    if (!(await formRef.value.validate())) return
    saving.value = true
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

Explain a non-obvious interaction invariant even when the syntax is simple:

```ts
// 指针跨越拖动锚点时保持锚点不变，避免选中范围跳变。
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

**Negative example:**

Do not narrate calls and assignments instead of explaining their cohesive business rule:

```ts
// 保存候选人，并将服务端校验错误交给调用方继续处理。
const submitCandidate = async () => {
  try {
    // 构建候选人载荷。
    const payload = buildCandidatePayload(form)
    // 调用候选人保存接口。
    return await saveCandidate(payload)
  } catch (error) {
    // 调用字段错误整理函数。
    normalizeFieldErrors(error)
    // 抛出错误。
    throw error
  }
}
```

## Scenario 4: Prefer Line Comments and Consider Blocks for Multiline Explanations

**Positive example:**

An ordinary single-line responsibility comment uses `//`:

```ts
// 候选人抽屉的打开状态，供列表操作控制展示。
const candidateDrawerVisible = ref(false)
```

**Negative example:**

Do not default to a block for that same single-line comment. Single-line JSDoc is also unnecessary without a concrete documentation requirement:

```ts
/* 候选人抽屉的打开状态，供列表操作控制展示。 */
const candidateDrawerVisible = ref(false)
```

**Multiline option:**

For one cohesive explanation with multiple points, a block comment is appropriate; consecutive `//` lines are also valid. The owner supplies the existing page and selection refs:

```ts
/*
 * 切换分组后回到第一页，避免沿用旧分组页码而显示空页。
 * 同时清空候选人选择，避免后续操作使用旧分组的候选人。
 */
const resetGroupSelection = () => {
  pageNumber.value = 1
  selectedCandidateId.value = ''
}
```

## Review Checklist

- Major declarations, business actions, contracts, and important members have responsibility documentation even when names are clear.
- Key internal stages and branches are explained without mechanical narration or duplicated single-stage comments.
- Comments are adjacent, Chinese unless a defined exception applies, and supported by verified behavior.
- Single-line comments prefer `//`, including contract members; multiline explanations may use `/* ... */` without forcing blocks or padding short comments. JSDoc has a concrete documentation requirement.
- Examples contain comments only for the demonstrated rule or an essential non-obvious constraint.
