# Fire-and-Forget Rejection Ownership

## Mandatory Rule

Do not discard a Promise with unary `void`. Await it when completion matters; for an intentional fire-and-forget boundary, ensure the operation handles or explicitly reports its own rejection.

## Avoid Discarding a Promise

**Positive example:**

Await the same save operation when completion or failure matters:

```ts
await saveCandidate(payload)
```

For an intentional fire-and-forget contract, make the boundary explicit and handle rejection inside the called operation:

```ts
// <zh: report candidate-page exposure without blocking the current interaction flow.>
const reportCandidateExposure = () => {
  // <zh: capture exposure-reporting failures and send them to the telemetry error channel.>
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

## Review Checklist

- No Promise is discarded with unary `void`.
- Intentional background work does not require completion at the caller and owns its rejection path.
