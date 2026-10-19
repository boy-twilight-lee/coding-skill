# Class Binding Examples

## Mandatory Rules

1. When an element has multiple class sources, combine them in one bound `:class` array. Put permanent class strings, reusable class values, and conditional class objects in that array, and expand it across lines when needed to prevent an unreadably long attribute. Do not split the same element's classes across `class` and `:class`, or construct a long concatenated class string. A single static class may remain in `class`, and a lone dynamic object or value does not need an array wrapper.

## Scenario 1: Compose Multiple Classes with One Array Binding

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

- Elements with multiple class sources use one readable `:class` array.
- Static and dynamic classes are not split across separate attributes or concatenated into long strings.
