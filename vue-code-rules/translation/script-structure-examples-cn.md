# 脚本结构示例

> 本文件仅翻译 `vue-code-rules/references/script-structure-examples.md`，代码示例与英文 reference 保持一致。

1. 编译器宏只能位于 `<script setup>` 顶层。除 `defineExpose` 外的宏紧跟导入形成第一声明组；无顶层 await 时 expose 最后，有顶层 await 时在首次挂起前暴露已初始化绑定。
2. 显式导入 Vue/Vue Router API 前检查实际 Vite 自动导入配置；已覆盖项直接使用，未覆盖或无法验证时显式导入。

## 场景 1：排序契约宏并处理异步暴露

除 `defineExpose` 外的宏紧跟导入形成第一声明组；无顶层 await 时 expose 最后，有顶层 await 时在首次挂起前暴露已初始化绑定。

以上两段描述的是同一个组件和同一组声明，只改变宏的位置。把编译器宏放进函数、回调、条件或循环也同样无效，因为宏已经离开 `<script setup>` 顶层作用域。

**正例：**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emit = defineEmits<{ saved: [candidateId: string] }>()

// 保存页面加载状态。
const loading = ref(false)
// 控制候选人编辑器是否显示。
const visible = ref(false)
// 加载当前候选人详情并维护加载状态。
const loadCandidate = async () => {
  loading.value = true
  try {
    await getCandidate(props.candidateId)
  } finally {
    loading.value = false
  }
}
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

**反例：**

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

## 场景 2：省略 Vite 自动导入已覆盖的导入

以实际 Vite 插件配置为准，已覆盖的 Vue/Vue Router API 不重复显式导入。

**场景配置：**

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

**正例：**

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

**反例：**

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

## 场景 3：显式导入自动导入未覆盖的 API

自动导入可能只覆盖部分 API；未覆盖项必须显式导入，并检查模式分支和共享配置。

**场景配置：**

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

**正例：**

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

**反例：**

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 保存候选人搜索关键字。
const keyword = ref('')
// 提供规范化后的候选人搜索关键字。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
