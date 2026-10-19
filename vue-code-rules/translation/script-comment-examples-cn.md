# Vue 脚本注释示例

> 本文件仅翻译 `vue-code-rules/references/script-comment-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

对于 `<script lang="ts">` 和 `<script setup lang="ts">`，通用声明、函数、回调、内部注释、冗余包装器、中间值和守卫规则以 `ts-code-rules` 为准；本节只补充 Vue 特有的放置方式和编译器宏例外。

JavaScript Vue 脚本直接应用同一基线：运行时声明和函数需要简洁的中文业务注释，内部注释只说明重要且非显然的逻辑，不能为了添加注释而保留冗余结构。

1. 每个运行时变量和常量都在声明紧邻上方用中文说明业务用途或状态含义；导入、函数参数和纯类型声明不需要单独注释。Vue 编译器宏及接收 `defineProps`、`withDefaults`、`defineEmits`、`defineExpose`、`defineOptions`、`defineSlots` 等宏结果的变量或解构声明上方不得添加声明注释。
2. 每个函数、方法、composable、事件处理器、watcher、生命周期钩子和回调都要说明职责、副作用或返回含义。内联回调只要其所在声明、API 调用、watcher、生命周期调用或对象属性上方的紧邻注释能够明确描述它，就不需要重复注释。
3. 只服务一个注册点且仅延续当前 Vue 或 API 流程的回调应留在注册位置。只有真实复用、独立业务职责、聚焦测试或明确可读性收益时才提取；回调长度本身不是创建一次性 `handle*` 或 reset 函数的理由。
4. 函数内部只注释关键业务、非显然转换、重要分支、副作用和错误处理，不逐句解释普通赋值或调用，也不能为了制造名称或注释目标而引入透传函数、一次性中间值或调用方已经保证的守卫。

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

不要只为满足回调注释规则而在回调内部再写一条注释。只有回调具备独立职责、复用、聚焦测试价值或明确可读性收益时才提取为命名函数。

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

## 场景 3：保持一次性 Vue 流程连续

回调只服务一个注册位置时保持就地编写，并信任已经核实的 Vue 契约：

不要仅为了缩短拥有者或增加声明注释而提取这两个内联回调。只有其他调用方、Vue 或被调用 API 确实可能提供对应状态时才保留守卫。

**正例：**

```ts
// 打开图形验证码并在通过后请求发送短信验证码。
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({
    // 图形验证码通过后继续完成短信发送流程。
    onOk: async (validate: string) => {
      status.value = 'sending'
      await sendPhoneVerificationCode({ phone: phone.value, validate })
      status.value = 'sent'
      startCountdown()
    }
  })
}

// 在手机号变化时就地清理关联的验证码及准入状态。
watch(phone, () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
})
```

**反例：**

```ts
// 图形验证码通过后继续完成短信发送流程。
const handleCaptchaVerified = async (validate: string) => {
  status.value = 'sending'
  await sendPhoneVerificationCode({ phone: phone.value, validate })
  status.value = 'sent'
  startCountdown()
}
// 打开图形验证码并请求发送短信验证码。
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({ onOk: handleCaptchaVerified })
}
// 清理关联的验证码及准入状态。
const resetVerification = () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
}
// 在手机号变化时作废原短信验证状态。
watch(phone, resetVerification)
```

## 复核清单

- TypeScript SFC 使用 `ts-code-rules` 作为通用脚本质量规则，本节只提供 Vue 特有放置方式和例外。
- JavaScript SFC 同样应用运行时声明、函数、内部注释和冗余结构基线。
- 编译器宏上方没有声明注释。
- watcher、生命周期和内联回调注释紧邻其所属调用或属性。
- 一次性回调保留在注册位置，除非提取具有明确职责或可读性收益。
- 注释说明业务用途或副作用，不能用于保留冗余代码。
