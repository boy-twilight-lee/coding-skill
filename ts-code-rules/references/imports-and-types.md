# Imports and Public Entry Rules

## Mandatory Rules

1. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules when applicable. Within the type group, place module-local types before shared types.
2. Prefer standard imports when the compiler and bundler safely erase type-only usage. Use a separate `import type` only when required by the verified compiler, lint, bundler, or package runtime contract; never use inline `type` modifiers.
3. Import another module through its configured alias and public entry. Do not climb two or more parent directories or reach into another module's private files.

## Scenario 1: Group Imports and Choose Type Syntax from Configuration

Situation: a component uses one third-party runtime API, local and shared types, an internal API module, and a UI component.

**Positive example:**

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

For the exact import set used in the negative example below, the configured type-only form remains grouped like this:

```ts
import { ref } from 'vue'
import type { CandidatePayload } from '@/apis'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

**Negative example:**

Do not infer the choice from a neighboring file or mix the same imports and inline type modifiers:

```ts
import CandidateCard from '@/components/candidate-card'
import { loadCandidates, type CandidatePayload } from '@/apis'
import { ref } from 'vue'
```

Inspect the active `tsconfig`, lint rules, bundler behavior, and package runtime contract before choosing between the two valid grouped forms. Do not rewrite unaffected imports solely to impose the preferred form.

## Scenario 2: Use Public Entries across Module Boundaries

Situation: a page consumes a shared component and a capability owned by another feature.

**Positive example:**

Import through configured aliases and the owners' public entries:

```ts
import { normalizeCandidate } from '@/features/candidate'
import CandidateCard from '@/components/candidate-card'
```

**Negative example:**

Do not climb across several parent directories, bypass a component entry, or reach into another feature's private implementation:

```ts
import CandidateCard from '../../components/candidate-card/index.vue'
import { normalizeCandidate } from '@/features/candidate/private/normalize-candidate'
```

Relative imports remain appropriate inside one owning module when they do not cross the module boundary. The public-entry rule prevents external consumers from coupling to private layout; it does not require every local sibling import to go through a global barrel.

## Review Checklist

- Runtime, type, internal, and UI imports follow the required grouping.
- Type-only imports match the verified compiler, lint, bundler, and runtime contract.
- Cross-module imports use configured aliases and public entries.
