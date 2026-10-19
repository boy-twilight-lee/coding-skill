# Vue 脚本注释示例

> 本文件仅翻译 `vue-code-rules/references/script-comment-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

对于 `<script lang="ts">` 和 `<script setup lang="ts">`，通用声明、函数、回调、内部注释、冗余包装器、中间值和守卫规则以 `ts-code-rules` 为准；本节只补充 Vue 特有的放置方式和编译器宏例外。

JavaScript Vue 脚本直接应用同一基线：运行时声明和函数需要简洁的中文业务注释，内部注释只说明重要且非显然的逻辑；一次性回调保留在注册位置，除非提取后形成独立职责；不能为了添加注释而保留冗余结构。

1. 普通运行时声明遵循源语言的声明注释基线。Vue 编译器宏及接收 `defineProps`、`withDefaults`、`defineEmits`、`defineExpose`、`defineOptions`、`defineSlots` 等宏结果的变量或解构声明上方不得添加通用声明注释。
2. watcher、生命周期钩子或内联回调由所属 API 调用或对象属性上方的一条紧邻注释统一说明；不要只为满足源语言回调规则而在回调内部重复同一注释。
## 场景 1：应用编译器宏例外

编译器宏不添加声明注释，普通运行时状态仍需注释：

不要在编译器宏上方添加 `// 接收组件属性。` 之类的通用注释。宏名称和类型参数已经表达声明角色；非显然业务含义应写入 prop 或事件契约。

**正例：**

```ts
const props = defineProps<{
  candidateId: string
}>()
const emit = defineEmits<{
  saved: [candidateId: string]
}>()

// 标识候选人详情是否正在加载。
const loading = ref(false)
// 提交候选人并通知父组件。
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

## 场景 2：放置 watcher 与生命周期注释

注释紧邻 Vue API 调用，并描述其中的回调：

不要只为满足回调注释规则而在回调内部再写一条注释。

**正例：**

```ts
// 在筛选条件变化后重新加载候选人列表。
watch(filters, async () => {
  await loadCandidates()
})

// 在页面挂载后初始化候选人数据。
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
- JavaScript SFC 同样应用运行时声明、函数、内部注释和冗余结构基线。
- 编译器宏上方没有声明注释。
- watcher、生命周期和内联回调注释紧邻其所属调用或属性。
