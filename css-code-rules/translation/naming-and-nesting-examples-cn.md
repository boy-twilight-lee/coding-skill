# 命名与嵌套示例

> 本文件仅翻译 `css-code-rules/references/naming-and-nesting-examples.md`，代码示例与英文 reference 保持一致。

1. 每个组件有明确业务根类，所有私有选择器位于其下；Teleport 可有独立完整业务根。
2. 项目类名使用完整单连字符 BEM 风格，不用 `__`/`--`；名称表达业务而不是视觉。
3. 先删冗余所有权词和视觉词来缩短名称，确实过长才用一致可读的业务缩写。
4. Less/Sass 中子项嵌套在最近有效拥有者下；稳定直接子契约才用 `& >`，不得裸 `>`。
5. scoped 深层规则使用带目标的 `&:deep(...)`，共享库根时合并并继续嵌套后代、伪类和伪元素。
6. 伪类跟随拥有者，业务状态用完整类链到拥有者；无嵌套支持的 CSS 展开选择器但保留所有权路径。

## 场景 1：命名组件根、元素和状态

使用有业务含义的根类和完整单连字符 BEM 风格名称，状态跟随拥有者。

**正例：**

```less
.talent-card {
  .talent-card-header {
    .talent-card-title {
      color: var(--text-color-primary);
    }
  }

  .talent-card-action {
    cursor: pointer;
  }

  &.talent-card-selected {
    border-color: var(--color-primary);
  }

  &.talent-card-disabled {
    cursor: not-allowed;
    .talent-card-action {
      pointer-events: none;
    }
  }
}
```

```less
.candidate-table {
  .candidate-table-header {
    color: var(--text-color-danger);
  }
}
```

**反例：**

```less
.card {
}

.talent-card__header {
}

.talent-card--selected {
}

.table-box-header-red {
}
```

## 场景 2：避免过长名称并使用可读缩写

先删除冗余词和视觉词；仍过长时才使用仓库中一致、可理解的业务缩写，禁止晦涩字母串。

**正例：**

```vue
<div class="candidate-evaluation">
  <div class="candidate-evaluation-header">
    <span class="candidate-evaluation-title">候选人评估</span>
  </div>
</div>
```

```less
.candidate-evaluation {
  .candidate-evaluation-header {
    display: flex;
    .candidate-evaluation-title {
      color: var(--text-color-primary);
    }
  }
}
```

```vue
<div class="hr-recruit-cand-eval">
  <div class="hr-recruit-cand-eval-header">
    <span class="hr-recruit-cand-eval-title">候选人评估</span>
    <div class="hr-recruit-cand-eval-actions">
      <button class="hr-recruit-cand-eval-submit">提交</button>
    </div>
  </div>
</div>
```

```less
.hr-recruit-cand-eval {
  .hr-recruit-cand-eval-header {
    display: flex;
    .hr-recruit-cand-eval-title {
      color: var(--text-color-primary);
    }

    .hr-recruit-cand-eval-actions {
      display: flex;
      .hr-recruit-cand-eval-submit {
        cursor: pointer;
      }
    }
  }
}
```

**反例：**

```vue
<div class="human-resources-recruitment-candidate-evaluation-management-panel-container">
  <div class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper">
    <span class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper-title-text">
      候选人评估
    </span>
  </div>
</div>
```

```less
.h-r-c-e-m-p-c {
  .h-r-c-e-m-p-c-h-w {
  }
}

.hrcempc {
  .hrcempchw {
  }
}
```

```less
.hr-recruit-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

## 场景 3：嵌套体现最近的有效所有权

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

## 场景 4：判断是否需要直接子选择器

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

## 场景 5：合并第三方库 deep 选择器

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

## 场景 6：伪类和业务状态跟随拥有者

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

## 场景 7：命名 Teleport 根节点

Teleport 内容可有独立顶层根，但必须使用完整业务限定名，不能使用通用 `.popper` 等名称。

**正例：**

```less
.talent-filter {
}

.talent-filter-popper {
  .talent-filter-popper-option {
  }
}
```

**反例：**

```less
.popper {
  .option {
  }
}
```

## 场景 8：无嵌套支持时仍保留所有权路径

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
