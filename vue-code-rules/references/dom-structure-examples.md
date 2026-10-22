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

```vue
<div class="user-card-name-wrapper">
  <span class="user-card-name-inner">
    <span>{{ user.name }}</span>
  </span>
</div>
```

## Scenario 2: Use Common Tags and Native Controls

**Positive example:**

Use common elements for business and page layout. Without an explicit accessibility request, leave unrelated accessibility attributes off the decorative icon:

```vue
<div class="user-card">
  <span class="user-card-name">{{ user.name }}</span>
  <i class="user-card-status-icon" />
</div>
```

**Negative example:**

A clickable div does not replace the required native button behavior; prohibited landmark/sectioning containers are not a layout alternative. The native button is shown in Scenario 3.

```vue
<div class="user-card-action" @click="openUserDetail">View details</div>
<main class="article-page">
  <article>
    <span>{{ article.title }}</span>
  </article>
</main>
```

## Scenario 3: Keep Accessibility Attributes Within the User's Request

**Positive example:**

An ordinary detail-button request needs the native control and functional attributes:

```vue
<button type="button" class="user-card-action" @click="openUserDetail">
  查看详情
</button>
```

**Negative example:**

Do not proactively add a button role, repeated accessible label, or accessibility-only tab stop when the user has not requested accessibility compatibility:

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

For a user-requested screen-reader-compatible icon-only button, add its accessible name and hide only the decorative icon from assistive technology:

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

## Review Checklist

- The required functionality uses the minimum necessary DOM nodes and nesting; no unnecessary wrapper is present.
- Implementations prefer common tags such as div, span, i, button, and input.
- No uncommon tags, prohibited landmark/sectioning containers, or invented dataset/landmark elements are present.
- Common native controls retain the behavior and keyboard interaction needed by the feature.
- No unrelated accessibility attributes are added without an explicit user request for accessibility compatibility.
- When accessibility is requested, each added aria/role/tabindex attribute is relevant to that request; unrelated existing attributes are not removed.
