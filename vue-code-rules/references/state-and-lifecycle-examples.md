# State and Lifecycle Examples

## Mandatory Rules

1. Keep state in the narrowest owner that coordinates every consumer. Use `ref` for one value, DOM node, component instance, or third-party instance; use `reactive` for a cohesive local record whose fields change together; use `computed` for values derived entirely from existing reactive sources. Use an owner-scoped context only for one complex component subtree, and use the established application store only when independent owners or routes need the same state.
2. Use `watch` or `watchEffect` for a side effect caused by reactive change, not to copy a value that can remain derived. A watcher that requests data, synchronizes an external player, or recalculates a canvas after a dimension change is valid; a watcher that only assigns `a + b` into another ref must become a computed value.
3. Start initialization only when its dependencies exist. Work that requires rendered dimensions, template refs, or a third-party container starts at or after mount. Work that depends only on route, store, or plain input may be invoked explicitly by the owner without waiting for mount.
4. The layer that creates a listener, observer, timer, interval, dynamic Vue mount, media object, abort controller, or third-party instance owns its cleanup. Prefer APIs whose cleanup follows the current Vue scope; otherwise release the resource through `onScopeDispose` or `onBeforeUnmount` and cover partially initialized failure paths.

## Scenario 1: Choose the Narrowest State Owner

Situation: a page owns a selected identifier, one cohesive filter form, a derived active-filter flag, and a user profile shared by unrelated routes.

**Positive example:**

Use a state form that matches each responsibility:

```ts
const selectedCandidateId = ref('')
const filters = reactive<{ keyword: string; roleCode: number | null }>({
  keyword: '',
  roleCode: null
})
const hasActiveFilters = computed(() => {
  return Boolean(filters.keyword || filters.roleCode)
})
const { user } = storeToRefs(useUserStore())
```

The selected identifier and filters remain page-owned. The derived flag has no writable mirror. The user profile belongs in the store only because independent routes consume one application-wide identity.

**Negative example:**

Do not place all four concerns into a global store merely to avoid passing or injecting state:

```ts
const pageStore = usePageStore()
pageStore.selectedCandidateId = ''
pageStore.filters = { keyword: '', roleCode: null }
pageStore.hasActiveFilters = false
```

Do not introduce context for a direct parent-child exchange. Props and emits remain the clearer contract until state and actions actually cross several descendant levels.

## Scenario 2: Derive State Instead of Mirroring It

**Positive example:**

```ts
const fullName = computed(() => `${firstName.value} ${lastName.value}`.trim())
```

Use a watcher when the change triggers a real side effect:

```ts
watch(() => canvas.value.ratio, initCanvas)
```

Here `initCanvas` updates size-dependent state after the ratio changes; it is not a second expression of the ratio itself.

**Negative example:**

Do not maintain the same derived name through a writable mirror:

```ts
const fullName = ref('')
watch([firstName, lastName], () => {
  fullName.value = `${firstName.value} ${lastName.value}`.trim()
})
```

Mirrored watchers create synchronization order and stale-state risks without adding a side effect boundary.

## Scenario 3: Initialize after the Required Dependency Exists

**Positive example:**

When a renderer needs its mounted container, initialize it in the lifecycle and keep the instance with the owner:

```ts
const containerRef = ref<HTMLDivElement>()
const renderer = ref<Renderer | null>(null)

onMounted(async () => {
  if (!containerRef.value) return
  renderer.value = await createRenderer(containerRef.value)
})

onBeforeUnmount(() => {
  renderer.value?.destroy()
})
```

When initialization uses only route data, the owner may invoke a focused initialization function directly and await it where completion matters.

**Negative example:**

Do not read a template ref during setup before Vue has mounted it:

```ts
const containerRef = ref<HTMLDivElement>()
const renderer = createRenderer(containerRef.value!)
```

Do not defer every request to `onMounted` mechanically when no DOM or mounted child dependency exists; lifecycle timing should follow the real dependency.

## Scenario 4: Clean Up at the Creation Boundary

**Positive example:**

```ts
const { stop: stopResize } = useResizeObserver(containerRef, initCanvas)
const controller = new AbortController()

onScopeDispose(() => {
  stopResize()
  controller.abort()
})
```

For manual DOM listeners or dynamic mounts, remove the exact listener, render `null`, and remove the created container from the same owner that registered or appended it.

**Negative example:**

Do not create a module-level listener or SDK instance whose lifecycle outlives every component instance:

```ts
window.addEventListener('resize', initCanvas)
const renderer = createRenderer()
```

Module-level mutable resources can leak across route visits, tests, hot reloads, or server-rendered requests. Use module scope only for immutable configuration or an explicitly application-global resource with its own shutdown contract.

## Review Checklist

- Each state value has the narrowest owner that coordinates all consumers.
- Derived state uses `computed`; watchers own actual side effects.
- DOM- or instance-dependent initialization starts only after the dependency exists.
- Every created resource has symmetric cleanup, including partially initialized failure paths.
- Context remains subtree-scoped and store state remains genuinely application-wide.
