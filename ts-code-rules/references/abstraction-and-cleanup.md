# Wrappers, Intermediates, and Guards

Owns Core Rule 5.

## Mandatory Rule

Remove temporary debugging code.

Do not introduce or preserve redundant code merely to create a name or comment target. Prohibit pass-through functions that only call and return another function, one-use callback wrappers that separate a continuous workflow without an independent responsibility, single-use intermediate variables that add no business meaning, reuse, type narrowing, or readability, and validation or guard conditions already guaranteed by the only caller, framework, or API contract. Inline the underlying expression, callback, or call instead. Keep a wrapper, intermediate value, callback extraction, or guard only when it has an independent responsibility or a concrete correctness benefit; a comment does not justify redundant structure.

## Scenario 1: Remove Redundant Wrappers, Intermediates, and Guards

**Positive example:**

Prefer the direct predicate and the verified callback contract:

```ts
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}

watch(phone, () => {
  resetVerification()
})
```

**Negative example:**

Do not retain an extra function, variable, or condition in that same workflow merely to create a name or comment target:

```ts
const hasSmsPhoneConfig = (field: SearchField) => {
  return field.format === ValidatorType.PHONE && field.smsOpen === true
}
const isSmsPhoneField = (field: SearchField) => {
  return hasSmsPhoneConfig(field)
}

watch(phone, (currentPhone, previousPhone) => {
  const hasChanged = currentPhone !== previousPhone
  if (!hasChanged) return
  resetVerification()
})
```

An intermediate value is still useful when it names a real business concept, is reused, enables type narrowing, or makes a complex expression materially clearer. A guard remains necessary when the caller, framework, or API can deliver the guarded state; verify that contract before simplifying it.

The try/catch required around an await that can throw or reject by [Async and Try/Catch](async-and-try-catch.md) must not be removed as redundant, even when catch is empty or only rethrows. Do not retain a wrapper solely for an await verified not to throw or reject; preserve any catch needed for other throwing statements.

## Review Checklist

- Temporary debugging artifacts are removed.
- No comment justifies a pass-through wrapper, meaningless intermediate, or redundant guard.
- Caller and framework contracts are verified before removing guards; retained intermediate values have a concrete business, narrowing, reuse, or readability purpose.
