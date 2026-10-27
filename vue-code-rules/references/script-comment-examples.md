# Vue-Specific Comment Rules

Owns Core Rule 8.

## Ownership and Required Shared Reference

For both JavaScript and TypeScript Vue scripts, fully read and apply [Business Comments](../../ts-code-rules/references/business-comments.md) before deciding comment coverage or syntax. That reference owns generic declaration, contract, function, callback, and processing-stage comments, line/block syntax, and example presentation. Reuse only its comment guidance for JavaScript scripts; this does not activate unrelated TypeScript rules.

This reference owns only Vue compiler-macro exceptions, watcher/lifecycle placement, and the prohibition on adding template comments.

## Mandatory Rules

1. Never place a generic declaration label above a Vue compiler macro, including a variable or destructuring declaration receiving `defineProps`, `withDefaults`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, `defineModel`, or another macro. Prohibit all line comments, block comments, and JSDoc inside macro type arguments, runtime arguments, nested defaults/options, and callbacks. Macro interiors are exempt from generic comment coverage. Document existing standalone contract types and runtime actions at their declarations outside macros; do not extract types or add wrappers solely to relocate macro comments.
2. Place each business watcher or lifecycle responsibility comment immediately above its registration call, even for short reload or initialization work. Describe the trigger and the initialization, synchronization, invalidation, or cleanup it owns. Include DOM timing and cross-state dependencies when relevant. Generic wording and distinct internal-stage coverage follow the shared reference; do not duplicate the registration comment inside the callback.
3. Do not add comments inside templates, including region labels, conditional-rendering explanations, permission/slot notes, and per-node narration. Keep conditional sibling chains contiguous. Preserve existing template comments unless the requested change makes them inaccurate or obsolete, or explicitly includes their removal.

## Scenario 1: Apply the Compiler-Macro Exception

**Positive example:**

Inline macro contracts, defaults, and options remain comment-free:

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

Existing standalone contract declarations retain shared business documentation at their own declarations outside the macro. Do not create a standalone type merely to move a comment out of an inline macro contract.

**Negative example — generic macro label:**

The macro already identifies its declaration role:

```ts
// 接收组件属性。
const props = defineProps<{
  candidateId: string
}>()
```

**Negative example — macro interiors:**

Business relevance does not permit comments inside macro contracts, defaults, or options:

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

## Scenario 2: Place Watcher and Lifecycle Comments above Registrations

These local excerpts assume verified auto-import coverage for the Vue APIs and owner-provided state/request functions. The page owns load-failure feedback through its existing `Message` API, without duplicate reporting upstream. Their callback awaits use the current-function try/catch required by `ts-code-rules`.

**Positive example:**

The responsibility comment belongs above the registration, including short callbacks:

```ts
// 筛选条件变化后重新加载候选人，保持结果与当前条件一致。
watch(filters, async () => {
  try {
    await loadCandidates()
  } catch (error) {
    Message.error(error.message)
  }
})

// 页面挂载后加载首屏候选人列表。
onMounted(async () => {
  try {
    await loadCandidates()
  } catch (error) {
    Message.error(error.message)
  }
})
```

Include a timing explanation only when a real dependency supports it:

```ts
// 挂载后读取表格尺寸并加载候选人，确保请求使用已渲染的布局信息。
onMounted(async () => {
  try {
    await loadCandidates()
  } catch (error) {
    Message.error(error.message)
  }
})
```

**Negative example:**

Moving the responsibility label inside the callback leaves the registration undocumented:

```ts
watch(filters, async () => {
  // 筛选条件变化后重新加载候选人。
  try {
    await loadCandidates()
  } catch (error) {
    Message.error(error.message)
  }
})

onMounted(async () => {
  // 页面挂载后初始化候选人数据。
  try {
    await loadCandidates()
  } catch (error) {
    Message.error(error.message)
  }
})
```

## Scenario 3: Keep Templates Free of Added Comments

Do not introduce region or rendering-rule comments even in a multi-region template. The state and actions are documented in the script under the shared reference; that requirement does not extend to template comments.

```vue
<template>
  <div class="candidate-page">
    <candidate-filters v-model="filters" />
    <candidate-list-skeleton v-if="loading" />
    <candidate-list v-else-if="candidates.length" :candidates="candidates" />
    <candidate-empty v-else />
    <candidate-pagination v-if="total > 0" v-model="pageNumber" :total="total" />
  </div>
</template>
```

## Review Checklist

- Both JavaScript and TypeScript Vue scripts load the shared Business Comments reference; generic coverage and syntax are maintained there only.
- Compiler macros have no generic labels or internal comments; existing standalone contracts remain documented outside macros without comment-driven extraction.
- Business watcher and lifecycle responsibility comments sit above registrations, including short reloads and initialization; DOM timing claims have a real dependency.
- No template comments are added. Existing comments are preserved within the requested change scope, and conditional sibling chains stay contiguous.
