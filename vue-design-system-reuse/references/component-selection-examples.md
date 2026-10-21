# Component Selection Examples

These examples use generic component names. Replace them with the project's actual components and APIs after inspecting definitions and existing usage.

## 1. Reuse Project Wrappers Before Raw HTML

**Positive:** the repository already provides form and action wrappers, so the converted page uses their model, validation, loading, and theme contracts.

```vue
<app-form :model="profile" @submit="saveProfile">
  <app-text-field
    v-model="profile.name"
    label="姓名"
    name="name"
    required
  />
  <app-button :loading="isSaving" type="submit">保存</app-button>
</app-form>
```

**Negative:** this recreates the same controls from raw elements and page-local classes.

```vue
<form @submit.prevent="saveProfile">
  <label>
    姓名
    <input v-model="profile.name" name="name" required />
  </label>
  <button type="submit">保存</button>
</form>
```

The negative version may look correct but can bypass shared validation, loading prevention, analytics, accessibility, and theme behavior.

## 2. Prefer a Secondarily Developed Component to Its Library Primitive

Suppose `business-date-range` wraps the installed library's date picker and normalizes values to the backend's timezone contract.

**Positive:** use the project wrapper because it has the same responsibility as the design control.

```vue
<business-date-range
  v-model="filters.createdAt"
  label="创建时间"
/>
```

**Negative:** direct library use silently skips the project's normalization and shared presets.

```vue
<el-date-picker
  v-model="filters.createdAt"
  type="daterange"
/>
```

Do not judge equivalence only by appearance. Inspect value shape, events, validation, permissions, localization, and side effects.

## 3. Use the Installed Library When No Wrapper Exists

If the project uses Element Plus and no shared select wrapper or domain component matches the responsibility, use the configured library component.

**Positive:**

```vue
<el-select v-model="filters.status" placeholder="请选择状态">
  <el-option
    v-for="option in statusOptions"
    :key="option.value"
    :label="option.label"
    :value="option.value"
  />
</el-select>
```

**Negative:**

```vue
<div class="status-select" tabindex="0">
  <span>{{ selectedStatusLabel }}</span>
  <div class="status-select-options">
    <div
      v-for="option in statusOptions"
      :key="option.value"
      @click="selectStatus(option.value)"
    >
      {{ option.label }}
    </div>
  </div>
</div>
```

The hand-built version takes ownership of keyboard navigation, focus, popup positioning, disabled states, and accessibility without justification.

## 4. Choose the Dominant Themed Library

Suppose a repository contains three UI libraries that all provide a select control:

| Library | Active project theme | Actual repository usage |
| --- | --- | --- |
| Library A | Yes | 184 usages |
| Library B | No | 12 usages |
| Library C | Yes | 37 usages |

**Positive:** choose Library A. It is eligible because its project theme is actively loaded, and it is the most frequently used eligible library.

**Negative:** choose Library B because its default select most closely resembles the Figma frame, or choose Library C because the agent knows its API better.

Count application imports, template usages, global registrations, and shared wrappers. Do not count a package merely because it appears in a lockfile or as a transitive dependency. A project-owned wrapper still takes priority even when it is internally built on a less frequent library.

Avoid mixing Library A buttons, Library C form fields, and Library B dialogs in one page when Library A can provide all three. If the dominant themed library lacks a required behavior, document that gap before choosing the next eligible themed library or creating a shared wrapper.

## 5. Reuse High-Frequency and Complex Components

High-frequency or interaction-heavy controls have hidden behavior that a static frame does not reveal:

| UI responsibility | Required reuse target | Hidden behavior that must not be rebuilt for styling |
| --- | --- | --- |
| Dialog or drawer | Project wrapper, then dominant themed library | Focus trap, escape handling, scroll lock, stacking, portal or teleport lifecycle |
| Toast or notification | Project composable/service, then library service API | Queueing, deduplication, duration, teardown, accessibility, stacking |
| Table or data grid | Project table, then library table | Sorting, selection, empty/loading states, sticky layout, resizing, virtualization |
| Tree or tree select | Project tree, then library tree | Expansion, checked state, keyboard navigation, lazy loading, filtering |

**Positive:** keep the selected project or library component and adapt its supported props, slots, variants, and theme tokens. If those cannot match the design, extend or reset the selected library's established theme package.

**Negative:** replace a dialog with a fixed-position `div`, append custom toast DOM, build a table from page-local rows and sorting handlers, or render a tree from nested lists because those structures more closely match the screenshot.

Visual difference alone is never a capability gap. Only missing required behavior may justify a new shared wrapper, and that wrapper should compose the dominant themed library primitive or service wherever possible.

## 6. Adapt Appearance Through the Theme System

When the correct component exists but the design uses a different radius, height, color, or density:

**Positive:** locate the project's theme entrypoint or token layer, map the design values to supported library variables, and use the existing component. Apply a new variant only when the theme system supports variants and the difference is intentional.

**Negative:** copy the library's rendered DOM into the page, add a lookalike control, or target undocumented internal class chains with broad overrides merely to match the screenshot.

A theme change is systematic only when its effect on other screens is intended and verified. Otherwise use the narrowest established token, variant, or wrapper extension.

## 7. Create a Shared Wrapper When the Capability Is Missing

Suppose the design requires a file picker with a project-specific size limit and error contract, but the repository has no matching wrapper.

**Positive:** add one reusable component in the established shared-component location, preferably composed from the installed upload primitive, then consume it from the page.

```vue
<app-file-picker
  v-model="attachments"
  :max-size="attachmentLimit"
  accept="application/pdf"
/>
```

**Negative:** hide a raw file input inside the page and duplicate size checks, error messages, and upload state there.

```vue
<input
  accept="application/pdf"
  type="file"
  @change="handleAttachmentChange"
/>
```

The shared wrapper should expose a stable project-level contract. Do not create it merely as a one-line alias when the library primitive already fits.

## 8. Preserve Behavior Hidden by Static Figma Frames

A static frame may show only the default state. Before implementation, inspect existing equivalents for:

- Focus, hover, active, disabled, loading, empty, error, and success states.
- Label association, descriptions, required indicators, and validation messages.
- Keyboard operation, tab order, escape behavior, and focus restoration for overlays.
- Model value shape, clear behavior, emitted events, and submission conversion.
- Responsive behavior, localization, permissions, and analytics hooks.

**Positive:** use the existing component contract and map the visible frame to its supported state or variant.

**Negative:** implement only the visible pixels and omit behavior because it was not drawn in the frame.

## 9. Review Smells

Investigate the conversion when any of these appear:

- Raw common controls in a page that already imports a UI library.
- Direct library imports beside project wrappers with the same responsibility.
- New `base-*`, `common-*`, or `app-*` components that duplicate existing components under another name.
- Page-local validation, loading, permission, or value-conversion logic already owned by a shared wrapper.
- Large blocks of styles that imitate a library component or depend on its undocumented internal DOM.
- A newly added UI dependency for a control the current project can already provide.
- Multiple UI libraries mixed in one page without a documented capability gap.
- A library selected without evidence that its project theme is active and that it is the dominant eligible library.
- Hand-written dialogs, drawers, toasts, notifications, tables, trees, or composite inputs whose difference from an available component is only visual.
- Custom overlay, focus, stacking, notification lifecycle, sorting, selection, expansion, or virtualization logic that duplicates the selected library.
- Component choices justified only by visual similarity, without repository evidence.

## Review Checklist

- Every form control and common action has an evidence-backed component mapping.
- Project-owned wrappers take precedence over direct library primitives.
- When several libraries are available, the most frequently used library with an active project theme takes precedence.
- The selected library's primitives take precedence over page-local custom controls.
- High-frequency and complex components remain library-backed even when their default styles differ from the design.
- Theme extension or reset is the final visual fallback; a hand-written lookalike is not.
- Missing capabilities become reusable shared components, not one-off page implementations.
- Theme and token mechanisms handle systematic visual differences.
- The conversion preserves component behavior beyond the static design state.
