# Imports and Type Organization Rules

## Mandatory Rules

1. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules when applicable. Within the type group, place module-local types before shared types.
2. Prefer standard imports when the compiler and bundler safely erase type-only usage. Use a separate `import type` only when required by the verified compiler, lint, bundler, or package runtime contract; never use inline `type` modifiers.
3. Import another module through its configured alias and public entry. Do not climb two or more parent directories or reach into another module's private files.
4. Keep concise private types near their owner. Move reusable or public contracts to the repository's established type module, and keep ambient `.d.ts` declarations in its configured declaration location.

## Scenario 1: Group Imports and Choose Type Syntax from Configuration

Situation: a component uses one third-party runtime API, local and shared types, an internal API module, and a UI component.

When the verified compiler, bundler, lint, and package contracts safely erase type-only usage without requiring `import type`, use standard imports while retaining the required groups:

```ts
import { ref } from 'vue'
import { CandidatePayload } from './type'
import { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

When the active configuration requires type-only imports, use separate declarations in the same type group:

```ts
import { ref } from 'vue'
import type { CandidatePayload } from './type'
import type { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

Do not infer the choice from a neighboring file or mix the groups and inline type modifiers:

```ts
import CandidateCard from '@/components/candidate-card'
import { loadCandidates, type CandidatePayload } from '@/apis'
import { ref } from 'vue'
```

Inspect the active `tsconfig`, lint rules, bundler behavior, and package runtime contract before choosing between the two valid grouped forms. Do not rewrite unaffected imports solely to impose the preferred form.

## Scenario 2: Use Public Entries across Module Boundaries

Situation: a page consumes a shared component and a capability owned by another feature.

Import through configured aliases and the owners' public entries:

```ts
import { normalizeCandidate } from '@/features/candidate'
import CandidateCard from '@/components/candidate-card'
```

Do not climb across several parent directories, bypass a component entry, or reach into another feature's private implementation:

```ts
import CandidateCard from '../../components/candidate-card/index.vue'
import { normalizeCandidate } from '@/features/candidate/private/normalize-candidate'
```

Relative imports remain appropriate inside one owning module when they do not cross the module boundary. The public-entry rule prevents external consumers from coupling to private layout; it does not require every local sibling import to go through a global barrel.

## Scenario 3: Keep Types with Their Actual Owner

Situation: one dialog has a private form shape, the candidate feature publishes a reusable request contract, and the application needs an ambient environment declaration.

Use the repository's established equivalents of these locations:

```text
src/pages/candidate-list/component/candidate-dialog/type.ts   Private dialog type
src/features/candidate/type/index.ts                          Reusable or public feature contract
src/type/env.d.ts                                             Configured ambient declaration location
```

Do not move the dialog-only shape into a global catch-all type module, hide the public feature contract inside a private component, or place ambient declarations in an arbitrary implementation file. Promote a type only after a real consumer crosses its current ownership boundary, and export public contracts through the owning module's entry.

## Review Checklist

- Runtime, type, internal, and UI imports follow the required grouping.
- Type-only imports match the verified compiler, lint, bundler, and runtime contract.
- Cross-module imports use configured aliases and public entries.
- Private, reusable, public, and ambient types remain with their intended owners.
