# ts-code-rules 中文翻译

> 本文件仅供人工阅读。它没有被 `SKILL.md`、`agents/openai.yaml` 或任何 `references` 路由引用，因此不会自动进入 skill 上下文。每组示例紧跟对应规则，所有原始 fenced code 示例均原样保留。

## 适用范围与工作流程

所有新增、修改或审查的 TypeScript/TSX 都应用相关规则。现有代码不能免除规则，但不要为了统一风格迁移未触及代码。开始前检查调用方、类型、`tsconfig`、脚本、Lint、格式化、测试和真实运行目标；修改后运行最小范围检查并报告无法满足的规则。Vue SFC 还要应用 Vue/CSS 对应 skill。

## 代码质量

1. 修改限定在请求及直接相关清理，不顺手重排、改名或重写无关代码。
2. 一次性简单逻辑保持内联；真实复杂度、复用或职责边界才抽象。
3. 删除本次修改拥有的无用导入、变量、类型、调试代码、过时注释和透传包装器。
4. 每个运行时变量、常量和函数都用紧邻的中文注释说明业务用途、职责、副作用或返回含义；导入、参数和纯类型声明除外。
5. 内部只注释关键业务、非显然转换、重要分支、副作用和错误处理。
6. 不为注释而制造包装器、中间变量或重复守卫；一次性连续回调留在注册处。
7. 空行只分隔真实逻辑区域，禁止连续、首尾、块边缘及注释与声明之间空行。

### 对应完整示例：`references/code-quality-examples.md`

#### 场景 1：保持修改范围

只修改缺陷及其直接影响的导入、注释、测试和类型，不夹带改名、重排或整文件清理。

```ts
// 判断候选人同步任务是否仍允许重试。
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

#### 场景 2：避免一次性抽象

清晰的一次性转换留在调用处；只有复用、复杂度、独立测试或明确职责边界才提取。

```ts
// 保存提交接口需要的候选人姓名。
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

```ts
// 返回去除空格后的候选人姓名。
const getCandidateName = (name: string) => {
  return name.trim()
}
```

#### 场景 3：只删除本次修改拥有的死代码

删除本次修改造成的无用内容，不把局部任务扩展成全文件清理。

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

```ts
import { saveCandidate } from '@/apis'

// 保存当前候选人的提交参数。
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

#### 场景 4：为运行时声明添加注释

运行时声明使用紧邻的中文业务注释；导入、参数和纯类型声明不需要变量注释。

```ts
// 保存当前编辑的候选人标识。
const candidateId = route.params.id
// 标识候选人详情是否正在加载。
let loading = false
// 读取提交结果中的候选人信息。
const { candidate, updatedAt } = result
```

```ts
// 定义 candidateId。
const candidateId = route.params.id
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

#### 场景 5：为函数和回调添加注释

函数和回调用相邻注释说明职责；简短且只有一个注册点的回调可以保持内联。

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

#### 场景 6：内部注释只解释重要逻辑

内部注释只说明非显然转换、重要分支、副作用和错误处理，不逐句解说。

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

#### 场景 7：用空行分隔逻辑区域

空行只分隔真实逻辑区域，不能隔开注释与声明或紧密相关语句。

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

#### 场景 8：删除冗余包装器、中间变量和守卫

不要为命名或注释而保留透传包装器、一次性中间值或调用契约已保证的守卫。

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

#### 场景 9：保持一次性回调流程连续

只服务一个注册点且延续同一流程的回调放在注册位置；仅在独立职责、复用、测试或明显可读性收益时提取。

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

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 导入与类型组织

1. 导入顺序为第三方运行时依赖、类型依赖、内部运行时模块，以及适用时的 UI 或组件模块。类型组中先放模块局部类型，再放共享类型。
2. 编译器和打包器能安全擦除纯类型用法时优先普通导入。只有已验证的编译器、Lint、打包器或包运行时契约要求时才使用独立 `import type`，禁止行内 `type` 修饰符。
3. 通过项目配置的别名和公开入口导入其他模块；不要跨越两个以上父目录，也不要访问其他模块的私有文件。
4. 简洁私有类型跟随拥有者；可复用或公开契约放入仓库既有类型模块，环境 `.d.ts` 声明放入项目配置的声明位置。

## 异步与兼容性

1. 普通顺序流程使用 `await`；只在能够恢复、转换、补充或报告错误的层捕获。
2. 不用一元 `void` 丢弃 Promise；fire-and-forget 必须拥有拒绝处理。
3. 所有 `catch` 捕获的 `error` 对象都保证具有 `message` 属性，直接使用 `error.message`；禁止通过 `error instanceof Error`、`typeof` 或 `error instanceof Error ? error.message : '错误'` 之类的兜底分支进行类型判断。
4. 新 API 必须符合真实 target、Browserslist、运行时和 polyfill 策略，转译不提供运行时 API。
5. Prettier 只处理修改文件，恢复范围外格式变化并保留用户修改。

### 对应完整示例：`references/async-and-compatibility-examples.md`

#### 场景 1：等待并处理 API 调用

普通串行异步流程使用 `await`；只有当前层负责恢复、补充、报告或转换错误时才捕获，否则让错误继续传播。

```ts
// 加载候选人详情并同步页面状态。
const loadCandidate = async () => {
  try {
    // 保存接口返回的候选人详情。
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    // 记录加载失败并交由页面错误边界处理。
    reportCandidateLoadError(error)
    throw error
  }
}
```

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

#### 场景 2：不要丢弃 Promise

不得用一元 `void` 静默丢弃 Promise。完成结果重要时等待它；明确的 fire-and-forget 操作必须自行处理拒绝。

```ts
void saveCandidate(payload)
```

```ts
await saveCandidate(payload)
```

```ts
// 上报候选人页面曝光，不阻塞当前交互流程。
const reportCandidateExposure = () => {
  // 捕获曝光上报失败并交给遥测错误通道。
  reportExposureRequest().catch((error) => {
    reportTelemetryError(error)
  })
}

reportCandidateExposure()
```

#### 场景 3：按项目基线检查 API 支持

检查 TypeScript target、Browserslist、运行时版本和 polyfill；转译语法并不会自动提供运行时 API。

```ts
// 读取候选人列表中的最后一项。
const lastCandidate = candidates[candidates.length - 1]
```

#### 场景 4：只格式化修改过的文件

只格式化任务修改的文件，并依据格式化前内容恢复范围外变化；不要从 `HEAD` 覆盖用户已有修改。

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
