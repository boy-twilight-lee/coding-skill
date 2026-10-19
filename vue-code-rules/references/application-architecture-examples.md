# Application Architecture Examples

## Mandatory Rules

Use the established equivalents of these directories; optional target-specific trees exist only when the repository already separates those targets.

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

1. Preserve the established page tree and any mobile/PC separation. Do not create a competing tree or merge target-specific implementations through runtime device branches unless the request requires it.
2. Keep page-private components, hooks, and helpers beside the page. Promote them to a `src`-level directory only after actual cross-page reuse; organize promoted utilities by focused business domain or technical capability and export them through the directory entry.
3. Before hand-writing a substantial capability, inspect installed dependencies and wrappers. Add a package only with authorization and a demonstrated gap, after checking maintenance, provenance, target compatibility, bundle impact, and license; report unresolved commercial-use safety.

## Scenario 1: Place Route Orchestration and Reusable UI

```text
src/pages/candidate-list/index.vue
src/pages/candidate-list/index.ts
src/pages/candidate-list/component/candidate-filter.vue
src/components/user-avatar/index.vue
src/components/user-avatar/index.ts
src/layout/default-layout/index.vue
src/layout/default-layout/index.ts
```

The page coordinates route data and page-specific flows. A private filter remains beside the page and can use a named `.vue` file inside `component/` when simple. A user avatar with cross-page consumers belongs in `src/components` and always uses a directory, even when simple. Page frames belong in `src/layout`. Every directory-managed Vue component exposes its `index.vue` through `index.ts`. See [Component Structure Examples](component-structure-examples.md) for directory exports and private child criteria.

If the project uses `src/views` for route pages, keep that convention and apply the same structure:

```text
src/views/workbench/index.vue
src/views/workbench/index.ts
src/views/workbench/component/workbench-toolbar.vue
```

Do not create a second page tree merely to switch between `pages` and `views`.

## Scenario 2: Preserve Mobile and PC Trees

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

Make target-specific presentation changes in the matching tree. Do not merge them into one component with runtime device detection unless shared behavior is explicitly required and the ownership tradeoff has been accepted.

Do not collapse the established entries into a shared component that chooses a target at runtime:

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

This runtime branch makes both target implementations part of one ownership and loading path, weakens route-level separation, and encourages target-specific behavior to leak into shared code. Keep the target entries separate. When both targets genuinely share data or behavior, extract only that neutral capability to the nearest common owner; do not merge their presentation roots merely to reuse it.

## Scenario 3: Evaluate Dependencies before Reimplementation

Before hand-writing a substantial capability:

1. Inspect installed dependencies and existing project wrappers.
2. Check whether an established library already solves the requirement reliably.
3. Prefer the installed capability when it meets the requirement without disproportionate cost.
4. Only if the installed stack has a demonstrated gap and the task permits dependency changes, evaluate a new package's maintenance activity, license, provenance, browser support, and bundle impact from package metadata or authoritative sources.

Do not add a second library for a capability already covered by the project. If provenance or commercial-use terms cannot be verified, report that constraint instead of silently adding the package or claiming it is safe.

Concrete case: `package.json` already includes a maintained, commercially acceptable date library:

```json
{
  "dependencies": {
    "date-fns": "^4.0.0"
  }
}
```

Reuse the installed capability:

```ts
import { format } from 'date-fns'

// 将候选人更新时间格式化为列表展示文本。
export const formatCandidateUpdatedAt = (value: Date) => {
  return format(value, 'yyyy-MM-dd HH:mm')
}
```

Do not add and wrap a second date library solely to implement the same formatting behavior:

```ts
import dayjs from 'dayjs'

// 将候选人更新时间格式化为列表展示文本。
export const formatCandidateUpdatedAt = (value: Date) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}
```

If the installed dependency cannot meet a demonstrated requirement, document that gap first. Add a replacement only when dependency changes are in scope and its maintenance, license, provenance, bundle impact, and target compatibility can be verified.

## Scenario 4: Promote a Stateless Utility Only for Cross-Page Sharing

When two different pages actually consume the same stateless date behavior, move it into a focused implementation module:

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

Re-export it from the barrel without placing implementation there:

```ts
export * from './date'
```

Extend an existing matching module before creating another. If only a candidate page's filter and table share the helper, keep it in a focused module beside that page and import it locally; two components on the same page do not establish cross-page reuse. Promote it when another page becomes an actual consumer. Real complexity or focused testing needs can justify a private module, but not a `src/utils` promotion. Do not collect unrelated helpers in catch-all modules. Application-wide infrastructure such as the request client retains its designated layer; it is not a promotion of page-private code.

## Review Checklist

- Route orchestration, reusable UI, and layouts live in their intended layers.
- Private modules remain beside their owner until cross-page reuse is real.
- Mobile and PC presentation trees remain separate.
- New dependencies are introduced only when changes are in scope and capability, provenance, compatibility, bundle impact, and license checks succeed.
- Owner-private stateless helpers move to focused `src/utils` modules and barrel exports only for actual cross-page sharing; same-page sharing stays with the page or nearest common owner.
