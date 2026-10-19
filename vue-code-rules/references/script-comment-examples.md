# Vue Script Comment Examples

## Ownership

For `<script lang="ts">` and `<script setup lang="ts">`, `ts-code-rules` is the canonical source for generic declaration comments, function and callback comments, internal comments, redundant wrappers, intermediate values, and guards. This reference adds only Vue-specific placement and compiler-macro exceptions.

For JavaScript Vue scripts, apply the same baseline directly: runtime declarations and functions need concise Chinese business comments, internal comments are limited to important non-obvious logic, and comments must not justify redundant structure.

## Mandatory Rules

1. Comment every runtime variable or constant immediately above its declaration with its business purpose or state meaning. Imports, function parameters, and type-only declarations do not need separate declaration comments. Never place a declaration comment above a Vue compiler macro, including a variable or destructuring declaration that receives the result of `defineProps`, `withDefaults`, `defineEmits`, `defineExpose`, `defineOptions`, `defineSlots`, or another compiler macro.

2. Comment every function, method, composable, event handler, watcher, lifecycle hook, and callback with its responsibility, side effect, or return meaning. For an inline callback, one immediately adjacent comment above the containing declaration, API call, watcher, lifecycle call, or object property is sufficient when it unambiguously describes the callback.

3. Keep a one-use callback at its registration site when it only continues the surrounding Vue or API workflow. Extract it only for reuse, an independent business responsibility, focused testing, or a concrete readability benefit. Callback length alone is not a reason to create a one-use `handle*` or reset function.

4. Inside functions, comment only key business logic, non-obvious transformations, important branches, side effects, and error handling. Do not narrate ordinary assignments or calls. Do not introduce a pass-through function, single-use intermediate value, or caller-guaranteed guard merely to create a name or comment target.

## Scenario 1: Apply the Compiler-Macro Exception

**Positive example:**

Compiler macros do not receive declaration comments, while ordinary runtime state does:

```ts
const props = defineProps<{
  candidateId: string
}>()
const emit = defineEmits<{
  saved: [candidateId: string]
}>()

// [Write in Chinese: indicate whether the candidate details are loading.]
const loading = ref(false)
// [Write in Chinese: submit the candidate and notify the parent component.]
const submitCandidate = async () => {
  await saveCandidate(props.candidateId)
  emit('saved', props.candidateId)
}
```

**Negative example:**

Do not add a generic declaration comment above that same compiler macro:

```ts
// [Write in Chinese: receive the component props.]
const props = defineProps<{
  candidateId: string
}>()
```

Its name and type argument already identify the declaration role. Document non-obvious business meaning in the prop contract instead.

## Scenario 2: Place Watcher and Lifecycle Comments

**Positive example:**

The comment belongs immediately above the Vue API call and documents its callback:

```ts
// [Write in Chinese: reload the candidate list after the filters change.]
watch(filters, async () => {
  await loadCandidates()
})

// [Write in Chinese: initialize candidate data after the page mounts.]
onMounted(async () => {
  await loadCandidates()
})
```

Do not insert another comment inside either callback solely to satisfy the callback rule. Extract a named callback only when it has an independent responsibility, reuse, focused testing value, or a concrete readability benefit.

**Negative example:**

Do not move the same callback comments inside the watcher and lifecycle bodies:

```ts
watch(filters, async () => {
  // [Write in Chinese: reload the candidate list after the filters change.]
  await loadCandidates()
})

onMounted(async () => {
  // [Write in Chinese: initialize candidate data after the page mounts.]
  await loadCandidates()
})
```

## Scenario 3: Keep a One-Use Vue Workflow Together

**Positive example:**

Keep a callback beside its only registration site and trust a verified Vue contract instead of repeating it:

```ts
// [Write in Chinese: open the CAPTCHA and request an SMS code after successful validation.]
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({
    // [Write in Chinese: continue the SMS delivery flow after the CAPTCHA succeeds.]
    onOk: async (validate: string) => {
      status.value = 'sending'
      await sendPhoneVerificationCode({ phone: phone.value, validate })
      status.value = 'sent'
      startCountdown()
    }
  })
}

// [Write in Chinese: clear the associated verification code and access state in place when the phone number changes.]
watch(phone, () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
})
```

**Negative example:**

Do not extract those same one-use callbacks only to shorten their owners or to attach another declaration comment:

```ts
// [Write in Chinese: continue the SMS delivery flow after the CAPTCHA succeeds.]
const handleCaptchaVerified = async (validate: string) => {
  status.value = 'sending'
  await sendPhoneVerificationCode({ phone: phone.value, validate })
  status.value = 'sent'
  startCountdown()
}
// [Write in Chinese: open the CAPTCHA and request an SMS verification code.]
const handleRequestCode = () => {
  if (requestCodeDisabled.value) return
  openCaptcha({ onOk: handleCaptchaVerified })
}
// [Write in Chinese: clear the associated verification code and access state.]
const resetVerification = () => {
  code.value = ''
  status.value = 'idle'
  onVerifiedChange(null)
}
// [Write in Chinese: invalidate the previous SMS verification state when the phone number changes.]
watch(phone, resetVerification)
```

Keep a guard only when another caller, Vue, or the called API can actually deliver the guarded state.

## Review Checklist

- TypeScript SFCs use `ts-code-rules` as the generic script-quality source; this reference supplies only Vue-specific placement and exceptions.
- JavaScript SFCs still apply the runtime declaration, function, internal-comment, and redundancy baseline.
- Compiler macros have no declaration comments above them.
- Watcher, lifecycle, and inline callback comments sit immediately above their containing call or property.
- One-use callbacks stay at their registration site unless extraction has a concrete responsibility or readability benefit.
- Comments explain business purpose or effects and do not preserve redundant code.
