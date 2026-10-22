# DOM Structure Examples

Owns Core Rule 2.

## Mandatory Rules

1. Implement the required functionality with as few DOM nodes and nesting levels as possible. Do not add unnecessary nodes or meaningless wrappers. Reuse existing elements for behavior and styling directly; add a wrapper only when the required behavior or layout cannot otherwise be achieved, and keep its structure minimal. Do not add wrapper elements only to satisfy an abstract convention.

2. In non-interactive business layout, prefer `div` for block grouping and `span` for inline content. Use `i` only for decorative icon placeholders and mark it appropriately when accessibility tooling requires it. Use native interactive elements such as `button`, `a`, `input`, and `label` when their behavior or accessibility semantics apply. Use landmarks, headings, lists, tables, and other semantic elements only when they express real document structure, SEO meaning, data relationships, or accessibility—not merely for browser-default styling.

## Scenario 1: Use the Minimum Necessary DOM

**Positive example:**

Use the existing target element directly when it can implement the required behavior and styling:

```vue
<span class="user-card-name">{{ user.name }}</span>
```

**Negative example:**

Do not introduce extra nodes or nesting when they are unnecessary for the required functionality:

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

A wrapper is allowed only when the required behavior or layout cannot be implemented directly with existing elements. Give each necessary wrapper a clear purpose and keep the number of nodes and nesting levels to the minimum needed.

## Scenario 2: Choose General-Purpose, Interactive, or Semantic Elements

**Positive example:**

For non-interactive business layout, use predictable general-purpose elements. A decorative icon placeholder may use `i` when it is hidden from assistive technology:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" aria-hidden="true" />
</div>
```

Use native interactive elements when their behavior applies; do not attach button behavior to a `div` merely to keep the DOM generic:

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  View details
</button>
```

Use semantic elements deliberately for real page structure, data relationships, SEO, or accessibility:

```vue
<main class="article-page">
  <h1 class="article-page-title">{{ article.title }}</h1>
</main>
```

**Negative example:**

Do not replace that same detail button with a clickable `div` or use a heading solely for default styling:

```vue
<div class="user-card-action" @click="openUserDetail">View details</div>
<h1 class="user-card-name">{{ user.name }}</h1>
```

Use a business class and CSS for visual styling. Conversely, do not replace a real button, link, label, heading, list, or table with a generic element when that would discard useful semantics or keyboard behavior.

## Review Checklist

- The required functionality uses the minimum necessary DOM nodes and nesting; no unnecessary wrapper is present.
- Interactive and semantic elements match actual behavior, structure, SEO, data relationships, or accessibility.
