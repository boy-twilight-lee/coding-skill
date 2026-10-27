# Imports

Owns Core Rule 4.

## Mandatory Rules

1. Use standard `import { ... } from '...'` declarations by default, including for types. Combine types and runtime values from the same module in one declaration. Do not add separate `import type` lines merely to label type usage or split a shared source into extra declarations. Never use inline `type` modifiers.
2. Order imports as third-party runtime dependencies, type-only dependencies, internal runtime modules, then UI or component modules. Within the type-only dependency group, module-local types precede shared types. A declaration containing both types and runtime values belongs to its runtime group; do not split it to satisfy grouping.
3. Avoid `import type` unless a verified, active compiler, lint, bundler, or package runtime constraint makes a standard import invalid. Keep any unavoidable exception minimal and report its concrete reason. Do not change project configuration merely to enforce this preference.

## Scenario 1: Group Imports by Responsibility

**Positive example:**

Use standard imports for both type-only dependencies and runtime values:

```ts
import { ref } from 'vue'
import { CandidatePayload } from './type'
import { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

**Negative example:**

Do not put UI before runtime dependencies or shared types before local contracts:

```ts
import CandidateCard from '@/components/candidate-card'
import { CandidateQuery } from '@/type'
import { CandidatePayload } from './type'
import { loadCandidates } from '@/apis'
import { ref } from 'vue'
```

Grouping does not require separator blank lines; apply [Blank Lines](blank-lines.md).

## Scenario 2: Combine Types and Values from the Same Source

**Positive example:**

Import the payload type and API function together:

```ts
import { CandidatePayload, saveCandidate } from '@/apis'
```

**Negative example:**

Do not add a separate type-import line when the same ordinary import is valid:

```ts
import type { CandidatePayload } from '@/apis'
import { saveCandidate } from '@/apis'
```

Do not split the same source into separate ordinary import declarations either:

```ts
import { CandidatePayload } from '@/apis'
import { saveCandidate } from '@/apis'
```

Inline type modifiers also remain prohibited:

```ts
import { saveCandidate, type CandidatePayload } from '@/apis'
```

The combined declaration stays in the internal runtime group because it imports an API function. Verify active tooling when compatibility is uncertain; an unavoidable explicit type-import requirement is an exception, not the normal example or a reason to add type-only lines proactively.

## Review Checklist

- Standard imports are the default; types and values from the same source share one declaration.
- No unnecessary `import type` lines or inline `type` modifiers appear; unavoidable exceptions have a verified reason.
- Runtime, type-only, internal, and UI dependencies follow the required order; mixed declarations stay with their runtime group and local types precede shared types.
- Cross-module paths also follow [Public Entries](public-entries.md).
