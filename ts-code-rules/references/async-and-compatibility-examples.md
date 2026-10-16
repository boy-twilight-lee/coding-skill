# Async and Compatibility Examples

## Scenario 1: Await and Handle an API Call

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

Avoid `.then()` chains for ordinary sequential logic:

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

Use `try/catch` when the current layer handles, enriches, reports, or translates the error. If the caller owns error handling, awaiting and allowing rejection to propagate may be sufficient.

## Scenario 2: Avoid Discarding a Promise

Do not silence a promise with unary `void`:

```ts
void saveCandidate(payload)
```

Await it when completion or failure matters:

```ts
await saveCandidate(payload)
```

For an intentional fire-and-forget contract, make the boundary explicit and handle rejection inside the called operation:

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

Fire-and-forget is justified only when the caller intentionally does not depend on completion and the operation owns its failure path.

## Scenario 3: Check API Support Against the Configured Baseline

Before using an API outside the repository's already verified baseline:

1. Read the repository's TypeScript target, Browserslist, runtime version, and polyfill setup.
2. Confirm native support in every target environment.
3. Prefer an established project helper or approved polyfill when support is incomplete.
4. Verify behavior in the oldest supported target.

Do not assume transpilation adds runtime APIs. Syntax transformation and API polyfilling are separate concerns.

When `Array.prototype.at` is not supported by the actual targets, use the approved compatible form:

```ts
// 读取候选人列表中的最后一项。
const lastCandidate = candidates[candidates.length - 1]
```

The fallback is illustrative; actual support decisions must come from the repository's target matrix.

## Scenario 4: Format Only Changed Files

Run the configured Prettier command only for TypeScript, TSX, or Vue files changed by the task. Do not format an entire directory when unrelated user changes may exist.

After formatting, manually re-check rules Prettier cannot enforce:

- Change scope and absence of drive-by cleanup.
- Required declaration and function comments.
- Meaningful blank lines.
- Import grouping and source-layer ownership.
- Awaited promises and intentional error paths.
- Target-runtime API support.

Formatter success does not prove architectural or compatibility compliance.

## Review Checklist

- Ordinary asynchronous flow uses `await`.
- Errors are handled at the layer that owns recovery, reporting, or translation.
- No promise is discarded with unary `void`; an intentional fire-and-forget boundary owns its rejection path.
- Fire-and-forget operations own their rejection path.
- Newer APIs match actual runtime targets or approved polyfills.
- Only changed files are formatted and then manually reviewed.
