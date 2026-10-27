# Examples

TypeScript adaptations of the four-principle examples from [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/EXAMPLES.md). The scenarios and positive/negative contrasts are preserved; code, identifiers, and related explanations are adapted to TypeScript. The duplicate-score test also asserts the tie-break order rather than only the scores.

Snippets focus on the principle being demonstrated. Repositories, database, cache, CSV, search, event, HTTP, and logger helpers are assumed to exist in the example application. File examples use Node.js APIs; database examples use an existing synchronous facade. `UserData` has optional string fields `email` and `username`; `Score` has `name: string` and `score: number`. These are focused excerpts, not standalone application templates or requirements to introduce those helpers. Nonessential comments are omitted except where comment changes are part of the example.

---

## 1. Think Before Coding

### Example 1: Hidden Assumptions

**User Request:** "Add a feature to export user data"

**❌ What LLMs Do (Wrong Assumptions)**

```ts
import { writeFileSync } from 'node:fs'

function exportUsers(format: 'json' | 'csv' = 'json'): string {
  const users = userRepository.findAll()
  if (format === 'json') {
    writeFileSync('users.json', JSON.stringify(users))
  } else if (format === 'csv') {
    writeCsvFile('users.csv', users, ['id', 'email', 'name'])
  }
  return `Exported ${users.length} users`
}
```

**Problems:**

- Assumed it should export ALL users (what about pagination? privacy?)
- Assumed file location without asking
- Assumed which fields to include
- Assumed CSV fieldnames without checking actual data structure

**✅ What Should Happen (Surface Assumptions)**

```text
Before implementing, I need to clarify:

1. **Scope**: Export all users or filtered subset? (privacy implications)
2. **Format**: You mentioned "export" - did you mean:
   - Download file in browser?
   - Background job with email notification?
   - API endpoint returning data?
3. **Fields**: Which user fields? (some might be sensitive)
4. **Volume**: How many users typically? (affects approach)

Simplest approach: Add an API endpoint that returns paginated JSON.
Would need more info for file-based exports.

What's your preference?
```

### Example 2: Multiple Interpretations

**User Request:** "Make the search faster"

**❌ What LLMs Do (Pick Silently)**

Immediately adds caching without establishing which meaning of "faster" matters. The example assumes an existing memoization helper and search index:

```ts
const search = memoize(
  (query: string): SearchResult[] => searchIndex.search(query),
  { maxSize: 1000 }
)
```

**✅ What Should Happen**

```text
"Make the search faster" could mean:

1. **Faster response time** (< 100ms instead of 500ms)
   - Add database indexes
   - Cache frequent queries
   - Estimated effort: 2 hours

2. **Handle more concurrent searches** (throughput)
   - Add async/await
   - Connection pooling
   - Estimated effort: 4 hours

3. **Faster perceived speed** (UX)
   - Show partial results immediately
   - Progressive loading
   - Estimated effort: 3 hours

Current search takes ~500ms for typical queries.
Which aspect matters most for your use case?
```

---

## 2. Simplicity First

### Example 1: Over-abstraction

**User Request:** "Add a function to calculate discount"

**❌ What LLMs Do (Overengineered)**

```ts
abstract class DiscountStrategy {
  abstract calculate(amount: number): number
}
class PercentageDiscount extends DiscountStrategy {
  constructor(private percentage: number) {
    super()
  }
  calculate(amount: number): number {
    return amount * (this.percentage / 100)
  }
}
class FixedDiscount extends DiscountStrategy {
  constructor(private fixedAmount: number) {
    super()
  }
  calculate(amount: number): number {
    return Math.min(this.fixedAmount, amount)
  }
}
class DiscountConfig {
  constructor(
    public strategy: DiscountStrategy,
    public minPurchase = 0,
    public maxDiscount = Infinity
  ) {}
}
class DiscountCalculator {
  constructor(private config: DiscountConfig) {}
  applyDiscount(amount: number): number {
    if (amount < this.config.minPurchase) {
      return 0
    }
    return Math.min(this.config.strategy.calculate(amount), this.config.maxDiscount)
  }
}
```

The calculation now requires strategy, configuration, and calculator objects before a single discount can be calculated.

**✅ What Should Happen (Simple)**

The caller supplies a percentage from 0 to 100; the function returns the discount amount. `calculateDiscount(100, 10)` returns `10`.

```ts
function calculateDiscount(amount: number, percent: number): number {
  return amount * (percent / 100)
}
```

**When to add complexity:** Only when you actually need multiple discount types. If that requirement comes later, refactor then.

### Example 2: Speculative Features

**User Request:** "Save user preferences to database"

**❌ What LLMs Do (Unnecessary Features)**

```ts
class PreferenceManager {
  constructor(
    private db: Database,
    private cache = new InMemoryCache(),
    private validator = new DefaultValidator()
  ) {}
  save(
    userId: number,
    preferences: Record<string, unknown>,
    { merge = true, validate = true, notify = false } = {}
  ): boolean {
    if (validate) {
      const errors = this.validator.validate(preferences)
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }
    }
    if (merge) {
      preferences = { ...this.db.getPreferences(userId), ...preferences }
    }
    this.db.execute('UPDATE users SET preferences = ? WHERE id = ?', [
      JSON.stringify(preferences), userId
    ])
    this.cache.set(`prefs:${userId}`, preferences)
    if (notify) {
      this.notifyPreferenceChange(userId, preferences)
    }
    return true
  }
  notifyPreferenceChange(userId: number, preferences: Record<string, unknown>): void {
    preferenceEvents.publish({ userId, preferences })
  }
}
```

**✅ What Should Happen (Just What Was Asked)**

```ts
function savePreferences(db: Database, userId: number, preferences: Record<string, unknown>): void {
  db.execute('UPDATE users SET preferences = ? WHERE id = ?', [
    JSON.stringify(preferences), userId
  ])
}
```

**Add later if needed:** Caching (when performance matters), validation (when bad data appears), merging (when requirement emerges).

---

## 3. Surgical Changes

### Example 1: Drive-by Refactoring

**User Request:** "Fix the bug where whitespace-only emails pass the required-field check"

**❌ What LLMs Do (Too Much)**

```diff
 function validateUser(userData: UserData): boolean {
-  // Check email format
-  if (!userData.email) {
+  /** Validate user data. */
+  const email = (userData.email ?? '').trim()
+  if (!email) {
     throw new Error('Email required')
   }
-  // Basic email validation
-  if (!userData.email.includes('@')) {
+  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
     throw new Error('Invalid email')
   }
-  // Check username
-  if (!userData.username) {
+  // Validate username
+  const username = (userData.username ?? '').trim()
+  if (!username) {
     throw new Error('Username required')
   }
+  if (username.length < 3) {
+    throw new Error('Username too short')
+  }
+  if (!/^[a-z0-9]+$/i.test(username)) {
+    throw new Error('Username must be alphanumeric')
+  }
   return true
 }
```

**Problems:**

- "Improved" email validation beyond the bug fix
- Added username validation nobody asked for
- Changed comments and added documentation unrelated to the fix

**✅ What Should Happen (Surgical)**

```diff
 function validateUser(userData: UserData): boolean {
   // Check email format
-  if (!userData.email) {
+  const email = userData.email ?? ''
+  if (!email.trim()) {
     throw new Error('Email required')
   }
   // Basic email validation
-  if (!userData.email.includes('@')) {
+  if (!email.includes('@')) {
     throw new Error('Invalid email')
   }
   // Check username
   if (!userData.username) {
     throw new Error('Username required')
   }
   return true
 }
```

**Only changed:** The required-field check now rejects whitespace-only email values. Other email and username rules remain unchanged.

### Example 2: Style Drift

**User Request:** "Add logging to the upload function"

Both patches start from the same TypeScript function. Its existing contract returns `false` on upload errors; the task does not change that contract. `readFileSync` is already imported from `node:fs`, and the HTTP client and logger already exist in the application.

**❌ What LLMs Do (Reformat Everything)**

```diff
-async function uploadFile(filePath: string, destination: string) {
+async function uploadFile(filePath: string, destination: string): Promise<boolean> {
+  /** Upload a file and log the result. */
+  logger.info(`Uploading ${filePath} to ${destination}`)
   try {
     const data = readFileSync(filePath)
     const response = await http.post(destination, data)
-    if (response.status === 200) {
-      return true
-    } else {
-      return false
-    }
+    const success = response.status === 200
+    logger.info("Upload finished", { filePath, success })
+    return success
   } catch (error) {
-    console.log('Upload error', error)
+    logger.error("Upload error", error)
     return false
   }
 }
```

**Problems:**

- Changed quote style from single to double quotes
- Added an explicit return annotation and documentation unrelated to logging
- Rewrote the existing boolean return branches

**✅ What Should Happen (Match Existing Style)**

```diff
 async function uploadFile(filePath: string, destination: string) {
+  logger.info(`Starting upload: ${filePath}`)
   try {
     const data = readFileSync(filePath)
     const response = await http.post(destination, data)
     if (response.status === 200) {
+      logger.info(`Upload successful: ${filePath}`)
       return true
     } else {
+      logger.error(`Upload failed: ${filePath}, status=${response.status}`)
       return false
     }
   } catch (error) {
-    console.log('Upload error', error)
+    logger.error(`Upload error: ${filePath}`, error)
     return false
   }
 }
```

**Matched:** Single quotes, existing type annotations, boolean return branches, failure semantics, and spacing style. The existing try/catch is retained because this task adds logging rather than changes error handling.

---

## 4. Goal-Driven Execution

### Example 1: Vague vs. Verifiable

**User Request:** "Fix the authentication system"

**❌ What LLMs Do (Vague Approach)**

```text
I'll fix the authentication system by:
1. Reviewing the code
2. Identifying issues
3. Making improvements
4. Testing the changes

[Proceeds to make changes without clear success criteria]
```

**✅ What Should Happen (Verifiable Goals)**

```text
To "fix authentication," I need to define success criteria.
What specific issue are we solving?

If the issue is "users stay logged in after password change":

Plan:
1. Write test: Change password → verify old session invalidated
   Verify: Test fails (reproduces bug)

2. Implement: Invalidate sessions on password change
   Verify: Test passes

3. Check edge cases: Multiple active sessions, concurrent changes
   Verify: Additional tests pass

4. Verify no regression: Existing auth tests still pass
   Verify: Full test suite green

Current test coverage for auth: [shows coverage]
What's the specific auth issue you're seeing?
```

### Example 2: Multi-Step with Verification

**User Request:** "Add rate limiting to the API"

**❌ What LLMs Do (All at Once)**

Implements rate limiting with Redis, multiple strategies, a configuration system, and monitoring in one large change, with no clear verification steps.

**✅ What Should Happen (Incremental with Verification)**

```text
Plan for rate limiting:

1. Add basic in-memory rate limiting (single endpoint)
   Verify:
   - Test: 100 requests → first 10 succeed, rest get 429
   - Manual: curl endpoint 11 times, see rate limit error

2. Extract to middleware (apply to all endpoints)
   Verify:
   - Test: Rate limits apply to /users and /posts
   - Existing endpoint tests still pass

3. Add Redis backend (for multi-server)
   Verify:
   - Test: Rate limit persists across app restarts
   - Test: Two app instances share rate limit counter

4. Add configuration (rates per endpoint)
   Verify:
   - Test: /search allows 10/min, /users allows 100/min
   - Config file parsed correctly

Each step is independently verifiable and deployable.
Start with step 1?
```

### Example 3: Test-First Verification

**User Request:** "The sorting breaks when there are duplicate scores"

For this example, the agreed order is score descending, then name ascending for ties. The existing implementation sorts by score alone. `Score` has a string `name` and numeric `score`.

**❌ What LLMs Do (Fix Without Reproducing)**

Immediately changes the sort logic without first checking that the reported case fails:

```ts
function sortScores(scores: Score[]): Score[] {
  return [...scores].sort((left, right) =>
    right.score - left.score || left.name.localeCompare(right.name)
  )
}
```

**✅ What Should Happen (Reproduce First)**

First, add this test against the existing score-only implementation. Bob intentionally precedes Alice in the input; asserting the output names makes the missing tie-breaker observable.

```ts
import { strict as assert } from 'node:assert'
import { test } from 'node:test'

test('sorts equal scores by name', () => {
  const scores: Score[] = [
    { name: 'Bob', score: 100 },
    { name: 'Alice', score: 100 },
    { name: 'Charlie', score: 90 }
  ]
  assert.deepEqual(sortScores(scores).map((entry) => entry.name), [
    'Alice', 'Bob', 'Charlie'
  ])
})
```

Verify that the test fails with the old implementation: its output is Bob, Alice, Charlie. Re-running a test that checks only numeric scores would not detect this missing tie-breaker.

Then implement the agreed tie-breaker:

```ts
function sortScores(scores: Score[]): Score[] {
  return [...scores].sort((left, right) =>
    right.score - left.score || left.name.localeCompare(right.name)
  )
}
```

Verify that the same test now passes. Copying the array also preserves the input, matching the non-mutating behavior of the original Python `sorted` example.

---

## Anti-Patterns Summary

| Principle | Anti-Pattern | Fix |
| --- | --- | --- |
| Think Before Coding | Silently assumes file format, fields, scope | List assumptions explicitly, ask for clarification |
| Simplicity First | Strategy pattern for single discount calculation | One function until complexity is actually needed |
| Surgical Changes | Changes quote style, annotations, or unrelated validation while fixing a bug | Only change lines required for the task |
| Goal-Driven | "I'll review and improve the code" | "Write test for bug X → make it pass → verify no regressions" |

## Key Insight

The "overcomplicated" examples aren't obviously wrong—they follow design patterns and best practices. The problem is **timing**: they add complexity before it's needed, which:

- Makes code harder to understand
- Introduces more bugs
- Takes longer to implement
- Makes it harder to test

The "simple" versions are:

- Easier to understand
- Faster to implement
- Easier to test
- Able to be refactored later when complexity is actually needed

**Good code is code that solves today's problem simply, not tomorrow's problem prematurely.**
