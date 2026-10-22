# Logical Blank Lines

Owns Core Rule 4.

## Mandatory Rule

Do not leave meaningless blank lines in TypeScript or TSX. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, file-leading or file-trailing blank lines, blank lines immediately inside an opening or closing code block, blank lines between a comment and the declaration or statement it documents, or blank lines between tightly coupled imports, declarations, statements, object members, JSX nodes, or type members. Keep at most one intentional blank line between genuinely separate logical groups and remove every blank line that does not improve structural readability.

## Scenario 1: Use Blank Lines for Logical Regions

**Positive example:**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

// 当前列表查询条件及其是否生效的派生状态，供筛选区使用。
const filters = ref(createDefaultFilters())
const hasActiveFilters = computed(() => hasFilters(filters.value))

const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

When a comment is justified, keep it attached to the declaration or statement it documents. Do not place blank lines inside the opening or closing edge of a function or between tightly coupled object members, type members, statements, or JSX nodes. Never use consecutive, leading, or trailing blank lines.

**Negative example:**

Do not separate the same comments from their declarations or split tightly coupled statements:

```ts
// 保留服务端默认值，使重置操作恢复原始查询约定。

const filters = ref(createDefaultFilters())

const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

## Review Checklist

- Every blank line marks a real logical boundary.
- There are no consecutive, leading, trailing, block-edge, comment-separating, or tightly-coupled blank lines.
