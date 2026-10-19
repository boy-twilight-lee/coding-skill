# 代码质量示例

> 本文件仅翻译 `ts-code-rules/references/code-quality-examples.md`，代码示例与英文 reference 保持一致。

1. 修改限定在请求及直接相关清理，不顺手重排、改名或重写无关代码。
2. 一次性简单逻辑保持内联；真实复杂度、复用或职责边界才抽象。
3. 删除本次修改拥有的无用导入、变量、类型、调试代码、过时注释和透传包装器。
4. 每个运行时变量、常量和函数都用紧邻的中文注释说明业务用途、职责、副作用或返回含义；导入、参数和纯类型声明除外。
5. 内部只注释关键业务、非显然转换、重要分支、副作用和错误处理。
6. 不为注释而制造包装器、中间变量或重复守卫；一次性连续回调留在注册处。
7. 空行只分隔真实逻辑区域，禁止连续、首尾、块边缘及注释与声明之间空行。

## 场景 1：保持修改范围

只修改缺陷及其直接影响的导入、注释、测试和类型，不夹带改名、重排或整文件清理。

**正例：**

```ts
// 判断候选人同步任务是否仍允许重试。
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

**反例：**

```ts
// 判断候选人同步任务是否仍允许重试，并返回包装结果。
export const evaluateCandidateSyncRetry = (retryCount: number) => {
  return { allowed: retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT }
}
```

## 场景 2：避免一次性抽象

清晰的一次性转换留在调用处；只有复用、复杂度、独立测试或明确职责边界才提取。

**正例：**

```ts
// 保存提交接口需要的候选人姓名。
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

**反例：**

```ts
// 返回去除空格后的候选人姓名。
const getCandidateName = (name: string) => {
  return name.trim()
}
```

```ts
await saveCandidate({ ...form, name: getCandidateName(form.name) })
```

## 场景 3：只删除本次修改拥有的死代码

删除本次修改造成的无用内容，不把局部任务扩展成全文件清理。

**正例：**

```ts
import { saveCandidate } from '@/apis'

// 保存当前候选人的提交参数。
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

**反例：**

```ts
import { debugCandidate, saveCandidate } from '@/apis'

// 转发候选人保存请求。
const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
// 保存当前候选人的提交参数。
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
await submitCandidateRequest(candidatePayload)
```

## 场景 4：为运行时声明添加注释

运行时声明使用紧邻的中文业务注释；导入、参数和纯类型声明不需要变量注释。

**正例：**

```ts
// 保存当前编辑的候选人标识。
const candidateId = route.params.id
// 标识候选人详情是否正在加载。
let loading = false
// 读取提交结果中的候选人信息。
const { candidate, updatedAt } = result
```

```ts
export class CandidateDraftService {
  // 保存当前草稿所属的候选人标识。
  private readonly candidateId: string
  // 标识当前草稿是否正在提交。
  private submitting = false

  // 创建指定候选人的草稿服务。
  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  // 提交当前候选人的草稿内容。
  public async submit(payload: CandidateDraftPayload) {
    this.submitting = true
    try {
      await saveCandidateDraft(this.candidateId, payload)
    } finally {
      this.submitting = false
    }
  }
}
```

**反例：**

```ts
// 定义 candidateId。
const candidateId = route.params.id
```

## 场景 5：为函数和回调添加注释

函数和回调用相邻注释说明职责；简短且只有一个注册点的回调可以保持内联。

**正例：**

```ts
// 提交候选人数据并返回保存后的详情。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

// 保留拥有有效联系方式的候选人。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 提供当前可以联系的候选人列表。
const contactableCandidates = candidates.filter(hasValidContact)

// 处理候选人卡片的选择事件。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

```ts
// 按候选人标识建立详情索引。
const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]))
```

**反例：**

```ts
// 定义 submitCandidate。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}
```

## 场景 6：内部注释只解释重要逻辑

内部注释只说明非显然转换、重要分支、副作用和错误处理，不逐句解说。

**正例：**

```ts
// 保存候选人并向调用方保留服务端校验错误。
const submitCandidate = async () => {
  try {
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // 将字段错误标准化后交给表单层展示。
    normalizeFieldErrors(error)
    throw error
  }
}
```

**反例：**

```ts
// 保存候选人并向调用方保留服务端校验错误。
const submitCandidate = async () => {
  try {
    // 构建候选人参数。
    const payload = buildCandidatePayload(form)
    // 调用候选人保存接口。
    return await saveCandidate(payload)
  } catch (error) {
    // 调用字段错误标准化函数。
    normalizeFieldErrors(error)
    // 抛出错误。
    throw error
  }
}
```

## 场景 7：用空行分隔逻辑区域

空行只分隔真实逻辑区域，不能隔开注释与声明或紧密相关语句。

**正例：**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

// 保存当前候选人筛选条件。
const filters = ref(createDefaultFilters())
// 标识是否存在已应用的筛选条件。
const hasActiveFilters = computed(() => hasFilters(filters.value))

// 使用当前筛选条件刷新候选人列表。
const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

**反例：**

```ts
// 保存当前候选人筛选条件。

const filters = ref(createDefaultFilters())

// 使用当前筛选条件刷新候选人列表。
const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

## 场景 8：删除冗余包装器、中间变量和守卫

不要为命名或注释而保留透传包装器、一次性中间值或调用契约已保证的守卫。

**正例：**

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

**反例：**

```ts
// 判断当前查询字段是否要求短信验证码验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// ❌ 仅转发另一个判断，没有独立职责。
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

## 场景 9：保持一次性回调流程连续

只服务一个注册点且延续同一流程的回调放在注册位置；仅在独立职责、复用、测试或明显可读性收益时提取。

**正例：**

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

**反例：**

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

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
