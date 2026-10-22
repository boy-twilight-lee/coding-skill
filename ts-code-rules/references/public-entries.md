# Cross-Module Public Entries

## Mandatory Rule

Import another module through its configured alias and public entry. Do not climb two or more parent directories or reach into another module's private files.

## Use Public Entries across Module Boundaries

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

## Keep Barrels Declarative

Barrel files re-export public declarations; they do not contain business implementation or expose private internals for convenience.

## Review Checklist

- Cross-module consumers use configured aliases and public entries.
- Imports do not climb two or more parent directories or reach into another owner's private implementation.
- Relative imports within one owner remain allowed; public barrels contain re-exports rather than business implementation.
