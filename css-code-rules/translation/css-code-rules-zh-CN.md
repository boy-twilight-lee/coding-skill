# css-code-rules 中文翻译

> 本文件仅供人工阅读。它没有被 `SKILL.md`、`agents/openai.yaml` 或任何 `references` 路由引用，因此不会自动进入 skill 上下文。当前 `SKILL.md` 是轻量入口，强制规则与示例按决策类型存放在 `references` 中；本文件将它们合并为便于人工查阅的中文版本。所有原始 fenced code 示例均原样保留。

## 当前技能结构

- `SKILL.md`：保留适用范围、优先级、reference 路由、跨技能组合和工作流程。
- `references/`：每份文件先列出对应的强制规则，再提供完整示例和复核清单。
- `translation/css-code-rules-zh-CN.md`：仅供人工阅读，不参与 Codex 自动路由。

## 适用范围、优先级与工作流程

所有新增、修改或审查的 CSS、Less、Sass、SCSS 或 Vue 样式都应用相关规则。现有样式只能作为上下文，不能免除规则；不要仅为了统一而迁移未触及样式。更高优先级指令覆盖本技能；只有规则明确委托给仓库配置时，仓库配置或惯例才覆盖对应规则。无法满足强制规则时采用最小必要偏离，并准确报告冲突。

开始前检查仓库指令、标记结构、拥有组件、邻近样式、全局重置与令牌、预处理器、PostCSS、浏览器目标和检查配置，并根据当前决策读取匹配的 reference。修改限定在请求所有权范围，完成后逐行复核并运行最小格式化、Stylelint、构建、相关测试或视觉检查。Vue style 区块还要应用 `vue-code-rules`，同一 SFC 修改涉及 TypeScript 时还要应用 `ts-code-rules`；每个相关 skill 只应用一次，不递归重复读取已经加载的 skill。

## 引用路由

- 样式语言、Vue scope、抽离布局、所有权或覆盖放置：`references/scope-and-file-organization-examples.md`。
- 业务根、BEM 名称、所有权嵌套、直接子边界、deep、伪类或业务状态：`references/naming-and-nesting-examples.md`。
- 令牌、布局、目标专属呈现、单位、组件库定制、冗余删除或复用抽象：`references/design-layout-and-reuse-examples.md`。
- 注释、空行、声明顺序、合并、浏览器支持、回退或最终格式化：`references/declaration-and-compatibility-examples.md`。

## Scope 与文件组织

1. 保留项目现有样式语言；用户 Vue 项目中新组件默认 Less，除非仓库明确采用其他方案。
2. 普通 Vue 组件样式使用 scoped；Less 写作 `<style lang="less" scoped>`。只有真正全局或组件根外渲染的内容使用非 scoped。
3. 提取样式与组件入口相邻；内联样式格式化后达到 200 行时整体移入同级文件，不按视觉区域拆分。
4. 一个组件的样式保持在一个样式表，只有 scope 本身要求隔离时才分文件。
5. 全局重置、令牌、库全局覆盖和工具放既有 `src/styles`；组件专属库覆盖留在业务根下。

### 对应强制规则与完整示例：`references/scope-and-file-organization-examples.md`

#### 场景 1：保留现有样式语言

保留仓库已验证的 CSS/Less/Sass/SCSS 或 CSS Modules 方案，不为统一偏好迁移现有文件。

```vue
<style lang="scss" scoped>
@use './index.scss';
</style>
```

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

#### 场景 2：选择 scoped 或非 scoped Vue 样式

普通组件 DOM 使用 scoped；Teleport 或真正全局内容使用防冲突的完整业务根类。

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

```vue
<style lang="less">
.talent-select-popper {
  .talent-select-popper-option {
    color: var(--text-color-primary);
  }
}
</style>
```

```vue
<style lang="less">
.talent-select {
}
</style>
```

#### 场景 3：提取不断增长的组件样式

组件样式达到阈值时整体提取到相邻样式文件；只有 scope 确实不同才拆成多个文件。

```text
talent-card/
|-- index.vue
`-- index.less
```

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

```text
talent-select/
|-- index.vue
`-- style/
    |-- scoped.less
    `-- global.less
```

```text
talent-card/
|-- header.less
|-- content.less
|-- actions.less
`-- states.less
```

#### 场景 4：放置全局规则和组件私有规则

重置、令牌和全局工具放全局样式区；一次性组件库覆盖留在业务组件根下。

```text
src/styles/reset.less
src/styles/theme.less
src/styles/utilities.less
src/components/talent-form/index.less
```

```less
.talent-form {
  &:deep(.el-input__wrapper) {
    border-radius: var(--radius-medium);
  }
}
```

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 命名与嵌套

1. 每个组件有明确业务根类，所有私有选择器位于其下；Teleport 可有独立完整业务根。
2. 项目类名使用完整单连字符 BEM 风格，不用 `__`/`--`；名称表达业务而不是视觉。
3. 先删冗余所有权词和视觉词来缩短名称，确实过长才用一致可读的业务缩写。
4. Less/Sass 中子项嵌套在最近有效拥有者下；稳定直接子契约才用 `& >`，不得裸 `>`。
5. scoped 深层规则使用带目标的 `&:deep(...)`，共享库根时合并并继续嵌套后代、伪类和伪元素。
6. 伪类跟随拥有者，业务状态用完整类链到拥有者；无嵌套支持的 CSS 展开选择器但保留所有权路径。

### 对应强制规则与完整示例：`references/naming-and-nesting-examples.md`

#### 场景 1：命名组件根、元素和状态

使用有业务含义的根类和完整单连字符 BEM 风格名称，状态跟随拥有者。

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

#### 场景 2：避免过长名称并使用可读缩写

先删除冗余词和视觉词；仍过长时才使用仓库中一致、可理解的业务缩写，禁止晦涩字母串。

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

```vue
<div class="human-resources-recruitment-candidate-evaluation-management-panel-container">
  <div class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper">
    <span class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper-title-text">
      候选人评估
    </span>
  </div>
</div>
```

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

```less
.hr-recruit-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

#### 场景 3：嵌套体现最近的有效所有权

子选择器嵌套在最近的布局、状态或行为拥有者下，不把组件子项漂到根级。

```vue
<div class="talent-card">
  <div class="talent-card-header">
    <span class="talent-card-title">候选人</span>
  </div>
</div>
```

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

```less
.talent-card-title {
}
```

```less
.talent-card {
  .talent-card-title {
  }
}
```

#### 场景 4：判断是否需要直接子选择器

只有直接子边界是稳定 DOM 契约且能防止误匹配时使用 `& >`，不得以裸 `>` 开头。

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid var(--border-color);
  }
}
```

```less
.talent-card {
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

```less
.menu-list {
  > .menu-item {
  }
}
```

#### 场景 5：合并第三方库 deep 选择器

在最近的共享第三方根上使用带参数的 `&:deep(...)`，后代、伪类和伪元素继续嵌套。

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

```less
.result-table {
  &:deep() {
    .arco-table-th {
    }
  }
}
```

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

```less
.result-table:deep(.arco-table-cell),
.result-table:deep(.arco-table-th) {
}
```

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

#### 场景 6：伪类和业务状态跟随拥有者

原生伪类和业务状态链在其拥有者上，依赖状态的子项放进状态块。

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

#### 场景 7：命名 Teleport 根节点

Teleport 内容可有独立顶层根，但必须使用完整业务限定名，不能使用通用 `.popper` 等名称。

```less
.talent-filter {
}

.talent-filter-popper {
  .talent-filter-popper-option {
  }
}
```

#### 场景 8：无嵌套支持时仍保留所有权路径

无嵌套支持时展开选择器，但仍保留业务根、拥有路径和 deep 参数内的完整库路径。

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

```css
.result-table :deep(.arco-table .arco-table-th:first-child) {
  border-radius: 8px 0 0 8px;
}
.result-table :deep(.arco-table .arco-table-th .arco-table-cell) {
  min-height: 40px;
}
```

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 设计、布局与复用

1. 复用令牌、工具和语义值；只有真实重复时使用变量、mixin 或循环。
2. 一维布局优先 Flexbox 与 `gap`；Grid 只用于 Flex 无法正确表达的真实二维对齐。
3. 尊重仓库既有目标端所有权。Vue 项目的桌面端与移动端已由独立目录表达时，架构归 `vue-code-rules` 管理；样式只留在受影响目标端，不能用组件内媒体查询绕过边界。真正共享的响应式实现遵循仓库既有策略。
4. 遵循项目单位策略；常规尺寸用 `px`，交给 PostCSS 转换，真实视口关系才用视口单位。
5. 组件库定制优先公开 CSS 变量，不无谓提高特异性或使用 `!important`。
6. 全局只定义一次 `box-sizing`；删除重复尺寸和无效声明，只有可观察行为需要时保留常见声明。

### 对应强制规则与完整示例：`references/design-layout-and-reuse-examples.md`

#### 场景 1：复用现有设计令牌

先复用项目令牌、工具类和语义值，避免近似字面量；只有真实重复时才提取变量或 mixin。

```less
.talent-card {
  padding: var(--spacing-medium);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-medium);
  color: var(--text-color-primary);
}
```

```less
.talent-card {
  padding: 15px;
  border: 1px solid #e4e7ec;
  border-radius: 7px;
  color: #303133;
}
```

#### 场景 2：用 Flexbox 构建一维布局

一维布局优先 Flexbox 与 `gap`；剩余区域使用 `flex: 1`，固定区域防收缩，省略号依赖处补 `overflow: hidden`。

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

#### 场景 3：尊重目标端所有权

先由应用架构确定目标端所有权。Vue 已分离桌面端和移动端实现时，修改受影响目标端拥有的样式，不要在其中重新实现另一目标端：

```less
@media (max-width: 768px) {
  .talent-list {
  }
}
```

仓库有意采用共享响应式实现时，媒体查询仍然有效。CSS 负责呈现技术，`vue-code-rules` 负责组件属于共享树还是目标端专属树。

#### 场景 4：遵循已配置的单位策略

按项目单位策略书写；常规尺寸使用 `px` 并交给 PostCSS 转换，只有真实视口关系才直接使用视口单位。

```less
.talent-card {
  width: 320px;
  padding: 16px;
  font-size: 14px;
}
```

```less
.full-screen-panel {
  min-height: 100vh;
}
```

#### 场景 5：在局部定制组件库

优先使用库公开的 CSS 自定义属性做局部定制，避免不必要的高优先级和 `!important`。

```less
.talent-dialog {
  --el-dialog-border-radius: 12px;
}
```

```less
.page .content .talent-dialog.el-dialog {
  border-radius: 12px !important;
}
```

#### 场景 6：删除冗余固定尺寸声明

固定尺寸已表达最小值时不再重复 min/flex-basis；删除在实际格式化上下文中无效的声明。

```less
.talent-row {
  .talent-row-avatar {
    height: 40px;
    width: 40px;
    flex-shrink: 0;
  }
}
```

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

#### 场景 7：区分重置噪音和可观察行为

不重复全局重置，但会影响收缩、截断或交互的声明即使常见也要保留。

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

```less
.talent-row {
  .talent-row-content {
    min-width: 0;
    flex: 1;
  }
}
```

#### 场景 8：提取重复模式

确认多处真实重复后再提取聚焦的 mixin、变量或工具，不能混入无关颜色、间距或组件尺寸。

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

#### 场景 9：循环只用于稳定机械序列

循环只生成命名和增量都稳定可预测的序列，不用于不规则业务状态或一次性短声明。

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

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 声明与兼容性纪律

1. 样式通常不写注释；只有非显然兼容性、外部约束或临时例外可用简洁中文解释原因。
2. 空行只分隔真实结构，禁止连续、首尾、块边缘以及相关声明与嵌套之间空行。
3. 声明顺序：定位/溢出、交互、尺寸（高先宽）、margin/padding、背景/边框/效果、文字/颜色、布局、动画，嵌套最后；Stylelint 有不同可执行顺序时遵循配置并报告例外。
4. 合并重复选择器和状态块；只有真实复用才抽象。
5. 新 CSS 能力必须符合目标浏览器或使用项目批准回退。
6. 只格式化修改的样式文件，恢复任务范围外格式变化。

### 对应强制规则与完整示例：`references/declaration-and-compatibility-examples.md`

#### 场景 1：判断注释是否必要

样式通常不写注释；仅非显然兼容性、外部约束或临时例外可用简洁中文说明原因。

```less
.talent-card {
  color: var(--text-color-primary);
}
```

```less
/* 卡片标题样式 */
.talent-card {
  /* 设置主要文字颜色 */
  color: var(--text-color-primary);
}
```

```less
.legacy-dialog {
  /* 兼容旧版 WebView 的滚动回弹缺陷 */
  -webkit-overflow-scrolling: touch;
}
```

#### 场景 2：空行只表达结构

空行只分隔真实选择器组或逻辑区，禁止连续、首尾、块内边缘及声明与相关嵌套之间的空行。

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

```less

.talent-card {

  width: 320px;


  padding: 16px;

}

```

#### 场景 3：应用声明分类顺序

声明依次为定位/溢出、交互、尺寸、外边距/内边距、背景/边框/效果、文字/颜色、布局、动画，嵌套选择器最后。

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

#### 场景 4：合并重复选择器块

同一子选择器的间距、边框、布局和状态修改合并到最近拥有者下。

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

#### 场景 5：使用受支持的兼容性回退

先检查 Browserslist 和构建转换；目标不支持新特性时使用项目已有的状态类或批准回退。

```less
.form-field:has(.form-field-error-message) {
  border-color: var(--color-danger);
}
```

```less
.form-field {
  &.form-field-error {
    border-color: var(--color-danger);
  }
}
```

#### 场景 6：只格式化修改过的样式文件

仅格式化修改过的样式文件，并恢复任务范围外的纯格式变化。

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
