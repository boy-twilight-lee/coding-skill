# Vue Script Comment Examples

## Ownership

For `<script lang="ts">` and `<script setup lang="ts">`, `ts-code-rules` is the canonical source for generic declaration comments, function and callback comments, internal comments, redundant wrappers, intermediate values, and guards. This reference adds only Vue-specific placement and compiler-macro exceptions.

For JavaScript Vue scripts, apply the same baseline directly: comment only non-obvious business meaning, contracts, side effects, sequencing, or error behavior; keep one-use callbacks at their registration site unless extraction has an independent responsibility; and never preserve redundant structure merely to create a comment target.

## Mandatory Rules

1. Apply the source-language comment-decision baseline to ordinary runtime declarations. Never place a generic declaration comment above a Vue compiler macro, including a variable or destructuring declaration that receives the result of `defineProps`, `withDefaults`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, or another compiler macro. Document non-obvious prop, event, slot, or model semantics in the corresponding contract instead.

2. A watcher, lifecycle hook, or inline callback does not need a comment when the source, API name, callback body, and surrounding context already make its behavior clear. When a non-obvious reason, timing constraint, side effect, or error contract needs explanation, place one comment immediately above the containing API call or object property. Do not duplicate it inside the callback.

## Scenario 1: Apply the Compiler-Macro Exception

**Positive example:**

Compiler macros do not receive generic declaration comments. Ordinary runtime state follows the same non-obviousness test as other source declarations:

```ts
const props = defineProps<{
  candidateId: string
}>()
const emit = defineEmits<{
  saved: [candidateId: string]
}>()

const loading = ref(false)
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

## Scenario 2: Decide Whether Watchers and Lifecycle Hooks Need Comments

**Positive example:**

Clear registrations may remain uncommented:

```ts
watch(filters, async () => {
  await loadCandidates()
})

onMounted(async () => {
  await loadCandidates()
})
```

Add a comment above the containing call when it explains a non-obvious constraint:

```ts
// <zh: delay the initial request until mount because the API reads dimensions from the rendered table.>
onMounted(async () => {
  await loadCandidates()
})
```

Do not insert another copy inside the callback.

**Negative example:**

Do not narrate an otherwise clear registration from inside its callback:

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
- JavaScript SFCs apply the same non-obviousness, placement, internal-comment, and redundancy baseline.
- Compiler macros have no declaration comments above them.
- Clear watchers, lifecycle hooks, and inline callbacks remain uncommented; justified comments sit immediately above their containing call or property.
