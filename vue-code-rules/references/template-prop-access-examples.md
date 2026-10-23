# Template Prop Access Examples

Owns Core Rule 12.

## Mandatory Rules

1. In `<template>`, access declared props directly by name in interpolations, directives, bindings, and event expressions. Unless a prop name conflicts with a variable defined in the script, prohibit `props.xxx` access.

2. When a script variable has the same name as a prop, use `props.xxx` in the template to select that prop explicitly. The exception applies only to that conflicting name; all other props still use bare names. Do not introduce a same-name variable merely to justify the prefix.

3. This rule applies to template expressions. Keep `const props = defineProps(...)` or its `withDefaults(...)` form as required by Core Rule 7, and continue using `props.xxx` in the script where needed. Direct template access does not require destructuring props or creating aliases, refs, or computed wrappers.

## Scenario 1: Use Bare Prop Names Without a Conflict

The script declares the `type` prop and no script variable named `type`.

**Positive example:**

```vue
<template>
  <map-editor :key="type" :type="type" />
</template>

<script setup>
const props = defineProps({ type: String })
</script>
```

**Negative example:**

With the same prop declaration and no name conflict, do not add the prefix to either binding:

```vue
<template>
  <map-editor :key="props.type" :type="props.type" />
</template>

<script setup>
const props = defineProps({ type: String })
</script>
```

The same rule applies to `{{ type }}`, `v-if="type"`, and other template expressions that read the prop.

## Scenario 2: Qualify Only the Prop That Conflicts

The parent supplies a geometry `type` and `title`, while the script's own `type` variable selects the editor mode. Only the `type` prop needs qualification.

**Positive example:**

```vue
<template>
  <map-editor :type="props.type" :mode="type" :title="title" />
</template>

<script setup>
const props = defineProps({ type: String, title: String })
const type = 'preview'
</script>
```

**Negative example — losing the distinction:**

With the same script, bare `type` resolves to the script variable and passes the editor mode where the geometry type is required:

```vue
<map-editor :type="type" :mode="type" :title="title" />
```

**Negative example — extending the exception to other props:**

With the same script, `title` has no name conflict, so qualifying it is prohibited:

```vue
<map-editor :type="props.type" :mode="type" :title="props.title" />
```

## Review Checklist

- Template expressions use bare prop names when no script variable has the same name.
- Each `props.xxx` in a template is justified by a script variable with that exact prop name.
- A conflict for one prop does not qualify unrelated props or change an intentional reference to the script variable.
- Script-side `props.xxx` access and compiler-macro receiver names remain valid; no extra destructuring or wrappers are needed for template access.
