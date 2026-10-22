# Auto-Import Examples

Owns Core Rule 6.

## Mandatory Rules

1. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

## Scenario 1: Omit Imports Covered by Vite Auto-Import

Inspect the active Vite configuration and any imported shared plugin configuration. For example:

```ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/type/auto-imports.d.ts'
    })
  ]
})
```

**Positive example:**

With that configuration active, use the covered APIs directly:

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**Negative example:**

Do not retain explicit imports for those same APIs:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

## Scenario 2: Import APIs Not Covered by Auto-Import

Auto-import coverage may be partial. If the active configuration covers only `ref`, do not assume that `computed` or `useRoute` is also available:

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

**Positive example:**

Import the uncovered APIs and continue using the covered API directly:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{ candidateId: string }>()

const route = useRoute()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

Check configuration branches, modes, shared plugin factories, and target-specific Vite files before deciding coverage. A generated `auto-imports.d.ts` can corroborate the configuration but does not replace checking whether the corresponding plugin is active for the current build.

**Negative example:**

Do not omit imports for the same uncovered `computed` and `useRoute` APIs:

```vue
<script setup lang="ts">
const props = defineProps<{ candidateId: string }>()

const route = useRoute()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

## Review Checklist

- Vite and referenced auto-import configuration are checked before adding Vue or Vue Router imports.
- Covered APIs have no redundant explicit imports; uncovered APIs are imported normally.
