# DOM Structure Examples

Owns Core Rule 2.

## Mandatory Rules

1. Implement the required functionality with as few DOM nodes and nesting levels as possible. Do not add unnecessary nodes or meaningless wrappers. Reuse existing elements for behavior and styling directly; add a wrapper only when the required behavior or layout cannot otherwise be achieved, and keep its structure minimal. Do not add wrapper elements only to satisfy an abstract convention.

2. Prefer common HTML tags such as `div`, `span`, `i`, `button`, and `input` throughout implementations. Use `div` for block layout, `span` for inline content, and `i` only for decorative icon placeholders. Use common native controls such as `button`, `input`, `a`, `label`, `textarea`, and `select` when their behavior applies; the examples are not a closed whitelist of common tags. Uncommon tags and landmark/sectioning containers are prohibited, including `main`, `nav`, `aside`, `section`, `article`, `header`, and `footer`; use common elements and business classes for those layouts. Do not introduce these containers for document structure, SEO, or semantic grouping. `dataset` is a DOM data-attribute API and `landmark` is an accessibility concept, not an HTML tag; never emit `<dataset>` or `<landmark>` elements.

3. For every DOM tag, do not add unrelated accessibility attributes unless the user explicitly requests accessibility compatibility. Do not proactively add `aria-*` attributes, accessibility-only `role`, or accessibility-only `tabindex` for general accessibility completeness. When the user does request accessibility support, add only attributes needed for that requested behavior, without mechanically annotating every node. Preserve native controls and functional attributes required by the feature, such as `type`, `disabled`, and `readonly`; this rule does not authorize removing existing attributes outside the task's scope.

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

## Scenario 2: Use Common Tags and Native Controls

**Positive example:**

Use common tags for business layout. With no explicit user request for accessibility compatibility, do not add accessibility-only attributes to the decorative icon:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" />
</div>
```

Use native interactive elements when their behavior applies; do not attach button behavior to a `div` merely to keep the DOM generic:

```vue
<button class="user-card-action" type="button" @click="openUserDetail">
  View details
</button>
```

Use the same common-tag approach for page containers and title display:

```vue
<div class="article-page">
  <span class="article-page-title">{{ article.title }}</span>
</div>
```

**Negative example:**

Do not replace the common native button with a clickable `div`, or introduce prohibited landmark/sectioning containers for the same page layout:

```vue
<div class="user-card-action" @click="openUserDetail">View details</div>
<main class="article-page">
  <article>
    <span>{{ article.title }}</span>
  </article>
</main>
```

Use common tags and business classes for layout and styling. Preserve the behavior and keyboard interaction of common native controls, and do not use uncommon or invented tags to replace them. The minimal-DOM rule still applies when selecting common tags.

## Scenario 3: Keep Accessibility Attributes Within the User's Request

**Positive example:**

For an ordinary request to add a detail button, keep the native button and its functional attributes without adding unrelated accessibility metadata:

```vue
<button type="button" class="user-card-action" @click="openUserDetail">
  查看详情
</button>
```

**Negative example:**

When the user has not requested accessibility compatibility, do not mechanically add an explicit button role, a repeated accessible label, or an accessibility-only tab stop:

```vue
<button
  type="button"
  class="user-card-action"
  role="button"
  aria-label="查看详情"
  tabindex="0"
  @click="openUserDetail"
>
  查看详情
</button>
```

**Explicit accessibility request:**

If the user explicitly asks for screen-reader compatibility for an icon-only detail button, add the relevant accessible name and hide its decorative icon from assistive technology:

```vue
<button
  type="button"
  class="user-card-action"
  aria-label="查看详情"
  @click="openUserDetail"
>
  <i class="user-card-detail-icon" aria-hidden="true" />
</button>
```

The explicit request supplies the scope for these attributes. Keep additions limited to that behavior rather than applying them to unrelated nodes, and retain native button behavior in both cases.

## Review Checklist

- The required functionality uses the minimum necessary DOM nodes and nesting; no unnecessary wrapper is present.
- Implementations prefer common tags such as div, span, i, button, and input.
- No uncommon tags, prohibited landmark/sectioning containers, or invented dataset/landmark elements are present.
- Common native controls retain the behavior and keyboard interaction needed by the feature.
- No unrelated accessibility attributes are added without an explicit user request for accessibility compatibility.
- When accessibility is requested, each added aria/role/tabindex attribute is relevant to that request; unrelated existing attributes are not removed.
