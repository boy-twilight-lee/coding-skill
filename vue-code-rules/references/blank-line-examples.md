# Vue Blank Line Examples

## Ownership

This reference owns whitespace between SFC blocks, inside templates, and inside JavaScript Vue scripts. For TypeScript script blocks, `ts-code-rules` is the canonical source for statement and declaration spacing. For style blocks, `css-code-rules` is the canonical source for selector and declaration spacing.

## Mandatory Rules

1. Keep at most one blank line between top-level SFC blocks or genuinely separate logical regions. Never use consecutive blank lines or leave a blank line at the beginning or end of an SFC block.

2. In templates, keep tightly coupled nodes together. Use one blank line only when it materially separates independent UI regions; do not separate repeated items, adjacent label/value pairs, or one component's slot declarations.

3. In JavaScript Vue scripts, do not place blank lines immediately inside a code block, between a comment and the declaration or statement it documents, or between tightly coupled statements. TypeScript scripts apply the equivalent rule from `ts-code-rules` instead of duplicating it here.

4. Style blocks apply `css-code-rules` directly. Do not infer style whitespace from template or script examples.

## Scenario 1: Separate SFC Blocks

**Positive example:**

Use at most one blank line between blocks and none at their inner edges:

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

Do not add empty blocks merely to complete the sequence; block presence and order are governed by the template rules.

**Negative example:**

Do not add multiple blank lines between those same SFC blocks or blank lines at their inner edges:

```vue
<template>

  <div class="user-card">{{ props.name }}</div>

</template>


<script setup lang="ts">

const props = defineProps<{ name: string }>()

</script>
```

## Scenario 2: Group Template Nodes

**Positive example:**

Keep one component's tightly coupled content contiguous:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

A single blank line may separate genuinely independent template regions. It must not be used as decoration or as a substitute for a meaningful component boundary.

**Negative example:**

Do not split the same label/value group with decorative blank lines:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>

  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

## Scenario 3: Group JavaScript Script Logic

**Positive example:**

One blank line may separate different responsibilities. When a comment is justified, keep it attached to what it documents:

```js
const selectedUserId = ref('')
const hasSelectedUser = computed(() => Boolean(selectedUserId.value))

const clearSelectedUser = () => {
  selectedUserId.value = ''
}
```

For a TypeScript script, use the corresponding `ts-code-rules` blank-line rule rather than treating this JavaScript example as an additional requirement.

**Negative example:**

Do not detach those same comments or add blank lines at function edges:

```js
// <zh: preserve the server selection so cancellation can restore it.>

const selectedUserId = ref('')

const clearSelectedUser = () => {

  selectedUserId.value = ''

}
```

## Review Checklist

- SFC blocks have at most one blank line between them and no leading or trailing inner blank lines.
- Template blank lines separate independent UI regions rather than tightly coupled nodes.
- Justified JavaScript comments touch what they document, and logical groups use at most one blank line.
- TypeScript-script and style-block whitespace are reviewed by their canonical language skills.
