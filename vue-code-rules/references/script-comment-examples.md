# Vue Script Comment Examples

Owns Core Rule 8.

## Example Presentation

Keep positive and negative examples free of nonessential comments. Retain comments only to demonstrate a comment rule, spacing/placement, or an essential non-obvious constraint; put ordinary explanations outside code fences. Focused examples do not waive actual project-code comment coverage. Replace `<zh: ...>` placeholders with concise Chinese comments when required; never copy the markers into project code.

## Ownership

For `<script lang="ts">` and `<script setup lang="ts">`, `ts-code-rules` is the canonical source for generic declaration comments, function and callback comments, internal comments, redundant wrappers, intermediate values, and guards. This reference adds Vue-specific coverage and placement for contracts, reactivity, lifecycle work, compiler macros, and template regions.

For JavaScript Vue scripts, apply the same broad coverage directly: document major business state and configuration, computed values, functions, event handlers, contracts, watcher and lifecycle responsibilities, and key processing stages with concise Chinese comments. Clear names and simple syntax do not waive this business documentation. Small cohesive declaration groups may share one comment; imports, temporary locals, and mechanical callbacks need no narration. Keep one-use callbacks at their registration site unless extraction has an independent responsibility, and never preserve redundant structure merely to create a comment target.

## Mandatory Rules

1. Apply the source-language coverage rules to runtime declarations. Document major refs, reactive records, computed values, configuration, actions, and handlers by their business role, owner, usage, source, reset timing, or dependencies as relevant. Clear English names alone do not replace these comments. Never place a generic declaration comment above a Vue compiler macro, including a variable or destructuring declaration receiving `defineProps`, `withDefaults`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, `defineModel`, or another macro. Prohibit all line comments, block comments, and JSDoc inside macros, including inline contract members, type arguments, and runtime arguments or nested options/defaults/callbacks; these interiors are exempt from comment coverage. Document existing standalone contract types and runtime actions at their declarations outside macros. Do not extract types or add wrappers solely to relocate macro comments.

2. Add a responsibility comment immediately above each business watcher, lifecycle hook, or callback registration, even for a short reload or initialization. Explain what triggers the work and what it initializes, synchronizes, invalidates, or releases. Include DOM timing, cross-state dependencies, ownership, and error contracts when relevant. Do not repeat that comment inside the callback; comment distinct internal stages or rules separately. A mechanical callback passed to map/filter needs no separate label.

3. Comment key interaction and transformation stages independently from compatibility handling. Range boundaries, selection anchors, normalization, ordering, merging, fallback, deduplication, validation, request sequencing, state commits, and important branches need concise rule or purpose comments above their smallest cohesive block, even when the statements are easy to read. A single-stage action can be covered by its responsibility comment; do not repeat it line by line or invent product reasons unsupported by the implementation.

4. In a template with multiple business regions, add concise Chinese HTML comments above major regions such as filters, results, pagination, detail, and actions. Explain significant conditional-rendering, permission, slot, or interaction rules where they occur. Keep one small single-purpose template free of redundant region labels, and do not label every DOM node or repeat visible text. Place a branch-group comment above the initial `v-if`; keep `v-if`/`v-else-if`/`v-else` chains contiguous.

5. In JavaScript and TypeScript script blocks, prefer `//` for ordinary single-line comments, including runtime declarations and standalone contract members. Do not default to single-line `/* ... */` or `/** ... */`; JSDoc requires a concrete documentation-tooling or structured-tag need. For a cohesive explanation that genuinely needs multiple lines, consider `/* ... */`, while consecutive `//` lines remain valid when clearer. Do not pad short comments to justify a block. Templates continue to use `<!-- ... -->`; this script convention does not change style-comment rules or permit any comments inside compiler macros.

## Scenario 1: Apply the Compiler-Macro Exception

**Positive example:**

Compiler macros have neither generic declaration comments above them nor comments inside them. Inline macro contracts stay comment-free; document runtime state and actions outside macros:

```ts
const props = defineProps<{
  candidateId: string
}>()
const emits = defineEmits<{
  saved: [candidateId: string]
}>()

// 候选人保存状态，供提交按钮展示处理中反馈。
const saving = ref(false)
// 保存当前候选人，成功后通知父组件；失败交由调用方处理。
const submitCandidate = async () => {
  saving.value = true
  try {
    // 服务端确认保存后才通知父组件更新展示。
    await saveCandidate(props.candidateId)
    emits('saved', props.candidateId)
  } finally {
    // 请求结束后恢复提交状态，失败时同样允许重试。
    saving.value = false
  }
}
```

**Negative example:**

Do not add a generic declaration comment above that same compiler macro:

```ts
// <zh: receive the component props.>
const props = defineProps<{
  candidateId: string
}>()
```

The macro already identifies its declaration role. Explain the candidate association on existing standalone contract declarations or runtime actions where needed, without adding a generic macro label or moving the comment inside the macro.

**Positive example — macro interiors:**

Keep inline type contracts and default/options objects comment-free:

```ts
const props = withDefaults(defineProps<{
  candidateId?: string
}>(), {
  candidateId: ''
})
const emits = defineEmits<{
  saved: [candidateId: string]
}>()
const slots = defineSlots<{
  default(): unknown
}>()
const visible = defineModel<boolean>('visible', { default: false })
```

**Negative example — comments inside macros:**

Business relevance does not permit comments inside macro type arguments, defaults, or options. These comments demonstrate the violation:

```ts
const props = withDefaults(defineProps<{
  // 当前候选人标识。
  candidateId?: string
}>(), {
  // 未选择候选人时使用空标识。
  candidateId: ''
})
const emits = defineEmits<{
  // 保存成功后通知父组件刷新。
  saved: [candidateId: string]
}>()
const slots = defineSlots<{
  // 候选人详情展示内容。
  default(): unknown
}>()
const visible = defineModel<boolean>('visible', {
  // 抽屉初始关闭。
  default: false
})
```

## Scenario 2: Document Watcher and Lifecycle Responsibilities

**Positive example:**

Even short registrations document their business responsibility above the API call:

```ts
// 筛选条件变化后重新加载候选人，保持结果与当前条件一致。
watch(filters, async () => {
  await loadCandidates()
})

// 页面挂载后加载首屏候选人列表。
onMounted(async () => {
  await loadCandidates()
})
```

Document interaction rules even when their code is syntactically straightforward:

```ts
// <zh: keep the drag anchor fixed after crossing it so the selected range does not jump.>
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

Include timing constraints when they apply:

```ts
// <zh: delay the initial request until mount because the API reads dimensions from the rendered table.>
onMounted(async () => {
  await loadCandidates()
})
```

Do not insert another copy inside the callback. The ordinary mount example documents when the owner starts loading; a DOM-based delay must be justified by a real dependency, as in the dimensions example.

**Negative example:**

Do not leave the registration undocumented and add a mechanical label inside the callback instead:

```ts
watch(filters, async () => {
  // <zh: reload the candidate list after the filters change.>
  await loadCandidates()
})

onMounted(async () => {
  // <zh: initialize candidate data after the page mounts.>
  await loadCandidates()
})
```

## Scenario 3: Document State and Computed Business Meaning

**Positive example:**

```ts
// 当前页面的筛选条件，职位为空表示不限制职位。
const filters = reactive<{ keyword: string; roleCode: number | null }>({
  keyword: '',
  roleCode: null
})
// 用户选中的候选人，供当前页面的详情和后续操作使用。
const selectedCandidateId = ref('')
// 任一筛选项生效时展示清空筛选入口。
const hasActiveFilters = computed(() => {
  return Boolean(filters.keyword || filters.roleCode !== null)
})
```

One comment can cover a small cohesive state record; separate comments explain state with different owners or uses. Do not replace these with labels such as “define reactive data” or “computed property.” Temporary request destructuring and simple map callbacks do not need extra comments.

## Scenario 4: Annotate Major Template Regions and Rendering Rules

**Positive example:**

This template excerpt documents region responsibilities and the initial-load branch group without inserting comments between conditional siblings:

```vue
<template>
  <div class="candidate-page">
    <!-- 筛选区：维护当前查询条件，并触发列表刷新。 -->
    <candidate-filters v-model="filters" />
    <!-- 结果区：加载中展示占位，完成后展示列表或空态。 -->
    <candidate-list-skeleton v-if="loading" />
    <candidate-list v-else-if="candidates.length" :candidates="candidates" />
    <candidate-empty v-else />
    <!-- 分页区：只在存在查询结果时展示。 -->
    <candidate-pagination v-if="total > 0" v-model="pageNumber" :total="total" />
  </div>
</template>
```

**Negative example:**

Do not label each node with syntax or visible text:

```vue
<!-- div 容器 -->
<div class="candidate-name">
  <!-- 姓名文本 -->
  <span>{{ candidate.name }}</span>
</div>
```

## Scenario 5: Choose Script Comment Syntax

The same preference applies to JavaScript and TypeScript SFC scripts. These excerpts assume verified auto-import coverage for ref; TypeScript also follows the examples in [Business Comments](../../ts-code-rules/references/business-comments.md).

**Positive example:**

```vue
<script setup>
// 候选人抽屉的打开状态，供列表操作控制展示。
const candidateDrawerVisible = ref(false)
</script>
```

**Negative example:**

An ordinary single-line comment does not need a block:

```vue
<script setup>
/* 候选人抽屉的打开状态，供列表操作控制展示。 */
const candidateDrawerVisible = ref(false)
</script>
```

**Multiline option:**

The owner supplies the existing page and selection refs. Use a block when it helps present this cohesive explanation, or retain consecutive `//` lines:

```js
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

- TypeScript SFCs use `ts-code-rules` as the generic script-quality source; this reference supplies Vue-specific coverage, placement, and macro exceptions.
- Major business state, computed values, functions, handlers, and configuration have concise responsibility comments in both JavaScript and TypeScript SFCs.
- Compiler macros have no generic declaration labels or internal comments; inline macro contracts are exempt, while existing standalone contracts and runtime actions retain business documentation outside macros.
- Business watchers, lifecycle hooks, and callback registrations have comments above their containing call or property, including simple reload and initialization work.
- Key internal stages, interaction rules, branches, side effects, and error policy are documented without duplicating the registration comment.
- Multi-region templates document major business regions and significant rendering rules; small single-purpose templates and individual DOM nodes need no repeated labels.
- Comments preserve conditional-chain adjacency, remain attached to their target, and explain only behavior supported by code or verified contracts.
- Both JavaScript and TypeScript scripts prefer `//` for single-line comments and may use `/* ... */` for cohesive multiline explanations; template comments remain HTML comments, and macro interiors remain comment-free.
