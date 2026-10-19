# 应用架构示例

> 本文件仅翻译 `vue-code-rules/references/application-architecture-examples.md`，代码示例与英文 reference 保持一致。

使用仓库既有的等价目录；目标专属目录只有在仓库已经按目标拆分时才存在。

```text
src/
|-- pages/ (or views/)    Route-level page units
|-- pages-pc/             Optional target-specific pages
|-- components/           Cross-page reusable UI
|-- components-pc/        Optional target-specific reusable UI
|-- layout/               Page frames
|-- hooks/                Cross-page reusable composables
|-- styles/               Application-wide styles
`-- utils/                Cross-page stateless utilities
```

1. 保留既有页面树和移动端/PC 端分离，不创建竞争目录，也不通过运行时设备分支合并目标专属实现，除非请求明确要求。
2. 页面私有组件、hooks 和辅助函数跟随页面；只有真实跨页面复用后才提升到 `src` 一级目录。提升后的工具按明确业务领域或技术能力组织，并从目录入口导出。
3. 手写大型能力前检查已有依赖和包装层。只有获得授权且现有栈确有缺口时才新增包，并核实维护情况、来源、目标兼容性、包体积和许可证；商业使用安全无法确认时必须报告。

## 场景 1：放置路由编排与可复用 UI

路由编排放既有 pages/views，跨页面 UI 放 components，页面框架放 layout；一级单元使用目录入口。

**正例：**

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/pages/candidate-list/component/candidate-filter.vue
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
src/layout/default-layout/index.vue
src/layout/default-layout/index.ts
```

```text
src/views/workbench/index.vue
src/views/workbench/index.ts
src/views/workbench/component/workbench-toolbar.vue
```

**反例：**

```text
src/views/candidate-list/index.vue
src/pages/candidate-list/index.vue
src/components/candidate-filter/index.vue
src/pages/user-avatar.vue
```

## 场景 2：保留移动端与 PC 端目录树

已有移动端与 PC 端树时保持物理分离，除非请求明确要求共享行为。

不要把既有目标端入口合并为一个在运行时判断设备的共享组件：

该分支会让两个目标端实现进入同一所有权和加载路径，削弱路由级分离。真实共享的数据或行为可以提取到最近共同拥有者，但不能仅为复用而合并展示根。

**正例：**

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/pages-pc/candidate-list/index.vue
src/pages-pc/candidate-list/index.ts
src/components/candidate-card/index.vue
src/components/candidate-card/index.ts
src/components-pc/candidate-card/index.vue
src/components-pc/candidate-card/index.ts
```

**反例：**

```vue
<template>
  <candidate-card-pc v-if="deviceTarget === 'pc'" :candidate="candidate" />
  <candidate-card-mobile v-else :candidate="candidate" />
</template>

<script setup lang="ts">
import CandidateCardMobile from '@/components/candidate-card'
import CandidateCardPc from '@/components-pc/candidate-card'

// 读取当前运行环境对应的展示目标端。
const deviceTarget = getRuntimeDeviceTarget()
</script>
```

## 场景 3：重新实现前评估依赖

手写大功能前检查现有依赖；新增包需获授权并核实维护、来源、兼容性、体积和许可证。

**场景配置：**

```json
{
  "dependencies": {
    "date-fns": "^4.0.0"
  }
}
```

**正例：**

```ts
import { format } from 'date-fns'

// 将候选人更新时间格式化为列表展示文本。
export const formatCandidateUpdatedAt = (value: Date) => {
  return format(value, 'yyyy-MM-dd HH:mm')
}
```

**反例：**

```ts
import dayjs from 'dayjs'

// 将候选人更新时间格式化为列表展示文本。
export const formatCandidateUpdatedAt = (value: Date) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}
```

## 场景 4：仅在跨页面共享时提升无状态工具

无状态辅助函数只有被不同页面真实共享时才提升到 `src/utils`，同页共享仍留在最近拥有者。

**正例：**

```text
src/utils/date.ts
src/utils/index.ts
```

```ts
import { format } from 'date-fns'

// 将日期值格式化为候选人列表使用的展示文本。
export const formatCandidateDate = (value: Date) => {
  return format(value, 'yyyy-MM-dd')
}
```

```ts
export * from './date'
```

**反例：**

```text
src/utils/common.ts
```

```ts
// 仅供候选人列表筛选器和表格使用，却被提前提升为全局工具。
export const formatCandidateDate = (value: Date) => {
  return format(value, 'yyyy-MM-dd')
}
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
