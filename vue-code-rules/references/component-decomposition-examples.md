# Component Decomposition Examples

Owns Core Rule 10.

For component names, allowed directories, style-file forms, and public export placement, read Core Rule 9's [Component Structure Examples](component-structure-examples.md). This reference owns split triggers, responsibility boundaries, and post-split verification.

## Mandatory Rules

1. Keep each `.vue` file at or below 1000 lines. Consider decomposition before that limit when content or responsibilities make the file hard to maintain: extract cohesive child components when the template/HTML is large, deeply nested, repeated, or contains independently maintainable business regions; extract focused hooks when the script is large or mixes distinct functional responsibilities; extract styles according to `css-code-rules` when style volume or complexity requires it. Each resulting Vue file must remain within the limit. Split by actual responsibility rather than arbitrary line chunks, and do not wait for 1000 lines before applying CSS's independent mandatory thresholds. Keep simple orchestration in the SFC. When splitting, moving, or changing directory form, update public entries, consumers, and automatic component discovery without migrating unrelated components.

## Scenario 1: Split by Template, Script, and Style Responsibilities

| Dominant concern | When to consider splitting | Destination and boundary |
| --- | --- | --- |
| Large or complex template/HTML | Deep nesting, repeated UI, or independently maintainable business regions | Cohesive children under `component/`, with explicit props/events/slots; do not create one child per trivial node or add wrappers |
| Large script | Distinct workflows, such as querying/filtering and selection, obscure the SFC's coordination role | Responsibility-focused files under `hooks/`; move the related state, computed values, watchers, actions, and cleanup together while preserving per-instance ownership |
| Large or complex style block | Either mandatory extraction trigger in `css-code-rules` is met, or a concrete maintenance need warrants earlier extraction | Extract the complete owned block with its scope intact; one stylesheet uses index.less, multiple justified stylesheets use style/; do not split by visual region |
| File exceeds 1000 lines | Any combination of template, script, and style | Apply the relevant responsibility boundaries until every resulting .vue meets the limit, then update public entries, consumers, and component discovery |

For example, a detail page may keep coordination in its SFC, move summary/chart UI into children, and move query and selection workflows into separate hooks:

```text
exam-detail/
|-- component/
|   |-- statistics-summary.vue
|   `-- statistics-chart/
|       |-- index.vue
|       |-- index.ts
|       `-- index.less
|-- hooks/
|   |-- useExamQuery.ts
|   `-- useExamSelection.ts
|-- index.less
|-- index.ts
`-- index.vue
```

The summary remains a simple private child. The chart uses directory form because it owns an extracted stylesheet; its stylesheet and the parent's stylesheet have different owners. Keep compiler macros and simple UI coordination in the owning SFC. Hooks must not become a module-level singleton or a single catch-all replacement for the entire script. Expose only submodules with real external consumers through the owner entry; local siblings can keep appropriate direct local imports.

## Review Checklist

- Every `.vue` file stays within 1000 lines.
- Large/complex templates are considered for cohesive children, large scripts for responsibility-focused hooks, and large styles for CSS-governed extraction rather than arbitrary line slicing.
- Splits preserve state and lifecycle ownership, prop/event/slot contracts, scope, consumers, public entries, and component discovery.
- CSS extraction decisions follow the matching css-code-rules reference; destination layout and public exports follow Core Rule 9.
- Keep compiler macros and simple coordination in the SFC; do not create module-level shared state or unrelated cleanup during a split.
