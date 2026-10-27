# <img src="assets/logo.svg" width="40" height="40" alt="YC" /> coding-skill

面向 Codex 的编程规则，按任务组合使用。

| Skill | 用途 |
| --- | --- |
| [pragmatic-coding](pragmatic-coding/SKILL.md) | 避免过度设计、无必要的防御代码和无关改动，按目标验证结果 |
| [command-execution-rules](command-execution-rules/SKILL.md) | 命令执行、Python 编排、参数安全和失败报告 |
| [ts-code-rules](ts-code-rules/SKILL.md) | TypeScript 类型、导入、源码分层、注释和异步处理 |
| [vue-code-rules](vue-code-rules/SKILL.md) | Vue 3 模板、组件结构、编译器宏和上下文管理 |
| [css-code-rules](css-code-rules/SKILL.md) | 样式命名、作用域、布局、提取和兼容性 |

## 来源

`pragmatic-coding` 基于社区项目 [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)（上游声明为 MIT），保留四项核心规则原文，调整技能名并追加按需读取示例的入口。[示例](pragmatic-coding/references/examples.md)由上游 Python 版本改写为 TypeScript，保留原有场景和正反对照，补充同分排序的有效断言。

## 安装与更新

克隆并打开本仓库后，将以下提示词发送给 Codex：

```text
请根据当前 coding-skill 仓库，安装或更新以下五个 Skill，并配置全局 AGENTS.md 路由：

- pragmatic-coding
- command-execution-rules
- ts-code-rules
- vue-code-rules
- css-code-rules

一、确认源目录与安装位置

1. 确认当前仓库包含以上五个目录，每个目录均有 SKILL.md 和 agents/openai.yaml。
2. 若 CODEX_HOME 已配置，以其实际路径作为 Codex 根目录；否则使用当前用户目录下的 .codex。Skill 安装到该根目录的 skills/，全局路由写入同一根目录的 AGENTS.md。
3. 将环境变量和相对路径解析为绝对路径，读取现有目标目录和 AGENTS.md 后再更新。不要把当前仓库目录误当成 Codex 根目录。

二、同步五个完整 Skill

1. 创建缺失的目标目录，按本仓库内容更新以上五个同名目录。完整保留 SKILL.md、agents/、references/ 及源目录实际包含的其他技能资源，维持目录名与五个 Skill 的同级关系。
2. 引用可能跨 Skill 目录；不得只复制 SKILL.md，也不得把多个 Skill 的 references 合并到同一个目录。
3. 五个 Skill 均不配置图标；同步 agents/openai.yaml 时移除旧版 icon_small 和 icon_large 字段，保留显示名称、简介及其他未涉及的用户配置。仓库根目录的 assets/logo.svg 仅用于 README 展示，不安装到任何 Skill。
4. 清理五个目标内旧版的 assets/logo.svg 和 assets/logo.png，以及 command-execution-rules/assets/python-logo.svg 与 python-logo.png、ts-code-rules/assets/typescript-logo.svg 与 typescript-logo.png、vue-code-rules/assets/vuejs-logo.svg 与 vuejs-logo.png、css-code-rules/assets/css3-logo.svg 与 css3-logo.png。文件不存在时跳过；仅删除这些旧图标，assets/ 已空时可移除空目录，保留其他用户文件和未列出的 Skill。
5. 仅同步仓库提供的 Skill 内容，不把根目录的 README.md、LICENSE、assets/、.git、_reports 或临时文件安装成 Skill；不要清空整个 skills/ 目录。

三、合并全局 AGENTS.md 路由

AGENTS.md 不存在时创建；存在时保留其他规则与用户内容。按以下标题和技能名定位本次五个 Skill 的旧路由，更新并去重，每个路由只保留一份。不要用本段内容覆盖整个文件，也不要在其他项目的 AGENTS.md 中重复写入。

# Pragmatic Coding Skill Routing

For every task that implements, fixes, refactors, reviews, debugs, or completes code, always use the pragmatic-coding skill and read its SKILL.md in full before acting. Apply its four principles: Think Before Coding, Simplicity First, Surgical Changes, and Goal-Driven Execution. Follow its Codex Reference Routing section when concrete examples are useful. Use it alongside the applicable language, framework, styling, and command-execution rules, unless higher-priority instructions conflict.

# Command Execution Skill Routing

For every task that executes shell or system commands, or writes, modifies, refactors, reviews, debugs, or completes command-execution helpers or automation scripts, always use the command-execution-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its execution-method selection, argument-safety, subprocess, output, encoding, timeout, and failure-reporting rules as mandatory unless higher-priority instructions conflict.

# Vue Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes Vue project code, always use the vue-code-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its template and component-architecture rules as mandatory unless higher-priority instructions conflict.

# TypeScript Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes TypeScript, TSX, Vue <script lang="ts"> or <script setup lang="ts"> code, always use the ts-code-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its coding, type, import, async, source-layer, formatting, and compatibility rules as mandatory unless higher-priority instructions conflict.

# CSS Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes CSS, Less, Sass, SCSS, or a Vue <style> block, always use the css-code-rules skill, read every reference required by its Required Reference Loading section in full before acting, and treat its style architecture, naming, scope, layout, and compatibility rules as mandatory unless higher-priority instructions conflict.

四、检查并报告

1. 检查五个目标的 SKILL.md frontmatter，确认 name 与目录名一致、description 有效；解析 agents/openai.yaml，确认不含 icon_small 和 icon_large。
2. 对比源文件与已安装文件，确认本次同步完整；检查本地 Markdown 引用，按引用文件所在位置解析相对路径，包括跨 Skill 的 references。
3. 确认旧图标已清理，全局路由各一份，其他已安装 Skill、用户文件和 AGENTS.md 的其他规则仍保留。
4. 报告实际安装根目录、五个 Skill 的安装路径、AGENTS.md 路径和检查结果。遇到无法完成的步骤时，说明具体原因与未完成部分，不要宣称安装成功。
```

安装后在新的 Codex 任务中使用；如尚未识别，可重启 Codex。显式调用示例：`使用 $pragmatic-coding 审查这次改动`。

## License

[MIT](LICENSE)
