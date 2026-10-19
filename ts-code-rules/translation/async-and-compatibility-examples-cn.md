# 异步与兼容性示例

> 本文件仅翻译 `ts-code-rules/references/async-and-compatibility-examples.md`，代码示例与英文 reference 保持一致。

1. 普通顺序流程使用 `await`；只在能够恢复、转换、补充或报告错误的层捕获。
2. 不用一元 `void` 丢弃 Promise；fire-and-forget 必须拥有拒绝处理。
3. 所有 `catch` 捕获的 `error` 对象都保证具有 `message` 属性，直接使用 `error.message`；禁止通过 `error instanceof Error`、`typeof` 或 `error instanceof Error ? error.message : '错误'` 之类的兜底分支进行类型判断。
4. 新 API 必须符合真实 target、Browserslist、运行时和 polyfill 策略，转译不提供运行时 API。
5. Prettier 只处理修改文件，恢复范围外格式变化并保留用户修改。

## 场景 1：等待并处理 API 调用

普通串行异步流程使用 `await`；只有当前层负责恢复、补充、报告或转换错误时才捕获，否则让错误继续传播。

**正例：**

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

**反例：**

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

## 场景 2：不要丢弃 Promise

不得用一元 `void` 静默丢弃 Promise。完成结果重要时等待它；明确的 fire-and-forget 操作必须自行处理拒绝。

**正例：**

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

**反例：**

```ts
void saveCandidate(payload)
```

## 场景 3：按项目基线检查 API 支持

检查 TypeScript target、Browserslist、运行时版本和 polyfill；转译语法并不会自动提供运行时 API。

**正例：**

```ts
// 读取候选人列表中的最后一项。
const lastCandidate = candidates[candidates.length - 1]
```

**反例：**

```ts
// 读取候选人列表中的最后一项。
const lastCandidate = candidates.at(-1)
```

## 场景 4：只格式化修改过的文件

只格式化任务修改的文件，并依据格式化前内容恢复范围外变化；不要从 `HEAD` 覆盖用户已有修改。

**正例：**

```text
prettier --write src/components/candidate-card/index.vue
```

**反例：**

```text
prettier --write src
```

## 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
