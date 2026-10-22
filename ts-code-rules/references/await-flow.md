# Await Sequential Flow

## Mandatory Rule

Prefer `await` to `.then()` for ordinary sequential flow.

## Await an API Call

**Positive example:**

```ts
// 加载当前候选人详情，等待请求完成后更新页面状态。
const candidate = await getCandidate(candidateId)
detail.value = candidate
```

**Negative example:**

Avoid `.then()` chains for ordinary sequential logic:

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

When adding or reviewing a catch boundary, also read [Error Handling Ownership](error-handling.md).

## Review Checklist

- Ordinary sequential asynchronous flow uses `await`.
- Error ownership is evaluated separately using the error-handling reference when adding or changing a catch boundary.
