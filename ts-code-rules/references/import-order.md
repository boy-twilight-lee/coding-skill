# Import Order

## Mandatory Rule

Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules when applicable. Within the type group, place module-local types before shared types.

## Group Imports by Responsibility

Keep runtime, type, internal, and UI imports in this order. Within the type group, module-local contracts precede shared contracts:

```ts
import { ref } from 'vue'
import { CandidatePayload } from './type'
import { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

When verified tooling requires separate `import type` declarations, retain the same grouping. Do not reorder unaffected imports merely to normalize the file. Type-import syntax is governed by [Type Import Syntax](type-imports.md).

## Review Checklist

- Third-party runtime dependencies precede type dependencies, internal runtime modules, and UI modules.
- Module-local types precede shared types within the type group.
