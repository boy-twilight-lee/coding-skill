# 命名示例

> 本文件仅翻译 `css-code-rules/references/naming-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 每个组件有明确业务根类，所有私有选择器位于其下；Teleport 可有独立完整业务根。
2. 项目类名使用完整单连字符 BEM 风格，不用 `__`/`--`；名称表达业务而不是视觉。
3. 先删冗余所有权词和视觉词来缩短名称，确实过长才用一致可读的业务缩写。

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

## 场景 3：命名 Teleport 根节点

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

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
