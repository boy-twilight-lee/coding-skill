# vue-code-rules 完整审阅报告

审阅日期：2026-10-22（Asia/Shanghai）。

本报告按照同目录 `css-code-rules-review-2026-10-22.md` 的结构，整理当前工作区 `vue-code-rules` 的全部 11 条核心规则及 11 个独立引用文件。正文按核心规则编号排列，每条下方直接放置中文说明、正反写法、适用边界和检查清单，便于逐条审阅。每条规则只列一个主 reference；跨条款问题按对应规则另行读取。

本报告以工作区源文件为准。所有正反例非必要不出现注释，普通解释放在代码块外；仅在演示注释规则、注释间距/位置，或说明示例不可缺少的隐含约束时保留必要注释。保留的注释、示例标题、解释和界面文案采用中文；中文注释占位标记已替换为实际中文。示例为说明规则而保留必要上下文，部分函数、数据、组件和路径由所属项目提供，不能将局部片段视为可直接运行的完整应用。反例仅演示应避免的写法，不代表 Vue 编译器一定禁止这种语法。示例精简注释不改变实际项目代码的业务注释要求。

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
- [Vue 2：最少必要 DOM 与常见标签](#vue-2)
- [Vue 3：模板标签内指令、属性与事件的顺序](#vue-3)
- [Vue 4：多个类名来源统一使用数组绑定](#vue-4)
- [Vue 5：空行只用于真实逻辑分区](#vue-5)
- [Vue 6：核实 Vite 自动导入后决定显式导入](#vue-6)
- [Vue 7：编译宏的位置与异步暴露例外](#vue-7)
- [Vue 8：中文业务注释、契约与模板区域](#vue-8)
- [Vue 9：组件命名、目录、公共入口与实例类型](#vue-9)
- [Vue 10：组件按职责拆分与文件规模](#vue-10)
- [Vue 11：所有 provide/inject 场景使用固定上下文模式](#vue-11)

## 二、按顺序审阅 11 条规则

<a id="vue-1"></a>

### Vue 1：SFC 顺序、组件标签与插槽

**独立 reference：** [template-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/template-examples.md)

存在的 SFC 块必须保持 `<template>` → `<script>` → `<style>` 的相对顺序。不需要的块直接省略，不能为了凑齐结构添加空块。

自定义组件标签使用 kebab-case。没有插槽或子内容的组件自闭合；提供实际子内容时使用成对标签。有意开放扩展位置时使用具名插槽，组件仍负责自身根节点和模板层级。不能为了规避稳定的 prop 或子组件接口设计而随意增加插槽。

**对应示例与适用边界：**

#### 场景 1：保持 SFC 块顺序

**正例：**

下例假设项目已支持 Less，且选择 Less 符合项目语言约定。这里只演示 SFC 块顺序，契约注释的写法见 Vue 8。

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
  name: string
}>()
defineSlots<{
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
- 多区域模板的注释同时按 Vue 8 检查。

<a id="vue-2"></a>

### Vue 2：最少必要 DOM 与常见标签

**独立 reference：** [dom-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/dom-structure-examples.md)

在实现所需功能的前提下，尽可能减少 DOM 节点数和嵌套层级。不增加不必要节点或无意义包裹，优先直接使用已有元素实现行为和样式。只有现有元素无法直接实现所需行为或布局时，才增加包裹，并保持最少必要结构。

所有实现尽量使用 `div`、`span`、`i`、`button`、`input` 等常见 HTML 标签。块级布局用 `div`，行内内容用 `span`，`i` 仅作装饰图标占位。需要原生交互时使用 `button`、`input`、`a`、`label`、`textarea`、`select` 等常见控件；这不是只有五种标签的封闭白名单。

禁用少见标签及 landmark/分区类语义容器，例如 `main`、`nav`、`aside`、`section`、`article`、`header`、`footer`。这些布局使用常见标签配合业务类名实现，不能以文档结构、SEO 或语义分组为理由引入禁用容器。`dataset` 是 DOM 数据属性接口，`landmark` 是可访问性概念，均不是 HTML 标签，禁止生成 `<dataset>`、`<landmark>` 这类元素。

所有 DOM 标签都适用以下属性边界：除非用户明确指定需要兼容无障碍，否则禁止添加与当前需求无关的无障碍属性，包括主动补充 `aria-*`、仅用于无障碍的 `role`、`tabindex` 等。不能以“补全通用无障碍支持”为理由给所有节点添加这些属性。用户明确要求无障碍时，也只添加该需求实际需要的属性。保留原生控件及功能所需的 `type`、`disabled`、`readonly` 等属性，不借此删除任务范围之外的已有属性。

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

#### 场景 2：统一使用常见标签与原生控件

**正例：**

非交互卡片用通用元素；用户未明确要求无障碍兼容时，不给装饰图标主动添加无障碍属性：

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" />
</div>
```

详情入口具有按钮行为，使用真实按钮：

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  查看详情
</button>
```

页面容器和标题展示同样使用常见标签：

```vue
<div class="article-page">
  <span class="article-page-title">{{ article.title }}</span>
</div>
```

**反例：**

不要用可点击 `div` 替代上述原生按钮，也不要给同一页面布局引入禁用的 landmark/分区容器：

```vue
<div class="user-card-action" @click="openUserDetail">查看详情</div>
<main class="article-page">
  <article>
    <span>{{ article.title }}</span>
  </article>
</main>
```

布局与视觉效果使用常见标签、业务类名和样式表达。保留常见原生控件所需的交互和键盘行为，不能为了统一使用 `div` 而把按钮或输入框改成普通容器。选择常见标签时仍须遵守最少必要 DOM 规则。

#### 场景 3：无障碍属性以用户明确需求为边界

**正例：**

普通的“增加详情按钮”需求保留原生按钮与功能属性，不额外添加无关的无障碍元数据：

```vue
<button type="button" class="user-card-action" @click="openUserDetail">
  查看详情
</button>
```

**反例：**

用户未要求无障碍兼容时，不机械添加按钮角色、重复的朗读标签或仅用于无障碍的焦点顺序属性：

```vue
<button
  type="button"
  class="user-card-action"
  role="button"
  aria-label="查看详情"
  tabindex="0"
  @click="openUserDetail"
>
  查看详情
</button>
```

**用户明确要求无障碍时：**

用户明确要求纯图标详情按钮兼容屏幕阅读器时，可添加相关可访问名称，并让装饰图标不参与辅助技术朗读：

```vue
<button
  type="button"
  class="user-card-action"
  aria-label="查看详情"
  @click="openUserDetail"
>
  <i class="user-card-detail-icon" aria-hidden="true" />
</button>
```

授权来自用户对无障碍兼容的明确要求，不能将这些属性继续扩展到无关节点。两种情况下都保留原生按钮行为。

**本条检查清单：**

- 所需功能使用最少必要节点和层级。
- 每个新增包裹都具有现有元素无法直接承担的职责。
- 所有实现优先使用 div、span、i、button、input 等常见标签。
- 没有少见标签、禁用的 landmark/分区容器或虚构的 dataset/landmark 元素。
- 常见原生控件保留功能所需的交互和键盘行为。
- 用户未明确要求无障碍兼容时，没有主动添加无关的 aria-*、role、tabindex 等属性。
- 用户要求无障碍时，各属性与该需求直接相关；未删除任务范围外的已有属性。

<a id="vue-3"></a>

### Vue 3：模板标签内指令、属性与事件的顺序

**独立 reference：** [template-attribute-order-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/template-attribute-order-examples.md)

每个模板开始标签内，统一按以下顺序排列：**指令 → v-bind 绑定属性 → 文本属性 → 普通布尔属性 → 事件**。`v-if` 与 `v-show` 同属指令的最高级，均放在最前一组，两者之间不再细分优先级；同一标签同时存在时保留组内相对顺序。其他分支上的 `v-else-if` 或 `v-else` 同样归入最前一组。随后放其他指令，再进入属性分组。排序同级不代表渲染行为相同，不能为了排序互换 `v-if` 与 `v-show`。

本条适用于原生元素、自定义组件及 template 标签，规定的是单个标签内部的属性顺序，不重新排列子节点、具名插槽或条件分支。

| 优先级 | 分组 | 示例 |
| --- | --- | --- |
| 1 | 条件与显示指令 | v-if、v-show 同级；对应分支上的 v-else-if、v-else |
| 2 | 其他指令 | v-for、v-model、v-model:open、#extra、自定义 v-focus |
| 3 | 绑定属性 | :options、:title、:style、:class、:disabled、v-bind="attrs" |
| 4 | 文本属性 | icon="..."、class="..."、type="text"、placeholder="..."、ref="..." |
| 5 | 普通布尔属性 | required、readonly、disabled，以及契约明确的无值布尔组件 prop |
| 6 | 事件 | @click、@change、@keydown.enter、v-on:blur、v-on="listeners" |

分组按语法和属性契约识别：`:disabled="loading"` 虽然结果是布尔值，仍属于绑定组；无值 `required` 属于普通布尔组。原生布尔属性由是否存在决定，不能把 `disabled="false"` 当成关闭禁用。不能为了排序改变属性值、删掉绑定或改变修饰符。

动态 `:class`、`:style` 在绑定组；单一静态 `class`、`style` 在文本组。多个 class 来源仍按 Vue 4 合并成一个 `:class` 数组。没有“class 或 style 永远放到最后”的例外；你提供的 `icon` 后接 `class` 是合法的文本组内部顺序。

同组保留有意义的相对顺序，不强制按字母排序，也不额外规定其他指令之间的细分顺序。各组连续书写，不插装饰性空行。存在展开绑定时，保留覆盖优先级和事件行为；如果重新分组会改变行为，应在授权范围内消除冲突，或报告最小必要偏离。

**对应示例与适用边界：**

#### 场景 1：按你提供的统计模板排列

**正例：**

卡片先放绑定属性，再放 icon、class 文本属性；两个选择器都将 `v-if` 放在 `v-model` 之前，再放选项绑定。以下保留原有业务表达式、插槽和子节点次序，仅展示模板，不要求调整脚本、样式或上下文实现。

```vue
<template>
  <exam-detail-card
    :empty="!available"
    :loading="loading"
    :title="`${curTab === STATISTICS_TAB.single ? '单' : '全'}科概览`"
    :style="{
      height: valueToPx(available ? 516 : height)
    }"
    icon="icon-exam-detail-card-subject"
    class="subject-summary-statistics"
  >
    <template #extra>
      <a-select
        v-if="curTab === STATISTICS_TAB.single"
        v-model="statisticsContext.subjectId"
        :options="statisticsContext.subjects"
        :field-names="{
          label: 'subjectName',
          value: 'subjectId'
        }"
      >
        <template #prefix>
          <form-prefix text="学科" />
        </template>
      </a-select>
      <a-select
        v-if="available"
        v-model="classId"
        :options="classOptions"
        :field-names="{
          label: 'className',
          value: 'classId'
        }"
      >
        <template #prefix>
          <form-prefix text="统计范围" />
        </template>
      </a-select>
    </template>
    <template #empty>
      <statistics-empty :loading="loading" />
    </template>
    <statistics-summary />
    <div class="subject-summary-statistics-main">
      <satistics-chart />
      <satistics-rank />
    </div>
  </exam-detail-card>
</template>
```

此处保留你提供的类名以方便对照属性顺序，不构成 CSS 命名规则豁免。组件、状态和函数由所属组件提供，该片段不是独立应用。

**反例：**

不要把文本属性放在指令之前，也不要让 `v-if` 排在其他指令和绑定后面：

```vue
<a-select
  class="subject-select"
  v-model="statisticsContext.subjectId"
  :options="statisticsContext.subjects"
  v-if="curTab === STATISTICS_TAB.single"
/>
```

#### 场景 2：普通布尔属性在事件之前

**正例：**

条件指令最前，随后是其他指令、绑定、文本、普通布尔属性，最后放所有事件。`:disabled` 保留在绑定组。

```vue
<input
  v-if="editable"
  v-model="keyword"
  :maxlength="keywordLimit"
  :disabled="loading"
  type="text"
  placeholder="请输入学科名称"
  required
  @input="handleKeywordInput"
  @blur="handleKeywordBlur"
/>
```

**反例：**

相同属性穿插在各组中，事件不是最后一组，`v-if` 也不是最前：

```vue
<input
  @input="handleKeywordInput"
  type="text"
  v-model="keyword"
  :maxlength="keywordLimit"
  v-if="editable"
  required
  :disabled="loading"
  placeholder="请输入学科名称"
  @blur="handleKeywordBlur"
/>
```

#### 场景 3：保留展开绑定覆盖关系

以下显式 name 有意覆盖 defaults 中的同名值，两者在绑定组内保持原顺序；v-show 与 v-if 一样处于最前的最高级指令组：

```vue
<user-card
  v-show="visible"
  v-bind="defaults"
  :name="userName"
  icon="icon-user"
  @select="handleSelect"
/>
```

不能按字母顺序将 `:name` 移到 `v-bind="defaults"` 前，否则 defaults 可能反过来覆盖显式值。展开对象也可能提供事件或其他键，移动前核实实际重叠关系，不机械排序重复键或跨越展开绑定移动事件。

**本条检查清单：**

- 每个开始标签按指令、绑定、文本、普通布尔属性、事件排列。
- v-if 与 v-show 同属最高优先级，不细分先后；v-else-if、v-else 也在各自分支标签的最前一组。
- v-model、插槽简写及其他指令位于绑定之前。
- 动态布尔值、class、style 属于绑定组，单一静态 class/style 属于文本组。
- 无值布尔属性位于所有事件之前，包括带修饰符和对象形式的事件。
- 分组连续，不强制字母排序，不增加装饰性空行。
- 保留展开覆盖、属性值、表达式、修饰符、事件行为及条件链连续性。
- 不为属性排序移动子节点、重排插槽或改写无关脚本和样式。

<a id="vue-4"></a>

### Vue 4：多个类名来源统一使用数组绑定

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
const densityClass = computed(() => `candidate-card-${props.density}`)
</script>
```

非简单的私有 prop 契约放在所属组件的 `type` 模块：

```ts
export interface CandidateCardProps {
  active: boolean
  density: 'compact' | 'normal'
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

<a id="vue-5"></a>

### Vue 5：空行只用于真实逻辑分区

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
  candidateId: string
}>()

const route = useRoute()
const router = useRouter()
const keyword = ref('')
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
  candidateId: string
}>()

const route = useRoute()
const keyword = ref('')
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

### Vue 7：编译宏的位置与异步暴露例外

**独立 reference：** [compiler-macro-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/compiler-macro-examples.md)

所有 Vue 编译宏只能在 `<script setup>` 的脚本作用域调用，不能放在函数、回调、条件、循环或其他嵌套块内。

除 `defineExpose` 外，`defineOptions`、`defineProps`、`withDefaults`、`defineModel`、`defineEmits`、`defineSlots` 等宏应在必要导入之后组成第一个声明组，位于普通状态、computed、watch、生命周期和函数之前。

没有顶层 `await` 时，`defineExpose` 是脚本最后一条语句；存在顶层 `await` 时，必须先初始化公开绑定，并在第一次顶层等待前调用 `defineExpose`，后面再进行异步初始化及依赖操作。仅在函数或回调里使用 `await` 不触发该例外。

**对应示例与适用边界：**

#### 场景 1：普通脚本末尾暴露公开方法

**正例：**

假设 Vue API 未被自动导入，接口函数由项目 API 公共入口提供。这里只演示编译宏位置，业务契约注释的写法见 Vue 8。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCandidate, saveCandidate } from '@/apis'

defineOptions({ inheritAttrs: false })
const props = defineProps<{
  candidateId: string
}>()
const emit = defineEmits<{
  saved: [candidateId: string]
}>()

const loading = ref(false)
const visible = ref(false)
const loadCandidate = async () => {
  loading.value = true
  try {
    await getCandidate(props.candidateId)
  } finally {
    loading.value = false
  }
}
const handleSave = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
}
const openEditor = () => {
  visible.value = true
}
onMounted(loadCandidate)

defineExpose({
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
  candidateId: string
}>()
const candidateName = ref('')

defineExpose({
  candidateName
})

candidateName.value = await loadCandidateName(props.candidateId)
</script>
```

不能把暴露操作延迟到异步结果到达后，也不能在公开绑定初始化前引用它。[Vue 模板引用文档](https://vuejs.org/guide/essentials/template-refs.html#ref-on-component)说明了等待前暴露的要求。

**反例：**

下列片段分别演示宏被运行时声明打断、宏放入函数，以及没有顶层等待时在 `defineExpose` 后继续注册生命周期：

```ts
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

<a id="vue-8"></a>

### Vue 8：中文业务注释、契约与模板区域

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

<a id="vue-9"></a>

### Vue 9：组件命名、目录、公共入口与实例类型

**独立 reference：** [component-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md)

组件文件、目录、自定义标签使用 kebab-case。组合式函数文件一般也使用 kebab-case，但 `hooks/` 内的 hook 文件使用 camelCase，例如 `useUserCard.ts`。

既有页面或组件树下的第一层页面、视图和组件，即使很简单，也必须采用含 `index.vue` 和 `index.ts` 的目录形式。只有所属者私有 `component/` 目录中的简单子组件可保持具名 `.vue` 单文件。需要有意义的支持文件时改为目录形式；达到 CSS 强制提取条件而需要独立样式，也属于这种情况。

`index.ts` 除转发默认组件外，还应显式转发外部确实需要的方法、组件、类型及子目录模块，作为统一公共入口；不放业务实现，不为方便而批量导出私有内部文件。组件实例方法仍在 SFC 中通过 `defineExpose` 实现公开，不把 setup 内状态改造成模块全局状态。

组件或页面根目录只能按需使用 `component/`、`constants/`、`hooks/`、`type/`、`style/` 以及规定的入口、样式文件，不得私自添加无关目录或游离文件。私有子组件放 `component/`，常量放 `constants/`，类型放 `type/`，抽离的功能逻辑放 `hooks/`；不得在组件内另建 `utils/`、`helpers/`、`services/`，也不得把 helper.ts、format.ts、context.ts、useDetailTools.ts 等文件散落在根目录。

同一组件所属的功能函数可按内聚职责组合成一个工具性 hook，如 `hooks/useDetailTools.ts`；不为每个小函数单独建文件，也不为工具 hook 凭空增加响应式状态。简单一次性逻辑仍可留在 `index.vue`。真正跨模块公用的无状态工具放项目既有 `utils` 结构，优先复用已有模块；公用的响应式组合逻辑继续按项目 hooks 层管理。

独立样式采用互斥形式：只有一个样式文件时使用 `index.less`，有多个确有必要的样式文件时全部放入 `style/`，不得与根目录 `index.less` 共存。不得只为一个文件创建 style 目录，也不得人为拆分样式凑目录。保留已有样式语言时采用对应扩展名；是否必须提取样式仍遵循 CSS 阈值，没有独立样式需求时两种形式都省略。

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

按你提供的组件目录图，完整允许结构如下；index.vue、index.ts 必须保留，其他项目按实际需要创建，不是要求每个组件生成全部目录。单一样式文件形式：

```text
teacher-exam-detail/
|-- component/               私有子组件
|-- constants/               私有常量
|-- hooks/                   私有组合逻辑及工具性 hook
|-- type/                    私有类型
|-- index.less               单个独立样式文件，按需创建
|-- index.ts                 组件公共出口
`-- index.vue
```

多个独立样式文件形式；图中 style 与 index.less 同时出现的情况，以你的文字要求为准，二者互斥：

```text
teacher-exam-detail/
|-- component/
|-- constants/
|-- hooks/
|-- style/
|   |-- scoped.less
|   `-- global.less
|-- type/
|-- index.ts
`-- index.vue
```

scoped.less、global.less 仅演示确有作用域隔离需求的多个样式文件，并非必需文件名。子组件转换为目录后也遵守同一结构，不能借支持文件增加无关目录或根目录散落文件。

私有子组件按第 10 条及 CSS 规则提取样式后，转换为目录形式：

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

#### 场景 4：公共入口转发组件及外部需要的模块

**正例：**

每个目录管理组件的最小 `index.ts`：

```ts
export { default } from './index.vue'
```

外部还需要该业务所属的特定组件、hook/方法或常量时，在同一 `index.ts` 显式转发。例如以下示例假定各导出已经存在，且属于确定的公开契约：

```ts
export { default } from './index.vue'
export { default as StatisticsSummary } from './component/statistics-summary'
export { useDetailActions } from './hooks/useDetailActions'
export { STATISTICS_TAB } from './constants'
```

目录管理的子组件通过自身入口转发。普通私有子组件和实现 hook 仍保持私有，不将整个子目录无差别导出。模块方法/hook 使用具名导出，SFC 暴露的实例方法通过组件实例调用；入口只转发，不实现这些方法。

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
export type DrawerInstance = InstanceType<typeof Drawer>
```

消费者经相同公共入口导入组件与实例类型：

```ts
import { DrawerInstance } from '@/components/drawer'
import Drawer from '@/components/drawer'

const drawerRef = ref<DrawerInstance | null>(null)
```

此处假设 `ref` 被生效配置自动导入，否则显式导入。普通类型导入假设工具链可安全擦除；核实配置要求时改为独立 `import type`。没有外部实例类型消费者时，不要求预先导出实例类型。

#### 场景 6：功能工具与样式不产生游离文件

**正例：**

详情页内聚的转换、格式化等功能可组合到一个工具性 hook；跨模块实际公用的无状态函数放项目 utils，公共入口只转发公开函数：

```text
src/
|-- pages/teacher-exam-detail/
|   |-- hooks/
|   |   `-- useDetailTools.ts
|   |-- index.ts
|   `-- index.vue
`-- utils/
    |-- exam-statistics.ts
    `-- index.ts
```

不为了工具 hook 增加无用的 ref、watcher 或副作用；无需抽离的简单一次性逻辑保留在 SFC。

**反例：**

不要把同一详情页的私有逻辑、类型或上下文散落到额外目录和根文件：

```text
teacher-exam-detail/
|-- helpers/
|-- utils/
|-- services/
|-- helper.ts
|-- format.ts
|-- context.ts
|-- useDetailTools.ts
|-- detail-type.ts
|-- index.ts
`-- index.vue
```

同一组件也不能保留两种独立样式形式：

```text
teacher-exam-detail/
|-- style/
|   |-- scoped.less
|   `-- global.less
|-- index.less
|-- index.ts
`-- index.vue
```

单文件时只用 index.less；多个确有必要的样式文件全部归入 style，并省略根样式文件。按当前需求创建内容，不照完整结构生成空目录。

**本条检查清单：**

- 第一层页面、视图和组件具有目录、index.vue 与 index.ts。
- 只有简单私有子组件保持具名单文件。
- 私有子组件需要独立样式等支持文件时转为目录。
- 没有空目录、无意义支持文件或被绕过的公共入口。
- 文件和标签命名正确，hooks/ 内文件采用 camelCase。
- 外部需要的实例类型从公共入口具名导出。
- index.ts 显式转发默认组件和外部需要的方法、组件、子目录模块及类型，不放实现或批量暴露私有内容。
- 根目录仅含允许的必需及可选项目，没有私自添加的无关目录或游离文件。
- 私有内聚功能函数归工具性 hook，真正公用的无状态函数归项目 utils。
- 独立样式单文件用 index.less，多文件用 style，二者互斥，不创建单文件 style 目录。

<a id="vue-10"></a>

### Vue 10：组件按职责拆分与文件规模

**独立 reference：** [component-decomposition-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/component-decomposition-examples.md)

每个 `.vue` 文件最多 1000 行，并按内容和职责决定拆分方式：模板/HTML 偏多、嵌套复杂或存在独立业务区域时，考虑抽成子组件；script 偏多、混合多个功能职责时，考虑将对应功能迁入职责明确的 hooks；style 偏多或复杂时，按 `css-code-rules` 提取样式。不能只按固定行数切块，也不必等到 1000 行才拆分；CSS 强制阈值独立生效。拆分后的每个 Vue 文件仍须满足上限，SFC 保留简单的页面协调逻辑。

拆分或移动时更新公共入口与消费者，检查自动组件发现，保留状态归属、生命周期、prop/event/slot 契约及样式作用域；不迁移无关组件。

本条负责何时拆、按什么职责拆，以及拆分后如何检查。文件放置、命名、样式文件形式和 index.ts 的公开转发范围由第 9 条负责，不重复放在同一条中。

#### 场景 1：按模板、脚本、样式的内容和职责拆分

| 内容特征 | 拆分依据 | 迁移位置与要求 |
| --- | --- | --- |
| 模板/HTML 偏多、嵌套复杂 | 重复 UI、可独立维护的业务区域、父组件层级难以阅读 | 抽到 component/，建立清晰 props/events/slots；不为单个简单节点拆组件或增加包裹 |
| script 偏多 | 查询筛选、选择等不同功能混在一起，遮蔽 SFC 的协调职责 | 按职责拆到 hooks/，相关状态、computed、watcher、动作及清理一同迁移，保留实例归属 |
| style 偏多或复杂 | 达到 CSS 强制提取阈值，或存在具体维护问题需要提前提取 | 按 CSS 规则整体提取并保留作用域；单文件用 index.less，多文件用 style；不按视觉区块拆分 |
| 总文件超过 1000 行 | 模板、脚本和样式任意组合导致超限 | 按上述职责边界拆至每个 .vue 均达标，并更新入口、消费者及自动发现 |

例如详情页保留协调逻辑，概览和图表下沉子组件，查询和选择分别进入 hook：

```text
exam-detail/
|-- component/
|   |-- statistics-summary.vue
|   `-- statistics-chart/
|       |-- index.vue
|       |-- index.ts
|       `-- index.less
|-- hooks/
|   |-- useExamQuery.ts
|   `-- useExamSelection.ts
|-- index.less
|-- index.ts
`-- index.vue
```

概览仍是简单私有子组件；图表因拥有独立样式而采用目录形式，图表与父组件的样式分别归各自所有者。编译宏和简单 UI 协调保留在所属 SFC；不能将 hooks 写成模块级单例，也不能把整个 script 换个文件名塞入无职责边界的大 hook。仅真正供外部消费的子模块从公共入口转发，同一所属模块内仍允许合适的直接本地导入。

#### 场景 2：样式提取阈值独立生效

CSS 规则满足以下任一条件就必须提取整个内联样式块，不能因 Vue 文件尚未达到 1000 行而豁免：

- 至少 80 个非空行。
- 至少 4 个自有选择器组，且具备至少 2 类复杂度信号：三层及以上嵌套；至少三个状态或伪类分支；deep 或第三方覆盖；keyframes 或复杂动画；响应式、supports 或 container 分支。

**本条检查清单：**

- 每个 .vue 不超过 1000 行，结构移动同步更新消费者和自动发现。
- HTML 偏多或复杂时考虑子组件，script 偏多时考虑按职责拆 hooks，style 偏多时按 CSS 规则提取，不机械按行切分。
- 拆分后保留状态与生命周期归属、组件契约和样式作用域，更新公共入口、消费者及自动组件发现。
- 样式提取遵循 CSS 对应引用；迁移后的目录和公共入口遵循 Vue 9。
- 编译宏与简单协调保留在 SFC，不引入模块级共享状态或无关迁移。

<a id="vue-11"></a>

### Vue 11：所有 provide/inject 场景使用固定上下文模式

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

以下完整结构取自引用中的工作台例子，类型及契约含义由正文说明，代码只展示上下文结构。示例假设 Vue 运行时 API 未被自动导入，因此保留显式导入；覆盖已核实后省略相应运行时导入。类型导入按工具实际要求选择普通导入或独立 `import type`。

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

const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

export const useWorkbenchContext = () => {
  return {
    provide() {
      const page = ref<Page>(createDefaultPage())
      const loading = computed(() => page.value.loading)
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
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
const { page, loading, initPage } = useWorkbenchContext().provide()
```

后代读取同一所属者的上下文：

```ts
const { page, loading, initPage } = useWorkbenchContext().inject()
```

**反例：**

后代为了读取状态而调用 provider，会为自己的子树创建另一份状态：

```ts
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
- Vue 2 要求以尽可能少的 DOM 节点和层级实现功能，并优先使用常见标签，禁用少见标签及 landmark/分区容器；用户未明确要求无障碍兼容时，禁止主动添加无关的无障碍属性。容器命名清楚本身不足以证明必要性；必须核实已有元素无法直接承担所需布局或行为。
- Vue 1 的组件标签 kebab-case 与 Vue 9 的文件目录命名相互补充；插槽不成为多余 DOM 的理由。
- Vue 5 允许独立模板或脚本逻辑区域之间最多一行空行；CSS 组件选择器内部仍按 CSS 规则保持连续，不能相互套用。
- Vue 7 的编译宏无泛化声明注释，不能被解释为 Vue 8 的业务契约免注释；业务 prop、event、model、slot 和公开动作语义仍应在成员处说明。
- Vue 6 只在精确 API 已被生效配置覆盖时省略运行时导入。生成声明、类型可见和相邻文件写法均不能单独替代配置核实。
- Vue 9 的第一层组件目录是强制要求；组件根目录只使用规定结构，不增加无关目录或游离文件。公用无状态工具归项目 utils；独立样式单文件使用 index.less，多文件放 style，二者互斥。index.ts 转发默认组件及外部实际需要的方法、组件、类型和子目录模块。
- Vue 10 负责组件按职责拆分与 1000 行上限，HTML 对应子组件、script 对应 hooks、style 对应 CSS 规则。CSS 强制提取条件独立生效；私有单文件需要独立样式时必须转换为目录。阈值细节以 CSS 对应引用为准。
- Vue 11 适用于任何深度及任意共享字段数量的 provide/inject 场景。门面恰好两个方法、同一个 context 对象和完整安全 fallback 均为强制结构，不是可选建议。
- Vue 3 排列单个开始标签内部的指令、属性与事件，不改变 DOM 或插槽顺序；v-if 与 v-show 同属最前的最高级指令组，动态布尔值属于绑定，事件最后，展开覆盖关系必须保留。
- 所有正反例非必要不出现注释。注释规则及注释位置/间距示例保留用于对照的必要注释，其余解释位于代码块外；不声称示例与源代码围栏逐字相同。11 条规则及一条规则一个主 reference 的结构保持不变，实际项目代码的业务注释要求不受示例精简影响。

## 四、11 条核心规则与 11 个独立 reference

每条核心规则对应一个独立主 reference，各文件标明 `Owns Core Rule N.`，并包含所属规则的要求、完整示例和检查清单。原模板引用拆为 SFC/标签/插槽与 DOM 结构；原脚本结构引用拆为编译宏与自动导入。跨规则引用只指向对应归属，不再让同一个主文件承载两条规则。

| 核心规则 | 独立 reference |
| --- | --- |
| Vue 1 | [template-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/template-examples.md) |
| Vue 2 | [dom-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/dom-structure-examples.md) |
| Vue 3 | [template-attribute-order-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/template-attribute-order-examples.md) |
| Vue 4 | [class-binding-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/class-binding-examples.md) |
| Vue 5 | [blank-line-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/blank-line-examples.md) |
| Vue 6 | [auto-import-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/auto-import-examples.md) |
| Vue 7 | [compiler-macro-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/compiler-macro-examples.md) |
| Vue 8 | [script-comment-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/script-comment-examples.md) |
| Vue 9 | [component-structure-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/component-structure-examples.md) |
| Vue 10 | [component-decomposition-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/component-decomposition-examples.md) |
| Vue 11 | [complex-component-context-examples.md](/D:/desktop/coding-skill/vue-code-rules/references/complex-component-context-examples.md) |

## 五、当前技能展示信息

- 技能名称：vue-code-rules。
- 界面显示名：Vue Code Rules。
- 短描述含义：应用强制性的 Vue 组件与架构标准。
- 图标：assets/vuejs-logo.png；同目录另有 SVG 资源。
- 当前 agents/openai.yaml 仅包含展示名、短描述和图标，没有额外执行流程。

## 六、完整性核对与文件快照

正文覆盖全部 11 条核心规则、11 个独立 reference 的强制要求、各场景主题及检查清单，共包含 80 个代码围栏块。当前引用共包含 77 个源代码围栏块；本轮按 CSS 入口的结构精简 Vue SKILL.md，将重复范围说明、长路由枚举和引用中已有的细节压缩为核心约束，并把示例注释说明移入 Vue 8 引用。入口由 12,162 字符缩短为 6,822 字符，减少约 43.9%；规则要求、编号及全部示例保留。

本轮仅精简 Vue 技能入口，在注释引用中承接示例说明，并更新本审阅报告的来源快照；其他技能及其报告未修改。入口仍采用 Core Rules、Required Reference Loading、Working Process 三部分，保留 11 条规则与 11 个独立 reference 的对应关系。核对对象为工作区的 SKILL.md、11 个 reference 和 UI 元数据，共 13 个 Vue 来源文件；下表按实际文件字节计算 SHA-256，便于后续判断报告与源文件是否仍对应。图标不属于规则正文快照。

文档校验覆盖核心规则编号、11 个独立引用的覆盖、内部锚点、本地文件链接、代码围栏配对、中文占位标记替换，以及来源快照一致性。本仓库未提供可运行的 Vue 应用及对应构建配置；报告中的示例未编译或执行，不能据此宣称应用类型检查、lint 或运行时行为已经通过。

| 文件 | 字节数 | SHA-256 |
| --- | --- | --- |
| vue-code-rules/SKILL.md | 6822 | `8df26c6df66e8763e1e0a46dd8fd4d69f40fd9b06ae284dcb86fe4deea937732` |
| vue-code-rules/references/auto-import-examples.md | 3265 | `3d851147c01b7eff5f14bdaf91b5f6af847948dd78024e47587e887352fa93b2` |
| vue-code-rules/references/blank-line-examples.md | 3906 | `f3e6c08d81a7b9fd79be5d0e2ea09bc268b23a181efa0cd621538b224c547fdf` |
| vue-code-rules/references/class-binding-examples.md | 4118 | `995748dde1288a530cef87e3d7c7b2cb1e23101447d1e49fb991de67b07a21f5` |
| vue-code-rules/references/compiler-macro-examples.md | 4377 | `94a9e53b6bca685977b187ea9d443d9f119323cf72a0cc0553331f00839116a0` |
| vue-code-rules/references/complex-component-context-examples.md | 4797 | `4b7047f2161f6b00d8c8695be011e7db47307b5600367f3a542ae457edba20ab` |
| vue-code-rules/references/component-decomposition-examples.md | 4060 | `bc30591a4ef8bfba8515b49d63816f664826c57531c191f29d09c239f9023867` |
| vue-code-rules/references/component-structure-examples.md | 15141 | `2de22ef77eeca313ef7038c86736e81c6f11d5d7f732a5ec4785a46c0a62af73` |
| vue-code-rules/references/dom-structure-examples.md | 6068 | `dfc112b5d125ba4111b24c72b4397874425521e23ee3115726518caec0800a59` |
| vue-code-rules/references/script-comment-examples.md | 9695 | `b0e1297513feb26db0fcf0b7baad63d5a90d13c744947799f73436ca4fdd1cc5` |
| vue-code-rules/references/template-attribute-order-examples.md | 8281 | `7117d9e05a83e43c48f45ce0fe4e03d6829d3c69a220941d786d8774c9a94362` |
| vue-code-rules/references/template-examples.md | 3155 | `117bb62f30ce763ab317f7184aa1dbfedc5304c79d6776f49072ac497a36564a` |
| vue-code-rules/agents/openai.yaml | 210 | `a429e2e6494f2e8f75cdbc0caea54da9d27d09c9b4b17edd3063a5adf01ef519` |
