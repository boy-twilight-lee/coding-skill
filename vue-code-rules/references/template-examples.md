# Template Examples

## Mandatory Rules

1. Keep the SFC blocks that are present in strict relative order: `<template>`, then `<script>`, then `<style>`. Omit an unused block; never add an empty block solely to complete the sequence.

2. Render repeated UI from structured data with `v-for`; use a stable, unique key and never use an array index when item identity can change.

3. Keep business transformations and non-trivial conditions out of the template. Name them in computed state or functions so the template remains a readable declaration of the UI.

4. Use kebab-case custom component tags and self-close components that have no slots or child content.

5. Keep each component root and its template hierarchy aligned with the business responsibility. Use named slots for intentional extension points; do not add wrapper elements only to satisfy an abstract convention.

6. Avoid meaningless DOM. Do not nest elements solely for styling or layout when the target element can be styled directly. Keep the DOM shallow and node count low. Add a container only when it has a clear, independent layout, positioning, animation, interaction, or grouping responsibility, and give it a name that expresses that purpose.

7. In non-interactive business layout, prefer `div` for block grouping and `span` for inline content. Use `i` only for decorative icon placeholders and mark it appropriately when accessibility tooling requires it. Use native interactive elements such as `button`, `a`, `input`, and `label` when their behavior or accessibility semantics apply. Use landmarks, headings, lists, tables, and other semantic elements only when they express real document structure, SEO meaning, data relationships, or accessibility—not merely for browser-default styling.

8. When an element has multiple class sources, combine them in one bound `:class` array. Put permanent class strings, reusable class values, and conditional class objects in that array, and expand it across lines when needed to prevent an unreadably long attribute. Do not split the same element's classes across `class` and `:class`, or construct a long concatenated class string. A single static class may remain in `class`, and a lone dynamic object or value does not need an array wrapper.

## Scenario 1: Keep SFC Blocks in Order

**Positive example:**

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

**Negative example:**

Do not reorder those same blocks:

```vue
<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>

<template>
  <div class="user-card">{{ props.name }}</div>
</template>

<style lang="less" scoped>
.user-card {
  color: var(--text-color-primary);
}
</style>
```

Omit a block when unused, but preserve the relative order of blocks that remain.

## Scenario 2: Render a Mutable List

**Positive example:**

Use structured data and a stable business identifier:

```vue
<user-card
  v-for="user in users"
  :key="user.id"
  :user="user"
/>
```

**Negative example:**

Do not copy repeated markup or use the array index when insertion, deletion, sorting, or replacement can change item identity:

```vue
<user-card v-for="(user, index) in users" :key="index" :user="user" />
```

An index key is acceptable only for a truly static, identity-free sequence whose order and length cannot change.

## Scenario 3: Move Business Logic out of the Template

**Positive example:**

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
// <zh: provide the business-mapped status text for the current order.>
const orderStatusText = computed(() => getOrderStatusText(props.status))
</script>
```

**Negative example:**

Do not perform that same business mapping directly in the template:

```vue
<template>
  <span class="order-card-status">{{ getOrderStatusText(props.status) }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()
</script>
```

Avoid nested conditions, transformations, or chained collection operations directly in interpolation or directives. A short property read or simple boolean condition may remain inline when it is immediately understandable.

## Scenario 4: Use Custom Component Tags and Slots

**Positive example:**

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

**Negative example:**

Do not render those same components with PascalCase tags, an unnecessary closing pair, or unnamed child content for the named extension point:

```vue
<UserAvatar :src="user.avatar"></UserAvatar>

<UserCard :name="user.name">
  <UserActions :user-id="user.id" />
</UserCard>
```

## Scenario 5: Remove Meaningless DOM

**Positive example:**

Prefer direct styling:

```vue
<span class="user-card-name">{{ user.name }}</span>
```

**Negative example:**

Avoid wrappers with no independent responsibility:

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

A wrapper is justified when it owns layout, positioning, animation, interaction, or a meaningful group. Its class name should express that responsibility.

## Scenario 6: Choose General-Purpose, Interactive, or Semantic Elements

**Positive example:**

For non-interactive business layout, use predictable general-purpose elements. A decorative icon placeholder may use `i` when it is hidden from assistive technology:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" aria-hidden="true" />
</div>
```

Use native interactive elements when their behavior applies; do not attach button behavior to a `div` merely to keep the DOM generic:

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  View details
</button>
```

Use semantic elements deliberately for real page structure, data relationships, SEO, or accessibility:

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

**Negative example:**

Do not replace that same detail button with a clickable `div` or use a heading solely for default styling:

```vue
<div class="user-card-action" @click="openUserDetail">View details</div>
<h1 class="user-card-name">{{ user.name }}</h1>
```

Use a business class and CSS for visual styling. Conversely, do not replace a real button, link, label, heading, list, or table with a generic element when that would discard useful semantics or keyboard behavior.

## Scenario 7: Compose Multiple Classes with One Array Binding

Situation: a candidate card always needs its business root class, receives a reusable density class, and conditionally applies active and disabled states.

**Positive example:**

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
// <zh: provide the class name for the current candidate-card density.>
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

Use the simplest form when only one class source exists:

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

For the three exact negative cases below, keep the same class sources in readable arrays:

```vue
<div
  :class="[
    'candidate-card',
    'candidate-card-compact',
    {
      'candidate-card-active': active,
      'candidate-card-disabled': disabled
    }
  ]"
/>
```

```vue
<div
  :class="[
    'candidate-card',
    `candidate-card-${density}`,
    {
      'candidate-card-active': active,
      'candidate-card-disabled': disabled
    }
  ]"
/>
```

```vue
<div
  :class="[
    'candidate-card',
    densityClass,
    {
      'candidate-card-active': active,
      'candidate-card-disabled': disabled,
      'candidate-card-loading': loading
    }
  ]"
/>
```

**Negative example:**

Do not split those same classes between a static attribute and a dynamic binding:

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

The array requirement begins when an element combines multiple sources. It is not a reason to wrap every single class binding mechanically.

## Review Checklist

- SFC blocks follow template, script, style order.
- Repeated mutable items use stable identity keys.
- Business transformations have named script declarations.
- Custom tags are kebab-case and empty components self-close.
- Slots represent intentional extension points.
- Every wrapper has an independent responsibility.
- Interactive and semantic elements match actual behavior, structure, SEO, data relationships, or accessibility.
- Elements with multiple class sources use one readable `:class` array.
- Static and dynamic classes are not split across separate attributes or concatenated into long strings.
