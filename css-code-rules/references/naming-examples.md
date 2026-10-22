# Naming Examples

## Mandatory Rules

1. Give every component a concise, business-qualified root class and keep its owned selectors beneath that root. Teleported content may use a separate concise, business-qualified root because it is rendered outside the component tree.
2. Follow the project's single-hyphen BEM-like convention in the form `block-element-modifier`, using concise business abbreviations and one hyphen as the separator, never `__` or `--` in project-owned names. Keep enough qualified meaning to identify the owner, element, or state, and use selector ownership to express hierarchy rather than repeating every ancestor in the name. Library-owned selectors retain their library naming.
3. Describe a component, element, state, or business meaning in every class. Avoid ambiguous names and arbitrary suffix chains.
4. Concise naming and class-length control are mandatory. Remove redundant ownership words, duplicated business terms, visual descriptions, and unnecessary suffixes, and shorten multiword or repeated business segments using the agreed abbreviations. Do not retain verbose full names merely because they mirror every DOM ancestor.
5. Use consistent, recognizable business abbreviations as the default naming requirement, not a last resort after names become long. Prefer the repository or feature glossary; establish a clear local mapping when none exists and use it consistently throughout the ownership subtree. Keep already short structural or state words readable. Never create ambiguous, opaque, concatenated, or arbitrary letter sequences merely to reduce character count.

Use these scenarios to choose business-qualified component, element, state, and teleported-root names.

## Scenario 1: Name a Component Root, Elements, and States

Situation: a candidate card has a header, title, action, selected state, and disabled state.

**Positive example:**

Use a meaningful business root and complete single-hyphen BEM names:

```less
.cand-card {
  .cand-card-header {
    .cand-card-title {
      color: #303133;
    }
  }
  .cand-card-action {
    cursor: pointer;
  }
  &.cand-card-selected {
    border-color: #409eff;
  }
  &.cand-card-disabled {
    cursor: not-allowed;
    .cand-card-action {
      pointer-events: none;
    }
  }
}
```

For the table header named in the negative example below, use a business-qualified class without a visual suffix:

```less
.cand-table {
  .cand-table-header {
    color: #f56c6c;
  }
}
```

**Negative example:**

Avoid generic roots, double-underscore/double-hyphen BEM, visual-only names, and arbitrary suffix chains:

```less
.card {
}

.cand-card__header {
}

.cand-card--selected {
}

.table-box-header-red {
}
```

The class should still describe the business role when color, position, or implementation changes.

## Scenario 2: Enforce Concise Abbreviated Class Names

Situation: a human-resources recruitment feature contains a candidate-evaluation panel. Repeating every domain, page, component, element, and visual role would make each class progressively longer.

Apply all of these mandatory steps:

1. Remove words already implied by the owning business root.
2. Remove visual or implementation-only suffixes that do not describe business meaning.
3. Apply the agreed business abbreviations while preserving clear ownership and meaning.
4. Keep the final name as short as its business meaning permits; do not wait for an overlong name before abbreviating.

**Positive example:**

Use the concise business form `cand-eval` consistently for candidate evaluation, instead of repeating the full words in every class:

```vue
<div class="cand-eval">
  <div class="cand-eval-header">
    <span class="cand-eval-title">Candidate evaluation</span>
  </div>
</div>
```

```less
.cand-eval {
  .cand-eval-header {
    display: flex;
    .cand-eval-title {
      color: #303133;
    }
  }
}
```

When HR and recruitment context is also needed to distinguish the owner, retain only the necessary qualifiers and apply one explicit abbreviation mapping:

| Business term | Illustrative abbreviation | Readability condition |
| --- | --- | --- |
| human resources | `hr` | The repository consistently uses HR terminology. |
| recruitment | `rec` | The feature glossary defines `rec` as recruitment and uses it consistently. |
| candidate | `cand` | The feature glossary makes the meaning unambiguous. |
| evaluation | `eval` | The abbreviation is consistently used for evaluation. |

Complete abbreviated application:

```vue
<div class="hr-rec-cand-eval">
  <div class="hr-rec-cand-eval-header">
    <span class="hr-rec-cand-eval-title">Candidate evaluation</span>
    <div class="hr-rec-cand-eval-actions">
      <button class="hr-rec-cand-eval-submit">Submit</button>
    </div>
  </div>
</div>
```

```less
.hr-rec-cand-eval {
  .hr-rec-cand-eval-header {
    display: flex;
    .hr-rec-cand-eval-title {
      color: #303133;
    }
    .hr-rec-cand-eval-actions {
      display: flex;
      .hr-rec-cand-eval-submit {
        cursor: pointer;
      }
    }
  }
}
```

The abbreviation is acceptable because every shortened segment has a stable meaning and remains readable in isolation. The same term must not alternate between full and shortened forms within the subtree.

**Negative example:**

Do not encode every ancestor, implementation detail, and visual role into one name:

```vue
<div class="human-resources-recruitment-candidate-evaluation-management-panel-container">
  <div class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper">
    <span class="human-resources-recruitment-candidate-evaluation-management-panel-container-header-wrapper-title-text">
      Candidate evaluation
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
.hr-rec-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

Concise abbreviated naming is mandatory. Establish and apply a clear feature-level mapping from the first declaration; do not retain verbose full names or alternate shorthand across selectors. Length control must preserve understandable business meaning.

## Scenario 3: Name a Teleported Root

Situation: a filter panel renders a popper outside the component root.

**Positive example:**

Two top-level roots are valid because they belong to separate rendered trees:

```less
.cand-filter {
}

.cand-filter-popper {
  .cand-filter-popper-option {
  }
}
```

The teleported root must remain fully qualified. A generic `.popper`, `.option`, or `.dropdown-item` selector would leak into unrelated content.

**Negative example:**

Do not rename that same teleported tree with generic global selectors:

```less
.popper {
  .option {
  }
}
```

## Review Checklist

- Every top-level component selector names a business root or justified teleported root.
- Project-owned classes use complete single-hyphen BEM names.
- Names describe meaning rather than color, position, or incidental markup.
- All project-owned names use concise forms and the agreed business abbreviations from the start.
- Class length is controlled by removing redundant segments and abbreviating consistently, without opaque letter strings or repeated ancestor chains.
