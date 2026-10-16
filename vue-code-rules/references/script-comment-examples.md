# Script Comment Examples

## Scenario 1: Comment Variables by Business Meaning

```ts
// 保存当前编辑的候选人标识。
const candidateId = ref('')
// 标识候选人详情是否正在加载。
const loading = ref(false)
// 提供当前候选人的完整展示名称。
const candidateDisplayName = computed(() => formatCandidateName(candidate.value))
```

Avoid comments that merely repeat syntax or identifiers:

```ts
// 定义 candidateId。
const candidateId = ref('')
```

Destructured bindings also require one immediately preceding comment describing the group or business meaning:

```ts
// 读取候选人详情页所需的路由参数。
const { candidateId, source } = route.query
```

Imports, parameters, interfaces, and type aliases do not need declaration comments solely because they appear in the script.

## Scenario 2: Comment Functions and Handlers

```ts
// 提交候选人表单并在成功后返回列表页。
const submitCandidate = async () => {
  await saveCandidate(form.value)
  await router.push({ name: 'candidate-list' })
}

// 处理候选人卡片的选择事件。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

The comment should state responsibility, side effect, or return meaning. Do not write generic comments such as “处理点击” when the business outcome is known.

## Scenario 3: Extract a Callback That Needs Explanation

Prefer a named callback when the predicate or operation has an independent responsibility, genuine reuse, or focused testing value:

```ts
// 保留拥有有效联系方式的候选人。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 提供可以联系的候选人列表。
const contactableCandidates = computed(() => candidates.value.filter(hasValidContact))
```

An inline callback is sufficiently documented when an immediately adjacent comment above its containing declaration, API call, watcher, lifecycle call, or object property unambiguously describes its responsibility. Do not insert a second comment inside the expression solely to document the callback:

```ts
// 按候选人标识建立详情索引。
const candidateMap = new Map(candidates.value.map((candidate) => [candidate.id, candidate]))
```

## Scenario 4: Comment Watchers and Lifecycle Hooks

```ts
// 在筛选条件变化后重新加载候选人列表。
watch(filters, async () => {
  await loadCandidates()
})

// 在页面挂载后初始化候选人数据。
onMounted(async () => {
  await loadCandidates()
})
```

The required comment belongs immediately above the watcher or lifecycle call. Extract its callback only when the logic has an independent responsibility, genuine reuse, focused testing value, or a concrete readability benefit beyond shortening the watcher. Keep one-use watcher behavior inline even when it performs several related state updates.

## Scenario 5: Comment Only Important Internal Logic

```ts
// 提交候选人表单并处理服务端校验失败。
const submitCandidate = async () => {
  try {
    await saveCandidate(form.value)
  } catch (error) {
    // 将服务端字段错误同步回表单控件。
    applyServerErrors(error)
    throw error
  }
}
```

Do not comment every assignment, return, or obvious API call. Declaration comments remain mandatory even when the function body is simple; internal comments are reserved for non-obvious business decisions, transformations, side effects, and error handling.

## Scenario 6: Do Not Comment Vue Compiler Macros

Do not add declaration comments above Vue compiler macros, even when their results are assigned to variables or destructured:

```ts
// ❌ 接收组件属性。
const props = defineProps<{ phone: string }>()
// ❌ 声明组件事件。
const emit = defineEmits<{ change: [phone: string] }>()
// ❌ 设置组件默认选项。
defineOptions({ inheritAttrs: false })
```

Write the macro declarations directly:

```ts
const props = defineProps<{ phone: string }>()
const emit = defineEmits<{ change: [phone: string] }>()
defineOptions({ inheritAttrs: false })
```

The macro name and its type arguments already state the declaration role. Document non-obvious business meaning in the relevant prop or event type when necessary, not with a generic comment attached to the macro.

## Scenario 7: Remove Redundant Wrappers, Intermediates, and Guards

Comments must not preserve structure that has no independent responsibility:

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ 仅转发另一个判断，没有新增语义或行为。
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// 在手机号变化时清除原短信准入签名。
watch(phone, (currentPhone, previousPhone) => {
  // ❌ 一次性中间变量没有增加业务含义。
  const hasChanged = currentPhone !== previousPhone
  // ❌ watch 已保证基础值变化时才调用，重复判断没有保护作用。
  if (!hasChanged) return
  resetVerification()
})
```

Use the real predicate directly and trust a verified framework contract:

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// 在手机号变化时清除原短信准入签名。
watch(phone, () => {
  resetVerification()
})
```

Keep an intermediate variable when it communicates a distinct business concept, is reused, enables type narrowing, or materially improves a complex expression. Keep a guard when the framework or API can actually deliver the guarded state; verify the contract before removing it.

## Scenario 8: Keep One-Use Callback Workflows Together

Do not extract a callback merely because its body is long when it has one registration site and only continues the containing operation. The separated handlers below force the reader to jump between declarations, and `verifyCurrentCode` repeats a length condition already guaranteed by its only caller:

```ts
// ❌ 校验函数重复检查唯一调用方已经保证的验证码长度。
const verifyCurrentCode = async () => {
  if (
    status.value === 'verifying' ||
    code.value.length !== PHONE_VERIFICATION_CODE_LENGTH ||
    phone.value !== sentPhone.value
  ) {
    return
  }
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// 接收验证码输入并在达到完整位数后立即校验。
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// ❌ 该回调只服务于 handleRequestCode，却被拆到远处。
const handleCaptchaVerified = async (validate: string) => {
  status.value = 'sending'
  await sendPhoneVerificationCode({ phone: phone.value, validate })
  status.value = 'sent'
  startCountdown()
}
// 打开图形验证码并请求发送短信验证码。
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({ onOk: handleCaptchaVerified })
}
// ❌ 该重置函数只作为这一个 watcher 的回调。
const resetVerification = () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
}
// 在手机号变化时作废原短信验证状态。
watch(phone, resetVerification)
```

Keep each one-use callback beside its registration site, and validate a precondition only once along the private call path:

```ts
// 校验用户输入的短信验证码并保存查询准入签名。
const verifyCurrentCode = async () => {
  if (status.value === 'verifying' || phone.value !== sentPhone.value) return
  await verifyPhoneVerificationCode({ phone: phone.value, code: code.value })
}
// 接收验证码输入并在达到完整位数后立即校验。
const handleCodeInput = async (value: string | number) => {
  code.value = String(value).slice(0, PHONE_VERIFICATION_CODE_LENGTH)
  if (code.value.length === PHONE_VERIFICATION_CODE_LENGTH) {
    await verifyCurrentCode()
  }
}
// 打开图形验证码并在通过后请求发送短信验证码。
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({
    // 图形验证码通过后继续完成短信发送流程。
    onOk: async (validate: string) => {
      status.value = 'sending'
      await sendPhoneVerificationCode({ phone: phone.value, validate })
      status.value = 'sent'
      startCountdown()
    }
  })
}
// 在手机号变化时就地清理关联的验证码及准入状态。
watch(phone, () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
})
```

Extract a callback when another caller reuses it, it represents an independently named business operation, it needs focused tests, or keeping it inline creates deeper and less readable control flow. Do not extract it solely to shorten the parent function or to attach another declaration comment.

## Review Checklist

- Every declared runtime variable or constant has an adjacent Chinese business comment.
- Every function, callback, watcher, and lifecycle hook has an adjacent responsibility comment.
- Comments explain purpose or effect rather than syntax.
- Vue compiler macros have no declaration comments above them.
- Callbacks are extracted only for reuse, independent responsibility, focused testing, or a concrete readability benefit.
- Internal comments appear only at important, non-obvious logic.
- No comment is used to justify a pass-through wrapper, meaningless intermediate variable, or redundant guard.
- One-use callbacks that merely continue their owner workflow remain at the registration site, and private call paths do not repeat caller-guaranteed preconditions.
