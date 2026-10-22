# ts-code-rules 完整审阅报告

审阅日期：2026-10-22（Asia/Shanghai）。

本报告参照 reports 中 CSS 完整审阅报告的结构，整理当前工作区 ts-code-rules 的全部 16 条核心规则及 16 个独立 reference。正文按现行编号排列，每条下方直接展示中文要求、完整示例、正反写法和适用边界，便于按编号逐条审阅。

报告以本仓库的 SKILL.md、references 和展示元数据为来源。示例标题、解释与注释均使用中文，源文件中的中文注释占位内容已展开为实际中文；标识符、导入路径及必要技术术语保留原样。源文件没有正反代码对照的条款，使用职责表说明或明确标为“补充对照”的示例帮助审阅，不据此增加规则。局部片段依赖其所在模块的类型、状态及接口，不能视为可直接运行的完整应用。

## 一、适用范围与执行要求

### 1. 适用范围

适用于 TypeScript、TSX，以及 Vue 单文件组件中 TypeScript 脚本的编写、修改、重构、审查、调试与补全。Vue 单文件组件中的 TypeScript 还需应用 vue-code-rules；同一修改涉及 style 块时，同时应用 css-code-rules。本报告聚焦 TypeScript 规则，不替代其他技能的要求。

### 2. 修改范围与优先级

这些是强制要求。只处理本次新增、修改、审查涉及的代码及必要的直接关联修复，不为统一风格迁移无关旧代码。旧代码仅提供上下文，不能成为复制违规写法的理由。

高优先级指令优先；仓库配置或惯例仅在规则明确授权由配置决定时覆盖相应要求。无法满足某条规则时，采用最小必要偏离，并说明具体冲突，不能静默略过。

### 3. 修改前的检查

阅读仓库指令，查看受影响模块、公共调用方、邻近类型，以及实际生效的 tsconfig、包脚本、lint、formatter 和测试配置。涉及兼容性时，确认真实运行时与浏览器目标。

入口文件不是全部规则。先按受影响问题匹配所有相关条款，再完整读取对应 reference；每个适用任务至少读取一个，没有精确匹配时读取“修改范围”，不确定时读取。分组标题只用于查找，不要求连带读取组内无关文件。引用中的要求同样具有约束力。

### 4. 修改后的检查

逐行对照适用核心规则及 reference 检查清单，运行能覆盖改动的最小必要定向格式化、类型检查、lint 或相关测试。不使用会改写无关文件的命令。

保留任务外公共契约和行为，保护用户已有编辑。无法满足的规则、未运行或失败的检查应明确报告；编译或格式化通过不能代替注释、分层、异步语义与兼容性审查。

### 5. 条款索引

- [TS 1：修改范围与已有内容保护](#ts-1)
- [TS 2：抽象边界与本次改动产生的冗余清理](#ts-2)
- [TS 3：中文业务注释与契约说明](#ts-3)
- [TS 4：只在真实逻辑边界保留空行](#ts-4)
- [TS 5：导入分组与排列顺序](#ts-5)
- [TS 6：依据工具配置选择类型导入语法](#ts-6)
- [TS 7：跨模块别名与公共入口](#ts-7)
- [TS 8：应用源码分层与最近所有者](#ts-8)
- [TS 9：顺序异步流程优先使用 await](#ts-9)
- [TS 10：根据依赖关系选择串行或并行](#ts-10)
- [TS 11：错误处理归属](#ts-11)
- [TS 12：后台异步操作必须拥有失败处理](#ts-12)
- [TS 13：加载状态生命周期与关联状态提交](#ts-13)
- [TS 14：直接读取捕获错误的 message](#ts-14)
- [TS 15：运行时 API 兼容性](#ts-15)
- [TS 16：定向格式化与最终差异检查](#ts-16)

## 二、按顺序审阅 16 条规则

<a id="ts-1"></a>

### TS 1：修改范围与已有内容保护

**独立 reference：** [change-scope.md](/D:/desktop/coding-skill/ts-code-rules/references/change-scope.md)

改动仅限请求的功能或缺陷。保留现有注释，不顺手格式化、重命名、重排导入或重写无关代码。只清理与本次修改直接相关的内容；原注释因本次改动变得不准确或过时，才应同步修正或删除。

#### 场景 1：只修复重试次数边界

场景：服务中的候选人同步重试判断存在边界缺陷，周围另有命名或格式问题。本次需求仅修复“达到最大次数时仍允许重试”的判断。

**正例：**

保留名称与布尔返回契约，仅修正对应条件：

```ts
// 判断候选人同步任务是否仍处于允许重试的次数范围。
export const canRetryCandidateSync = (retryCount: number) => {
  return retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT
}
```

可同步修改直接受影响的导入、注释、测试与类型。整文件格式化产生范围外变化时，依据格式化前内容恢复，保留用户已有编辑。

**反例：**

不要在同一次边界修复中附带重命名，并把布尔返回值改成对象：

```ts
// 判断候选人同步任务是否可重试，并用对象包装判断结果。
export const evaluateCandidateSyncRetry = (retryCount: number) => {
  return { allowed: retryCount <= MAX_CANDIDATE_SYNC_RETRY_COUNT }
}
```

无关的日志重写、邻近函数抽象或导入重排会扩大回归范围，掩盖缺陷修复本身。

**审阅检查：** 差异是否只包含所请求行为及直接关联修改；是否保留未失效的注释和用户已有编辑。

<a id="ts-2"></a>

### TS 2：抽象边界与本次改动产生的冗余清理

**独立 reference：** [abstraction-and-cleanup.md](/D:/desktop/coding-skill/ts-code-rules/references/abstraction-and-cleanup.md)

简单且只使用一次的逻辑保持内联。只有真实复杂度、复用或明确责任边界，才提取函数、类或 composable；独立测试价值、具体可读性收益也应有真实依据，不能只为了缩短原函数。

移除本次改动造成的未使用导入、变量、函数、类型、临时调试、过时注释、冗余别名和透传包装。禁止仅为命名或添加注释而增加没有独立职责的函数、一次性回调包装、中间变量及重复保护条件。

#### 场景 1：一次性的简单转换留在调用位置

**正例：**

```ts
// 使用去除首尾空白的姓名构建候选人提交数据。
const candidateName = form.name.trim()
await saveCandidate({ ...form, name: candidateName })
```

这里的变量用于表达提交姓名的业务含义，不是只改名转发另一个值。

**反例：**

不要只为一次 trim 创建没有独立职责的包装：

```ts
// 返回去除首尾空白的候选人姓名。
const getCandidateName = (name: string) => {
  return name.trim()
}
```

```ts
await saveCandidate({ ...form, name: getCandidateName(form.name) })
```

有真实复用、复杂转换或独立责任时，提取才有意义；不能把“一次使用”当成一概禁止提取的条件。

#### 场景 2：清理本次改动遗留的调试和透传包装

**正例：**

```ts
import { saveCandidate } from '@/apis'

// 当前候选人的提交载荷，由表单转换后交给保存接口。
const candidatePayload = buildCandidatePayload(form)
await saveCandidate(candidatePayload)
```

**反例：**

新实现已经不需要调试依赖，却仍保留日志和同义转发：

```ts
import { debugCandidate, saveCandidate } from '@/apis'

// 仅转发候选人保存请求，没有独立业务职责。
const submitCandidateRequest = (payload: CandidatePayload) => {
  return saveCandidate(payload)
}
// 当前候选人的提交载荷，由表单转换后交给保存接口。
const candidatePayload = buildCandidatePayload(form)
console.log(debugCandidate(candidatePayload))
await submitCandidateRequest(candidatePayload)
```

清理范围跟随本次改动的所有权。任务没有包含旧代码清理时，不因看到历史疑似死代码就扩大删除范围；删除还应有项目工具及调用关系依据。

#### 场景 3：删除无职责包装与已由调用契约保证的判断

场景：已有监听契约确认回调只在手机号值改变时触发，当前流程需要清除上次短信访问签名。

**正例：**

```ts
// 判断当前搜索字段是否启用了手机号短信验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

// 手机号变化后清除上次短信访问签名，避免沿用旧号码的验证结果。
watch(phone, () => {
  resetVerification()
})
```

**反例：**

```ts
// 判断当前搜索字段是否启用了手机号短信验证。
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
// 此函数仅转发已有判断，没有增加独立职责。
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

// 手机号变化后清除上次短信访问签名。
watch(phone, (currentPhone, previousPhone) => {
  // 该一次性变量没有增加业务含义或类型收窄价值。
  const hasChanged = currentPhone !== previousPhone
  // 已确认的监听契约保证值发生变化，重复判断没有增加保护。
  if (!hasChanged) return
  resetVerification()
})
```

中间变量若表达业务概念、被复用、参与类型收窄或明显改善复杂表达式可读性，可以保留。调用方、框架或接口确实可能传入受保护状态时，保护条件仍有必要；必须核实契约后再删除，不能把本例推广为删除所有监听判断。

**审阅检查：** 抽象是否具有真实职责；冗余是否属于本次改动；删除判断是否有调用契约依据；是否仅为加注释而制造结构。

<a id="ts-3"></a>

### TS 3：中文业务注释与契约说明

**独立 reference：** [business-comments.md](/D:/desktop/coding-skill/ts-code-rules/references/business-comments.md)

中文注释是正常业务文档，不仅用于难懂代码。清晰英文命名和简单语法不能免除业务声明与关键处理阶段的说明。注释应紧邻对象，简洁准确，基于代码和已确认契约，不编造产品原因。

| 覆盖对象 | 必须说明的内容 |
| --- | --- |
| 主要业务状态、响应式记录、ref、computed、持久类字段 | 控制什么、作用范围或来源，以及相关单位、默认值、复位时机、依赖 |
| 配置、阈值、映射和其他决定模块行为的值 | 业务用途与适用范围，必要的单位或取值约定 |
| 业务函数、方法、composable、事件处理器 | 业务动作、结果或受影响状态；相关参数含义、返回约定、顺序、副作用与错误归属 |
| 有业务意义的回调注册 | 注册行为与业务作用；一次性回调保持内联，在注册位置说明 |
| 函数内关键阶段与重要分支 | 校验、提前退出、载荷转换、请求顺序、合并与提交、交互边界、回退/重试/去重、副作用、恢复与清理的规则 |
| 领域 interface、类型别名、enum、导出契约 | 领域职责；重要成员的单位、来源、允许状态、可选/null 含义与消费约定 |

同一职责的一小组相邻声明可共用一条注释。单阶段函数不重复解释同一含义。导入、临时解构、循环变量、机械 map/filter 回调、明显访问器和简单语言级工具无需逐句解说；机械工具类型、生成或第三方声明，以及含义明确的普通 id/name 字段无需重复标签。只有项目明确要求或外部术语确有需要时，才使用其他语言。

#### 场景 1：说明状态职责、单位和领域契约

**正例：**

即使名称已清楚，也说明状态在当前业务中的作用：

```ts
// 当前详情页的候选人标识，用于关联加载和保存操作。
const candidateId = route.params.id
// 详情加载状态，控制页面的加载反馈。
let loading = false
```

```ts
// 将接口返回的秒级时间戳转换为 Date 所需的毫秒值。
const updatedAt = new Date(result.updatedAt * 1000)
```

类型本身及重要成员也需要业务说明：

```ts
/** 候选人列表查询条件，供列表请求与分页共同使用。 */
interface CandidateQuery {
  keyword: string
  /** 从 1 开始的页码，与服务端分页约定保持一致。 */
  pageNumber: number
  /** null 表示不限制职位。 */
  roleCode: number | null
}
/** 草稿保存状态，区分未保存修改、保存中和已同步。 */
type DraftStatus = 'dirty' | 'saving' | 'synced'
```

类、持久业务字段与服务方法遵循相同覆盖要求：

```ts
/** 管理指定候选人的草稿保存流程及提交状态。 */
export class CandidateDraftService {
  // 当前服务实例绑定的候选人，保存操作始终使用此标识。
  private readonly candidateId: string
  // 草稿请求是否仍在处理中，在请求结束后恢复。
  private submitting = false

  public constructor(candidateId: string) {
    this.candidateId = candidateId
  }

  /** 保存当前候选人的草稿；请求失败时由调用方处理错误。 */
  public async submit(payload: CandidateDraftPayload) {
    this.submitting = true
    try {
      await saveCandidateDraft(this.candidateId, payload)
    } finally {
      // 无论成功或失败都结束处理中状态，允许再次保存。
      this.submitting = false
    }
  }
}
```

**反例：**

不要只把变量名称翻译成中文：

```ts
// 候选人标识。
const candidateId = route.params.id
// 是否正在加载。
let loading = false
```

这些标签没有说明状态归属与用途。公共参数契约适合放在函数文档中，字段约定放在字段旁，不在每个使用点重复相同解释。

#### 场景 2：业务函数、事件入口与回调注册

**正例：**

短函数和领域判断同样需要职责说明：

```ts
// 将表单转换为候选人保存载荷，并把保存结果交给调用方。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}

// 手机或邮箱任一存在即纳入可联系名单，不要求两者同时填写。
const hasValidContact = (candidate: Candidate) => {
  return Boolean(candidate.mobile || candidate.email)
}
// 当前列表中满足联系渠道要求的候选人，供后续联系操作使用。
const contactableCandidates = candidates.filter(hasValidContact)

// 记录用户选择的候选人，供当前页面后续操作使用。
const handleCandidateSelect = (candidateId: string) => {
  selectedCandidateId.value = candidateId
}
```

在业务回调的注册位置说明用途，不为注释单独拆出一次性回调：

```ts
// 导航完成后尽力上报候选人页面曝光，上报失败不阻塞导航流程。
router.afterEach(() => {
  reportCandidateExposure().catch(reportTelemetryError)
})
```

上述 submitCandidate 负责载荷构建与结果返回，不属于只转发同名调用的无职责包装。需要公共契约说明时采用 JSDoc，但不重复 TypeScript 已表达的参数类型。

**反例：**

```ts
// 提交候选人数据。
const submitCandidate = async (): Promise<Candidate> => {
  return await saveCandidate(buildCandidatePayload(form))
}
```

这条注释只重复函数名，没有说明载荷责任和结果契约。应完善说明，不能反过来用“名称清楚”免除业务文档。

一次性回调即使包含若干相关分支与副作用，只要仍是所属流程的连续部分，就保留在注册位置。提取应有独立职责、真实复用、测试价值或具体可读性收益。

#### 场景 3：函数职责不能代替关键内部阶段说明

**正例：**

```ts
// 保存候选人，并将服务端校验错误交给调用方继续处理。
const submitCandidate = async () => {
  try {
    // 将表单转换为接口载荷，保存成功后返回服务端结果。
    return await saveCandidate(buildCandidatePayload(form))
  } catch (error) {
    // 将字段错误整理为表单层可展示的结构，再继续传播失败。
    normalizeFieldErrors(error)
    throw error
  }
}
```

多阶段流程分别说明校验、请求、状态提交与清理：

```ts
// 保存当前候选人并更新页面详情；失败时保留原详情供用户重试。
const saveCurrentCandidate = async () => {
  // 仅通过表单校验的数据可以进入保存流程。
  if (!(await formRef.value.validate())) return
  // 标记本次保存开始，供提交按钮展示处理中状态。
  saving.value = true
  try {
    // 使用表单构建接口载荷，等待服务端确认保存结果。
    const candidate = await saveCandidate(buildCandidatePayload(form))
    // 以服务端返回数据更新详情，保证页面展示已保存的内容。
    detail.value = candidate
  } catch (error) {
    // 在当前页面反馈保存失败，保留表单内容供修正或重试。
    Message.error(error.message)
  } finally {
    // 成功或失败都结束提交状态，允许用户继续操作。
    saving.value = false
  }
}
```

语法简单但包含业务不变量时，说明该规则：

```ts
// 指针跨越拖动锚点时保持锚点不变，避免选中范围发生跳变。
if (nextValue < anchorValue) {
  range.value = [nextValue, anchorValue]
} else {
  range.value = [anchorValue, nextValue]
}
```

比较和赋值容易理解，锚点约束仍需业务说明。函数其他位置的兼容性注释不能替代这一规则。

**反例：**

不要逐句翻译语法并制造无意义中间值：

```ts
// 保存候选人，并将服务端校验错误交给调用方继续处理。
const submitCandidate = async () => {
  try {
    // 构建候选人载荷。
    const payload = buildCandidatePayload(form)
    // 调用候选人保存接口。
    return await saveCandidate(payload)
  } catch (error) {
    // 调用字段错误整理函数。
    normalizeFieldErrors(error)
    // 抛出错误。
    throw error
  }
}
```

**审阅检查：** 业务声明、领域契约与关键阶段是否覆盖；是否避免纯名称翻译、逐句解说及无依据的产品原因；注释是否紧邻代码并随改动保持准确。

<a id="ts-4"></a>

### TS 4：只在真实逻辑边界保留空行

**独立 reference：** [blank-lines.md](/D:/desktop/coding-skill/ts-code-rules/references/blank-lines.md)

空行只有在确实分开不同逻辑区域时才允许，每个边界最多一行。禁止连续空行、文件开头或结尾空行、代码块首尾空行、注释与说明对象之间空行，以及紧密相关的导入、声明、语句、对象成员、JSX 节点和类型成员之间的空行。正常文件末尾换行不等同于空白行。

#### 场景 1：分开导入、筛选状态与业务操作

**正例：**

```ts
import { computed, ref } from 'vue'
import { loadCandidates } from '@/apis'

// 当前列表查询条件及其是否生效的派生状态，供筛选区使用。
const filters = ref(createDefaultFilters())
const hasActiveFilters = computed(() => hasFilters(filters.value))

// 使用当前筛选条件刷新候选人列表。
const refreshCandidates = async () => {
  await loadCandidates(filters.value)
}
```

紧密相关的筛选条件与派生值连续书写；状态与业务操作之间通过一行空行区分逻辑区域。

**反例：**

```ts
// 保留服务端默认值，使重置操作恢复原始查询约定。

const filters = ref(createDefaultFilters())

const refreshCandidates = async () => {

  await loadCandidates(filters.value)

}
```

注释与声明被分开，函数块边缘也出现空行，这些空行没有逻辑分隔价值。

**审阅检查：** 每一行空行是否对应真实逻辑边界；是否存在块边缘、注释分离或紧密成员之间的无意义空行。

<a id="ts-5"></a>

### TS 5：导入分组与排列顺序

**独立 reference：** [import-order.md](/D:/desktop/coding-skill/ts-code-rules/references/import-order.md)

按以下顺序排列导入：第三方运行时依赖、类型依赖、内部运行时模块、UI 或组件模块。类型组内部先放模块本地类型，再放共享类型。即使类型使用普通 import，仍按其实际职责归入类型组。

#### 场景 1：同时导入运行时能力、本地类型、共享类型和组件

**正例：**

工具链确认能够安全擦除仅类型用途时：

```ts
import { ref } from 'vue'
import { CandidatePayload } from './type'
import { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

使用独立 import type 时同样保持此顺序；具体语法由 TS 6 决定。分组不意味着必须在每组间插入空行，仍需遵循 TS 4。不要为统一顺序改写未受影响导入。

**补充对照——反例：**

```ts
import CandidateCard from '@/components/candidate-card'
import { loadCandidates } from '@/apis'
import { CandidateQuery } from '@/type'
import { CandidatePayload } from './type'
import { ref } from 'vue'
```

此处组件在前、第三方依赖在后，本地类型也位于共享类型之后，不符合职责顺序。

**审阅检查：** 四类导入是否按序排列；类型组内是否本地在前、共享在后；是否避免顺手调整无关导入。

<a id="ts-6"></a>

### TS 6：依据工具配置选择类型导入语法

**独立 reference：** [type-imports.md](/D:/desktop/coding-skill/ts-code-rules/references/type-imports.md)

编译器与打包器能够安全擦除仅类型用途时，优先普通 import。只有实际生效的编译、lint、打包或包运行时契约要求时，才使用独立 import type。禁止行内 type 修饰符。

先检查有效 tsconfig、lint、打包行为和包运行时契约，不能只看邻近文件就推断。不要为了施加偏好改写未受影响的导入。

#### 场景 1：工具链支持安全擦除

**正例：**

```ts
import { CandidatePayload } from '@/apis'
```

该形式成立的前提是类型导入在当前构建中被安全擦除，不会要求目标包提供运行时同名导出。

#### 场景 2：工具链或运行时契约要求显式类型导入

**正例：**

```ts
import type { CandidatePayload } from '@/apis'
import { loadCandidates } from '@/apis'
```

**反例：**

```ts
import { loadCandidates, type CandidatePayload } from '@/apis'
```

即使工具支持行内修饰符，当前规则仍禁止此写法。类型语法与导入排序分别审查，排序见 TS 5。

**审阅检查：** 普通导入能否安全擦除；独立 import type 是否有配置或契约依据；是否完全没有行内 type 修饰符。

<a id="ts-7"></a>

### TS 7：跨模块别名与公共入口

**独立 reference：** [public-entries.md](/D:/desktop/coding-skill/ts-code-rules/references/public-entries.md)

跨模块引用使用已配置的别名及所属模块的公共入口。不得跨越两层或更多父目录，也不得直接访问另一模块私有文件。公共入口只重导出公开声明，不放业务实现，也不为方便而暴露私有内部内容。

#### 场景 1：页面消费共享组件及其他功能能力

**正例：**

```ts
import { normalizeCandidate } from '@/features/candidate'
import CandidateCard from '@/components/candidate-card'
```

**反例：**

```ts
import CandidateCard from '../../components/candidate-card/index.vue'
import { normalizeCandidate } from '@/features/candidate/private/normalize-candidate'
```

第一条绕过组件入口并跨多层父目录，第二条越过功能私有边界。

同一所有者内部、没有跨越模块边界的相对导入仍允许，例如 TS 5 中的 ./type。规则不要求本地兄弟文件都通过全局聚合入口，也不授权创建不存在的路径别名。

**审阅检查：** 跨模块路径是否走已配置别名和公共入口；是否穿透私有实现；入口是否只有公开重导出；本地相对引用是否仍在同一所有者内。

<a id="ts-8"></a>

### TS 8：应用源码分层与最近所有者

**独立 reference：** [application-architecture.md](/D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md)

按真实职责与仓库既有目录放置源码。以下是所有权地图，不是要求生成全部目录的模板。已有 api/ 与 apis/、pages/ 与 views/ 等命名遵循仓库，不另建平行体系；pages-pc/、components-pc/ 等目标端目录也沿用项目结构。

#### 场景 1：辨认应用层职责

```text
src/
|-- App.vue                应用根组件，由 vue-code-rules 管理
|-- main.ts                应用启动与全局注册
|-- apis/                  后端传输端点与请求契约
|-- assets/                参与构建的静态资源
|-- components/            跨页面复用 UI，由 vue-code-rules 管理
|-- constants/             跨所有者共享的不可变领域值或配置
|-- hooks/                 跨页面 Vue composable，由 vue-code-rules 管理
|-- layout/                页面框架，由 vue-code-rules 管理
|-- pages/（或 views/）    路由级页面单元，由 vue-code-rules 管理
|-- router/                路由记录、守卫与路由组装
|-- services/              外部能力适配或跨模块编排
|-- store/                 应用级状态与 store 模块
|-- styles/                应用全局样式，由 css-code-rules 管理
|-- type/                  环境声明和真正应用级公共契约
`-- utils/                 跨所有权边界复用的无状态工具
```

具体要求：

1. main.ts 仅负责创建应用、全局插件和样式注册、安装路由或 store，以及挂载。功能流程和可复用工具回到实际所有者。
2. 后端 API 模块位于仓库既有 API 源码层。
3. services/ 按仓库已建立的外部能力适配或跨模块编排层使用。
4. 私有常量、类型和无状态工具紧邻页面、组件、功能或服务所有者；只有真实跨所有者复用或应用级契约需要时，才提升到应用公共层。
5. src/type 聚焦已配置的环境声明和真正应用级契约，不收纳已有明确所有者的页面、组件、API、service 或 store 类型。
6. src/utils 保持无状态，按聚焦业务域或技术能力组织。先扩展匹配的已有模块，避免 common.ts 等杂物文件；经既有入口重导出，入口不放实现。
7. 跨路由或独立所有者共用的应用状态才进入 store；组件子树、页面私有和请求局部状态保留在最近所有者。
8. 路由记录、守卫与路由组装位于 router/；路由组件和页面流程位于页面树。

#### 场景 2：何时保持私有，何时提升共享

| 能力 | 留在最近所有者的情况 | 提升或共享的条件 |
| --- | --- | --- |
| 类型或接口 | 由一个页面、组件、API、service 或 store 拥有 | 环境声明或真正应用级契约进入公共类型层；其他情况通过所属模块公共入口公开 |
| 常量 | 表达所有者专属选项、限制、状态映射或配置 | 多个独立所有者共享同一领域含义 |
| 无状态工具 | 只有一个所有者或其子树使用 | 真实消费者跨越所有权边界，且工具具有聚焦领域或技术职责 |
| Vue composable | 协调一个页面或组件子树 | 多个页面或独立组件复用相同 Vue 行为 |
| store 模块 | 状态只属于一个页面或组件子树 | 独立路由或所有者需要同一个应用状态来源 |
| service | 逻辑属于一次 API 调用或单个功能流程 | 存在独立外部能力适配或跨模块编排边界 |

所有者私有目录均可选。有真实内容与职责才创建，公开范围不超过实际消费者需要。Vue 页面与组件遵循 vue-code-rules 的固定所有者结构：仅使用 component/、hooks/、constants/、type/、规定的样式形式和必需组件入口。

Vue 所有者内聚的私有功能工具放在 hooks/ 下职责聚焦的工具 hook 中，不新增组件私有 utils/、helpers/ 或根目录零散工具文件。真正共享的无状态函数进入项目既有 utils 层；其他类型所有者沿用已有私有布局。

#### 场景 3：按职责进行正反判断

本条源文件以目录地图和决策表说明归属，不提供必须复制的完整项目结构。

| 情况 | 正确归属 | 应避免的归属 |
| --- | --- | --- |
| 页面独有查询条件类型 | 页面或功能所有者内 | 因为它是类型就全部移到 src/type |
| 一个组件子树使用的状态 | 最近组件所有者 | 为统一管理而直接建立应用级 store |
| 跨模块复用的无状态日期工具 | 既有聚焦工具模块及其公开入口 | 新建 common.ts 收纳不相关实现 |
| 页面提交与展示流程 | 页面或所属功能 | 放进 main.ts 或路由配置 |
| 没有实际内容的私有目录 | 暂不创建 | 按目录图批量生成空目录 |
| Vue 页面或组件内聚的私有功能工具 | hooks/ 下聚焦的工具 hook | 组件私有 utils/、helpers/ 或根目录零散工具文件 |

跨所有者导入路径及入口行为另见 TS 7。目录归属正确并不允许消费私有深层文件。

**审阅检查：** 是否遵循既有源码层；私有能力是否过早全局化；type/utils 是否变成杂物目录；是否创建无内容目录；路由、启动与页面职责是否清楚。

<a id="ts-9"></a>

### TS 9：顺序异步流程优先使用 await

**独立 reference：** [await-flow.md](/D:/desktop/coding-skill/ts-code-rules/references/await-flow.md)

普通顺序异步流程优先 await，不使用 then 链表达本可直接顺序书写的请求和后续处理。是否增加 catch 由错误归属决定，不因使用 await 就自动包裹 try/catch。

#### 场景 1：请求完成后更新详情

**正例：**

```ts
// 加载当前候选人详情，等待请求完成后更新页面状态。
const candidate = await getCandidate(candidateId)
detail.value = candidate
```

**反例：**

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

普通顺序流程用 await；具有明确后台失败处理职责的 catch 用法仍按 TS 11、TS 12 判断，不能由本条推导为禁止所有 Promise 链式方法。

**审阅检查：** 普通顺序流程是否使用 await；新增 catch 是否确有独立错误处理职责。

<a id="ts-10"></a>

### TS 10：根据依赖关系选择串行或并行

**独立 reference：** [parallel-work.md](/D:/desktop/coding-skill/ts-code-rules/references/parallel-work.md)

存在依赖的操作按序等待。只有操作彼此独立、允许同时启动，并且确实需要共同失败边界时，才使用 Promise.all。不能仅为缩短代码就把依赖流程并行化。

#### 场景 1：后一个请求依赖前一个结果

**正例：**

```ts
const profile = await fetchCandidateProfile(candidateId)
const permissions = await fetchCandidatePermissions(profile.roleId)
```

#### 场景 2：两个请求独立，且调用方需要组合成功结果

**正例：**

```ts
const [roles, benefits] = await Promise.all([
  fetchRoles(),
  fetchBenefits()
])
```

**反例：**

```ts
const [profile, permissions] = await Promise.all([
  fetchCandidateProfile(candidateId),
  fetchCandidatePermissions(profile.roleId)
])
```

第二个调用需要 profile.roleId，不能在 profile 尚未取得时与第一个请求一起构建。即使参数已知，只要前一个结果决定后一个操作是否被允许，也应保留依赖顺序。

共同失败边界指组合结果的失败语义，不代表其中一个 Promise 拒绝会自动取消其他已经发出的请求。

**审阅检查：** 所有输入和执行前提是否独立；组合失败是否符合预期；是否误以为 Promise.all 会取消其他操作。

<a id="ts-11"></a>

### TS 11：错误处理归属

**独立 reference：** [error-handling.md](/D:/desktop/coding-skill/ts-code-rules/references/error-handling.md)

只在能够恢复、转换、补充上下文或报告错误的层级使用 try/catch，否则让拒绝向调用方传播。页面可反馈用户可见错误，基础设施边界可转换或补充错误信息。仅捕获再原样抛出、没有增加任何职责的 catch 没有必要。

#### 场景 1：当前层报告失败，后续错误边界继续接管

**正例：**

```ts
// 加载当前候选人详情并更新页面状态，失败时报告后交由页面错误边界处理。
const loadCandidate = async () => {
  try {
    // 将接口返回的候选人详情同步到当前页面。
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    // 记录本次加载失败，再向页面错误边界传播。
    reportCandidateLoadError(error)
    throw error
  }
}
```

“报告后重抛”只有在两项职责确实都属于当前边界时成立。调用方负责全部失败处理时，当前层可以 await 并让错误直接传播。

**补充对照——反例：**

```ts
// 加载候选人详情并更新页面；失败由调用方处理。
const loadCandidate = async () => {
  try {
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    throw error
  }
}
```

该 catch 没有恢复、转换、补充或报告职责，应去掉无意义捕获，保留拒绝传播路径。

**审阅检查：** 每个 catch 是否增加实际处理职责；失败是否到达真正所有者；报告与重抛是否都符合当前边界契约。

<a id="ts-12"></a>

### TS 12：后台异步操作必须拥有失败处理

**独立 reference：** [fire-and-forget.md](/D:/desktop/coding-skill/ts-code-rules/references/fire-and-forget.md)

禁止用一元 void 丢弃 Promise。调用方依赖完成或失败时必须等待；确实属于不阻塞当前流程的后台操作时，被调用操作必须自行处理或明确报告拒绝。

#### 场景 1：保存结果影响后续流程

**正例：**

```ts
await saveCandidate(payload)
```

**反例：**

```ts
void saveCandidate(payload)
```

void 不会处理拒绝；仅去掉 void 也不能自动使未等待的保存操作合理。

#### 场景 2：曝光上报不阻塞当前交互

**正例：**

```ts
// 上报候选人页面曝光，不阻塞当前交互流程。
const reportCandidateExposure = () => {
  // 捕获曝光上报失败，并交给遥测错误通道记录。
  reportExposureRequest().catch((error) => {
    reportTelemetryError(error)
  })
}

reportCandidateExposure()
```

这里的包装具有“非阻塞上报并拥有失败处理”的职责，不属于 TS 2 禁止的单纯透传。成立前提是调用方确实不依赖完成结果，且错误报告路径能承担自身失败语义。

**审阅检查：** 是否存在 void Promise；调用方是否需要等待；后台边界是否明确并拥有拒绝处理，而非把错误静默丢弃。

<a id="ts-13"></a>

### TS 13：加载状态生命周期与关联状态提交

**独立 reference：** [loading-state.md](/D:/desktop/coding-skill/ts-code-rules/references/loading-state.md)

操作所属 loading 在请求开始前设置，并通过 finally 在所有路径恢复。取得所需数据后连续提交关联状态，避免消费者看到意外的半更新结果。真正需要渐进展示时，分次提交应是明确 UI 契约。

#### 场景 1：列表请求同时返回分页信息与记录

**正例：**

```ts
// 加载当前查询对应的候选人列表与分页信息，并在页面反馈请求失败。
const loadCandidatePage = async () => {
  // 请求开始前开启当前页面的加载反馈。
  page.loading = true
  try {
    const { data } = await fetchCandidatePage(query.value)
    // 使用同一次响应连续更新分页信息与记录，不插入异步等待。
    Object.assign(page, {
      total: data.total,
      pageNumber: data.pageNumber
    })
    candidates.value = data.records
  } catch (error) {
    // 由页面负责向用户反馈本次列表加载失败。
    Message.error(error.message)
  } finally {
    // 成功或失败都恢复加载状态。
    page.loading = false
  }
}
```

页面负责用户反馈，并在请求结束后恢复 loading；分页数据来自同一响应，连续提交不插入异步间隔。

**反例：**

```ts
const loadCandidatePage = async () => {
  page.loading = true
  const { data } = await fetchCandidatePage(query.value)
  page.total = data.total
  await nextTick()
  page.pageNumber = data.pageNumber
  candidates.value = data.records
  page.loading = false
}
```

请求拒绝时 loading 不会恢复；在总数与页码更新之间等待 nextTick，会主动暴露不必要的中间状态。

Object.assign 是本例中的连续赋值方式，不代表所有状态系统都具有事务原子性；实际消费者能否观察中间值仍取决于框架和订阅契约。

**审阅检查：** loading 是否在请求前设置并由 finally 恢复；关联状态是否避免非预期异步间隔；渐进提交是否有明确契约。

<a id="ts-14"></a>

### TS 14：直接读取捕获错误的 message

**独立 reference：** [error-message.md](/D:/desktop/coding-skill/ts-code-rules/references/error-message.md)

现行规则将“catch 捕获的 error 保证有 message 属性”作为既定前提，要求直接读取 error.message，不得围绕该属性增加 instanceof Error、typeof 或回退分支。

本条源 reference 只有要求与检查清单。以下为按现行条款补充的对照，便于审阅其实际效果。

#### 场景 1：在负责用户反馈的边界读取错误消息

**补充对照——正例：**

```ts
try {
  await saveCandidate(payload)
} catch (error) {
  // 在当前错误处理边界展示候选人保存失败的消息。
  Message.error(error.message)
}
```

**补充对照——反例：**

```ts
try {
  await saveCandidate(payload)
} catch (error) {
  Message.error(error instanceof Error ? error.message : '保存失败')
}
```

**适用边界：** 这里记录的是技能约定，不是 JavaScript 或 TypeScript 对任意抛出值的普遍保证。启用 useUnknownInCatchVariables 时，直接访问未知类型的 message 还可能产生类型冲突。实际应用若不能满足此条，应按入口要求报告确切契约或编译配置冲突及最小必要偏离；本报告保留现行规则供审阅，没有擅自修订它。

**审阅检查：** 是否直接读取 message；是否添加规则禁止的收窄或回退；既定错误前提与实际配置存在冲突时是否明确报告。

<a id="ts-15"></a>

### TS 15：运行时 API 兼容性

**独立 reference：** [runtime-compatibility.md](/D:/desktop/coding-skill/ts-code-rules/references/runtime-compatibility.md)

新增运行时 API 前，根据实际 TypeScript target、运行时版本、Browserslist 与 polyfill 策略核实支持。超出已验证基线的 API，要么确认全部目标原生支持，要么采用项目认可的工具、回退或 polyfill。转译语法不会自动补齐缺失 API。

#### 场景 1：在旧目标环境中获取最后一项

前提：目标矩阵不支持 Array.prototype.at，项目允许使用索引访问。

**正例：**

```ts
// 读取候选人列表中的最后一项。
const lastCandidate = candidates[candidates.length - 1]
```

选择写法前：

1. 查看真实 TypeScript target、Browserslist、运行时版本及 polyfill 配置。
2. 确认每个目标环境的原生支持。
3. 支持不完整时，优先既有项目工具或认可的回退、polyfill。
4. 在最低受支持目标验证行为。

**反例：**

```ts
// 读取候选人列表中的最后一项。
const lastCandidate = candidates.at(-1)
```

反例只在本场景前提下成立，不表示一律禁止 at。TypeScript 识别方法签名、构建能处理语法，都不能单独证明目标运行时提供该方法。

**审阅检查：** 新 API 是否符合真实目标；缺失支持是否采用认可方案；是否把转译或类型检查误当成 polyfill。

<a id="ts-16"></a>

### TS 16：定向格式化与最终差异检查

**独立 reference：** [formatting.md](/D:/desktop/coding-skill/ts-code-rules/references/formatting.md)

使用仓库已配置的 Prettier，只处理本次修改文件。保存格式化前内容，比较格式化输出，依据该版本恢复任务影响区域以外的纯格式变化，并保留用户已有编辑。新语法必需的格式调整予以保留。

如果整文件检查只因未触及的历史格式失败，应报告限制，不静默扩大改动，也不声称检查通过。最终再次检查差异、适用规则与本地约定。

#### 场景 1：只格式化本次修改的候选人卡片

**正例：**

```text
prettier --write src/components/candidate-card/index.vue
```

这是参考中的示例命令；实际执行沿用仓库配置和脚本。恢复无关变化时，以格式化前内容为依据，不能用 HEAD 覆盖掉用户已有编辑。

格式化后，人工检查工具不能自动保证的要求：

- 修改范围内没有顺手清理无关代码。
- 主要业务声明、函数与关键处理阶段具有职责注释，清晰命名不免除覆盖。
- 空行确实分隔逻辑区域。
- 导入顺序、类型语法、源码分层与公共入口符合要求。
- Promise 等待、后台失败处理、错误归属和 loading 生命周期正确。
- 运行时 API 符合目标支持。

**反例：**

```text
prettier --write src
```

不能将一个组件的格式化任务扩大到整个源码树。格式化成功不证明架构、业务注释、错误语义或兼容性合规。

**审阅检查：** 是否只格式化修改文件；是否恢复无关格式变化并保留已有编辑；历史格式失败是否如实报告；最终差异是否逐条复核。

## 三、审阅时需要区分的边界

- **抽象与注释分别判断。** 注释要求不能为无职责包装提供理由；载荷转换、领域策略、错误归属等真实职责也不能因代码短就被误判为透传。
- **注释覆盖针对受影响代码。** 主要业务声明与阶段需要说明，但不因此给整个历史仓库补注释，也不逐句解释机械语法。
- **导入顺序与类型语法是两条规则。** 类型用途决定分组，实际工具契约决定普通 import 或独立 import type；当前规则一律禁止行内 type 修饰符。
- **目录地图不要求生成空目录。** 私有能力先跟随最近所有者，真实跨所有者复用或应用级契约才决定提升；API 类型也不因属于类型就自动进入 src/type。
- **await 不意味着每处都要 catch。** 顺序书写、失败所有权、后台任务和 loading 是相互配合的独立要求；符合本条不等于其他条款已经满足。
- **并行不代表自动取消或隔离失败。** Promise.all 的使用必须符合依赖和共同失败语义，不能只因请求数量多就并行。
- **关联状态连续提交不等于通用事务。** 不在关联更新之间插入意外异步间隔，同时尊重真实框架订阅与渐进展示契约。
- **错误 message 保证是现行规则前提。** TS 14 与实际错误来源、unknown 配置的契合程度需结合项目审阅，不能把技能假设写成语言事实。
- **兼容回退有条件。** at 示例取决于目标矩阵，不是全面禁用现代 API；类型可用与运行时可用要分别核实。
- **保护已有用户编辑。** 格式化恢复基于格式化前内容，而不是把文件重置到 HEAD；工具通过不能代替逐条人工检查。

## 四、16 条规则与 16 个独立 reference

每条核心规则只对应一个主 reference。按受影响问题选择并完整读取，相关问题可同时命中多个文件；分组标题不要求加载组内所有无关引用。

| 规则 | 独立 reference |
| --- | --- |
| TS 1 | [change-scope.md](/D:/desktop/coding-skill/ts-code-rules/references/change-scope.md) |
| TS 2 | [abstraction-and-cleanup.md](/D:/desktop/coding-skill/ts-code-rules/references/abstraction-and-cleanup.md) |
| TS 3 | [business-comments.md](/D:/desktop/coding-skill/ts-code-rules/references/business-comments.md) |
| TS 4 | [blank-lines.md](/D:/desktop/coding-skill/ts-code-rules/references/blank-lines.md) |
| TS 5 | [import-order.md](/D:/desktop/coding-skill/ts-code-rules/references/import-order.md) |
| TS 6 | [type-imports.md](/D:/desktop/coding-skill/ts-code-rules/references/type-imports.md) |
| TS 7 | [public-entries.md](/D:/desktop/coding-skill/ts-code-rules/references/public-entries.md) |
| TS 8 | [application-architecture.md](/D:/desktop/coding-skill/ts-code-rules/references/application-architecture.md) |
| TS 9 | [await-flow.md](/D:/desktop/coding-skill/ts-code-rules/references/await-flow.md) |
| TS 10 | [parallel-work.md](/D:/desktop/coding-skill/ts-code-rules/references/parallel-work.md) |
| TS 11 | [error-handling.md](/D:/desktop/coding-skill/ts-code-rules/references/error-handling.md) |
| TS 12 | [fire-and-forget.md](/D:/desktop/coding-skill/ts-code-rules/references/fire-and-forget.md) |
| TS 13 | [loading-state.md](/D:/desktop/coding-skill/ts-code-rules/references/loading-state.md) |
| TS 14 | [error-message.md](/D:/desktop/coding-skill/ts-code-rules/references/error-message.md) |
| TS 15 | [runtime-compatibility.md](/D:/desktop/coding-skill/ts-code-rules/references/runtime-compatibility.md) |
| TS 16 | [formatting.md](/D:/desktop/coding-skill/ts-code-rules/references/formatting.md) |

## 五、当前技能展示信息

- 技能名称：ts-code-rules。
- 界面显示名：TypeScript Code Rules。
- 短描述含义：应用强制性的 TypeScript 编码与架构标准。
- 图标：assets/typescript-logo.png；同目录另有 SVG 资源。
- 当前 agents/openai.yaml 仅包含展示信息与图标，没有额外执行流程。

## 六、完整性核对与文件快照

本报告涵盖全部 16 条核心规则、16 个独立 reference 的要求、源示例与检查要点，并提供中文注释和适用边界。源码层地图与归属决策表按中文整理；补充正反例已明确标记。TS 13 的源正例补充了符合 TS 3 的职责与阶段注释，保留其请求、提交与清理流程。

核对范围为 18 个来源文件（SKILL.md、16 个 reference 和 UI 元数据）。本次仅生成审阅文档，未修改技能规则。代码示例未在实际应用中编译运行；当前仓库没有用于这些片段的应用构建、类型检查或运行测试配置。

核对了 45 个源代码围栏块与 49 个报告代码围栏块。除目录树中文说明外，源示例的可执行内容均已按出现次数核对保留；新增对照仅用于展示现有条款，不构成规则修订。

| 文件 | 字节数 | SHA-256 |
| --- | --- | --- |
| ts-code-rules/SKILL.md | 8988 | `1f3c70bf5edad18e8ac6ebc00e1330096f8f25fef7055f78cf049d0599addd22` |
| ts-code-rules/references/change-scope.md | 1970 | `bf1ab396e789b3e8bf37c2f20c2bc04903d94cf3c5234e6a38681ab3ddd26b17` |
| ts-code-rules/references/abstraction-and-cleanup.md | 5436 | `06c22dd4745fe3d78db2b65d46d578bd16aa27c877412a4c5a49a9a250d72c2d` |
| ts-code-rules/references/business-comments.md | 12008 | `392193d5f54d7d21d1e1abedf7085d1cd14b71b597c42fb891c859a40aa9a529` |
| ts-code-rules/references/blank-lines.md | 2047 | `f79b5b6c544919936953274c9b940a31415bbae07a9175c417ef5f8f1d69e3e5` |
| ts-code-rules/references/import-order.md | 1077 | `1e184510a2c3852230fb4d9540129e5d7698bb2a30b107a3600e19d65826e368` |
| ts-code-rules/references/type-imports.md | 1270 | `0c4ee2c9dfeae646580ae4e350a7bf9b6cf0cd27f323c8845d9c17714defa912` |
| ts-code-rules/references/public-entries.md | 1673 | `6dcb26ca338cbddf66f1538de118efef8749731944a83f8adfa957f51957a7a4` |
| ts-code-rules/references/application-architecture.md | 6088 | `0cfac38b72036c137d25c0c9c54f204390d7b8295718fef301cb01a479b2d18d` |
| ts-code-rules/references/await-flow.md | 804 | `907be470fa6ecbd448fac1b54e1b81c26aaefbedbf2371763dfdbc311babc9bc` |
| ts-code-rules/references/parallel-work.md | 1277 | `b68b396a9eea6bf49fb6e4f45d1d3e0c26faaaac1a59cdc9eb29574140f0c7d9` |
| ts-code-rules/references/error-handling.md | 1147 | `691887f49034f2ec6d0b08c711cf439f005e29d63c0e8f2a13b92eb52be07858` |
| ts-code-rules/references/fire-and-forget.md | 1345 | `fb824e654dc13113d9e7b752b3bd02db9eb4b857551de542b838fa83a6fa4a36` |
| ts-code-rules/references/loading-state.md | 1710 | `51a54d422c3425d03bb9df0dbf5ff1f4875b08543831d26e8cf194908b844274` |
| ts-code-rules/references/error-message.md | 471 | `9c7d4ab3080dc52207bcd49a5188ce1ab37dcea1f096b1ee28b46f7002f88b3a` |
| ts-code-rules/references/runtime-compatibility.md | 1729 | `cd867fb68f69b461104e05b43a5eca8e5d1bc8f7dace9ba755e4e4c7572de4c7` |
| ts-code-rules/references/formatting.md | 2491 | `4cc6c90493b60184c35271aa07821468965da41812b268357bba14a943f3cc04` |
| ts-code-rules/agents/openai.yaml | 231 | `02dd358501c1ce66a1a163b10ba502d1d4d1ea571ec72b864846043dc70206fc` |
