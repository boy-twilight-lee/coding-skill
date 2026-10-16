# Naming and Nesting Examples

Use these scenarios to translate component ownership and DOM hierarchy into class names and Less/Sass nesting.

## Scenario 1: Name a Component Root, Elements, and States

Situation: a candidate card has a header, title, action, selected state, and disabled state.

Use a meaningful business root and complete single-hyphen BEM names:

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

Avoid generic roots, double-underscore/double-hyphen BEM, visual-only names, and arbitrary suffix chains:

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

The class should still describe the business role when color, position, or implementation changes.

## Scenario 2: Prevent Overlong Names and Apply Character Abbreviations

Situation: a human-resources recruitment feature contains a candidate-evaluation panel. Repeating every domain, page, component, element, and visual role would make each class progressively longer.

Apply this order:

1. Remove words already implied by the owning business root.
2. Remove visual or implementation-only suffixes that do not describe business meaning.
3. Keep the shortest complete name that remains unambiguous in the feature.
4. Only when the remaining name is still unavoidably long, abbreviate repeated business segments consistently.

Prefer a naturally concise full name when it identifies the owner without collision:

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

If the broader HR and recruitment context is required to distinguish this component, use recognizable character abbreviations from the repository or feature glossary:

| Business term | Illustrative abbreviation | Readability condition |
| --- | --- | --- |
| human resources | `hr` | The repository consistently uses HR terminology. |
| recruitment | `recruit` | The shortened word is already used across the feature. |
| candidate | `cand` | The feature glossary makes the meaning unambiguous. |
| evaluation | `eval` | The abbreviation is consistently used for evaluation. |

Complete abbreviated application:

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

The abbreviation is acceptable because every shortened segment has a stable meaning and remains readable in isolation. The same term must not alternate between full and shortened forms within the subtree.

Do not encode every ancestor, implementation detail, and visual role into one name:

```vue
<div class="human-resources-recruitment-candidate-evaluation-management-panel-container">
  <div class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper">
    <span class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper-title-text">
      候选人评估
    </span>
  </div>
</div>
```

Do not shorten the same structure into arbitrary single letters or an undecipherable concatenated acronym:

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

Do not mix abbreviations for the same business term:

```less
.hr-recruit-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

Abbreviations are a controlled fallback for unavoidable length, not permission to sacrifice meaning. When no shared abbreviation exists, establish one consistently within the feature instead of inventing a different shorthand in each selector.

## Scenario 3: Mirror the Nearest Meaningful Ownership in Nesting

Situation: the DOM contains a card, its header, and a title owned by that header.

```vue
<div class="talent-card">
  <div class="talent-card-header">
    <span class="talent-card-title">候选人</span>
  </div>
</div>
```

The header establishes layout ownership for the title, so retain it in Less:

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

Do not float a child at the stylesheet root:

```less
.talent-card-title {
}
```

Do not skip a meaningful owner merely to reduce nesting depth:

```less
.talent-card {
  .talent-card-title {
  }
}
```

The rule follows ownership rather than an arbitrary maximum nesting depth. An incidental wrapper that has no class and establishes no layout, state, or behavior does not create a required nesting level. If the DOM hierarchy is needlessly deep, simplify the component markup and ownership model instead of flattening only the stylesheet.

## Scenario 4: Decide Whether a Direct-Child Selector Is Necessary

Situation: a menu applies separators only to its own items, while nested submenus contain the same `.menu-item` class.

The direct-child boundary prevents the parent menu from styling nested submenu items:

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid var(--border-color);
  }
}
```

For an ordinary descendant with no collision risk, use normal nesting:

```less
.talent-card {
  .talent-card-title {
    color: var(--text-color-primary);
  }
}
```

Never start a nested selector with a bare combinator:

```less
.menu-list {
  > .menu-item {
  }
}
```

Do not add `& >` only because the current markup happens to be one level deep. Use it only when direct-child scope is a stable part of the component contract.

## Scenario 5: Consolidate Deep Library Selectors

Situation: several Arco Table descendants share an `.arco-table` ancestor.

Put `:deep` on the nearest useful shared library root, then nest all descendants, pseudo-classes, and pseudo-elements beneath their owners:

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

Do not use an empty deep wrapper:

```less
.result-table {
  &:deep() {
    .arco-table-th {
    }
  }
}
```

Do not repeat `:deep` for descendants that share the same library root:

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

Do not flatten or combine deep selectors outside the business root:

```less
.result-table:deep(.arco-table-cell),
.result-table:deep(.arco-table-th) {
}
```

Sibling deep blocks are valid when no suitable shared library-owned ancestor exists below the component root:

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

The decision is based on the library DOM tree, not on whether the selectors appear next to each other in the stylesheet.

## Scenario 6: Keep Pseudo-classes and Business States with Their Owner

Situation: a card has hover behavior and an active state that changes a child title.

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

Keep native pseudo-classes on the selector they modify. Represent application state with a complete business class, then place all state-dependent child changes inside that state block. Do not duplicate the state across separate root-level child selectors.

## Scenario 7: Name a Teleported Root

Situation: a filter panel renders a popper outside the component root.

Two top-level roots are valid because they belong to separate rendered trees:

```less
.talent-filter {
}

.talent-filter-popper {
  .talent-filter-popper-option {
  }
}
```

The teleported root must remain fully qualified. A generic `.popper`, `.option`, or `.dropdown-item` selector would leak into unrelated content.

## Review Checklist

- Every top-level component selector names a business root or justified teleported root.
- Project-owned classes use complete single-hyphen BEM names.
- Names describe meaning rather than color, position, or incidental markup.
- Overlong names are simplified before abbreviations are introduced.
- Unavoidable long names use consistent, recognizable character abbreviations rather than opaque letter strings.
- Every descendant is nested beneath its nearest meaningful layout, state, or behavior owner.
- Direct-child combinators express a stable boundary and use `& >`.
- Deep rules target a named selector and share the nearest useful library ancestor.
- Pseudo-classes and business-state child changes remain beneath their owners.
