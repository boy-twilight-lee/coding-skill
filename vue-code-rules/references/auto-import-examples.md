# Auto-Import Examples

Owns Core Rule 6.

## Mandatory Rules

1. Before adding an explicit import from `vue` or `vue-router`, inspect `vite.config.*` and every referenced Vite plugin or shared configuration that controls automatic imports. When the exact API is covered by the active auto-import configuration, use it directly and do not add or retain a redundant explicit import in the changed code. When the API is not covered, the configuration is inactive for the target, or coverage cannot be verified, import it explicitly. Treat the Vite configuration as the source of truth; a dependency entry, generated declaration file, neighboring file, or global type alone does not prove that runtime auto-import is active.

## Scenario 1: Omit Imports Covered by Active Configuration

The examples show fragments of an active Vite plugin configuration; inspect the complete target/mode and any shared plugin factories before relying on coverage:

```ts
AutoImport({
  imports: ['vue', 'vue-router']
})
```

**Positive example:**

With these exact APIs covered by the active plugin, use them directly:

```vue
<script setup lang="ts">
const route = useRoute()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**Negative example:**

For that same usage and verified coverage, these explicit imports are redundant:

```ts
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
```

## Scenario 2: Import Uncovered APIs

Coverage of ref does not establish coverage of computed or useRoute:

```ts
AutoImport({
  imports: [{ vue: ['ref'] }]
})
```

**Positive example:**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

**Negative example:**

The same usage without the uncovered APIs' imports is invalid:

```vue
<script setup lang="ts">
const route = useRoute()
const keyword = ref('')
const normalizedKeyword = computed(() => keyword.value.trim())
</script>
```

A generated declaration file can corroborate configuration, but cannot prove that the runtime plugin is active.

## Review Checklist

- Vite and referenced auto-import configuration are checked before adding Vue or Vue Router imports.
- Covered APIs have no redundant explicit imports; uncovered APIs are imported normally.
