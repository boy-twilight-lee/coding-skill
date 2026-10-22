# Runtime API Compatibility

Owns Core Rule 9.

## Mandatory Rule

Use APIs supported by the repository's actual TypeScript target, runtime versions, Browserslist, and polyfill strategy. Before introducing an API outside that verified baseline, confirm support in every target environment or use a project-approved fallback or polyfill. Do not assume transpilation supplies runtime APIs.

## Scenario 1: Check API Support Against the Configured Baseline

**Positive example:**

Before using an API outside the repository's already verified baseline:

1. Read the repository's TypeScript target, Browserslist, runtime version, and polyfill setup.
2. Confirm native support in every target environment.
3. Prefer an established project helper or approved polyfill when support is incomplete.
4. Verify behavior in the oldest supported target.

Do not assume transpilation adds runtime APIs. Syntax transformation and API polyfilling are separate concerns.

When `Array.prototype.at` is not supported by the actual targets, use the approved compatible form:

```ts
const lastCandidate = candidates[candidates.length - 1]
```

**Negative example:**

Do not use the unsupported API for that same last-item lookup:

```ts
const lastCandidate = candidates.at(-1)
```

The fallback is illustrative; actual support decisions must come from the repository's target matrix.

## Review Checklist

- New runtime APIs match verified TypeScript, runtime, browser, and polyfill targets.
- Missing native support uses an established helper or approved fallback or polyfill.
- Transpilation is not treated as runtime API polyfilling.
