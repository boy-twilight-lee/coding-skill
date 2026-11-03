# Provide/Inject Context Pattern

Owns Vue Core Rule 11.

For JavaScript composables, apply the same factory, facade, state ownership, and missing-provider behavior without TypeScript-only syntax. This does not activate unrelated TypeScript rules.

## Mandatory Rules

1. Use an owner-scoped `use**Context()` facade that returns exactly `provide()` and `inject()`. Keep its private factory, inferred type, module-level key, and facade together in the owning page or component's `hooks/` directory.
2. Put business initialization and the complete returned context object in a private `create**Context` function. Create context-owned refs, computed values, watchers, lifecycle registrations, actions, and side effects only when the factory runs during `provide()`. Do not initialize shared reactive state at module scope or run the factory during injection.
3. Infer the public context type with `ReturnType<typeof create**Context>`. Type the module-level, business-qualified symbol as `InjectionKey<ContextType>`. Do not maintain a duplicate interface for the factory's returned fields, infer the context through the facade, or use an assertion to conceal missing fields or a missing provider. Domain input types remain explicitly typed where needed.
4. Inside `provide()`, call the factory once, pass that exact object to Vue's `provide`, and return it. Each owning component calls the facade's `provide()` once during setup. Descendants call only `inject()` during setup and must not create another provider for the same context.
5. Inside `inject()`, call Vue's `inject` with only the typed key. Do not pass a default object, default factory, empty refs, or no-op actions. Throw a descriptive error if the context is missing, then return the narrowed context. Do not replace that check with a non-null assertion or a type assertion.

The business fields below illustrate the agreed workbench implementation; they are not required in other contexts. Replace the business names and fields with the actual owner's contract while preserving the factory, inferred type, typed key, facade, shared object identity, and missing-provider behavior. This factory boundary keeps type inference independent of the facade without moving initialization out of the provider's setup execution.

## Complete Workbench Template

The explicit Vue imports assume auto-import coverage cannot be verified. Follow `vue-code-rules`' active Vite auto-import checks before omitting covered imports. The business composables, domain types, modal, message hook, and existing `ElMessage` binding come from the owning application; this skill repository does not supply those application dependencies.

```ts
import {
    InjectionKey,
    inject as vueInject,
    provide as vueProvide,
    ref,
    shallowRef
} from 'vue'
import {
    StudentPanelActionKey,
    StudentPanelKey,
    WorkbenchTabKey
} from '../type'
import { DiscussionStatus, useDiscussion } from './useDiscussion'
import { MESSAGE_TYPE, postMessage } from '@/hooks'
import { useFullscreen } from './useFullscreen'
import { usePageData } from './usePageData'
import { useDigitalHuman } from './use-digital-human'
import { useWorkbenchViewConfig } from './useWorkbenchViewConfig'
import CxModal from '@/components/cx-modal/index'

const createInteractiveWorkbenchContext = () => {
    const activeTab = ref<WorkbenchTabKey>('script')
    const autoPlay = ref(true)
    const speed = ref(1)
    const volume = ref(85)
    const questionContent = ref('')
    const activeStudentPanel = shallowRef<StudentPanelKey>('')
    const pageData = usePageData({
        initCallback() {
            digitalHuman.init()
            if (
                view_config.value.notify_parent_loaded &&
                window.parent !== window
            ) {
                postMessage(MESSAGE_TYPE.loaded)
            }
        }
    })
    const {
        shareToken,
        courseId,
        courseVersion,
        loadNormalCourse,
        pageList,
        activePage,
        activePageId,
        activeScene,
        courseName,
        cover,
        activePageIndex,
        sceneMap,
        courseData,
        loading
    } = pageData
    const view_config = useWorkbenchViewConfig({
        share_token: shareToken
    })
    const digitalHuman = useDigitalHuman({
        canSelectCharacter: () => view_config.value.show_digital_human
    })
    const discussion = useDiscussion({
        courseId,
        activePageId,
        shareToken,
        playbackRate: speed,
        volume,
        digitalHumanEnabled: digitalHuman.enabled,
        digitalHumanController: digitalHuman.discussionController
    })
    const { isFullscreen, isFullscreenLeaving, toggleFullscreen } =
        useFullscreen()

    const changeActivePage = async (pageIndex: number) => {
        if (pageIndex === activePageIndex.value) {
            return false
        }
        if (discussion.discussionStatus.value === DiscussionStatus.ENDING) {
            ElMessage.warning('讨论正在结束，请稍后切换页面')
            return false
        }
        if (!discussion.isInDiscussion.value) {
            activePageIndex.value = pageIndex
            return true
        }
        try {
            await new Promise<void>((resolve, reject) => {
                CxModal.open({
                    title: '确认结束',
                    content: '讨论过程中切换页面将会结束，确定吗？',
                    onOk: async () => {
                        try {
                            await discussion.endCurrentDiscussion()
                            resolve()
                        } catch (error) {
                            // 结束失败时通知外层切页流程，避免一直等待确认结果。
                            reject(error)
                        }
                    },
                    onCancel: () => {
                        reject(false)
                    },
                    onClose: () => {
                        reject(false)
                    }
                })
            })
            activePageIndex.value = pageIndex
            return true
        } catch {
            // 取消、关闭或结束讨论失败时，保留当前页面。
            return false
        }
    }
    const toggleStudentPanel = (panel: StudentPanelActionKey) => {
        activeStudentPanel.value =
            activeStudentPanel.value === panel ? '' : panel
    }
    const closeStudentPanel = () => {
        activeStudentPanel.value = ''
    }

    return {
        pageList,
        sceneMap,
        activePageIndex,
        changeActivePage,
        activePageId,
        activePage,
        activeScene,
        activeTab,
        isInDisCussion: discussion.isInDiscussion,
        isFullscreen,
        isFullscreenLeaving,
        toggleFullscreen,
        speed,
        volume,
        questionContent,
        activeStudentPanel,
        toggleStudentPanel,
        closeStudentPanel,
        autoPlay,
        courseName,
        courseId,
        courseVersion,
        loadNormalCourse,
        cover,
        shareToken,
        discussion,
        courseData,
        loading,
        view_config,
        digitalHuman
    }
}

export type InteractiveWorkbenchContext = ReturnType<
    typeof createInteractiveWorkbenchContext
>

const interactiveWorkbenchKey: InjectionKey<InteractiveWorkbenchContext> =
    Symbol('interactive-workbench')

export const useInteractiveWorkbenchContext = () => {
    return {
        provide() {
            const context = createInteractiveWorkbenchContext()
            vueProvide(interactiveWorkbenchKey, context)
            return context
        },
        inject() {
            const context = vueInject(interactiveWorkbenchKey)
            if (!context) {
                throw new Error(
                    'InteractiveWorkbenchContext is not provided'
                )
            }
            return context
        }
    }
}
```

The `usePageData` initialization callback in this business example must run after the dependent `digitalHuman` and `view_config` bindings have initialized, as required by the supplied application code. Verify the actual composable contract when adapting it; a synchronous initialization callback needs its dependency order corrected in the application.

Example code omits routine business comments to focus on the context pattern. Actual project code still follows [Business Comments](../../ts-code-rules/references/business-comments.md), and imports follow [Imports](../../ts-code-rules/references/imports.md), including the smallest exception when active tooling requires type-only imports.

## Owner and Descendant Usage

Owning component, called once during setup:

```ts
const { activeTab, discussion, changeActivePage } =
    useInteractiveWorkbenchContext().provide()
```

Descendant component, called during setup:

```ts
const { activeTab, discussion, changeActivePage } =
    useInteractiveWorkbenchContext().inject()
```

The owner and descendants receive the same context object and reactive instances. Adding or removing a factory return field automatically updates the inferred context type and the typed injection API. The inject return type excludes `undefined` because the missing-provider branch throws.

## Review Checklist

- The owner-private factory creates state only when called by `provide()` during setup.
- The exported facade returns exactly `provide()` and `inject()`.
- The context type comes directly from `ReturnType<typeof create**Context>` without a duplicate interface or facade type cycle.
- The module-level business-qualified key is typed with `InjectionKey<ContextType>`.
- The provided object and owner return value are the same instance.
- Injection has no default argument, fallback object, default factory, no-op actions, or unsafe assertions.
- A missing provider raises a descriptive error; successful injection returns the narrowed context type.
- One owner provides once; descendants inject without recreating state.
- Business initialization order and existing public field names are preserved or adapted to verified application contracts.
