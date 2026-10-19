# 复杂组件 Context 示例

> 本文件仅翻译 `vue-code-rules/references/complex-component-context-examples.md`，代码示例与英文 reference 保持一致。

1. 每个 `use**Context` 只返回 `provide()` 和 `inject()`，位于拥有者 `hooks/` 并使用业务限定 key。
2. 状态、computed、ref、watch、副作用和动作都在 `provide()` 内创建；同一 context 对象既提供又返回。
3. `inject()` 的回退对象字段与提供对象完全一致，使用安全空 ref 和正确类型空操作，不用部分断言掩盖差异。
4. 拥有者调用一次 provide，后代 inject；不能多后代重复 provide，也不能当全局状态。

## 场景 1：实现完整 Context 门面

`use**Context` 只返回 `provide()` 与 `inject()`；状态在 provide 内创建，公开同一个 context 对象。

**正例：**

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

**反例：**

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

## 场景 2：在拥有者和后代中使用门面

拥有者调用一次 provide，后代调用 inject，双方共享同一 API 和实例。

**正例：**

```ts
// 创建工作台所属组件及后代共享的状态。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

```ts
// 读取所属工作台提供的共享状态。
const { page, loading, initPage } = useWorkbenchContext().inject()
```

**反例：**

```ts
// ❌ 后代重新创建了工作台上下文，导致子树状态分叉。
const { page, loading, initPage } = useWorkbenchContext().provide()
```

## 场景 3：Provider 状态不得放在模块作用域

Context 响应式状态不能成为模块单例，以免不同组件实例相互污染。

**正例：**

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

**反例：**

```ts
const page = ref<Page>(createDefaultPage())

export const useWorkbenchContext = () => {
  return { page }
}
```

## 场景 4：保持回退对象形状完全一致

inject 回退对象与提供对象字段完全一致，使用安全空 ref 和正确类型的空操作函数。

不要用部分断言掩盖同一个回退对象缺少字段的问题：

**正例：**

```ts
return vueInject(WORKBENCH_CONTEXT_KEY, {
  page: ref<Page>(createDefaultPage()),
  loading: ref(false),
  // 在所属组件子树外提供安全的空初始化方法。
  initPage: async () => {}
})
```

**反例：**

```ts
return vueInject(WORKBENCH_CONTEXT_KEY, {} as WorkbenchContext)
```

## 场景 5：遵守所有权边界

Context 只服务拥有者的复杂子树，不能由多个后代重复 provide，也不能替代全局状态。

**正例：**

```text
workbench/index.vue                       calls provide()
workbench/component/result-table.vue      calls inject()
```

**反例：**

```text
pages/candidate-list/index.vue            calls useWorkbenchContext().inject()
pages/report-center/index.vue              calls useWorkbenchContext().inject()
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
