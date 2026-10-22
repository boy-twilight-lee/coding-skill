# Template Examples

## Mandatory Rules

1. Keep the SFC blocks that are present in strict relative order: `<template>`, then `<script>`, then `<style>`. Omit an unused block; never add an empty block solely to complete the sequence.

2. Use kebab-case custom component tags and self-close components that have no slots or child content.

3. Keep each component root and its template hierarchy aligned with the business responsibility. Use named slots for intentional extension points; do not add wrapper elements only to satisfy an abstract convention.

4. Implement the required functionality with as few DOM nodes and nesting levels as possible. Do not add unnecessary nodes or meaningless wrappers. Reuse existing elements for behavior and styling directly; add a wrapper only when the required behavior or layout cannot otherwise be achieved, and keep its structure minimal.

5. In non-interactive business layout, prefer `div` for block grouping and `span` for inline content. Use `i` only for decorative icon placeholders and mark it appropriately when accessibility tooling requires it. Use native interactive elements such as `button`, `a`, `input`, and `label` when their behavior or accessibility semantics apply. Use landmarks, headings, lists, tables, and other semantic elements only when they express real document structure, SEO meaning, data relationships, or accessibility—not merely for browser-default styling.

6. Apply the template-comment coverage in [Vue Script Comment Examples](script-comment-examples.md): document major business regions in multi-region templates and significant rendering or interaction rules with concise Chinese HTML comments. Do not label every element, duplicate visible text, or split conditional sibling chains with annotations. Read that reference when deciding template comment coverage.

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
  color: #303133;
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
  color: #303133;
}
</style>
```

Omit a block when unused, but preserve the relative order of blocks that remain.

## Scenario 2: Use Custom Component Tags and Slots

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

## Scenario 3: Use the Minimum Necessary DOM

**Positive example:**

Use the existing target element directly when it can implement the required behavior and styling:

```vue
<span class="user-card-name">{{ user.name }}</span>
```

**Negative example:**

Do not introduce extra nodes or nesting when they are unnecessary for the required functionality:

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

A wrapper is allowed only when the required behavior or layout cannot be implemented directly with existing elements. Give each necessary wrapper a clear purpose and keep the number of nodes and nesting levels to the minimum needed.

## Scenario 4: Choose General-Purpose, Interactive, or Semantic Elements

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

## Review Checklist

- SFC blocks follow template, script, style order.
- Custom tags are kebab-case and empty components self-close.
- Slots represent intentional extension points.
- The required functionality uses the minimum necessary DOM nodes and nesting; no unnecessary wrapper is present.
- Interactive and semantic elements match actual behavior, structure, SEO, data relationships, or accessibility.
- Multi-region templates have useful business-region and rendering-rule comments, following the comment reference without per-node narration or broken conditional chains.
