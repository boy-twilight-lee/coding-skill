# Naming Examples

## Mandatory Rules

1. Give every component a meaningful business root class and keep all of its owned selectors beneath that root. Teleported content may use a separate fully qualified business root because it is rendered outside the component tree.
2. Follow the project's single-hyphen BEM-like convention: write complete names in the form `block-element-modifier`, using one hyphen as the separator and never `__` or `--` in project-owned class names. Because the same delimiter also appears inside multiword business terms, choose the shortest unambiguous complete name and rely on the owning selector hierarchy—not punctuation alone—to communicate the relationship. Library-owned selectors retain their library naming.
3. Describe a component, element, state, or business meaning in every class. Avoid ambiguous names and arbitrary suffix chains.
4. Prohibit overly long class names. First remove redundant ownership words, duplicated business terms, visual descriptions, and unnecessary suffixes while retaining enough meaning to identify the component, element, or state. Do not preserve a verbose name merely because it mirrors every DOM ancestor.
5. When a class name cannot be kept reasonably short after removing redundant wording, shorten repeated business segments with consistent, comprehensible character abbreviations. Prefer abbreviations already established by the repository or feature glossary, and use the same abbreviation for the same term throughout the ownership subtree. Never create ambiguous, opaque, concatenated, or arbitrary letter sequences merely to reduce character count.

Use these scenarios to choose business-qualified component, element, state, and teleported-root names.

## Scenario 1: Name a Component Root, Elements, and States

Situation: a candidate card has a header, title, action, selected state, and disabled state.

**Positive example:**

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

For the table header named in the negative example below, use a business-qualified class without a visual suffix:

```less
.candidate-table {
  .candidate-table-header {
    color: var(--text-color-danger);
  }
}
```

**Negative example:**

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

**Positive example:**

Prefer a naturally concise full name when it identifies the owner without collision:

```vue
<div class="candidate-evaluation">
  <div class="candidate-evaluation-header">
    <span class="candidate-evaluation-title">Candidate evaluation</span>
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
    <span class="hr-recruit-cand-eval-title">Candidate evaluation</span>
    <div class="hr-recruit-cand-eval-actions">
      <button class="hr-recruit-cand-eval-submit">Submit</button>
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
.hr-recruit-cand-eval {
  .hr-recruit-candidate-eval-header {
    .hr-rec-cand-evaluation-title {
    }
  }
}
```

Abbreviations are a controlled fallback for unavoidable length, not permission to sacrifice meaning. When no shared abbreviation exists, establish one consistently within the feature instead of inventing a different shorthand in each selector.

## Scenario 3: Name a Teleported Root

Situation: a filter panel renders a popper outside the component root.

**Positive example:**

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
- Overlong names are simplified before abbreviations are introduced.
- Unavoidable long names use consistent, recognizable character abbreviations rather than opaque letter strings.
