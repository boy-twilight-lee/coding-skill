# Application Architecture Examples

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

## Scenario 3: Evaluate Dependencies before Reimplementation

Before hand-writing a capability:

1. Inspect installed dependencies and existing project wrappers.
2. Check whether an established library already solves the requirement reliably.
3. Verify maintenance activity, license, provenance, browser support, and commercial-use safety.
4. Prefer the existing dependency when it meets the requirement without disproportionate cost.

Do not add a second library for a capability already covered by the project, and do not introduce packages with unclear or commercially risky terms.

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

If the installed dependency cannot meet a demonstrated requirement, document that gap first, then verify the replacement's maintenance, license, provenance, bundle impact, and target compatibility before introducing it.

## Scenario 4: Extract a Reusable Stateless Utility

Move reusable date logic into a focused implementation module:

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

Extend an existing matching module before creating another. Do not leave a reusable helper inside a component, and do not collect unrelated helpers in catch-all modules.

## Review Checklist

- Route orchestration, reusable UI, and layouts live in their intended layers.
- Private modules remain beside their owner until cross-page reuse is real.
- Mobile and PC presentation trees remain separate.
- Dependencies are reused or introduced only after capability and license checks.
- Reusable stateless helpers use focused `src/utils` modules and barrel exports.
