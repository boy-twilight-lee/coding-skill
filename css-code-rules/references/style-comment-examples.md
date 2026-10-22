# Style Comment Examples

Owns Core Rule 9.

## Mandatory Rules

1. Avoid comments in CSS, Less, Sass, SCSS, and Vue `<style>` blocks. Do not add routine section labels, selector descriptions, declaration explanations, commented-out code, or comments that merely restate the stylesheet. Add a comment only when a non-obvious compatibility workaround, external-library constraint, or temporary exception cannot be expressed clearly through naming or structure; keep that exceptional comment concise, explain why it is necessary, and write it in Chinese unless another language is strictly necessary for an exact external term or project-mandated convention.

## Scenario 1: Decide Whether a Comment Is Justified

Situation: a selector contains an obvious color declaration.

**Positive example:**

Write the rule without narration:

```less
.talent-card {
  color: #303133;
}
```

A concise Chinese comment is acceptable when a non-obvious external constraint cannot be expressed through structure or naming:

```less
.legacy-dialog {
  /* <zh: explain the legacy WebView scroll-bounce workaround.> */
  -webkit-overflow-scrolling: touch;
}
```

**Negative example:**

Do not add a section label or a comment that restates the same declaration:

```less
/* <zh: label the card title styles.> */
.talent-card {
  /* <zh: state that this sets the primary text color.> */
  color: #303133;
}
```

The comment must explain why the unusual declaration exists. Remove commented-out code; version control already preserves history.

## Review Checklist

- Comments exist only for non-obvious constraints and explain why.
