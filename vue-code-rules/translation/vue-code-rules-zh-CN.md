# vue-code-rules 中文翻译

> 本文件仅供人工阅读。它没有被 `SKILL.md`、`agents/openai.yaml` 或任何 `references` 路由引用，因此不会自动进入 skill 上下文。当前 `SKILL.md` 是轻量入口，强制规则与示例按决策类型存放在 `references` 中；本文件将它们合并为便于人工查阅的中文版本。所有原始 fenced code 示例均原样保留。

## 当前技能结构

- `SKILL.md`：保留适用范围、优先级、reference 路由、跨技能组合和工作流程。
- `references/`：每份文件先列出对应的强制规则，再提供完整示例和复核清单。
- `translation/vue-code-rules-zh-CN.md`：仅供人工阅读，不参与 Codex 自动路由。

## 适用范围、优先级与工作流程

所有新增、修改或审查的 Vue 代码都应用相关规则。现有代码只能作为上下文，不能免除规则；不要仅为了统一而迁移未触及代码。更高优先级指令覆盖本技能；只有规则明确委托给仓库配置时，仓库配置或惯例才覆盖对应规则。无法满足强制规则时采用最小必要偏离，并准确报告冲突。

开始前检查仓库指令、目标组件、邻近组件、构建、Lint、格式化和 TypeScript 配置，并根据当前决策读取匹配的 reference。修改限定在请求范围，完成后逐行复核并运行最小格式化、Lint、Vue 类型检查和相关测试。SFC 中的 TypeScript 与样式还要分别应用 `ts-code-rules` 与 `css-code-rules`；每个相关 skill 只应用一次，不递归重复读取已经加载的 skill。

## 引用路由

- 模板区块顺序、列表、模板表达式、组件标签、插槽、DOM、语义元素或类绑定：`references/template-examples.md`。
- SFC 区块、template 或 JavaScript 脚本空行：`references/blank-line-examples.md`；TypeScript 脚本与 style 空行分别由 TS/CSS skill 管理。
- Vue 导入、编译器宏、运行时声明或自动导入判断：`references/script-structure-examples.md`。
- Vue 编译器宏、watcher、生命周期的注释位置，以及 JavaScript SFC 的通用脚本注释：`references/script-comment-examples.md`；TypeScript SFC 的通用脚本质量由 TS skill 管理。
- 组件拆分、composable、命名、目录、公开入口或私有所有权：`references/component-structure-examples.md`。
- `use**Context`、provider、injector、回退对象或消费者：`references/complex-component-context-examples.md`。
- 页面、组件、layout、私有模块、目标专属目录、依赖或工具：`references/application-architecture-examples.md`。

## 模板规则

1. 现有区块严格按 template、script、style 顺序，不使用的区块省略。
2. 重复 UI 使用结构化数据、`v-for` 和稳定唯一键。
3. 复杂业务转换和条件移入 computed 或函数。
4. 自定义组件标签使用 kebab-case，无子内容时自闭合。
5. 组件根和层级匹配业务职责；命名插槽只作明确扩展点。
6. 删除无独立布局、定位、动画、交互或分组职责的包装 DOM。
7. 普通布局用 div/span；交互、语义和无障碍确有含义时使用原生语义元素。
8. 多个类来源统一放一个 `:class` 数组；单一静态类或单一动态对象可用最简单形式。

### 对应强制规则与完整示例：`references/template-examples.md`

#### 场景 1：保持 SFC 区块顺序

现有 SFC 区块严格按 template、script、style 顺序排列；不用的区块直接省略。

```vue
<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style lang="less" scoped>
.user-card {
  color: var(--text-color-primary);
}
</style>
```

#### 场景 2：渲染可变列表

可变列表用结构化数据和稳定唯一业务键，身份会变化时不得使用数组索引。

```vue
<user-card
  v-for="user in users"
  :key="user.id"
  :user="user"
/>
```

```vue
<user-card v-for="(user, index) in users" :key="index" :user="user" />
```

#### 场景 3：把业务逻辑移出模板

复杂条件和业务转换移入 computed 或函数，让模板保持声明式。

```vue
<template>
  <span class="order-card-status">{{ orderStatusText }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()
// 展示当前订单经过业务映射后的状态文案。
const orderStatusText = computed(() => getOrderStatusText(props.status))
</script>
```

#### 场景 4：使用自定义组件标签和插槽

自定义组件用 kebab-case，无内容时自闭合；命名插槽只用于明确扩展点。

```vue
<user-avatar :src="user.avatar" />
```

```vue
<template>
  <div class="user-card">
    <span class="user-card-name">{{ props.name }}</span>
    <div class="user-card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>
```

```vue
<user-card :name="user.name">
  <template #actions>
    <user-actions :user-id="user.id" />
  </template>
</user-card>
```

#### 场景 5：删除无意义 DOM

能直接样式化目标元素时不增加包装；容器必须拥有独立布局、定位、动画、交互或分组职责。

```vue
<span class="user-card-name">{{ user.name }}</span>
```

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

#### 场景 6：选择通用、交互或语义元素

普通布局用 div/span；交互使用原生交互元素，语义元素只在真实结构、SEO、数据或无障碍含义存在时使用。

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" aria-hidden="true" />
</div>
```

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  查看详情
</button>
```

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

#### 场景 7：用一个数组绑定组合多个类来源

同一元素的多个类来源统一放入一个可读的 `:class` 数组，不拆成静态与动态属性，也不拼接长字符串。

```vue
<template>
  <div
    :class="[
      'candidate-card',
      densityClass,
      {
        'candidate-card-active': props.active,
        'candidate-card-disabled': props.disabled
      }
    ]"
  >
    <span class="candidate-card-name">{{ props.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CandidateCardProps } from './type'

const props = defineProps<CandidateCardProps>()
// 提供候选人卡片当前密度对应的类名。
const densityClass = computed(() => `candidate-card-${props.density}`)
</script>
```

```ts
export interface CandidateCardProps {
  active: boolean
  density: 'compact' | 'normal'
  disabled: boolean
  name: string
}
```

```vue
<div :class="['candidate-card', { 'candidate-card-active': active }]" />
```

```vue
<div
  class="candidate-card candidate-card-compact"
  :class="{
    'candidate-card-active': active,
    'candidate-card-disabled': disabled
  }"
/>
```

```vue
<div
  :class="`candidate-card candidate-card-${density} ${active ? 'candidate-card-active' : ''} ${disabled ? 'candidate-card-disabled' : ''}`"
/>
```

```vue
<div :class="['candidate-card', densityClass, { 'candidate-card-active': active, 'candidate-card-disabled': disabled, 'candidate-card-loading': loading }]" />
```

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 空行规则

本节负责 SFC 顶层区块、template 和 JavaScript Vue 脚本的空行。TypeScript 脚本的声明与语句间距以 `ts-code-rules` 为准，style 区块的选择器与声明间距以 `css-code-rules` 为准。

1. 顶层 SFC 区块或真正独立的逻辑区域之间最多一个空行；禁止连续空行和区块内部首尾空行。
2. template 中紧密节点保持连续，只在独立 UI 区域之间保留一个空行。
3. JavaScript 脚本中不在代码块边缘、注释与声明之间或紧密语句之间插入空行。
4. style 区块直接应用 CSS skill，不从 template 或 script 示例推断样式空行规则。

### 对应强制规则与完整示例：`references/blank-line-examples.md`

#### 场景 1：分隔 SFC 区块

顶层 SFC 区块之间最多一个空行，区块内部开头和结尾不留空行；不要为了补齐顺序添加空区块。

```vue
<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style lang="less" scoped>
.user-card {
  color: var(--text-color-primary);
}
</style>
```

#### 场景 2：组织模板节点

模板空行只区分真实 UI 区域，不能把紧密节点或同一列表项拆散。

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

#### 场景 3：组织 JavaScript 脚本逻辑

JavaScript 脚本中，空行只分隔不同职责，注释必须紧贴声明：

```js
// 保存当前选中的用户标识。
const selectedUserId = ref('')
// 展示当前是否已经选择用户。
const hasSelectedUser = computed(() => Boolean(selectedUserId.value))

// 清除当前用户选择。
const clearSelectedUser = () => {
  selectedUserId.value = ''
}
```

TypeScript 脚本改用 TS skill 的对应规则，不把此 JavaScript 示例叠加为另一套要求。

#### 复核清单

确认 SFC 区块内外没有装饰性空行，template 只在独立 UI 区域间分组，JavaScript 注释紧贴声明，并由 TS/CSS skill 分别检查 TypeScript 与样式空行。

## 脚本结构规则

1. 编译器宏只能位于 `<script setup>` 顶层。除 `defineExpose` 外的宏紧跟导入形成第一声明组；无顶层 await 时 expose 最后，有顶层 await 时在首次挂起前暴露已初始化绑定。
2. 显式导入 Vue/Vue Router API 前检查实际 Vite 自动导入配置；已覆盖项直接使用，未覆盖或无法验证时显式导入。

### 对应强制规则与完整示例：`references/script-structure-examples.md`

#### 场景 1：排序契约宏并处理异步暴露

除 `defineExpose` 外的宏紧跟导入形成第一声明组；无顶层 await 时 expose 最后，有顶层 await 时在首次挂起前暴露已初始化绑定。

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

#### 场景 2：省略 Vite 自动导入已覆盖的导入

以实际 Vite 插件配置为准，已覆盖的 Vue/Vue Router API 不重复显式导入。

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

#### 场景 3：显式导入自动导入未覆盖的 API

自动导入可能只覆盖部分 API；未覆盖项必须显式导入，并检查模式分支和共享配置。

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

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

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 脚本注释规则

TypeScript SFC 的通用声明、函数、回调、内部注释和冗余代码规则以 `ts-code-rules` 为准；本节只增加 Vue 编译器宏、watcher、生命周期和回调注册位置的特殊要求。JavaScript SFC 直接应用下面的同等基础规则。

1. 每个运行时变量和常量有紧邻中文业务注释；导入、参数、纯类型和编译器宏例外，宏上方不得写声明注释。
2. 每个函数、方法、composable、回调、处理器、watcher 和生命周期钩子有相邻职责注释；单一注册点的连续回调可保持内联。
3. 内部只注释关键业务、非显然转换、重要分支、副作用和错误处理。
4. 不为名称或注释保留透传包装器、无意义中间值或重复守卫。

### 活跃 Vue 特有规则：`references/script-comment-examples.md`

下面继续保留完整人工示例，便于阅读和比较；它们不会重复进入自动 skill 上下文。

#### 场景 1：按业务含义注释变量

变量注释说明业务用途或状态，不复述标识符。

```ts
// 保存当前编辑的候选人标识。
const candidateId = ref('')
// 标识候选人详情是否正在加载。
const loading = ref(false)
// 提供当前候选人的完整展示名称。
const candidateDisplayName = computed(() => formatCandidateName(candidate.value))
```

```ts
// 定义 candidateId。
const candidateId = ref('')
```

```ts
// 读取候选人详情页所需的路由参数。
const { candidateId, source } = route.query
```

#### 场景 2：注释函数和处理器

函数和事件处理器注释说明职责、副作用或返回含义。

```ts
// 提交候选人表单并在成功后返回列表页。
const submitCandidate = async () => {
  await saveCandidate(form.value)
  await router.push({ name: 'candidate-list' })
}

// 处理候选人卡片的选择事件。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

#### 场景 3：提取确需独立说明的回调

回调只有具备独立职责、复用、测试或明确可读性收益时才提取。

```ts
// 保留拥有有效联系方式的候选人。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 提供可以联系的候选人列表。
const contactableCandidates = computed(() => candidates.value.filter(hasValidContact))
```

```ts
// 按候选人标识建立详情索引。
const candidateMap = new Map(candidates.value.map((candidate) => [candidate.id, candidate]))
```

#### 场景 4：注释 watcher 与生命周期钩子

watcher 和生命周期调用用紧邻注释说明观察目的或副作用。

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

#### 场景 5：只注释重要内部逻辑

内部注释只放在关键业务、非显然转换、重要分支和错误路径。

```ts
// 提交候选人表单并处理服务端校验失败。
const submitCandidate = async () => {
  try {
    await saveCandidate(form.value)
  } catch (error) {
    // 将服务端字段错误同步回表单控件。
    applyServerErrors(error)
    throw error
  }
}
```

#### 场景 6：不要注释 Vue 编译器宏

编译器宏及接收宏结果的声明上方不得添加声明注释。

```ts
// ❌ 接收组件属性。
const props = defineProps<{ phone: string }>()
// ❌ 声明组件事件。
const emit = defineEmits<{ change: [phone: string] }>()
// ❌ 设置组件默认选项。
defineOptions({ inheritAttrs: false })
```

```ts
const props = defineProps<{ phone: string }>()
const emit = defineEmits<{ change: [phone: string] }>()
defineOptions({ inheritAttrs: false })
```

#### 场景 7：删除冗余包装器、中间变量和守卫

不要为命名或注释而保留透传包装器、一次性中间值或调用契约已保证的守卫。

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ 仅转发另一个判断，没有新增语义或行为。
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// 在手机号变化时清除原短信准入签名。
watch(phone, (currentPhone, previousPhone) => {
  // ❌ 一次性中间变量没有增加业务含义。
  const hasChanged = currentPhone !== previousPhone
  // ❌ watch 已保证基础值变化时才调用，重复判断没有保护作用。
  if (!hasChanged) return
  resetVerification()
})
```

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// 在手机号变化时清除原短信准入签名。
watch(phone, () => {
  resetVerification()
})
```

#### 场景 8：保持一次性回调流程连续

只服务一个注册点且延续同一流程的回调放在注册位置；仅在独立职责、复用、测试或明显可读性收益时提取。

```ts
// ❌ 校验函数重复检查唯一调用方已经保证的验证码长度。
const verifyCurrentCode = async () => {
  if (
    status.value === 'verifying' ||
    code.value.length !== PHONE_VERIFICATION_CODE_LENGTH ||
    phone.value !== sentPhone.value
  ) {
    return
  }
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// 接收验证码输入并在达到完整位数后立即校验。
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// ❌ 该回调只服务于 handleRequestCode，却被拆到远处。
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
// ❌ 该重置函数只作为这一个 watcher 的回调。
const resetVerification = () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
}
// 在手机号变化时作废原短信验证状态。
watch(phone, resetVerification)
```

```ts
// 校验用户输入的短信验证码并保存查询准入签名。
const verifyCurrentCode = async () => {
  if (status.value === 'verifying' || phone.value !== sentPhone.value) return
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// 接收验证码输入并在达到完整位数后立即校验。
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
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

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 组件结构规则

目录管理的页面或组件优先使用以下结构；可选目录和文件只有具备真实的拥有者职责时才创建。

```text
<owner>/
|-- index.vue
|-- index.ts              组件公开导出
|-- index.less            可选的独立局部样式
|-- component/
|   |-- simple-child.vue  内聚的私有子组件
|   `-- complex-child/
|       |-- index.vue
|       |-- index.ts
|       |-- component/    子组件私有组件
|       `-- hooks/        子组件私有 composable
|-- hooks/                拥有者私有 composable
|-- constants/            拥有者私有常量
`-- type/                 拥有者私有类型
```

1. 按独立 UI 职责、内聚复用行为或真实维护困难拆分；紧密关联的模板、状态和操作保持在一起。状态在多层组件间重复传递和更新时使用专用 `use**Context`。
2. 组件文件、目录和标签使用 kebab-case；composable 文件通常使用 kebab-case，`hooks/` 内按约定使用 camelCase。
3. 既有页面/组件树中的一级页面和组件使用包含 `index.vue` 与 `index.ts` 的目录形式。只有拥有者私有 `component/` 内的简单子组件可使用单文件；出现有意义的配套文件后再升级为目录。
4. 目录组件的 `index.ts` 只导出 `index.vue` 和有意公开的类型。普通 setup 与样式留在 SFC；只有具备真实所有权或维护收益时才增加 `index.less`、hooks、常量、类型或私有子组件。
5. 私有单元跟随拥有者，每个 `.vue` 不超过 1000 行。只有真实跨页面复用后才提升私有子组件，并同步公开入口和消费者；不要为了统一结构迁移无关组件。

### 对应强制规则与完整示例：`references/component-structure-examples.md`

#### 场景 1：按职责拆分

组件按独立 UI 职责或内聚可复用单元拆分，不能按行数或任意视觉区机械切割。

```text
candidate-list/
|-- index.vue
|-- index.ts
|-- component/
|   |-- candidate-filter.vue
|   `-- candidate-table/
|       |-- index.vue
|       |-- index.ts
|       `-- hooks/
|           `-- useCandidateSelection.ts
`-- hooks/
    `-- useCandidateList.ts
```

#### 场景 2：把可复用行为提取为 composable

内聚的可复用状态、副作用和业务行为提取到 composable；连续局部流程保持在组件中。

```ts
// 管理候选人筛选条件及其重置行为。
export const useCandidateFilters = () => {
  // 保存当前候选人筛选条件。
  const filters = ref(createDefaultFilters())
  // 标识当前是否存在已应用的筛选条件。
  const hasActiveFilters = computed(() => hasFilters(filters.value))
  // 恢复候选人筛选条件的默认值。
  const resetFilters = () => {
    filters.value = createDefaultFilters()
  }
  return { filters, hasActiveFilters, resetFilters }
}
```

不要提取只搬走一个组件私有 ref、没有复用行为或独立职责的 composable：

```ts
// 创建候选人弹窗的显示状态。
export const useCandidateDialogVisible = () => {
  // 标识候选人弹窗是否显示。
  const visible = ref(false)
  return { visible }
}
```

一次性展示状态留在拥有组件中：

```ts
// 标识候选人弹窗是否显示。
const candidateDialogVisible = ref(false)
```

只有行为拥有内聚的状态、派生值、操作和副作用，具备真实复用，或形成清晰的测试与维护边界时才提取。

#### 场景 3：应用命名约定

组件文件和标签使用 kebab-case；composable 文件通常 kebab-case，`hooks/` 内按约定使用 camelCase。

```text
components/
|-- user-avatar/
|   |-- index.vue
|   `-- index.ts
`-- user-card/
    |-- index.vue
    |-- index.ts
    |-- component/
    |   `-- user-card-label.vue
    `-- hooks/
        `-- useUserCard.ts

candidate-page/
|-- index.vue
|-- index.ts
`-- hooks/
    `-- useCandidateList.ts
```

```vue
<user-card />
```

#### 场景 4：私有子组件和 hooks 跟随拥有者

私有子组件放拥有者的 `component/`，私有 composable 放 `hooks/`，不基于假设复用提升。

```text
workbench/
|-- index.vue
|-- index.ts
|-- component/
|   `-- workbench-toolbar.vue
`-- hooks/
    |-- useWorkbenchContext.ts
    `-- useWorkbenchSearch.ts
```

#### 场景 5：选择目录形式或单文件形式

一级页面/组件始终使用目录、`index.vue` 和 `index.ts`；只有拥有者私有 `component/` 下的简单子项可单文件。

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/views/workbench/index.vue
src/views/workbench/index.ts
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
```

```text
src/pages/candidate-list/component/empty-hint.vue
src/views/workbench/component/workbench-toolbar.vue
src/components/user-card/component/user-card-label.vue
```

```text
src/components/user-card/component/user-card-label/
|-- index.vue
`-- index.ts
```

#### 场景 6：组织需要配套文件的组件

私有子项需要样式、逻辑、私有孩子或 hooks 时升级为目录并提供导出入口。

```text
src/components/candidate-picker/
|-- index.vue
|-- index.ts
|-- index.less
|-- component/
|   `-- candidate-option.vue
`-- hooks/
    `-- useCandidateSearch.ts
```

```ts
export { default } from './index.vue'
```

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

#### 场景 7：处理 1000 行限制

每个 `.vue` 文件不超过 1000 行，按职责拆分并只迁移受影响结构。

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 复杂组件 Context 规则

1. 每个 `use**Context` 只返回 `provide()` 和 `inject()`，位于拥有者 `hooks/` 并使用业务限定 key。
2. 状态、computed、ref、watch、副作用和动作都在 `provide()` 内创建；同一 context 对象既提供又返回。
3. `inject()` 的回退对象字段与提供对象完全一致，使用安全空 ref 和正确类型空操作，不用部分断言掩盖差异。
4. 拥有者调用一次 provide，后代 inject；不能多后代重复 provide，也不能当全局状态。

### 对应强制规则与完整示例：`references/complex-component-context-examples.md`

#### 场景 1：实现完整 Context 门面

`use**Context` 只返回 `provide()` 与 `inject()`；状态在 provide 内创建，公开同一个 context 对象。

```ts
import { computed, inject as vueInject, provide as vueProvide, ref } from 'vue'
import { InjectionKey, Ref } from 'vue'
import { loadWorkbenchPage } from '@/apis'

interface Page {
  loading: boolean
  pageNumber: number
}

interface WorkbenchContext {
  page: Ref<Page>
  loading: Readonly<Ref<boolean>>
  initPage: () => Promise<void>
}

// 创建工作台页面的安全默认状态。
const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
// 标识工作台所属组件子树中的上下文。
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

// 暴露工作台上下文的提供与注入能力。
export const useWorkbenchContext = () => {
  return {
    // 创建并提供共享的工作台状态。
    provide() {
      // 保存当前工作台页面状态。
      const page = ref<Page>(createDefaultPage())
      // 标识当前页面是否正在加载。
      const loading = computed(() => page.value.loading)
      // 初始化所属组件的页面状态。
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      // 定义所属组件与后代组件共享的公开上下文。
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    // 读取共享状态，并在所属子树外提供完整安全的默认值。
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
        // 在所属组件子树外提供安全的空初始化方法。
        initPage: async () => {}
      })
    }
  }
}
```

#### 场景 2：在拥有者和后代中使用门面

拥有者调用一次 provide，后代调用 inject，双方共享同一 API 和实例。

```ts
// 创建工作台所属组件及后代共享的状态。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

```ts
// 读取所属工作台提供的共享状态。
const { page, loading, initPage } = useWorkbenchContext().inject()
```

#### 场景 3：Provider 状态不得放在模块作用域

Context 响应式状态不能成为模块单例，以免不同组件实例相互污染。

```ts
const page = ref<Page>(createDefaultPage())

export const useWorkbenchContext = () => {
  return { page }
}
```

#### 场景 4：保持回退对象形状完全一致

inject 回退对象与提供对象字段完全一致，使用安全空 ref 和正确类型的空操作函数。

```ts
return vueInject(WORKBENCH_CONTEXT_KEY, {} as WorkbenchContext)
```

#### 场景 5：遵守所有权边界

Context 只服务拥有者的复杂子树，不能由多个后代重复 provide，也不能替代全局状态。

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 应用架构

使用仓库既有的等价目录；目标专属目录只有在仓库已经按目标拆分时才存在。

```text
src/
|-- pages/（或 views/）   路由页面单元
|-- pages-pc/             可选的目标专属页面
|-- components/           跨页面复用 UI
|-- components-pc/        可选的目标专属复用 UI
|-- layout/               页面框架
|-- hooks/                跨页面复用 composable
|-- styles/               应用级全局样式
`-- utils/                跨页面无状态工具
```

1. 保留既有页面树和移动端/PC 端分离，不创建竞争目录，也不通过运行时设备分支合并目标专属实现，除非请求明确要求。
2. 页面私有组件、hooks 和辅助函数跟随页面；只有真实跨页面复用后才提升到 `src` 一级目录。提升后的工具按明确业务领域或技术能力组织，并从目录入口导出。
3. 手写大型能力前检查已有依赖和包装层。只有获得授权且现有栈确有缺口时才新增包，并核实维护情况、来源、目标兼容性、包体积和许可证；商业使用安全无法确认时必须报告。

### 对应强制规则与完整示例：`references/application-architecture-examples.md`

#### 场景 1：放置路由编排与可复用 UI

路由编排放既有 pages/views，跨页面 UI 放 components，页面框架放 layout；一级单元使用目录入口。

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/pages/candidate-list/component/candidate-filter.vue
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
src/layout/default-layout/index.vue
src/layout/default-layout/index.ts
```

```text
src/views/workbench/index.vue
src/views/workbench/index.ts
src/views/workbench/component/workbench-toolbar.vue
```

#### 场景 2：保留移动端与 PC 端目录树

已有移动端与 PC 端树时保持物理分离，除非请求明确要求共享行为。

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/pages-pc/candidate-list/index.vue
src/pages-pc/candidate-list/index.ts
src/components/candidate-card/index.vue
src/components/candidate-card/index.ts
src/components-pc/candidate-card/index.vue
src/components-pc/candidate-card/index.ts
```

不要把既有目标端入口合并为一个在运行时判断设备的共享组件：

```vue
<template>
  <candidate-card-pc v-if="deviceTarget === 'pc'" :candidate="candidate" />
  <candidate-card-mobile v-else :candidate="candidate" />
</template>

<script setup lang="ts">
import CandidateCardMobile from '@/components/candidate-card'
import CandidateCardPc from '@/components-pc/candidate-card'

// 读取当前运行环境对应的展示目标端。
const deviceTarget = getRuntimeDeviceTarget()
</script>
```

该分支会让两个目标端实现进入同一所有权和加载路径，削弱路由级分离。真实共享的数据或行为可以提取到最近共同拥有者，但不能仅为复用而合并展示根。

#### 场景 3：重新实现前评估依赖

手写大功能前检查现有依赖；新增包需获授权并核实维护、来源、兼容性、体积和许可证。

```json
{
  "dependencies": {
    "date-fns": "^4.0.0"
  }
}
```

```ts
import { format } from 'date-fns'

// 将候选人更新时间格式化为列表展示文本。
export const formatCandidateUpdatedAt = (value: Date) => {
  return format(value, 'yyyy-MM-dd HH:mm')
}
```

```ts
import dayjs from 'dayjs'

// 将候选人更新时间格式化为列表展示文本。
export const formatCandidateUpdatedAt = (value: Date) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}
```

#### 场景 4：仅在跨页面共享时提升无状态工具

无状态辅助函数只有被不同页面真实共享时才提升到 `src/utils`，同页共享仍留在最近拥有者。

```text
src/utils/date.ts
src/utils/index.ts
```

```ts
import { format } from 'date-fns'

// 将日期值格式化为候选人列表使用的展示文本。
export const formatCandidateDate = (value: Date) => {
  return format(value, 'yyyy-MM-dd')
}
```

```ts
export * from './date'
```

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
