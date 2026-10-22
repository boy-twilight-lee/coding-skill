# Loading Lifecycle and Related State Commits

## Mandatory Rule

Set operation-owned loading before work begins and restore it in `finally`; commit related state together after the required data has arrived so consumers do not observe a partial update.

## Restore Loading and Commit Related State Together

**Positive example:**

```ts
const loadCandidatePage = async () => {
  page.loading = true
  try {
    const { data } = await fetchCandidatePage(query.value)
    Object.assign(page, {
      total: data.total,
      pageNumber: data.pageNumber
    })
    candidates.value = data.records
  } catch (error) {
    Message.error(error.message)
  } finally {
    page.loading = false
  }
}
```

The page owner reports the user-facing failure, restores loading on every path, and commits the related pagination fields from one response together.

**Negative example:**

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

This leaves loading stuck on rejection and deliberately exposes an unnecessary partial state between assignments. Separate commits remain appropriate when the UI is intentionally progressive; that behavior must be part of the contract rather than an accident of statement order.

## Review Checklist

- Operation-owned loading starts before the request and is restored through `finally` on every path.
- Related state does not expose accidental partial updates; progressive commits require an intentional UI contract.
