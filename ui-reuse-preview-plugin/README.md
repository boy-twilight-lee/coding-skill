# ui-use-preview

本地 Codex 插件。关联当前会话工作区，选择 HTML 或设计图片，由当前 agent 查找项目中的公共 UI 组件，并在插件页面中显示带编号、组件路径和主题适配说明的 HTML。

## 使用

安装后在项目会话中选择插件，发送“打开 ui-use-preview，关联当前工作区”，或通过会话内容页入口打开面板。选择 `.html`、`.htm`、`.png`、`.jpg`、`.jpeg` 或 `.webp` 文件，再点击“生成标注”。支持最大 8 MiB 文件。

页面直接展示标记与复用清单。通过“下载标注 HTML”保存一份自包含文件，供人工补充。生成由当前 Codex 会话中的 agent 完成，无需额外模型 API 密钥。

工作区路径由当前会话的 agent 传入，不使用插件安装目录作为默认值。打开面板时宿主会话可能短暂显示绑定请求。插件不会主动读取任意其他仓库。

## 安装到本地 Codex

在仓库根目录执行：

```powershell
codex plugin marketplace add ./ui-reuse-preview-plugin
codex plugin add ui-use-preview@coding-ui-local
```

源码更新后先重新构建，再通过本地 Codex 的插件管理流程重新加载插件。不要编辑安装缓存。

## 开发与验证

推荐 Node.js 22 或更新版本开发；构建后的插件可在 Node.js 20 及更新版本运行。工作区环境中的 npm 如果使用 Node.js 20，安装仅用于浏览器打包的 OpenAI Extensions SDK 时可能出现引擎版本警告。

```powershell
npm install
npm run build
npm test
npm run test:browser
```

浏览器检查使用已安装的 Microsoft Edge，无需下载 Chromium。`test-results` 中的截图和 HTML 使用明确标为演示的临时工作区，不代表真实项目扫描结论。

`skills/ui-reuse-annotation/` 是插件内部的工作流源文件，随插件分发，无需单独安装。实际转换 Vue 代码时使用仓库中的 `vue-design-system-reuse`。构建只读取本插件目录，不依赖仓库根目录的独立 Skill。`dist/server.mjs` 已打包运行依赖；安装后的插件不需要再次执行 npm install。`dist/app.html` 包含前端脚本与样式。完整插件包生成命令：

```powershell
python scripts/package_plugin.py
```

生成目录均位于插件内部，并已加入 `.gitignore`：`dist/` 是编译后的运行文件，`artifacts/` 是可分发的插件 ZIP，`test-results/` 是测试截图与示例 HTML。打包脚本只收集运行文件、Skill 和清单，不会把 `artifacts/` 自身打入 ZIP。

## 实现范围

- 公共二开组件优先；组件库按有效主题和实际使用频率选择；弹窗、抽屉、Toast、表格、树等同样适用。
- 只分析 UI 结构和样式适配，不判断业务接口、权限、校验或提交行为是否兼容。
- 设计图片还原成 HTML；已有 HTML 保留视觉结构。输入脚本、远程资源和事件处理会被移除，agent 应将必要样式和图片内嵌。
- 插件内使用 Shadow DOM 隔离预览样式，并移除输入脚本；下载 HTML 使用受限的沙箱预览。
- 路径、库依赖和 CSS 选择器在发布前验证。扫描默认最多 3000 个源文件、24 MiB 内容，超限结果会明确标记，agent 应补充定向检查。
- 文件与结果保存在当前 MCP 进程内存；重启插件或打开新面板不会自动恢复旧文件。需要保留的结果请下载。
- 不包含评审、在线编辑或提示词导出功能。选择 Figma 原生文件和 Figma 链接不在当前文件选择器范围内，可先导出设计图片。

宿主需支持 MCP Apps 会话入口、工具调用和 UI 消息。宿主中的完整模型生成与页面展示仍需在安装后的真实会话中验证；自动化浏览器检查使用真实 MCP 服务和模拟宿主消息，不会调用付费模型。
