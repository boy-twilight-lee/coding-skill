# <img src="assets/logo.svg" width="40" height="40" alt="YC"/> coding-skill

面向 Codex 的编程规则，按任务组合使用。

| Skill                                                       | 用途                                                                                                                                                            |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [pragmatic-coding](pragmatic-coding/SKILL.md)               | 避免过度设计、无必要的防御代码和无关改动，按目标验证结果。基于 [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)（MIT） |
| [command-execution-rules](command-execution-rules/SKILL.md) | 命令执行、Python 编排、参数安全和失败报告                                                                                                                       |
| [ts-code-rules](ts-code-rules/SKILL.md)                     | TypeScript 类型、导入、源码分层、注释和异步处理                                                                                                                 |
| [vue-code-rules](vue-code-rules/SKILL.md)                   | Vue 3 模板、组件结构、编译器宏和上下文管理                                                                                                                      |
| [css-code-rules](css-code-rules/SKILL.md)                   | 样式命名、作用域、布局、提取和兼容性                                                                                                                            |

## 安装与更新

克隆并打开本仓库后，将以下提示词发送给 Codex：

```text
请安装或更新当前仓库中的五个 Skill：

- pragmatic-coding
- command-execution-rules
- ts-code-rules
- vue-code-rules
- css-code-rules

1. 将五个完整目录同步到 CODEX_HOME/skills；未配置 CODEX_HOME 时使用当前用户目录下的 .codex/skills。保留目录结构和其他已安装 Skill。
2. 在同一 Codex 根目录的 AGENTS.md 中写入以下路由；文件不存在时创建，已有路由更新并去重，保留其他规则。

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

3. 检查安装文件与引用是否完整，报告安装目录、AGENTS.md 路径及结果。
```

安装后在新的 Codex 任务中使用；如尚未识别，可重启 Codex。显式调用示例：`使用 $pragmatic-coding 审查这次改动`。

## License

[MIT](LICENSE)
