# Template Examples

Owns Core Rule 1.

For DOM minimality, common tag selection, and prohibited uncommon or landmark elements, read Core Rule 2's [DOM Structure Examples](dom-structure-examples.md). For template-comment coverage, read Core Rule 8's [Vue Script Comment Examples](script-comment-examples.md).

For attribute and directive order on each opening tag, read Core Rule 3's [Template Attribute Order Examples](template-attribute-order-examples.md).

## Mandatory Rules

1. Keep the SFC blocks that are present in strict relative order: `<template>`, then `<script>`, then `<style>`. Omit an unused block; never add an empty block solely to complete the sequence.

2. Use kebab-case custom component tags and self-close components that have no slots or child content.

3. Keep each component root and its template hierarchy aligned with the business responsibility. Use named slots for intentional extension points.

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

## Review Checklist

- SFC blocks follow template, script, style order.
- Custom tags are kebab-case and empty components self-close.
- Slots represent intentional extension points.
