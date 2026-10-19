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

这组 Skill 帮助 Codex 在执行命令以及编写、修改、调试和审查代码时，遵循一致且可验证的工程约束。每个 Skill 独立负责一个领域，可以按任务自动加载或显式指定。

## 🧰 包含的 Skill

| Skill                     | 适用范围                                 | 主要关注点                                                   |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| `command-execution-rules` | Shell、系统命令和自动化脚本              | 执行方式、参数安全、工作目录、编码、超时、退出状态和错误报告 |
| `ts-code-rules`           | TypeScript、TSX、Vue TypeScript          | 修改范围、类型、导入、异步流程、错误处理和运行时兼容性       |
| `vue-code-rules`          | Vue 3 SFC、组件、页面、布局和 composable | 模板规范、编译器宏、响应式逻辑、组件职责和架构边界           |
| `css-code-rules`          | CSS、Less、Sass、SCSS、Vue style         | 作用域、命名、嵌套、布局、设计令牌和浏览器兼容性             |

## 📦 安装

克隆并打开本仓库后，将下面的提示词发送给 Codex：

```text
请检查当前 coding-skill 仓库，并完成以下配置：

1. 将 command-execution-rules、ts-code-rules、vue-code-rules、css-code-rules 四个 Skill 安装或更新到 Codex 的 skills 目录。优先使用 CODEX_HOME；未配置时使用当前用户目录下的 .codex。必须复制每个 Skill 的 SKILL.md、agents、references、assets 等运行所需内容，不能只复制 SKILL.md。
2. `translation` 目录仅供人工阅读和评审，不属于 Skill 运行内容。安装或更新时必须忽略所有 `translation` 目录，不要将其中的 `*-cn.md` 文件复制到 Codex 的 skills 目录，也不要用翻译文件覆盖 references。
3. 写入前确认源目录和目标目录，保留其他已安装 Skill，不要删除或覆盖这四个目标之外的内容。
4. 更新 Codex 根目录的 AGENTS.md；文件不存在时创建，存在时保留其他规则。删除以下四个 Skill 的旧版或重复 routing，然后加入：

# Command Execution Skill Routing

For every task that executes shell or system commands, or writes, modifies, refactors, reviews, debugs, or completes command-execution helpers or automation scripts, always use the command-execution-rules skill and treat its execution-method selection, argument-safety, subprocess, output, encoding, timeout, and failure-reporting rules as mandatory unless higher-priority instructions conflict.

# Vue Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes Vue project code, always use the vue-code-rules skill and treat its template and component-architecture rules as mandatory unless higher-priority instructions conflict.

# TypeScript Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes TypeScript, TSX, Vue <script lang="ts"> or <script setup lang="ts"> code, always use the ts-code-rules skill and treat its coding, type, import, async, source-layer, formatting, and compatibility rules as mandatory unless higher-priority instructions conflict.

# CSS Skill Routing

For every task that writes, modifies, refactors, reviews, debugs, or completes CSS, Less, Sass, SCSS, or a Vue <style> block, always use the css-code-rules skill and treat its style architecture, naming, scope, layout, and compatibility rules as mandatory unless higher-priority instructions conflict.

5. 使用 skill-creator 的 quick_validate.py 校验四个安装后的 Skill；如果该校验器不可用，就检查目录名、frontmatter name、引用文件和 agents/openai.yaml 是否完整一致。
6. 比较仓库源文件与安装后的文件时排除 `translation` 目录，确认其余安装内容一致；最后报告安装目录、AGENTS.md 路径、校验结果以及是否需要重启 Codex。不要提交、推送或修改本仓库中的其他文件。
```

安装或更新后，请在新的 Codex 任务中使用；如果暂时没有识别新 Skill，重启 Codex 后再试。

## 🌏 中文阅读版

Codex 执行时以各 Skill 的 `SKILL.md` 和按需加载的 references 为准。`translation/` 只翻译对应的 reference，并使用同名 `*-cn.md` 文件保持一一对应：

- Command Execution
  - [command-execution-examples-cn.md](./command-execution-rules/translation/command-execution-examples-cn.md)
- TypeScript
  - [code-quality-examples-cn.md](./ts-code-rules/translation/code-quality-examples-cn.md)
  - [imports-and-types-cn.md](./ts-code-rules/translation/imports-and-types-cn.md)
  - [async-and-compatibility-examples-cn.md](./ts-code-rules/translation/async-and-compatibility-examples-cn.md)
- Vue
  - [template-examples-cn.md](./vue-code-rules/translation/template-examples-cn.md)
  - [blank-line-examples-cn.md](./vue-code-rules/translation/blank-line-examples-cn.md)
  - [script-structure-examples-cn.md](./vue-code-rules/translation/script-structure-examples-cn.md)
  - [script-comment-examples-cn.md](./vue-code-rules/translation/script-comment-examples-cn.md)
  - [component-structure-examples-cn.md](./vue-code-rules/translation/component-structure-examples-cn.md)
  - [complex-component-context-examples-cn.md](./vue-code-rules/translation/complex-component-context-examples-cn.md)
  - [application-architecture-examples-cn.md](./vue-code-rules/translation/application-architecture-examples-cn.md)
- CSS
  - [scope-and-file-organization-examples-cn.md](./css-code-rules/translation/scope-and-file-organization-examples-cn.md)
  - [naming-and-nesting-examples-cn.md](./css-code-rules/translation/naming-and-nesting-examples-cn.md)
  - [design-layout-and-reuse-examples-cn.md](./css-code-rules/translation/design-layout-and-reuse-examples-cn.md)
  - [declaration-and-compatibility-examples-cn.md](./css-code-rules/translation/declaration-and-compatibility-examples-cn.md)

## 📄 License

本项目采用 [MIT License](LICENSE)。
