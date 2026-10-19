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
`-- styles/               Application-wide styles
```

1. Preserve the established page tree and any mobile/PC separation. Do not create a competing tree or merge target-specific implementations through runtime device branches unless the request requires it.
2. Keep page-private components and hooks beside the page. Promote them to a `src`-level directory only after actual cross-page reuse. TypeScript helper ownership, shared utility modules, and public entries are governed by `ts-code-rules`.
3. Before hand-writing a substantial capability, inspect installed dependencies and wrappers. Add a package only with authorization and a demonstrated gap, after checking maintenance, provenance, target compatibility, bundle impact, and license; report unresolved commercial-use safety.

## Scenario 1: Place Route Orchestration and Reusable UI

**Positive example:**

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

**Negative example:**

Do not place those same page-private and reusable units under competing or incorrect owners:

```text
src/views/candidate-list/index.vue
src/pages/candidate-list/index.vue
src/components/candidate-filter/index.vue
src/pages/user-avatar.vue
```

## Scenario 2: Preserve Mobile and PC Trees

**Positive example:**

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

**Negative example:**

Do not collapse the established entries into a shared component that chooses a target at runtime:

```vue
<template>
  <candidate-card-pc v-if="deviceTarget === 'pc'" :candidate="candidate" />
  <candidate-card-mobile v-else :candidate="candidate" />
</template>

<script setup lang="ts">
import CandidateCardMobile from '@/components/candidate-card'
import CandidateCardPc from '@/components-pc/candidate-card'

// <zh: read the presentation target for the current runtime environment.>
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

**Positive example:**

Reuse the installed capability:

```ts
import { format } from 'date-fns'

// <zh: format the candidate update time for list display.>
export const formatCandidateUpdatedAt = (value: Date) => {
  return format(value, 'yyyy-MM-dd HH:mm')
}
```

**Negative example:**

Do not add and wrap a second date library solely to implement the same formatting behavior:

```ts
import dayjs from 'dayjs'

// <zh: format the candidate update time for list display.>
export const formatCandidateUpdatedAt = (value: Date) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}
```

If the installed dependency cannot meet a demonstrated requirement, document that gap first. Add a replacement only when dependency changes are in scope and its maintenance, license, provenance, bundle impact, and target compatibility can be verified.

## Review Checklist

- Route orchestration, reusable UI, and layouts live in their intended layers.
- Private components and hooks remain beside their owner until cross-page reuse is real.
- Mobile and PC presentation trees remain separate.
- New dependencies are introduced only when changes are in scope and capability, provenance, compatibility, bundle impact, and license checks succeed.
