# Scope 与文件组织示例

> 本文件仅翻译 `css-code-rules/references/scope-and-file-organization-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 保留项目现有样式语言；用户 Vue 项目中新组件默认 Less，除非仓库明确采用其他方案。
2. 普通 Vue 组件样式使用 scoped；Less 写作 `<style lang="less" scoped>`。只有真正全局或组件根外渲染的内容使用非 scoped。
3. 提取样式与组件入口相邻；内联样式格式化后达到 200 行时整体移入同级文件，不按视觉区域拆分。
4. 一个组件的样式保持在一个样式表，只有 scope 本身要求隔离时才分文件。
5. 全局重置、令牌、库全局覆盖和工具放既有 `src/styles`；组件专属库覆盖留在业务根下。

## 场景 1：保留现有样式语言

保留仓库已验证的 CSS/Less/Sass/SCSS 或 CSS Modules 方案，不为统一偏好迁移现有文件。

**正例：**

```vue
<style lang="scss" scoped>
@use './index.scss';
</style>
```

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

**反例：**

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

## 场景 2：选择 scoped 或非 scoped Vue 样式

普通组件 DOM 使用 scoped；Teleport 或真正全局内容使用防冲突的完整业务根类。

**正例：**

```vue
<template>
  <div class="talent-select">
    <span class="talent-select-title">选择候选人</span>
  </div>
</template>

<style lang="less" scoped>
.talent-select {
  .talent-select-title {
    color: var(--text-color-primary);
  }
}
</style>
```

```vue
<style lang="less">
.talent-select-popper {
  .talent-select-popper-option {
    color: var(--text-color-primary);
  }
}
</style>
```

**反例：**

```vue
<style lang="less">
.talent-select {
}
</style>
```

## 场景 3：提取不断增长的组件样式

组件样式达到阈值时整体提取到相邻样式文件；只有 scope 确实不同才拆成多个文件。

**正例：**

```text
talent-card/
|-- index.vue
`-- index.less
```

```vue
<style lang="less" scoped>
@import './index.less';
</style>
```

```text
talent-select/
|-- index.vue
`-- style/
    |-- scoped.less
    `-- global.less
```

**反例：**

```text
talent-card/
|-- header.less
|-- content.less
|-- actions.less
`-- states.less
```

## 场景 4：放置全局规则和组件私有规则

重置、令牌和全局工具放全局样式区；一次性组件库覆盖留在业务组件根下。

**正例：**

```text
src/styles/reset.less
src/styles/theme.less
src/styles/utilities.less
src/components/talent-form/index.less
```

```less
.talent-form {
  &:deep(.el-input__wrapper) {
    border-radius: var(--radius-medium);
  }
}
```

**反例：**

```less
/* src/styles/element-plus.less */
.el-input__wrapper {
  border-radius: var(--radius-medium);
}
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
