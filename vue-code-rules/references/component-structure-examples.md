# Component Structure Examples

## Mandatory Rules

Use this map for a directory-managed page or component. Omit optional directories and files until they have a real owner-specific purpose.

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

1. Split by independent UI responsibility, cohesive reusable behavior, or genuine maintenance difficulty. Keep tightly coupled template, state, and actions together; use a dedicated `use**Context` composable when shared state is repeatedly passed and updated across several component levels.
2. Use kebab-case for component files, directories, and custom tags. Use kebab-case for composable files except hooks inside `hooks/`, which use camelCase.
3. Every first-level page or component under the established page/component trees uses the directory form with `index.vue` and `index.ts`. Only a simple child inside an owner's private `component/` may use the single-file form; use a child directory when supporting files become meaningful.
4. A directory-managed component's `index.ts` re-exports `index.vue` and any intentional public types. Keep ordinary setup and styles in the SFC; add `index.less`, hooks, constants, types, or private children only when they provide real ownership or maintenance value.
5. Keep private units under their owner and each `.vue` file at or below 1000 lines. Promote a private child only after real cross-page reuse, update its public entry and consumers, and do not migrate unrelated components merely to normalize structure.

## Scenario 1: Split by Responsibility

Situation: one page handles filters, results, pagination, editing, and dialog state.

**Positive example:**

Keep route orchestration in the page and extract cohesive private units:

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

The filter is a cohesive SFC, so it needs no directory. The table owns selection behavior extracted into a hook, so its directory groups real supporting files. Keep table rendering and selection interaction together unless a further independent UI responsibility emerges.

Do not extract a component that only wraps one element or forwards one prop without adding responsibility. Do not move a continuous event flow into several one-use wrappers. Line count is a signal, not the split criterion; responsibility and reuse determine the boundary.

**Negative example:**

Do not split that same page into wrapper-only units with no independent responsibility:

```text
candidate-list/
|-- index.vue
|-- index.ts
`-- component/
    |-- candidate-title-wrapper.vue
    |-- candidate-button-wrapper.vue
    `-- candidate-pagination-proxy.vue
```

## Scenario 2: Extract Reusable Behavior into a Composable

**Positive example:**

Move state, derived values, actions, and side effects that form one reusable behavior into a focused composable:

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

Keep one-off presentation state in its component. For a one-off dialog state, keep the ref in the owning component:

```ts
// 标识候选人弹窗是否显示。
const candidateDialogVisible = ref(false)
```

Use a `use**Context` facade only when the same owned state and actions must cross several descendant levels; do not introduce provide/inject for a direct parent-child exchange.

**Negative example:**

Do not extract that same one-off dialog ref into a composable without reusable behavior or an independent responsibility:

```ts
// 创建候选人弹窗的显示状态。
export const useCandidateDialogVisible = () => {
  // 标识候选人弹窗是否显示。
  const visible = ref(false)
  return { visible }
}
```

Extraction becomes useful when the behavior owns a cohesive set of state, derived values, actions, and side effects, has real reuse, or forms a clear testing and maintenance boundary. Moving syntax to another file is not itself a responsibility boundary.

## Scenario 3: Apply Naming Conventions

**Positive example:**

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

Component directories, private single-file children, custom tags, and ordinary composable files use kebab-case. Hook files inside `hooks/` use camelCase. Every directory-managed component has both `index.vue` and `index.ts`; `index.less` remains optional. First-level `user-avatar` uses a directory even when simple. Only the simple private child `user-card-label.vue` uses the named single-file form inside `component/`.

**Negative example:**

Do not use mixed casing or omit the required entries for those same components:

```text
components/
|-- UserAvatar.vue
`-- user_card/
    |-- UserCard.vue
    `-- hooks/
        `-- use-user-card.ts
```

## Scenario 4: Keep Private Children and Hooks with Their Owner

**Positive example:**

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

Do not promote a private toolbar or hook to `src/components` or a global hooks directory before another page has a clear consumer. Local ownership reduces accidental public API surface.

**Negative example:**

Do not move those same private units to global directories without a second consumer:

```text
src/components/workbench-toolbar/index.vue
src/components/workbench-toolbar/index.ts
src/hooks/useWorkbenchSearch.ts
```

## Scenario 5: Choose Directory or Single-File Form

**Positive example:**

First-level pages, views, and shared components always use directories, even if they need no hooks, children, or separate styles:

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/views/workbench/index.vue
src/views/workbench/index.ts
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
```

The `pages` and `views` paths above illustrate alternative project conventions; use the tree the project already has.

Only simple children inside an owner's private `component/` directory use named `.vue` files:

```text
src/pages/candidate-list/component/empty-hint.vue
src/views/workbench/component/workbench-toolbar.vue
src/components/user-card/component/user-card-label.vue
```

For example, `user-card-label.vue` can keep its props, derived display text, and local styles in one file. Having a script or a style block does not require separate files.

Choose the form from the actual responsibility and supporting files:

| Situation | Form |
| --- | --- |
| First-level unit under `pages/`, `views/`, or `components/`, even when simple | `unit-name/index.vue` + `unit-name/index.ts` |
| First-level unit under an existing target-specific tree such as `components-pc/` | The same required directory and two entries |
| Simple private child in an owner's `component/` directory | `component/child-name.vue` |
| Private child needs extracted logic, styles, children, or hooks | `component/child-name/index.vue` + `index.ts`, with only the needed supporting files |
| Simple private child is promoted to a first-level shared component | Convert to `src/components/child-name/` with `index.vue` and `index.ts` |

**Negative example:**

Avoid wrapping that same simple private child in an otherwise unnecessary directory:

```text
src/components/user-card/component/user-card-label/
|-- index.vue
`-- index.ts
```

## Scenario 6: Organize a Component That Needs Supporting Files

**Positive example:**

A candidate picker owns search state, a results child, and substantial styling that benefits from a separate Less file in a project already configured for Less:

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

`index.vue` coordinates the picker UI and connects its hook. `useCandidateSearch.ts` owns the cohesive search behavior. `candidate-option.vue` remains a simple file inside its parent's private `component/`. The entry references `index.less` through the project's supported style mechanism; preserve its intended scope.

Beyond the required `index.vue` and `index.ts`, each supporting file needs its own reason to exist. If the styles are short and local, retain them in the SFC and omit `index.less`. If no child or hook is needed, omit those directories. Keep ordinary setup logic in the SFC rather than moving all of it to `index.ts` just to produce three files.

Every directory-managed component, including a private child, must have this minimal `index.ts`:

```ts
export { default } from './index.vue'
```

This forwards the component's default export; `export * from './index.vue'` alone does not forward a default export. Public type exports are optional. Keep business behavior in the SFC or a focused logic module.

For the page in Scenario 1, import the directory-managed table through its `index.ts` and the simple filter directly:

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

Use the established public barrel for cross-module imports when one exists. Do not bypass a component directory's export entry with a consumer import ending in `/index.vue`.

When `component/user-card-label.vue` later needs several private files, convert it to `component/user-card-label/index.vue`, add `component/user-card-label/index.ts`, and place those files beside it. If it instead becomes a first-level shared component, move it to `src/components/user-card-label/` with both entries even if its implementation is still simple. Update consumers and check automatic component discovery so the registered name and imports still resolve. Do not convert unrelated components during that change.

**Negative example:**

Do not create unused supporting directories or bypass the same component's public entry:

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

## Scenario 7: Handle the 1000-Line Limit

**Positive example:**

When a `.vue` file approaches 1000 lines, identify cohesive responsibilities first: data orchestration, filter UI, results UI, dialogs, or reusable behavior. Extract those units and keep their private dependencies beside them. Do not mechanically move arbitrary line ranges into files that still share hidden state or duplicate parent logic.

```text
candidate-list/
|-- index.vue
`-- component/
    |-- candidate-filter.vue
    |-- candidate-results.vue
    `-- candidate-dialog.vue
```

**Negative example:**

Do not split the same file into arbitrary numbered fragments that have no responsibility boundary:

```text
candidate-list/
|-- index.vue
`-- component/
    |-- candidate-part-1.vue
    |-- candidate-part-2.vue
    `-- candidate-part-3.vue
```

## Review Checklist

- Each split creates a cohesive responsibility boundary.
- Reusable behavior, not trivial syntax, drives composable extraction.
- Context is reserved for repeated multi-level state/action sharing.
- First-level pages, views, and shared components always use directories, even when simple.
- Only simple children inside private `component/` directories use named `.vue` files without an extra directory.
- Every directory-managed component has `index.vue` and an `index.ts` forwarding its default component export.
- Consumers use component directory exports or established public barrels; separate styles and other supporting files remain optional.
- Names and directory entries follow the required casing.
- Private children and hooks remain beside their owner.
- Every `.vue` file stays within 1000 lines through responsibility-based splits.
