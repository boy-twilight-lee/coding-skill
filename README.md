# coding-skill

一组面向 Codex 的可组合编码规则技能，用于统一 Python 命令执行、TypeScript、Vue 3 和样式代码的实现与审查标准。

## 包含的技能

| 技能 | 适用范围 | 主要内容 |
| --- | --- | --- |
| `python-command-rules` | Python、脚本、自动化及系统命令 | Python 优先、`subprocess` 调用、结构化结果、错误处理和文件操作 |
| `ts-code-rules` | TypeScript、TSX、Vue 中的 TypeScript | 修改范围、注释、导入与类型组织、异步流程和运行时兼容性 |
| `vue-code-rules` | Vue 3 SFC、组件、页面、布局及 composable | 模板、编译器宏、组件结构、Context、目录归属和应用架构 |
| `css-code-rules` | CSS、Less、Sass、SCSS 及 Vue style 区块 | scope、命名与嵌套、布局、复用、声明顺序和浏览器兼容性 |

## 组合方式

这些技能按代码边界组合，而不是互相替代：

- Vue SFC 中的 TypeScript 同时应用 `vue-code-rules` 和 `ts-code-rules`。
- Vue style 区块同时应用 `vue-code-rules` 和 `css-code-rules`。
- 执行本地命令或编写自动化脚本时应用 `python-command-rules`。
- 同一任务中的每个相关技能只需加载一次。

通用规则由对应语言技能负责，Vue 技能只补充编译器宏、watcher、生命周期、SFC 区块和组件架构等 Vue 特有约束，以减少重复和规则漂移。

## 目录结构

每个技能都是独立目录，通常包含：

```text
skill-name/
|-- SKILL.md          技能入口、适用范围和 reference 路由
|-- agents/           Codex 展示与调用元数据
|-- references/       按决策类型拆分的强制规则和示例
|-- assets/           技能图标等静态资源
`-- translation/      仅供人工阅读的中文合并版本
```

`translation/` 不会被 `SKILL.md` 或 Codex 自动路由引用。部署到 Codex 时可以省略该目录；仓库中保留它是为了方便人工查阅。

## 安装到 Codex

将需要的技能目录复制到 `$CODEX_HOME/skills/`。未设置 `CODEX_HOME` 时，Windows 的默认位置通常是 `%USERPROFILE%\.codex\skills\`。

安装后的结构示例：

```text
$CODEX_HOME/skills/
|-- python-command-rules/
|-- ts-code-rules/
|-- vue-code-rules/
`-- css-code-rules/
```

复制时保留 `SKILL.md`、`agents/`、`references/` 和 `assets/`，可以排除 `translation/`。新安装或更新的技能将在 Codex 后续任务中可用。

## 使用

技能描述支持 Codex 根据任务内容自动选择，也可以在请求中显式指定技能名称。项目级 `AGENTS.md` 可以进一步规定强制路由，例如要求所有 Vue 修改始终应用 `vue-code-rules`。

修改技能时：

1. 将入口保持在 `SKILL.md`，只保留适用范围、关键约束和 reference 路由。
2. 将详细规则与示例放在 `references/`，避免在多个技能中复制同一大段内容。
3. 使用 Codex 内置 `skill-creator/scripts/quick_validate.py` 分别校验每个技能目录。
4. 检查 reference 链接、Markdown 代码围栏和最终差异，避免把无关格式化带入修改。

## License

本项目采用 [MIT License](LICENSE)。
