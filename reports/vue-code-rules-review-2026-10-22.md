# vue-code-rules 完整审阅报告

审阅日期：2026-10-22（Asia/Shanghai）。

本报告按照同目录 `css-code-rules-review-2026-10-22.md` 的结构，整理当前工作区 `vue-code-rules` 的全部 9 条核心规则及 9 个独立引用文件。正文按核心规则编号排列，每条下方直接放置中文说明、正反写法、适用边界和检查清单，便于逐条审阅。每条规则只列一个主 reference；跨条款问题按对应规则另行读取。

本报告以工作区源文件为准。示例标题、解释、业务注释和界面文案采用中文；源文件中的中文注释占位标记已替换为实际中文。示例为说明规则而保留必要上下文，部分函数、数据、组件和路径由所属项目提供，不能将局部片段视为可直接运行的完整应用。反例仅演示应避免的写法，不代表 Vue 编译器一定禁止这种语法。

## 一、适用范围与执行要求

### 1. 适用范围

适用于 Vue 3 单文件组件、组合式函数、页面和布局的编写、修改、重构、审查及调试。Vue 规则负责 SFC 结构、模板、Vue 编译宏、自动导入核实、业务注释、组件组织以及 provide/inject 上下文模式。

TypeScript 脚本同时遵循 `ts-code-rules`；CSS、Less、Sass、SCSS 及 Vue style 块同时遵循 `css-code-rules`。Vue 规则不能代替这些语言规则。

### 2. 修改范围与优先级

这些是强制要求。已有代码只能作为上下文，不能自动豁免规则，也不能成为继续复制违规写法的理由。只修复本次修改行中的问题、实现目标所必需的问题，以及阻碍新增代码合规的直接关联问题；不为统一风格迁移无关组件。

高优先级指令优先。仅在某条规则明确将决定权交给项目配置时，项目约定或配置才能覆盖该条要求。无法满足时，采用最小必要偏离并报告具体冲突。

### 3. 修改前的检查

查看仓库指令、目标组件、直接关联组件，以及构建、lint、formatter 和 TypeScript 配置。自动导入以实际生效的 Vite 配置及其引用的插件配置为准，不仅凭相邻文件推断。

入口文件不是全部规则。实施或审查前，按涉及的问题完整读取匹配引用；每个适用任务至少读取一个引用，没有精确匹配时读取最接近的文件，不确定时也读取。引用中的要求同样有约束力。

### 4. 修改后的检查

逐行对照适用核心规则及引用检查清单。运行与修改相关的最小必要 formatter、lint、Vue 类型检查和测试，不改写无关文件。未满足的规则、未运行或失败的检查必须说明，格式通过或目测正确不能代替结构、契约和行为检查。

### 5. 条款索引

- [Vue 1：SFC 顺序、组件标签与插槽](#vue-1)
- [Vue 2：最少必要 DOM 与正确元素语义](#vue-2)
- [Vue 3：多个类名来源统一使用数组绑定](#vue-3)
- [Vue 4：空行只用于真实逻辑分区](#vue-4)
- [Vue 5：编译宏的位置与异步暴露例外](#vue-5)
- [Vue 6：核实 Vite 自动导入后决定显式导入](#vue-6)
- [Vue 7：中文业务注释、契约与模板区域](#vue-7)
- [Vue 8：组件命名、目录、公共入口与实例类型](#vue-8)
- [Vue 9：所有 provide/inject 场景使用固定上下文模式](#vue-9)

## 二、按顺序审阅 9 条规则

<a id="vue-1"></a>

### Vue 1：SFC 顺序、组件标签与插槽

**独立 reference：** [template-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)

存在的 SFC 块必须保持 `<template>` → `<script>` → `<style>` 的相对顺序。不需要的块直接省略，不能为了凑齐结构添加空块。

自定义组件标签使用 kebab-case。没有插槽或子内容的组件自闭合；提供实际子内容时使用成对标签。有意开放扩展位置时使用具名插槽，组件仍负责自身根节点和模板层级。不能为了规避稳定的 prop 或子组件接口设计而随意增加插槽。

**对应示例与适用边界：**

#### 场景 1：保持 SFC 块顺序

**正例：**

下例假设项目已支持 Less，且选择 Less 符合项目语言约定。业务 prop 在契约成员处说明。

```vue
<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 当前用户卡片展示的姓名。 */
  name: string
}>()
</script>

<style lang="less" scoped>
.user-card {
  color: #303133;
}
</style>
```

**反例：**

不要把同一个组件的脚本放到模板之前，也不要添加没有内容的块：

```vue
<script setup lang="ts">
const props = defineProps<{ name: string }>()
</script>

<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<style scoped></style>
```

没有脚本需求时可只保留模板和样式；没有样式需求时可只保留模板和脚本。保留的块仍按规定顺序排列。这里的 Less 仅说明 SFC 结构，不要求将已有 CSS、Sass 或 SCSS 组件迁移为 Less。

#### 场景 2：自定义标签与具名插槽

**正例：**

没有内容的自定义组件使用 kebab-case 并自闭合：

```vue
<user-avatar :src="user.avatar" />
```

子组件明确提供操作扩展位置。这里的操作容器假设承担独立布局职责；没有该职责时不需要额外容器。

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
  /** 用户卡片展示的姓名。 */
  name: string
}>()
defineSlots<{
  /** 在卡片操作区补充当前用户的操作入口。 */
  actions(): unknown
}>()
</script>
```

父组件提供具名插槽内容时使用成对标签：

```vue
<user-card :name="user.name">
  <template #actions>
    <user-actions :user-id="user.id" />
  </template>
</user-card>
```

**反例：**

不要使用 PascalCase 模板标签，不要给无内容组件保留多余闭合对，也不要把应传给具名插槽的内容写成默认内容：

```vue
<UserAvatar :src="user.avatar"></UserAvatar>

<UserCard :name="user.name">
  <UserActions :user-id="user.id" />
</UserCard>
```

**本条检查清单：**

- 存在的块依次为 template、script、style，没有空块。
- 自定义标签为 kebab-case，无内容组件自闭合。
- 插槽是明确的扩展契约；根节点和层级仍有实际归属。
- 多区域模板的注释同时按 Vue 7 检查。

<a id="vue-2"></a>

### Vue 2：最少必要 DOM 与正确元素语义

**独立 reference：** [dom-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/dom-structure-examples.md)

在实现所需功能的前提下，尽可能减少 DOM 节点数和嵌套层级。不增加不必要节点或无意义包裹，优先直接使用已有元素实现行为和样式。只有现有元素无法直接实现所需行为或布局时，才增加包裹，并保持最少必要结构。

非交互业务布局优先使用 `div` 做块级分组、`span` 承载行内内容。`i` 仅作装饰图标占位，按可访问性要求处理。行为适用时使用原生 `button`、`a`、`input`、`label`；landmark、标题、列表和表格等元素必须表达真实文档结构、SEO、数据关系或可访问性含义，不能仅用于获得浏览器默认样式。

**对应示例与适用边界：**

#### 场景 1：直接使用已有目标元素

**正例：**

姓名展示和样式可由现有元素实现时，直接使用该元素：

```vue
<span class="user-card-name">{{ user.name }}</span>
```

**反例：**

没有额外行为或布局需求时，不增加 wrapper 和 inner 层：

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

允许新增节点的依据是实际功能需要。即使类名看起来有意义，若现有元素已能完成同样工作，也不能据此保留多余层级。必要包裹应具有明确用途，并控制节点和深度。

#### 场景 2：普通布局、交互与文档结构分别选择元素

**正例：**

非交互卡片用通用元素，装饰图标不参与辅助技术朗读：

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" aria-hidden="true" />
</div>
```

详情入口具有按钮行为，使用真实按钮：

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  查看详情
</button>
```

文章页确有主内容区和主标题时，使用真实语义元素：

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

**反例：**

不要用可点击 `div` 替代上述按钮，也不要仅为了字号或粗体样式把普通姓名改成主标题：

```vue
<div class="user-card-action" @click="openUserDetail">查看详情</div>
<h1 class="user-card-name">{{ user.name }}</h1>
```

真实链接、表单关联、标题、列表和表格也不能因为偏好通用元素而丢失键盘行为或有用语义。视觉效果交给类名与样式表达。

**本条检查清单：**

- 所需功能使用最少必要节点和层级。
- 每个新增包裹都具有现有元素无法直接承担的职责。
- 通用、交互和语义元素符合真实行为及文档含义。
- 不仅为默认样式使用语义元素，也不丢弃有用语义。

<a id="vue-3"></a>

### Vue 3：多个类名来源统一使用数组绑定

**独立 reference：** [class-binding-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md)

同一元素有多个类名来源时，统一放进一个 `:class` 数组，数组中组合固定类字符串、复用类值及条件对象。较长时按行展开。不得拆成 `class` 与 `:class`，不得拼接很长的类字符串。

只有单一来源时不机械套数组：一个静态来源可使用 `class`，单独一个动态值或对象可直接绑定。

**对应示例与适用边界：**

#### 场景 1：固定根类、密度类与多个状态

**正例：**

示例沿用源文件的类名，以便核对类来源组合。类名缩写与长度另按 CSS 命名规则检查；这里不据示例全称扩展出命名豁免。假设生效的自动导入配置没有覆盖 `computed`，因此显式导入。

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
// 根据当前卡片密度提供对应类名，供根节点复用。
const densityClass = computed(() => `candidate-card-${props.density}`)
</script>
```

非简单的私有 prop 契约放在所属组件的 `type` 模块：

```ts
/** 候选人卡片的展示内容、密度及交互状态契约。 */
export interface CandidateCardProps {
  /** 是否展示当前激活状态。 */
  active: boolean
  /** compact 为紧凑展示，normal 为常规展示。 */
  density: 'compact' | 'normal'
  /** 是否应用禁用状态。 */
  disabled: boolean
  name: string
}
```

固定根类加一个条件类，同样是多个来源，使用数组：

```vue
<div :class="['candidate-card', { 'candidate-card-active': active }]" />
```

单一来源可直接写：

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

**反例：**

不要把固定类和动态类拆开：

```vue
<div
  class="candidate-card candidate-card-compact"
  :class="{
    'candidate-card-active': active,
    'candidate-card-disabled': disabled
  }"
/>
```

不要拼接长字符串：

```vue
<div
  :class="`candidate-card candidate-card-${density} ${active ? 'candidate-card-active' : ''} ${disabled ? 'candidate-card-disabled' : ''}`"
/>
```

不要把多个来源全部挤在难以扫描的一行：

```vue
<div :class="['candidate-card', densityClass, { 'candidate-card-active': active, 'candidate-card-disabled': disabled, 'candidate-card-loading': loading }]" />
```

#### 场景 2：就地修正上述三种反例

固定密度字符串、动态密度表达式和复用值分别保留其原始含义，只统一来源结构：

```vue
<div
  :class="[
    'candidate-card',
    'candidate-card-compact',
    {
      'candidate-card-active': active,
      'candidate-card-disabled': disabled
    }
  ]"
/>
```

```vue
<div
  :class="[
    'candidate-card',
    `candidate-card-${density}`,
    {
      'candidate-card-active': active,
      'candidate-card-disabled': disabled
    }
  ]"
/>
```

```vue
<div
  :class="[
    'candidate-card',
    densityClass,
    {
      'candidate-card-active': active,
      'candidate-card-disabled': disabled,
      'candidate-card-loading': loading
    }
  ]"
/>
```

Vue 会展开数组并忽略条件对象中未生效的键。数组要求在组合多个来源时成立，不要求为每个单独绑定套一层数组。

**本条检查清单：**

- 多来源类名使用一个可读的 `:class` 数组。
- 没有 `class` 与 `:class` 拆分或长字符串拼接。
- 单来源保持简单，复杂数组按需换行。

<a id="vue-4"></a>

### Vue 4：空行只用于真实逻辑分区

**独立 reference：** [blank-line-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md)

顶层 SFC 块之间、真正独立的逻辑区域之间最多一行空行。禁止连续空行、文件首尾空行、块内首尾空行、注释与目标之间的空行，以及紧密相关内容之间的装饰性空行。保留正常文件末尾换行。

| 位置 | 规则归属 | 主要边界 |
| --- | --- | --- |
| SFC 块之间 | Vue | 最多一行，不添加空块 |
| template 内 | Vue | 仅分隔真正独立区域，紧密节点连续 |
| JavaScript 脚本内 | Vue | 逻辑分区最多一行，注释贴近目标 |
| TypeScript 脚本内 | TypeScript | 声明、语句和类型成员间距按 TS 规则 |
| style 内 | CSS | 组件选择器内部连续，不套用脚本分组空行 |

**对应示例与适用边界：**

#### 场景 1：SFC 块间与块内边缘

**正例：**

```vue
<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 当前用户卡片展示的姓名。 */
  name: string
}>()
</script>
```

**反例：**

```vue
<template>

  <div class="user-card">{{ props.name }}</div>

</template>


<script setup lang="ts">

const props = defineProps<{ name: string }>()

</script>
```

#### 场景 2：紧密相关模板节点保持连续

**正例：**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

**反例：**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>

  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

重复项、相邻标签和值、同一组件的插槽声明都属于紧密内容。单行空行不能成为装饰，也不能替代必要的组件边界。

#### 场景 3：JavaScript 逻辑分区与注释贴合

**正例：**

假设相关 Vue API 已由生效配置自动导入。状态与派生值紧密相关，清除操作是独立职责：

```js
// 当前用户选择及其是否有效的派生状态，供详情入口使用。
const selectedUserId = ref('')
const hasSelectedUser = computed(() => Boolean(selectedUserId.value))

// 清除当前用户选择，使详情入口恢复未选中状态。
const clearSelectedUser = () => {
  selectedUserId.value = ''
}
```

**反例：**

```js
// 保留服务端选择，供取消操作恢复。

const selectedUserId = ref('')

const clearSelectedUser = () => {

  selectedUserId.value = ''

}
```

注释与被注释对象不得被空行分开；函数开闭边缘不留空行。TypeScript 脚本由 TS 对应空行规则负责，不能把这里的 JavaScript 示例当作另一个重复规范。

**本条检查清单：**

- SFC 块间最多一行，块内边缘无空行。
- 模板仅用空行分隔独立区域。
- JavaScript 注释贴近目标，紧密语句连续。
- TypeScript 与样式分别按其语言规则审阅。

<a id="vue-5"></a>

### Vue 5：编译宏的位置与异步暴露例外

**独立 reference：** [compiler-macro-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/compiler-macro-examples.md)

所有 Vue 编译宏只能在 `<script setup>` 的脚本作用域调用，不能放在函数、回调、条件、循环或其他嵌套块内。

除 `defineExpose` 外，`defineOptions`、`defineProps`、`withDefaults`、`defineModel`、`defineEmits`、`defineSlots` 等宏应在必要导入之后组成第一个声明组，位于普通状态、computed、watch、生命周期和函数之前。

没有顶层 `await` 时，`defineExpose` 是脚本最后一条语句；存在顶层 `await` 时，必须先初始化公开绑定，并在第一次顶层等待前调用 `defineExpose`，后面再进行异步初始化及依赖操作。仅在函数或回调里使用 `await` 不触发该例外。

**对应示例与适用边界：**

#### 场景 1：普通脚本末尾暴露公开方法

**正例：**

假设 Vue API 未被自动导入，接口函数由项目 API 公共入口提供。编译宏没有泛化声明注释；业务契约说明写在成员处。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCandidate, saveCandidate } from '@/apis'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  /** 当前编辑与保存操作关联的候选人标识。 */
  candidateId: string
}>()
const emit = defineEmits<{
  /** 保存成功后通知父组件更新该候选人的展示数据。 */
  saved: [candidateId: string]
}>()

// 当前候选人详情的加载状态，供页面展示加载反馈。
const loading = ref(false)
// 当前候选人编辑器的显示状态，由公开打开方法更新。
const visible = ref(false)
// 加载当前候选人详情，并在请求结束后恢复加载状态。
const loadCandidate = async () => {
  loading.value = true
  try {
    await getCandidate(props.candidateId)
  } finally {
    loading.value = false
  }
}
// 保存当前候选人，服务端确认后通知父组件；失败交由调用方处理。
const handleSave = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
}
// 打开当前候选人的编辑器，供组件外部调用。
const openEditor = () => {
  visible.value = true
}
// 组件挂载后加载当前候选人的详情。
onMounted(loadCandidate)

defineExpose({
  /** 打开当前候选人的编辑器。 */
  openEditor
})
</script>
```

`defineExpose` 之后没有声明或执行语句。函数内部的 `await` 不影响这个末尾位置要求。

#### 场景 2：顶层 await 之前暴露已初始化绑定

**正例：**

接口返回候选人姓名字符串。先建立并暴露 ref，异步结果再更新同一个 ref：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { loadCandidateName } from '@/apis'

const props = defineProps<{
  /** 本次详情加载关联的候选人标识。 */
  candidateId: string
}>()
// 当前候选人的展示姓名，详情返回后更新。
const candidateName = ref('')

defineExpose({
  /** 异步详情加载后同步更新的候选人展示姓名。 */
  candidateName
})

candidateName.value = await loadCandidateName(props.candidateId)
</script>
```

不能把暴露操作延迟到异步结果到达后，也不能在公开绑定初始化前引用它。[Vue 模板引用文档](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component)说明了等待前暴露的要求。

**反例：**

下列片段分别演示宏被运行时声明打断、宏放入函数，以及没有顶层等待时在 `defineExpose` 后继续注册生命周期：

```ts
// 当前详情加载状态。
const loading = ref(false)
const props = defineProps<{ candidateId: string }>()

const createEmitter = () => {
  return defineEmits<{ saved: [candidateId: string] }>()
}

defineExpose({ openEditor })
onMounted(loadCandidate)
```

**本条检查清单：**

- 每个宏调用均位于 `<script setup>` 顶层。
- 非 expose 宏紧随导入，形成首个声明组。
- 无顶层等待时 expose 最后执行。
- 有顶层等待时，公开绑定先初始化并在首次等待前暴露。

<a id="vue-6"></a>

### Vue 6：核实 Vite 自动导入后决定显式导入

**独立 reference：** [auto-import-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/auto-import-examples.md)

添加 `vue` 或 `vue-router` 显式导入前，检查 `vite.config.*` 及其引用的共享配置、插件工厂、模式分支和目标配置。实际生效配置覆盖某个精确 API 时，直接使用，并移除本次修改范围内的冗余显式导入；未覆盖、插件对当前目标不生效或无法确认时，显式导入。

安装了依赖、存在生成声明、相邻文件没有导入或全局类型可见，都不能单独证明运行时自动导入有效。类型覆盖与运行时覆盖也应分别确认。

**对应示例与适用边界：**

#### 场景 1：配置覆盖所需 Vue 与 Router API

以下为项目生效 Vite 配置中的插件片段，假设当前插件版本确实覆盖示例使用的 API：

```ts
AutoImport({
  imports: ['vue', 'vue-router'],
  dts: 'src/type/auto-imports.d.ts'
})
```

**正例：**

配置已核实覆盖 `useRoute`、`useRouter`、`ref` 和 `computed`，直接使用：

```vue
<script setup lang="ts">
const props = defineProps<{
  /** 当前候选人页面关联的候选人标识。 */
  candidateId: string
}>()

// 当前候选人页面的路由信息，供页面读取导航上下文。
const route = useRoute()
// 当前候选人页面的导航能力，供详情操作使用。
const router = useRouter()
// 当前候选人搜索关键词，供查询输入使用。
const keyword = ref('')
// 去除首尾空格后的查询关键词，供候选人搜索使用。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

这些是导入判定片段，实际组件应只保留用到的状态与路由能力。

**反例：**

在同一生效配置下，不再保留这些冗余导入：

```ts
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
```

#### 场景 2：自动导入仅覆盖 ref

配置片段：

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

**正例：**

`computed` 与 `useRoute` 未覆盖，正常导入；`ref` 直接使用：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  /** 当前候选人页面关联的候选人标识。 */
  candidateId: string
}>()

// 当前候选人页面的路由信息。
const route = useRoute()
// 当前搜索输入的原始关键词。
const keyword = ref('')
// 候选人查询使用的标准化关键词。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**反例：**

不能仅因 `ref` 已覆盖，就省略其他 API 的导入：

```vue
<script setup lang="ts">
const route = useRoute()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**本条检查清单：**

- 检查了 Vite 及相关共享插件配置是否实际生效。
- 按精确 API 判断覆盖，而非按依赖或类型声明推断。
- 已覆盖 API 没有冗余显式导入，未覆盖 API 正常导入。
- 类型导入语法同时遵循已核实工具配置下的 TS 规则。

<a id="vue-7"></a>

### Vue 7：中文业务注释、契约与模板区域

**独立 reference：** [script-comment-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md)

主要业务状态、配置、computed、函数、事件处理、prop/event/model/slot/公开操作契约、业务 watcher、生命周期工作及关键交互或转换阶段，都要有简洁中文业务注释。名称清楚、语法简单或其他位置存在兼容性注释，均不能替代这些覆盖。

注释表达职责、归属、使用场景、来源、重置时机、依赖或规则，不逐句翻译语法。一个紧密的小声明组可共用注释；导入、临时局部量和机械 map/filter 回调无需逐项说明。不为制造注释目标保留冗余包装函数、变量或判断。

TypeScript SFC 的通用声明、函数、回调、内部阶段及冗余结构由 TS 规则负责；本条补充 Vue 的契约、响应式状态、生命周期、宏例外和模板区域覆盖。JavaScript SFC 直接按本引用执行同等业务覆盖。

**对应示例与适用边界：**

#### 场景 1：编译宏不加泛化声明注释，业务成员仍需说明

**正例：**

```ts
const props = defineProps<{
  /** 当前详情及保存操作关联的候选人标识。 */
  candidateId: string
}>()
const emit = defineEmits<{
  /** 保存成功后通知父组件刷新该候选人的展示数据。 */
  saved: [candidateId: string]
}>()

// 候选人保存状态，供提交按钮展示处理中反馈。
const saving = ref(false)
// 保存当前候选人，成功后通知父组件；失败交由调用方处理。
const submitCandidate = async () => {
  saving.value = true
  try {
    // 服务端确认保存后才通知父组件更新展示。
    await saveCandidate(props.candidateId)
    emit('saved', props.candidateId)
  } finally {
    // 请求结束后恢复提交状态，失败时同样允许重试。
    saving.value = false
  }
}
```

相同原则适用于 `defineModel`、`defineSlots` 和 `defineExpose`：在对应业务成员或契约定义处解释含义，不在宏上方写“定义模型”“定义插槽”“暴露方法”等机械标签。不是只要避开宏注释，就可以省略业务契约文档。

**反例：**

```ts
// 接收组件属性。
const props = defineProps<{
  candidateId: string
}>()
```

这条注释只重复宏的语法作用，未说明候选人标识关联的业务。

#### 场景 2：watcher 与生命周期职责写在注册调用上方

**正例：**

即使只有短小刷新操作，也说明触发条件和同步目标：

```ts
// 筛选条件变化后重新加载候选人，保持结果与当前条件一致。
watch(filters, async () => {
  await loadCandidates()
})

// 页面挂载后加载首屏候选人列表。
onMounted(async () => {
  await loadCandidates()
})
```

确有 DOM 时序依赖时，应说明实际约束：

```ts
// 加载接口需要读取已渲染表格尺寸，因此在挂载后发起首屏请求。
onMounted(async () => {
  await loadCandidates()
})
```

后一说明只有实现确实读取表格尺寸时才成立，不能给普通挂载加载编造 DOM 依赖。存在清理、跨状态依赖或错误归属时，同样说明真实契约。

**反例：**

不要让调用本身缺少职责说明，却在回调内部重复机械标签：

```ts
watch(filters, async () => {
  // 筛选变化后重新加载候选人。
  await loadCandidates()
})

onMounted(async () => {
  // 页面挂载后初始化候选人数据。
  await loadCandidates()
})
```

#### 场景 3：状态和派生值说明业务意义

**正例：**

```ts
// 当前页面的筛选条件，职位为空表示不限制职位。
const filters = reactive<{ keyword: string; roleCode: number | null }>({
  keyword: '',
  roleCode: null
})
// 用户选中的候选人，供当前页面的详情和后续操作使用。
const selectedCandidateId = ref('')
// 任一筛选项生效时展示清空筛选入口。
const hasActiveFilters = computed(() => {
  return Boolean(filters.keyword || filters.roleCode !== null)
})
```

小型内聚状态记录可以共用一条职责说明；归属或用途不同的状态分别说明。不要替换为“定义响应式数据”“计算属性”等语法标签。

#### 场景 4：关键交互阶段独立说明规则

**正例：**

```ts
// 拖动越过锚点时保留锚点，并按端点大小排列范围，避免选择区间跳变。
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

边界、锚点、标准化、排序、合并、回退、去重、校验、请求顺序和状态提交等重要阶段，说明写在最小内聚代码块上方。函数总注释不能代替独立内部规则；单阶段操作不需要把同一说明逐句重复。

#### 场景 5：多区域模板说明职责，条件链连续

**正例：**

```vue
<template>
  <div class="candidate-page">
    <!-- 筛选区：维护当前查询条件，并触发列表刷新。 -->
    <candidate-filters v-model="filters" />
    <!-- 结果区：加载中展示占位，完成后展示列表或空态。 -->
    <candidate-list-skeleton v-if="loading" />
    <candidate-list v-else-if="candidates.length" :candidates="candidates" />
    <candidate-empty v-else />
    <!-- 分页区：只在存在查询结果时展示。 -->
    <candidate-pagination v-if="total > 0" v-model="pageNumber" :total="total" />
  </div>
</template>
```

重要的权限、插槽、条件渲染和交互规则在发生处说明。分支组注释放在首个 `v-if` 上方，保持 `v-if` / `v-else-if` / `v-else` 连续，不用注释把分支隔开。

**反例：**

```vue
<!-- div 容器 -->
<div class="candidate-name">
  <!-- 姓名文本 -->
  <span>{{ candidate.name }}</span>
</div>
```

不要逐节点标注元素或重复可见文案。小型单职责模板无需机械添加区域标签。

**本条检查清单：**

- 主要业务声明、函数、配置和契约具有中文职责说明。
- 宏没有泛化声明标签，业务成员说明没有被省略。
- watcher、生命周期和业务回调的注释位于注册调用或属性上方。
- 内部关键阶段独立说明，未重复总注释或逐句叙述。
- 多区域模板说明主要区域及重要规则，条件链连续。
- 没有为承载注释新增冗余结构，也没有编造产品理由。

<a id="vue-8"></a>

### Vue 8：组件命名、目录、公共入口与实例类型

**独立 reference：** [component-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)

组件文件、目录、自定义标签使用 kebab-case。组合式函数文件一般也使用 kebab-case，但 `hooks/` 内的 hook 文件使用 camelCase，例如 `useUserCard.ts`。

既有页面或组件树下的第一层页面、视图和组件，即使很简单，也必须采用含 `index.vue` 和 `index.ts` 的目录形式。只有所属者私有 `component/` 目录中的简单子组件可保持具名 `.vue` 单文件。需要有意义的支持文件时改为目录形式；达到 CSS 强制提取条件而需要独立样式，也属于这种情况。

每个 `.vue` 文件最多 1000 行。拆分或移动时更新公共入口与消费者，检查自动组件发现；不迁移无关组件。`index.ts` 转发默认组件和有意公开的类型，普通 setup 逻辑和样式仍留在 SFC 或有明确职责的模块中。

**对应示例与适用边界：**

#### 场景 1：命名与最小目录

**正例：**

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

目录、私有单文件和标签使用 kebab-case；`hooks/` 中使用 camelCase。`index.less` 不是每个组件都必须具有的第三个文件。

**反例：**

```text
components/
|-- UserAvatar.vue
`-- user_card/
    |-- UserCard.vue
    `-- hooks/
        `-- use-user-card.ts
```

#### 场景 2：第一层单元与私有子组件的边界

| 情况 | 必须使用的形式 |
| --- | --- |
| pages、views、components 下的第一层单元，即使简单 | `unit-name/index.vue` + `unit-name/index.ts` |
| 已有 pages-pc、components-pc 等目标树下第一层单元 | 同样采用目录和两个入口 |
| 所属者私有 component/ 中的简单子组件 | `component/child-name.vue` |
| 私有子组件需要提取逻辑、样式、子组件或 hook | `component/child-name/index.vue` + `index.ts`，加实际需要的支持文件 |
| 私有单文件提升为第一层共享组件 | 转为共享组件目录与两个入口 |

**正例：**

以下展示已有页面树的不同项目约定，不要求同时新建 pages 和 views：

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/views/workbench/index.vue
src/views/workbench/index.ts
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
```

简单私有子组件可以保持单文件：

```text
src/pages/candidate-list/component/empty-hint.vue
src/views/workbench/component/workbench-toolbar.vue
src/components/user-card/component/user-card-label.vue
```

拥有 props、派生展示文本或少量本地样式，不会单独触发目录拆分。

**反例：**

没有支持文件或其他组织必要时，不给同一个简单私有子组件制造额外目录：

```text
src/components/user-card/component/user-card-label/
|-- index.vue
`-- index.ts
```

这一边界仅针对简单私有子组件，不能据此允许第一层共享组件采用单文件。

#### 场景 3：支持文件按实际职责增加

**正例：**

项目已支持 Less，候选人选择器有搜索逻辑、结果子组件和达到提取条件的样式：

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

`index.vue` 负责界面协调；hook 负责内聚搜索行为；结果子组件仍然简单，保持单文件。样式经组件自身的 scoped style 引入，保留作用域。没有这些实际职责时，省略对应文件和目录。

完整的可选归属结构如下，不是要求每个组件一次性生成所有目录：

```text
owner/
|-- index.vue
|-- index.ts                 组件公共出口
|-- index.less               可选的独立所属样式
|-- component/
|   |-- simple-child.vue     简单私有子组件
|   `-- complex-child/
|       |-- index.vue
|       |-- index.ts
|       |-- component/       该子组件自己的私有组件
|       `-- hooks/           该子组件自己的 hook
|-- hooks/                   所属者私有组合式函数
|-- constants/               所属者私有常量
`-- type/                    所属者私有类型
```

CSS 规则满足以下任一条件就必须提取整个内联样式块，不能因 Vue 文件尚未达到 1000 行而豁免：

- 至少 80 个非空行。
- 至少 4 个自有选择器组，且具备至少 2 类复杂度信号：三层及以上嵌套；至少三个状态或伪类分支；deep 或第三方覆盖；keyframes 或复杂动画；响应式、supports 或 container 分支。

私有子组件因此新增独立样式时，转换为：

```text
component/custom-range-editor/
|-- index.vue
|-- index.ts
`-- index.less
```

**反例：**

不要遗漏必需的公共入口，也不要创建无实际内容的支持目录：

```text
src/components/candidate-picker/
|-- index.vue
|-- component/
|-- hooks/
|-- constants/
`-- type/
```

#### 场景 4：公共入口转发默认组件

**正例：**

每个目录管理组件的最小 `index.ts`：

```ts
export { default } from './index.vue'
```

消费者通过组件目录的公共入口导入，简单私有单文件直接导入：

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

同一所属模块内允许上述相对路径；跨模块路径同时遵循 TS 的已配置别名和公共入口规则。

**反例：**

以下导入绕过组件公共入口：

```ts
import CandidatePicker from '@/components/candidate-picker/index.vue'
```

以下入口不能单独完成默认组件转发：

```ts
export * from './index.vue'
```

不能为了凑文件把所有 setup 逻辑移到 `index.ts`。公共入口负责公开边界，不作为业务实现容器。

#### 场景 5：从公共入口导出具名实例类型

另一个组件需要持有抽屉实例或调用公开方法时，在抽屉 `index.ts` 导出：

```ts
import Drawer from './index.vue'

export default Drawer
/** 抽屉组件公开实例，供其他组件声明引用及调用暴露的方法。 */
export type DrawerInstance = InstanceType<typeof Drawer>
```

消费者经相同公共入口导入组件与实例类型：

```ts
import { DrawerInstance } from '@/components/drawer'
import Drawer from '@/components/drawer'

// 当前页面持有的抽屉实例，用于调用抽屉公开的方法。
const drawerRef = ref<DrawerInstance | null>(null)
```

此处假设 `ref` 被生效配置自动导入，否则显式导入。普通类型导入假设工具链可安全擦除；核实配置要求时改为独立 `import type`。没有外部实例类型消费者时，不要求预先导出实例类型。

**本条检查清单：**

- 第一层页面、视图和组件具有目录、index.vue 与 index.ts。
- 只有简单私有子组件保持具名单文件。
- 私有子组件需要独立样式等支持文件时转为目录。
- 没有空目录、无意义支持文件或被绕过的公共入口。
- 文件和标签命名正确，hooks/ 内文件采用 camelCase。
- 外部需要的实例类型从公共入口具名导出。
- 每个 .vue 不超过 1000 行，结构移动同步更新消费者和自动发现。

<a id="vue-9"></a>

### Vue 9：所有 provide/inject 场景使用固定上下文模式

**独立 reference：** [complex-component-context-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md)

任何使用 Vue `provide` 或 `inject` 的场景都必须遵循此固定模式，无论是直接父子、深层子树、页面还是应用根，无论只共享一个值还是多个值。它不要求所有组件通信都改为 provide/inject；一旦选择该机制，就使用下面的结构。

1. 在所属页面或组件的 `hooks/` 内定义 `use**Context` 门面，只返回 `provide()` 和 `inject()` 两个方法。
2. 在模块层定义带业务限定且有类型的上下文 key。
3. 所有上下文自有响应式状态、computed、模板 ref、watcher、副作用和动作，都在 `provide()` 内创建。
4. 组装完整 `context` 对象，将同一个对象传给 Vue provide，并原样返回给所属组件。
5. `inject()` 使用 Vue inject，并提供字段完全匹配、类型安全的空 ref 和无操作函数回退；不能漏字段、加注入端独有字段或用不安全部分断言掩盖差异。
6. 每个所属组件实例只调用一次 `provide()`；后代只调用 `inject()`，不能重新创建 provider 分叉状态。

**对应示例与适用边界：**

#### 场景 1：固定实现结构

以下完整结构取自引用中的工作台例子，中文说明补充类型及契约含义。示例假设 Vue 运行时 API 未被自动导入，因此保留显式导入；覆盖已核实后省略相应运行时导入。类型导入按工具实际要求选择普通导入或独立 `import type`。

```ts
import { computed, inject as vueInject, provide as vueProvide, ref } from 'vue'
import { InjectionKey, Ref } from 'vue'
import { loadWorkbenchPage } from '@/apis'

/** 工作台所属实例的分页及请求状态。 */
interface Page {
  loading: boolean
  /** 从 1 开始的工作台页码。 */
  pageNumber: number
}
/** 所属工作台及后代共同使用的完整上下文契约。 */
interface WorkbenchContext {
  /** 当前工作台实例拥有的分页状态。 */
  page: Ref<Page>
  /** 由分页状态派生的只读加载反馈。 */
  loading: Readonly<Ref<boolean>>
  /** 初始化当前页，请求失败向调用方传播。 */
  initPage: () => Promise<void>
}

// 为工作台创建安全默认值，每次调用均返回新的普通状态对象。
const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
// 标识工作台组件子树的上下文，避免与其他业务上下文混用。
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

// 提供工作台上下文的创建与读取入口，不在模块层持有共享响应式实例。
export const useWorkbenchContext = () => {
  return {
    // 为当前所属工作台实例创建并提供完整共享状态。
    provide() {
      // 当前工作台实例的分页与加载状态。
      const page = ref<Page>(createDefaultPage())
      // 供所属者与后代展示当前工作台加载反馈。
      const loading = computed(() => page.value.loading)
      // 初始化当前工作台页；请求结束后恢复加载状态，失败交由调用方处理。
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      // 所属者和后代共享同一个完整上下文对象及其内部实例。
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    // 读取所属工作台的共享状态；位于所属子树之外时返回完整安全默认值。
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
        // 缺少所属工作台时保持安全空操作，不发起初始化请求。
        initPage: async () => {}
      })
    }
  }
}
```

模块层允许上述类型、key 和普通默认值工厂；上下文自有响应式实例与动作必须在 `provide()` 内创建。注入回退在 `inject()` 内创建安全空值。不得把业务状态提到模块层形成响应式单例。

此完整示例规定了门面、状态创建位置、同一 context 对象、typed key 和完整 fallback 的结构。应用到实际业务时替换名称、字段和动作，不把它理解为多个可选实现之一。

#### 场景 2：所属组件与后代的固定用法

**正例：**

所属组件在 setup 中为当前实例提供一次：

```ts
// 创建当前工作台与其后代共享的实例状态和操作。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

后代读取同一所属者的上下文：

```ts
// 读取所属工作台提供的共享状态与初始化操作。
const { page, loading, initPage } = useWorkbenchContext().inject()
```

**反例：**

后代为了读取状态而调用 provider，会为自己的子树创建另一份状态：

```ts
// 错误：后代重新提供上下文，导致状态与原所属者分离。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

以下结构同样违反固定规则：模块级响应式单例；拆为互不相关的 provider/injector 函数；门面返回额外字段；提供和返回两个不同对象；回退遗漏字段或强制断言成完整契约。

#### 场景 3：逐项核对提供值与回退值

| 公开字段 | provide 创建的值 | inject 缺少所属者时的回退 |
| --- | --- | --- |
| page | 当前实例的 `ref<Page>` | 新的安全默认页 ref |
| loading | 当前 page.loading 派生的 computed | false ref，兼容只读 ref 契约 |
| initPage | 当前实例拥有的异步初始化方法 | 签名兼容的异步无操作函数 |

字段表必须完全一致；不根据实际消费者暂时只读取某个字段就缩减回退。安全回退是当前技能的明确要求，不能在报告中改成缺少 provider 时直接抛错的其他约定。

**本条检查清单：**

- 每种 provide/inject 场景均采用完整固定结构。
- 门面只返回 provide() 与 inject()。
- key 在模块层，带业务限定且有 InjectionKey 类型。
- 所有上下文自有状态、计算值、监听、副作用和动作在 provide() 内创建。
- 提供对象与返回给所属者的对象是同一实例。
- fallback 字段完全一致、类型兼容且安全。
- 每个所属组件实例提供一次，后代只读取，状态不逃逸所属子树。

## 三、跨条款边界与规则归属

- 本报告依据工作区最新 Vue 源文件。当前 Vue 1 未包含“模板禁止业务转换”的独立要求，模板引用也未规定该条；不将已安装旧副本中的表述重新写成当前工作区规则。
- Vue 2 要求以尽可能少的 DOM 节点和层级实现功能。容器命名清楚本身不足以证明必要性；必须核实已有元素无法直接承担所需布局或行为。
- Vue 1 的组件标签 kebab-case 与 Vue 8 的文件目录命名相互补充；插槽不成为多余 DOM 的理由。
- Vue 4 允许独立模板或脚本逻辑区域之间最多一行空行；CSS 组件选择器内部仍按 CSS 规则保持连续，不能相互套用。
- Vue 5 的编译宏无泛化声明注释，不能被解释为 Vue 7 的业务契约免注释；业务 prop、event、model、slot 和公开动作语义仍应在成员处说明。
- Vue 6 只在精确 API 已被生效配置覆盖时省略运行时导入。生成声明、类型可见和相邻文件写法均不能单独替代配置核实。
- Vue 8 的第一层组件目录是强制要求；支持样式、hook、常量、类型和子组件按需增加，不生成空目录。外部实例类型也只在真实消费者需要时导出。
- CSS 强制提取条件与 Vue 1000 行上限独立生效；私有单文件需要独立样式时必须转换为目录。阈值细节以 CSS 对应引用为准。
- Vue 9 适用于任何深度及任意共享字段数量的 provide/inject 场景。门面恰好两个方法、同一个 context 对象和完整安全 fallback 均为强制结构，不是可选建议。
- 示例在必要位置补足中文契约说明、将英文注释及界面文案改为中文，并合并部分重复演示；不声称示例与源代码围栏逐字相同。本轮只重构引用归属和加载路由，9 条核心规则及原有源代码示例保持不变。

## 四、9 条核心规则与 9 个独立 reference

每条核心规则对应一个独立主 reference，各文件标明 `Owns Core Rule N.`，并包含所属规则的要求、完整示例和检查清单。原模板引用拆为 SFC/标签/插槽与 DOM 结构；原脚本结构引用拆为编译宏与自动导入。跨规则引用只指向对应归属，不再让同一个主文件承载两条规则。

| 核心规则 | 独立 reference |
| --- | --- |
| Vue 1 | [template-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/template-examples.md) |
| Vue 2 | [dom-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/dom-structure-examples.md) |
| Vue 3 | [class-binding-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md) |
| Vue 4 | [blank-line-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md) |
| Vue 5 | [compiler-macro-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/compiler-macro-examples.md) |
| Vue 6 | [auto-import-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/auto-import-examples.md) |
| Vue 7 | [script-comment-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md) |
| Vue 8 | [component-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md) |
| Vue 9 | [complex-component-context-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md) |

## 五、当前技能展示信息

- 技能名称：vue-code-rules。
- 界面显示名：Vue Code Rules。
- 短描述含义：应用强制性的 Vue 组件与架构标准。
- 图标：assets/vuejs-logo.png；同目录另有 SVG 资源。
- 当前 agents/openai.yaml 仅包含展示名、短描述和图标，没有额外执行流程。

## 六、完整性核对与文件快照

正文覆盖全部 9 条核心规则、9 个独立 reference 的强制要求、各场景主题及检查清单，共包含 66 个代码围栏块。引用拆分前后的 63 个源代码围栏块逐字一致，没有丢失或新增示例代码。9 条核心规则内容保持不变。

本轮同步更新了技能引用结构和审阅报告。核对对象为工作区的 SKILL.md、9 个 reference 和 UI 元数据，共 11 个来源文件；下表按实际文件字节计算 SHA-256，便于后续判断报告与源文件是否仍对应。图标不属于规则正文快照。

文档校验覆盖核心规则编号、9 个独立引用的覆盖、内部锚点、本地文件链接、代码围栏配对、中文占位标记替换，以及来源快照一致性。本仓库未提供可运行的 Vue 应用及对应构建配置；报告中的示例未编译或执行，不能据此宣称应用类型检查、lint 或运行时行为已经通过。

| 文件 | 字节数 | SHA-256 |
| --- | --- | --- |
| vue-code-rules/SKILL.md | 8698 | `6db525163f32256b96115287dd9748bc668be800210baa63336be453b03b941f` |
| vue-code-rules/references/auto-import-examples.md | 4131 | `e34368e3af44dbfbd28a23d928cce70ef25aea82255c42f8198d840df6d3f47f` |
| vue-code-rules/references/blank-line-examples.md | 3906 | `9a0a1450e279d6018040c4b4ade431a8920e3b63ad10467b19cf1d79a1ef9c2a` |
| vue-code-rules/references/class-binding-examples.md | 4190 | `bc02d27eb450236fc75bd1161c7fc5f750756ca89964ceafa92ad30442eda21b` |
| vue-code-rules/references/compiler-macro-examples.md | 5144 | `53a6850a038b8a3b216dded93ac7bb630c962d69abf75838c0791dda3a50e069` |
| vue-code-rules/references/complex-component-context-examples.md | 5634 | `c77cf99da3698b33e91fc380a0c914d2c31a0dea5e996521a8cf5fd168c406a7` |
| vue-code-rules/references/component-structure-examples.md | 9830 | `7df29a6b1833abbf693f44d1f0e1dc4ac1db84a236817ac4970289f4cbfa872c` |
| vue-code-rules/references/dom-structure-examples.md | 3336 | `b3fc20531e461fcc3dbf7b04191666331dfdd9569313c445be67aed651b2dab6` |
| vue-code-rules/references/script-comment-examples.md | 9256 | `13935d00aeb81640900e3bfe29ea3d5419a941a9c991bce9ea0c69f07456a50e` |
| vue-code-rules/references/template-examples.md | 2959 | `531eed3de5dacc4c4e1da930bbddc3605f0385e528d9799613e39555ac472b9e` |
| vue-code-rules/agents/openai.yaml | 210 | `a429e2e6494f2e8f75cdbc0caea54da9d27d09c9b4b17edd3063a5adf01ef519` |
