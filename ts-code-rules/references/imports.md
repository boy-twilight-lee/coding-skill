# Imports

Owns Core Rule 5.

## Mandatory Rules

1. Order imports as third-party runtime dependencies, type dependencies, internal runtime modules, then UI or component modules. Within the type group, module-local types precede shared types, regardless of import syntax.
2. Prefer standard imports when the compiler and bundler safely erase type-only usage. Use separate `import type` declarations only when verified compiler, lint, bundler, or package runtime contracts require them. Never use inline `type` modifiers.
3. Inspect active configuration rather than copying neighboring syntax. Do not reorder or rewrite unaffected imports solely to normalize them.

## Scenario 1: Group Imports by Responsibility

**Positive example:**

When the verified toolchain safely erases type-only usage:

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

## Scenario 2: Choose Type Syntax from Configuration

**Positive example:**

When active tooling or runtime contracts require explicit type-only declarations, retain the same grouping:

```ts
import { ref } from 'vue'
import type { CandidatePayload } from './type'
import type { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

**Negative example:**

Inline modifiers remain prohibited even when accepted by the compiler:

```ts
import { loadCandidates, type CandidatePayload } from '@/apis'
```

Standard imports are preferred only when their type-only usage is safely erased. Inspect the effective `tsconfig`, lint, bundler behavior, and package exports before choosing; do not assume that a type has a runtime export.

## Review Checklist

- Runtime, type, internal, and UI imports follow the required order; local types precede shared types.
- Type syntax matches verified tooling and runtime contracts; no inline `type` modifiers appear.
- Unaffected imports are preserved; cross-module paths also follow [Public Entries](public-entries.md).
