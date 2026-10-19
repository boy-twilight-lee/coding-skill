# coding-skill

<p align="center">
  <img src="./command-execution-rules/assets/python-logo.svg" width="56" height="56" alt="Command Execution" />
  &nbsp;&nbsp;&nbsp;
  <img src="./ts-code-rules/assets/typescript-logo.svg" width="56" height="56" alt="TypeScript" />
  &nbsp;&nbsp;&nbsp;
  <img src="./vue-code-rules/assets/vuejs-logo.svg" width="56" height="56" alt="Vue" />
  &nbsp;&nbsp;&nbsp;
  <img src="./css-code-rules/assets/css3-logo.svg" width="56" height="56" alt="CSS" />
</p>

<p align="center">
  <strong>面向 Codex 的命令执行、TypeScript、Vue 3 与 CSS 可组合工程规则。</strong>
</p>

<p align="center">
  🧭 明确实现边界　🧩 按代码类型组合　🔍 同时指导编写与审查　🛡️ 控制无关改动
</p>

## ✨ 这组 Skill 能做什么

`coding-skill` 将常用的命令执行与前端工程约束整理成 Codex 可以按任务加载的技能。它不只是统一格式，而是帮助 Codex 在运行工具以及编写、修改、重构、调试和审查代码时作出更稳定的工程决策：

- 🎯 **减少模糊判断**：明确导入、类型、注释、组件边界、样式所有权和兼容性要求。
- 🧩 **按代码边界组合**：TypeScript、Vue 与样式规则各自负责自己的领域，避免一份大规则重复和漂移。
- 🔍 **提供正反场景**：不仅说明推荐写法，也展示常见错误、风险和适用例外。
- 🛡️ **尊重修改范围**：避免顺手重构、全量格式化或为了统一风格改动无关代码。
- ⚙️ **结合项目配置**：在自动导入、类型擦除、浏览器支持、预处理器等问题上，以仓库真实配置为判断依据。
- 🐍 **安全执行命令**：简单固定命令直接运行，复杂编排再使用 Python `subprocess`，并保留退出状态和诊断信息。

## 🧰 包含的 Skill

| 图标 | Skill | 主要作用 | 典型关注点 |
| --- | --- | --- | --- |
| 🐍 | `command-execution-rules` | 约束 Shell/系统命令执行以及可复用自动化脚本 | 直接执行与 Python 编排的选择、参数安全、工作目录、编码、超时、退出状态、错误报告 |
| 🟦 | `ts-code-rules` | 约束 TypeScript、TSX 和 Vue 中的 TypeScript 实现与审查 | 修改范围、注释、导入分组、类型归属、异步流程、错误处理、运行时兼容性 |
| 🟩 | `vue-code-rules` | 约束 Vue 3 SFC、组件、页面、布局和 composable 的实现与架构 | 模板、编译器宏、watcher、生命周期、组件拆分、Context、目录归属、应用架构 |
| 🎨 | `css-code-rules` | 约束 CSS、Less、Sass、SCSS 和 Vue style 区块 | scope、业务命名、嵌套、`:deep()`、布局、设计令牌、声明顺序、浏览器兼容性 |

### 🐍 命令执行：简单调用保持直接，复杂流程安全编排

`command-execution-rules` 负责 Shell/系统命令和命令执行辅助程序。它会指导 Codex：

- 对 `git status`、`rg --files`、项目测试等单个固定命令直接执行，避免无意义的 `python -c` 包装；
- 在多命令编排、动态参数、输出解析、文件处理或可复用自动化中优先使用 Python 标准库；
- 将动态值作为参数传递，不把路径、模式、分支名或用户输入拼接进 Shell 或 Python 源码；
- 区分普通交互式命令和机器消费的命令执行器，只对后者要求统一结构化结果；
- 正确处理工作目录、退出码、标准输出、标准错误、编码、启动失败与超时。

### 🟦 TypeScript：让代码边界和运行时行为更可靠

`ts-code-rules` 负责通用 TypeScript 质量要求。它会指导 Codex：

- 保持修改聚焦，清理由当前改动产生的无用代码，但不扩大到无关区域；
- 为运行时声明和函数补充有业务含义的中文注释，避免机械复述；
- 按项目配置决定普通导入与 `import type`，并通过公开入口跨模块访问；
- 使用清晰的 `await` 流程，不静默丢弃 Promise；
- 根据真实 TypeScript target、Browserslist、运行时和 polyfill 策略判断 API 兼容性。

### 🟩 Vue：让组件保持清晰的职责和所有权

`vue-code-rules` 负责 Vue 特有的模板、SFC 和组件架构决策。它会指导 Codex：

- 保持 `<template>`、`<script>`、`<style>` 的正确相对顺序；
- 控制模板复杂度、列表 key、组件标签、slot、DOM 深度和 class 绑定；
- 正确排列编译器宏，并根据 Vite 自动导入配置决定是否显式导入 Vue API；
- 按真实职责拆分组件和 composable，避免机械拆文件或过早提升私有模块；
- 在复杂组件子树中规范 `provide` / `inject` Context，并保持安全回退对象；
- 尊重已有移动端、PC 端、页面、共享组件和布局的架构边界。

### 🎨 CSS：让样式跟随组件所有权而不是不断堆叠

`css-code-rules` 负责样式作用域、命名、布局与兼容性。它会指导 Codex：

- 保持项目既有的 CSS、Less、Sass、SCSS 或 CSS Modules 方案；
- 使用有业务含义的根类和单连字符 BEM 风格，控制过长或含糊的类名；
- 让嵌套、状态、伪类、直接子元素和 `:deep()` 选择器反映真实 DOM 所有权；
- 优先复用设计令牌、Flexbox、组件库 CSS 变量和已经验证的公共样式能力；
- 删除无效或重复声明，同时保留对布局、截断和交互确有影响的规则；
- 根据目标浏览器与构建工具决定新 CSS 特性是否可用。

## 🔗 如何组合

四个 Skill 可以独立使用，也可以在同一个任务中叠加：

| 代码场景 | 应用的 Skill |
| --- | --- |
| 执行 Shell/系统命令或修改命令执行辅助程序 | `command-execution-rules` |
| 独立 `.ts` / `.tsx` 文件 | `ts-code-rules` |
| Vue 模板或组件结构 | `vue-code-rules` |
| Vue `<script setup lang="ts">` | `vue-code-rules` + `ts-code-rules` |
| 独立 CSS / Less / Sass / SCSS | `css-code-rules` |
| Vue `<style>` 区块 | `vue-code-rules` + `css-code-rules` |
| 同时修改完整 Vue SFC | `vue-code-rules` + `ts-code-rules` + `css-code-rules` |

Vue Skill 只补充 Vue 特有规则；通用 TypeScript 和样式规则仍由对应 Skill 负责。同一任务中的每个相关 Skill 加载一次即可。

## 📦 安装到 Codex

### 方式一：安装全部 Skill

先克隆仓库：

```bash
git clone https://github.com/boy-twilight-lee/coding-skill.git
```

#### 🪟 Windows PowerShell

```powershell
$codexRoot = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$codexSkills = Join-Path $codexRoot 'skills'
New-Item -ItemType Directory -Force -Path $codexSkills | Out-Null

Copy-Item -Recurse -Force .\coding-skill\command-execution-rules $codexSkills
Copy-Item -Recurse -Force .\coding-skill\ts-code-rules $codexSkills
Copy-Item -Recurse -Force .\coding-skill\vue-code-rules $codexSkills
Copy-Item -Recurse -Force .\coding-skill\css-code-rules $codexSkills
```

#### 🐧 macOS / Linux

```bash
codex_root="${CODEX_HOME:-$HOME/.codex}"
mkdir -p "$codex_root/skills"

cp -R ./coding-skill/command-execution-rules "$codex_root/skills/"
cp -R ./coding-skill/ts-code-rules "$codex_root/skills/"
cp -R ./coding-skill/vue-code-rules "$codex_root/skills/"
cp -R ./coding-skill/css-code-rules "$codex_root/skills/"
```

请完整复制需要的 Skill，不要只复制 `SKILL.md`；详细规则、正反示例和图标资源会由同一 Skill 中的其他文件提供。

### 方式二：只安装需要的 Skill

四个 Skill 没有强制绑定关系。只需要命令执行规范时可以仅安装 `command-execution-rules`；只写 TypeScript 时可以仅安装 `ts-code-rules`；Vue 项目通常建议同时安装三个前端 Skill，以便覆盖 SFC 的模板、脚本和样式。

安装或更新后，在新的 Codex 任务中使用。如果 Codex 暂时没有识别新 Skill，重启 Codex 后再试。

## 🚀 使用方式

### 自动匹配

安装后，Codex 可以根据 Skill 的描述自动选择相关规则。例如修改 Vue SFC 时加载 Vue Skill，遇到其中的 TypeScript 或样式区块时再组合对应 Skill。

### 显式指定

也可以在请求中直接指定：

```text
请使用 $vue-code-rules、$ts-code-rules 和 $css-code-rules 完成这个 Vue 页面，并检查所有修改行。
```

代码审查时同样适用：

```text
请使用 $ts-code-rules 审查这次 TypeScript 修改，重点检查异步错误处理和模块边界。
```

### 在项目中强制路由

如果希望项目内的相关任务始终使用这些 Skill，可以在项目级 `AGENTS.md` 中加入路由说明：

```markdown
# Command Execution Skill Routing

For every task that executes shell or system commands, or writes, modifies, refactors, reviews, debugs, or completes command-execution helpers or automation scripts, always use the command-execution-rules skill.

# Vue Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes Vue project code, always use the vue-code-rules skill.

# TypeScript Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes TypeScript, TSX, or Vue TypeScript code, always use the ts-code-rules skill.

# CSS Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes CSS, Less, Sass, SCSS, or a Vue style block, always use the css-code-rules skill.
```

## 🌏 中文阅读版

Codex 执行时以各 Skill 的 `SKILL.md` 和按需加载的 references 为准。仓库同时提供合并后的中文版本，方便人工通读和评审：

- 🟦 [TypeScript Code Rules 中文版](./ts-code-rules/translation/ts-code-rules-zh-CN.md)
- 🟩 [Vue Code Rules 中文版](./vue-code-rules/translation/vue-code-rules-zh-CN.md)
- 🎨 [CSS Code Rules 中文版](./css-code-rules/translation/css-code-rules-zh-CN.md)
- 🐍 [Command Execution Rules 中文版](./command-execution-rules/translation/command-execution-rules-zh-CN.md)

## 📄 License

本项目采用 [MIT License](LICENSE)。
