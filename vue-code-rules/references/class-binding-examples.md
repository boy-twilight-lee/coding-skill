# Class Binding Examples

Owns Core Rule 4.

## Mandatory Rules

1. When an element has multiple class sources, combine them in one bound `:class` array. Put permanent class strings, reusable class values, and conditional class objects in that array, and expand it across lines when needed to prevent an unreadably long attribute. Do not split the same element's classes across `class` and `:class`, or construct a long concatenated class string. A single static class may remain in `class`, and a lone dynamic object or value does not need an array wrapper.

## Scenario 1: Compose Multiple Classes with One Array Binding

**Positive example:**

Combine the permanent root, reusable density value, and conditional states. The owner supplies these bindings; their script and prop-type declarations are unrelated to class composition.

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

The density entry may instead be a fixed string or an interpolated value such as `candidate-card-${density}`. Vue flattens the array and ignores inactive conditional keys. Even a root plus one condition uses an array:

```vue
<div :class="['candidate-card', { 'candidate-card-active': active }]" />
```

A single class source needs no array wrapper:

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

**Negative examples:**

Do not split the same element's sources across attributes:

```vue
<div
  class="candidate-card candidate-card-compact"
  :class="{
    'candidate-card-active': active,
    'candidate-card-disabled': disabled
  }"
/>
```

Do not concatenate them into a long string:

```vue
<div
  :class="`candidate-card candidate-card-${density} ${active ? 'candidate-card-active' : ''} ${disabled ? 'candidate-card-disabled' : ''}`"
/>
```

An array must also stay readable; expand a long attribute instead of keeping every source on one line:

```vue
<div :class="['candidate-card', densityClass, { 'candidate-card-active': active, 'candidate-card-disabled': disabled, 'candidate-card-loading': loading }]" />
```

## Review Checklist

- Elements with multiple class sources use one readable `:class` array.
- Static and dynamic classes are not split across separate attributes or concatenated into long strings.
