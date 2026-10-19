# Blank Line Examples

## Mandatory Rules

1. Do not leave meaningless blank lines anywhere in a Vue file, including its template, script, and style blocks. A blank line is allowed only when one line materially separates distinct logical regions; never use consecutive blank lines, leading or trailing blank lines inside an SFC block, blank lines immediately inside an opening or closing code block, blank lines between a required comment and its declaration, or blank lines between tightly coupled statements or markup nodes.

2. Keep at most one intentional blank line between top-level SFC blocks or genuinely separate logical groups. Remove any blank line that does not make the component structure easier to understand.

## Scenario 1: Separate SFC Blocks

Use at most one blank line between top-level blocks:

```vue
<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<style lang="less" scoped>
.user-card {
  color: var(--text-color-primary);
}
</style>
```

Do not leave a blank line immediately inside a block or use consecutive blank lines:

```vue
<template>

  <div class="user-card" />

</template>


<script setup lang="ts">
</script>
```

## Scenario 2: Group Script Logic

One blank line may separate distinct responsibilities:

The explicit Vue imports in this example assume the active Vite auto-import configuration does not cover these APIs. Omit covered runtime imports after verifying the configuration; keep uncovered APIs imported normally.

```ts
import { computed, ref } from 'vue'

// 保存当前选中的用户标识。
const selectedUserId = ref('')
// 展示当前是否已经选择用户。
const hasSelectedUser = computed(() => Boolean(selectedUserId.value))

// 清除当前用户选择。
const clearSelectedUser = () => {
  selectedUserId.value = ''
}
```

Do not separate a required comment from its declaration, split tightly coupled declarations, or place blank lines immediately inside a function.

## Scenario 3: Group Template Nodes

Keep tightly coupled nodes together:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

A single blank line may separate genuinely independent template regions, but repeated list items, adjacent label/value pairs, and one component's slot declarations should remain contiguous.

## Scenario 4: Keep Style Structure Intentional

Keep declarations with their related nested selector and use one blank line only between distinct nested groups:

```less
.user-card {
  display: flex;
  .user-card-name {
    color: var(--text-color-primary);
  }

  &.user-card-disabled {
    cursor: not-allowed;
  }
}
```

The CSS-specific rules still govern style-block nesting and declaration order.

## Review Checklist

- No SFC block begins or ends with a blank line.
- No consecutive blank lines remain.
- Required comments touch their declarations.
- Tightly coupled statements and markup remain together.
- Every retained blank line communicates a real logical boundary.
