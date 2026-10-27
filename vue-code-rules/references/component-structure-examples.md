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
5. Cohesive owner-specific functional helpers may be grouped into one focused utility hook such as `hooks/useDetailTools.ts`. Do not create one scattered file or hook per tiny function or invent reactive state merely to call a utility a hook. Put genuinely shared stateless functions under the project's established `utils` structure and public entry; extend an existing matching utility module before adding another. Shared reactive composables continue to use the project's established hook layer rather than being treated as stateless utilities.
6. Choose exactly one extracted-style form by actual file count: one stylesheet uses `index.less` beside `index.vue`; multiple genuinely needed stylesheets all live in `style/`, without a simultaneous owner-root `index.less`. Use the matching extension when preserving an existing CSS/Sass/SCSS component. Do not create a one-file `style/` directory, mix the two forms, or split one stylesheet artificially to justify a directory. CSS extraction thresholds and scope boundaries still apply; if no extracted styles are needed, use neither form.

## Scenario 1: Apply Naming and Choose Component Form

| Situation | Required form |
| --- | --- |
| First-level pages/views/components unit, even when simple | unit-name/index.vue + index.ts |
| First-level unit under an existing target tree such as components-pc/ | The same directory and two entries |
| Simple private child inside an owner's component/ | component/child-name.vue, without an unnecessary extra directory |
| Private child needs extracted logic, styles, children, or hooks | component/child-name/index.vue + index.ts and only needed supporting entries |
| Simple private child promoted to a shared first-level component | Convert to the shared component directory and two entries |

**Positive naming examples:**

These are illustrative paths/tag spellings within the complete allowed structures above. Component files/directories/tags use kebab-case; hook files inside hooks/ use camelCase. Preserve the project's existing pages/views tree rather than creating both.

```text
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
src/components/user-card/component/user-card-label.vue
src/components/user-card/hooks/useUserCard.ts
<user-card />
```

A script block, props, derived display text, or small local styles alone do not make a simple private child complex. Convert it only when supporting files or shared-component ownership warrant directory form; update consumers and automatic discovery after the move.

**Negative naming examples:**

```text
components/UserAvatar.vue
components/user_card/UserCard.vue
components/user-card/hooks/use-user-card.ts
<UserCard />
```

Do not create this directory for a private child that still needs no supporting entries:

```text
component/user-card-label/
|-- index.vue
`-- index.ts
```

## Scenario 2: Forward the Actual Public Contract

The first line is the minimal index.ts. Add other named exports only when external consumers need the existing declarations; directory-managed children are forwarded through their own entries:

```ts
export { default } from './index.vue'
export { default as StatisticsSummary } from './component/statistics-summary'
export { useDetailActions } from './hooks/useDetailActions'
export { STATISTICS_TAB } from './constants'
```

Keep business behavior in the SFC or its focused hooks. Do not expose whole private trees, implement workflows in the barrel, or move ordinary setup into index.ts to create extra files. Instance methods remain exposed by the SFC and called through its instance, separately from named module exports.

Consumers within this owner may import the directory-managed child through its entry and the simple private child directly. Cross-owner paths follow ts-code-rules:

```ts
import CandidateTable from './component/candidate-table'
import CandidateFilter from './component/candidate-filter.vue'
```

**Negative examples:**

This export does not forward the component's default export:

```ts
export * from './index.vue'
```

This consumer bypasses the component entry:

```ts
import CandidatePicker from '@/components/candidate-picker/index.vue'
```

## Scenario 3: Export a Needed Component Instance Type

When another component holds the drawer instance or calls its exposed actions, the drawer entry exports a named instance type:

```ts
import Drawer from './index.vue'

export default Drawer
export type DrawerInstance = InstanceType<typeof Drawer>
```

The consumer uses that public entry:

```ts
import { DrawerInstance } from '@/components/drawer'
import Drawer from '@/components/drawer'

const drawerRef = ref<DrawerInstance | null>(null)
```

The ref import is omitted only with verified auto-import coverage; use separate import type when verified tooling requires it. No external instance consumer means no required instance-type export.

## Scenario 4: Keep Helpers and Styles with Their Owners

A focused private utility hook and genuinely shared stateless utility use separate ownership layers. Utility barrels re-export public functions:

```text
src/pages/teacher-exam-detail/hooks/useDetailTools.ts
src/utils/exam-statistics.ts
src/utils/index.ts
```

Utility hooks need no invented refs/watchers/effects, and unused supporting directories are omitted. Extracted styles are referenced through the owner's supported SFC style mechanism to preserve scope; Rule 10 governs when to extract them.

**Negative example: unrelated directories and loose files:**

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

**Negative example: both style forms for one owner:**

```text
teacher-exam-detail/
|-- style/
|   |-- scoped.less
|   `-- global.less
|-- index.less
|-- index.ts
`-- index.vue
```

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
