# Ineffective CSS Declaration Examples

## Mandatory Rules

1. This reference only covers removal and prevention of ineffective or redundant CSS declarations. If a matched global reset, inherited value, or browser rule already supplies the same effective value, repeating it in a component is prohibited. Check the actual matched element and states before adding declarations.
2. Do not redeclare reset values such as box sizing, margins, padding, typography, list styling, or borders. Do not add declarations equal to the effective browser default just to make a selector look complete.
3. Remove properties that cannot affect the current element in its actual formatting context, as well as declarations unconditionally overwritten by later declarations. A property name is not universally invalid: the restriction concerns its verified lack of effect in this usage.
4. Check the active reset, ancestor inheritance, user-agent rules, cascade, responsive/state rules, and computed result. A declaration that changes a required result is not redundant. Do not infer that every element has the same font, margin, padding, or display default, and do not remove deliberate compatibility fallbacks or constraints that have a distinct effect.

## Common Redundant or Ineffective Declarations

The following values are examples to inspect, not universal defaults or a project reset prescription. Omit a declaration only after confirming that the same result is already supplied or that the property has no effect for the actual element and required states.

| Category | Properties or declarations to inspect | When repetition is prohibited |
| --- | --- | --- |
| Box sizing | `box-sizing: border-box` | The matched global reset already sets it. `border-box` is not the universal browser initial value. |
| Margins | `margin`, all four physical sides, `margin-block`, `margin-inline`, and their start/end longhands | The active reset or matched rule already provides the same effective spacing. |
| Padding | `padding`, all four physical sides, `padding-block`, `padding-inline`, and their start/end longhands | The same effective padding is already supplied. |
| Font family and size | `font-family`, `font-size`, `font` | The same typography is already inherited or reset for this element. Form controls and headings must be checked individually. |
| Other typography | `font-weight`, `font-style`, `font-variant`, `font-stretch`, `line-height` | Inheritance or matched rules already produce the same result. |
| Text | `color`, `text-align`, `text-indent`, `text-transform`, `letter-spacing`, `word-spacing`, `white-space`, `word-break`, `overflow-wrap` | The same value is already inherited or otherwise supplied. |
| Lists | `list-style`, `list-style-type`, `list-style-position`, `list-style-image` | A matched list reset already supplies the intended result; do not assume all lists have no markers. |
| Borders | `border`, `border-width`, `border-style`, `border-color`, side-specific border properties | The declaration repeats the active reset or makes no difference to the required border result. |
| Backgrounds | `background-color: transparent`, `background-image: none`, repeated `background` values | No matched rule or required state would give a different background without the declaration. |
| Decorative effects | `border-radius: 0`, `box-shadow: none`, `text-shadow: none`, `opacity: 1`, `transform: none`, `filter: none` | The same effective value is already supplied and no intended state override is being performed. |
| Positioning and flow defaults | `position: static`, `float: none`, `clear: none`, `z-index: auto`, `overflow: visible` | These are already the effective values for the target; no override is needed. |
| Sizing defaults | `width: auto`, `height: auto`, `max-width: none`, `max-height: none` | They merely repeat the target's existing effective behavior. |
| Motion defaults | `animation: none`, `transition: none`, zero delays or durations | No existing rule or required interaction is being overridden. |
| Element display | For example, `display: block` on an otherwise unstyled block-level div | The element's actual display is already identical; display defaults vary by element. |
| Position offsets | `top`, `right`, `bottom`, `left`, `inset` | The actual positioning context makes the offsets ineffective, such as an ordinary static element. |
| Stacking | `z-index` | It is set on an ordinary non-positioned element that is neither a flex nor grid item and does not support that stacking use. |
| Flex and grid items | `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`, `grid-row`, `grid-column` | The target is not an applicable flex/grid item or the value has no effect in that context. |
| Alignment and gaps | `align-items`, `justify-content`, `align-self`, `gap`, `row-gap`, `column-gap` | The actual layout context does not support the requested effect. |
| Vertical and replaced-element alignment | `vertical-align`, `object-fit`, `object-position` | For example, vertical-align on an ordinary block or object-fit on a non-replaced div does not apply. |
| Repeated or overwritten declarations | Repeated properties, earlier longhands overwritten by a later shorthand, equivalent values | The earlier declaration has no fallback, state, or other independent effect. |

## Scenario 1: Do Not Repeat a Matched Global Reset or Inheritance

Assume the project already has the following active global reset and body typography. These literal values are hypothetical evidence for this example, not a required project reset or universal browser defaults. The target `.cand-card` is a normal div inheriting body typography.

```less
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
}
```

**Negative example:**

Do not copy the matched reset and inherited values into the component:

```less
.cand-card {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
}
```

**Positive example:**

Keep only the card-specific radius that changes the result:

```less
.cand-card {
  border-radius: 8px;
}
```

The repeated box sizing, margin, padding, font family, font size, line height, and color are prohibited because the same values are already effective on this div.

## Scenario 2: Do Not Restate Effective Browser Defaults

Assume a normal block-level div whose matched rules and required states already produce the defaults shown below. It has no background, border, motion, opacity, or transform override. Only 12px padding is required by the component.

**Negative example:**

```less
.cand-panel {
  position: static;
  float: none;
  clear: none;
  overflow: visible;
  padding: 12px;
  background-color: transparent;
  background-image: none;
  border-style: none;
  border-radius: 0;
  box-shadow: none;
  display: block;
  opacity: 1;
  transform: none;
  animation: none;
  transition: none;
}
```

**Positive example:**

```less
.cand-panel {
  padding: 12px;
}
```

Do not add default-valued declarations to make the block look complete. If a property overrides a real ancestor, global, user-agent, or state rule and changes the required result, it is not redundant.

## Scenario 3: Remove Properties Inapplicable to the Layout Context

Assume `.cand-card-title` is a normal static-positioned block div directly inside `.cand-card`; neither is a flex/grid container and the title is not a replaced element. The component needs only 8px title padding.

**Negative example:**

```less
.cand-card {
  .cand-card-title {
    top: 0;
    left: 0;
    z-index: 1;
    padding: 8px;
    vertical-align: middle;
    flex-grow: 1;
    flex-basis: 0%;
    grid-column: 1 / 3;
    object-fit: cover;
  }
}
```

**Positive example:**

```less
.cand-card {
  .cand-card-title {
    padding: 8px;
  }
}
```

The offsets and z-index do not apply to this static non-flex/grid item; flex/grid placement, vertical-align, and object-fit also have no effect on this ordinary block div. Other formatting contexts can make these properties valid, so judge the actual element rather than banning the property name.

## Review Checklist

- Matched reset values and identical inherited values are not redeclared in components.
- Browser defaults are checked for the actual element and states rather than assumed globally.
- Inapplicable and unconditionally overwritten declarations are removed.
- Every retained declaration has a distinct required effect; deliberate fallbacks and effective constraints are preserved.
- This reference contains no mixin, variable, utility, or loop extraction policy.
