# Naming and Nesting Examples

## Mandatory Rules

1. Give every component a meaningful business root class and keep all of its owned selectors beneath that root. Teleported content may use a separate fully qualified business root because it is rendered outside the component tree.

2. Follow the project's single-hyphen BEM-like convention: write complete names in the form `block-element-modifier`, using one hyphen as the separator and never `__` or `--` in project-owned class names. Because the same delimiter also appears inside multiword business terms, choose the shortest unambiguous complete name and rely on the owning selector hierarchy—not punctuation alone—to communicate the relationship. Library-owned selectors retain their library naming.

3. Describe a component, element, state, or business meaning in every class. Avoid ambiguous names and arbitrary suffix chains.

4. Prohibit overly long class names. First remove redundant ownership words, duplicated business terms, visual descriptions, and unnecessary suffixes while retaining enough meaning to identify the component, element, or state. Do not preserve a verbose name merely because it mirrors every DOM ancestor.

5. When a class name cannot be kept reasonably short after removing redundant wording, shorten repeated business segments with consistent, comprehensible character abbreviations. Prefer abbreviations already established by the repository or feature glossary, and use the same abbreviation for the same term throughout the ownership subtree. Never create ambiguous, opaque, concatenated, or arbitrary letter sequences merely to reduce character count.

6. In Less/Sass, nest every child or descendant selector beneath its nearest meaningful owning selector, following component ownership and the stable DOM relationship. An owning selector is the nearest ancestor class that establishes layout, state, or behavior for that child; an incidental wrapper with no such responsibility does not create a required nesting level. Never leave component children as standalone root-level rules or flatten them merely to reduce nesting depth. Only true stylesheet roots, global rules, and separately rendered teleported roots may be top-level. Keep complete class names when nesting rather than generating opaque names through string concatenation. Use `& >` only when styling must be limited to direct children to prevent unintended descendant matches and that boundary is a stable part of the DOM contract. Otherwise use ordinary nested descendant selectors. Never begin a nested selector with a bare `>`.

7. In Vue scoped styles using Less/Sass or verified CSS nesting support through the build pipeline or target browsers, every deep selector must name its target directly through `&:deep(...)`; never call `:deep` without a selector argument. When multiple deep rules belong to the same library-owned subtree, put `&:deep(...)` on the nearest suitable shared parent and nest its descendants beneath it. Do not repeat `:deep` on those descendants. This applies equally to descendant and combinator selectors, pseudo-classes, and pseudo-elements: nest each one under the selector it belongs to inside the shared deep block. Multiple sibling `&:deep(...)` blocks are allowed only when the targets have no suitable shared library-owned parent below the component root, so their only common parent is the component root itself. Under these nesting-capable conditions, do not flatten the business root plus `:deep()` or scatter comma-separated deep rules. In plain CSS without verified nesting support, use equivalent expanded selectors such as `.business-root :deep(.library-parent .library-child)`, keeping every library-owned descendant inside the deep argument. Preserve the business root and library ownership path in each selector; this compatibility exception does not permit unscoped child rules.

8. When nesting is supported, nest pseudo-classes under their owning selector. Express business states as an explicit complete class chained to that owner; keep child changes inside the state block. In plain CSS without verified nesting support, expand pseudo-class and state selectors while preserving the same ownership and matching behavior.

Use these scenarios to translate component ownership and DOM hierarchy into class names and Less/Sass nesting.

The mandatory nesting forms below apply to Less/Sass or plain CSS with verified nesting support from the build pipeline or target browsers. For plain CSS without that support, use the equivalent expanded ownership selectors shown in Scenario 8. Do not migrate the stylesheet language solely to satisfy nesting syntax.

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

## Scenario 8: Preserve Ownership in Plain CSS without Nesting Support

When neither the build pipeline nor the target browsers provide the required nesting support, keep plain CSS and expand the selectors. Pseudo-classes and business states retain their owning root:

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

In a Vue scoped CSS block, keep the library-owned path inside `:deep(...)` so descendant selectors are not accidentally scoped to the parent component:

```css
.result-table :deep(.arco-table .arco-table-th:first-child) {
  border-radius: 8px 0 0 8px;
}
.result-table :deep(.arco-table .arco-table-th .arco-table-cell) {
  min-height: 40px;
}
```

The repeated library ancestor is intentional in this compatibility form. Keep these related rules together. Bare child selectors, omitted business roots, and changes to descendant versus direct-child matching are not permitted by this exception.

## Review Checklist

- Every top-level component selector names a business root or justified teleported root.
- Project-owned classes use complete single-hyphen BEM names.
- Names describe meaning rather than color, position, or incidental markup.
- Overlong names are simplified before abbreviations are introduced.
- Unavoidable long names use consistent, recognizable character abbreviations rather than opaque letter strings.
- With nesting support, every descendant is nested beneath its nearest meaningful layout, state, or behavior owner; otherwise expanded selectors preserve that path.
- Direct-child combinators express a stable boundary, using `& >` in nested form or the equivalent expanded selector in plain CSS without nesting support.
- Deep rules target named selectors and share the nearest useful library ancestor; expanded plain CSS keeps the full library-owned path inside each deep argument.
- Pseudo-classes and business-state child changes retain their owning selector in either syntax.
