# 组件结构示例

> 本文件仅翻译 `vue-code-rules/references/component-structure-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

目录管理的页面或组件优先使用以下结构；可选目录和文件只有具备真实的拥有者职责时才创建。

```text
<owner>/
|-- index.vue
|-- index.ts              Public component export
|-- index.less            Optional extracted local style
|-- component/
|   |-- simple-child.vue  Cohesive private child
|   `-- complex-child/
|       |-- index.vue
|       |-- index.ts
|       |-- component/    Child-private components
|       `-- hooks/        Child-private composables
|-- hooks/                Owner-private composables
|-- constants/            Owner-private constants
`-- type/                 Owner-private types
```

1. 按独立 UI 职责、内聚复用行为或真实维护困难拆分；紧密关联的模板、状态和操作保持在一起。状态在多层组件间重复传递和更新时使用专用 `use**Context`。
2. 组件文件、目录和标签使用 kebab-case；composable 文件通常使用 kebab-case，`hooks/` 内按约定使用 camelCase。
3. 既有页面/组件树中的一级页面和组件使用包含 `index.vue` 与 `index.ts` 的目录形式。只有拥有者私有 `component/` 内的简单子组件可使用单文件；出现有意义的配套文件后再升级为目录。
4. 目录组件的 `index.ts` 只导出 `index.vue` 和有意公开的类型。普通 setup 与样式留在 SFC；只有具备真实所有权或维护收益时才增加 `index.less`、hooks、常量、类型或私有子组件。
5. 私有单元跟随拥有者，每个 `.vue` 不超过 1000 行。只有真实跨页面复用后才提升私有子组件，并同步公开入口和消费者；不要为了统一结构迁移无关组件。

## 场景 1：按职责拆分

组件按独立 UI 职责或内聚可复用单元拆分，不能按行数或任意视觉区机械切割。

**正例：**

```text
candidate-list/
|-- index.vue
|-- index.ts
|-- component/
|   |-- candidate-filter.vue
|   `-- candidate-table/
|       |-- index.vue
|       |-- index.ts
|       `-- hooks/
|           `-- useCandidateSelection.ts
`-- hooks/
    `-- useCandidateList.ts
```

**反例：**

```text
candidate-list/
|-- index.vue
|-- index.ts
`-- component/
    |-- candidate-title-wrapper.vue
    |-- candidate-button-wrapper.vue
    `-- candidate-pagination-proxy.vue
```

## 场景 2：把可复用行为提取为 composable

内聚的可复用状态、副作用和业务行为提取到 composable；连续局部流程保持在组件中。

不要把同一个筛选流程缩减成一个只搬走组件私有 ref、没有复用行为或独立职责的 composable：

在筛选行为尚未形成值得提取的内聚职责前，把同一个一次性状态留在拥有组件中：

只有行为拥有内聚的状态、派生值、操作和副作用，具备真实复用，或形成清晰的测试与维护边界时才提取。

**正例：**

```ts
// 管理候选人筛选条件及其重置行为。
export const useCandidateFilters = () => {
  // 保存当前候选人筛选条件。
  const filters = ref(createDefaultFilters())
  // 标识当前是否存在已应用的筛选条件。
  const hasActiveFilters = computed(() => hasFilters(filters.value))
  // 恢复候选人筛选条件的默认值。
  const resetFilters = () => {
    filters.value = createDefaultFilters()
  }
  return { filters, hasActiveFilters, resetFilters }
}
```

```ts
// 标识候选人弹窗是否显示。
const candidateDialogVisible = ref(false)
```

**反例：**

```ts
// 创建候选人弹窗的显示状态。
export const useCandidateDialogVisible = () => {
  // 标识候选人弹窗是否显示。
  const visible = ref(false)
  return { visible }
}
```

## 场景 3：应用命名约定

组件文件和标签使用 kebab-case；composable 文件通常 kebab-case，`hooks/` 内按约定使用 camelCase。

**正例：**

```text
components/
|-- user-avatar/
|   |-- index.vue
|   `-- index.ts
`-- user-card/
    |-- index.vue
    |-- index.ts
    |-- component/
    |   `-- user-card-label.vue
    `-- hooks/
        `-- useUserCard.ts

candidate-page/
|-- index.vue
|-- index.ts
`-- hooks/
    `-- useCandidateList.ts
```

```vue
<user-card />
```

**反例：**

```text
components/
|-- UserAvatar.vue
`-- user_card/
    |-- UserCard.vue
    `-- hooks/
        `-- use-user-card.ts
```

## 场景 4：私有子组件和 hooks 跟随拥有者

私有子组件放拥有者的 `component/`，私有 composable 放 `hooks/`，不基于假设复用提升。

**正例：**

```text
workbench/
|-- index.vue
|-- index.ts
|-- component/
|   `-- workbench-toolbar.vue
`-- hooks/
    |-- useWorkbenchContext.ts
    `-- useWorkbenchSearch.ts
```

**反例：**

```text
src/components/workbench-toolbar/index.vue
src/components/workbench-toolbar/index.ts
src/hooks/useWorkbenchSearch.ts
```

## 场景 5：选择目录形式或单文件形式

一级页面/组件始终使用目录、`index.vue` 和 `index.ts`；只有拥有者私有 `component/` 下的简单子项可单文件。

**正例：**

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/views/workbench/index.vue
src/views/workbench/index.ts
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
```

```text
src/pages/candidate-list/component/empty-hint.vue
src/views/workbench/component/workbench-toolbar.vue
src/components/user-card/component/user-card-label.vue
```

**反例：**

```text
src/components/user-card/component/user-card-label/
|-- index.vue
`-- index.ts
```

## 场景 6：组织需要配套文件的组件

私有子项需要样式、逻辑、私有孩子或 hooks 时升级为目录并提供导出入口。

**正例：**

```text
src/components/candidate-picker/
|-- index.vue
|-- index.ts
|-- index.less
|-- component/
|   `-- candidate-option.vue
`-- hooks/
    `-- useCandidateSearch.ts
```

```ts
export { default } from './index.vue'
```

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

**反例：**

```text
src/components/candidate-picker/
|-- index.vue
|-- component/
|-- hooks/
|-- constants/
`-- type/
```

```ts
import CandidatePicker from '@/components/candidate-picker/index.vue'
```

## 场景 7：处理 1000 行限制

每个 `.vue` 文件不超过 1000 行，按职责拆分并只迁移受影响结构。

**正例：**

```text
candidate-list/
|-- index.vue
`-- component/
    |-- candidate-filter.vue
    |-- candidate-results.vue
    `-- candidate-dialog.vue
```

**反例：**

```text
candidate-list/
|-- index.vue
`-- component/
    |-- candidate-part-1.vue
    |-- candidate-part-2.vue
    `-- candidate-part-3.vue
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
