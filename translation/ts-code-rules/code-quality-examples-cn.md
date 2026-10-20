# 代码质量示例

> 本文件仅翻译 `ts-code-rules/references/code-quality-examples.md`，规则结构和代码行为与英文 reference 对应，示例注释按中文规则本地化。

1. 修改限定在请求及直接相关清理，不顺手重排、改名或重写无关代码。
2. 一次性简单逻辑保持内联；真实复杂度、复用或职责边界才抽象。
3. 删除本次修改拥有的无用导入、变量、类型、调试代码、过时注释和透传包装器。
4. 仅当命名、类型、签名和上下文不足以表达业务含义、单位、生命周期、不变量、副作用、时序或错误契约时，才为运行时声明或函数添加紧邻的中文注释；自解释代码不机械加注释。
5. 内部注释解释关键业务、非显然转换、重要分支、副作用和错误处理存在的原因，不逐句复述实现。
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

## 场景 4：只为非显然运行时声明添加注释

自解释声明不需要注释；只有命名和类型无法表达的重要单位、来源、不变量或业务契约才添加紧邻注释。导入、参数和纯类型声明不需要声明注释。

**正例：**

```ts
const candidateId = route.params.id
let loading = false
const { candidate, updatedAt } = result
```

```ts
// 接口返回秒级时间戳，Date 需要毫秒。
const updatedAt = new Date(result.updatedAt * 1000)
```

```ts
export class CandidateDraftService {
  private readonly candidateId: string
  private submitting = false

  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  public async submit(payload: CandidateDraftPayload) {
    this.submitting = true
    try {
      await saveCandidateDraft(this.candidateId, payload)
    } finally {
      // 无论保存成功还是失败，都允许用户再次提交。
      this.submitting = false
    }
  }
}
```

**反例：**

```ts
// 保存候选人标识。
const candidateId = route.params.id
// 标识是否正在加载。
let loading = false
```

这些注释没有提供标识符、类型和初始化表达式之外的信息。

## 场景 5：仅在必要时为函数和回调添加注释

名称、签名和上下文已经清楚的函数、谓词、转换和事件处理器不需要注释。只有非显然契约、副作用、时序或错误行为才使用相邻注释；一次性回调保持在注册位置，不能只为添加注释而提取。

**正例：**

```ts
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
const contactableCandidates = candidates.filter(hasValidContact)

const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

```ts
// 曝光上报是尽力而为的后台任务，不能阻塞页面导航。
router.afterEach(() => {
  reportCandidateExposure().catch(reportTelemetryError)
})
```

**反例：**

```ts
// 提交候选人数据。
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

空行只分隔真实逻辑区域；存在必要注释时，不能将它与所说明的声明或语句隔开。

**正例：**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

const filters = ref(createDefaultFilters())
const hasActiveFilters = computed(() => hasFilters(filters.value))

const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

**反例：**

```ts
// 保留服务端默认值，使重置恢复原始查询契约。

const filters = ref(createDefaultFilters())

const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

## 场景 8：删除冗余包装器、中间变量和守卫

不要仅为了制造名称或注释目标而保留透传包装器、一次性中间值或调用契约已保证的守卫。

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

## 复核清单

- 只有无法由命名、类型、签名和上下文表达的业务含义或契约才使用注释。
- 必要注释紧邻目标、保持简洁，并在没有例外时使用中文。
- 内部注释解释原因、约束、副作用和错误路径，不逐句复述实现。
- 不为注释制造冗余抽象、中间变量或守卫。
