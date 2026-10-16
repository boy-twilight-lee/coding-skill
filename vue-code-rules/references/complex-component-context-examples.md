# Complex Component Context Examples

Use this pattern only inside one owning complex component subtree.

## Scenario 1: Implement the Complete Context Facade

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

// 创建工作台页面的安全默认状态。
const createDefaultPage = (): Page => {
  return { loading: false, pageNumber: 1 }
}
// 标识工作台所属组件子树中的上下文。
const WORKBENCH_CONTEXT_KEY: InjectionKey<WorkbenchContext> = Symbol('workbench-context')

// 暴露工作台上下文的提供与注入能力。
export const useWorkbenchContext = () => {
  return {
    // 创建并提供共享的工作台状态。
    provide() {
      // 保存当前工作台页面状态。
      const page = ref<Page>(createDefaultPage())
      // 标识当前页面是否正在加载。
      const loading = computed(() => page.value.loading)
      // 初始化所属组件的页面状态。
      const initPage = async () => {
        page.value.loading = true
        try {
          await loadWorkbenchPage(page.value.pageNumber)
        } finally {
          page.value.loading = false
        }
      }
      // 定义所属组件与后代组件共享的公开上下文。
      const context: WorkbenchContext = { page, loading, initPage }
      vueProvide(WORKBENCH_CONTEXT_KEY, context)
      return context
    },
    // 读取共享状态，并在所属子树外提供完整安全的默认值。
    inject() {
      return vueInject(WORKBENCH_CONTEXT_KEY, {
        page: ref<Page>(createDefaultPage()),
        loading: ref(false),
        // 在所属组件子树外提供安全的空初始化方法。
        initPage: async () => {}
      })
    }
  }
}
```

The facade returns exactly `provide()` and `inject()`. All owned reactive instances and actions are created inside `provide()`. The exact `context` object passed to Vue is also returned to the owner.

## Scenario 2: Use the Facade in Owner and Descendant

Owning component:

```ts
// 创建工作台所属组件及后代共享的状态。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

Descendant component:

```ts
// 读取所属工作台提供的共享状态。
const { page, loading, initPage } = useWorkbenchContext().inject()
```

Call `provide()` once in the owning component. Descendants call only `inject()`. A descendant must not create a second provider because that silently forks state for its subtree.

## Scenario 3: Keep Provider State out of Module Scope

Incorrect singleton pattern:

```ts
const page = ref<Page>(createDefaultPage())

export const useWorkbenchContext = () => {
  return { page }
}
```

Module-level reactive state is shared across every owner instance and can leak between routes, tests, or server-rendered requests. Context-owned state belongs inside `provide()` so each owner gets isolated instances.

## Scenario 4: Keep the Fallback Shape Exact

If the provided context exposes `page`, `loading`, and `initPage`, the fallback must expose those same three fields with compatible types. Do not omit a field, add an inject-only field, return `undefined`, or conceal mismatch through partial casting.

Incorrect:

```ts
return vueInject(WORKBENCH_CONTEXT_KEY, {} as WorkbenchContext)
```

Safe empty refs and no-op functions let isolated descendant tests and defensive rendering work without unsafe access, while the typed context contract prevents provider/fallback drift.

## Scenario 5: Respect the Ownership Boundary

Use context for one page or complex component subtree. Use Pinia or the repository's established global state solution for application-wide state shared across routes. Do not turn a `use**Context` facade into a hidden global store.

## Review Checklist

- The facade returns exactly `provide()` and `inject()`.
- The key is module-level, business-qualified, and typed.
- All owned state, computed values, refs, watchers, effects, and actions start inside `provide()`.
- The provided object and owner return value are the same instance.
- The fallback has exactly the public context fields with safe compatible values.
- One owner provides once; descendants inject.
- The context never escapes its intended component subtree.
