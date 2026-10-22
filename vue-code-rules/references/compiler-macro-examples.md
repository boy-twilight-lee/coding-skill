# Compiler Macro Examples

Owns Core Rule 7.

For the runtime import prerequisites in these examples, read Core Rule 6's [Auto-Import Examples](auto-import-examples.md). For compiler-macro comment exceptions and business contract documentation, read Core Rule 8's [Vue Script Comment Examples](script-comment-examples.md).

## Mandatory Rules

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

## Scenario 1: Order Macros and Handle Async Exposure

**Positive example without top-level await:**

Macros except defineExpose precede ordinary declarations. The excerpt omits unrelated save/loading workflows; getCandidate belongs to the owning API context. The await inside loadCandidate is not top-level, so defineExpose remains last.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emit = defineEmits<{ saved: [candidateId: string] }>()

const visible = ref(false)
const loadCandidate = async () => {
  await getCandidate(props.candidateId)
}
const openEditor = () => {
  visible.value = true
}
onMounted(loadCandidate)

defineExpose({ openEditor })
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

The same macro-position failures remain distinct: a runtime declaration precedes a contract macro, another macro is nested inside a function, and a lifecycle statement follows defineExpose without top-level await.

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loading = ref(false)
const props = defineProps<{ candidateId: string }>()

const createEmitter = () => {
  return defineEmits<{ saved: [candidateId: string] }>()
}

const openEditor = () => {
  visible.value = true
}
defineExpose({ openEditor })
onMounted(loadCandidate)
</script>
```

## Review Checklist

- Every compiler macro call is in `<script setup>` script scope, never inside nested control flow.
- Every macro except `defineExpose` forms the first declaration group after required imports.
- Without top-level `await`, `defineExpose` is the final statement; with top-level `await`, initialized public bindings are exposed before the first suspension.
