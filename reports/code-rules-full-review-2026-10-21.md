# Vue、TypeScript、CSS 规则完整审阅报告

审阅版本：2026-10-21，第二轮修订版，按本轮清理后的工作区文件内容整理。

本报告包括三个 skill。正文按各 `SKILL.md` 当前的 Core Rules 编号依次解释，每条要求下紧接对应完整示例、正反写法和适用边界。示例标题、说明、注释及界面文案已译为中文；代码标识符、API、类名、路径和执行逻辑保留。附录保留入口、引用中的其他规则、检查清单与示例位置索引，便于核对来源。

本报告是本轮 skill 调整后的审阅材料，反映清理后的现行要求。正文中的反例用于说明禁止的写法；局部示例不构成对其他相关规则的豁免。正文示例中的英文注释占位内容已替换为对应中文；附录保留来源原文供核对。

## 阅读顺序

1. 共同执行要求。
2. vue-code-rules：9 条核心规则，每条下方直接附完整对应示例。
3. ts-code-rules：10 条核心规则，每条下方直接附完整对应示例。
4. css-code-rules：12 条核心规则，每条下方直接附完整对应示例。
5. 本轮修改边界与审阅注意项。
6. 来源附录：Vue → TypeScript → CSS；保留入口、补充要求、检查清单和示例位置索引。
7. UI 元数据、资源清单和文件快照指纹。

## 一、共同执行要求

### 1. 适用范围与技能分工

| skill | 适用对象 | 负责内容 |
| --- | --- | --- |
| vue-code-rules | Vue 组件、composable、页面和布局的编写、修改、重构、审查与调试 | 模板、DOM、class、SFC 结构、编译宏、自动导入、Vue 业务注释、组件目录、实例类型、provide/inject 模式 |
| ts-code-rules | TypeScript、TSX、Vue 中的 TypeScript 脚本 | 修改范围、抽象与冗余、业务注释、空行、导入、源码分层、异步、错误、运行时兼容性和格式化 |
| css-code-rules | CSS、Less、Sass、SCSS、Vue style 块 | 样式语言与作用域、样式提取、命名、嵌套与 deep、布局、单位、库定制、复用、注释、声明顺序和兼容性 |

一个 Vue SFC 同时修改 TypeScript 和样式时，三套规则共同适用。Vue 中 TS 语句的空行和通用注释以 TS 规则为准；style 内的空行和注释以 CSS 规则为准；Vue 规则补充宏、响应式 API 注册及模板区域等特有要求。

### 2. 修改边界与规则优先级

这些是强制要求，不是根据邻近文件猜测的建议。只处理本次新增、修改和审查涉及的代码；不为统一风格迁移无关代码。旧代码违反规则不能成为复制该写法的理由。修改行存在违规、需求实现依赖该修复，或者不修复会阻止新代码合规时，应处理直接相关问题。

高优先级指令优先。项目惯例只有在某条规则明确允许由项目配置决定时，才能替代该条规则。发生无法同时满足的冲突时，采用最小必要偏离并明确报告，不能静默略过。

### 3. 必须按问题加载引用文件

只读入口不算完成规则加载。先查看仓库和实际配置，再将本次涉及的问题映射到 Required Reference Loading，完整读取所有匹配引用。每个适用任务至少读取一个引用，没有完全匹配时读取最接近的引用；不确定时读取。引用中的要求同样具有约束力。

### 4. 开始工作前的检查

Vue：查看目标组件、相关组件、构建、lint、formatter 和 TS 配置。

TypeScript：查看目标模块、公开调用者、附近类型、tsconfig、脚本、lint、formatter、测试配置，以及真实运行时与浏览器目标。

CSS：查看实际 DOM、所属组件、邻近样式、全局 reset、预处理器、PostCSS、浏览器目标和格式化/lint 配置；以渲染结构及真实构建能力决定样式写法。

### 5. 修改后的核对

逐行核对适用规则和引用中的检查清单。执行与修改相称的定向格式化、lint、类型检查、构建或测试，不扩大到无关目录。CSS 还需记录非空样式行数和复杂度信号，达到提取阈值就必须提取；有预览或既有视觉测试时核对受影响状态。

无法完成的检查要明确说明。格式化、编译或语法通过，不能代替对职责、业务注释、架构和兼容性的判断。

## 二、vue-code-rules（当前 9 条）

<a id="vue-1"></a>

### Vue 1：SFC 顺序与组件标签

现有 SFC 块按照 `<template>` → `<script>` → `<style>` 的相对顺序排列；未使用的块省略，不增加空块。

自定义标签使用 kebab-case；没有插槽或子内容时自闭合。具名插槽用于有意设计的扩展点，子组件仍负责自身业务根与结构，不能只为规避 props/API 设计而新增插槽。


**对应示例与适用边界：**

#### 场景 1：保持 SFC 块顺序

**正例：**

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

**反例：**

不要调整相同 SFC 块的先后顺序：

```vue
<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<style lang="less" scoped>
.user-card {
  color: var(--text-color-primary);
}
</style>
```

未使用的块可以省略，但保留下来的块仍需遵循相对顺序。

来源：[template-examples.md](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)


#### 场景 2：自定义组件标签与插槽

**正例：**

使用 kebab-case，没有子内容的组件采用自闭合写法：

```vue
<user-avatar :src="user.avatar" />
```

在子组件内部定义具名扩展点，同时让其根节点继续代表单一业务职责：

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

父组件提供插槽内容时，使用明确的开始和结束标签：

```vue
<user-card :name="user.name">
  <template #actions>
    <user-actions :user-id="user.id" />
  </template>
</user-card>
```

子组件有意提供扩展点、同时仍拥有自身根节点结构时，适合使用具名插槽。不要仅为满足抽象结构约定增加包装，也不要仅为回避设计稳定的 props 或子组件接口而新增插槽。

**反例：**

不要将相同组件写成 PascalCase 标签、添加多余的闭合标签对，或向具名扩展点提供未命名内容：

```vue
<UserAvatar :src="user.avatar"></UserAvatar>

<UserCard :name="user.name">
  <UserActions :user-id="user.id" />
</UserCard>
```

来源：[template-examples.md](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)


<a id="vue-2"></a>

### Vue 2：浅 DOM 与真实语义

应使用尽可能少的 DOM 节点和嵌套层级实现所需功能。非必要不得增加节点或嵌套无意义的 DOM；优先直接利用现有元素实现行为与布局，只有无法直接实现时才增加必要容器，并保持结构最简。

非交互业务布局优先使用 div 和 span；装饰图标占位可以使用 i，并按无障碍需要标记。真实按钮、链接、输入和标签使用原生交互元素。地标、标题、列表、表格只在表达真实结构、SEO、数据关系或无障碍含义时使用，不能只为了浏览器默认样式使用。


**对应示例与适用边界：**

#### 场景 3：使用最少必要 DOM

**正例：**

现有目标元素能够实现所需行为与样式时，直接使用它：

```vue
<span class="user-card-name">{{ user.name }}</span>
```

**反例：**

实现功能不需要这些额外节点和嵌套时，不得添加：

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

只有现有元素无法直接实现所需行为或布局时，才允许增加包装。每个必要包装都应有明确用途，并将节点数与嵌套层级控制在实现功能所需的最小范围。

来源：[template-examples.md](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)


#### 场景 4：选择通用、交互或语义元素

**正例：**

非交互业务布局使用行为明确的通用元素。装饰图标占位可以使用 `i`，同时将其对辅助技术隐藏：

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" aria-hidden="true" />
</div>
```

需要相应行为时使用原生交互元素，不要仅为保持 DOM 通用而给 `div` 添加按钮行为：

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  View details
</button>
```

根据真实页面结构、数据关系、SEO 或无障碍含义，有意选择语义元素：

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

**反例：**

不要把相同的详情按钮替换成可点击的 `div`，也不要仅为默认样式使用标题元素：

```vue
<div class="user-card-action" @click="openUserDetail">查看详情</div>
<h1 class="user-card-name">{{ user.name }}</h1>
```

通过业务类名和 CSS 实现视觉样式。真实按钮、链接、标签、标题、列表或表格具有有效语义或键盘行为时，也不能以通用元素替换而丢失这些能力。

来源：[template-examples.md](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)


<a id="vue-3"></a>

### Vue 3：多个 class 来源统一到一个数组

元素同时包含固定类、可复用类值或条件状态类时，全部放入一个 `:class` 数组。内容较多时换行展开。不把同一元素的 class 分散到 `class` 和 `:class`，不拼接长字符串。

仅有一个静态类可以直接使用 class；只有一个动态对象或值时，无需额外包一层数组。


**对应示例与适用边界：**

#### 场景 1：通过一个数组绑定组合多个 class

场景：候选人卡片始终带有业务根类，接收可复用的密度类，并根据条件附加激活和禁用状态。

**正例：**

使用一个 `:class` 数组容纳所有 class 来源：

本例显式导入 Vue API，前提是当前生效的 Vite 自动导入配置未覆盖 `computed`。确认已覆盖后应省略该运行时导入；否则保留显式导入。

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
// 提供当前候选人卡片密度对应的类名。
const densityClass = computed(() => `candidate-card-${props.density}`)
</script>
```

将较复杂的私有 props 契约保留在组件旁的类型模块中：

```ts
export interface CandidateCardProps {
  active: boolean
  density: 'compact' | 'normal'
  disabled: boolean
  name: string
}
```

数组把固定类、可复用类值和条件状态集中在一个可读位置。Vue 会展开这些条目，并忽略条件未生效的对象键。

即使只有一个固定类和一个条件状态、并且可以写在一行，也采用相同结构：

```vue
<div :class="['candidate-card', { 'candidate-card-active': active }]" />
```

只有一个 class 来源时使用最简单的形式：

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

下面三个反例中的 class 来源，分别应改为这些清晰的数组：

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

**反例：**

不要将相同元素的类拆分到静态属性和动态绑定中：

```vue
<div
  class="candidate-card candidate-card-compact"
  :class="{
    'candidate-card-active': active,
    'candidate-card-disabled': disabled
  }"
/>
```

不要构造很长的插值或拼接 class 字符串：

```vue
<div
  :class="`candidate-card candidate-card-${density} ${active ? 'candidate-card-active' : ''} ${disabled ? 'candidate-card-disabled' : ''}`"
/>
```

多个来源使属性难以浏览时，不要把所有 class 塞到数组的一行中：

```vue
<div :class="['candidate-card', densityClass, { 'candidate-card-active': active, 'candidate-card-disabled': disabled, 'candidate-card-loading': loading }]" />
```

数组要求从一个元素组合多个 class 来源时开始适用，不代表每个单一 class 绑定都要机械套上数组。

来源：[class-binding-examples.md](D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md)


<a id="vue-4"></a>

### Vue 4：空行表达逻辑分区

SFC 块之间和独立逻辑区域之间最多保留一个空行。禁止连续空行、文件或块内首尾空行、注释与说明对象之间空行，以及紧密关联节点或语句之间的装饰性空行。

模板中不要拆散相邻标签/值、一组相关节点或同一组件的插槽声明。JavaScript Vue 脚本按此引用处理；TypeScript 脚本和样式部分分别遵循 TS、CSS 的空行规则。


**对应示例与适用边界：**

#### 场景 1：分隔 SFC 块

**正例：**

块之间最多一个空行，块内两端不留空行：

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

不要仅为补齐顺序添加空块；块是否存在及先后顺序由模板规则决定。

**反例：**

不要在相同 SFC 块之间插入多个空行，也不要在块内两端留空行：

```vue
<template>

  <div class="user-card">{{ props.name }}</div>

</template>


<script setup lang="ts">

const props = defineProps<{ name: string }>()

</script>
```

来源：[blank-line-examples.md](D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md)


#### 场景 2：组织模板节点

**正例：**

将同一组件中紧密关联的内容连续放置：

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

真正独立的模板区域可以通过一个空行分隔。空行不能用作装饰，也不能代替有意义的组件边界。

**反例：**

不要用装饰性空行拆散相同的标签和值分组：

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>

  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

来源：[blank-line-examples.md](D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md)


#### 场景 3：组织 JavaScript 脚本逻辑

**正例：**

不同职责之间可以用一个空行分隔。需要注释时，注释应紧邻其说明对象：

```js
const selectedUserId = ref('')
const hasSelectedUser = computed(() => Boolean(selectedUserId.value))

const clearSelectedUser = () => {
  selectedUserId.value = ''
}
```

TypeScript 脚本采用 `ts-code-rules` 对应的空行规则，不把这个 JavaScript 示例视为额外要求。

**反例：**

不要让相同的注释脱离说明对象，也不要在函数内部两端留空行：

```js
// 保留服务端选择，以便取消操作时恢复。

const selectedUserId = ref('')

const clearSelectedUser = () => {

  selectedUserId.value = ''

}
```

来源：[blank-line-examples.md](D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md)


<a id="vue-5"></a>

### Vue 5：编译宏的作用域与顺序

所有编译宏调用必须在 script setup 顶层，不能放入函数、回调、循环、条件或其他嵌套块。

除 defineExpose 外，defineOptions、defineProps、withDefaults、defineModel、defineEmits、defineSlots 等宏紧跟必要导入，组成第一组声明，位于普通运行时状态、computed、watch、生命周期和函数之前。

没有顶层 await 时，defineExpose 必须是最后一条声明或执行语句。有顶层 await 时，先初始化暴露绑定，再在第一次顶层 await 之前调用 defineExpose；异步初始化及依赖语句可以随后执行。函数或回调内部的 await 不触发这个例外。


**对应示例与适用边界：**

#### 场景 1：排列契约宏并处理异步暴露

**正例：**

除 `defineExpose` 外，所有宏紧跟必要导入，组成第一组声明。没有顶层 `await` 时，`defineExpose` 放在所有声明和执行语句之后，作为最后一条语句。宏声明本身不添加通用声明注释：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ candidateId: string }>()
const emit = defineEmits<{ saved: [candidateId: string] }>()

// 保存页面加载状态。
const loading = ref(false)
// 控制候选人编辑器是否可见。
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
// 组件挂载后加载候选人详情。
onMounted(loadCandidate)

defineExpose({ openEditor })
</script>
```

没有顶层 `await` 时，底部暴露可以确保公开绑定已初始化，并形成可预期的组件公共边界。此时 `defineExpose` 后不能再出现语句。

需要顶层 `await` 时，先初始化公开绑定，并在第一次暂停前暴露。异步初始化可以随后执行；应更新已经暴露的 ref，不要等数据返回后再暴露：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { loadCandidateName } from '@/apis'

const props = defineProps<{ candidateId: string }>()
// 保存候选人的展示名称，在详情加载后更新。
const candidateName = ref('')

defineExpose({ candidateName })

candidateName.value = await loadCandidateName(props.candidateId)
</script>
```

显式导入 `ref` 的前提是自动导入未覆盖它。该 API 返回候选人名称字符串。这个例外针对顶层 `await`，不包括函数或生命周期回调内部的 `await`。不要在公开绑定初始化之前暴露它。暴露必须早于 await 的要求见 [Vue 模板引用](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component)。

**反例：**

不要把相同编译宏放到无关运行时声明之后或嵌套控制流中；没有顶层 `await` 时，也不要在 `defineExpose` 之后执行语句：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 保存页面加载状态。
const loading = ref(false)
// ❌ 普通运行时声明打断了组件契约宏的集中排列。
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
// ❌ 没有顶层 await 时，defineExpose 后不能再出现声明或执行语句。
onMounted(loadCandidate)
</script>
```

来源：[script-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-structure-examples.md)


<a id="vue-6"></a>

### Vue 6：自动导入必须以生效配置为准

添加 vue 或 vue-router 显式导入前，检查 vite.config 及其引用的插件/共享配置，包含当前模式和目标的配置分支。

生效配置明确覆盖的 API 直接使用，不在修改代码中保留冗余导入；未覆盖、对应插件不生效或无法证实覆盖时，显式导入。覆盖可能是部分的，不能从 ref 已覆盖推断 computed、useRoute 也已覆盖。

已安装依赖、生成的 d.ts、相邻文件和全局类型都不能单独证明运行时自动导入有效。


**对应示例与适用边界：**

#### 场景 2：省略 Vite 自动导入已经覆盖的导入

检查当前生效的 Vite 配置及其引入的共享插件配置，例如：

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

该配置生效时，直接使用已覆盖的 API：

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 提供候选人详情页面的导航能力。
const router = useRouter()
// 保存候选人搜索关键词。
const keyword = ref('')
// 提供规范化后的候选人搜索关键词。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**反例：**

不要保留这些 API 的重复显式导入：

```vue
<script setup lang="ts">
// ❌ 这些 API 已由生效的 Vite 自动导入插件提供。
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 提供候选人详情页面的导航能力。
const router = useRouter()
// 保存候选人搜索关键词。
const keyword = ref('')
// 提供规范化后的候选人搜索关键词。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

来源：[script-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-structure-examples.md)


#### 场景 3：导入自动导入未覆盖的 API

自动导入可能只覆盖部分 API。当前配置仅覆盖 `ref` 时，不要假定 `computed` 或 `useRoute` 也可直接使用：

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

**正例：**

导入未覆盖的 API，继续直接使用已覆盖的 API：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 保存候选人搜索关键词。
const keyword = ref('')
// 提供规范化后的候选人搜索关键词。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

决定覆盖范围前，检查配置分支、模式、共享插件工厂和特定目标的 Vite 配置。生成的 `auto-imports.d.ts` 可以辅助佐证，但不能代替确认对应插件在当前构建中生效。

**反例：**

不要省略这些未覆盖的 `computed` 和 `useRoute` 导入：

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

// 读取当前候选人页面的路由信息。
const route = useRoute()
// 保存候选人搜索关键词。
const keyword = ref('')
// 提供规范化后的候选人搜索关键词。
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

来源：[script-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-structure-examples.md)


<a id="vue-7"></a>

### Vue 7：Vue 业务注释与契约注释

主要业务状态、computed、配置、动作、事件处理、props/event/model/slot/暴露方法契约、业务 watcher、生命周期和关键交互转换阶段需要简洁中文说明。英文命名清楚或语法简单不免除业务文档要求。

业务 watcher、生命周期和回调注册的职责说明放在调用或注册属性上方，包含触发原因及初始化、同步、失效或释放职责；有必要时说明 DOM 时机、跨状态依赖和错误契约。内部独立阶段分别说明，不能重复外层注册注释。

编译宏不加“接收 props”“定义事件”等通用声明注释。业务含义写到对应契约成员；这项宏例外不免除契约文档。

多区域模板在筛选、结果、分页、详情和操作等主要区域上方添加业务说明，重要权限、条件渲染、插槽或交互规则在对应位置说明。分支组注释放在初始 v-if 上方，保持条件链相邻。小型单用途模板、每个 DOM、可见文字、临时变量和机械回调不逐一标注。


**对应示例与适用边界：**

#### 场景 1：应用编译宏注释例外

**正例：**

编译宏不添加通用声明注释。直接记录业务契约成员、运行时状态和操作的含义：

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

**反例：**

不要给相同的编译宏添加通用声明标签：

```ts
// 接收组件 props。
const props = defineProps<{
  candidateId: string
}>()
```

宏本身已表明声明角色。候选人关联关系应像正例一样写在 prop 契约成员上，不必增加通用宏标签。

来源：[script-comment-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md)


#### 场景 2：记录 watcher 和生命周期职责

**正例：**

即使注册逻辑很短，也应在 API 调用上方说明业务职责：

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

即使代码语法直观，也要记录交互规则：

```ts
// 跨过拖拽锚点后仍保持锚点固定，避免选区跳变。
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

存在时序约束时补充说明：

```ts
// 初始请求延迟到挂载后，因为该 API 需要读取已渲染表格的尺寸。
onMounted(async () => {
  await loadCandidates()
})
```

不要在回调内部重复同一注释。普通挂载示例说明所有者何时开始加载；因 DOM 依赖而延迟执行，必须像尺寸示例一样有真实依赖依据。

**反例：**

不要让注册语句缺少说明，却在回调内部添加机械标签：

```ts
watch(filters, async () => {
  // 筛选条件变化后重新加载候选人列表。
  await loadCandidates()
})

onMounted(async () => {
  // 页面挂载后初始化候选人数据。
  await loadCandidates()
})
```

来源：[script-comment-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md)


#### 场景 3：记录状态和 computed 的业务含义

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

一个注释可以覆盖小型内聚状态记录；所有者或用途不同的状态分别说明。不要用“定义响应式数据”或“计算属性”等标签代替业务说明。临时请求解构和简单 map 回调无需额外注释。

来源：[script-comment-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md)


#### 场景 4：标注主要模板区域和渲染规则

**正例：**

以下模板片段说明区域职责及首次加载的分支组，没有在相邻条件分支之间插入注释：

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

**反例：**

不要按语法或可见文字给每个节点贴标签：

```vue
<!-- div 容器 -->
<div class="candidate-name">
  <!-- 姓名文本 -->
  <span>{{ candidate.name }}</span>
</div>
```

来源：[script-comment-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md)


<a id="vue-8"></a>

### Vue 8：组件命名、目录、入口与实例类型

组件文件、目录和标签使用 kebab-case；普通 composable 文件遵循 kebab-case，hooks 目录内 hook 文件使用 camelCase。

一级页面、视图和组件必须是目录形式，具有 index.vue 与 index.ts，即使实现简单也如此。只有拥有者私有 component 目录中的简单子组件可以使用 child-name.vue 单文件形式。需要独立逻辑、样式、hooks 或子组件等有意义配套文件时，转为目录形式。CSS 强制样式提取触发后，也必须转换相应私有子组件的目录形式。

index.ts 转发默认组件及有意公开的类型；`export *` 不会转发默认导出。普通 setup 逻辑保留在 SFC 或专用逻辑模块，不能为凑文件数量移进入口。可选样式、hooks、constants、type 和 component 文件按实际需要创建。

每个 .vue 文件不超过 1000 行。调整组件位置或目录形式时更新入口、调用者及自动组件发现，不迁移无关组件。

其他组件需要实例类型时，从组件公开入口导出命名的 InstanceType 类型；没有外部需求时不机械生成实例类型。

**对应示例与适用边界：**

#### 场景 1：应用命名约定

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

组件目录、私有单文件子组件、自定义标签和普通 composable 文件使用 kebab-case。hooks 内的 hook 文件使用 camelCase。目录管理的组件都具备 `index.vue` 与 `index.ts`，`index.less` 按需添加。一级 `user-avatar` 即使简单也使用目录；只有私有 component 中简单的 `user-card-label.vue` 使用命名单文件形式。

**反例：**

不要混用命名大小写，也不要省略这些组件要求的入口：

```text
components/
|-- UserAvatar.vue
`-- user_card/
    |-- UserCard.vue
    `-- hooks/
        `-- use-user-card.ts
```

来源：[component-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)


#### 场景 2：选择目录或单文件形式

**正例：**

一级页面、视图和共享组件始终采用目录，即使不需要 hooks、子组件或独立样式：

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/views/workbench/index.vue
src/views/workbench/index.ts
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
```

上面的 `pages` 和 `views` 是两种项目惯例，沿用仓库已有的目录树。

只有拥有者私有 `component/` 目录中的简单子组件，才使用命名 `.vue` 文件：

```text
src/pages/candidate-list/component/empty-hint.vue
src/views/workbench/component/workbench-toolbar.vue
src/components/user-card/component/user-card-label.vue
```

例如，`user-card-label.vue` 可以在单文件中保留 props、派生展示文案和本地样式。存在 script 或 style 块本身不构成拆文件的理由。

根据实际职责和配套文件选择形式：

| 场景 | 形式 |
| --- | --- |
| pages、views 或 components 下的一级单元，即使简单 | `unit-name/index.vue` + `unit-name/index.ts` |
| components-pc 等已有目标专用目录下的一级单元 | 同样使用目录及两个入口 |
| 拥有者 component 目录中的简单私有子组件 | `component/child-name.vue` |
| 私有子组件需要抽取逻辑、样式、子组件或 hooks，包括 CSS 规则强制要求的独立样式 | `component/child-name/index.vue` + `index.ts`，仅添加实际需要的配套文件 |
| 简单私有子组件提升为一级共享组件 | 转为 src/components/child-name 目录，包含 index.vue 与 index.ts |

**反例：**

不要给相同的简单私有子组件增加没有实际必要的目录包装：

```text
src/components/user-card/component/user-card-label/
|-- index.vue
`-- index.ts
```

来源：[component-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)


#### 场景 3：组织需要配套文件的组件

**正例：**

候选人选择器拥有搜索状态、结果子组件和较多样式；项目已配置 Less，独立 Less 文件有利于维护：

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

index.vue 协调选择器界面并连接 hook；useCandidateSearch.ts 负责内聚的搜索行为；candidate-option.vue 继续作为父组件私有 component 目录中的简单文件。入口通过项目支持的样式机制引用 index.less，并保留预期作用域。

除必须的 index.vue 和 index.ts 外，每个配套文件都应有存在理由。样式未达到 css-code-rules 的任一强制提取阈值且易于维护时，留在 SFC，省略 index.less；达到任一阈值则提取完整样式块，即使组件职责仍然内聚。没有子组件或 hook 就不建相应目录。普通 setup 逻辑留在 SFC，不为凑齐三个文件而搬进 index.ts。

所有目录管理的组件，包括私有子组件，都必须具有以下最小 index.ts：

```ts
export { default } from './index.vue'
```

这会转发组件默认导出；仅使用 `export * from './index.vue'` 不会转发默认导出。消费者需要时才公开相关类型。业务行为保留在 SFC 或聚焦的逻辑模块中。

目录管理的表格通过 index.ts 导入，简单私有筛选器直接导入文件：

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

跨模块导入路径遵循 ts-code-rules。消费者不能以 /index.vue 结尾的路径绕过组件目录入口。

component/user-card-label.vue 后续需要多个私有文件时，转为 component/user-card-label/index.vue，添加 index.ts，并把配套文件放在旁边。若提升为一级共享组件，则移动到 src/components/user-card-label 并具备两个入口，即使实现仍简单。更新消费者并检查自动组件发现，确保注册名和导入仍有效，不同时转换无关组件。

**反例：**

不要创建未使用的配套目录，也不要绕过组件公共入口：

```text
src/components/candidate-picker/
|-- index.vue
|-- component/
|-- hooks/
|-- constants/
`-- type/
```

```ts
import CandidatePicker from '@/components/candidate-picker/index.vue'
```

来源：[component-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)


#### 场景 4：导出组件实例类型

其他组件持有抽屉 ref 或调用其暴露动作时，从抽屉的 index.ts 导出实例类型：

```ts
import Drawer from './index.vue'

export default Drawer
/** 抽屉组件公开实例，供其他组件声明引用及调用暴露的方法。 */
export type DrawerInstance = InstanceType<typeof Drawer>
```

消费者通过公共入口导入组件和实例类型：

```ts
import { DrawerInstance } from '@/components/drawer'
import Drawer from '@/components/drawer'

// 当前页面持有的抽屉实例，用于调用抽屉公开的方法。
const drawerRef = ref<DrawerInstance | null>(null)
```

此消费者示例假设生效的自动导入已覆盖 ref，否则需显式导入。已验证的工具配置要求时使用独立 import type。没有外部组件需要实例类型时，不必导出。

来源：[component-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)


<a id="vue-9"></a>

### Vue 9：所有 provide/inject 场景使用固定上下文模式

所有涉及 Vue provide 或 inject 的场景都必须遵循这一模式，不受层级深度或共享字段数量限制。直接父子、页面拥有者及应用根拥有者采用同一模式。

固定结构要求：

1. 在拥有者的 hooks 中定义 use**Context，返回值恰好只有 provide() 和 inject()。
2. 使用模块级、带业务名称且有类型的 context key。
3. context 自有状态、computed、模板引用、watcher、副作用和动作在 provide() 内创建，不能变成模块级响应式单例。
4. 将完整公开字段组成一个 context 对象；传给 Vue provide 的对象与返回拥有者的对象必须是同一个实例。
5. inject() 使用完整安全兜底对象；公开字段与提供对象完全一致，类型兼容，使用安全空 ref 和正确类型的空操作；不遗漏字段、不增加仅注入端字段，也不以不安全断言掩盖不完整对象。
6. 每个拥有者实例调用一次 provide()，消费该上下文的后代只调用 inject()，不重新创建同一个 provider。

以下为规定的固定完整实现和拥有者/后代用法。

#### 固定完整实现示例

本例显式导入 Vue API，前提是生效的 Vite 自动导入未覆盖它们。核查配置后，省略已覆盖的运行时导入；未覆盖的 API 和必要类型，按 TS 导入规则及配置实际的类型覆盖范围导入。

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

// 为工作台页面创建安全默认状态。
const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
// 标识工作台组件子树的上下文。
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

// 暴露工作台上下文的提供与注入入口。
export const useWorkbenchContext = () => {
  return {
    // 创建并提供工作台共享状态。
    provide() {
      // 保存当前工作台页面状态。
      const page = ref<Page>(createDefaultPage())
      // 表示当前页面是否正在加载。
      const loading = computed(() => page.value.loading)
      // 初始化拥有者组件的页面状态。
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      // 定义拥有者和后代共享的公开上下文。
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    // 读取共享状态，并在拥有者子树之外提供完整安全默认值。
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
        // 在拥有者子树之外提供安全的空初始化操作。
        initPage: async () => {}
      })
    }
  }
}
```

封装入口恰好返回 provide() 和 inject()。所有自有响应式实例和动作在 provide() 内创建；传给 Vue 的 context 对象与返回给拥有者的是同一个实例。

来源：[complex-component-context-examples.md](D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md)


#### 拥有者与后代的用法

拥有者组件：

```ts
// 创建工作台拥有者及其后代共享的状态。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

后代组件：

```ts
// 读取工作台拥有者提供的共享状态。
const { page, loading, initPage } = useWorkbenchContext().inject()
```

拥有者调用一次 provide()，后代只调用 inject()。后代不能创建第二个 provider，否则会静默地为其子树分出另一份状态。

来源：[complex-component-context-examples.md](D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md)


## 三、ts-code-rules（当前 10 条）

<a id="ts-1"></a>

### TS 1：修改只覆盖当前需求

保留现有注释，避免无关格式化、重命名、导入重排和顺手清理。保持需求之外的公开契约和行为。


**对应示例与适用边界：**

#### 场景 1：限制修改范围

场景：修复服务中的一个状态分支，同时该服务还存在与需求无关的命名和格式问题。

**正例：**

只修改缺陷分支及直接相关的导入、注释、测试和类型。不重命名相邻函数、不重排无关导入、不保留无关整文件格式变化。格式化工具可以处理修改文件，但应依据格式化前内容恢复影响范围之外的纯格式变化，保留用户已有修改。只有当前改动使注释失准或过时时才调整原有注释。

若缺陷是重试边界应包含等号，修复保持在局部：

```ts
// 判断候选人同步任务是否仍允许重试。
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

**反例：**

不要把相同边界修复与无关重命名、返回结构调整混在一起：

```ts
// 判断候选人同步任务是否仍允许重试，并返回包装结果。
export const evaluateCandidateSyncRetry = (retryCount: number) => {
  return { allowed: retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT }
}
```

无关重命名、日志改写或对相邻函数引入新抽象，会扩大回归风险并掩盖实际缺陷修复。

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


<a id="ts-2"></a>

### TS 2：避免不必要抽象和冗余

简单一次性逻辑留在原处。复杂度、真实复用或清晰职责边界才构成抽取函数、类和 composable 的依据。

删除本次修改产生的死代码、无用导入/变量/类型、临时调试、过时注释、冗余别名和转发包装。不能仅为创造名字或注释位置增加包装函数、中间变量和重复 guard。

中间值具有业务含义、复用价值、类型收窄或明确可读性收益时可以保留；前置条件只有在调用方、框架或接口确实保证时才能删除重复检查。连续的一次性回调流程留在注册处，避免拆成没有独立职责的多段包装。


**对应示例与适用边界：**

#### 场景 2：避免一次性抽象

**正例：**

清楚的一次性转换保留在调用处：

```ts
// 保存提交接口需要的候选人名称。
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

**反例：**

不要仅为重命名或转发一次操作而创建包装：

```ts
// 返回去除首尾空格后的候选人名称。
const getCandidateName = (name: string) => {
  return name.trim()
}
```

```ts
await saveCandidate({ ...form, name: getCandidateName(form.name) })
```

逻辑具有复用、独立测试价值、真实复杂度或明确职责边界时，再进行抽取。

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


#### 场景 3：只清理本次修改产生的死代码

实现改变后，删除因此不再使用的导入、变量、类型、调试日志、别名和包装：

**正例：**

清理后只保留新路径需要的导入和行为：

```ts
import { saveCandidate } from '@/apis'

// 保存当前候选人的提交载荷。
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

**反例：**

清理前，相同改动路径仍残留已移除的调试依赖、控制台输出及转发包装：

```ts
import { debugCandidate, saveCandidate } from '@/apis'

// 转发候选人保存请求。
const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
// 保存当前候选人的提交载荷。
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
await submitCandidateRequest(candidatePayload)
```

不要仅因无关历史代码看似未使用就删除，除非任务包含该清理且项目工具确认安全。清理围绕本次修改归属进行，不追求整个文件表面整洁。

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


#### 场景 8：移除冗余包装、中间值和保护条件

**正例：**

优先使用直接谓词与已验证的回调契约：

```ts
// 判断当前搜索字段是否需要短信验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// 手机号变化时清除上次短信访问签名。
watch(phone, () => {
  resetVerification()
})
```

**反例：**

不要仅为制造名称或注释位置，在同一流程中保留额外函数、变量或条件：

```ts
// 判断当前搜索字段是否需要短信验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ 该包装只转发另一个谓词，没有独立职责。
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// 手机号变化时清除上次短信访问签名。
watch(phone, (currentPhone, previousPhone) => {
  // ❌ 该一次性中间变量没有增加业务含义。
  const hasChanged = currentPhone !== previousPhone
  // ❌ watcher 本来只在源值变化时执行，重复比较并未增加保护。
  if (!hasChanged) return
  resetVerification()
})
```

中间值在表达真实业务概念、被复用、帮助类型收窄或明显简化复杂表达式时仍有价值。调用方、框架或接口可能提供被防护状态时，guard 仍然必要，简化前应核实契约。

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


<a id="ts-3"></a>

### TS 3：业务声明、类型契约及内部阶段的中文文档

主要状态、reactive/ref/computed、持久类字段、配置、阈值、映射和业务常量说明职责、所有者、用途、来源及必要的单位、默认值、重置时机和依赖。

业务函数、服务方法、composable、事件处理和业务回调注册说明动作、结果或受影响状态，必要时说明参数/返回含义、顺序、副作用和失败归属。公开契约适合使用 JSDoc，但不重复 TS 已表达的参数类型。

领域 interface、type、enum 和导出契约需要业务职责说明；重要成员说明单位、来源、允许状态、可选/null 含义和调用者预期。普通且含义明确的 id/name、机械工具类型、生成和供应商声明不重复贴标签。

函数内部对校验/提前退出、载荷转换、请求顺序、合并、状态提交、交互边界、降级、重试、去重、副作用、恢复和清理等关键阶段与重要分支分别说明。单阶段函数无需重复同一解释，相关小声明可共用一个注释。

注释必须简洁、相邻且有代码或已验证契约支持。清楚命名不免除覆盖；imports、临时局部值、明显 getter 和机械 map/filter 回调不逐行叙述。Vue 编译宏遵循 Vue 专有例外。


**对应示例与适用边界：**

#### 场景 4：记录业务状态与领域契约

**正例：**

即使英文名称清楚，也要说明状态的业务角色。小型相关声明可以共用职责注释：

```ts
// 当前详情页的候选人标识，用于关联加载和保存操作。
const candidateId = route.params.id
// 详情加载状态，控制页面的加载反馈。
let loading = false
```

在声明处说明单位和转换：

```ts
// 将接口的秒级时间戳转为 Date 需要的毫秒。
const updatedAt = new Date(result.updatedAt * 1000)
```

领域类型同样需要职责注释，重要字段也要记录契约：

```ts
/** 候选人列表查询条件，供列表请求与分页共同使用。 */
interface CandidateQuery {
  keyword: string
  /** 从 1 开始的页码，与服务端分页约定保持一致。 */
  pageNumber: number
  /** null 表示不限制职位。 */
  roleCode: number | null
}
/** 草稿保存状态，区分未保存修改、保存中和已同步。 */
type DraftStatus = 'dirty' | 'saving' | 'synced'
```

不重复明显字段标签，不给 import 加注释，不描述每个临时响应解构。公共参数契约放在函数文档中，不逐个参数另贴标签。

类职责、持久业务字段和服务方法采用相同覆盖要求：

```ts
/** 管理指定候选人的草稿保存流程及提交状态。 */
export class CandidateDraftService {
  // 当前服务实例绑定的候选人，保存操作始终使用此标识。
  private readonly candidateId: string
  // 草稿请求是否仍在处理中，在请求结束后恢复。
  private submitting = false

  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  /** 保存当前候选人的草稿；请求失败时由调用方处理错误。 */
  public async submit(payload: CandidateDraftPayload) {
    this.submitting = true
    try {
      await saveCandidateDraft(this.candidateId, payload)
    } finally {
      // 保存成功或请求失败后，都恢复允许重试的状态。
      this.submitting = false
    }
  }
}
```

**反例：**

不要写只把标识符或语法翻译成自然语言的注释：

```ts
// 保存候选人标识。
const candidateId = route.params.id
// 表示是否处于加载状态。
let loading = false
```

这些标签遗漏了状态拥有者的职责和用途，应采用上方的职责说明。同样，循环计数器或临时响应解构不承载业务规则时无需贴标签。

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


#### 场景 5：记录业务函数与事件处理函数

**正例：**

记录每个业务入口，包括较短的处理函数和表达领域策略的谓词：

```ts
// 将表单转换为候选人保存载荷，并把保存结果交给调用方。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

// 手机或邮箱任一存在即纳入可联系名单，不要求两者同时填写。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 当前列表中满足联系渠道要求的候选人，供后续联系操作使用。
const contactableCandidates = candidates.filter(hasValidContact)

// 记录用户选择的候选人，供当前页面后续操作使用。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

短内联回调保留在注册处，说明其业务注册职责；items.map(item => item.id) 之类机械回调无需单独叙述：

```ts
// 曝光上报尽力执行，不得阻塞导航。
router.afterEach(() => {
  reportCandidateExposure().catch(reportTelemetryError)
})
```

仅当内联回调具有独立职责、真实复用、聚焦测试价值或除缩短外层代码外的具体可读性收益时抽取。即使一次性后续处理包含多个相关分支和副作用，只要属于同一流程，也留在内联位置。

**反例：**

不要用重复函数名的方式给函数加注释：

```ts
// 提交候选人数据。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}
```

反例注释只是重复名称，没有说明载荷职责和返回契约。应改善注释，不能以名称清楚为由省略业务文档。刻意忽略后台失败等特殊契约也要记录。

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


#### 场景 6：记录业务阶段和重要分支

**正例：**

```ts
// 保存候选人，并保留服务端校验错误供调用方处理。
const submitCandidate = async () => {
  try {
    // 将表单转换为接口载荷，保存成功后返回服务端结果。
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // 规范化字段错误，供表单层展示。
    normalizeFieldErrors(error)
    throw error
  }
}
```

职责注释描述整个操作，内部注释描述请求和错误阶段。代码易读也需覆盖重要阶段，但不逐一注释赋值、调用和返回。单阶段函数可只用职责注释覆盖。

包含校验、请求、状态更新和清理的流程，应分别记录这些阶段：

```ts
// 保存当前候选人并更新页面详情；失败时保留原详情供用户重试。
const saveCurrentCandidate = async () => {
  // 仅通过表单校验的数据可以进入保存流程。
  if (!(await formRef.value.validate())) return
  // 标记本次保存开始，供提交按钮展示处理中状态。
  saving.value = true
  try {
    // 使用表单构建接口载荷，等待服务端确认保存结果。
    const candidate = await saveCandidate(buildCandidatePayload(form))
    // 以服务端返回数据更新详情，保证页面展示已保存的内容。
    detail.value = candidate
  } catch (error) {
    // 在当前页面反馈保存失败，保留表单内容供修正或重试。
    Message.error(error.message)
  } finally {
    // 成功或失败都结束提交状态，允许用户继续操作。
    saving.value = false
  }
}
```

算法语法清晰但业务不变量不明显时，同样需要说明；在内聚代码块上方解释一次：

```ts
// 指针跨过拖拽锚点时仍保持锚点固定，避免选区跳变。
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

比较与赋值容易读懂，但缺少产品上下文就无法得知锚点规则。函数其他位置的兼容性注释不能代替这条业务说明。

**反例：**

不要对相同提交流程逐步复述每行语句：

```ts
// 保存候选人，并保留服务端校验错误供调用方处理。
const submitCandidate = async () => {
  try {
    // 构建候选人载荷。
    const payload = buildCandidatePayload(form)
    // 调用候选人保存 API。
    return await saveCandidate(payload)
  } catch (error) {
    // 调用字段错误规范化函数。
    normalizeFieldErrors(error)
    // 抛出错误。
    throw error
  }
}
```

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


<a id="ts-4"></a>

### TS 4：空行仅分隔真实逻辑区域

最多一个空行分隔不同职责。禁止连续、文件首尾、块内边缘、注释与对象之间及紧密语句/对象成员/类型成员/JSX 节点之间的装饰性空行。


**对应示例与适用边界：**

#### 场景 7：空行分隔逻辑区域

**正例：**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

// 当前列表查询条件及其是否生效的派生状态，供筛选区使用。
const filters = ref(createDefaultFilters())
const hasActiveFilters = computed(() => hasFilters(filters.value))

// 使用当前筛选条件刷新候选人列表。
const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

需要注释时，使其紧邻对应声明或语句。函数内部开闭边缘，以及紧密相关的对象成员、类型成员、语句或 JSX 节点之间不留空行。禁止连续、文件开头或结尾空行。

**反例：**

不要把相同注释与声明分开，也不要拆散紧密相关语句：

```ts
// 保留服务端默认值，确保重置恢复原始查询契约。

const filters = ref(createDefaultFilters())

const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

来源：[code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)


<a id="ts-5"></a>

### TS 5：导入顺序及类型导入语法

按第三方运行时 → 类型依赖 → 内部运行时 → UI/组件排序；类型组内本地类型先于共享类型。

编译器与打包器能安全擦除纯类型用途时，优先标准 import。实际编译、lint、bundler 或包运行时契约要求时，使用独立 import type；禁止内联 type 修饰符。是否需要 import type 必须核查配置，不从附近文件推断，也不重排无关导入。


**对应示例与适用边界：**

#### 场景 1：按组排列导入，并依据配置选择类型导入语法

场景：组件使用一个第三方运行时 API、本地与共享类型、内部 API 模块及 UI 组件。

**正例：**

已验证的编译、打包、lint 和包契约可以安全擦除纯类型用途、且不强制 import type 时，使用普通导入并保持分组：

```ts
import { ref } from 'vue'
import { CandidatePayload } from './type'
import { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

当前配置要求纯类型导入时，在相同类型分组中使用独立声明：

```ts
import { ref } from 'vue'
import type { CandidatePayload } from './type'
import type { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

下方反例的同一组导入，按配置采用纯类型形式后应这样分组：

```ts
import { ref } from 'vue'
import type { CandidatePayload } from '@/apis'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

**反例：**

不要根据相邻文件推断选择，也不要把相同导入和内联 type 修饰符混在一起：

```ts
import CandidateCard from '@/components/candidate-card'
import { loadCandidates, type CandidatePayload } from '@/apis'
import { ref } from 'vue'
```

在两种有效分组形式中选择前，核实生效的 tsconfig、lint、打包行为和包运行时契约。不要仅为统一偏好改写未涉及的导入。

来源：[imports-and-types.md](D:/desktop/coding-skill/ts-code-rules/references/imports-and-types.md)


<a id="ts-6"></a>

### TS 6：跨模块入口与源码分层

跨模块使用配置别名与公开入口，不连续向上跨两级及以上目录，不深入其他模块私有实现。单一拥有者内部相对引用可以保留；入口仅转发公开声明，不承载业务实现。

main.ts 负责创建应用、全局插件/样式、router/store 安装与挂载。apis 负责后端端点及传输契约；services 仅在存在独立能力适配或真实跨模块编排时使用。router 放路由记录、守卫和装配。store 放跨路由/独立所有者共享状态。

私有 constants、type、utils 留在实际拥有者附近；出现跨所有者真实消费者或应用级契约需要后再提升。src/type 放环境声明和真正应用级契约；src/utils 保持无状态，按领域或能力聚焦组织，优先扩展已有匹配模块，避免 common.ts 收纳式模块。

保留仓库既有 api/apis、pages/views 等层名，不为了示意图创建竞争目录或空目录。


**对应示例与适用边界：**

#### 场景 2：跨模块边界使用公共入口

场景：页面使用共享组件，以及另一个功能拥有的能力。

**正例：**

通过配置别名和所有者公开入口导入：

```ts
import { normalizeCandidate } from '@/features/candidate'
import CandidateCard from '@/components/candidate-card'
```

**反例：**

不要连续向上跨多级目录、绕过组件入口，或访问其他功能的私有实现：

```ts
import CandidateCard from '../../components/candidate-card/index.vue'
import { normalizeCandidate } from '@/features/candidate/private/normalize-candidate'
```

同一所有者内部、未跨模块边界时仍可使用相对导入。公共入口要求避免外部消费者耦合私有目录，不要求所有相邻文件都经过全局汇总入口。

来源：[imports-and-types.md](D:/desktop/coding-skill/ts-code-rules/references/imports-and-types.md)


#### 应用源码分层图

Vue 和 TypeScript 应用可以包含以下源码层。完整目录图用于识别职责归属，不要求每个项目或功能都具备全部目录。

```text
src/
|-- App.vue                应用根，由 vue-code-rules 管理
|-- main.ts                应用启动与注册
|-- apis/                  后端传输端点与请求契约
|-- assets/                打包静态资源
|-- components/            跨页面复用 UI，由 vue-code-rules 管理
|-- constants/             跨所有者共享的不可变领域值或配置
|-- hooks/                 跨页面 Vue composable，由 vue-code-rules 管理
|-- layout/                页面框架，由 vue-code-rules 管理
|-- pages/ (or views/)     路由级单元，由 vue-code-rules 管理
|-- router/                路由记录、守卫与路由装配
|-- services/              外部能力适配或跨模块编排
|-- store/                 应用级状态与 store 模块
|-- styles/                应用全局样式，由 css-code-rules 管理
|-- type/                  环境声明与真正应用级契约
`-- utils/                 跨所有权边界共享的无状态工具
```

pages-pc、components-pc 等可选目标专用 UI 目录沿用仓库既有结构。保留 api/apis 等现有单复数名称，不为匹配目录图而新增竞争目录。

来源：[application-architecture.md](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md)


#### 强制要求

1. main.ts 只负责创建应用、注册全局插件与样式、安装 router/store 及挂载。功能流程和可复用工具归实际所有者。
2. 后端 API 模块放在仓库既有 API 源码层。
3. services 沿用仓库既有外部能力或跨模块编排层约定。
4. 私有常量、类型和无状态工具留在拥有它们的页面、组件、功能或服务旁。出现跨所有权边界消费者或应用级契约需求后，才提升到 src/constants、src/type 或 src/utils。
5. src/type 专注配置的环境声明和真正应用级契约，不收纳已有更明确所有者的页面、组件、API、服务或 store 类型。
6. src/utils 保持无状态，按聚焦业务领域或技术能力组织。优先扩展已有匹配模块，避免 common.ts 等杂项文件；通过既有目录入口转发公共工具，不把实现放进入口。
7. 只有跨路由或独立所有者共享的状态，才放在既有 store 层。组件子树、页面私有和请求局部状态留在最近的所有者。
8. 路由记录、守卫和路由装配留在 router；路由组件和页面流程留在页面目录，不移入路由配置。

来源：[application-architecture.md](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md)


#### 放置决策

| 能力 | 留在最近所有者的情况 | 提升到应用源码层的条件 |
| --- | --- | --- |
| 类型或接口 | 契约仅由一个页面、组件、API、服务或 store 拥有 | 契约属于环境声明或真正应用级；其他情况通过所属模块公开入口导出 |
| 常量 | 表达拥有者私有的选项、限制、状态映射或配置 | 多个独立所有者共享同一领域含义 |
| 无状态工具 | 只有一个所有者或一个所有者子树使用 | 真实消费者跨越所有权边界，且工具具有聚焦领域或技术职责 |
| Vue composable | 协调一个页面或组件子树 | 多个页面或独立组件复用同一 Vue 行为 |
| Store 模块 | 状态属于一个页面或组件子树 | 独立路由或所有者需要单一应用级状态源 |
| 服务 | 逻辑属于一次 API 调用或单个功能流程 | 存在独立外部能力或跨模块编排边界 |

component、hooks、constants、type 和 utils 等私有目录按需创建。只增加拥有者实际需要的目录，公开范围不超过真实消费者所需。

来源：[application-architecture.md](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md)


#### 公共入口

跨所有权边界使用配置别名与公共入口。单一所有者内部未绕过其他模块公共契约时，可以使用相对导入。汇总入口只转发公共声明，不承载业务实现，也不为方便公开私有内部细节。

来源：[application-architecture.md](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md)


<a id="ts-7"></a>

### TS 7：await、并发、错误归属与操作状态

普通顺序流程优先 await；依赖操作保持顺序。仅当操作独立、可同时启动且合并失败语义符合预期时使用 Promise.all。

仅在当前层可以恢复、转换、补充上下文或报告错误时 catch，否则让 rejection 传播。禁止用一元 void 丢弃 Promise。需要等待结果就 await；允许后台执行时，操作自身处理或报告 rejection，并有明确不依赖完成结果的业务契约。

操作自有 loading 在工作开始之前设置，在 finally 中恢复。必要数据到齐后一起提交相关状态，不能因无必要的异步间隔暴露部分更新；明确设计的渐进更新除外。


**对应示例与适用边界：**

#### 场景 1：等待并处理 API 调用

**正例：**

```ts
// 加载候选人详情并同步页面状态。
const loadCandidate = async () => {
  try {
    // 保存 API 返回的候选人详情。
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    // 上报加载失败，并交由页面错误边界处理。
    reportCandidateLoadError(error)
    throw error
  }
}
```

**反例：**

普通顺序逻辑避免使用 then 链：

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

当前层负责处理、补充上下文、上报或转换错误时使用 try/catch。错误归调用方处理时，等待并允许 rejection 传播即可。

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


#### 场景 2：避免丢弃 Promise

**正例：**

完成结果或失败有意义时，等待同一个保存操作：

```ts
await saveCandidate(payload)
```

明确允许后台执行时，说明边界，并在被调用操作内部处理 rejection：

```ts
// 上报候选人页面曝光，不阻塞当前交互流程。
const reportCandidateExposure = () => {
  // 捕获曝光上报失败，并发送到遥测错误通道。
  reportExposureRequest().catch((error) => {
    reportTelemetryError(error)
  })
}

reportCandidateExposure()
```

**反例：**

不要使用一元 void 隐藏同一个保存 Promise：

```ts
void saveCandidate(payload)
```

只有调用方有意不依赖完成结果、且操作自己负责失败路径时，后台执行才有依据。

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


#### 场景 5：按依赖关系选择顺序或并行

**正例：**

有依赖的操作保持顺序：

```ts
const profile = await fetchCandidateProfile(candidateId)
const permissions = await fetchCandidatePermissions(profile.roleId)
```

仅在共用失败行为符合预期时，同时启动独立请求：

```ts
const [roles, benefits] = await Promise.all([
  fetchRoles(),
  fetchBenefits()
])
```

**反例：**

资料尚未提供输入前，不要启动权限请求：

```ts
const [profile, permissions] = await Promise.all([
  fetchCandidateProfile(candidateId),
  fetchCandidatePermissions(profile.roleId)
])
```

一个结果决定下一操作是否允许执行时，不要仅为缩短代码而并行化。

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


#### 场景 6：恢复 loading 并集中提交相关状态

**正例：**

```ts
const loadCandidatePage = async () => {
  page.loading = true
  try {
    const { data } = await fetchCandidatePage(query.value)
    Object.assign(page, {
      total: data.total,
      pageNumber: data.pageNumber
    })
    candidates.value = data.records
  } catch (error) {
    Message.error(error.message)
  } finally {
    page.loading = false
  }
}
```

页面所有者反馈面向用户的失败，在所有路径恢复 loading，并一起提交同一响应中的相关分页字段。

**反例：**

```ts
const loadCandidatePage = async () => {
  page.loading = true
  const { data } = await fetchCandidatePage(query.value)
  page.total = data.total
  await nextTick()
  page.pageNumber = data.pageNumber
  candidates.value = data.records
  page.loading = false
}
```

反例会在请求失败后卡住 loading，并在赋值之间暴露不必要的部分状态。界面明确采用渐进更新时可以分次提交，但必须属于契约，而非语句顺序造成的意外。

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


<a id="ts-8"></a>

### TS 8：直接读取 catch 错误的 message

当前技能约定 catch 中的错误具有 message 属性，直接读取 error.message，不添加 instanceof Error、typeof 检查或 fallback 分支。

这是该技能设定的错误契约，不是 TypeScript 语言对所有可抛出值的保证。完整要求见 Async and Compatibility Examples 的 Mandatory Rules 第 2 条。

以下沿用现有完整请求示例，重点审阅 catch 中直接读取 error.message 的写法；与 TS 7 同时相关，因此在此重复展示。

#### 场景 6：恢复 loading 并集中提交相关状态

**正例：**

```ts
const loadCandidatePage = async () => {
  page.loading = true
  try {
    const { data } = await fetchCandidatePage(query.value)
    Object.assign(page, {
      total: data.total,
      pageNumber: data.pageNumber
    })
    candidates.value = data.records
  } catch (error) {
    Message.error(error.message)
  } finally {
    page.loading = false
  }
}
```

页面所有者反馈面向用户的失败，在所有路径恢复 loading，并一起提交同一响应中的相关分页字段。

**反例：**

```ts
const loadCandidatePage = async () => {
  page.loading = true
  const { data } = await fetchCandidatePage(query.value)
  page.total = data.total
  await nextTick()
  page.pageNumber = data.pageNumber
  candidates.value = data.records
  page.loading = false
}
```

反例会在请求失败后卡住 loading，并在赋值之间暴露不必要的部分状态。界面明确采用渐进更新时可以分次提交，但必须属于契约，而非语句顺序造成的意外。

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


<a id="ts-9"></a>

### TS 9：新增运行时 API 检查真实支持

新增超出现有已验证基线的 API 前，核查 TS target、运行时版本、Browserslist 及 polyfill；确认每个目标环境的原生支持，支持不足时使用项目认可的 helper、fallback 或 polyfill，并验证最旧支持目标。

语法转译与运行时 API 补齐是不同事情。不能仅因为 TS 编译通过，就认为目标浏览器拥有该 API。


**对应示例与适用边界：**

#### 场景 3：根据配置基线检查 API 支持

**正例：**

使用超出仓库已验证基线的 API 前：

1. 查看仓库 TypeScript target、Browserslist、运行时版本和 polyfill 配置。
2. 确认每个目标环境的原生支持。
3. 支持不足时，优先采用已有项目工具或认可的 polyfill。
4. 在最旧支持目标中验证行为。

不要假定转译会补齐运行时 API。语法转换与 API polyfill 是两件事。

实际目标不支持 Array.prototype.at 时，使用认可的兼容形式：

```ts
// 读取候选人列表最后一项。
const lastCandidate = candidates[candidates.length - 1]
```

**反例：**

同样读取末项时，不要使用不受支持的 API：

```ts
// 读取候选人列表最后一项。
const lastCandidate = candidates.at(-1)
```

回退写法仅为示例，实际支持判断必须依据仓库目标矩阵。

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


<a id="ts-10"></a>

### TS 10：定向格式化与最终差异复核

使用仓库配置的 Prettier，只格式化本次修改文件。格式化前保留文件内容；无关区域的纯格式变化依据格式化前版本恢复，不能用 HEAD 覆盖用户已有修改。

保留修改语法必要的格式调整。若整文件检查只因未修改的历史格式失败，说明限制，不静默扩大范围或宣称通过。最后检查范围、注释、空行、imports、源码分层、Promise/错误路径和运行时支持。


**对应示例与适用边界：**

#### 场景 4：只格式化修改文件

**正例：**

配置的 Prettier 命令只处理本次修改的 TS、TSX 或 Vue 文件。存在无关用户修改时，不格式化整个目录。

```text
prettier --write src/components/candidate-card/index.vue
```

格式化前保留当前内容，区分已有用户编辑与工具输出。格式化后，从格式化前版本恢复影响范围之外的纯格式变化，而非从 HEAD 恢复。保留新语法必要的调整。整文件检查若仍因未触及历史格式失败，应报告限制，不扩大修改或声称通过。

格式化后，手动复核 Prettier 无法约束的规则：

- 修改范围内没有顺手清理。
- 按代码质量规则记录业务声明、函数职责及关键阶段；名称清楚不免除覆盖，机械语句无需逐行叙述。
- 空行有实际意义。
- 导入分组与源码层归属正确。
- Promise 被正确等待，错误路径有明确意图。
- API 符合目标运行时支持。

格式化成功不等于架构或兼容性合规。

**反例：**

不要把同一格式化任务扩大到整个源码树：

```text
prettier --write src
```

来源：[async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)


## 四、css-code-rules（当前 12 条）

<a id="css-1"></a>

### CSS 1：保留样式语言及作用域方案

保留项目已有 CSS/Less/Sass/SCSS、CSS Modules 或其他生效机制，不为一致性迁移。新 Vue 样式仅在项目具备相应 Less 配置时采用 `<style lang="less" scoped>`，属性顺序如上；有意使用其他方案的项目沿用其机制。

普通 Vue 组件样式 scoped；真实全局规则或根节点之外渲染的内容可使用恰当的 unscoped 规则。


**对应示例与适用边界：**

#### 场景 1：保留现有样式语言

场景：已有 Vue 组件使用 SCSS，而用户常用 Vue 项目的新组件默认采用 Less。

**正例：**

保留已有组件的 SCSS：

```vue
<style lang="scss" scoped>
@use './index.scss';
</style>
```

仅当仓库未明确统一为其他方案时，新组件使用 Less：

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

不要仅为匹配默认偏好，把已有 SCSS 转成 Less。先检查相邻组件、构建配置、共享变量和格式化规则，保留已验证的语言或机制，包括 CSS Modules 等方案，不输出无效的 Less 专用语法。

**反例：**

不要仅为一致性把同一个已有 SCSS 组件改写为 Less：

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

来源：[scope-and-file-organization-examples.md](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md)


#### 场景 2：选择 scoped 或 unscoped Vue 样式

场景：组件拥有根节点内的普通 DOM，同时配置通过 Teleport 渲染的下拉层。

**正例：**

普通组件样式保持 scoped：

```vue
<template>
  <div class="talent-select">
    <span class="talent-select-title">选择候选人</span>
  </div>
</template>

<style lang="less" scoped>
.talent-select {
  .talent-select-title {
    color: var(--text-color-primary);
  }
}
</style>
```

为 Teleport 内容设置完整业务根，在 unscoped 块中处理：

```vue
<style lang="less">
.talent-select-popper {
  .talent-select-popper-option {
    color: var(--text-color-primary);
  }
}
</style>
```

**反例：**

不要让普通组件根样式全局生效：

```vue
<style lang="less">
.talent-select {
}
</style>
```

Teleport 根不能使用 popper 或 dropdown 等通用类名。全局选择器仍需标识业务组件，避免影响无关浮层。

来源：[scope-and-file-organization-examples.md](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md)


<a id="css-2"></a>

### CSS 2：样式归属与强制提取阈值

样式跟随所属组件。满足下列任一条件，必须提取整个内联样式块：

| 条件 | 触发标准 |
| --- | --- |
| 非空行数 | 至少 80 行；计入选择器、声明、括号、at-rule 和注释 |
| 结构复杂度 | 至少 4 个自有选择器组，同时具备至少 2 类复杂度信号 |

复杂度信号为：三层及以上嵌套；至少三个状态/修饰符/伪类分支；deep/第三方覆盖；keyframes/复杂动画；响应式、supports 或 container query 分支。

独立后代、状态、伪分支、deep 覆盖、at-rule 分支等拥有独立职责的块各算一组；逗号选择器列表算一组。阈值是硬要求，不是建议；更短的样式存在模板耦合或具体维护问题时也可提取。

整体提取为入口旁的 index.less/index.scss 等匹配扩展名文件，通过组件 scoped style 引入，不移到脚本或全局入口。私有单文件子组件因此需要独立样式时，转为含 index.vue、index.ts 和样式文件的目录。

一个组件通常一个完整样式文件，不按 header/content/actions 等视觉区域拆分。只有作用域确实需要隔离时才拆 scoped/global 文件。全局 reset、token、工具类和全局库覆盖放既有全局样式区域；一次性组件库覆盖留在组件。


**对应示例与适用边界：**

#### 场景 3：提取复杂组件样式

场景：index.vue 内联样式达到 80 非空行，或至少四个自有选择器组且具备两类复杂度信号。即使组件仅使用一次，也不能继续保留内联规则。

**正例：**

单个 scoped 样式文件与组件入口放在一起：

```text
talent-card/
|-- index.vue
`-- index.less
```

移动完整所属样式，不按视觉区域拆分。通过 scoped 块引入提取文件，让 Vue 继续附加作用域属性：

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

不要将导入移到脚本入口或全局样式入口，否则会改变作用域与归属。

私有 custom-range-editor.vue 子组件达到强制条件后，改为目录形式，让样式仍在拥有者旁：

```text
component/custom-range-editor/
|-- index.vue
|-- index.ts
`-- index.less
```

触发提取条件后仍把样式留在 custom-range-editor.vue 内即违反规则。私有、职责内聚或未达到 Vue 1000 行上限，都不构成样式提取例外。

scoped 与 unscoped 确实需要独立文件时，按作用域隔离：

```text
talent-select/
|-- index.vue
`-- style/
    |-- scoped.less
    `-- global.less
```

**反例：**

不要按视觉区域或功能拆分一个组件的样式：

```text
talent-card/
|-- header.less
|-- content.less
|-- actions.less
`-- states.less
```

这样会使选择器归属难以跟踪，并容易重复父节点或状态块。除非作用域本身要求隔离，否则组件所属规则应集中管理。

来源：[scope-and-file-organization-examples.md](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md)


#### 场景 4：放置全局与组件自有规则

场景：项目需要 reset、主题 token、共享工具样式及一次性的 Element Plus 输入框调整。

**正例：**

应用级职责放在既有全局样式区域：

```text
src/styles/reset.less
src/styles/theme.less
src/styles/utilities.less
src/components/talent-form/index.less
```

一次性库覆盖留在业务组件根下：

```less
.talent-form {
  &:deep(.el-input__wrapper) {
    border-radius: var(--radius-medium);
  }
}
```

只有覆盖有意作用于全应用所有匹配库组件时，才移入全局库覆盖文件。来自库内部不代表规则就应全局生效，应用范围才决定归属。

**反例：**

不要把相同的一次性表单覆盖移到全局样式入口：

```less
/* src/styles/element-plus.less */
.el-input__wrapper {
  border-radius: var(--radius-medium);
}
```

来源：[scope-and-file-organization-examples.md](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md)


<a id="css-3"></a>

### CSS 3：业务根与单连字符类名

每个组件拥有明确业务根，所属选择器位于其下。Teleport 内容可以另设完整业务根，避免 popper/option 等通用全局类。

项目自有命名采用 block-element-modifier，单连字符分隔，不使用双下划线或双连字符；第三方库类名不改。命名描述组件、元素、状态或业务意义，避免纯视觉名、任意后缀链和冗长祖先拼接。

过长先删冗余所有权词、重复业务词和视觉/实现后缀；仍过长时再采用已有词汇表中可理解、统一使用的缩写，不能为了长度制造含糊字母串。


**对应示例与适用边界：**

#### 场景 1：命名组件根、元素和状态

场景：候选人卡片包含头部、标题、操作、选中及禁用状态。

**正例：**

使用有业务含义的根类与完整单连字符 BEM 类名：

```less
.talent-card {
  .talent-card-header {
    .talent-card-title {
      color: var(--text-color-primary);
    }
  }

  .talent-card-action {
    cursor: pointer;
  }

  &.talent-card-selected {
    border-color: var(--color-primary);
  }

  &.talent-card-disabled {
    cursor: not-allowed;
    .talent-card-action {
      pointer-events: none;
    }
  }
}
```

下方反例中的表头应使用业务限定类名，不附带视觉后缀：

```less
.candidate-table {
  .candidate-table-header {
    color: var(--text-color-danger);
  }
}
```

**反例：**

避免通用根、双下划线/双连字符 BEM、纯视觉命名和任意后缀链：

```less
.card {
}

.talent-card__header {
}

.talent-card--selected {
}

.table-box-header-red {
}
```

即使颜色、位置或实现改变，类名仍应表达业务角色。

来源：[naming-examples.md](D:/desktop/coding-skill/css-code-rules/references/naming-examples.md)


#### 场景 2：控制过长类名并使用统一缩写

场景：人力资源招聘功能包含候选人评估面板。反复拼接全部领域、页面、组件、元素及视觉角色，会使类名越来越长。

依次处理：

1. 移除业务根已隐含的词语。
2. 移除不表达业务含义的视觉或实现后缀。
3. 保留功能范围内最短且不含糊的完整名称。
4. 删减后仍不可避免地过长，再统一缩写重复业务片段。

**正例：**

自然简洁的完整名称能无冲突识别所有者时，优先采用：

```vue
<div class="candidate-evaluation">
  <div class="candidate-evaluation-header">
    <span class="candidate-evaluation-title">候选人评估</span>
  </div>
</div>
```

```less
.candidate-evaluation {
  .candidate-evaluation-header {
    display: flex;
    .candidate-evaluation-title {
      color: var(--text-color-primary);
    }
  }
}
```

确实需要更广的人力资源与招聘上下文区分组件时，采用仓库或功能词汇表中可识别的缩写：

| 业务词语 | 示例缩写 | 可读性条件 |
| --- | --- | --- |
| 人力资源（human resources） | hr | 仓库统一使用 HR 术语 |
| 招聘（recruitment） | recruit | 该缩写已在功能内采用 |
| 候选人（candidate） | cand | 功能词汇表使含义明确 |
| 评估（evaluation） | eval | 对评估统一使用该缩写 |

完整缩写应用示例：

```vue
<div class="hr-recruit-cand-eval">
  <div class="hr-recruit-cand-eval-header">
    <span class="hr-recruit-cand-eval-title">候选人评估</span>
    <div class="hr-recruit-cand-eval-actions">
      <button class="hr-recruit-cand-eval-submit">提交</button>
    </div>
  </div>
</div>
```

```less
.hr-recruit-cand-eval {
  .hr-recruit-cand-eval-header {
    display: flex;
    .hr-recruit-cand-eval-title {
      color: var(--text-color-primary);
    }

    .hr-recruit-cand-eval-actions {
      display: flex;
      .hr-recruit-cand-eval-submit {
        cursor: pointer;
      }
    }
  }
}
```

每个缩写片段含义稳定、单独阅读也可理解时才成立。同一子树内同一个词不能在全称和不同缩写间切换。

**反例：**

不要把每个祖先、实现细节和视觉角色都编码进同一个名字：

```vue
<div class="human-resources-recruitment-candidate-evaluation-management-panel-container">
  <div class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper">
    <span class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper-title-text">
      候选人评估
    </span>
  </div>
</div>
```

也不要缩减成任意单字母或无法理解的连续字母串：

```less
.h-r-c-e-m-p-c {
  .h-r-c-e-m-p-c-h-w {
  }
}

.hrcempc {
  .hrcempchw {
  }
}
```

不要为同一业务词混用不同缩写：

```less
.hr-recruit-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

缩写是应对不可避免长度的受控回退，不代表可以牺牲含义。没有既有缩写时，在功能内建立一致形式，不为每个选择器另造简写。

来源：[naming-examples.md](D:/desktop/coding-skill/css-code-rules/references/naming-examples.md)


#### 场景 3：命名 Teleport 根节点

场景：筛选面板将浮层渲染到组件根节点之外。

**正例：**

两个顶层根有效，因为它们属于分离的渲染树：

```less
.talent-filter {
}

.talent-filter-popper {
  .talent-filter-popper-option {
  }
}
```

Teleport 根仍需完整业务限定。popper、option 或 dropdown-item 等通用选择器会影响无关内容。

**反例：**

不要用通用全局选择器重命名相同的 Teleport 树：

```less
.popper {
  .option {
  }
}
```

来源：[naming-examples.md](D:/desktop/coding-skill/css-code-rules/references/naming-examples.md)


<a id="css-4"></a>

### CSS 4：嵌套跟随最近有效所有者

在 Less/Sass 或已验证支持 CSS nesting 的环境，后代放在最近承担布局、状态或行为职责的所有者下面，保留完整类名。不把子元素漂浮成顶层规则，也不为降低嵌套深度跳过有效所有者。无职责的偶然 wrapper 不强制增加样式层级。

仅当稳定直接子关系确实用于防止误匹配时使用 `& >`；其他情况普通后代嵌套。禁止嵌套以裸 `>` 开头。

伪类跟随所属选择器；业务状态通过完整类连接拥有者，状态导致的子元素变化集中在状态块内。无原生/构建嵌套支持时，展开选择器并保留同等归属与匹配语义，不迁移样式语言来满足语法。


**对应示例与适用边界：**

#### 场景 1：通过嵌套表达最近有效所有权

场景：DOM 包含卡片、头部，以及归头部拥有的标题。

```vue
<div class="talent-card">
  <div class="talent-card-header">
    <span class="talent-card-title">候选人</span>
  </div>
</div>
```

**正例：**

头部为标题提供布局归属，因此在 Less 中保留这一层：

```less
.talent-card {
  .talent-card-header {
    .talent-card-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

**反例：**

不要把子元素漂浮到样式表根部：

```less
.talent-card-title {
}
```

不要仅为降低嵌套深度跳过有效所有者：

```less
.talent-card {
  .talent-card-title {
  }
}
```

该规则依据职责归属，不依据任意最大嵌套层数。没有类名且不建立布局、状态或行为的偶然包装，不要求增加嵌套层。DOM 无必要地过深时，应简化组件结构与职责模型，不能只扁平化样式表。

来源：[nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)


#### 场景 2：判断直接子选择器是否必要

场景：菜单只给自身条目加分隔线，嵌套子菜单也包含相同 menu-item 类。

**正例：**

直接子边界避免父菜单样式命中嵌套子菜单条目：

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid var(--border-color);
  }
}
```

没有误匹配风险的普通后代，使用正常嵌套：

```less
.talent-card {
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

**反例：**

嵌套选择器不能以裸组合符开头：

```less
.menu-list {
  > .menu-item {
  }
}
```

不要仅因当前结构恰好是一层父子关系就添加 & >。只有直接子范围是稳定组件契约时才使用。

来源：[nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)


#### 场景 4：伪类与业务状态跟随所有者

场景：卡片有 hover 行为，以及会改变子标题的激活状态。

**正例：**

```less
.talent-card {
  &:hover {
    border-color: var(--color-primary);
  }

  &.talent-card-active {
    .talent-card-title {
      color: var(--color-primary);
    }
  }
}
```

原生伪类跟随被修饰选择器。应用状态使用完整业务类，所有依赖该状态的子元素变化放进状态块，不在分离的顶层子选择器中重复状态。

**反例：**

不要把相同的所有者和状态关系扁平化为无关顶层选择器：

```less
.talent-card:hover {
  border-color: var(--color-primary);
}

.talent-card-active .talent-card-title {
  color: var(--color-primary);
}
```

来源：[nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)


#### 场景 5：不支持嵌套的原生 CSS 保留归属路径

**正例：**

构建管线和目标浏览器均不提供所需嵌套能力时，保留原生 CSS 并展开选择器。伪类和业务状态仍保留所属业务根：

```css
.talent-card .talent-card-header .talent-card-title {
  color: var(--text-color-primary);
}
.talent-card:hover {
  border-color: var(--color-primary);
}
.talent-card.talent-card-active .talent-card-header .talent-card-title {
  color: var(--color-primary);
}
```

Vue scoped CSS 中，将完整库内部路径放进 deep 参数，避免后代错误地带上父组件作用域：

```css
.result-table :deep(.arco-table .arco-table-th:first-child) {
  border-radius: 8px 0 0 8px;
}
.result-table :deep(.arco-table .arco-table-th .arco-table-cell) {
  min-height: 40px;
}
```

这种兼容写法有意重复库祖先，应把相关规则放在一起。此例外不允许裸子选择器、省略业务根，或改变后代与直接子节点的匹配语义。

**反例：**

不要丢失业务根，也不要把库后代移出 deep 参数：

```css
.talent-card-title {
  color: var(--text-color-primary);
}
.result-table :deep(.arco-table) .arco-table-th:first-child {
  border-radius: 8px 0 0 8px;
}
```

来源：[nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)


<a id="css-5"></a>

### CSS 5：deep 指明目标并合并库内部归属

支持嵌套的 scoped 样式使用 `&:deep(具体选择器)`，不能空写 deep。共享库内部父节点的多个覆盖，在最近合适共同父节点上使用一次 deep，后代、伪类、伪元素继续嵌套，不重复 deep。

只有不存在业务根以下合适的库内部共同祖先时，才使用多个并列 deep 块；不扁平化散落或用逗号拼散覆盖。

普通 CSS 无嵌套支持时允许等价展开，但每个选择器保留业务根，库拥有的完整后代路径放进 deep 参数，避免后代被错误加上父组件 scope。


**对应示例与适用边界：**

#### 场景 3：合并第三方库 deep 选择器

场景：多个 Arco Table 后代共享 arco-table 祖先。

**正例：**

在最近合适的库共享根上使用 deep，然后将后代、伪类和伪元素嵌套在各自所有者下：

```less
.result-table {
  &:deep(.arco-table) {
    .arco-table-container {
      width: 100%;
    }

    .arco-table-th {
      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &::before {
        display: none;
      }

      .arco-table-cell {
        min-height: 40px;
      }
    }
  }
}
```

业务根以下不存在合适的库内部共同祖先时，可以采用并列 deep 块：

```less
.profile-form {
  &:deep(.el-input__wrapper) {
    box-shadow: none;
  }

  &:deep(.el-select__wrapper) {
    min-height: 36px;
  }
}
```

**反例：**

不要使用空 deep 包装：

```less
.result-table {
  &:deep() {
    .arco-table-th {
    }
  }
}
```

共享同一库根的后代，不要重复使用 deep：

```less
.result-table {
  &:deep(.arco-table-container) {
  }

  &:deep(.arco-table-th) {
  }

  &:deep(.arco-table-cell) {
  }
}
```

不要在业务根之外扁平化或拼接 deep 选择器：

```less
.result-table:deep(.arco-table-cell),
.result-table:deep(.arco-table-th) {
}
```

判断依据是库的真实 DOM 树，不是选择器在样式表中是否相邻。

来源：[nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)


#### 场景 5：不支持嵌套的原生 CSS 保留归属路径

**正例：**

构建管线和目标浏览器均不提供所需嵌套能力时，保留原生 CSS 并展开选择器。伪类和业务状态仍保留所属业务根：

```css
.talent-card .talent-card-header .talent-card-title {
  color: var(--text-color-primary);
}
.talent-card:hover {
  border-color: var(--color-primary);
}
.talent-card.talent-card-active .talent-card-header .talent-card-title {
  color: var(--color-primary);
}
```

Vue scoped CSS 中，将完整库内部路径放进 deep 参数，避免后代错误地带上父组件作用域：

```css
.result-table :deep(.arco-table .arco-table-th:first-child) {
  border-radius: 8px 0 0 8px;
}
.result-table :deep(.arco-table .arco-table-th .arco-table-cell) {
  min-height: 40px;
}
```

这种兼容写法有意重复库祖先，应把相关规则放在一起。此例外不允许裸子选择器、省略业务根，或改变后代与直接子节点的匹配语义。

**反例：**

不要丢失业务根，也不要把库后代移出 deep 参数：

```css
.talent-card-title {
  color: var(--text-color-primary);
}
.result-table :deep(.arco-table) .arco-table-th:first-child {
  border-radius: 8px 0 0 8px;
}
```

来源：[nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)


<a id="css-6"></a>

### CSS 6：Flexbox 优先，Grid 仅处理必要二维布局

优先 Flexbox 和 gap。只有真实二维对齐需求无法由 Flexbox 正确表达时才采用 Grid；普通一维布局不使用 Grid。

剩余空间区域按需要使用 flex: 1，固定区域按需要使用 flex-shrink: 0，flex 收缩或文本省略依赖时使用 overflow: hidden。不能机械给所有区域添加这些属性。

当前规则没有 min-width: 0 或 min-height: 0 的要求及对应示例。


**对应示例与适用边界：**

#### 场景 1：通过 Flexbox 构建一维行布局

场景：一行包含固定头像与填充剩余宽度的标题区域，长文本需要省略。

**正例：**

```less
.talent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }

  .talent-row-content {
    overflow: hidden;
    flex: 1;
    .talent-row-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

flex-shrink: 0 保护固定头像，flex: 1 将剩余空间分配给内容。可伸缩区域的 overflow: hidden 允许其收缩，并让内部文本省略实际生效。

真实二维矩阵要求每行共享相同列轨道时，可以将 Grid 作为必要的最后选择：

```less
.schedule-matrix {
  display: grid;
  grid-template-columns: 120px repeat(5, minmax(160px, 1fr));
  gap: 8px;
  .schedule-matrix-cell {
    min-height: 80px;
  }
}
```

此场景确实二维：各独立单元格的时间行和星期列都需保持对齐。换行 Flexbox、表格组件或更简单的一维流已能表达关系时，不使用 Grid。

**反例：**

不要为相同的一维人才信息行使用 Grid：

```less
.talent-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
}
```

来源：[design-and-layout-examples.md](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md)


<a id="css-7"></a>

### CSS 7：目标归属与单位策略

保留项目已分离的移动端/PC 页面和组件树，不在目标专用组件中通过局部媒体查询重新实现另一端。项目本来就是共享响应式实现时，使用其既有响应策略。

普通间距、尺寸和字体按项目策略使用 px；配置由 PostCSS 转成移动端 vw 时交给工具转换，不手算覆盖精度及排除项。视口单位仅表达真实视口关系。


**对应示例与适用边界：**

#### 场景 2：遵守目标端归属

**正例：**

先依据应用架构判断目标端。Vue 已分离桌面与移动实现时，各展示改动留在对应端的样式文件：

```text
src/pages/talent-list/index.less
src/pages-pc/talent-list/index.less
```

仓库有意采用共享响应式实现时，媒体查询仍然有效；基础规则和响应式调整都留在共享所有者：

```less
.talent-list {
  width: 100%;
}

@media (min-width: 1024px) {
  .talent-list {
    width: 960px;
  }
}
```

**反例：**

不要在任一目标专用样式中，通过局部媒体查询重建另一端：

```less
@media (max-width: 768px) {
  .talent-list {
    padding: 12px;
  }
}
```

CSS 负责展示技术，仓库架构决定组件属于共享还是目标专用目录。仓库其他地方存在媒体查询，不会改变当前组件的归属。

来源：[design-and-layout-examples.md](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md)


#### 场景 3：沿用配置的单位策略

场景：PostCSS 将普通移动端尺寸由 px 转成 vw。

**正例：**

设计尺寸以 px 编写：

```less
.talent-card {
  width: 320px;
  padding: 16px;
  font-size: 14px;
}
```

视口单位用于真实的视口关系：

```less
.full-screen-panel {
  min-height: 100vh;
}
```

构建管线负责转换时，不要手工把 320px 换算成 vw。手算会造成输出不一致，并绕过项目配置的排除项和精度。

**反例：**

不要手工换算同一张卡片的宽度与间距：

```less
.talent-card {
  width: 85.3333vw;
  padding: 4.2667vw;
  font-size: 3.7333vw;
}
```

来源：[design-and-layout-examples.md](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md)


<a id="css-8"></a>

### CSS 8：库定制优先正式变量与普通选择器

优先使用库正式支持的 CSS 自定义属性。局部变量或普通 scoped 选择器可以解决时，不增加优先级或使用 important。没有正式变量时，核实库文档与真实 DOM，再使用最小可可靠命中的嵌套/deep 选择器。


**对应示例与适用边界：**

#### 场景 4：局部定制组件库

场景：Element Plus 文档中的自定义属性可以控制弹窗圆角。

**正例：**

在所属组件根设置变量：

```less
.talent-dialog {
  --el-dialog-border-radius: 12px;
}
```

**反例：**

变量已经能够处理相同行为时，不提高优先级或添加 important：

```less
.page .content .talent-dialog.el-dialog {
  border-radius: 12px !important;
}
```

没有正式文档变量时，使用能可靠命中目标的最小普通嵌套或 deep 选择器。覆盖内部选择器前，核实库文档及渲染 DOM。

来源：[design-and-layout-examples.md](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md)


<a id="css-9"></a>

### CSS 9：删除 reset 噪声与无效声明，基于重复抽象

box-sizing 在全局/顶层定义一次，不在组件重复。删除实际格式化上下文中无作用、与固定尺寸重复、已有 reset 覆盖或没有独立可观察效果的声明。判断以计算布局为准，不能仅因像默认值就删除。

出现真实重复后，才抽取聚焦的布局、省略、transition、animation mixin/变量/既有工具。不要为一个消费者引入间接层，也不要把颜色、尺寸和组件私有值混进宽泛 mixin。

循环仅用于稳定机械序列，产生完整可读状态名；不将不规则业务状态强行变成数字循环。


**对应示例与适用边界：**

#### 场景 1：移除冗余固定尺寸声明

场景：flex 子项具有固定正方形尺寸。

**正例：**

只保留具有不同效果的声明：

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }
}
```

**反例：**

移除等效或无效声明：

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    min-height: 40px;
    min-width: 40px;
    display: block;
    flex: 0 0 40px;
    flex-shrink: 0;
  }
}
```

此处相同最小尺寸重复固定尺寸，display: block 对该 flex 子项没有实际帮助，固定 flex basis 又重复宽度，并与更简单的收缩规则重叠。

来源：[reuse-and-redundancy-examples.md](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md)


#### 场景 2：区分 reset 噪声与可观察行为

场景：全局 reset 已设置盒模型和基础元素重置。

**正例：**

只保留实现卡片预期排版所需的声明：

```less
.talent-card {
  font-size: 14px;
  line-height: 1;
}
```

**反例：**

不要在相同卡片中重复全局 reset：

```less
.talent-card {
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1;
}
```

判断依据是实际计算布局。不能仅因声明类似默认值就删除，应核实其是否改变命中元素的尺寸、省略、排版或交互。

来源：[reuse-and-redundancy-examples.md](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md)


#### 场景 3：提取重复模式

场景：两个自有元素使用相同的 inline-flex 居中行为和过渡值。

**正例：**

确认重复后，提取聚焦的抽象：

```less
.inline-center-fixed() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.text-ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@motion-standard: transform 160ms ease;

.talent-card {
  .talent-card-action {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-badge {
    .inline-center-fixed();
    transition: @motion-standard;
  }

  .talent-card-title {
    .text-ellipsis();
  }

  .talent-card-summary {
    .text-ellipsis();
  }
}
```

mixin 专注一种反复出现的行为，不同时注入无关颜色、间距或组件私有尺寸。只使用一次的模式不抽取，否则间接层会掩盖归属且无法带来复用。

**反例：**

不要仅为一个消费者抽取相同模式，也不要混入无关组件样式：

```less
.talent-action-style() {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  padding: 8px;
  color: var(--color-primary);
}

.talent-card-action {
  .talent-action-style();
}
```

来源：[reuse-and-redundancy-examples.md](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md)


#### 场景 4：循环只处理稳定机械序列

场景：六个卡片延迟修饰类遵循相同命名规则，并按固定间隔递增。

**正例：**

局部 Less 循环能清楚表达重复关系时可以使用：

```less
.talent-card {
  .generate-delay(@index) when (@index <= 6) {
    &.talent-card-delay-@{index} {
      transition-delay: (@index * 40ms);
    }
    .generate-delay(@index + 1);
  }
  .generate-delay(1);
}
```

循环拥有一个可预测序列，生成完整可读修饰名，并集中维护增量。无关数值、不规则业务状态，或生成后反而更难理解的短小一次性声明，不采用循环。

**反例：**

不要强行将不规则业务状态放进数字循环：

```less
.talent-card {
  .generate-state(@index) when (@index <= 3) {
    &.talent-card-state-@{index} {
      color: if(@index = 1, green, if(@index = 2, orange, red));
    }
    .generate-state(@index + 1);
  }
  .generate-state(1);
}
```

来源：[reuse-and-redundancy-examples.md](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md)


<a id="css-10"></a>

### CSS 10：常规样式不写注释

不添加常规区域标题、选择器说明、声明翻译、注释掉的旧代码及重复样式含义的注释。

只有非显然兼容性 workaround、库约束或临时例外无法通过命名和结构表达时，才添加简短中文注释解释必要原因；项目明确要求其他语言或精确外部术语需要时除外。


**对应示例与适用边界：**

#### 场景 1：判断注释是否必要

场景：选择器仅有含义明确的颜色声明。

**正例：**

直接写规则，不逐行叙述：

```less
.talent-card {
  color: var(--text-color-primary);
}
```

非显然的外部约束无法由结构和命名表达时，可以添加简洁中文说明：

```less
.legacy-dialog {
  /* 说明旧版 WebView 滚动回弹处理的原因。 */
  -webkit-overflow-scrolling: touch;
}
```

**反例：**

不要添加区域标签或复述相同声明的注释：

```less
/* 卡片标题样式。 */
.talent-card {
  /* 设置主要文字颜色。 */
  color: var(--text-color-primary);
}
```

注释必须说明特殊声明为何存在。移除被注释掉的代码，版本控制已经保留历史。

来源：[declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)


<a id="css-11"></a>

### CSS 11：空行与属性顺序

空行仅在真正独立的选择器组之间最多一个；禁止连续、文件首尾、块内边缘和相关声明/嵌套之间的装饰性空行。嵌套选择器位于声明之后。

属性分类顺序如下：定位与 overflow → 交互 → 尺寸（height 在 width 之前）→ margin/padding → 背景/边框/圆角/效果 → 字体/排版/颜色 → display/布局 → animation/transition → 嵌套选择器。

实际生效的 Stylelint 强制其他顺序时，遵循可执行配置并报告这个局部例外，不产出 lint 不通过的代码。


**对应示例与适用边界：**

#### 场景 2：空行只表达结构

场景：组件先有声明，之后跟随一个嵌套选择器。

**正例：**

相关内容保持相邻：

```less
.talent-card {
  overflow: hidden;
  width: 320px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

不同嵌套选择器组可以用一个空行分隔：

```less
.talent-card {
  .talent-card-header {
    display: flex;
  }

  &.talent-card-disabled {
    cursor: not-allowed;
  }
}
```

**反例：**

不要出现文件首尾、连续或块内部边缘空行：

```less

.talent-card {

  width: 320px;


  padding: 16px;

}

```

不要出于习惯，在声明组与直接相关的嵌套选择器之间加空行。空行必须传达真实结构边界。

来源：[declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)


#### 场景 3：采用声明分类顺序

场景：一个选择器使用了每个分类的属性。

**正例：**

```less
.talent-card {
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  height: 120px;
  width: 320px;
  margin: 12px 0;
  padding: 16px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-small);
  font-size: 14px;
  line-height: 20px;
  color: var(--text-color-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 160ms ease;
  .talent-card-title {
  }
}
```

分类顺序为：

1. 定位与 overflow。
2. 交互。
3. 尺寸，height 在 width 之前。
4. margin 与 padding。
5. 背景、边框、圆角和效果。
6. 字体排版与颜色。
7. display 与布局。
8. 动画与过渡。
9. 嵌套选择器。

此例展示排列顺序，不代表必须包含全部声明。对结果无作用的属性应省略。生效的 Stylelint 强制其他顺序时，遵循可执行配置并记录局部例外，不让文件处于 lint 失败状态。

**反例：**

不要按视觉偏好重排同一组声明：

```less
.talent-card {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 160ms ease;
  color: var(--text-color-primary);
  font-size: 14px;
  line-height: 20px;
  box-shadow: var(--shadow-small);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
  padding: 16px;
  margin: 12px 0;
  width: 320px;
  height: 120px;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  .talent-card-title {
  }
}
```

来源：[declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)


<a id="css-12"></a>

### CSS 12：合并、兼容与定向格式化

合并重复选择器，不按 spacing/border/layout/state 将同一块散开；同一状态下的子元素修改集中在所属状态块。实际复用才抽取模式，单纯合并不自动构成 mixin 理由。

新 API、选择器、单位和属性以真实浏览器目标及构建转换为准；不支持时使用项目认可 fallback，并验证目标与回退行为。不能把某个新选择器一概视为支持或不支持。

只格式化修改文件，以格式化前内容恢复无关区域，保留用户已有编辑；报告未触及历史格式导致的检查失败。最后核对业务根、嵌套、deep、空行、属性顺序、重复冗余和浏览器支持。


**对应示例与适用边界：**

#### 场景 4：合并重复选择器块

场景：同一子选择器为了间距、边框和布局修改被重复声明。

**正例：**

在最近有效所有者下合并：

```less
.talent-card {
  .talent-card-header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
  }
}
```

**反例：**

不要按声明分类拆散相同选择器：

```less
.talent-card-header {
  padding: 12px 16px;
}

.talent-card-header {
  border-bottom: 1px solid var(--border-color);
}

.talent-card-header {
  display: flex;
  align-items: center;
}
```

同一个业务状态的子元素变化也集中在父状态块中。只有多个真实消费者共享行为才提取抽象；单纯合并不自动构成 mixin 理由。

来源：[declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)


#### 场景 5：采用受支持的兼容回退

场景：某个简洁现代选择器能简化表单错误样式，但仓库目标浏览器可能不支持。

**正例：**

目标矩阵不支持该选择器时，由组件逻辑提供项目认可的状态类：

```less
.form-field {
  &.form-field-error {
    border-color: var(--color-danger);
  }
}
```

选择回退前：

1. 查看仓库 Browserslist 或已有目标矩阵文档。
2. 确认配置的 PostCSS 或构建工具是否转换该特性。
3. 优先沿用项目现有模式，不另造兼容层。
4. 在受影响目标中验证支持路径和回退行为。

**反例：**

不要仅因熟悉语法，就为相同错误状态使用现代选择器：

```less
.form-field:has(.form-field-error-message) {
  border-color: var(--color-danger);
}
```

状态类回退只是示例，不代表 has 选择器一律不受支持；由仓库真实目标决定。

来源：[declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)


#### 场景 6：只格式化修改的样式文件

场景：任务修改 src/components/talent-card/index.less，而其他无关样式已存在格式差异。

**正例：**

仓库配置的 formatter 只处理修改文件，不格式化整个样式目录，以免覆盖无关用户编辑并掩盖功能差异。

```text
prettier --write src/components/talent-card/index.less
```

保留格式化前内容，依据该版本恢复影响范围之外的纯格式变化，保留已有用户编辑，不重置到 HEAD。保留新语法必需的格式调整。整文件检查仍只因未修改历史格式失败时，应报告限制，不静默扩大范围。

格式化后，复核通用 formatter 无法强制的规则：

- 业务根归属与最近有效所有者嵌套。
- deep 合并正确。
- 空行有实际意义。
- 声明分类顺序符合要求。
- 重复选择器块与冗余声明已处理。
- 目标浏览器兼容性。

格式化成功确认语法和配置格式，不代表架构合规。

**反例：**

不要把相同格式化任务扩大到所有样式文件：

```text
prettier --write "src/**/*.less"
```

来源：[declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)


## 五、本轮修改边界与审阅注意项

| 审阅项 | 当前实际状态 |
| --- | --- |
| Vue 模板业务逻辑移出要求 | 本轮已删除对应要求、示例及检查项 |
| Vue DOM 嵌套 | 本轮改为以尽可能少的节点和嵌套实现功能，非必要不增加无意义 DOM |
| TS API、HTTP 与 UI 编排专门规则 | 本轮已删除原第 10 条及对应重复约束、对照示例和检查项；源码目录归属规则仍保留 |
| Vue 的 v-for 专门要求 | 当前入口和 template 引用均未保留该专门要求；不应按历史报告继续执行 |
| Vue 组件/composable 拆分专门条目 | 已删除；目录形式和每个 Vue 文件最多 1000 行仍保留。TS 自己的抽象/冗余规则仍保留 |
| Vue 状态选择、生命周期清理与页面架构专门条目 | 已删除，独立 application-architecture 引用已移除；Vue 的 watcher/生命周期注释要求、TS 的源码分层和 CSS 的目标归属是另行保留的规则 |
| 组件实例类型 | 有外部消费者需要时，从组件公开入口导出 DrawerInstance 等命名实例类型；不要求所有组件无条件生成 |
| provide/inject | 所有 Vue provide/inject 场景必须采用固定完整示例结构，包括直接父子和应用根拥有者 |
| TS interface/type、基础类型及 unknown/any 建模条目 | 已删除；类型注释、类型导入语法、类型所属目录等其他要求仍在 |
| CSS token 解析与复用条目 | 已删除；全局 token 文件的放置归属，以及现有示例中使用 CSS 变量，并不等于恢复已删除的 token 解析规则 |
| min-width: 0 / min-height: 0 | 当前没有对应要求或示例；其他非零 min-width/min-height 示例表达不同尺寸用途 |
| TS catch.message | 是技能约定的错误契约；如需改变该约定，应单独审阅本条，不能误认为 TS 自动保证任意抛出值都有 message |
| 示例与完整项目代码 | 示例包含正反写法和省略上下文的局部片段；没有在实际 Vue 应用中编译运行。报告核对的是规则完整收录与示例保真 |

## 六、来源、补充要求与检查清单

以下按 Vue → TypeScript → CSS 顺序保留入口、引用中的补充规则和检查清单。所有场景示例、配套解释和目录/决策表已移到正文对应要求下方，原位置给出条款链接。跨多条要求的示例在相关位置重复展示。正文示例的英文说明、注释和界面文案已翻译，标识符与执行逻辑保留，没有删除原有代码块。附录中的规则原文和源文件指纹仍用于对照。

### vue-code-rules：完整入口与引用

| 顺序 | 文件 | 内容 |
| --- | --- | --- |
| 1 | [SKILL.md](D:/desktop/coding-skill/vue-code-rules/SKILL.md) | 规则入口 |
| 2 | [references/template-examples.md](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md) | 补充要求、检查清单及示例位置 |
| 3 | [references/class-binding-examples.md](D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md) | 补充要求、检查清单及示例位置 |
| 4 | [references/blank-line-examples.md](D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md) | 补充要求、检查清单及示例位置 |
| 5 | [references/script-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-structure-examples.md) | 补充要求、检查清单及示例位置 |
| 6 | [references/script-comment-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md) | 补充要求、检查清单及示例位置 |
| 7 | [references/component-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md) | 补充要求、检查清单及示例位置 |
| 8 | [references/complex-component-context-examples.md](D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md) | 补充要求、检查清单及示例位置 |

#### vue-code-rules / 1. SKILL.md

来源：[SKILL.md](D:/desktop/coding-skill/vue-code-rules/SKILL.md)

```yaml
name: vue-code-rules
description: "Apply mandatory Vue 3 SFC and component-architecture rules when editing or reviewing Vue components, composables, pages, or layouts."
```

#### Vue Code Rules

Apply every rule relevant to the Vue code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Core rules live in this entrypoint as a safety baseline; this does not make reference loading optional. References add detailed decision boundaries and review checklists, with examples only where concrete contrasts improve the decision.

In examples, `<zh: ...>` marks placeholder content for a Chinese comment. Replace the marker with concise Chinese text when the surrounding rule calls for that comment; never copy the marker into project code. Required business documentation still applies when identifiers are clear; omit only comments that add no responsibility, scope, contract, or rule information.

##### Core Rules

1. Keep present SFC blocks in `<template>`, `<script>`, `<style>` order and omit empty blocks. Use kebab-case custom tags, and self-close components without content.
2. Implement the required functionality with as few DOM nodes and nesting levels as possible. Do not add unnecessary nodes or meaningless wrappers. Add a wrapper only when existing elements cannot implement the required behavior or layout directly, and keep any necessary structure minimal. Use native interactive or semantic elements only when their behavior or document meaning applies.
3. Combine multiple class sources in one `:class` array. Do not split the same element across `class` and `:class` or build long concatenated class strings.
4. Use blank lines only between genuinely separate SFC blocks or logical regions. Never use consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
5. Keep compiler macros at `<script setup>` scope. Put macros other than `defineExpose` immediately after imports and before runtime logic. Put `defineExpose` last unless top-level `await` requires exposed bindings to be initialized and exposed before the first await.
6. Verify Vite auto-import configuration before adding Vue or Vue Router imports. Omit an explicit import only when the exact runtime API is covered by active configuration.
7. Document major business state and computed values, actions and event handlers, prop/event/model/slot contracts, business watchers, lifecycle work, and key interaction or transformation stages with concise Chinese comments even when their names are clear. Put watcher and lifecycle responsibility comments above the containing call, and explain distinct internal rules above their own cohesive blocks. Document contract members instead of adding generic compiler-macro declaration comments. In multi-region templates, annotate major business regions and significant rendering or interaction rules without labeling every node. Naming, simple syntax, or a compatibility comment elsewhere does not replace this coverage.
8. Use kebab-case component files, directories, and tags. First-level pages and components use directory form with `index.vue` and `index.ts`; only simple private children may remain single files. A private child that requires an extracted stylesheet is no longer a simple single-file child and must use directory form. Keep each `.vue` file at or below 1000 lines. When another component needs the instance type, export a named instance type from the component public entry, such as `export type DrawerInstance = InstanceType<typeof Drawer>`.
9. Every scenario involving Vue `provide` or `inject` must follow the fixed context pattern in [Provide/Inject Context Pattern](D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md), regardless of subtree depth or how many values are shared. Use an owner-scoped `use**Context` facade returning exactly `provide()` and `inject()`. Create state inside `provide()`, provide and return the same complete context object, and make `inject()` return an exactly matching safe fallback. The complete example defines the required implementation structure, not an optional illustration.

##### Required Reference Loading

Loading this entrypoint is not the complete workflow. After the initial repository inspection and before making implementation or review judgments, map every affected concern to the list below and read each matching reference in full. Every task covered by this skill must open at least one reference. When no route seems to match, read the closest reference instead of proceeding with only this entrypoint. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background.

- Read [Template Examples](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md) when deciding SFC block order, component tags, slots, DOM depth, or semantic elements.
- Read [Class Binding Examples](D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md) when an element combines static, reusable, or conditional class sources.
- Read [Blank Line Examples](D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md) when deciding SFC block spacing, template whitespace, or JavaScript-script whitespace. TypeScript-script whitespace belongs to `ts-code-rules`; style-block whitespace belongs to `css-code-rules`.
- Read [Script Structure Examples](D:/desktop/coding-skill/vue-code-rules/references/script-structure-examples.md) when ordering Vue imports, compiler macros, runtime declarations, or deciding whether Vue and Vue Router APIs need explicit imports.
- Read [Script Comment Examples](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md) for business-state, contract, watcher, lifecycle, and template-region comment coverage and placement, and for the generic script baseline in JavaScript SFCs. For TypeScript SFCs, `ts-code-rules` owns the generic declaration, callback, internal-comment, and redundancy rules.
- Read [Component Structure Examples](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md) when deciding component naming, directory layout, public entries, exported instance types, or private-file organization.
- Read [Provide/Inject Context Pattern](D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md) before implementing or reviewing any Vue `provide` or `inject` scenario, including its facade, key, fallback, and consumers. Follow its complete fixed example.

##### Working Process

1. Before changing or reviewing Vue code, read the repository instructions and inspect the affected component, its nearest related components, and the relevant build, lint, formatter, and TypeScript configuration. Use that evidence for configuration-dependent decisions and to avoid unnecessary unrelated churn.

2. Complete the required reference loading before acting. When a Vue SFC contains TypeScript or style changes, load and apply `ts-code-rules` or `css-code-rules` as well; do not assume this skill replaces them.

3. Keep implementation and cleanup within the requested scope. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed Vue line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed Vue code, such as the repository's targeted formatter, lint, Vue type-check, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating formatting or visual inspection as proof of correctness.

#### vue-code-rules / 2. references/template-examples.md

来源：[references/template-examples.md](D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)

#### Template Examples

##### Mandatory Rules

1. Keep the SFC blocks that are present in strict relative order: `<template>`, then `<script>`, then `<style>`. Omit an unused block; never add an empty block solely to complete the sequence.

2. Use kebab-case custom component tags and self-close components that have no slots or child content.

3. Keep each component root and its template hierarchy aligned with the business responsibility. Use named slots for intentional extension points; do not add wrapper elements only to satisfy an abstract convention.

4. Implement the required functionality with as few DOM nodes and nesting levels as possible. Do not add unnecessary nodes or meaningless wrappers. Reuse existing elements for behavior and styling directly; add a wrapper only when the required behavior or layout cannot otherwise be achieved, and keep its structure minimal.

5. In non-interactive business layout, prefer `div` for block grouping and `span` for inline content. Use `i` only for decorative icon placeholders and mark it appropriately when accessibility tooling requires it. Use native interactive elements such as `button`, `a`, `input`, and `label` when their behavior or accessibility semantics apply. Use landmarks, headings, lists, tables, and other semantic elements only when they express real document structure, SEO meaning, data relationships, or accessibility—not merely for browser-default styling.

6. Apply the template-comment coverage in [Vue Script Comment Examples](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md): document major business regions in multi-region templates and significant rendering or interaction rules with concise Chinese HTML comments. Do not label every element, duplicate visible text, or split conditional sibling chains with annotations. Read that reference when deciding template comment coverage.

##### Scenario 1: Keep SFC Blocks in Order

本节完整示例与边界说明已放在 [Vue 1 对应要求](#vue-1) 下方。

##### Scenario 2: Use Custom Component Tags and Slots

本节完整示例与边界说明已放在 [Vue 1 对应要求](#vue-1) 下方。

##### Scenario 3: Use the Minimum Necessary DOM

本节完整示例与边界说明已放在 [Vue 2 对应要求](#vue-2) 下方。

##### Scenario 4: Choose General-Purpose, Interactive, or Semantic Elements

本节完整示例与边界说明已放在 [Vue 2 对应要求](#vue-2) 下方。

##### Review Checklist

- SFC blocks follow template, script, style order.
- Custom tags are kebab-case and empty components self-close.
- Slots represent intentional extension points.
- The required functionality uses the minimum necessary DOM nodes and nesting; no unnecessary wrapper is present.
- Interactive and semantic elements match actual behavior, structure, SEO, data relationships, or accessibility.
- Multi-region templates have useful business-region and rendering-rule comments, following the comment reference without per-node narration or broken conditional chains.

#### vue-code-rules / 3. references/class-binding-examples.md

来源：[references/class-binding-examples.md](D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md)

#### Class Binding Examples

##### Mandatory Rules

1. When an element has multiple class sources, combine them in one bound `:class` array. Put permanent class strings, reusable class values, and conditional class objects in that array, and expand it across lines when needed to prevent an unreadably long attribute. Do not split the same element's classes across `class` and `:class`, or construct a long concatenated class string. A single static class may remain in `class`, and a lone dynamic object or value does not need an array wrapper.

##### Scenario 1: Compose Multiple Classes with One Array Binding

本节完整示例与边界说明已放在 [Vue 3 对应要求](#vue-3) 下方。

##### Review Checklist

- Elements with multiple class sources use one readable `:class` array.
- Static and dynamic classes are not split across separate attributes or concatenated into long strings.

#### vue-code-rules / 4. references/blank-line-examples.md

来源：[references/blank-line-examples.md](D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md)

#### Vue Blank Line Examples

##### Ownership

This reference owns whitespace between SFC blocks, inside templates, and inside JavaScript Vue scripts. For TypeScript script blocks, `ts-code-rules` is the canonical source for statement and declaration spacing. For style blocks, `css-code-rules` is the canonical source for selector and declaration spacing.

##### Mandatory Rules

1. Keep at most one blank line between top-level SFC blocks or genuinely separate logical regions. Never use consecutive blank lines or leave a blank line at the beginning or end of an SFC block.

2. In templates, keep tightly coupled nodes together. Use one blank line only when it materially separates independent UI regions; do not separate repeated items, adjacent label/value pairs, or one component's slot declarations.

3. In JavaScript Vue scripts, do not place blank lines immediately inside a code block, between a comment and the declaration or statement it documents, or between tightly coupled statements. TypeScript scripts apply the equivalent rule from `ts-code-rules` instead of duplicating it here.

4. Style blocks apply `css-code-rules` directly. Do not infer style whitespace from template or script examples.

##### Scenario 1: Separate SFC Blocks

本节完整示例与边界说明已放在 [Vue 4 对应要求](#vue-4) 下方。

##### Scenario 2: Group Template Nodes

本节完整示例与边界说明已放在 [Vue 4 对应要求](#vue-4) 下方。

##### Scenario 3: Group JavaScript Script Logic

本节完整示例与边界说明已放在 [Vue 4 对应要求](#vue-4) 下方。

##### Review Checklist

- SFC blocks have at most one blank line between them and no leading or trailing inner blank lines.
- Template blank lines separate independent UI regions rather than tightly coupled nodes.
- Justified JavaScript comments touch what they document, and logical groups use at most one blank line.
- TypeScript-script and style-block whitespace are reviewed by their canonical language skills.

#### vue-code-rules / 5. references/script-structure-examples.md

来源：[references/script-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-structure-examples.md)

#### Script Structure Examples

##### Mandatory Rules

1. Keep every Vue compiler macro call in the script scope of `<script setup>`; never call a macro inside a function, callback, conditional, loop, or another nested block. Place every macro except `defineExpose`, including `defineOptions`, `defineProps`, `withDefaults`, `defineModel`, `defineEmits`, and `defineSlots`, in the first declaration group immediately after any required imports and before ordinary runtime state, computed values, watchers, lifecycle calls, and functions. In a script without top-level `await`, place `defineExpose` last, after all declarations and executable statements. If the script contains top-level `await`, initialize the exposed bindings and call `defineExpose` before the first top-level `await`; asynchronous initialization and its dependent statements may follow. An `await` inside a function or callback does not by itself require this placement exception.

2. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

##### Scenario 1: Order Contract Macros and Handle Async Exposure

本节完整示例与边界说明已放在 [Vue 5 对应要求](#vue-5) 下方。

##### Scenario 2: Omit Imports Covered by Vite Auto-Import

本节完整示例与边界说明已放在 [Vue 6 对应要求](#vue-6) 下方。

##### Scenario 3: Import APIs Not Covered by Auto-Import

本节完整示例与边界说明已放在 [Vue 6 对应要求](#vue-6) 下方。

##### Review Checklist

- Every compiler macro call is in `<script setup>` script scope, never inside nested control flow.
- Every macro except `defineExpose` forms the first declaration group after required imports.
- Without top-level `await`, `defineExpose` is the final statement; with top-level `await`, initialized public bindings are exposed before the first suspension.
- Vite and referenced auto-import configuration are checked before adding Vue or Vue Router imports.
- Covered APIs have no redundant explicit imports; uncovered APIs are imported normally.

#### vue-code-rules / 6. references/script-comment-examples.md

来源：[references/script-comment-examples.md](D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md)

#### Vue Script Comment Examples

##### Ownership

For `<script lang="ts">` and `<script setup lang="ts">`, `ts-code-rules` is the canonical source for generic declaration comments, function and callback comments, internal comments, redundant wrappers, intermediate values, and guards. This reference adds Vue-specific coverage and placement for contracts, reactivity, lifecycle work, compiler macros, and template regions.

For JavaScript Vue scripts, apply the same broad coverage directly: document major business state and configuration, computed values, functions, event handlers, contracts, watcher and lifecycle responsibilities, and key processing stages with concise Chinese comments. Clear names and simple syntax do not waive this business documentation. Small cohesive declaration groups may share one comment; imports, temporary locals, and mechanical callbacks need no narration. Keep one-use callbacks at their registration site unless extraction has an independent responsibility, and never preserve redundant structure merely to create a comment target.

##### Mandatory Rules

1. Apply the source-language coverage rules to runtime declarations. Document major refs, reactive records, computed values, configuration, actions, and handlers by their business role, owner, usage, source, reset timing, or dependencies as relevant. Clear English names alone do not replace these comments. Never place a generic declaration comment above a Vue compiler macro, including a variable or destructuring declaration receiving `defineProps`, `withDefaults`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, or another macro. Document business prop, event, model, exposed-action, and slot semantics on the corresponding contract members instead; the macro exception does not exempt those contracts.

2. Add a responsibility comment immediately above each business watcher, lifecycle hook, or callback registration, even for a short reload or initialization. Explain what triggers the work and what it initializes, synchronizes, invalidates, or releases. Include DOM timing, cross-state dependencies, ownership, and error contracts when relevant. Do not repeat that comment inside the callback; comment distinct internal stages or rules separately. A mechanical callback passed to map/filter needs no separate label.

3. Comment key interaction and transformation stages independently from compatibility handling. Range boundaries, selection anchors, normalization, ordering, merging, fallback, deduplication, validation, request sequencing, state commits, and important branches need concise rule or purpose comments above their smallest cohesive block, even when the statements are easy to read. A single-stage action can be covered by its responsibility comment; do not repeat it line by line or invent product reasons unsupported by the implementation.

4. In a template with multiple business regions, add concise Chinese HTML comments above major regions such as filters, results, pagination, detail, and actions. Explain significant conditional-rendering, permission, slot, or interaction rules where they occur. Keep one small single-purpose template free of redundant region labels, and do not label every DOM node or repeat visible text. Place a branch-group comment above the initial `v-if`; keep `v-if`/`v-else-if`/`v-else` chains contiguous.

##### Scenario 1: Apply the Compiler-Macro Exception

本节完整示例与边界说明已放在 [Vue 7 对应要求](#vue-7) 下方。

##### Scenario 2: Document Watcher and Lifecycle Responsibilities

本节完整示例与边界说明已放在 [Vue 7 对应要求](#vue-7) 下方。

##### Scenario 3: Document State and Computed Business Meaning

本节完整示例与边界说明已放在 [Vue 7 对应要求](#vue-7) 下方。

##### Scenario 4: Annotate Major Template Regions and Rendering Rules

本节完整示例与边界说明已放在 [Vue 7 对应要求](#vue-7) 下方。

##### Review Checklist

- TypeScript SFCs use `ts-code-rules` as the generic script-quality source; this reference supplies Vue-specific coverage, placement, and macro exceptions.
- Major business state, computed values, functions, handlers, and configuration have concise responsibility comments in both JavaScript and TypeScript SFCs.
- Compiler macros have no generic declaration labels, while business prop/event/model/slot/exposed-action contracts are documented at their members.
- Business watchers, lifecycle hooks, and callback registrations have comments above their containing call or property, including simple reload and initialization work.
- Key internal stages, interaction rules, branches, side effects, and error policy are documented without duplicating the registration comment.
- Multi-region templates document major business regions and significant rendering rules; small single-purpose templates and individual DOM nodes need no repeated labels.
- Comments preserve conditional-chain adjacency, remain attached to their target, and explain only behavior supported by code or verified contracts.

#### vue-code-rules / 7. references/component-structure-examples.md

来源：[references/component-structure-examples.md](D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)

#### Component Structure Examples

##### Mandatory Rules

Use this map for a directory-managed page or component. Omit optional directories and files until they have a real owner-specific purpose.

```text
<owner>/
|-- index.vue
|-- index.ts              Public component export
|-- index.less            Optional extracted local style
|-- component/
|   |-- simple-child.vue  Cohesive private child
|   `-- complex-child/
|       |-- index.vue
|       |-- index.ts
|       |-- component/    Child-private components
|       `-- hooks/        Child-private composables
|-- hooks/                Owner-private composables
|-- constants/            Owner-private constants
`-- type/                 Owner-private types
```

1. Use kebab-case for component files, directories, and custom tags. Use kebab-case for composable files except hooks inside `hooks/`, which use camelCase.
2. Every first-level page or component under the established page/component trees uses the directory form with `index.vue` and `index.ts`. Only a simple child inside an owner's private `component/` may use the single-file form; use a child directory when supporting files become meaningful. A stylesheet required by the mandatory extraction triggers in `css-code-rules` is a meaningful supporting file, so that private child must convert to directory form.
3. A directory-managed component's `index.ts` re-exports `index.vue` and any intentional public types. When another component needs its instance type, import the component in this entry and export a named `InstanceType<typeof Component>`, for example `export type DrawerInstance = InstanceType<typeof Drawer>`. Consumers import this type through the public entry. Keep ordinary setup and styles in the SFC; add `index.less`, hooks, constants, types, or private children only when they provide real ownership or maintenance value.
4. Keep each `.vue` file at or below 1000 lines. When moving a component or changing its directory form, update its public entry and consumers without migrating unrelated components merely to normalize structure.

##### Scenario 1: Apply Naming Conventions

本节完整示例与边界说明已放在 [Vue 8 对应要求](#vue-8) 下方。

##### Scenario 2: Choose Directory or Single-File Form

本节完整示例与边界说明已放在 [Vue 8 对应要求](#vue-8) 下方。

##### Scenario 3: Organize a Component That Needs Supporting Files

本节完整示例与边界说明已放在 [Vue 8 对应要求](#vue-8) 下方。

##### Scenario 4: Export a Component Instance Type

本节完整示例与边界说明已放在 [Vue 8 对应要求](#vue-8) 下方。

##### Review Checklist

- First-level pages, views, and shared components always use directories, even when simple.
- Only simple children inside private `component/` directories use named `.vue` files without an extra directory.
- A private child that meets a mandatory style-extraction trigger is no longer a simple single-file child and uses directory form with its sibling stylesheet.
- Every directory-managed component has `index.vue` and an `index.ts` forwarding its default component export.
- Consumers do not bypass component directory exports; cross-module import-path selection follows `ts-code-rules`, while separate styles and other supporting files remain optional.
- Names and directory entries follow the required casing.
- Instance types needed by other components are named exports from the component public entry.
- Every `.vue` file stays within 1000 lines.

#### vue-code-rules / 8. references/complex-component-context-examples.md

来源：[references/complex-component-context-examples.md](D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md)

#### Provide/Inject Context Pattern

##### Mandatory Rules

1. Every scenario involving Vue `provide` or `inject` must use this fixed pattern, regardless of subtree depth or the number of shared values. Implement an owner-scoped composable named `use**Context` as a context facade that returns exactly two methods: `provide()` for the owning component and `inject()` for descendants. Keep it in the owning page or component's `hooks/` directory, and define a module-level, business-qualified context key.

2. Create all context-owned reactive state, computed values, template refs, watchers, side effects, and actions inside `provide()`. Assemble the public values into one `context` object, pass that exact object to Vue's `provide`, and return it so the owner and descendants share the same API and instances. Do not implement `use**Context` as a module-level reactive singleton or as unrelated standalone provider and injector functions.

3. Implement `inject()` with Vue's `inject` and a complete fallback object. The fallback must have exactly the same public fields as the provided `context`, with safe empty refs and no-op functions of the correct types; never omit a provided field, add an inject-only field, or use unsafe partial casting to conceal a mismatch.

4. Call `use**Context().provide()` once per owning component instance and `use**Context().inject()` in descendants. The owner may be a direct parent, a page, or the application root; each scenario uses the same fixed pattern. Descendants consuming that context must not recreate its provider.

The complete example below is the fixed implementation pattern for every Vue provide/inject scenario, not one of several optional approaches. Keep its facade, state-creation location, exact context object, typed key, and complete fallback structure; replace the workbench business names, fields, and actions with the actual contract. A direct parent-child provide/inject exchange follows the same pattern.

##### Fixed Implementation Example

本节完整示例与边界说明已放在 [Vue 9 对应要求](#vue-9) 下方。

##### Owner and Descendant Usage

本节完整示例与边界说明已放在 [Vue 9 对应要求](#vue-9) 下方。

##### Review Checklist

- Every Vue provide/inject scenario follows the complete fixed implementation and usage example.
- The facade returns exactly `provide()` and `inject()`.
- The key is module-level, business-qualified, and typed.
- All owned state, computed values, refs, watchers, effects, and actions start inside `provide()`.
- The provided object and owner return value are the same instance.
- The fallback has exactly the public context fields with safe compatible values.
- One owner provides once; descendants inject.
- The context never escapes its intended component subtree.

### ts-code-rules：完整入口与引用

| 顺序 | 文件 | 内容 |
| --- | --- | --- |
| 1 | [SKILL.md](D:/desktop/coding-skill/ts-code-rules/SKILL.md) | 规则入口 |
| 2 | [references/code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md) | 补充要求、检查清单及示例位置 |
| 3 | [references/imports-and-types.md](D:/desktop/coding-skill/ts-code-rules/references/imports-and-types.md) | 补充要求、检查清单及示例位置 |
| 4 | [references/application-architecture.md](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md) | 补充要求、检查清单及示例位置 |
| 5 | [references/async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md) | 补充要求、检查清单及示例位置 |

#### ts-code-rules / 1. SKILL.md

来源：[SKILL.md](D:/desktop/coding-skill/ts-code-rules/SKILL.md)

```yaml
name: ts-code-rules
description: "Apply mandatory TypeScript rules when editing or reviewing TypeScript, TSX, or TypeScript inside Vue SFCs."
```

#### TypeScript Code Rules

Apply every rule relevant to the TypeScript or TSX created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched code solely to normalize it; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Core rules live in this entrypoint as a safety baseline; this does not make reference loading optional. References add detailed decision boundaries and review checklists, with examples only where concrete contrasts improve the decision.

In examples, `<zh: ...>` marks placeholder content for a Chinese comment. Replace the marker with concise Chinese text when the surrounding rule calls for that comment; never copy the marker into project code. Required business documentation still applies when identifiers are clear; omit only comments that add no responsibility, scope, contract, or rule information.

##### Core Rules

1. Keep changes limited to the requested feature or defect. Preserve existing comments and avoid unrelated reformatting, renaming, import reordering, or cleanup.
2. Keep simple one-off logic inline. Extract only for real complexity, reuse, or a clear responsibility boundary. Remove change-owned dead code, redundant wrappers, aliases, intermediates, and guards that add no correctness or meaning.
3. Use Chinese comments as normal business documentation, not only as a last resort for obscure code. Document major state, configuration and constants, business functions and methods, composables, event handlers, domain types and important contract fields, and each key processing stage or business branch. Explain responsibility and scope at declarations, then rules, sequencing, transformations, state commits, side effects, and error policy at the smallest cohesive internal block. Clear English names or simple syntax do not waive this coverage. Small related declarations may share one comment; imports, disposable local values, obvious accessors, and mechanical callbacks need no narration. Keep comments concise and adjacent, and never invent undocumented product reasons.
4. Use blank lines only to separate genuinely distinct logical regions. Never use consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
5. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules. Prefer standard imports when type-only usage is safely erased; use separate `import type` only when verified tooling or runtime contracts require it, and never use inline `type` modifiers.
6. Import other modules through configured aliases and public entries. Place application bootstrap, API, constant, service, state, ambient type, and shared utility modules in their established source layers. Keep private types and stateless helpers with their actual owner; promote them only after real reuse crosses that boundary, then expose them through the established public entry.
7. Prefer `await` for ordinary sequential flow, and use `Promise.all` only when operations are independent and their combined failure semantics are intended. Catch only where the error can be recovered, translated, enriched, or reported. Never discard a Promise with unary `void`; intentional fire-and-forget work must handle or report its own rejection. Set operation-owned loading before the request and restore it through `finally`.
8. Read `error.message` directly for caught errors. Do not add narrowing or fallback branches around the guaranteed `message` property.
9. Verify new runtime APIs against the actual TypeScript target, runtime versions, Browserslist, and polyfill strategy. Transpilation does not provide missing runtime APIs.
10. Format only changed files, restore unrelated formatter churn, preserve pre-existing user edits, and re-check the final diff against these rules.

##### Required Reference Loading

Loading this entrypoint is not the complete workflow. After the initial repository inspection and before making implementation or review judgments, map every affected concern to the list below and read each matching reference in full. Every task covered by this skill must open at least one reference. When no route seems to match, read the closest reference instead of proceeding with only this entrypoint. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background.

- Read [Code Quality Examples](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md) when deciding change scope, abstraction, cleanup, declaration comments, callback comments, internal comments, redundant wrappers, or blank lines.
- Read [Imports and Public Entry Rules](D:/desktop/coding-skill/ts-code-rules/references/imports-and-types.md) when adding, removing, grouping, or relocating imports, choosing type-import syntax, or selecting cross-module import paths and public entries.
- Read [TypeScript Application Architecture](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md) when placing application bootstrap code, API modules, constants, services, stores, ambient or shared types, stateless utilities, or owner-private source-layer directories.
- Read [Async and Compatibility Examples](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md) when handling promises, dependent or parallel work, loading state, errors, cancellation, fire-and-forget contracts, newer APIs, target support, or final formatting checks.

##### Working Process

1. Before changing or reviewing TypeScript, read the repository instructions and inspect the affected module, its public callers, nearby types, and the relevant `tsconfig`, package scripts, lint, formatter, and test configuration. Confirm the actual runtime and browser targets before making compatibility decisions.

2. Complete the required reference loading before acting. For TypeScript inside a Vue SFC, also apply `vue-code-rules`; when the same change touches a Vue style block, apply `css-code-rules` as well.

3. Preserve public contracts and behavior outside the requested change. Do not copy a local violation into new or changed code merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception.

4. After the change, inspect every changed TypeScript line against each applicable numbered rule and its reference checklist. Run the smallest available checks that exercise the changed code, such as the repository's targeted formatter, TypeScript check, lint, and affected tests. Avoid commands that rewrite unrelated files. If a rule or check cannot be satisfied, report it explicitly instead of treating compilation or formatting alone as proof of correctness.

#### ts-code-rules / 2. references/code-quality-examples.md

来源：[references/code-quality-examples.md](D:/desktop/coding-skill/ts-code-rules/references/code-quality-examples.md)

#### Code Quality Examples

##### Mandatory Rules

1. Keep changes limited to the requested feature or defect. Preserve existing comments and do not reformat, rename, reorder imports, or rewrite unrelated code as drive-by cleanup.

2. Avoid unnecessary abstraction. Keep simple one-off logic inline; extract a function, class, or composable only for real complexity, reuse, or a clear responsibility boundary.

3. Remove unused imports, variables, functions, types, temporary debugging code, obsolete comments, redundant aliases, and pass-through wrappers when they belong to the current change.

4. Add a Chinese responsibility comment above major runtime declarations: business state, reactive records, refs, computed values, persistent class fields, business configuration, thresholds, mappings, and other values that define the module's behavior. Explain what the value controls, its scope or source, and relevant units, defaults, reset timing, or dependencies. Clear names do not exempt these declarations. One comment may cover a small contiguous group with one responsibility; do not add comments to every destructured result, loop variable, or short-lived intermediate. Use another language only when the project explicitly requires it or exact external terminology needs it. In a Vue SFC, follow the compiler-macro placement rules in `vue-code-rules`.

5. Add a Chinese responsibility comment above business functions, service methods, composables, and event handlers, including conventionally named load/save/submit/reset handlers. Describe the business action and its result or affected state; include parameter meaning, return meaning, sequencing, side effects, and failure ownership where relevant. Use JSDoc when callers benefit from a public contract, without repeating parameter types already expressed by TypeScript. Business callback registrations follow the same coverage; mechanical map/filter callbacks, obvious getters, and trivial language-level helpers may remain uncommented. Keep one-use callbacks inline and comment their containing registration rather than extracting a function only to create a comment target.

6. Inside a function or method, comment each meaningful business stage and important branch: validation and early exits, payload construction and conversion, request sequencing, response merging and state commits, interaction boundaries, fallback/retry/deduplication rules, side effects, and recovery or cleanup. Explain the stage's purpose, rule, or expected outcome even when the statements are easy to read. A function-level responsibility comment does not replace distinct internal rules, but a single-stage function does not need the same explanation twice. Group cohesive statements under one comment; do not narrate every assignment, call, or return. Derive reasons from code and verified contracts rather than inventing product requirements.

7. Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

8. Do not leave meaningless blank lines in TypeScript or TSX. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside an opening or closing code block, blank lines between a comment and the declaration or statement it documents, or blank lines between tightly coupled imports, declarations, statements, object members, JSX nodes, or type members. Keep at most one intentional blank line between genuinely separate logical groups and remove every blank line that does not improve structural readability.

9. Document domain interfaces, type aliases, enums, and exported contracts with a concise Chinese comment describing their business role. Document important fields or members with units, source, allowed states, optional/null meaning, or consumer expectations where applicable. Do not exempt type-only declarations categorically. Mechanical utility types, generated/vendor declarations, and ordinary fields such as an unambiguous `id` or `name` need no repeated labels. Keep field documentation next to the field instead of duplicating it at each parameter or use site.

These rules describe the required coverage in code created or changed for the task. Naming and structure complement the comments; they are not a blanket exemption. Focused examples below omit unrelated module context and do not waive coverage elsewhere. Keep directly affected comments accurate, without expanding an ordinary feature change into repository-wide annotation work.

##### Scenario 1: Keep the Change Scoped

本节完整示例与边界说明已放在 [TS 1 对应要求](#ts-1) 下方。

##### Scenario 2: Avoid a One-Off Abstraction

本节完整示例与边界说明已放在 [TS 2 对应要求](#ts-2) 下方。

##### Scenario 3: Remove Only Change-Owned Dead Code

本节完整示例与边界说明已放在 [TS 2 对应要求](#ts-2) 下方。

##### Scenario 4: Document Business State and Domain Contracts

本节完整示例与边界说明已放在 [TS 3 对应要求](#ts-3) 下方。

##### Scenario 5: Document Business Functions and Event Handlers

本节完整示例与边界说明已放在 [TS 3 对应要求](#ts-3) 下方。

##### Scenario 6: Document Business Stages and Important Branches

本节完整示例与边界说明已放在 [TS 3 对应要求](#ts-3) 下方。

##### Scenario 7: Use Blank Lines for Logical Regions

本节完整示例与边界说明已放在 [TS 4 对应要求](#ts-4) 下方。

##### Scenario 8: Remove Redundant Wrappers, Intermediates, and Guards

本节完整示例与边界说明已放在 [TS 2 对应要求](#ts-2) 下方。

##### Review Checklist

- The diff contains only requested behavior and directly affected cleanup.
- Abstractions represent reuse, complexity, or responsibility.
- Change-owned dead code and debugging artifacts are removed.
- Major business state, configuration, constants, computed values, functions, methods, composables, and handlers have responsibility comments even when their English names are clear.
- Domain types and important contract members document their role, units, states, defaults, or optional/null semantics without repeating obvious field labels.
- Key validation, conversion, request, state-commit, branch, side-effect, recovery, and cleanup stages have concise comments; a declaration comment or compatibility note does not replace distinct internal rules.
- Comments are concise, adjacent, written in Chinese unless a defined exception applies, and supported by code or verified contracts.
- Shared group comments and single-stage responsibility comments avoid duplication; imports, temporary variables, and mechanical callbacks receive no statement-by-statement narration.
- No comment is used to justify a pass-through wrapper, meaningless intermediate variable, or redundant guard.
- One-use callbacks that merely continue their owner workflow remain at the registration site, and private call paths do not repeat caller-guaranteed preconditions.
- Every blank line marks a real logical boundary.

#### ts-code-rules / 3. references/imports-and-types.md

来源：[references/imports-and-types.md](D:/desktop/coding-skill/ts-code-rules/references/imports-and-types.md)

#### Imports and Public Entry Rules

##### Mandatory Rules

1. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules when applicable. Within the type group, place module-local types before shared types.
2. Prefer standard imports when the compiler and bundler safely erase type-only usage. Use a separate `import type` only when required by the verified compiler, lint, bundler, or package runtime contract; never use inline `type` modifiers.
3. Import another module through its configured alias and public entry. Do not climb two or more parent directories or reach into another module's private files.

##### Scenario 1: Group Imports and Choose Type Syntax from Configuration

本节完整示例与边界说明已放在 [TS 5 对应要求](#ts-5) 下方。

##### Scenario 2: Use Public Entries across Module Boundaries

本节完整示例与边界说明已放在 [TS 6 对应要求](#ts-6) 下方。

##### Review Checklist

- Runtime, type, internal, and UI imports follow the required grouping.
- Type-only imports match the verified compiler, lint, bundler, and runtime contract.
- Cross-module imports use configured aliases and public entries.

#### ts-code-rules / 4. references/application-architecture.md

来源：[references/application-architecture.md](D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md)

#### TypeScript Application Architecture

This reference is a placement decision map, not a directory-generation template. Use the repository's established equivalents, and create a directory only when it has a real responsibility. Directory responsibilities are presented as a source map and placement decision table.

##### Application Source Map

本节完整示例与边界说明已放在 [TS 6 对应要求](#ts-6) 下方。

##### Mandatory Rules

本节完整示例与边界说明已放在 [TS 6 对应要求](#ts-6) 下方。

##### Placement Decisions

本节完整示例与边界说明已放在 [TS 6 对应要求](#ts-6) 下方。

##### Public Entries

本节完整示例与边界说明已放在 [TS 6 对应要求](#ts-6) 下方。

##### Review Checklist

- Existing source-layer names and responsibilities are preserved rather than duplicated.
- Bootstrap, routing, application state, and stateless utility modules remain in their established source layers.
- Private constants, types, helpers, and composables stay with their nearest owner until real cross-owner reuse exists.
- `src/type` and `src/utils` are focused layers rather than catch-all directories.
- Optional directories are created only for real contents and are not added as placeholders.
- Cross-owner consumers use configured aliases and established public entries.

#### ts-code-rules / 5. references/async-and-compatibility-examples.md

来源：[references/async-and-compatibility-examples.md](D:/desktop/coding-skill/ts-code-rules/references/async-and-compatibility-examples.md)

#### Async and Compatibility Examples

##### Mandatory Rules

1. Prefer `await` to `.then()` for ordinary sequential flow. Use `try/catch` only at the layer that can recover, translate, enrich, or report the error; otherwise let the rejection propagate. Do not discard a Promise with unary `void`. Await it when completion matters; for an intentional fire-and-forget boundary, ensure the operation handles or explicitly reports its own rejection.

2. Every `error` value caught by `catch` is guaranteed to have a `message` property. Read `error.message` directly; do not narrow it with `error instanceof Error`, `typeof`, or fallback branches such as `error instanceof Error ? error.message : 'Error'`.

3. Use APIs supported by the repository's actual TypeScript target, runtime versions, Browserslist, and polyfill strategy. Before introducing an API outside that verified baseline, confirm support in every target environment or use a project-approved fallback or polyfill. Do not assume transpilation supplies runtime APIs.

4. Use the repository's configured Prettier formatter only on files changed for the task. Compare its output with the pre-format state and restore formatting-only changes outside the task's affected regions, preserving pre-existing user edits. Keep formatting adjustments necessary for the changed syntax. If a whole-file formatter check still fails solely on untouched formatting, report that limitation instead of broadening the edit silently. Re-check the final diff against these rules and the established local convention.

5. Keep dependent operations sequential. Use `Promise.all` only when operations are independent, may start together, and should share one failure boundary. Set operation-owned loading before work begins and restore it in `finally`; commit related state together after the required data has arrived so consumers do not observe a partial update.

##### Scenario 1: Await and Handle an API Call

本节完整示例与边界说明已放在 [TS 7 对应要求](#ts-7) 下方。

##### Scenario 2: Avoid Discarding a Promise

本节完整示例与边界说明已放在 [TS 7 对应要求](#ts-7) 下方。

##### Scenario 3: Check API Support Against the Configured Baseline

本节完整示例与边界说明已放在 [TS 9 对应要求](#ts-9) 下方。

##### Scenario 4: Format Only Changed Files

本节完整示例与边界说明已放在 [TS 10 对应要求](#ts-10) 下方。

##### Scenario 5: Choose Sequential or Parallel Work from Dependencies

本节完整示例与边界说明已放在 [TS 7 对应要求](#ts-7) 下方。

##### Scenario 6: Restore Loading and Commit Related State Together

本节完整示例与边界说明已放在 [TS 7 对应要求](#ts-7)、[TS 8 对应要求](#ts-8) 下方。

##### Review Checklist

- Ordinary asynchronous flow uses `await`.
- Dependent work remains sequential; parallel work is genuinely independent and has an intentional shared failure boundary.
- Errors are handled at the layer that owns recovery, reporting, or translation.
- No promise is discarded with unary `void`; an intentional fire-and-forget boundary owns its rejection path.
- Fire-and-forget operations own their rejection path.
- Operation-owned loading is restored through `finally`, and related state does not expose accidental partial updates.
- Newer APIs match actual runtime targets or approved polyfills.
- Only changed files are formatted; unrelated formatter changes are restored without losing user edits, and legacy formatting failures are reported.

### css-code-rules：完整入口与引用

| 顺序 | 文件 | 内容 |
| --- | --- | --- |
| 1 | [SKILL.md](D:/desktop/coding-skill/css-code-rules/SKILL.md) | 规则入口 |
| 2 | [references/scope-and-file-organization-examples.md](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md) | 补充要求、检查清单及示例位置 |
| 3 | [references/naming-examples.md](D:/desktop/coding-skill/css-code-rules/references/naming-examples.md) | 补充要求、检查清单及示例位置 |
| 4 | [references/nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md) | 补充要求、检查清单及示例位置 |
| 5 | [references/design-and-layout-examples.md](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md) | 补充要求、检查清单及示例位置 |
| 6 | [references/reuse-and-redundancy-examples.md](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md) | 补充要求、检查清单及示例位置 |
| 7 | [references/declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md) | 补充要求、检查清单及示例位置 |

#### css-code-rules / 1. SKILL.md

来源：[SKILL.md](D:/desktop/coding-skill/css-code-rules/SKILL.md)

```yaml
name: css-code-rules
description: "Apply mandatory stylesheet rules when editing or reviewing CSS, Less, Sass, SCSS, or Vue style blocks."
```

#### CSS Code Rules

Apply every rule relevant to the CSS, Less, Sass, SCSS, or Vue style code created, changed, or reviewed by the task. These are requirements, not suggestions inferred from nearby code. Existing code is context rather than a waiver. Do not migrate untouched styles solely to normalize them; fix an existing violation when it is in the changed lines, is necessary for the requested behavior, or prevents the changed code from complying.

Higher-priority instructions override this skill. Repository configuration or conventions override a rule only where that rule explicitly delegates the decision to project configuration. If a mandatory rule cannot be followed, make the smallest necessary deviation and report the exact conflict instead of silently skipping it.

Core rules live in this entrypoint as a safety baseline; this does not make reference loading optional. References add detailed decision boundaries and review checklists, with examples only where concrete contrasts improve the decision.

In examples, `<zh: ...>` marks required Chinese comment content. Replace the marker with a concise Chinese comment expressing the enclosed meaning; never copy the marker into project code.

##### Core Rules

1. Preserve the repository's stylesheet language. Use `<style lang="less" scoped>` for new Vue component styles only where the project uses the expected Less setup; otherwise preserve the configured language and scoping mechanism.
2. Keep component styles with their owner and ordinary Vue styles scoped. Extract the entire inline style block into one sibling stylesheet when it reaches 80 non-blank lines, or when it has at least four owned selector groups plus any two of these complexity signals: nesting three or more levels deep, three or more state/pseudo-class branches, `:deep(...)` or third-party overrides, keyframes or complex animation, or responsive/supports/container at-rules. These are mandatory extraction triggers, not review suggestions; shorter styles may also be extracted when template coupling or maintenance difficulty justifies it. Never split by visual region. Keep application-wide resets, tokens, utilities, and global library overrides in the established global style area.
3. Give each component a meaningful business root and keep owned selectors beneath it. Use the project's single-hyphen BEM-like naming, short unambiguous complete names, and consistent comprehensible abbreviations only when necessary. Teleported content may have a separate fully qualified root.
4. In nesting-capable styles, place descendants beneath their nearest meaningful owner, use `& >` only for a stable direct-child contract, and keep pseudo-classes and business states with their owner. Do not flatten component children or begin a nested selector with bare `>`.
5. In scoped nesting-capable styles, target deep selectors with `&:deep(...)` and consolidate rules under the nearest shared library-owned parent. In plain CSS without verified nesting support, use equivalent expanded selectors while preserving the business root and library ownership path.
6. Prefer Flexbox plus `gap`; use Grid only for a genuinely two-dimensional requirement Flexbox cannot express. Apply `flex: 1`, `flex-shrink: 0`, and `overflow: hidden` only where their layout roles require them.
7. Preserve target ownership and the configured unit strategy. Do not bypass separate mobile/PC trees with component-local media-query forks, and do not hand-convert ordinary project values when configured tooling owns that conversion.
8. Prefer documented library custom properties and ordinary scoped selectors over specificity escalation or `!important`.
9. Do not repeat global reset behavior or ineffective declarations. Extract mixins, variables, utilities, or loops only after genuine repeated patterns exist.
10. Avoid routine style comments. Add only a concise Chinese comment for a non-obvious compatibility workaround, external-library constraint, or temporary exception that structure cannot express.
11. Use blank lines only between genuinely distinct selector groups. Order declarations by positioning and overflow; interaction; dimensions; spacing; visuals; typography; layout; animation. Put nested selectors after declarations unless active Stylelint configuration requires another order.
12. Consolidate duplicate selector blocks, verify newer CSS features against actual browser targets, format only changed style files, restore unrelated churn, and re-check the final diff.

##### Required Reference Loading

Loading this entrypoint is not the complete workflow. After the initial repository inspection and before making implementation or review judgments, map every affected concern to the list below and read each matching reference in full. Every task covered by this skill must open at least one reference. When no route seems to match, read the closest reference instead of proceeding with only this entrypoint. Do not merely mention or summarize a reference without opening it. When uncertain whether a reference applies, read it. References are authoritative requirements, not optional background.

- Read [Scope and File Organization Examples](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md) when deciding stylesheet language, Vue scope, extraction layout, ownership, or override placement.
- Read [Naming Examples](D:/desktop/coding-skill/css-code-rules/references/naming-examples.md) when deciding business roots, BEM names, abbreviations, or teleported-root names.
- Read [Nesting and Deep Selector Examples](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md) when deciding ownership nesting, direct-child boundaries, deep selectors, pseudo-classes, or business states.
- Read [Design and Layout Examples](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md) when deciding layout choice, target-specific presentation, units, or library customization.
- Read [Reuse and Redundancy Examples](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md) when removing ineffective declarations or extracting reusable variables, mixins, utilities, or loops.
- Read [Declaration and Compatibility Examples](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md) when deciding comments, blank lines, declaration order, consolidation, browser support, fallbacks, or final formatting checks.

##### Working Process

1. Before changing or reviewing styles, read the repository instructions and inspect the affected markup, owning component, neighboring styles, global resets, preprocessors, PostCSS setup, target-browser configuration, and formatter or lint scripts. Base layout and compatibility decisions on the rendered ownership structure and actual project configuration.

2. Complete the required reference loading before acting. For a Vue style block, also apply `vue-code-rules`; if the same SFC change touches TypeScript, apply `ts-code-rules` as well.

3. Keep selectors, overrides, extraction, and cleanup within the requested ownership boundary. Do not copy a local violation into new or changed styles merely to preserve visual consistency. When an explicit higher-priority instruction conflicts, follow it and document the smallest necessary exception; do not use a style task to restructure unrelated markup or global styling.

4. After the change, inspect every changed style line against each applicable numbered rule and its reference checklist. Count inline non-blank style lines and record the applicable complexity signals; if a mandatory extraction trigger is met, extraction is part of the change rather than optional cleanup. Verify affected visual states when a preview or existing visual test is available. Run the smallest available targeted formatter, style lint, build, or affected test commands without rewriting unrelated files. If a rule, visual check, or automated check cannot be satisfied, report it explicitly instead of inferring correctness from valid syntax alone.

#### css-code-rules / 2. references/scope-and-file-organization-examples.md

来源：[references/scope-and-file-organization-examples.md](D:/desktop/coding-skill/css-code-rules/references/scope-and-file-organization-examples.md)

#### Scope and File Organization Examples

##### Mandatory Rules

1. Preserve the project's chosen stylesheet language. Do not migrate CSS, Less, Sass, or SCSS merely for consistency. In the user's Vue projects, use Less for newly created component styles unless the target repository deliberately uses another solution.

2. Scope ordinary Vue component styles. In a Less-based project, use `<style lang="less" scoped>` in that attribute order. In a repository deliberately using CSS, Sass, SCSS, CSS Modules, or another configured solution, preserve that language or mechanism and its valid syntax. Use an unscoped style block only for true global rules or content rendered outside the component root.

3. Keep a component's extracted styles beside its entry point. Use the repository's matching extension, such as `index.less` beside `index.vue`, for one style file; introduce a `style/` directory only when scoped and unscoped styles genuinely must be isolated. Extract the whole inline component style block when either mandatory trigger applies:

   - The block contains at least 80 non-blank lines, including selector, declaration, brace, at-rule, and comment lines.
   - The block contains at least four owned selector groups and at least two complexity signals: nesting three or more levels deep; three or more state, modifier, or pseudo-class branches; `:deep(...)` or third-party overrides; keyframes or complex animation; responsive, `@supports`, or container-query branches.

   Count one owned selector group for each block that owns a distinct descendant, component modifier or state, pseudo branch, deep override, or at-rule branch; a comma-separated selector list is one group. These thresholds are enforceable upper bounds for inline styles, not subjective review hints. Extract shorter styles as well when close coupling with a large template or another concrete maintenance problem justifies it. Move the whole owned stylesheet to the sibling file and include it through the component's scoped style block; do not split the file by visual region. When a named private child must gain a sibling stylesheet, convert it from `component/child-name.vue` to the directory-managed `component/child-name/index.vue`, `index.ts`, and matching `index.<ext>` form required by `vue-code-rules`.

4. Keep all styles for one component in one stylesheet. Do not split files by visual region or feature. Separate stylesheets are justified only when CSS scope itself requires it.

5. Keep application-wide resets, theme tokens, library overrides, and utilities in the repository's established `src/styles` files. Keep a component-specific Element Plus or Vant override within the owning component's root through `:deep`.

Read the scenario that matches the current change. Each scenario explains the ownership decision, shows the preferred result, and identifies the failure mode to avoid.

##### Scenario 1: Preserve the Existing Stylesheet Language

本节完整示例与边界说明已放在 [CSS 1 对应要求](#css-1) 下方。

##### Scenario 2: Choose Scoped or Unscoped Vue Styles

本节完整示例与边界说明已放在 [CSS 1 对应要求](#css-1) 下方。

##### Scenario 3: Extract a Complex Component Style

本节完整示例与边界说明已放在 [CSS 2 对应要求](#css-2) 下方。

##### Scenario 4: Place Global and Component-Owned Rules

本节完整示例与边界说明已放在 [CSS 2 对应要求](#css-2) 下方。

##### Review Checklist

- The stylesheet language and Vue style mechanism match verified repository usage.
- Ordinary component styles remain scoped.
- Teleported or global rules have a collision-resistant business root.
- Inline styles are extracted whenever either mandatory line-count or structural-complexity trigger is met; shorter styles are extracted only for a concrete maintenance or readability reason.
- A private single-file child that needs an extracted stylesheet is converted to directory form with `index.vue`, `index.ts`, and the sibling style file.
- A single extracted component stylesheet stays beside its entry point.
- Multiple component stylesheets are split only by scope.
- Global assets and component-owned library overrides live with their actual owners.

#### css-code-rules / 3. references/naming-examples.md

来源：[references/naming-examples.md](D:/desktop/coding-skill/css-code-rules/references/naming-examples.md)

#### Naming Examples

##### Mandatory Rules

1. Give every component a meaningful business root class and keep all of its owned selectors beneath that root. Teleported content may use a separate fully qualified business root because it is rendered outside the component tree.
2. Follow the project's single-hyphen BEM-like convention: write complete names in the form `block-element-modifier`, using one hyphen as the separator and never `__` or `--` in project-owned class names. Because the same delimiter also appears inside multiword business terms, choose the shortest unambiguous complete name and rely on the owning selector hierarchy—not punctuation alone—to communicate the relationship. Library-owned selectors retain their library naming.
3. Describe a component, element, state, or business meaning in every class. Avoid ambiguous names and arbitrary suffix chains.
4. Prohibit overly long class names. First remove redundant ownership words, duplicated business terms, visual descriptions, and unnecessary suffixes while retaining enough meaning to identify the component, element, or state. Do not preserve a verbose name merely because it mirrors every DOM ancestor.
5. When a class name cannot be kept reasonably short after removing redundant wording, shorten repeated business segments with consistent, comprehensible character abbreviations. Prefer abbreviations already established by the repository or feature glossary, and use the same abbreviation for the same term throughout the ownership subtree. Never create ambiguous, opaque, concatenated, or arbitrary letter sequences merely to reduce character count.

Use these scenarios to choose business-qualified component, element, state, and teleported-root names.

##### Scenario 1: Name a Component Root, Elements, and States

本节完整示例与边界说明已放在 [CSS 3 对应要求](#css-3) 下方。

##### Scenario 2: Prevent Overlong Names and Apply Character Abbreviations

本节完整示例与边界说明已放在 [CSS 3 对应要求](#css-3) 下方。

##### Scenario 3: Name a Teleported Root

本节完整示例与边界说明已放在 [CSS 3 对应要求](#css-3) 下方。

##### Review Checklist

- Every top-level component selector names a business root or justified teleported root.
- Project-owned classes use complete single-hyphen BEM names.
- Names describe meaning rather than color, position, or incidental markup.
- Overlong names are simplified before abbreviations are introduced.
- Unavoidable long names use consistent, recognizable character abbreviations rather than opaque letter strings.

#### css-code-rules / 4. references/nesting-and-deep-examples.md

来源：[references/nesting-and-deep-examples.md](D:/desktop/coding-skill/css-code-rules/references/nesting-and-deep-examples.md)

#### Nesting and Deep Selector Examples

##### Mandatory Rules

1. In Less/Sass, nest every child or descendant selector beneath its nearest meaningful owning selector, following component ownership and the stable DOM relationship. An owning selector is the nearest ancestor class that establishes layout, state, or behavior for that child; an incidental wrapper with no such responsibility does not create a required nesting level. Never leave component children as standalone root-level rules or flatten them merely to reduce nesting depth. Only true stylesheet roots, global rules, and separately rendered teleported roots may be top-level. Keep complete class names when nesting rather than generating opaque names through string concatenation. Use `& >` only when styling must be limited to direct children to prevent unintended descendant matches and that boundary is a stable part of the DOM contract. Otherwise use ordinary nested descendant selectors. Never begin a nested selector with a bare `>`.
2. In Vue scoped styles using Less/Sass or verified CSS nesting support through the build pipeline or target browsers, every deep selector must name its target directly through `&:deep(...)`; never call `:deep` without a selector argument. When multiple deep rules belong to the same library-owned subtree, put `&:deep(...)` on the nearest suitable shared parent and nest its descendants beneath it. Do not repeat `:deep` on those descendants. This applies equally to descendant and combinator selectors, pseudo-classes, and pseudo-elements: nest each one under the selector it belongs to inside the shared deep block. Multiple sibling `&:deep(...)` blocks are allowed only when the targets have no suitable shared library-owned parent below the component root, so their only common parent is the component root itself. Under these nesting-capable conditions, do not flatten the business root plus `:deep()` or scatter comma-separated deep rules. In plain CSS without verified nesting support, use equivalent expanded selectors such as `.business-root :deep(.library-parent .library-child)`, keeping every library-owned descendant inside the deep argument. Preserve the business root and library ownership path in each selector; this compatibility exception does not permit unscoped child rules.
3. When nesting is supported, nest pseudo-classes under their owning selector. Express business states as an explicit complete class chained to that owner; keep child changes inside the state block. In plain CSS without verified nesting support, expand pseudo-class and state selectors while preserving the same ownership and matching behavior.

The mandatory nesting forms below apply to Less/Sass or plain CSS with verified nesting support from the build pipeline or target browsers. For plain CSS without that support, use the equivalent expanded ownership selectors shown in Scenario 5. Do not migrate the stylesheet language solely to satisfy nesting syntax.

##### Scenario 1: Mirror the Nearest Meaningful Ownership in Nesting

本节完整示例与边界说明已放在 [CSS 4 对应要求](#css-4) 下方。

##### Scenario 2: Decide Whether a Direct-Child Selector Is Necessary

本节完整示例与边界说明已放在 [CSS 4 对应要求](#css-4) 下方。

##### Scenario 3: Consolidate Deep Library Selectors

本节完整示例与边界说明已放在 [CSS 5 对应要求](#css-5) 下方。

##### Scenario 4: Keep Pseudo-classes and Business States with Their Owner

本节完整示例与边界说明已放在 [CSS 4 对应要求](#css-4) 下方。

##### Scenario 5: Preserve Ownership in Plain CSS without Nesting Support

本节完整示例与边界说明已放在 [CSS 4 对应要求](#css-4)、[CSS 5 对应要求](#css-5) 下方。

##### Review Checklist

- With nesting support, every descendant is nested beneath its nearest meaningful layout, state, or behavior owner; otherwise expanded selectors preserve that path.
- Direct-child combinators express a stable boundary, using `& >` in nested form or the equivalent expanded selector in plain CSS without nesting support.
- Deep rules target named selectors and share the nearest useful library ancestor; expanded plain CSS keeps the full library-owned path inside each deep argument.
- Pseudo-classes and business-state child changes retain their owning selector in either syntax.

#### css-code-rules / 5. references/design-and-layout-examples.md

来源：[references/design-and-layout-examples.md](D:/desktop/coding-skill/css-code-rules/references/design-and-layout-examples.md)

#### Design and Layout Examples

##### Mandatory Rules

1. Avoid CSS Grid. Use Flexbox plus `gap` for layouts unless Flexbox cannot correctly express a genuinely two-dimensional alignment requirement; Grid is allowed only as a last resort when it is demonstrably necessary. Use `flex: 1` for the region that fills remaining space and `flex-shrink: 0` for fixed-size regions. Add `overflow: hidden` wherever flex shrinking or ellipsis depends on it.
2. Respect the repository's existing target ownership. In a project whose desktop and mobile implementations already live in separate page or component trees, keep styles with the affected target and do not bypass the boundary with a component-local media-query fork. In a genuinely shared responsive implementation, use the repository's established responsive strategy.
3. Use the repository's configured unit strategy. For these projects, write ordinary spacing, sizes, and typography in `px`; let the configured PostCSS conversion handle mobile `vw` output. Use viewport units only when the value represents an actual viewport relationship.
4. Prefer documented library CSS custom properties for local customization. Do not increase selector specificity or use `!important` when a scoped variable or ordinary nested selector is sufficient.

Use these scenarios to choose layout primitives, target ownership, units, and local library customization.

##### Scenario 1: Build a One-Dimensional Row with Flexbox

本节完整示例与边界说明已放在 [CSS 6 对应要求](#css-6) 下方。

##### Scenario 2: Respect Target Ownership

本节完整示例与边界说明已放在 [CSS 7 对应要求](#css-7) 下方。

##### Scenario 3: Follow the Configured Unit Strategy

本节完整示例与边界说明已放在 [CSS 7 对应要求](#css-7) 下方。

##### Scenario 4: Customize a Library Locally

本节完整示例与边界说明已放在 [CSS 8 对应要求](#css-8) 下方。

##### Review Checklist

- Flexbox handles one-dimensional layout; Grid has a demonstrated two-dimensional need.
- Fixed regions resist shrinking and flexible text regions can actually shrink.
- Target-specific presentation remains in the repository's target-specific tree.
- Units follow configured transformation rather than manual conversion.
- Library variables are preferred over specificity and `!important`.

#### css-code-rules / 6. references/reuse-and-redundancy-examples.md

来源：[references/reuse-and-redundancy-examples.md](D:/desktop/coding-skill/css-code-rules/references/reuse-and-redundancy-examples.md)

#### Reuse and Redundancy Examples

##### Mandatory Rules

1. Define `box-sizing: border-box` once in the established global or top-level rule; never repeat it in components. When a fixed dimension already establishes the minimum size, do not repeat the corresponding minimum dimension or an equivalent fixed flex basis. Omit declarations that have no effect in the element's actual formatting context. Extract recurring layout, truncation, transition, or animation patterns into a focused Less/Sass mixin, variable, or established utility only after genuine repetition exists. Do not redeclare values already provided by the established global reset or browser defaults. Keep an otherwise redundant declaration only when it is necessary for a specific, observable layout or typographic result.

Use these scenarios to remove ineffective declarations and extract focused abstractions only after real repetition exists.

##### Scenario 1: Remove Redundant Fixed-Size Declarations

本节完整示例与边界说明已放在 [CSS 9 对应要求](#css-9) 下方。

##### Scenario 2: Distinguish Reset Noise from Observable Behavior

本节完整示例与边界说明已放在 [CSS 9 对应要求](#css-9) 下方。

##### Scenario 3: Extract a Repeated Pattern

本节完整示例与边界说明已放在 [CSS 9 对应要求](#css-9) 下方。

##### Scenario 4: Use a Loop Only for a Stable Mechanical Sequence

本节完整示例与边界说明已放在 [CSS 9 对应要求](#css-9) 下方。

##### Review Checklist

- Every declaration has a distinct observable effect.
- Mixins, utilities, and variables represent proven repetition with focused ownership.
- Loops are limited to stable mechanical sequences with readable generated selectors.

#### css-code-rules / 7. references/declaration-and-compatibility-examples.md

来源：[references/declaration-and-compatibility-examples.md](D:/desktop/coding-skill/css-code-rules/references/declaration-and-compatibility-examples.md)

#### Declaration and Compatibility Examples

##### Mandatory Rules

1. Avoid comments in CSS, Less, Sass, SCSS, and Vue `<style>` blocks. Do not add routine section labels, selector descriptions, declaration explanations, commented-out code, or comments that merely restate the stylesheet. Add a comment only when a non-obvious compatibility workaround, external-library constraint, or temporary exception cannot be expressed clearly through naming or structure; keep that exceptional comment concise, explain why it is necessary, and write it in Chinese unless another language is strictly necessary for an exact external term or project-mandated convention.

2. Do not leave meaningless blank lines in CSS, Less, Sass, SCSS, or Vue `<style>` blocks. A blank line is allowed only when one line materially separates distinct selector groups or logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside a selector or at-rule block, or blank lines between related declarations and nested selectors. Keep at most one intentional blank line between genuinely separate groups and remove every blank line that does not improve structural readability.

3. Within a selector, order declarations as: positioning and overflow; interaction; dimensions (height before width); margin and padding; background, border, radius, and effects; typography and color; display and layout; animation and transition. Put nested selectors after declarations. If the repository's active Stylelint configuration enforces a different property order, follow the executable configuration and report that scoped exception instead of producing lint-failing code.

4. Do not duplicate blocks for padding, border, layout, or state. Consolidate related child selectors under their parent and extract repeated patterns only when the reuse is real.

5. Do not introduce CSS APIs, selectors, units, or properties with known target-browser compatibility problems. Confirm support or use the repository-approved fallback before adding newer features.

6. Run the repository formatter only on changed style files. Compare with the pre-format state and restore formatting-only changes outside the task's affected regions while preserving pre-existing user edits. Keep formatting necessary for the changed syntax; report any whole-file check failure caused solely by untouched formatting instead of silently expanding the edit. Re-check the final diff against these structure rules and the established local convention.

Use these scenarios to keep declarations readable, non-duplicated, compatible with project targets, and limited to the files changed by the task.

##### Scenario 1: Decide Whether a Comment Is Justified

本节完整示例与边界说明已放在 [CSS 10 对应要求](#css-10) 下方。

##### Scenario 2: Use Blank Lines Only for Structure

本节完整示例与边界说明已放在 [CSS 11 对应要求](#css-11) 下方。

##### Scenario 3: Apply Declaration Category Order

本节完整示例与边界说明已放在 [CSS 11 对应要求](#css-11) 下方。

##### Scenario 4: Consolidate Duplicate Selector Blocks

本节完整示例与边界说明已放在 [CSS 12 对应要求](#css-12) 下方。

##### Scenario 5: Use a Supported Compatibility Fallback

本节完整示例与边界说明已放在 [CSS 12 对应要求](#css-12) 下方。

##### Scenario 6: Format Only the Changed Style Files

本节完整示例与边界说明已放在 [CSS 12 对应要求](#css-12) 下方。

##### Review Checklist

- Comments exist only for non-obvious constraints and explain why.
- Blank lines communicate real selector or logical boundaries.
- Declarations follow the required category order, or the active Stylelint order with the conflict reported.
- Nested selectors appear after declarations.
- Duplicate selector or state blocks are consolidated under their owners.
- Newer CSS features match actual target-browser and tooling support.
- Only changed style files are formatted; unrelated formatter changes are restored without losing user edits, and legacy formatting failures are reported.

## 七、UI 元数据与资源

以下为当前 agents/openai.yaml 原文；它们提供显示名称、短描述和图标，没有另加执行步骤。

### vue-code-rules

来源：[vue-code-rules/agents/openai.yaml](D:/desktop/coding-skill/vue-code-rules/agents/openai.yaml)

```yaml
interface:
  display_name: "Vue Code Rules"
  short_description: "Apply mandatory Vue component and architecture standards."
  icon_small: "./assets/vuejs-logo.png"
  icon_large: "./assets/vuejs-logo.png"
```

现有资源：

- [vuejs-logo.png](D:/desktop/coding-skill/vue-code-rules/assets/vuejs-logo.png)
- [vuejs-logo.svg](D:/desktop/coding-skill/vue-code-rules/assets/vuejs-logo.svg)

### ts-code-rules

来源：[ts-code-rules/agents/openai.yaml](D:/desktop/coding-skill/ts-code-rules/agents/openai.yaml)

```yaml
interface:
  display_name: "TypeScript Code Rules"
  short_description: "Apply mandatory TypeScript coding and architecture standards."
  icon_small: "./assets/typescript-logo.png"
  icon_large: "./assets/typescript-logo.png"
```

现有资源：

- [typescript-logo.png](D:/desktop/coding-skill/ts-code-rules/assets/typescript-logo.png)
- [typescript-logo.svg](D:/desktop/coding-skill/ts-code-rules/assets/typescript-logo.svg)

### css-code-rules

来源：[css-code-rules/agents/openai.yaml](D:/desktop/coding-skill/css-code-rules/agents/openai.yaml)

```yaml
interface:
  display_name: "CSS Code Rules"
  short_description: "Apply mandatory CSS naming, layout, and style standards."
  icon_small: "./assets/css3-logo.png"
  icon_large: "./assets/css3-logo.png"
```

现有资源：

- [css3-logo.png](D:/desktop/coding-skill/css-code-rules/assets/css3-logo.png)
- [css3-logo.svg](D:/desktop/coding-skill/css-code-rules/assets/css3-logo.svg)

## 八、完整性核对与文件快照

本次收录 3 个 SKILL.md、17 个引用文件和 3 个 UI 元数据文件。17 个引用文件原有的 183 个代码围栏块均已保留，代码示例按要求归位；跨条款重复展示不计入这个源文件数量。

生成时已核对所有 references/*.md 均被入口引用、代码围栏闭合，以及本地文档链接目标存在。本次翻译保留全部原有代码块，并核对注释和展示文案之外的代码逻辑未改变。下表记录原始文件字节数与 SHA-256，便于识别报告生成后的规则变动。

| 文件 | 字节数 | SHA-256 |
| --- | --- | --- |
| vue-code-rules/SKILL.md | 8190 | `7be4a029d81820c35882ef29fa5e26b0ee0de907dc4b0f7c72d5cae7276fab78` |
| vue-code-rules/references/template-examples.md | 6583 | `fae1919355bf71f30551b8ca2e9aef5654e8f6a900b3bca822160c45f508bfad` |
| vue-code-rules/references/class-binding-examples.md | 4171 | `65fc0f2df993fa461edc324f371fd215c9ba9de252eb825e8ab52f9a9f3cfce2` |
| vue-code-rules/references/blank-line-examples.md | 3905 | `990afe538df5853049d79b593c2c70f737d1c58d336948468359fff2c40062cd` |
| vue-code-rules/references/script-structure-examples.md | 8896 | `6f48ee7524e1c491f8d5440d01744d9aba0a0b668d0a8d43bf80aa8759256b27` |
| vue-code-rules/references/script-comment-examples.md | 9237 | `7618148f8f62b220c0dc8c546711bd98a0e577c13f9013f99e44f71745cc8d3d` |
| vue-code-rules/references/component-structure-examples.md | 9811 | `a1209798c18203a4b92812018fcbacc811b64579a91fdcdec9245b4f2d1b3d1e` |
| vue-code-rules/references/complex-component-context-examples.md | 5615 | `97f92cb04da4ce11058d6febbfc8ae850cacb12e105b991d9476a4626a825380` |
| ts-code-rules/SKILL.md | 7355 | `0cd1abc8fa5705eb82d69c4cf73e2bdf90f5ab604c4bee08685d1f7988dde063` |
| ts-code-rules/references/code-quality-examples.md | 20816 | `8728bb5514394fd8cfa8cfc3097ec3ae358c5aa4479863717e710e12fb776f5a` |
| ts-code-rules/references/imports-and-types.md | 3618 | `adaa88d94bc640af79dbf55306252f6674d0a7ad1890e392f27221237a750774` |
| ts-code-rules/references/application-architecture.md | 5807 | `362cb76c7a91d882605008a9558d27d43d95ff8ddf3d092b40ad59e2c9b9d4e9` |
| ts-code-rules/references/async-and-compatibility-examples.md | 8932 | `03c06e0b21311bc451af0f330870af0c284caacae3d0ec125d56053281fb3328` |
| css-code-rules/SKILL.md | 8000 | `d167b9fc9ff3aeee6f723061772d712f6eb07f54ba8463d8696ecdd6d6ddb6ff` |
| css-code-rules/references/scope-and-file-organization-examples.md | 8513 | `b2c5b7e8bc46d5cc4b20815d062aa1b0b6b35802b0bd90d6ca325c44dd792e64` |
| css-code-rules/references/naming-examples.md | 7564 | `e645222aa3294e46a142b34a4b843d8184814acd3761fbaa55cc6c4747140871` |
| css-code-rules/references/nesting-and-deep-examples.md | 9351 | `a28c69ce2fb25acdb28d84119ccee71edd63c2d8364cec372a986f4af6c5fc25` |
| css-code-rules/references/design-and-layout-examples.md | 5893 | `46b82272f1ec5846ffc36d5cb8b60796920114059bba94c5ed1b4c30b112ece8` |
| css-code-rules/references/reuse-and-redundancy-examples.md | 5158 | `0e6371357c360cc716cd2d5c66986e4734b715f5cca9363fb943fbd5224cb0cc` |
| css-code-rules/references/declaration-and-compatibility-examples.md | 10354 | `7f7c026b683eb9225e68c04d6f02fb3086b91535a2951e2c7dfe0f8bc15186ae` |
| vue-code-rules/agents/openai.yaml | 210 | `a429e2e6494f2e8f75cdbc0caea54da9d27d09c9b4b17edd3063a5adf01ef519` |
| ts-code-rules/agents/openai.yaml | 231 | `02dd358501c1ce66a1a163b10ba502d1d4d1ea571ec72b864846043dc70206fc` |
| css-code-rules/agents/openai.yaml | 207 | `ccb9bcd9f4951bf483810a914f5447113876fd7bc5fb7380c9af011d41b6d093` |
