# Component Structure Examples

Owns Core Rule 9.

For when and how to split templates, scripts, and styles, read Core Rule 10's [Component Decomposition Examples](component-decomposition-examples.md). This reference owns naming, directory placement, and public entries.

## Mandatory Rules

Use this complete allowed structure for a directory-managed page or component. `index.vue` and `index.ts` are required; all other entries are optional and need a real owner-specific purpose. Do not create every optional entry just to match the map. A single extracted stylesheet uses the owner-root file:

```text
<owner>/
|-- component/            Owner-private components
|-- constants/            Owner-private constants
|-- hooks/                Owner-private composables and functional utility hooks
|-- type/                 Owner-private types
|-- index.less            One extracted stylesheet, when needed
|-- index.ts              Public component export
`-- index.vue
```

When multiple owned stylesheets are genuinely needed, use `style/` instead of the owner-root `index.less`:

```text
<owner>/
|-- component/
|-- constants/
|-- hooks/
|-- style/
|   |-- scoped.less
|   `-- global.less
|-- type/
|-- index.ts
`-- index.vue
```

The two style forms are mutually exclusive. The scoped/global filenames illustrate a justified split, not required files. Preserve the existing language's equivalent extension, and apply the style-extraction and scope rules from `css-code-rules`. If no separate stylesheet is needed, omit both the root stylesheet and `style/`.

1. Use kebab-case for component files, directories, and custom tags. Use kebab-case for composable files except hooks inside `hooks/`, which use camelCase.
2. Every first-level page or component under the established page/component trees uses the directory form with `index.vue` and `index.ts`. Only a simple child inside an owner's private `component/` may use the single-file form; use a child directory when supporting files become meaningful. A stylesheet required by the mandatory extraction triggers in `css-code-rules` is a meaningful supporting file, so that private child must convert to directory form.
3. A directory-managed component's `index.ts` forwards the default `index.vue` component and intentionally public methods/functions, components, types, or modules from its subdirectories that external consumers actually need. Re-export those declarations explicitly rather than exposing every private file. The entry contains no business implementation, state initialization, or side effects. Instance actions remain implemented and exposed in the SFC through `defineExpose`; forwarding a module function does not turn setup-local state or actions into module globals. When another component needs the instance type, import the component in this entry and export a named `InstanceType<typeof Component>`, for example `export type DrawerInstance = InstanceType<typeof Drawer>`. Consumers use this public entry instead of reaching into private subdirectories.
4. Do not independently add unrelated directories or loose files to the component/page root. Keep private children under `component/`, constants under `constants/`, types under `type/`, and extracted functional logic under `hooks/`. Do not add parallel owner-private `utils/`, `helpers/`, or `services/` directories, or loose files such as `helper.ts`, `format.ts`, `context.ts`, or `useDetailTools.ts` beside `index.vue`. Directory-managed private children follow this same structure recursively; simple private children remain under their owner's `component/` as allowed above.
5. Cohesive owner-specific functional helpers may be grouped into one focused utility hook such as `hooks/useDetailTools.ts`. Do not create one scattered file or hook per tiny function, invent reactive state merely to call a utility a hook, or extract simple one-off expressions without a real responsibility boundary. Put genuinely shared stateless functions under the project's established `utils` structure and public entry; extend an existing matching utility module before adding another. Shared reactive composables continue to use the project's established hook layer rather than being treated as stateless utilities.
6. Choose exactly one extracted-style form by actual file count: one stylesheet uses `index.less` beside `index.vue`; multiple genuinely needed stylesheets all live in `style/`, without a simultaneous owner-root `index.less`. Use the matching extension when preserving an existing CSS/Sass/SCSS component. Do not create a one-file `style/` directory, mix the two forms, or split one stylesheet artificially to justify a directory. CSS extraction thresholds and scope boundaries still apply; if no extracted styles are needed, use neither form.

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

Beyond the required `index.vue` and `index.ts`, each supporting entry needs a real owner-specific purpose. Omit unused child, hook, and style entries; do not move ordinary setup into `index.ts` just to produce extra files. Apply Core Rule 10 when deciding whether extraction is needed, then use this rule's allowed destinations.

Every directory-managed component, including a private child, must have this minimal `index.ts`:

```ts
export { default } from './index.vue'
```

This forwards the component's default export; `export * from './index.vue'` alone does not forward a default export. Export public types when consumers need them. Keep business behavior in the SFC or a focused owner hook under `hooks/`.

When external consumers also need specific components, hooks/functions, or constants owned by this feature, explicitly forward only those public declarations. The following `index.ts` excerpt assumes each named declaration exists and is part of the intended public contract:

```ts
export { default } from './index.vue'
export { default as StatisticsSummary } from './component/statistics-summary'
export { useDetailActions } from './hooks/useDetailActions'
export { STATISTICS_TAB } from './constants'
```

The directory-managed statistics summary is forwarded through its own entry. Keep ordinary private children and implementation hooks private; do not re-export entire subdirectory trees merely for convenience. An instance method exposed by the SFC is called through the component instance, while module functions/hooks use the explicit named exports above. The barrel forwards declarations and does not implement either kind of method.

Import a directory-managed table through its `index.ts` and a simple private filter directly:

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

Apply `ts-code-rules` for cross-module import-path selection. Do not bypass a component directory's export entry with a consumer import ending in `/index.vue`.

When `component/user-card-label.vue` later needs several private files, convert it to `component/user-card-label/index.vue`, add `component/user-card-label/index.ts`, and place each supporting file under the allowed directory for its responsibility. If it instead becomes a first-level shared component, move it to `src/components/user-card-label/` with both entries even if its implementation is still simple. Update consumers and check automatic component discovery so the registered name and imports still resolve. Do not convert unrelated components during that change.

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
export type DrawerInstance = InstanceType<typeof Drawer>
```

The consumer imports the component and its instance type through the public entry:

```ts
import { DrawerInstance } from '@/components/drawer'
import Drawer from '@/components/drawer'

const drawerRef = ref<DrawerInstance | null>(null)
```

The consumer example assumes the active auto-import configuration covers `ref`; otherwise import it explicitly. Use a separate `import type` if verified tooling requires it. No instance-type export is required when no external component needs it.

## Scenario 5: Keep Functional Helpers and Styles Within the Allowed Structure

**Positive example:**

Group related detail-page transformations into one utility hook. Share genuinely cross-owner stateless functions through the established project utility layer; the utility entry re-exports public functions rather than implementing them:

```text
src/
|-- pages/teacher-exam-detail/
|   |-- hooks/
|   |   `-- useDetailTools.ts
|   |-- index.ts
|   `-- index.vue
`-- utils/
    |-- exam-statistics.ts
    `-- index.ts
```

Keep simple one-off logic in `index.vue` when extraction adds no real responsibility. A utility hook need not introduce refs, watchers, or side effects merely to group cohesive functions.

**Negative example:**

Do not scatter the same page's private functions, types, or context across unapproved directories and loose root files:

```text
teacher-exam-detail/
|-- helpers/
|-- utils/
|-- services/
|-- helper.ts
|-- format.ts
|-- context.ts
|-- useDetailTools.ts
|-- detail-type.ts
|-- index.ts
`-- index.vue
```

Also do not retain both extracted-style forms for one owner:

```text
teacher-exam-detail/
|-- style/
|   |-- scoped.less
|   `-- global.less
|-- index.less
|-- index.ts
`-- index.vue
```

With one extracted stylesheet, keep only `index.less`; with multiple justified stylesheets, put all of them in `style/` and omit the owner-root stylesheet. Do not add unused files or directories from the complete structure map.

## Review Checklist

- First-level pages, views, and shared components always use directories, even when simple.
- Only simple children inside private `component/` directories use named `.vue` files without an extra directory.
- A private child that meets a mandatory style-extraction trigger is no longer a simple single-file child and uses directory form with its sibling stylesheet.
- Every directory-managed component has `index.vue` and an `index.ts` forwarding its default component export.
- Consumers do not bypass component directory exports; cross-module import-path selection follows `ts-code-rules`, while separate styles and other supporting files remain optional.
- Names and directory entries follow the required casing.
- Instance types needed by other components are named exports from the component public entry.
- index.ts explicitly forwards the default component and externally needed methods/components/submodules/types, with no business implementation or blanket private exports.
- Owner roots contain only the allowed required/optional entries; no unrelated directories or loose helper files are introduced.
- Cohesive private functional helpers use focused hooks; genuinely shared stateless functions use the established project utils layer.
- Extracted styles use exactly one form: one root index.less or multiple files in style/, never both or a one-file style directory.
