# Script Structure Examples

## Scenario 1: Keep Contract Macros at the Top and `defineExpose` at the Bottom

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
// ❌ defineExpose 后面不能再出现其他声明或可执行语句。
onMounted(loadCandidate)
</script>
```

Keep every macro except `defineExpose` together as the first declaration group after required imports. Put `defineExpose` last, after every declaration and executable statement. Macro declarations do not receive declaration comments:

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

The bottom placement ensures every exposed binding has already been initialized and gives the component one predictable public-boundary marker. Do not place declarations, watchers, lifecycle calls, or other statements after `defineExpose`.

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
- `defineExpose` is the final statement in `<script setup>`, with nothing after it.
- Vite and referenced auto-import configuration are checked before adding Vue or Vue Router imports.
- Covered APIs have no redundant explicit imports; uncovered APIs are imported normally.
