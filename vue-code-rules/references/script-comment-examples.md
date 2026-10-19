# Vue Script Comment Examples

## Ownership

For `<script lang="ts">` and `<script setup lang="ts">`, `ts-code-rules` is the canonical source for generic declaration comments, function and callback comments, internal comments, redundant wrappers, intermediate values, and guards. This reference adds only Vue-specific placement and compiler-macro exceptions.

For JavaScript Vue scripts, apply the same baseline directly: runtime declarations and functions need concise Chinese business comments, internal comments are limited to important non-obvious logic, one-use callbacks stay at their registration site unless extraction has an independent responsibility, and comments must not justify redundant structure.

## Mandatory Rules

1. Apply the source-language declaration-comment baseline to ordinary runtime declarations. Never place a generic declaration comment above a Vue compiler macro, including a variable or destructuring declaration that receives the result of `defineProps`, `withDefaults`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, or another compiler macro.

2. For a watcher, lifecycle hook, or inline callback, place one comment immediately above the containing API call or object property when it unambiguously describes the callback. Do not duplicate that comment inside the callback solely to satisfy the source-language callback rule.

## Scenario 1: Apply the Compiler-Macro Exception

**Positive example:**

Compiler macros do not receive declaration comments, while ordinary runtime state does:

```ts
const props = defineProps<{
  candidateId: string
}>()
const emit = defineEmits<{
  saved: [candidateId: string]
}>()

// <zh: indicate whether the candidate details are loading.>
const loading = ref(false)
// <zh: submit the candidate and notify the parent component.>
const submitCandidate = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
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

Its name and type argument already identify the declaration role. Document non-obvious business meaning in the prop contract instead.

## Scenario 2: Place Watcher and Lifecycle Comments

**Positive example:**

The comment belongs immediately above the Vue API call and documents its callback:

```ts
// <zh: reload the candidate list after the filters change.>
watch(filters, async () => {
  await loadCandidates()
})

// <zh: initialize candidate data after the page mounts.>
onMounted(async () => {
  await loadCandidates()
})
```

Do not insert another comment inside either callback solely to satisfy the callback rule.

**Negative example:**

Do not move the same callback comments inside the watcher and lifecycle bodies:

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

## Review Checklist

- TypeScript SFCs use `ts-code-rules` as the generic script-quality source; this reference supplies only Vue-specific placement and exceptions.
- JavaScript SFCs still apply the runtime declaration, function, internal-comment, and redundancy baseline.
- Compiler macros have no declaration comments above them.
- Watcher, lifecycle, and inline callback comments sit immediately above their containing call or property.
