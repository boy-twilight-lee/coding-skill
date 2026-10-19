# Async and Compatibility Examples

## Mandatory Rules

1. Prefer `await` to `.then()` for ordinary sequential flow. Use `try/catch` only at the layer that can recover, translate, enrich, or report the error; otherwise let the rejection propagate. Do not discard a Promise with unary `void`. Await it when completion matters; for an intentional fire-and-forget boundary, ensure the operation handles or explicitly reports its own rejection.

2. Every `error` value caught by `catch` is guaranteed to have a `message` property. Read `error.message` directly; do not narrow it with `error instanceof Error`, `typeof`, or fallback branches such as `error instanceof Error ? error.message : 'Error'`.

3. Use APIs supported by the repository's actual TypeScript target, runtime versions, Browserslist, and polyfill strategy. Before introducing an API outside that verified baseline, confirm support in every target environment or use a project-approved fallback or polyfill. Do not assume transpilation supplies runtime APIs.

4. Use the repository's configured Prettier formatter only on files changed for the task. Compare its output with the pre-format state and restore formatting-only changes outside the task's affected regions, preserving pre-existing user edits. Keep formatting adjustments necessary for the changed syntax. If a whole-file formatter check still fails solely on untouched formatting, report that limitation instead of broadening the edit silently. Re-check the final diff against these rules and the established local convention.

## Scenario 1: Await and Handle an API Call

**Positive example:**

```ts
// [Write in Chinese: load candidate details and synchronize the page state.]
const loadCandidate = async () => {
  try {
    // [Write in Chinese: store the candidate details returned by the API.]
    const candidate = await getCandidate(candidateId)
    detail.value = candidate
  } catch (error) {
    // [Write in Chinese: report the load failure and delegate handling to the page error boundary.]
    reportCandidateLoadError(error)
    throw error
  }
}
```

**Negative example:**

Avoid `.then()` chains for ordinary sequential logic:

```ts
getCandidate(candidateId).then((candidate) => {
  detail.value = candidate
})
```

Use `try/catch` when the current layer handles, enriches, reports, or translates the error. If the caller owns error handling, awaiting and allowing rejection to propagate may be sufficient.

## Scenario 2: Avoid Discarding a Promise

**Positive example:**

Await the same save operation when completion or failure matters:

```ts
await saveCandidate(payload)
```

For an intentional fire-and-forget contract, make the boundary explicit and handle rejection inside the called operation:

```ts
// [Write in Chinese: report candidate-page exposure without blocking the current interaction flow.]
const reportCandidateExposure = () => {
  // [Write in Chinese: capture exposure-reporting failures and send them to the telemetry error channel.]
  reportExposureRequest().catch((error) => {
    reportTelemetryError(error)
  })
}

reportCandidateExposure()
```

**Negative example:**

Do not silence that same save promise with unary `void`:

```ts
void saveCandidate(payload)
```

Fire-and-forget is justified only when the caller intentionally does not depend on completion and the operation owns its failure path.

## Scenario 3: Check API Support Against the Configured Baseline

**Positive example:**

Before using an API outside the repository's already verified baseline:

1. Read the repository's TypeScript target, Browserslist, runtime version, and polyfill setup.
2. Confirm native support in every target environment.
3. Prefer an established project helper or approved polyfill when support is incomplete.
4. Verify behavior in the oldest supported target.

Do not assume transpilation adds runtime APIs. Syntax transformation and API polyfilling are separate concerns.

When `Array.prototype.at` is not supported by the actual targets, use the approved compatible form:

```ts
// [Write in Chinese: read the last item in the candidate list.]
const lastCandidate = candidates[candidates.length - 1]
```

**Negative example:**

Do not use the unsupported API for that same last-item lookup:

```ts
// [Write in Chinese: read the last item in the candidate list.]
const lastCandidate = candidates.at(-1)
```

The fallback is illustrative; actual support decisions must come from the repository's target matrix.

## Scenario 4: Format Only Changed Files

**Positive example:**

Run the configured Prettier command only for TypeScript, TSX, or Vue files changed by the task. Do not format an entire directory when unrelated user changes may exist.

```text
prettier --write src/components/candidate-card/index.vue
```

Before formatting, retain the current file content so existing user edits can be distinguished from formatter output. After formatting, restore formatting-only changes outside the task's affected regions from that pre-format content, not from `HEAD`. Keep adjustments needed for the changed syntax. If a whole-file formatter check still fails because of untouched legacy formatting, report that limitation without expanding the edit or claiming the check passed.

After formatting, manually re-check rules Prettier cannot enforce:

- Change scope and absence of drive-by cleanup.
- Required declaration and function comments.
- Meaningful blank lines.
- Import grouping and source-layer ownership.
- Awaited promises and intentional error paths.
- Target-runtime API support.

Formatter success does not prove architectural or compatibility compliance.

**Negative example:**

Do not broaden that same formatting task to the entire source tree:

```text
prettier --write src
```

## Review Checklist

- Ordinary asynchronous flow uses `await`.
- Errors are handled at the layer that owns recovery, reporting, or translation.
- No promise is discarded with unary `void`; an intentional fire-and-forget boundary owns its rejection path.
- Fire-and-forget operations own their rejection path.
- Newer APIs match actual runtime targets or approved polyfills.
- Only changed files are formatted; unrelated formatter changes are restored without losing user edits, and legacy formatting failures are reported.
