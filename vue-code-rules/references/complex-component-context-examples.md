# Complex Component Context Examples

## Mandatory Rules

1. Implement every composable named `use**Context` as a context facade that returns exactly two methods: `provide()` for the owning component and `inject()` for descendants. Keep it in the owning page or component's `hooks/` directory, and define a module-level, business-qualified context key.

2. Create all context-owned reactive state, computed values, template refs, watchers, side effects, and actions inside `provide()`. Assemble the public values into one `context` object, pass that exact object to Vue's `provide`, and return it so the owner and descendants share the same API and instances. Do not implement `use**Context` as a module-level reactive singleton or as unrelated standalone provider and injector functions.

3. Implement `inject()` with Vue's `inject` and a complete fallback object. The fallback must have exactly the same public fields as the provided `context`, with safe empty refs and no-op functions of the correct types; never omit a provided field, add an inject-only field, or use unsafe partial casting to conceal a mismatch.

4. Use the context only across the owning complex component subtree: call `use**Context().provide()` once in the owning component and `use**Context().inject()` in descendants. Do not call `provide()` in multiple descendants, and do not use this pattern as application-global state.

Use this pattern only inside one owning complex component subtree.

## Scenario 1: Implement the Complete Context Facade

The explicit Vue imports in this example assume the active Vite auto-import configuration does not cover them. After verifying the configuration, omit covered runtime imports; keep uncovered runtime APIs and required types imported according to the TypeScript import rules and the configuration's actual type coverage.

**Positive example:**

```ts
import { computed, inject as vueInject, provide as vueProvide, ref } from 'vue'
import { InjectionKey, Ref } from 'vue'
import { loadWorkbenchPage } from '@/apis'

interface Page {
  loading: boolean
  pageNumber: number
}

interface WorkbenchContext {
  page: Ref<Page>
  loading: Readonly<Ref<boolean>>
  initPage: () => Promise<void>
}

// Creates a safe default state for the workbench page.
const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
// Identifies the context for the workbench component subtree.
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

// Exposes the workbench context provider and injector.
export const useWorkbenchContext = () => {
  return {
    // Creates and provides the shared workbench state.
    provide() {
      // Stores the current workbench page state.
      const page = ref<Page>(createDefaultPage())
      // Indicates whether the current page is loading.
      const loading = computed(() => page.value.loading)
      // Initializes the page state for the owning component.
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      // Defines the public context shared by the owner and its descendants.
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    // Reads shared state and provides complete safe defaults outside the owning subtree.
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
        // Provides a safe no-op initializer outside the owning component subtree.
        initPage: async () => {}
      })
    }
  }
}
```

The facade returns exactly `provide()` and `inject()`. All owned reactive instances and actions are created inside `provide()`. The exact `context` object passed to Vue is also returned to the owner.

**Negative example:**

Do not expose unrelated methods or return a different object from the one provided:

```ts
export const useWorkbenchContext = () => {
  return {
    provide() {
      const context = createWorkbenchContext()
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return { ...context }
    },
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY)
    },
    reset() {}
  }
}
```

## Scenario 2: Use the Facade in Owner and Descendant

**Positive example:**

Owning component:

```ts
// Creates the state shared by the workbench owner and its descendants.
const { page, loading, initPage } = useWorkbenchContext().provide()
```

Descendant component:

```ts
// Reads the shared state provided by the owning workbench.
const { page, loading, initPage } = useWorkbenchContext().inject()
```

Call `provide()` once in the owning component. Descendants call only `inject()`. A descendant must not create a second provider because that silently forks state for its subtree.

**Negative example:**

Do not call `provide()` again in that same descendant:

```ts
// ❌ The descendant recreates the workbench context and forks the subtree state.
const { page, loading, initPage } = useWorkbenchContext().provide()
```

## Scenario 3: Keep Provider State out of Module Scope

**Positive example:**

Create the same page ref inside `provide()` so every owner instance receives isolated state:

```ts
provide() {
  const page = ref<Page>(createDefaultPage())
  const loading = computed(() => page.value.loading)
  const initPage = async () => {
    await loadWorkbenchPage(page.value.pageNumber)
  }
  const context: WorkbenchContext = { page, loading, initPage }
  vueProvide(WORKBENCH_CONTEXT_KEY, context)
  return context
}
```

**Negative example:**

Do not use the original singleton pattern:

```ts
const page = ref<Page>(createDefaultPage())

export const useWorkbenchContext = () => {
  return { page }
}
```

Module-level reactive state is shared across every owner instance and can leak between routes, tests, or server-rendered requests. Context-owned state belongs inside `provide()` so each owner gets isolated instances.

## Scenario 4: Keep the Fallback Shape Exact

If the provided context exposes `page`, `loading`, and `initPage`, the fallback must expose those same three fields with compatible types. Do not omit a field, add an inject-only field, return `undefined`, or conceal mismatch through partial casting.

**Positive example:**

```ts
return vueInject(WORKBENCH_CONTEXT_KEY, {
  page: ref<Page>(createDefaultPage()),
  loading: ref(false),
  // Provides a safe no-op initializer outside the owning component subtree.
  initPage: async () => {}
})
```

**Negative example:**

```ts
return vueInject(WORKBENCH_CONTEXT_KEY, {} as WorkbenchContext)
```

Safe empty refs and no-op functions let isolated descendant tests and defensive rendering work without unsafe access, while the typed context contract prevents provider/fallback drift.

## Scenario 5: Respect the Ownership Boundary

**Positive example:**

Use context only inside the owning workbench subtree:

```text
workbench/index.vue                       calls provide()
workbench/component/result-table.vue      calls inject()
```

**Negative example:**

Do not import the same context as hidden application-global state across unrelated routes:

```text
pages/candidate-list/index.vue            calls useWorkbenchContext().inject()
pages/report-center/index.vue              calls useWorkbenchContext().inject()
```

Use Pinia or the repository's established global state solution for application-wide state shared across routes.

## Review Checklist

- The facade returns exactly `provide()` and `inject()`.
- The key is module-level, business-qualified, and typed.
- All owned state, computed values, refs, watchers, effects, and actions start inside `provide()`.
- The provided object and owner return value are the same instance.
- The fallback has exactly the public context fields with safe compatible values.
- One owner provides once; descendants inject.
- The context never escapes its intended component subtree.
