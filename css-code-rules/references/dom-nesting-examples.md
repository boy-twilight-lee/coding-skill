# DOM Nesting and Mixin Examples

Owns Core Rule 4.

## Mandatory Rules

1. In Less/Sass/SCSS, follow the actual rendered DOM parent hierarchy and the order of child branches. Nest every owned descendant under its actual parent selector and retain intermediate DOM parents; do not float descendants outside their parents, flatten them at the stylesheet root, or skip a parent to reduce nesting depth. Only actual stylesheet roots, intentional global rules, and separately rendered Teleport roots are top-level. Retain concise complete class names instead of generating opaque names by concatenation. Use `& >` only when a stable direct-child boundary is needed to prevent unintended descendant matches; otherwise preserve the DOM hierarchy with ordinary nesting. Never start a nested selector with a bare `>`.

2. When component-local declarations are genuinely reused, first define a focused non-emitting mixin at the top of the nearest common DOM ancestor selector scope, before ordinary declarations and child rules. Invoke it inside each consumer's original nested path. Do not lift consumers, skip their DOM parents, or flatten selectors to implement reuse. Existing application-wide utilities keep their established global ownership.

3. Declare the owning element once, then place its pseudo-elements and pseudo-classes inside that block using `&`, such as `&::after` and `&:hover`. Group shared conditions into a branch such as `&:not(.a):not(.b)` and nest its interaction state as `&:hover` inside it. Do not repeat the owning class with flattened pseudo chains under its parent. Follow the exact supplied wrong/right example in Scenario 3. Business state classes are chained to their owner, and state-dependent descendants retain the actual DOM parent path.

## Scenario 1: Follow the Actual DOM Hierarchy and Order

Situation: the title is inside the header, the summary is inside the body, and the header precedes the body in the rendered DOM.

```vue
<div class="cx-container">
  <div class="cx-container-header">
    <span class="cx-container-title">标题</span>
  </div>
  <div class="cx-container-body">
    <span class="cx-container-summary">摘要</span>
  </div>
</div>
```

**Positive example:**

Retain the complete parent chain and list child branches in DOM order:

```less
.cx-container {
  .cx-container-header {
    .cx-container-title {
      color: #303133;
    }
  }
  .cx-container-body {
    .cx-container-summary {
      color: #606266;
    }
  }
}
```

**Negative example:**

Do not float a descendant outside its DOM parent:

```less
.cx-container-title {
  color: #303133;
}
```

Do not skip the header merely to reduce nesting depth:

```less
.cx-container {
  .cx-container-title {
    color: #303133;
  }
}
```

The actual DOM hierarchy determines stylesheet nesting. Do not skip an intermediate parent because it seems incidental or because the nesting is deep. If the markup itself is unnecessarily deep, address that markup only within the authorized change scope; do not conceal it by flattening selectors.

## Scenario 2: Decide Whether a Direct-Child Selector Is Necessary

Situation: a menu applies separators only to its own items, while nested submenus contain the same `.menu-item` class.

**Positive example:**

The direct-child boundary prevents the parent menu from styling nested submenu items:

```less
.menu-list {
  & > .menu-item {
    border-bottom: 1px solid #dcdfe6;
  }
}
```

For an ordinary descendant with no collision risk, use normal nesting:

```less
.talent-card {
  .talent-card-title {
    color: #303133;
  }
}
```

**Negative example:**

Never start a nested selector with a bare combinator:

```less
.menu-list {
  > .menu-item {
  }
}
```

Do not add `& >` only because the current markup happens to be one level deep. Use it only when direct-child scope is a stable part of the component contract.

## Scenario 3: Nest Pseudo-elements, Pseudo-classes, and Conditions

Use the following supplied pattern. First declare the owning element, then nest pseudo-elements and pseudo-classes through `&`. Group shared conditions before nesting the interaction state. Empty bodies show the required structure.

**Negative example:**

```less
.cx-container {
  .cx-container-header {
    .cx-container-title::after {
    }
    .cx-container-title:hover {
    }
    .cx-container-title:not(.a):not(.b):hover {
    }
  }
}
```

**Positive example:**

```less
.cx-container {
  .cx-container-header {
    .cx-container-title {
      &::after {
      }
      &:hover {
      }
      &:not(.a):not(.b) {
        &:hover {
        }
      }
    }
  }
}
```

Do not repeat the owning class alongside each pseudo branch under its parent. Keep `&::after`, `&:hover`, and the conditional block inside `.cx-container-title`. Inside `&:not(.a):not(.b)`, nest `&:hover` rather than flattening all conditions and interaction into the parent branch.

Business states use a complete state class chained to their owner. Any affected descendant retains its full actual DOM parent path:

```less
.cx-container {
  &.cx-container-active {
    .cx-container-header {
      .cx-container-title {
        color: #409eff;
      }
    }
  }
}
```

## Scenario 4: Define Reusable Mixins at the Common DOM Ancestor

Situation: the title and summary in Scenario 1 share ellipsis styling. Their common DOM ancestor is `.cx-container`.

**Positive example:**

Define the non-emitting mixin at the top of that ancestor selector scope, before ordinary declarations and child rules. Invoke it at each consumer while preserving the DOM hierarchy and order:

```less
.cx-container {
  .text-ellipsis() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cx-container-header {
    .cx-container-title {
      .text-ellipsis();
    }
  }
  .cx-container-body {
    .cx-container-summary {
      .text-ellipsis();
    }
  }
}
```

**Negative example:**

Do not lift the consumers outside their header/body parents or group them under a shallower selector merely to share declarations:

```less
.cx-container {
  .cx-container-title,
  .cx-container-summary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
```

Prefer this nearest-common-DOM-ancestor mixin placement for component-local repetition. Reuse does not permit skipping parents or floating child selectors. Existing application-wide utilities remain in their established shared layer.

## Review Checklist

- Descendants follow the actual DOM parent chain and child order; no child floats outside its parent and no intermediate parent is skipped to reduce depth.
- Reused local declarations are defined as focused mixins at the top of the common DOM ancestor scope and invoked from intact consumer paths.
- Direct-child combinators express a stable boundary and use `& >` in preprocessor nesting.
- Pseudo-elements and pseudo-classes use owner-local & branches; shared conditions contain nested interaction branches as in the supplied example.
- Business-state child changes retain their full DOM parent path.
