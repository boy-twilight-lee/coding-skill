# Vue 脚本注释示例

> 本文件仅翻译 `vue-code-rules/references/script-comment-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

对于 `<script lang="ts">` 和 `<script setup lang="ts">`，通用声明、函数、回调、内部注释、冗余包装器、中间值和守卫规则以 `ts-code-rules` 为准；本节只补充 Vue 特有的放置方式和编译器宏例外。

JavaScript Vue 脚本直接应用同一基线：只注释非显然业务含义、契约、副作用、时序或错误行为；一次性回调保留在注册位置，除非提取后形成独立职责；不能为了添加注释而保留冗余结构。

1. 普通运行时声明遵循源语言的注释判断基线。Vue 编译器宏及接收 `defineProps`、`withDefaults`、`defineEmits`、`defineExpose`、`defineOptions`、`defineSlots` 等宏结果的变量或解构声明上方不得添加通用声明注释；非显然的 prop、事件、slot 或 model 语义写入对应契约。
2. watcher、生命周期钩子或内联回调在来源、API 名称、回调体和上下文已经清楚时不需要注释。只有非显然原因、时序、副作用或错误契约需要说明时，才在所属 API 调用或对象属性上方添加一条紧邻注释，并且不在回调内部重复。
## 场景 1：应用编译器宏例外

编译器宏不添加通用声明注释；普通运行时状态同样只在含义不够自解释时注释：

不要在编译器宏上方添加 `// 接收组件属性。` 之类的通用注释。宏名称和类型参数已经表达声明角色；非显然业务含义应写入 prop 或事件契约。

**正例：**

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

**反例：**

```ts
// 接收组件属性。
const props = defineProps<{
  candidateId: string
}>()
```

## 场景 2：判断 watcher 与生命周期是否需要注释

清楚的注册逻辑可以不写注释：

只有非显然约束需要说明时，注释才紧邻 Vue API 调用；不要在回调内部重复。

**正例：**

```ts
watch(filters, async () => {
  await loadCandidates()
})

onMounted(async () => {
  await loadCandidates()
})
```

```ts
// 延迟到挂载后请求，因为接口需要读取已渲染表格的尺寸。
onMounted(async () => {
  await loadCandidates()
})
```

**反例：**

```ts
watch(filters, async () => {
  // 在筛选条件变化后重新加载候选人列表。
  await loadCandidates()
})

onMounted(async () => {
  // 在页面挂载后初始化候选人数据。
  await loadCandidates()
})
```

## 复核清单

- TypeScript SFC 使用 `ts-code-rules` 作为通用脚本质量规则，本节只提供 Vue 特有放置方式和例外。
- JavaScript SFC 同样应用非显然性、放置位置、内部注释和冗余结构基线。
- 编译器宏上方没有声明注释。
- 清楚的 watcher、生命周期和内联回调不写注释；必要注释紧邻其所属调用或属性。
