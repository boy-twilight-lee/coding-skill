# Vue 空行示例

> 本文件仅翻译 `vue-code-rules/references/blank-line-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

本节负责 SFC 顶层区块、template 和 JavaScript Vue 脚本的空行。TypeScript 脚本的声明与语句间距以 `ts-code-rules` 为准，style 区块的选择器与声明间距以 `css-code-rules` 为准。

1. 顶层 SFC 区块或真正独立的逻辑区域之间最多一个空行；禁止连续空行和区块内部首尾空行。
2. template 中紧密节点保持连续，只在独立 UI 区域之间保留一个空行。
3. JavaScript 脚本中不在代码块边缘、注释与它所说明的声明或语句之间，以及紧密语句之间插入空行。
4. style 区块直接应用 CSS skill，不从 template 或 script 示例推断样式空行规则。

## 场景 1：分隔 SFC 区块

顶层 SFC 区块之间最多一个空行，区块内部开头和结尾不留空行；不要为了补齐顺序添加空区块。

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
<template>

  <div class="user-card">{{ props.name }}</div>

</template>


<script setup lang="ts">

const props = defineProps<{ name: string }>()

</script>
```

## 场景 2：组织模板节点

模板空行只区分真实 UI 区域，不能把紧密节点或同一列表项拆散。

**正例：**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

**反例：**

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>

  <span class="user-card-role">{{ user.roleName }}</span>
</div>
```

## 场景 3：组织 JavaScript 脚本逻辑

JavaScript 脚本中，空行只分隔不同职责；存在必要注释时，必须紧贴它所说明的内容：

TypeScript 脚本改用 TS skill 的对应规则，不把此 JavaScript 示例叠加为另一套要求。

**正例：**

```js
const selectedUserId = ref('')
const hasSelectedUser = computed(() => Boolean(selectedUserId.value))

const clearSelectedUser = () => {
  selectedUserId.value = ''
}
```

**反例：**

```js
// 保留服务端选择，使取消操作可以恢复原值。

const selectedUserId = ref('')

const clearSelectedUser = () => {

  selectedUserId.value = ''

}
```

## 复核清单

确认 SFC 区块内外没有装饰性空行，template 只在独立 UI 区域间分组，必要的 JavaScript 注释紧贴所说明内容，并由 TS/CSS skill 分别检查 TypeScript 与样式空行。
