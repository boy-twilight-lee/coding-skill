# Style Comment Examples

Owns Core Rule 9.

## Mandatory Rules

1. Avoid comments in CSS, Less, Sass, SCSS, and Vue `<style>` blocks. Do not add routine section labels, selector descriptions, declaration explanations, commented-out code, or comments that merely restate the stylesheet. Add a comment only when a non-obvious compatibility workaround, external-library constraint, or temporary exception cannot be expressed clearly through naming or structure; keep that exceptional comment concise, explain why it is necessary, and write it in Chinese unless another language is strictly necessary for an exact external term or project-mandated convention.

2. Positive and negative examples must follow the same comment restraint. Keep file paths, scenario context, and explanations outside code blocks. Comments may remain only when essential to demonstrate this comment rule itself or a necessary non-obvious constraint; write concrete text instead of placeholder markers.

## Scenario 1: Decide Whether a Comment Is Justified

Situation: a selector contains an obvious color declaration.

**Positive example:**

Write the rule without narration:

```less
.talent-card {
  color: #303133;
}
```

A concise Chinese comment is acceptable when a non-obvious external constraint cannot be expressed through structure or naming. In this scenario, the supported legacy iOS WebView requires the prefixed property for momentum scrolling:

```less
.legacy-dialog {
  /* 兼容旧版 iOS WebView 的惯性滚动。 */
  -webkit-overflow-scrolling: touch;
}
```

**Negative example:**

Do not add a section label or a comment that restates the same declaration. The comments below are retained only to demonstrate this violation:

```less
/* 卡片样式。 */
.talent-card {
  /* 设置正文颜色。 */
  color: #303133;
}
```

The comment must explain why the unusual declaration exists. Remove commented-out code; version control already preserves history.

## Review Checklist

- Comments exist only for non-obvious constraints and explain why.
- Positive and negative examples omit comments unless the demonstration requires them; file paths and explanations stay outside code blocks.
