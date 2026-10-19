# Script Structure Examples

## Mandatory Rules

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

2. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

## Scenario 1: Order Contract Macros and Handle Async Exposure

**Positive example:**

Keep every macro except `defineExpose` together as the first declaration group after required imports. Without top-level `await`, put `defineExpose` last, after every declaration and executable statement. Macro declarations do not receive declaration comments:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emit = defineEmits<{ saved: [candidateId: string] }>()

// [Write in Chinese: store the page loading state.]
const loading = ref(false)
// [Write in Chinese: control whether the candidate editor is visible.]
const visible = ref(false)
// [Write in Chinese: load the current candidate details and maintain the loading state.]
const loadCandidate = async () => {
  loading.value = true
  try {
    await getCandidate(props.candidateId)
  } finally {
    loading.value = false
  }
}
// [Write in Chinese: submit the current candidate and notify the parent component.]
const handleSave = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
}
// [Write in Chinese: open the candidate editor.]
const openEditor = () => {
  visible.value = true
}
// [Write in Chinese: load candidate details after the component mounts.]
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
// [Write in Chinese: store the candidate display name and update it after the details load.]
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

// [Write in Chinese: store the page loading state.]
const loading = ref(false)
// ❌ [Write in Chinese: a regular runtime declaration separates the component contract macros.]
const props = defineProps<{ candidateId: string }>()

// ❌ [Write in Chinese: compiler macros cannot appear inside a function or another nested scope.]
const createEmitter = () => {
  return defineEmits<{ saved: [candidateId: string] }>()
}

// [Write in Chinese: open the candidate editor.]
const openEditor = () => {
  visible.value = true
}
defineExpose({ openEditor })
// ❌ [Write in Chinese: without top-level await, no declaration or executable statement may follow defineExpose.]
onMounted(loadCandidate)
</script>
```

## Scenario 2: Omit Imports Covered by Vite Auto-Import

Inspect the active Vite configuration and any imported shared plugin configuration. For example:

```ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/type/auto-imports.d.ts'
    })
  ]
})
```

**Positive example:**

With that configuration active, use the covered APIs directly:

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

// [Write in Chinese: read route information for the current candidate page.]
const route = useRoute()
// [Write in Chinese: provide navigation for the candidate details page.]
const router = useRouter()
// [Write in Chinese: store the candidate search keyword.]
const keyword = ref('')
// [Write in Chinese: provide the normalized candidate search keyword.]
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**Negative example:**

Do not retain explicit imports for those same APIs:

```vue
<script setup lang="ts">
// ❌ These APIs are already supplied by the active Vite auto-import plugin.
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

// [Write in Chinese: read route information for the current candidate page.]
const route = useRoute()
// [Write in Chinese: provide navigation for the candidate details page.]
const router = useRouter()
// [Write in Chinese: store the candidate search keyword.]
const keyword = ref('')
// [Write in Chinese: provide the normalized candidate search keyword.]
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

## Scenario 3: Import APIs Not Covered by Auto-Import

Auto-import coverage may be partial. If the active configuration covers only `ref`, do not assume that `computed` or `useRoute` is also available:

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

**Positive example:**

Import the uncovered APIs and continue using the covered API directly:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

// [Write in Chinese: read route information for the current candidate page.]
const route = useRoute()
// [Write in Chinese: store the candidate search keyword.]
const keyword = ref('')
// [Write in Chinese: provide the normalized candidate search keyword.]
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

Check configuration branches, modes, shared plugin factories, and target-specific Vite files before deciding coverage. A generated `auto-imports.d.ts` can corroborate the configuration but does not replace checking whether the corresponding plugin is active for the current build.

**Negative example:**

Do not omit imports for the same uncovered `computed` and `useRoute` APIs:

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

// [Write in Chinese: read route information for the current candidate page.]
const route = useRoute()
// [Write in Chinese: store the candidate search keyword.]
const keyword = ref('')
// [Write in Chinese: provide the normalized candidate search keyword.]
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

## Review Checklist

- Every compiler macro call is in `<script setup>` script scope, never inside nested control flow.
- Every macro except `defineExpose` forms the first declaration group after required imports.
- Without top-level `await`, `defineExpose` is the final statement; with top-level `await`, initialized public bindings are exposed before the first suspension.
- Vite and referenced auto-import configuration are checked before adding Vue or Vue Router imports.
- Covered APIs have no redundant explicit imports; uncovered APIs are imported normally.
