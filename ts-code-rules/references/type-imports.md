# Type Import Syntax

## Mandatory Rule

Prefer standard imports when the compiler and bundler safely erase type-only usage. Use a separate `import type` only when required by the verified compiler, lint, bundler, or package runtime contract; never use inline `type` modifiers.

## Choose Syntax from Verified Configuration

Inspect the active `tsconfig`, lint rules, bundler behavior, and package runtime contract. Do not infer the choice from a neighboring file or rewrite unaffected imports solely to impose the preferred form.

When tooling safely erases type-only usage, prefer:

```ts
import { CandidatePayload } from '@/apis'
```

When verified tooling or runtime contracts require type-only imports, use a separate declaration:

```ts
import type { CandidatePayload } from '@/apis'
import { loadCandidates } from '@/apis'
```

Never use inline modifiers:

```ts
import { loadCandidates, type CandidatePayload } from '@/apis'
```

Import grouping is governed by [Import Order](import-order.md).

## Review Checklist

- Standard imports are preferred only when type-only usage is safely erased.
- Separate `import type` declarations are backed by verified tooling or runtime requirements.
- No inline `type` modifiers are used.
