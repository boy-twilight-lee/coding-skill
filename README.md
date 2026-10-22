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

| Skill                     | 适用范围                                 | 主要关注点                                                   |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| `command-execution-rules` | Shell、系统命令和自动化脚本              | 执行方式、参数安全、工作目录、编码、超时、退出状态和错误报告 |
| `ts-code-rules`           | TypeScript、TSX、Vue TypeScript          | 修改范围、类型、导入、异步流程、错误处理和运行时兼容性       |
| `vue-code-rules`          | Vue 3 SFC、组件、页面、布局和 composable | 模板规范、编译器宏、响应式逻辑、组件职责和架构边界           |
| `css-code-rules`          | CSS、Less、Sass、SCSS、Vue style         | 作用域、命名、嵌套、布局、设计令牌和浏览器兼容性             |

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
