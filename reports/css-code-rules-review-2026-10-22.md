# css-code-rules 完整审阅报告

审阅日期：2026-10-22（Asia/Shanghai）。

本报告依据当前工作区的 `SKILL.md`、14 个 reference 和 UI 元数据重新生成。正文按现行 14 条核心规则排列，保留当前 reference 的全部代码示例，并以中文说明适用条件、例外和正反写法。

审阅重点是本轮精简是否保留规则完整性。报告中的规则以来源文件为准；代码块仅翻译界面文案，注释与现行示例一致。反例用于展示违规写法，局部片段不等同于可运行应用。

## 一、适用范围与执行要求

### 1. 适用范围

适用于 CSS、Less、Sass、SCSS 和 Vue style 块的编写、修改、重构、审查及调试。Vue 文件中的模板与脚本同时发生变化时，还需按对应技能处理；本报告聚焦样式规则。

### 2. 修改范围与优先级

这些是强制要求。只处理本次新增、修改、审查涉及的样式及必要的直接关联修复，不为统一风格迁移无关样式。旧代码写法不能自动成为复制违规写法的依据。

高优先级指令优先；项目惯例仅在规则明确授权由配置决定时覆盖相应要求。不能满足某条规则时，采用最小必要偏离，并说明具体冲突。引入 CSS 自定义属性或 `var(...)` 必须有实际需要，并核实所引用属性确实存在且受实际库版本或运行环境支持。

### 3. 修改前的检查

查看目标 DOM、所属组件、邻近样式、全局 reset、预处理器、PostCSS、目标浏览器及格式化/lint 配置。以真实渲染结构、所有权关系和生效工具配置决定写法。

入口文件不是全部规则。按问题完整读取相关引用，每个适用任务至少读取一个；没有精确匹配时读取最接近的引用，不确定时读取。引用中的要求同样有约束力。

### 4. 修改后的检查

逐行对照适用条款和引用检查清单。记录内联样式非空行数及复杂度信号，达到强制提取条件时必须提取；存在预览或既有视觉测试时验证受影响状态。

运行最小必要的定向 formatter、style lint、构建或相关测试，不改写无关文件。无法执行的检查要明确说明，语法或格式通过不能代替布局、归属和兼容性审查。

### 5. 条款索引

- [CSS 1：样式语言选择与原有偏好保留](#css-1)
- [CSS 2：样式归属与强制提取阈值](#css-2)
- [CSS 3：简洁缩写命名与类名长度控制](#css-3)
- [CSS 4：按 DOM 顺序嵌套与共同父级混合复用](#css-4)
- [CSS 5：deep 指明目标并合并库内部归属](#css-5)
- [CSS 6：一维使用 Flexbox，二维考虑 Grid](#css-6)
- [CSS 7：仅针对组件库的样式定制](#css-7)
- [CSS 8：禁止重复重置、默认值与无效属性](#css-8)
- [CSS 9：常规样式不写注释](#css-9)
- [CSS 10：组件根内连续书写，不插空行](#css-10)
- [CSS 11：同类属性连续分组与声明顺序](#css-11)
- [CSS 12：合并重复选择器](#css-12)
- [CSS 13：浏览器与构建兼容性](#css-13)
- [CSS 14：定向格式化与最终差异检查](#css-14)

## 二、按顺序审阅 14 条规则

<a id="css-1"></a>

### CSS 1：样式语言选择与原有偏好保留

**独立 reference：** [stylesheet-language-examples.md](/D:/desktop/coding-skill/css-code-rules/references/stylesheet-language-examples.md)

选择样式预编译语言时，优先遵循项目已经统一的语言约定。修改已有组件时，保留该组件原来的 CSS、Less、Sass 或 SCSS 写法及作用域机制，不为了匹配新的默认偏好而迁移语言。

新增组件时，先遵循项目统一约定；没有统一约定决定选择时，只有项目已经支持 Less，或者项目尚未安装任何样式预处理器，才选择 Less。仅支持其他预处理器且不支持 Less 时，沿用项目已支持的偏好。没有安装预处理器而选择 Less 时，应先补齐依赖和构建支持，再编译 Less 样式。

**对应示例与适用边界：**

#### 场景 1：选择预处理器并保留原有样式

场景：为新增组件选择样式语言，或修改已有组件。选择前先检查项目统一约定、已安装的预处理器和生效的构建配置。

| 情况 | 应采用的选择 |
| --- | --- |
| 修改已有 SCSS、Sass、Less 或 CSS 组件 | 保留该组件原来的语言，即使项目当前默认值不同 |
| 新增组件，项目已统一使用 SCSS、Sass 或 Less | 优先遵循统一约定，即使同时安装了其他预处理器 |
| 新增组件，没有统一约定，但已支持 Less | 选择 Less |
| 新增组件，没有统一约定，且没有安装任何预处理器 | 选择 Less，先补齐依赖与构建支持 |
| 新增组件，没有统一约定，且仅支持其他预处理器 | 沿用已支持的偏好，不单纯因为个人偏好引入 Less |

**正例：**

修改已有 SCSS 组件时保留 SCSS。项目统一使用 SCSS 时，新增组件同样采用该形式：

```vue
<style lang="scss" scoped>
@use './index.scss';
</style>
```

没有统一约定的新增组件，项目已支持 Less 或尚未安装预处理器时选择 Less。后一种情况需要先建立 Less 编译支持，再使用：

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

保留现有作用域机制、共享变量及有效的预处理器语法。新增组件时，项目统一的 SCSS 约定优先于“已经安装 Less 依赖”这一条件。

**反例：**

上方 Less 写法在以下情况下属于反例：仅凭个人偏好替换已有 SCSS；违背项目对其他预处理器的统一约定；或者在编译支持就绪前直接输出 Less。

<a id="css-2"></a>

### CSS 2：样式归属与强制提取阈值

**独立 reference：** [style-scope-and-extraction-examples.md](/D:/desktop/coding-skill/css-code-rules/references/style-scope-and-extraction-examples.md)

普通 Vue 组件样式沿用项目的 scoped、CSS Modules 等作用域机制。选择 Less 且编译支持就绪时，普通 scoped 形式为 `<style lang="less" scoped>`。真实全局规则或根节点之外渲染的内容，可使用恰当的 unscoped 规则。

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

#### 场景 1：选择 scoped 或 unscoped Vue 样式

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
    color: #303133;
  }
}
</style>
```

为 Teleport 内容设置完整业务根，在 unscoped 块中处理：

```vue
<style lang="less">
.talent-select-popper {
  .talent-select-popper-option {
    color: #303133;
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

#### 场景 2：提取复杂组件样式

场景：内联样式满足上方任一强制提取条件。即使组件仅使用一次，也必须提取。

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

#### 场景 3：放置全局与组件自有规则

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
    border-radius: 8px;
  }
}
```

只有覆盖有意作用于全应用所有匹配库组件时，才移入全局库覆盖文件。来自库内部不代表规则就应全局生效，应用范围才决定归属。

**反例：**

不要把相同的一次性表单覆盖移到全局样式入口 `src/styles/element-plus.less`：

```less
.el-input__wrapper {
  border-radius: 8px;
}
```

<a id="css-3"></a>

### CSS 3：简洁缩写命名与类名长度控制

**独立 reference：** [naming-examples.md](/D:/desktop/coding-skill/css-code-rules/references/naming-examples.md)

每个组件必须使用简洁且能识别业务的根类，所属选择器位于其下。Teleport 内容可另设简洁业务根，避免 popper/option 等通用全局类。

项目自有类名强制采用简洁命名和统一、清晰的业务缩写，控制类名长度；使用 block-element-modifier 的单连字符结构，不使用双下划线或双连字符。第三方库类名保持原样。命名仍需标识组件、元素或状态，不用纯视觉名、任意后缀链或祖先路径堆叠。

从命名开始就使用仓库或功能词汇表中的约定缩写，不再把缩写作为类名过长后的可选补救。没有既有映射时，先在功能内明确缩写并统一使用。删除冗余所有权词、重复业务词和无意义后缀；简短的结构词、状态词保持可读，不用含糊字母串换取长度。

**对应示例与适用边界：**

#### 场景 1：命名组件根、元素和状态

场景：候选人卡片包含头部、标题、操作、选中及禁用状态。

**正例：**

使用有业务含义的根类与完整单连字符 BEM 类名：

```less
.cand-card {
  .cand-card-header {
    .cand-card-title {
      color: #303133;
    }
  }
  .cand-card-action {
    cursor: pointer;
  }
  &.cand-card-selected {
    border-color: #409eff;
  }
  &.cand-card-disabled {
    cursor: not-allowed;
    .cand-card-action {
      pointer-events: none;
    }
  }
}
```

下方反例中的表头应使用业务限定类名，不附带视觉后缀：

```less
.cand-table {
  .cand-table-header {
    color: #f56c6c;
  }
}
```

**反例：**

避免通用根、双下划线/双连字符 BEM、纯视觉命名和任意后缀链：

```less
.card {
}

.cand-card__header {
}

.cand-card--selected {
}

.table-box-header-red {
}
```

即使颜色、位置或实现改变，类名仍应表达业务角色。

#### 场景 2：强制简洁缩写命名

场景：人力资源招聘功能包含候选人评估面板。反复拼接全部领域、页面、组件、元素及视觉角色，会使类名越来越长。

**正例：**

候选人评估统一采用 cand-eval 的简洁业务形式，不在每个类名中重复完整单词：

```vue
<div class="cand-eval">
  <div class="cand-eval-header">
    <span class="cand-eval-title">候选人评估</span>
  </div>
</div>
```

```less
.cand-eval {
  .cand-eval-header {
    display: flex;
    .cand-eval-title {
      color: #303133;
    }
  }
}
```

确实需要人力资源与招聘上下文区分所有者时，只保留必要限定，并使用一套明确缩写映射：

| 业务词语 | 示例缩写 | 可读性条件 |
| --- | --- | --- |
| 人力资源（human resources） | hr | 仓库统一使用 HR 术语 |
| 招聘（recruitment） | rec | 功能词汇表明确 rec 表示招聘，并统一使用 |
| 候选人（candidate） | cand | 功能词汇表使含义明确 |
| 评估（evaluation） | eval | 对评估统一使用该缩写 |

确需上述限定时，采用 `hr-rec-cand-eval`、`hr-rec-cand-eval-header`、`hr-rec-cand-eval-title`，沿用上方的 DOM 所有权结构。同一子树内同一业务词不能混用全称与缩写。

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
.hr-rec-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

#### 场景 3：命名 Teleport 根节点

场景：筛选面板将浮层渲染到组件根节点之外。

**正例：**

两个顶层根有效，因为它们属于分离的渲染树：

```less
.cand-filter {
}

.cand-filter-popper {
  .cand-filter-popper-option {
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

<a id="css-4"></a>

### CSS 4：按 DOM 顺序嵌套与共同父级混合复用

**独立 reference：** [dom-nesting-examples.md](/D:/desktop/coding-skill/css-code-rules/references/dom-nesting-examples.md)

1. 嵌套层级和子分支排列顺序必须跟随实际 DOM。子选择器不得漂浮到其父级之外；不得为了减少嵌套深度跳过中间父级 DOM，牺牲结构可读性。
2. 组件内部存在真实复用时，先在最近共同 DOM 祖先对应的选择器作用域顶部定义聚焦、不直接输出 CSS 的 mixin，再在各消费者原有嵌套位置调用。不得为了复用把消费者提升到父级之外或扁平化选择器。
3. 先声明所属元素，再在内部通过 & 展开伪元素和伪类。共享条件单独成分支，再在内部嵌套交互状态，严格采用下方提供的错误/正确写法。业务状态影响的后代也保留完整 DOM 父级链。
4. 直接子选择器仅在稳定边界确实用于避免误匹配时使用 & >，不能以裸 > 开头。
5. 下方示例展示预编译语言写法。原生 CSS 的具体实现由 agent 按项目配置与浏览器支持自行判断，不规定固定回退模板。

**对应示例与适用边界：**

#### 场景 1：按实际 DOM 层级与顺序嵌套

场景：标题位于头部内，摘要位于主体内，DOM 中头部先于主体。

```vue
<div class="cx-container">
  <div class="cx-container-header">
    <span class="cx-container-title">标题</span>
  </div>
  <div class="cx-container-body">
    <span class="cx-container-summary">摘要</span>
  </div>
</div>
```

**正例：**

保留完整父级链，并按 DOM 顺序排列子分支：

```less
.cx-container {
  .cx-container-header {
    .cx-container-title {
      color: #303133;
    }
  }
  .cx-container-body {
    .cx-container-summary {
      color: #606266;
    }
  }
}
```

**反例：**

不得让子选择器漂浮在其 DOM 父级之外：

```less
.cx-container-title {
  color: #303133;
}
```

不得仅为减少嵌套深度跳过头部父级：

```less
.cx-container {
  .cx-container-title {
    color: #303133;
  }
}
```

样式嵌套由实际 DOM 层级决定，不能因为父级看似没有职责或层级较深而跳过。DOM 本身存在无意义层级时，只能在授权修改范围内处理 DOM，不得通过扁平化选择器隐藏实际结构。

#### 场景 2：判断直接子选择器是否必要

场景：菜单只给自身条目加分隔线，嵌套子菜单也包含相同 menu-item 类。

**正例：**

直接子边界避免父菜单样式命中嵌套子菜单条目：

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid #dcdfe6;
  }
}
```

没有误匹配风险的普通后代，使用正常嵌套：

```less
.talent-card {
  .talent-card-title {
    color: #303133;
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

#### 场景 3：嵌套伪元素、伪类和条件

先声明所属元素，再用 & 嵌套伪元素和伪类。共享条件先形成分支，再在内部展开交互状态。空块只用于展示结构要求。

**错误写法：**

```less
.cx-container {
  .cx-container-header {
    .cx-container-title::after {
    }
    .cx-container-title:hover {
    }
    .cx-container-title:not(.a):not(.b):hover {
    }
  }
}
```

**正确写法：**

```less
.cx-container {
  .cx-container-header {
    .cx-container-title {
      &::after {
      }
      &:hover {
      }
      &:not(.a):not(.b) {
        &:hover {
        }
      }
    }
  }
}
```

不得在父级中为每个伪分支重复所属类名。&::after、&:hover 和条件块都放入 .cx-container-title 内；&:not(.a):not(.b) 内继续嵌套 &:hover，不把条件与交互全部平铺在父分支。

业务状态使用完整状态类连接所有者；状态影响的后代仍保留实际 DOM 的完整父级路径：

```less
.cx-container {
  &.cx-container-active {
    .cx-container-header {
      .cx-container-title {
        color: #409eff;
      }
    }
  }
}
```

#### 场景 4：在共同 DOM 祖先作用域顶部定义混合

场景：场景 1 的标题与摘要复用文本省略样式，二者共同的 DOM 祖先是 .cx-container。

**正例：**

先在共同祖先选择器作用域顶部定义不直接输出 CSS 的 mixin，位于普通声明和子规则之前；各消费者沿实际 DOM 层级与顺序调用：

```less
.cx-container {
  .text-ellipsis() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cx-container-header {
    .cx-container-title {
      .text-ellipsis();
    }
  }
  .cx-container-body {
    .cx-container-summary {
      .text-ellipsis();
    }
  }
}
```

**反例：**

不得为了共享声明，把消费者移出各自的 header/body 父级，或合并到更浅的选择器下：

```less
.cx-container {
  .cx-container-title,
  .cx-container-summary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
```

组件内部存在真实重复时，优先在最近共同 DOM 祖先作用域顶部定义混合再使用。复用不能成为跳过父级或漂浮子选择器的理由。已有应用级工具继续保留在既有共享层。

<a id="css-5"></a>

### CSS 5：deep 指明目标并合并库内部归属

**独立 reference：** [deep-selector-examples.md](/D:/desktop/coding-skill/css-code-rules/references/deep-selector-examples.md)

支持嵌套的 scoped 样式使用 `&:deep(具体选择器)`，不能空写 deep。共享库内部父节点的多个覆盖，在最近合适共同父节点上使用一次 deep，后代、伪类、伪元素继续嵌套，不重复 deep。

只有不存在业务根以下合适的库内部共同祖先时，才使用多个并列 deep 块；不扁平化散落或用逗号拼散覆盖。

原生 CSS 的实现方式交由 agent 根据项目配置和浏览器支持自行判断，本条不提供原生 CSS 示例或指定回退模板。

**对应示例与适用边界：**

#### 场景 1：合并第三方库 deep 选择器

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

<a id="css-6"></a>

### CSS 6：一维使用 Flexbox，二维考虑 Grid

**独立 reference：** [layout-examples.md](/D:/desktop/coding-skill/css-code-rules/references/layout-examples.md)

一维布局使用 Flexbox；只有需要行、列两个方向协同对齐的二维布局，才考虑使用 Grid。

**对应示例与适用边界：**

#### 场景 1：一维使用 Flexbox，二维考虑 Grid

场景：一行内容沿单一轴排列；日程矩阵则需要时间行与星期列协同对齐。

**正例：**

一维行布局使用 Flexbox：

```less
.talent-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

二维日程矩阵可以考虑 Grid：

```less
.schedule-matrix {
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  gap: 8px;
}
```

依据布局的维度关系选择：沿行或列排列的一维结构使用 Flexbox，需要行列协同对齐时才考虑 Grid。

**反例：**

不要为相同的一维行布局选择 Grid：

```less
.talent-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
}
```

<a id="css-7"></a>

### CSS 7：仅针对组件库的样式定制

**独立 reference：** [library-customization-examples.md](/D:/desktop/coding-skill/css-code-rules/references/library-customization-examples.md)

本条只针对第三方组件库的样式定制，不对其他普通业务样式增加此类要求。定制组件库时，优先采用已确认受所用版本支持的正式变量接口，或普通 scoped/deep 选择器，避免无必要地增加优先级和 important。

**对应示例与适用边界：**

#### 场景 1：局部定制组件库

场景：定制 Element Plus 弹窗。确认所用版本的文档明确支持并实际消费 `--el-dialog-border-radius`，且变量设置在实际渲染的所属元素上。

**正例：**

在正确的组件根设置正式变量：

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

组件库没有可用的正式变量接口时，再使用能可靠命中目标的最小普通嵌套或 deep 选择器。覆盖前核实所用库版本、文档和渲染 DOM。

<a id="css-8"></a>

### CSS 8：禁止重复重置、默认值与无效属性

**独立 reference：** [ineffective-declaration-examples.md](/D:/desktop/coding-skill/css-code-rules/references/ineffective-declaration-examples.md)

本条只强调移除和禁止编写无效、冗余的 CSS 属性。全局 reset、父级继承或浏览器规则已经为当前元素提供相同有效值时，禁止在组件中再次声明；当前布局中不起作用，或被后续声明无条件覆盖且没有回退作用的属性，也应删除。

重点检查 box-sizing、margin、padding、font-size、font-family 等，而不是在每个组件中重新复制全局基础样式。只有实际改变所需结果的声明才有保留意义。应依据匹配规则、继承和各目标状态的计算结果判断，不能把所有元素的默认字号、字体、间距或 display 想成相同值。

#### 常见重复或无效声明清单

以下是应检查的常见项和示例值，不是统一的浏览器默认值，也不是要求项目采用的一份 reset。只有确认已有相同有效结果或当前属性确实无效时，才禁止重复编写。

| 类别 | 尽量检查的属性或声明 | 禁止重复的前提 |
| --- | --- | --- |
| 盒模型 | box-sizing: border-box | 全局 reset 已命中当前元素；border-box 并非浏览器统一初始值 |
| 外边距 | margin、四个方向的 margin、margin-block、margin-inline 及其 start/end 属性 | 已生效的 reset 或规则提供了相同间距 |
| 内边距 | padding、四个方向的 padding、padding-block、padding-inline 及其 start/end 属性 | 已经存在相同的有效内边距 |
| 字体与字号 | font-family、font-size、font | 当前元素已继承或被 reset 设置为相同结果；表单控件与标题应单独核实 |
| 其他字体属性 | font-weight、font-style、font-variant、font-stretch、line-height | 继承或匹配规则已经给出相同结果 |
| 文本属性 | color、text-align、text-indent、text-transform、letter-spacing、word-spacing、white-space、word-break、overflow-wrap | 相同值已经由继承或其他规则提供 |
| 列表 | list-style、list-style-type、list-style-position、list-style-image | 当前列表已命中相同 reset；不能假定所有列表默认没有标记 |
| 边框 | border、border-width、border-style、border-color 及各方向边框属性 | 重复已有 reset，或对所需边框结果没有独立影响 |
| 背景 | background-color: transparent、background-image: none、重复的 background 值 | 省略后背景和目标状态完全相同，没有实际覆盖需求 |
| 视觉效果 | border-radius: 0、box-shadow: none、text-shadow: none、opacity: 1、transform: none、filter: none | 有效值本来如此，且未承担状态覆盖 |
| 定位与文档流默认值 | position: static、float: none、clear: none、z-index: auto、overflow: visible | 当前元素本来就是这些有效值，没有覆盖需求 |
| 尺寸默认行为 | width: auto、height: auto、max-width: none、max-height: none | 仅重复元素已有的有效尺寸行为 |
| 动画默认行为 | animation: none、transition: none、零延迟或零时长 | 没有覆盖已有动画、过渡或所需交互状态 |
| 元素 display | 例如普通未改样式 div 的 display: block | 元素实际 display 已相同；不同元素默认 display 不同 |
| 定位偏移 | top、right、bottom、left、inset | 当前定位上下文使其无效，例如普通静态定位元素 |
| 层叠 | z-index | 用在不支持该层叠效果的普通未定位元素上，且并非 flex/grid 子项 |
| Flex/Grid 子项属性 | flex、flex-grow、flex-shrink、flex-basis、order、grid-row、grid-column | 目标不是相应布局子项，或该属性在实际上下文中不产生作用 |
| 对齐与间距 | align-items、justify-content、align-self、gap、row-gap、column-gap | 当前布局上下文不支持所请求的效果 |
| 行内与替换元素相关 | vertical-align、object-fit、object-position | 例如普通块级元素的 vertical-align、非替换 div 的 object-fit 不适用 |
| 重复与覆盖 | 重复属性、被后续简写覆盖的前置长写、等效值 | 前一项没有兼容回退、状态或其他独立作用 |

**对应示例与适用边界：**

#### 场景 1：不重复全局重置与已继承值

假设项目已有下列生效的全局 reset 和 body 字体设置，目标 .cand-card 是继承 body 字体的普通 div。这里的具体数值只用于提供示例前提，不是要求项目采用的全局规范，也不是浏览器统一默认值。

```less
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
}
```

**反例：**

不要在组件里复制已经命中的 reset 和继承值：

```less
.cand-card {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
}
```

**正例：**

只保留会改变结果的卡片圆角：

```less
.cand-card {
  border-radius: 8px;
}
```

该 div 已具备相同盒模型、外边距、内边距、字体、字号、行高和颜色，因此这些重复声明禁止再次编写。

#### 场景 2：不复述已生效的浏览器默认行为

假设目标是普通块级 div，匹配规则与所有所需状态本来就产生下列默认行为；没有背景、边框、动画、透明度或变换覆盖。组件真正需要的只有 12px 内边距。

**反例：**

```less
.cand-panel {
  position: static;
  float: none;
  clear: none;
  overflow: visible;
  padding: 12px;
  background-color: transparent;
  background-image: none;
  border-style: none;
  border-radius: 0;
  box-shadow: none;
  display: block;
  opacity: 1;
  transform: none;
  animation: none;
  transition: none;
}
```

**正例：**

```less
.cand-panel {
  padding: 12px;
}
```

不要为了让样式块看起来完整而补齐默认值。如果某声明确实覆盖了祖先、全局、浏览器或状态规则，并改变所需结果，它就不是冗余声明。

#### 场景 3：删除当前布局不适用的属性

假设 .cand-card-title 是 .cand-card 内的普通静态定位块级 div；两者都不是 Flex/Grid 容器，标题也不是替换元素。组件只需要标题的 8px 内边距。

**反例：**

```less
.cand-card {
  .cand-card-title {
    top: 0;
    left: 0;
    z-index: 1;
    padding: 8px;
    vertical-align: middle;
    flex-grow: 1;
    flex-basis: 0%;
    grid-column: 1 / 3;
    object-fit: cover;
  }
}
```

**正例：**

```less
.cand-card {
  .cand-card-title {
    padding: 8px;
  }
}
```

这个静态且并非 Flex/Grid 子项的普通 div 不受上述偏移和 z-index 影响；Flex/Grid 布局属性、vertical-align、object-fit 在这里也不起作用。换成其他上下文时这些属性可能有效，因此判断针对实际元素，不是禁止属性名称本身。

<a id="css-9"></a>

### CSS 9：常规样式不写注释

**独立 reference：** [style-comment-examples.md](/D:/desktop/coding-skill/css-code-rules/references/style-comment-examples.md)

不添加常规区域标题、选择器说明、声明翻译、注释掉的旧代码及重复样式含义的注释。

只有非显然兼容性 workaround、库约束或临时例外无法通过命名和结构表达时，才添加简短中文注释解释必要原因；项目明确要求其他语言或精确外部术语需要时除外。

**对应示例与适用边界：**

#### 场景 1：判断注释是否必要

场景：选择器仅有含义明确的颜色声明。

**正例：**

直接写规则，不逐行叙述：

```less
.talent-card {
  color: #303133;
}
```

非显然的外部约束无法由结构和命名表达时，可以添加简洁中文说明。本场景的受支持旧版 iOS WebView 需要该前缀属性才能提供惯性滚动：

```less
.legacy-dialog {
  /* 兼容旧版 iOS WebView 的惯性滚动。 */
  -webkit-overflow-scrolling: touch;
}
```

**反例：**

不要添加区域标签或复述相同声明的注释：

```less
/* 卡片样式。 */
.talent-card {
  /* 设置正文颜色。 */
  color: #303133;
}
```

注释必须说明特殊声明为何存在。移除被注释掉的代码，版本控制已经保留历史。

<a id="css-10"></a>

### CSS 10：组件根内连续书写，不插空行

**独立 reference：** [blank-line-examples.md](/D:/desktop/coding-skill/css-code-rules/references/blank-line-examples.md)

组件样式正文连续书写：声明、子节点、兄弟节点、伪类、状态、deep 以及混合定义和调用之间都不插空行，层级通过缩进和大括号表达。

组件根内部不因“逻辑分组”或文件较长而留空行；文件开头、结尾和块内边缘也不添加空白行。只在真正独立的顶层样式根之间，按需要保留最多一个分隔空行。文件末尾保留正常换行即可。

**对应示例：**

#### 正例 1：声明、父子与兄弟节点连续

声明后直接进入子选择器；header、body 等兄弟分支之间也不插空行。

```less
.cand-card {
  padding: 16px;
  background: #fff;
  .cand-card-header {
    height: 40px;
    display: flex;
    align-items: center;
    .cand-card-title {
      font-weight: 600;
    }
  }
  .cand-card-body {
    padding: 12px 0;
  }
}
```

#### 正例 2：伪类与状态分支连续

根声明、hover 分支和业务状态分支相邻，状态不同也不靠空行分隔。

```less
.cand-card {
  cursor: pointer;
  border: 1px solid #dcdfe6;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  &.cand-card-active {
    border-color: #409eff;
  }
}
```

#### 正例 3：deep 与库内部层级连续

假设已确认库 DOM 与下方层级一致；deep 块及其后代、相邻 deep 块均不留空行。

```less
.cand-form {
  &:deep(.el-input) {
    .el-input__wrapper {
      padding: 0 12px;
      .el-input__inner {
        height: 36px;
      }
    }
  }
  &:deep(.el-select) {
    .el-select__wrapper {
      height: 36px;
    }
  }
}
```

#### 正例 4：混合定义、声明和调用连续

混合依旧定义在共同 DOM 祖先顶部，但定义结束后不插空行；后续声明及消费者也连续排列。

```less
.cand-row {
  .center() {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  display: flex;
  gap: 8px;
  .cand-row-avatar {
    height: 32px;
    width: 32px;
    .center();
  }
  .cand-row-action {
    cursor: pointer;
    height: 32px;
    width: 32px;
    .center();
  }
}
```

#### 反例：组件内部用空行分组

不能为了分隔属性或兄弟节点而在组件根内部插入空行：

```less
.cand-card {

  padding: 16px;


  display: flex;

  .cand-card-title {

    font-weight: 600;

  }

  .cand-card-desc {
    line-height: 24px;
  }

}
```

<a id="css-11"></a>

### CSS 11：同类属性连续分组与声明顺序

**独立 reference：** [property-order-examples.md](/D:/desktop/coding-skill/css-code-rules/references/property-order-examples.md)

按属性控制的元素表现分组，同一类 CSS 必须连续放在一起，不被其他类别打断，不按字母顺序排列。以你提供的样例为基准：定位与 transform → 交互 → 尺寸/溢出/内容适配 → margin/padding → 视觉 → 文字 → transition/animation → display/布局。

重点要求：transform 跟随定位组；height 及其约束先于 width 及其约束；背景、边框、圆角、阴影连续；文字属性连续；过渡和动画连续且位于布局之前；display 与 Flex/Grid、对齐、gap 连续放在最后。

缺少某类需求就省略，不为凑顺序添加属性或重复 reset/默认值。分组靠排列体现，不增加分类注释或装饰性空行。局部不输出 CSS 的 mixin 定义仍位于共同 DOM 祖先顶部，调用放在其输出属性所属的位置；嵌套选择器放在拥有者声明之后。

整理时保留简写/长写优先级和有效兼容回退，不为排序改变行为。生效的 Stylelint 强制其他顺序时，遵循实际配置并说明局部冲突。

#### 属性分组对照

| 顺序 | 类别 | 常见属性与位置 |
| --- | --- | --- |
| 声明之前 | 局部、不直接输出 CSS 的混合定义 | 放在共同 DOM 所有者顶部，不漂浮成无归属全局工具 |
| 1 | 定位、层叠与变换 | position，left/right/top/bottom/inset，z-index，transform，transform-origin |
| 2 | 交互 | cursor，pointer-events，user-select，touch-action，resize |
| 3 | 尺寸、溢出与内容适配 | height 及其最小/最大约束，再到 width 及其约束；aspect-ratio，box-sizing，overflow，object-fit，object-position |
| 4 | 外内间距 | margin 及方向/逻辑属性，再到 padding 及方向/逻辑属性 |
| 5 | 视觉表现 | background 组、border 组、border-radius、box-shadow、opacity、filter |
| 6 | 字体与文本 | font 组、line-height、color、text-align、text-overflow、white-space、字词间距 |
| 7 | 动效 | transition 组、animation 组 |
| 8 | 布局 | display，Flex 组、Grid 组，对齐组，gap 组 |
| 声明之后 | 嵌套选择器 | DOM 子节点、所属元素的伪元素/伪类及状态分支 |

以下保留 5 个正例和 1 个乱序反例，覆盖整体排序、状态分支、文本截断、图片适配及 mixin 调用位置。所有示例使用 Less；具体属性必须对目标元素有实际作用，不要求补齐全部分类。原生 CSS 的实现仍按项目配置判断。

#### 正例 1：用户提供的返回按钮

保留你提供的属性排列。这里假设按钮确有重置背景、边框和内边距的需要；实际代码仍应删除已由全局规则提供的重复值。

```less
.map-editor-back {
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  height: 32px;
  width: 32px;
  padding: 0;
  background: transparent;
  border: 0;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 正例 2：带交互状态的按钮

根声明和 hover/禁用分支分别保持同类相邻；hover 中 transform 在背景之前，禁用分支中 cursor 在 opacity 之前。

```less
.map-btn {
  cursor: pointer;
  height: 36px;
  padding: 0 16px;
  background: #409eff;
  border: 0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  transition: background-color 160ms ease, transform 160ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:hover {
    transform: translateY(-1px);
    background: #337ecc;
  }
  &.map-btn-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
```

#### 正例 3：单行文本省略

overflow 属于尺寸与裁剪组；text-overflow、white-space 与文字排版属性放在一起。

```less
.cand-name {
  width: 180px;
  overflow: hidden;
  font-size: 16px;
  line-height: 24px;
  color: #606266;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

#### 正例 4：图片裁剪

针对 img 等替换元素，尺寸与内容适配放在一起，再设置圆角。

```less
.cand-img {
  height: 96px;
  width: 144px;
  object-fit: cover;
  object-position: 50% 30%;
  border-radius: 8px;
}
```

#### 正例 5：mixin 定义与调用的位置

假设 DOM 中 header、body 是 cx-container 的直接子节点。共同父级顶部定义混合；这个混合只输出布局属性，因此调用放在各消费者声明的布局位置，不跳过父级。

```less
.cx-container {
  .center() {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  position: relative;
  padding: 16px;
  border: 1px solid #dcdfe6;
  .cx-container-header {
    height: 40px;
    background: #f5f7fa;
    .center();
  }
  .cx-container-body {
    height: 160px;
    .center();
  }
}
```

#### 反例：相同表现类别被打散

```less
.map-editor-back {
  display: flex;
  position: absolute;
  background: transparent;
  align-items: center;
  left: 32px;
  height: 32px;
  transition: 0.3s;
  top: 50%;
  width: 32px;
  justify-content: center;
  transform: translateY(-50%);
  border: 0;
  cursor: pointer;
  padding: 0;
}
```

这组属性与正例 1 相同，但定位、尺寸、视觉和布局穿插出现。同类属性应按正例 1 连续放置，不修改属性值来迁就顺序。

<a id="css-12"></a>

### CSS 12：合并重复选择器

**独立 reference：** [selector-consolidation-examples.md](/D:/desktop/coding-skill/css-code-rules/references/selector-consolidation-examples.md)

同一 DOM 所有者下重复出现的选择器应合并，相关的间距、边框、布局和状态声明集中管理。不按属性类别拆成多个重复块，不跳过父级或制造漂浮子规则；合并时保留有意的层叠语义。

#### 场景 1：合并重复选择器块

场景：同一子选择器为了间距、边框和布局修改被重复声明。

**正例：**

在实际 DOM 父级下合并，并保留 DOM 层级：

```less
.talent-card {
  .talent-card-header {
    padding: 12px 16px;
    border-bottom: 1px solid #dcdfe6;
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
  border-bottom: 1px solid #dcdfe6;
}

.talent-card-header {
  display: flex;
  align-items: center;
}
```

同一个业务状态的子元素变化也集中在父状态块中。只有多个真实消费者共享行为才提取抽象；单纯合并不自动构成 mixin 理由。

<a id="css-13"></a>

### CSS 13：浏览器与构建兼容性

**独立 reference：** [compatibility-examples.md](/D:/desktop/coding-skill/css-code-rules/references/compatibility-examples.md)

新增样式 API、选择器、单位或属性前，核实真实浏览器目标及构建工具支持。支持不足时采用项目认可的回退并验证受影响目标，不仅凭语法熟悉程度判断支持。

#### 场景 1：采用受支持的兼容回退

场景：某个简洁现代选择器能简化表单错误样式，但仓库目标浏览器可能不支持。

**正例：**

目标矩阵不支持该选择器时，由组件逻辑提供项目认可的状态类：

```less
.form-field {
  &.form-field-error {
    border-color: #f56c6c;
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
  border-color: #f56c6c;
}
```

状态类回退只是示例，不代表 has 选择器一律不受支持；由仓库真实目标决定。

<a id="css-14"></a>

### CSS 14：定向格式化与最终差异检查

**独立 reference：** [formatting-and-review-examples.md](/D:/desktop/coding-skill/css-code-rules/references/formatting-and-review-examples.md)

只格式化本次修改文件；依据格式化前内容恢复无关格式变化，保留用户已有编辑。最后核对适用规则及差异，不能把格式化成功等同于架构或兼容性通过。未运行的检查、失败检查及未触及历史格式造成的限制应明确说明。

#### 场景 1：只格式化修改的样式文件

场景：任务修改 src/components/talent-card/index.less，而其他无关样式已存在格式差异。

**正例：**

仓库配置的 formatter 只处理修改文件，不格式化整个样式目录，以免覆盖无关用户编辑并掩盖功能差异。

```text
prettier --write src/components/talent-card/index.less
```

保留格式化前内容，依据该版本恢复影响范围之外的纯格式变化，保留已有用户编辑，不重置到 HEAD。保留新语法必需的格式调整。整文件检查仍只因未修改历史格式失败时，应报告限制，不静默扩大范围。

格式化后，复核通用 formatter 无法强制的规则：

- 实际 DOM 父级层级、子分支顺序及共同祖先混合定义位置。
- deep 合并正确。
- 组件根内无空行；独立顶层根之间最多一行。
- 声明分类顺序符合要求。
- 重复选择器块与冗余声明已处理。
- 目标浏览器兼容性。

格式化成功确认语法和配置格式，不代表架构合规。

**反例：**

不要把相同格式化任务扩大到所有样式文件：

```text
prettier --write "src/**/*.less"
```

## 三、本轮精简与保留决策

本轮仅调整 9 个 reference，相对本轮修改前版本净减少 243 行、约 8,526 个字符。按英文和样式代码的字符密度估算，约减少 2,100—2,600 tokens；这是估算值，未使用目标模型 tokenizer 精确计数，按需加载时的实际节省取决于读取哪些文件。

- 属性排序从 14 个场景缩为 6 个；完整属性分类表、排序规则、状态分支、文本与 overflow 的归属、图片 fitting、mixin 定义/调用位置和乱序反例均保留。
- 命名保留一套完整 HTML/Less 对照、缩写映射表及必要名称举例，删除重复的完整限定名称实现；禁止通用根、双分隔符、不透明缩写、混用缩写和冗长祖先链的反例仍保留。
- 语言选择以完整优先级表表达全部分支，不重复同一 Less 代码块；作用域引用语言选择规则，提取阈值、复杂度计数、私有子组件目录转换和 scoped 导入方式均保留。
- 合并格式化恢复流程及重复说明，移除面向示例维护者的要求和不影响决策的历史说明；注释示例仅保留规则演示所需的具体中文注释。
- 用户已确认：保留空行 reference 的普通嵌套、状态、deep、mixin 四个正例；保留无效声明 reference 的三组现有反例，不缩减同类属性覆盖。

静态对照未发现本轮精简删除独立规则、适用条件或例外。此结论来自来源文件和差异核对，未进行独立 agent 行为测试。

## 四、14 条规则与 14 个独立 reference

14 条核心规则分别路由到 14 个主 reference。按任务完整读取全部相关文件，不确定时也读取；每个适用任务至少读取一个，没有精确匹配时读取最接近的文件。相关文件可共同适用于同一项修改。

| 规则 | 独立 reference |
| --- | --- |
| CSS 1 | [stylesheet-language-examples.md](/D:/desktop/coding-skill/css-code-rules/references/stylesheet-language-examples.md) |
| CSS 2 | [style-scope-and-extraction-examples.md](/D:/desktop/coding-skill/css-code-rules/references/style-scope-and-extraction-examples.md) |
| CSS 3 | [naming-examples.md](/D:/desktop/coding-skill/css-code-rules/references/naming-examples.md) |
| CSS 4 | [dom-nesting-examples.md](/D:/desktop/coding-skill/css-code-rules/references/dom-nesting-examples.md) |
| CSS 5 | [deep-selector-examples.md](/D:/desktop/coding-skill/css-code-rules/references/deep-selector-examples.md) |
| CSS 6 | [layout-examples.md](/D:/desktop/coding-skill/css-code-rules/references/layout-examples.md) |
| CSS 7 | [library-customization-examples.md](/D:/desktop/coding-skill/css-code-rules/references/library-customization-examples.md) |
| CSS 8 | [ineffective-declaration-examples.md](/D:/desktop/coding-skill/css-code-rules/references/ineffective-declaration-examples.md) |
| CSS 9 | [style-comment-examples.md](/D:/desktop/coding-skill/css-code-rules/references/style-comment-examples.md) |
| CSS 10 | [blank-line-examples.md](/D:/desktop/coding-skill/css-code-rules/references/blank-line-examples.md) |
| CSS 11 | [property-order-examples.md](/D:/desktop/coding-skill/css-code-rules/references/property-order-examples.md) |
| CSS 12 | [selector-consolidation-examples.md](/D:/desktop/coding-skill/css-code-rules/references/selector-consolidation-examples.md) |
| CSS 13 | [compatibility-examples.md](/D:/desktop/coding-skill/css-code-rules/references/compatibility-examples.md) |
| CSS 14 | [formatting-and-review-examples.md](/D:/desktop/coding-skill/css-code-rules/references/formatting-and-review-examples.md) |

## 五、当前技能展示信息

- 技能名称：css-code-rules。
- 界面显示名：CSS Code Rules。
- 短描述含义：应用强制性的 CSS 命名、布局和样式标准。
- 图标：assets/css3-logo.png；同目录另有 SVG 资源。
- 当前 agents/openai.yaml 仅包含展示信息与图标，没有额外执行流程。

## 六、完整性核对与文件快照

核对范围为 16 个来源文件：入口、14 个 reference 和 UI 元数据。14 条规则编号与路由完整，全部来源文件可读取。下表统计当前 reference 的代码围栏块；合计 72 个，与本报告逐条示例的数量及内容对应。仅界面文案按中文展示，不改变类名、属性、值及结构。

| 规则 | 代码围栏块数 | 对照结果 |
| --- | --- | --- |
| CSS 1 | 2 | 与当前 reference 一致 |
| CSS 2 | 11 | 与当前 reference 一致 |
| CSS 3 | 10 | 与当前 reference 一致 |
| CSS 4 | 12 | 与当前 reference 一致 |
| CSS 5 | 5 | 与当前 reference 一致 |
| CSS 6 | 3 | 与当前 reference 一致 |
| CSS 7 | 2 | 与当前 reference 一致 |
| CSS 8 | 7 | 与当前 reference 一致 |
| CSS 9 | 3 | 与当前 reference 一致 |
| CSS 10 | 5 | 与当前 reference 一致 |
| CSS 11 | 6 | 与当前 reference 一致 |
| CSS 12 | 2 | 与当前 reference 一致 |
| CSS 13 | 2 | 与当前 reference 一致 |
| CSS 14 | 2 | 与当前 reference 一致 |

检查结果：

- Skill 结构校验通过（`quick_validate.py`）。
- 42 个本地文件链接与内部锚点检查通过；`git diff --check` 通过。
- 本报告 14 个章节的代码围栏块与对应来源逐条核对通过；空行四个正例和无效声明三组反例均保留。
- 逐条核对规则适用范围、提取阈值、命名限制、DOM 与 mixin 层级、deep 例外、属性顺序、有效声明判断、兼容性和格式化边界，未发现本轮精简导致的独立规则丢失。
- 示例未在实际 Vue/预处理器工程中编译，未验证真实组件库 DOM 或浏览器表现；库版本、reset、DOM 和浏览器目标需在应用该 skill 时按实际项目核验。

以下指纹对应本次生成时的来源文件原始字节，用于识别报告是否落后于来源；它们不是规则正确性的证明。

| 文件 | 字节数 | SHA-256 |
| --- | --- | --- |
| css-code-rules/SKILL.md | 10393 | `53ff4ba1c2999d453727067f1e1fdaa1a300cfb7f51c0f988c2e1dc9ab0ccf93` |
| css-code-rules/references/stylesheet-language-examples.md | 2295 | `9041d31f8c2caccf5728d98e0c4a6e20f295eac6dda086bb153419692e21a18b` |
| css-code-rules/references/style-scope-and-extraction-examples.md | 6685 | `0a018afd45f59ac43f5e2bfcb295a6f5becf9f13126889e4c81c80b2e41875c8` |
| css-code-rules/references/naming-examples.md | 6158 | `794aff8fabf0b9dbe746fa7451a81fea70983d29d27ac566fe60af462f25541f` |
| css-code-rules/references/dom-nesting-examples.md | 7064 | `10c28b85b998816ae110eafd2835d85aafbb5e277069a571dd83f3bb4052982c` |
| css-code-rules/references/deep-selector-examples.md | 2729 | `b736942cc2802042b56a59ebfb24b02f35da9a9a77647ca4631ef10575a0106d` |
| css-code-rules/references/layout-examples.md | 1208 | `602bcd45c2f7518d46e836db4e3fea78bcdd79fa26ffd9877d903fc011ec64c9` |
| css-code-rules/references/library-customization-examples.md | 1411 | `f3c3658306fc86d6efdc9530b43c7e4f8ec4a0a46683d5acc6eaf47b7c77d7a5` |
| css-code-rules/references/ineffective-declaration-examples.md | 8676 | `77c12c425b30da0959a1dbcd5102ffb10af807f6cd4363cfd26ec08eb27d2374` |
| css-code-rules/references/style-comment-examples.md | 1724 | `3eaffb362a4e68659bcceee04b97ba3a62dde093d2fc24377a9fe857290395d4` |
| css-code-rules/references/blank-line-examples.md | 3042 | `9220a0048985d6dfb98cee198ae612422db3bf25e17febc2a60cbc73764a3c5f` |
| css-code-rules/references/property-order-examples.md | 6446 | `0607c3153ce0f60335e5f53bd56791873de839c404af22ef2d73ce521ce865ae` |
| css-code-rules/references/selector-consolidation-examples.md | 1256 | `544441ab50d7ac7da322524d2be9b010a6b6c277ae46506fdeb049916d2b9260` |
| css-code-rules/references/compatibility-examples.md | 1461 | `94a4005976e267db997c559fee13c4139f1f88847f72bb4ecbb571d531402f4b` |
| css-code-rules/references/formatting-and-review-examples.md | 1756 | `d601f5a2e680a88096e728a18f53faa3ed0cfd2b260754f066a46abfdc0898a8` |
| css-code-rules/agents/openai.yaml | 207 | `2985f6e342a9e6d8598ea32d51280d4cb2a494eb2a632038cea40bd18223ac82` |
