# Compiler Macro Examples

Owns Core Rule 7.

For the runtime import prerequisites in these examples, read Core Rule 6's [Auto-Import Examples](auto-import-examples.md). For compiler-macro comment exceptions and business contract documentation, read Core Rule 8's [Vue Script Comment Examples](script-comment-examples.md).

## Mandatory Rules

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineEmits`, `defineSlots`, and `defineModel`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. Within that group, place `defineModel` after `defineSlots` when both are used; do not add an unused macro solely to complete this order. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

2. Receive `defineProps` as `props`, `defineEmits` as `emits`, and `defineSlots` as `slots`. A `withDefaults(defineProps(...), ...)` result is also received as `props`. Do not substitute aliases such as singular `emit` for these receiver names; omit unused macros rather than adding them to complete the list.

## Scenario 1: Order Macros and Handle Async Exposure

**Positive example without top-level await:**

Macros except defineExpose precede runtime logic, with defineModel after defineSlots. Keep the one-use load inline in onMounted rather than creating a pass-through method. The callback's await is not top-level, so defineExpose remains last. The example assumes Vue/compiler support for the macros used and no verified runtime auto-import coverage.

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { getCandidate } from '@/apis'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emits = defineEmits<{ saved: [candidateId: string] }>()
const slots = defineSlots<{ default(): unknown }>()
const visible = defineModel<boolean>('visible', { default: false })

onMounted(async () => {
  await getCandidate(props.candidateId)
})

defineExpose({ visible })
</script>
```

**Positive example with top-level await:**

Initialize and expose the ref before suspension, then update that same ref after the API returns its string result:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { loadCandidateName } from '@/apis'

const props = defineProps<{ candidateId: string }>()
const candidateName = ref('')

defineExpose({ candidateName })

candidateName.value = await loadCandidateName(props.candidateId)
</script>
```

The explicit Vue imports assume no verified auto-import coverage. Public bindings must be initialized before exposure and exposed before the first top-level await; see [Vue template refs](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component).

**Negative example:**

The four macro-position failures are distinct: runtime state precedes contract macros, defineModel precedes defineSlots, a macro is nested in a callback, and a lifecycle statement follows defineExpose without top-level await.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCandidate } from '@/apis'

const loading = ref(false)
const props = defineProps<{ candidateId: string }>()
const visible = defineModel<boolean>('visible', { default: false })
const slots = defineSlots<{ default(): unknown }>()

onMounted(() => {
  const emits = defineEmits<{ saved: [candidateId: string] }>()
})

defineExpose({ visible })
onMounted(async () => {
  await getCandidate(props.candidateId)
})
</script>
```

## Review Checklist

- Every compiler macro call is in `<script setup>` script scope, never inside nested control flow.
- Every macro except `defineExpose` forms the first declaration group after required imports.
- When both are used, `defineModel` follows `defineSlots`; unused macros are not added for ordering alone.
- Macro receiver names are `props`, `emits`, and `slots`; `withDefaults` around `defineProps` also uses `props`.
- Without top-level `await`, `defineExpose` is the final statement; with top-level `await`, initialized public bindings are exposed before the first suspension.
- One-use lifecycle work stays inline; macro-order examples do not introduce pass-through helper methods.
