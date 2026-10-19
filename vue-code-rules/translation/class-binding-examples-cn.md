# 类绑定示例

> 本文件仅翻译 `vue-code-rules/references/class-binding-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 多个类来源统一放一个 `:class` 数组；单一静态类或单一动态对象可用最简单形式。

## 场景 1：用一个数组绑定组合多个类来源

同一元素的多个类来源统一放入一个可读的 `:class` 数组，不拆成静态与动态属性，也不拼接长字符串。

**正例：**

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
// 提供候选人卡片当前密度对应的类名。
const densityClass = computed(() => `candidate-card-${props.density}`)
</script>
```

```ts
export interface CandidateCardProps {
  active: boolean
  density: 'compact' | 'normal'
  disabled: boolean
  name: string
}
```

```vue
<div :class="['candidate-card', { 'candidate-card-active': active }]" />
```

```vue
<div class="candidate-card" />

<div :class="{ 'candidate-card-active': active }" />
```

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

**反例：**

```vue
<div
  class="candidate-card candidate-card-compact"
  :class="{
    'candidate-card-active': active,
    'candidate-card-disabled': disabled
  }"
/>
```

```vue
<div
  :class="`candidate-card candidate-card-${density} ${active ? 'candidate-card-active' : ''} ${disabled ? 'candidate-card-disabled' : ''}`"
/>
```

```vue
<div :class="['candidate-card', densityClass, { 'candidate-card-active': active, 'candidate-card-disabled': disabled, 'candidate-card-loading': loading }]" />
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
