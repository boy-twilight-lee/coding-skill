# Script Structure Examples

## Mandatory Rules

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

2. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

## Scenario 1: Order Contract Macros and Handle Async Exposure

Do not place compiler macros after unrelated runtime declarations or inside nested control flow:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 保存页面加载状态。
const loading = ref(false)
// ❌ 组件契约宏被普通运行时声明隔开。
const props = defineProps<{ candidateId: string }>()

// ❌ 编译宏不能放在函数或其他嵌套作用域中。
const createEmitter = () => {
  return defineEmits<{ saved: [candidateId: string] }>()
}

// 打开候选人编辑器。
const openEditor = () => {
  visible.value = true
}
defineExpose({ openEditor })
// ❌ 没有顶层 await 时，defineExpose 后面不能再出现声明或可执行语句。
onMounted(loadCandidate)
</script>
```

Keep every macro except `defineExpose` together as the first declaration group after required imports. Without top-level `await`, put `defineExpose` last, after every declaration and executable statement. Macro declarations do not receive declaration comments:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emit = defineEmits<{ saved: [candidateId: string] }>()

// 保存页面加载状态。
const loading = ref(false)
// 提交当前候选人并通知父组件。
const handleSave = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
}
// 打开候选人编辑器。
const openEditor = () => {
  visible.value = true
}
// 在组件挂载后加载候选人详情。
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
// 保存候选人的展示名称，详情加载完成后更新。
const candidateName = ref('')

defineExpose({ candidateName })

candidateName.value = await loadCandidateName(props.candidateId)
</script>
```

The explicit `ref` import assumes auto-import does not cover it. The API returns the candidate name as a string. This exception applies to top-level `await`, not to an `await` inside a function or lifecycle callback. Do not move exposure ahead of the initialization of its public bindings. See [Vue template refs](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component) for the exposure-before-await requirement.

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

With that configuration active, these explicit imports are redundant:

```vue
<script setup lang="ts">
// ❌ These APIs are already supplied by the active Vite auto-import plugin.
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 提供候选人详情页的路由跳转能力。
const router = useRouter()
// 保存候选人搜索关键字。
const keyword = ref('')
// 提供规范化后的候选人搜索关键字。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

Use the covered APIs directly:

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 提供候选人详情页的路由跳转能力。
const router = useRouter()
// 保存候选人搜索关键字。
const keyword = ref('')
// 提供规范化后的候选人搜索关键字。
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

Import the uncovered APIs and continue using the covered API directly:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 保存候选人搜索关键字。
const keyword = ref('')
// 提供规范化后的候选人搜索关键字。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

Check configuration branches, modes, shared plugin factories, and target-specific Vite files before deciding coverage. A generated `auto-imports.d.ts` can corroborate the configuration but does not replace checking whether the corresponding plugin is active for the current build.

## Review Checklist

- Every compiler macro call is in `<script setup>` script scope, never inside nested control flow.
- Every macro except `defineExpose` forms the first declaration group after required imports.
- Without top-level `await`, `defineExpose` is the final statement; with top-level `await`, initialized public bindings are exposed before the first suspension.
- Vite and referenced auto-import configuration are checked before adding Vue or Vue Router imports.
- Covered APIs have no redundant explicit imports; uncovered APIs are imported normally.
