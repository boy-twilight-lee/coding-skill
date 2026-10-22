# Template Attribute Order Examples

Owns Core Rule 3.

## Mandatory Rules

1. Apply this order to attributes on every native element, custom component, and template tag: directives, `v-bind` bindings, literal text attributes, plain boolean attributes, then events. This rule orders attributes within one opening tag; it does not reorder child elements, named slot declarations, or conditional sibling branches.

2. Give `v-if` and `v-show` equal highest priority among directives. Neither ranks above the other; if both exist on the same tag, keep them together in the leading group and preserve their relative order. On an alternative branch, keep `v-else-if` or `v-else` in that same leading group. Place other directives, including `v-for`, `v-model` and its argument/modifier forms, `v-slot`/`#`, and custom directives, after this group and before bindings. Preserve meaningful relative order among those other directives; no additional alphabetical order is required. Do not add directives or move a conditional onto another node merely to fill the sequence. Equal ordering priority does not make `v-if` and `v-show` interchangeable in rendering behavior.

3. Classify attributes by their actual syntax and contract. `:prop`, `v-bind:prop`, argument-less `v-bind`, and their modifiers belong to the binding group, including `:class`, `:style`, `:key`, `:ref`, and boolean-valued bindings such as `:disabled`. Literal text attributes such as `icon`, `class`, `style`, `type`, `placeholder`, and `ref` belong to the text group. Native boolean attributes such as bare `disabled`, `readonly`, and `required`, and verified bare Boolean component props, belong to the boolean group. `@event`, `v-on:event`, and argument-less `v-on` belong to the final event group, including event modifiers. A bound boolean must not be moved into the plain-boolean group or rewritten as a presence flag. Do not change values or rely on strings such as `disabled="false"` to represent false; native HTML boolean attributes are enabled by presence.

4. Keep each group contiguous without decorative blank lines. Preserve relative order within groups unless a concrete reason requires a change; text `icon` before `class` in the supplied example is valid, and `class` or `style` has no universal last-position exception. Continue applying Core Rule 4 when combining class sources: a combined `:class` stays in the binding group, while a lone static `class` stays in the text group.

5. Preserve order-sensitive `v-bind` spread overrides, expression behavior, and event-listener behavior. Keep the relative order of spread bindings and explicit bindings; do not blindly sort duplicate keys or move listeners across spreads when that would change behavior. If grouping would alter behavior, resolve the overlap within the authorized change or report the smallest necessary deviation. Preserve expressions, modifiers, values, and the adjacency of `v-if`/`v-else-if`/`v-else` siblings. Attribute ordering does not authorize unrelated script, DOM, slot, or style rewrites.

## Attribute Group Map

| Priority | Group | Examples |
| --- | --- | --- |
| 1 | Conditional and visibility directives | `v-if` and `v-show` at equal priority; `v-else-if` or `v-else` on its own branch |
| 2 | Other directives | `v-for`, `v-model`, `v-model:open`, `#extra`, `v-focus` |
| 3 | Bindings | `:options`, `:title`, `:style`, `:class`, `:disabled`, `v-bind="attrs"` |
| 4 | Literal text attributes | `icon="..."`, `class="..."`, `type="text"`, `placeholder="..."`, `ref="..."` |
| 5 | Plain boolean attributes | `required`, `readonly`, `disabled`; bare Boolean component props verified against their contract |
| 6 | Events | `@click`, `@change`, `@keydown.enter`, `v-on:blur`, `v-on="listeners"` |

## Scenario 1: Follow the Supplied Statistics Template

**Positive example:**

This excerpt retains the supplied business expressions and slot/child order. The card lists bindings before literal icon and class values; each select puts `v-if` before `v-model`, followed by bound options. Its state, components, and helpers are supplied by the owning component; no script or style changes are implied.

```vue
<template>
  <exam-detail-card
    :empty="!available"
    :loading="loading"
    :title="`${curTab === STATISTICS_TAB.single ? '单' : '全'}科概览`"
    :style="{
      height: valueToPx(available ? 516 : height)
    }"
    icon="icon-exam-detail-card-subject"
    class="subject-summary-statistics"
  >
    <template #extra>
      <a-select
        v-if="curTab === STATISTICS_TAB.single"
        v-model="statisticsContext.subjectId"
        :options="statisticsContext.subjects"
        :field-names="{
          label: 'subjectName',
          value: 'subjectId'
        }"
      >
        <template #prefix>
          <form-prefix text="学科" />
        </template>
      </a-select>
      <a-select
        v-if="available"
        v-model="classId"
        :options="classOptions"
        :field-names="{
          label: 'className',
          value: 'classId'
        }"
      >
        <template #prefix>
          <form-prefix text="统计范围" />
        </template>
      </a-select>
    </template>
    <template #empty>
      <statistics-empty :loading="loading" />
    </template>
    <statistics-summary />
    <div class="subject-summary-statistics-main">
      <satistics-chart />
      <satistics-rank />
    </div>
  </exam-detail-card>
</template>
```

This example preserves supplied class names to make ordering review straightforward. Naming and other concerns still follow their own rules; it does not create a class-naming exception.

**Negative example:**

Do not put text attributes before directives or put `v-if` after other directives and bindings:

```vue
<a-select
  class="subject-select"
  v-model="statisticsContext.subjectId"
  :options="statisticsContext.subjects"
  v-if="curTab === STATISTICS_TAB.single"
/>
```

## Scenario 2: Keep Plain Booleans Before Events

**Positive example:**

The conditional directive is first, other directives follow, and the final groups are bindings, literal text, the plain required flag, and events. `:disabled` remains a binding even though its result is boolean.

```vue
<input
  v-if="editable"
  v-model="keyword"
  :maxlength="keywordLimit"
  :disabled="loading"
  type="text"
  placeholder="请输入学科名称"
  required
  @input="handleKeywordInput"
  @blur="handleKeywordBlur"
/>
```

**Negative example:**

The same attributes are interleaved below: events are not last, text precedes directives, and `:disabled` is separated from the other binding.

```vue
<input
  @input="handleKeywordInput"
  type="text"
  v-model="keyword"
  :maxlength="keywordLimit"
  v-if="editable"
  required
  :disabled="loading"
  placeholder="请输入学科名称"
  @blur="handleKeywordBlur"
/>
```

## Scenario 3: Preserve Spread Override Order

The bound name intentionally overrides any name supplied by defaults. Keep both in that relative order inside the binding group. Here `v-show` occupies the same highest-priority group as `v-if`:

```vue
<user-card
  v-show="visible"
  v-bind="defaults"
  :name="userName"
  icon="icon-user"
  @select="handleSelect"
/>
```

Do not alphabetically move `:name` before `v-bind="defaults"`, because defaults could then override the explicit name. When a spread also contributes keys or listeners affected by grouping, inspect the actual overlap before moving attributes.

## Review Checklist

- Every opening tag follows directives, bindings, text attributes, plain booleans, then events.
- `v-if` and `v-show` have equal highest priority; alternative-branch directives share the leading group on their branch.
- `v-model`, slot shorthand, and other directives precede bindings.
- Bound booleans, class, and style stay in the binding group; static text class/style stay in the text group.
- Plain boolean flags precede all event forms, including modifiers and object listeners.
- Groups stay contiguous; no alphabetical sorting or decorative blank lines are imposed.
- Spread override semantics, values, expressions, modifiers, event behavior, and conditional-chain adjacency are preserved.
- Attribute ordering does not reorder template children or trigger unrelated script/style rewrites.
