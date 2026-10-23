# Template Blank Lines

Owns Core Rule 5.

## Ownership and Required Routing

This reference owns blank lines only inside `<template>`, including nested slot templates. Before deciding whitespace elsewhere, fully read the appropriate canonical reference:

| Region | Canonical reference |
| --- | --- |
| Template interior | This reference |
| Any Vue script block, JavaScript or TypeScript | [TS Blank Lines](../../ts-code-rules/references/blank-lines.md) |
| TypeScript/TSX modules and top-level SFC block separators | [TS Blank Lines](../../ts-code-rules/references/blank-lines.md) |
| Vue style interiors and standalone stylesheets | [CSS Blank Lines](../../css-code-rules/references/blank-line-examples.md) |

Reusing TS whitespace guidance for JavaScript does not activate unrelated TypeScript rules. Do not infer script or stylesheet requirements from template examples.

## Mandatory Rules

1. Use at most one blank line only when it materially separates independent template regions. Do not add blank lines by tag type, nesting level, or repeated component count.
2. Keep tightly coupled nodes contiguous, including repeated items, adjacent label/value pairs, one component's slot declarations, and `v-if`/`v-else-if`/`v-else` chains.
3. Do not leave consecutive blank lines or blank lines immediately inside `<template>`, a nested slot template, or an element's opening/closing edges. Do not add template comments as region separators.
4. Preserve whitespace that participates in rendered text, inline-element spacing, or whitespace-sensitive content. A source-formatting cleanup must not change visible output.

## Scenario 1: Keep Coupled Nodes Together

**Positive example:**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

**Negative example:**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>

  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

## Scenario 2: Separate Independent Regions without Splitting Branches

**Positive example:**

The filters and result group have distinct responsibilities. The result branches remain adjacent:

```vue
<template>
  <question-filters v-model="filters" />

  <question-list v-if="questions.length" :questions="questions" />
  <question-empty v-else />
</template>
```

**Negative example:**

The blank lines pad template edges and split one conditional result group:

```vue
<template>

  <question-list v-if="questions.length" :questions="questions" />

  <question-empty v-else />

</template>
```

## Review Checklist

- Only template-interior blank lines are decided here; scripts, SFC separators, and styles use their canonical references.
- At most one blank line separates genuinely independent regions; coupled nodes, slots, and conditional branches remain contiguous.
- There are no consecutive or block-edge blank lines and no added template comments.
- Whitespace-sensitive text and rendered inline spacing remain unchanged.
