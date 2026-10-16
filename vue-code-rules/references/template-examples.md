# Template Examples

## Scenario 1: Keep SFC Blocks in Order

Correct:

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

Never place `<script>` before `<template>` or `<style>` before `<script>`. Omit a block when unused, but preserve the relative order of blocks that remain.

## Scenario 2: Render a Mutable List

Use structured data and a stable business identifier:

```vue
<user-card
  v-for="user in users"
  :key="user.id"
  :user="user"
/>
```

Do not copy repeated markup or use the array index when insertion, deletion, sorting, or replacement can change item identity:

```vue
<user-card v-for="(user, index) in users" :key="index" :user="user" />
```

An index key is acceptable only for a truly static, identity-free sequence whose order and length cannot change.

## Scenario 3: Move Business Logic out of the Template

Keep the template declarative:

The explicit Vue import in this example assumes the active Vite auto-import configuration does not cover `computed`. Omit the runtime import after verifying that it is covered; otherwise keep it explicit.

```vue
<template>
  <span class="order-card-status">{{ orderStatusText }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()
// 展示当前订单经过业务映射后的状态文案。
const orderStatusText = computed(() => getOrderStatusText(props.status))
</script>
```

Avoid nested conditions, transformations, or chained collection operations directly in interpolation or directives. A short property read or simple boolean condition may remain inline when it is immediately understandable.

## Scenario 4: Use Custom Component Tags and Slots

Use kebab-case and self-close a component with no children:

```vue
<user-avatar :src="user.avatar" />
```

Define a named extension point inside a child whose root still represents one business responsibility:

```vue
<template>
  <div class="user-card">
    <span class="user-card-name">{{ props.name }}</span>
    <div class="user-card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>
```

Use explicit opening and closing tags when the parent supplies slot content:

```vue
<user-card :name="user.name">
  <template #actions>
    <user-actions :user-id="user.id" />
  </template>
</user-card>
```

Named slots are appropriate when the child intentionally exposes an extension point while retaining ownership of its root hierarchy. Do not add a wrapper only to satisfy a structural convention, and do not add a slot merely to avoid designing a stable prop or child-component API.

## Scenario 5: Remove Meaningless DOM

Prefer direct styling:

```vue
<span class="user-card-name">{{ user.name }}</span>
```

Avoid wrappers with no independent responsibility:

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

A wrapper is justified when it owns layout, positioning, animation, interaction, or a meaningful group. Its class name should express that responsibility.

## Scenario 6: Choose General-Purpose or Semantic Elements

For ordinary business UI, use predictable general-purpose elements:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" />
</div>
```

Use semantic elements deliberately for page structure, SEO, or accessibility:

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

Do not use heading or emphasis tags solely to obtain browser-default visual styling; use a business class and CSS instead.

## Scenario 7: Compose Multiple Classes with One Array Binding

Situation: a candidate card always needs its business root class, receives a reusable density class, and conditionally applies active and disabled states.

Use one `:class` array containing every class source:

The explicit Vue import in this example assumes the active Vite auto-import configuration does not cover `computed`. Omit the runtime import after verifying that it is covered; otherwise keep it explicit.

```vue
<template>
  <div
    :class="[
      'candidate-card',
      densityClass,
      {
        'candidate-card-active': props.active,
        'candidate-card-disabled': props.disabled
      }
    ]"
  >
    <span class="candidate-card-name">{{ props.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CandidateCardProps } from './type'

const props = defineProps<CandidateCardProps>()
// 提供候选人卡片当前密度对应的类名。
const densityClass = computed(() => `candidate-card-${props.density}`)
</script>
```

Keep the non-trivial private prop contract in the component's sibling type module:

```ts
export interface CandidateCardProps {
  active: boolean
  density: 'compact' | 'normal'
  disabled: boolean
  name: string
}
```

The array keeps the permanent class, reusable class value, and conditional states in one readable source of truth. Vue flattens the entries and ignores inactive object keys.

For one permanent class plus one conditional state, use the same structure even when it fits on one line:

```vue
<div :class="['candidate-card', { 'candidate-card-active': active }]" />
```

Do not split classes between a static attribute and a dynamic binding:

```vue
<div
  class="candidate-card candidate-card-compact"
  :class="{
    'candidate-card-active': active,
    'candidate-card-disabled': disabled
  }"
/>
```

Do not construct a long interpolated or concatenated class string:

```vue
<div
  :class="`candidate-card candidate-card-${density} ${active ? 'candidate-card-active' : ''} ${disabled ? 'candidate-card-disabled' : ''}`"
/>
```

Do not place every class into one long array line when multiple sources make the attribute difficult to scan:

```vue
<div :class="['candidate-card', densityClass, { 'candidate-card-active': active, 'candidate-card-disabled': disabled, 'candidate-card-loading': loading }]" />
```

Use the simplest form when only one class source exists:

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

The array requirement begins when an element combines multiple sources. It is not a reason to wrap every single class binding mechanically.

## Review Checklist

- SFC blocks follow template, script, style order.
- Repeated mutable items use stable identity keys.
- Business transformations have named script declarations.
- Custom tags are kebab-case and empty components self-close.
- Slots represent intentional extension points.
- Every wrapper has an independent responsibility.
- Semantic tags are tied to structure, SEO, or accessibility.
- Elements with multiple class sources use one readable `:class` array.
- Static and dynamic classes are not split across separate attributes or concatenated into long strings.
