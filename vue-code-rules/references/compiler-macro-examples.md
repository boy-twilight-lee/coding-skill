# Compiler Macro Examples

Owns Core Rule 7.

For the runtime import prerequisites in these examples, read Core Rule 6's [Auto-Import Examples](auto-import-examples.md). For compiler-macro comment exceptions and business contract documentation, read Core Rule 8's [Vue Script Comment Examples](script-comment-examples.md).

## Mandatory Rules

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

## Scenario 1: Order Contract Macros and Handle Async Exposure

**Positive example:**

Keep every macro except `defineExpose` together as the first declaration group after required imports. Without top-level `await`, put `defineExpose` last, after every declaration and executable statement. Macro declarations do not receive declaration comments:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emit = defineEmits<{ saved: [candidateId: string] }>()

const loading = ref(false)
const visible = ref(false)
const loadCandidate = async () => {
  loading.value = true
  try {
    await getCandidate(props.candidateId)
  } finally {
    loading.value = false
  }
}
const handleSave = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
}
const openEditor = () => {
  visible.value = true
}
onMounted(loadCandidate)

defineExpose({ openEditor })
</script>
```

In a script without top-level `await`, bottom placement ensures exposed bindings are initialized and gives the component one predictable public-boundary marker. No statements follow `defineExpose` in that case.

When top-level `await` is needed, initialize the public bindings and expose them before the first suspension. Async initialization may follow; update the already exposed refs instead of delaying exposure until the data arrives:

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

The explicit `ref` import assumes auto-import does not cover it. The API returns the candidate name as a string. This exception applies to top-level `await`, not to an `await` inside a function or lifecycle callback. Do not move exposure ahead of the initialization of its public bindings. See [Vue template refs](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component) for the exposure-before-await requirement.

**Negative example:**

Do not place the same compiler macros after unrelated runtime declarations, inside nested control flow, or put executable statements after `defineExpose` when there is no top-level `await`:

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
