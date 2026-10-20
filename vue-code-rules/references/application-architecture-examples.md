# Application Architecture Examples

## Mandatory Rules

Use the established equivalents of these entries. This complete map is for ownership decisions, not for generating empty directories; optional target-specific trees exist only when the repository already separates those targets.

```text
src/
|-- App.vue                Application root
|-- main.ts                Application bootstrap owned by ts-code-rules
|-- apis/                  Backend transport modules owned by ts-code-rules
|-- assets/                Bundled static assets
|-- components/            Cross-page reusable UI
|-- components-pc/         Optional target-specific reusable UI
|-- constants/             Shared constants owned by ts-code-rules
|-- hooks/                 Cross-page reusable composables
|-- layout/                Page frames
|-- pages/ (or views/)     Route-level page units
|-- pages-pc/              Optional target-specific pages
|-- router/                Route records, guards, and router assembly
|-- services/              Capability adapters owned by ts-code-rules
|-- store/                 Application-wide state owned by ts-code-rules
|-- styles/                Application-wide styles owned by css-code-rules
|-- type/                  Ambient or application-wide types owned by ts-code-rules
`-- utils/                 Shared stateless helpers owned by ts-code-rules
```

1. Preserve the established page tree and any mobile/PC separation. Do not create a competing tree or merge target-specific implementations through runtime device branches unless the request requires it.
2. Keep page-private components and hooks beside the page. Promote them to a `src`-level directory only after actual cross-page reuse. TypeScript helper ownership, shared utility modules, and public entries are governed by `ts-code-rules`.
3. Keep application bootstrap, APIs, constants, services, stores, types, and utilities in the source layers defined by `ts-code-rules`; keep global styles in the layer defined by `css-code-rules`. Do not move these responsibilities into pages or components merely because the current consumer is UI code.
4. Preserve established singular or plural names and layer semantics. Do not create both `api/` and `apis/`, both `page/` and `pages/`, or both `view/` and `views/` to mirror this map.

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

## Review Checklist

- Route orchestration, reusable UI, and layouts live in their intended layers.
- Private components and hooks remain beside their owner until cross-page reuse is real.
- Mobile and PC presentation trees remain separate.
- TypeScript and style source layers remain with their owning skills, without competing directories or placeholder folders.
