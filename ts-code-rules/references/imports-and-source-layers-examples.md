# Imports and Source Layers Examples

## Scenario 1: Export Public Directory APIs

Every direct child of `src`, except assets and pages, exposes public content through its barrel:

```text
src/apis/index.ts
src/components/index.ts
src/constants/index.ts
src/router/index.ts
src/store/index.ts
src/type/index.ts
src/utils/index.ts
```

Prefer the alias and barrel:

```ts
import { formatCandidateDate } from '@/utils'
```

Avoid deep imports into another directory's internals and paths that climb two or more parents:

```ts
import { formatCandidateDate } from '../../../utils/date'
```

A private module may use relative imports within its own ownership directory when that matches the repository convention.

## Scenario 2: Order Imports and Import Types Normally

In Vue code, first inspect the active Vite auto-import configuration. The following explicit `vue` import is correct only when `computed` and `ref` are not covered; APIs covered from `vue` or `vue-router` must be used without redundant explicit imports.

```ts
import { computed, ref } from 'vue'
import { CandidateFormProps } from './type'
import { Candidate, PageResult } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateFilter from './component/candidate-filter/index.vue'
```

The groups are third-party libraries, type-only dependencies, other internal imports, then component imports. Within the type group, component-local types precede shared types.

Do not use `import type` or inline type modifiers:

```ts
import type { Candidate } from '@/type'
import { type PageResult } from '@/type'
```

Use standard imports even when a symbol is consumed only as a type, preserving the grouping rule and established formatter behavior.

## Scenario 3: Place Declarations and Component-Private Types

Use `src/type` for ambient `.d.ts` declarations and types shared across pages. Keep complex private component types beside the owner:

```text
src/type/env.d.ts
src/type/global.d.ts
```

```text
candidate-editor/
|-- index.vue
`-- type/
    `-- index.ts
```

Define the non-trivial private contract in `candidate-editor/type/index.ts`:

```ts
export interface CandidateEditorProps {
  candidateId: string
  editableFields: Array<'name' | 'mobile' | 'email'>
  permissions: {
    canEdit: boolean
    canSubmit: boolean
  }
}
```

Consume it from the owning component with a standard import:

```ts
import { CandidateEditorProps } from './type'

const props = defineProps<CandidateEditorProps>()
```

Allow a concise inline prop literal when it is easier to read:

```ts
const props = defineProps<{
  candidateId: string
}>()
```

Move non-trivial unions, interfaces, nested response shapes, and reusable private contracts out of `<script setup lang="ts">` into the sibling type module.

Do not keep the complex interface in the SFC merely because it has only one current consumer; complexity and ownership justify the private type module independently of cross-page reuse.

## Scenario 4: Place Code in Its Source Layer

```text
src/apis/candidate.ts
src/utils/request.ts
src/utils/date.ts
src/constants/candidate.ts
src/store/candidate.ts
src/router/index.ts
```

- Endpoint declarations belong in `src/apis`.
- Request configuration, response normalization, and stateless helpers belong in `src/utils`.
- Application-wide immutable values belong in `src/constants`.
- Pinia state belongs in `src/store`.
- Routes and guards belong in `src/router`.

Do not hide endpoints inside components, put mutable state in constants, or place general response normalization in one API module when it applies to every request.

Incorrect component-owned endpoint and request logic:

```ts
// 定义候选人详情接口地址。
const CANDIDATE_DETAIL_URL = '/api/candidates/detail'
// 在组件内部请求候选人详情。
const loadCandidate = async (candidateId: string) => {
  return await fetch(`${CANDIDATE_DETAIL_URL}?id=${candidateId}`)
}
```

Correct API-layer ownership in `src/apis/candidate.ts`:

```ts
import { Candidate } from '@/type'
import { request } from '@/utils'

// 定义候选人详情接口路径。
const CANDIDATE_DETAIL_PATH = '/api/candidates/detail'

// 请求指定候选人的标准化详情。
export const getCandidate = async (candidateId: string): Promise<Candidate> => {
  return await request.get(CANDIDATE_DETAIL_PATH, { params: { candidateId } })
}
```

The component imports `getCandidate` from the `src/apis` barrel. Shared request configuration and response normalization remain in `src/utils`; the API module owns only the endpoint-specific contract.

## Scenario 5: Keep Private Constants and Types with Their Owner

Start page-private values beside the page:

```text
candidate-list/
|-- index.vue
|-- constants/
|   `-- index.ts
`-- type/
    `-- index.ts
```

Promote them to `src/constants` or `src/type` only after a clear cross-page consumer exists. The possibility of future reuse is not enough.

Keep repeated status values, option lists, enums, and business thresholds out of templates and scattered implementation branches by placing them in the smallest correct owner.

Private constant module:

```ts
// 定义候选人列表页可选择的状态筛选项。
export const CANDIDATE_STATUS_OPTIONS = [
  { label: '待沟通', value: 'pending' },
  { label: '已联系', value: 'contacted' }
]
```

Private type module:

```ts
export interface CandidateListFilters {
  keyword: string
  status: string
}
```

If a second page later needs the exact same status source of truth or filter contract, promote the shared declaration deliberately and update both consumers through the new public barrel. Do not duplicate it first or promote it based only on hypothetical reuse.

## Scenario 6: Decide Whether to Extract a Constant

Keep a clear one-off library configuration inline:

```ts
await message.confirm({ duration: 3000 })
```

Extract a value when it creates shared truth or important business meaning:

```ts
// 定义候选人锁定状态允许保持的最大天数。
const MAX_CANDIDATE_LOCK_DAYS = 30
```

Do not introduce a named constant only to replace one readable literal. Extraction is justified by reuse, shared maintenance, business meaning, or independent change—not by a mechanical preference for constants.

## Review Checklist

- Public directory APIs flow through required barrels and aliases.
- Vue and Vue Router APIs covered by active Vite auto-import configuration have no explicit imports.
- Imports follow the required four groups without `import type` syntax.
- Ambient, shared, and private types live with the correct owner.
- APIs, utilities, constants, stores, and routes stay in their source layers.
- Private constants and types are promoted only after real cross-page reuse.
- Constants express shared truth or business meaning rather than ceremony.
