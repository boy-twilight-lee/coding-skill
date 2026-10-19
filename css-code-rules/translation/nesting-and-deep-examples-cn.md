# 嵌套与深层选择器示例

> 本文件仅翻译 `css-code-rules/references/nesting-and-deep-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. Less/Sass 中子项嵌套在最近有效拥有者下；稳定直接子契约才用 `& >`，不得裸 `>`。
2. scoped 深层规则使用带目标的 `&:deep(...)`，共享库根时合并并继续嵌套后代、伪类和伪元素。
3. 伪类跟随拥有者，业务状态用完整类链到拥有者；无嵌套支持的 CSS 展开选择器但保留所有权路径。

## 场景 1：嵌套体现最近的有效所有权

子选择器嵌套在最近的布局、状态或行为拥有者下，不把组件子项漂到根级。

**场景配置：**

```vue
<div class="talent-card">
  <div class="talent-card-header">
    <span class="talent-card-title">候选人</span>
  </div>
</div>
```

**正例：**

```less
.talent-card {
  .talent-card-header {
    .talent-card-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
```

**反例：**

```less
.talent-card-title {
}
```

```less
.talent-card {
  .talent-card-title {
  }
}
```

## 场景 2：判断是否需要直接子选择器

只有直接子边界是稳定 DOM 契约且能防止误匹配时使用 `& >`，不得以裸 `>` 开头。

**正例：**

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid var(--border-color);
  }
}
```

```less
.talent-card {
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

**反例：**

```less
.menu-list {
  > .menu-item {
  }
}
```

## 场景 3：合并第三方库 deep 选择器

在最近的共享第三方根上使用带参数的 `&:deep(...)`，后代、伪类和伪元素继续嵌套。

**正例：**

```less
.result-table {
  &:deep(.arco-table) {
    .arco-table-container {
      width: 100%;
    }

    .arco-table-th {
      &:first-child {
        border-radius: 8px 0 0 8px;
      }

      &::before {
        display: none;
      }

      .arco-table-cell {
        min-height: 40px;
      }
    }
  }
}
```

```less
.profile-form {
  &:deep(.el-input__wrapper) {
    box-shadow: none;
  }

  &:deep(.el-select__wrapper) {
    min-height: 36px;
  }
}
```

**反例：**

```less
.result-table {
  &:deep() {
    .arco-table-th {
    }
  }
}
```

```less
.result-table {
  &:deep(.arco-table-container) {
  }

  &:deep(.arco-table-th) {
  }

  &:deep(.arco-table-cell) {
  }
}
```

```less
.result-table:deep(.arco-table-cell),
.result-table:deep(.arco-table-th) {
}
```

## 场景 4：伪类和业务状态跟随拥有者

原生伪类和业务状态链在其拥有者上，依赖状态的子项放进状态块。

**正例：**

```less
.talent-card {
  &:hover {
    border-color: var(--color-primary);
  }

  &.talent-card-active {
    .talent-card-title {
      color: var(--color-primary);
    }
  }
}
```

**反例：**

```less
.talent-card:hover {
  border-color: var(--color-primary);
}

.talent-card-active .talent-card-title {
  color: var(--color-primary);
}
```

## 场景 5：无嵌套支持时仍保留所有权路径

无嵌套支持时展开选择器，但仍保留业务根、拥有路径和 deep 参数内的完整库路径。

**正例：**

```css
.talent-card .talent-card-header .talent-card-title {
  color: var(--text-color-primary);
}
.talent-card:hover {
  border-color: var(--color-primary);
}
.talent-card.talent-card-active .talent-card-header .talent-card-title {
  color: var(--color-primary);
}
```

```css
.result-table :deep(.arco-table .arco-table-th:first-child) {
  border-radius: 8px 0 0 8px;
}
.result-table :deep(.arco-table .arco-table-th .arco-table-cell) {
  min-height: 40px;
}
```

**反例：**

```css
.talent-card-title {
  color: var(--text-color-primary);
}
.result-table :deep(.arco-table) .arco-table-th:first-child {
  border-radius: 8px 0 0 8px;
}
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
