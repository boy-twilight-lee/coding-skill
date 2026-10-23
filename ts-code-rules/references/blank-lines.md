# Logical Blank Lines

Owns Core Rule 7.

## Ownership

This reference owns blank lines in TypeScript/TSX files, all Vue script blocks including JavaScript, and separators between top-level SFC blocks. Reusing it for JavaScript activates whitespace guidance only, not unrelated TypeScript rules.

Template interiors follow [Vue Template Blank Lines](../../vue-code-rules/references/blank-line-examples.md); stylesheet interiors follow [CSS Blank Lines](../../css-code-rules/references/blank-line-examples.md). Do not generalize one language's whitespace rules to another.

## Mandatory Rules

1. Default to contiguous code. Allow at most one blank line only when it materially separates distinct logical regions. A declaration, function, comment, brace, import category, or line wrap does not automatically create a region. Do not insert a blank line before every function, return, or control statement.
2. Never leave consecutive, file-leading, file-trailing, or block-edge blank lines. This includes functions, callbacks, conditions, loops, classes, try/catch/finally, literals, contracts, and JSX containers. Keep ordinary line breaks and indentation; one normal final newline is not a trailing blank line.
3. Keep comments attached to their targets. A real region separator goes before the comment, never between it and its declaration or statement. This applies to line comments, block comments, and required JSDoc. Follow [Business Comments](business-comments.md) for coverage.
4. Keep tightly coupled imports/exports, state and derived values, related handlers, guards and dependent work, conversions and consumers, members, arguments, and chain steps contiguous. A member's type, optionality, or multiline shape does not create a blank-line boundary. This applies equally to objects, arrays, destructuring, return objects, interfaces, type literals, enums, unions, tuples, macro contracts, and JSX children.
5. A single separator may distinguish imports from runtime logic, genuinely different responsibilities, or a hook's implementation from its returned public surface. These boundaries are allowed, not mandatory. Preserve Vue macro order and comment exceptions; do not mechanically separate every macro, registration, or declaration.
6. Between present top-level SFC blocks, allow at most one blank line; do not pad script-block interiors or add empty blocks. Vue owns block order and template interiors; CSS owns style interiors.
7. Limit whitespace corrections to directly affected regions. Preserve statement order, expressions, comments, public contracts, and meaningful whitespace in literal data or rendered JSX text. Do not change line breaks significant to automatic semicolon insertion or rewrite unrelated formatting.

## Example Context

These focused excerpts reuse the questionnaire settings and hook patterns from `home-list/component`. Owner-provided bindings and verified Vue imports/auto-imports are assumed. Examples omit nonessential comments and retain existing language rules. Positive/negative pairs differ only in blank lines; the final example separately demonstrates meaningful literal data.

## Scenario 1: Real Logical Boundaries, Not Padding per Declaration

One blank line separates imports from implementation and the hook's implementation from its returned surface. Related state and handlers remain contiguous; ordinary dependent returns do not automatically need a separator.

**Positive example:**

```ts
import { ref } from 'vue'

const useSetting = () => {
  const visible = ref(false)
  const loading = ref(false)
  const open = () => {
    visible.value = true
  }

  return { visible, loading, open }
}
```

**Negative example:**

```ts
import { ref } from 'vue'

const useSetting = () => {
  const visible = ref(false)

  const loading = ref(false)

  const open = () => {
    visible.value = true
  }

  return { visible, loading, open }
}
```

## Scenario 2: One Contract or List Stays Contiguous

Use hook destructuring as the representative case. Apply the same rule to object/array members, returned fields, type and macro members, import/export lists, call arguments, chain steps, and coupled JSX nodes rather than maintaining a separate example for each syntax.

**Positive example:**

```ts
const {
  params,
  visible,
  dateValue,
  tips,
  open,
  handleDateChange
} = useSetting()
```

**Negative example:**

```ts
const {
  params,
  visible,
  dateValue,

  tips,

  open,
  handleDateChange
} = useSetting()
```

## Scenario 3: Comments Stay Attached

Place a justified separator before the comment. Block comments and required JSDoc follow the same adjacency rule as this line-comment example.

**Positive example:**

```ts
const visible = ref(false)

// 当前问卷设置的保存前快照，用于识别未修改内容。
let oldParams = {}
```

**Negative example:**

```ts
const visible = ref(false)

// 当前问卷设置的保存前快照，用于识别未修改内容。

let oldParams = {}
```

## Scenario 4: Block Edges and One Continuous Flow

The save flow represents functions, callbacks, conditions, loops, class methods, and try/catch/finally: no edge padding or decorative gaps between dependent statements. Keep the mandatory current-function catch around await.

**Positive example:**

```ts
const handleSave = async () => {
  loading.value = true
  try {
    handleTimeRangeConfig()
    await saveSetting(params.value)
  } catch (error) {
    Message.error(error.message)
  } finally {
    loading.value = false
    visible.value = false
  }
}
```

**Negative example:**

```ts
const handleSave = async () => {

  loading.value = true

  try {

    handleTimeRangeConfig()

    await saveSetting(params.value)

  } catch (error) {

    Message.error(error.message)

  } finally {

    loading.value = false

    visible.value = false

  }

}
```

## Scenario 5: File Edges and Consecutive Empty Lines

The following are whole-file excerpts. Keep a normal final newline without adding an empty line after the last statement.

**Positive example:**

```ts
const minimum = 1
const maximum = 100
```

**Negative example:**

```ts

const minimum = 1


const maximum = 100

```

## Scenario 6: SFC Separators and Script Edges

This rule owns the boundary between blocks and the script interior. Template and style interiors still use their canonical references; do not add an empty style block.

**Positive example:**

```vue
<template>
  <div>{{ title }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string }>()
</script>
```

**Negative example:**

```vue
<template>
  <div>{{ title }}</div>
</template>


<script setup lang="ts">

const props = defineProps<{ title: string }>()

</script>
```

## Scenario 7: Literal Whitespace Is Data

Preserve this paragraph break inside the value. The same principle applies to whitespace-sensitive JSX text; it is not removable code padding.

```ts
const collectionNotice = `本问卷每日限填一次。

请确认内容后再提交。`
```

## Formatter and Review Checklist

Prettier can preserve existing single blank lines; formatter success alone does not prove that a logical boundary exists. Review the final affected regions rather than configuring universal padding before each declaration, function, comment, or return.

- Every retained blank line has a real logical purpose; tightly coupled content stays contiguous.
- Comments touch their targets; files, code blocks, and scripts have no edge padding or consecutive empty lines.
- Distinct groups and top-level SFC blocks have at most one separator; template/style interiors use their canonical rules.
- Literal data, rendered whitespace, statement semantics, Vue macro order, await capture, public contracts, and pre-existing user edits remain intact.
