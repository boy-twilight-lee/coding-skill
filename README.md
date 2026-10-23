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
  <strong>面向 Codex 的命令执行、TypeScript、Vue 3 与 CSS 工程规则。</strong>
</p>

这组 Skill 帮助 Codex 在执行命令、编写和审查代码时，遵循一致且可验证的工程约束。每个 Skill 独立负责一个领域，可以按任务自动加载或显式指定。顶层 `SKILL.md` 保留必须遵守的核心规则；reference 提供完整的适用边界和复核清单，只在具体对比能帮助决策时保留示例。命中路由时必须实际读取对应 reference，不能只加载顶层文件。

## 🧰 包含的 Skill

| Skill | 适用范围 | 主要关注点 |
| --- | --- | --- |
| `command-execution-rules` | Shell、系统命令、命令执行封装和自动化脚本 | 直接执行与 Python 编排的选择、参数安全、工作目录、输出编码、超时和失败报告 |
| `ts-code-rules` | TypeScript、TSX、Vue SFC 中的 TypeScript | 改动范围与冗余清理、中文业务注释、空行与导入规范、源码分层与公共入口、异步及错误处理、运行时兼容性 |
| `vue-code-rules` | Vue 3 SFC、组件、页面、布局和 composable | SFC 结构与最小 DOM、类绑定、编译器宏与自动导入、模板 props 访问、中文业务注释、组件目录与实例类型、固定 provide/inject 上下文模式 |
| `css-code-rules` | CSS、Less、Sass、SCSS、Vue 样式块 | 预处理器与作用域、样式提取、业务类名、DOM 层级嵌套与 mixin、深度选择器、布局与组件库定制、无效声明清理、属性顺序与兼容性 |

## 🧠 上下文占用

以下统计 TypeScript、Vue、CSS 三个 Skill 的规则文本，单位为 **k tokens（1k = 1,000 tokens）**，不是文件大小 KB。

| Skill | 仅加载 `SKILL.md` | 全量加载最大占用（约） |
| --- | ---: | ---: |
| `ts-code-rules` | 1.12k | 8.57k |
| `vue-code-rules` | 1.54k | 15.08k |
| `css-code-rules` | 1.91k | 13.26k |
| **三个合计** | **4.58k** | **36.92k** |

统计时间：2026-10-23。使用 `tiktoken 0.14.0` 的 `o200k_base` 编码，逐文件统计 UTF-8 文本（换行统一为 LF），结果保留两位小数。“全量加载最大占用”指每个 Skill 的 `SKILL.md`（含 frontmatter）和 `references/` 下全部 Markdown 文件各加载一次；三个 Skill 分别包含 9、12、14 个 reference，全量计数分别为 8,574、15,080、13,262 tokens，合计 36,916 tokens。不计图片、`agents/openai.yaml`、其他 Skill、仓库代码、对话和工具消息包装开销，也不计重复读取。

实际使用时按任务加载匹配的 references，通常低于全量值；仅加载入口的数值用于对比，不代表已满足必读要求。上述最大值是规则文本单次全量加载的估算值，实际上下文占用还取决于所用模型的 tokenizer、工具输出格式和重复加载情况。Vue 任务同时触发 TypeScript 与 CSS 规则时，三者全量合计约 **36.92k**。规则文件更新后需重新统计。

## 📦 安装

克隆并打开本仓库后，将下面的提示词发送给 Codex：

```text
请完成当前 coding-skill 仓库的安装或更新：

1. 将 command-execution-rules、ts-code-rules、vue-code-rules、css-code-rules 四个完整目录安装或更新到 CODEX_HOME/skills；未配置 CODEX_HOME 时使用当前用户目录下的 .codex/skills。仅更新这四个目标，保留其他已安装 Skill。
2. 更新同一 Codex 根目录下的 AGENTS.md，不存在时创建。保留其他规则，将这四个 Skill 的旧版或重复路由替换为以下内容：

# Command Execution Skill Routing

For every task that executes shell or system commands, or writes, modifies, refactors, reviews, debugs, or completes command-execution helpers or automation scripts, always use the command-execution-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its execution-method selection, argument-safety, subprocess, output, encoding, timeout, and failure-reporting rules as mandatory unless higher-priority instructions conflict.

# Vue Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes Vue project code, always use the vue-code-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its template and component-architecture rules as mandatory unless higher-priority instructions conflict.

# TypeScript Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes TypeScript, TSX, Vue <script lang="ts"> or <script setup lang="ts"> code, always use the ts-code-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its coding, type, import, async, source-layer, formatting, and compatibility rules as mandatory unless higher-priority instructions conflict.

# CSS Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes CSS, Less, Sass, SCSS, or a Vue <style> block, always use the css-code-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its style architecture, naming, scope, layout, and compatibility rules as mandatory unless higher-priority instructions conflict.

3. 报告安装目录和 AGENTS.md 路径。
```

安装或更新后，请在新的 Codex 任务中使用；如果暂时没有识别新 Skill，重启 Codex 后再试。

## 📄 License

本项目采用 [MIT License](LICENSE)。
