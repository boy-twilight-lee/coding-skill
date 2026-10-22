# Component Structure Examples

Owns Core Rule 8.

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

1. Use kebab-case for component files, directories, and custom tags. Use kebab-case for composable files except hooks inside `hooks/`, which use camelCase.
2. Every first-level page or component under the established page/component trees uses the directory form with `index.vue` and `index.ts`. Only a simple child inside an owner's private `component/` may use the single-file form; use a child directory when supporting files become meaningful. A stylesheet required by the mandatory extraction triggers in `css-code-rules` is a meaningful supporting file, so that private child must convert to directory form.
3. A directory-managed component's `index.ts` re-exports `index.vue` and any intentional public types. When another component needs its instance type, import the component in this entry and export a named `InstanceType<typeof Component>`, for example `export type DrawerInstance = InstanceType<typeof Drawer>`. Consumers import this type through the public entry. Keep ordinary setup and styles in the SFC; add `index.less`, hooks, constants, types, or private children only when they provide real ownership or maintenance value.
4. Keep each `.vue` file at or below 1000 lines. When moving a component or changing its directory form, update its public entry and consumers without migrating unrelated components merely to normalize structure.

## Scenario 1: Apply Naming Conventions

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

## Scenario 2: Choose Directory or Single-File Form

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
| Private child needs extracted logic, styles, children, or hooks, including a stylesheet required by `css-code-rules` | `component/child-name/index.vue` + `index.ts`, with only the needed supporting files |
| Simple private child is promoted to a first-level shared component | Convert to `src/components/child-name/` with `index.vue` and `index.ts` |

**Negative example:**

Avoid wrapping that same simple private child in an otherwise unnecessary directory:

```text
src/components/user-card/component/user-card-label/
|-- index.vue
`-- index.ts
```

## Scenario 3: Organize a Component That Needs Supporting Files

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

Beyond the required `index.vue` and `index.ts`, each supporting file needs its own reason to exist. If the styles stay below both mandatory extraction triggers in `css-code-rules` and remain easy to maintain, retain them in the SFC and omit `index.less`. When either trigger is met, extract the whole style block; this is required even if the component remains cohesive. If no child or hook is needed, omit those directories. Keep ordinary setup logic in the SFC rather than moving all of it to `index.ts` just to produce three files.

Every directory-managed component, including a private child, must have this minimal `index.ts`:

```ts
export { default } from './index.vue'
```

This forwards the component's default export; `export * from './index.vue'` alone does not forward a default export. Export public types when consumers need them. Keep business behavior in the SFC or a focused logic module.

Import a directory-managed table through its `index.ts` and a simple private filter directly:

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

Apply `ts-code-rules` for cross-module import-path selection. Do not bypass a component directory's export entry with a consumer import ending in `/index.vue`.

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

## Scenario 4: Export a Component Instance Type

When another component holds a ref to a drawer or calls its exposed actions, export the instance type from the drawer's `index.ts`:

```ts
import Drawer from './index.vue'

export default Drawer
/** 抽屉组件公开实例，供其他组件声明引用及调用暴露的方法。 */
export type DrawerInstance = InstanceType<typeof Drawer>
```

The consumer imports the component and its instance type through the public entry:

```ts
import { DrawerInstance } from '@/components/drawer'
import Drawer from '@/components/drawer'

// 当前页面持有的抽屉实例，用于调用抽屉公开的方法。
const drawerRef = ref<DrawerInstance | null>(null)
```

The consumer example assumes the active auto-import configuration covers `ref`; otherwise import it explicitly. Use a separate `import type` if verified tooling requires it. No instance-type export is required when no external component needs it.

## Review Checklist

- First-level pages, views, and shared components always use directories, even when simple.
- Only simple children inside private `component/` directories use named `.vue` files without an extra directory.
- A private child that meets a mandatory style-extraction trigger is no longer a simple single-file child and uses directory form with its sibling stylesheet.
- Every directory-managed component has `index.vue` and an `index.ts` forwarding its default component export.
- Consumers do not bypass component directory exports; cross-module import-path selection follows `ts-code-rules`, while separate styles and other supporting files remain optional.
- Names and directory entries follow the required casing.
- Instance types needed by other components are named exports from the component public entry.
- Every `.vue` file stays within 1000 lines.
