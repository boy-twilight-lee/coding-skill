# Provide/Inject Context Pattern

## Mandatory Rules

1. Every scenario involving Vue `provide` or `inject` must use this fixed pattern, regardless of subtree depth or the number of shared values. Implement an owner-scoped composable named `use**Context` as a context facade that returns exactly two methods: `provide()` for the owning component and `inject()` for descendants. Keep it in the owning page or component's `hooks/` directory, and define a module-level, business-qualified context key.

2. Create all context-owned reactive state, computed values, template refs, watchers, side effects, and actions inside `provide()`. Assemble the public values into one `context` object, pass that exact object to Vue's `provide`, and return it so the owner and descendants share the same API and instances. Do not implement `use**Context` as a module-level reactive singleton or as unrelated standalone provider and injector functions.

3. Implement `inject()` with Vue's `inject` and a complete fallback object. The fallback must have exactly the same public fields as the provided `context`, with safe empty refs and no-op functions of the correct types; never omit a provided field, add an inject-only field, or use unsafe partial casting to conceal a mismatch.

4. Call `use**Context().provide()` once per owning component instance and `use**Context().inject()` in descendants. The owner may be a direct parent, a page, or the application root; each scenario uses the same fixed pattern. Descendants consuming that context must not recreate its provider.

The complete example below is the fixed implementation pattern for every Vue provide/inject scenario, not one of several optional approaches. Keep its facade, state-creation location, exact context object, typed key, and complete fallback structure; replace the workbench business names, fields, and actions with the actual contract. A direct parent-child provide/inject exchange follows the same pattern.

## Fixed Implementation Example

The explicit Vue imports in this example assume the active Vite auto-import configuration does not cover them. After verifying the configuration, omit covered runtime imports; keep uncovered runtime APIs and required types imported according to the TypeScript import rules and the configuration's actual type coverage.

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

// <zh: create a safe default state for the workbench page.>
const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
// <zh: identify the context for the workbench component subtree.>
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

// <zh: expose the workbench context provider and injector.>
export const useWorkbenchContext = () => {
  return {
    // <zh: create and provide the shared workbench state.>
    provide() {
      // <zh: store the current workbench page state.>
      const page = ref<Page>(createDefaultPage())
      // <zh: indicate whether the current page is loading.>
      const loading = computed(() => page.value.loading)
      // <zh: initialize the page state for the owning component.>
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      // <zh: define the public context shared by the owner and its descendants.>
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    // <zh: read shared state and provide complete safe defaults outside the owning subtree.>
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
        // <zh: provide a safe no-op initializer outside the owning component subtree.>
        initPage: async () => {}
      })
    }
  }
}
```

The facade returns exactly `provide()` and `inject()`. All owned reactive instances and actions are created inside `provide()`. The exact `context` object passed to Vue is also returned to the owner.

## Owner and Descendant Usage

Owning component:

```ts
// <zh: create the state shared by the workbench owner and its descendants.>
const { page, loading, initPage } = useWorkbenchContext().provide()
```

Descendant component:

```ts
// <zh: read the shared state provided by the owning workbench.>
const { page, loading, initPage } = useWorkbenchContext().inject()
```

Call `provide()` once in the owning component. Descendants call only `inject()`. A descendant must not create a second provider because that silently forks state for its subtree.

## Review Checklist

- Every Vue provide/inject scenario follows the complete fixed implementation and usage example.
- The facade returns exactly `provide()` and `inject()`.
- The key is module-level, business-qualified, and typed.
- All owned state, computed values, refs, watchers, effects, and actions start inside `provide()`.
- The provided object and owner return value are the same instance.
- The fallback has exactly the public context fields with safe compatible values.
- One owner provides once; descendants inject.
- The context never escapes its intended component subtree.
