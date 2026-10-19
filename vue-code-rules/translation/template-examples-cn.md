# 模板示例

> 本文件仅翻译 `vue-code-rules/references/template-examples.md`，代码示例与英文 reference 保持一致。

1. 现有区块严格按 template、script、style 顺序，不使用的区块省略。
2. 重复 UI 使用结构化数据、`v-for` 和稳定唯一键。
3. 复杂业务转换和条件移入 computed 或函数。
4. 自定义组件标签使用 kebab-case，无子内容时自闭合。
5. 组件根和层级匹配业务职责；命名插槽只作明确扩展点。
6. 删除无独立布局、定位、动画、交互或分组职责的包装 DOM。
7. 普通布局用 div/span；交互、语义和无障碍确有含义时使用原生语义元素。
8. 多个类来源统一放一个 `:class` 数组；单一静态类或单一动态对象可用最简单形式。

## 场景 1：保持 SFC 区块顺序

现有 SFC 区块严格按 template、script、style 顺序排列；不用的区块直接省略。

**正例：**

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

**反例：**

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
  color: var(--text-color-primary);
}
</style>
```

## 场景 2：渲染可变列表

可变列表用结构化数据和稳定唯一业务键，身份会变化时不得使用数组索引。

**正例：**

```vue
<user-card
  v-for="user in users"
  :key="user.id"
  :user="user"
/>
```

**反例：**

```vue
<user-card v-for="(user, index) in users" :key="index" :user="user" />
```

## 场景 3：把业务逻辑移出模板

复杂条件和业务转换移入 computed 或函数，让模板保持声明式。

不要把同一个业务映射直接写进模板：

**正例：**

```vue
<template>
  <span class="order-card-status">{{ orderStatusText }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()
// 展示当前订单经过业务映射后的状态文案。
const orderStatusText = computed(() => getOrderStatusText(props.status))
</script>
```

**反例：**

```vue
<template>
  <span class="order-card-status">{{ getOrderStatusText(props.status) }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()
</script>
```

## 场景 4：使用自定义组件标签和插槽

自定义组件用 kebab-case，无内容时自闭合；命名插槽只用于明确扩展点。

**正例：**

```vue
<user-avatar :src="user.avatar" />
```

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

```vue
<user-card :name="user.name">
  <template #actions>
    <user-actions :user-id="user.id" />
  </template>
</user-card>
```

**反例：**

```vue
<UserAvatar :src="user.avatar"></UserAvatar>

<UserCard :name="user.name">
  <UserActions :user-id="user.id" />
</UserCard>
```

## 场景 5：删除无意义 DOM

能直接样式化目标元素时不增加包装；容器必须拥有独立布局、定位、动画、交互或分组职责。

**正例：**

```vue
<span class="user-card-name">{{ user.name }}</span>
```

**反例：**

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

## 场景 6：选择通用、交互或语义元素

普通布局用 div/span；交互使用原生交互元素，语义元素只在真实结构、SEO、数据或无障碍含义存在时使用。

**正例：**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" aria-hidden="true" />
</div>
```

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  查看详情
</button>
```

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

**反例：**

```vue
<div class="user-card-action" @click="openUserDetail">查看详情</div>
<h1 class="user-card-name">{{ user.name }}</h1>
```

## 场景 7：用一个数组绑定组合多个类来源

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
