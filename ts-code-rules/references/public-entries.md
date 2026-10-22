# Cross-Module Public Entries

Owns Core Rule 3.

## Mandatory Rule

Import another module through its configured alias and public entry. Use the required `index.ts` entries described in [Application Architecture](application-architecture.md) to expose related child modules. Do not climb two or more parent directories or reach into another module's private files.

## Scenario 1: Use Public Entries across Module Boundaries

Situation: a page loads a candidate list through `apis/` and renders a shared component from `components/`. `apis/index.ts` exposes `fetchCandidateList` from `candidate-api.ts`, and `components/index.ts` exposes `CandidateCard` through the child component's entry.

**Positive example:**

Import through configured aliases and the owners' public entries:

```ts
import { fetchCandidateList } from '@/apis'
import { CandidateCard } from '@/components'
```

**Negative example:**

Do not bypass the API aggregate entry to import its implementation file, or climb across several parent directories to reach a component's implementation:

```ts
import { fetchCandidateList } from '@/apis/candidate-api'
import CandidateCard from '../../components/candidate-card/index.vue'
```

Relative imports remain appropriate inside one owning module when they do not cross the module boundary. The public-entry rule prevents external consumers from coupling to private layout; it does not require every local sibling import to go through a global barrel.

## Keep Barrels Declarative

Barrel files re-export public declarations; they do not contain business implementation or expose private internals for convenience.

For example, `src/components/index.ts` exposes the child component through its own public entry:

```ts
export { default as CandidateCard } from './candidate-card'
```

This aggregate entry does not replace the child owner's `index.ts`. Keep component setup and other implementation in their owning modules. `styles/index.less` imports styles rather than re-exporting TypeScript modules.

## Review Checklist

- Cross-module consumers use configured aliases and public entries.
- Imports do not climb two or more parent directories or reach into another owner's private implementation.
- Relative imports within one owner remain allowed; public barrels contain re-exports rather than business implementation.
- Required aggregate entries expose related public child modules through their own entries, without replacing those child boundaries.
