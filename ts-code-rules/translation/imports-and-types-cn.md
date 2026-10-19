# 导入与类型组织规则

> 本文件仅翻译 `ts-code-rules/references/imports-and-types.md`，代码示例与英文 reference 保持一致。

1. 导入顺序为第三方运行时依赖、类型依赖、内部运行时模块，以及适用时的 UI 或组件模块。类型组中先放模块局部类型，再放共享类型。
2. 编译器和打包器能安全擦除纯类型用法时优先普通导入。只有已验证的编译器、Lint、打包器或包运行时契约要求时才使用独立 `import type`，禁止行内 `type` 修饰符。
3. 通过项目配置的别名和公开入口导入其他模块；不要跨越两个以上父目录，也不要访问其他模块的私有文件。
4. 简洁私有类型跟随拥有者；可复用或公开契约放入仓库既有类型模块，环境 `.d.ts` 声明放入项目配置的声明位置。

## 场景 1：按配置分组导入并选择类型语法

已验证编译器、打包器、Lint 和包运行时契约能安全擦除纯类型用法，且不要求 `import type` 时，使用普通导入并保持分组：

活动配置要求类型导入时，使用独立声明并保留相同类型分组：

不要根据相邻文件猜测，也不要打乱分组或使用行内 `type` 修饰符：

**正例：**

```ts
import { ref } from 'vue'
import { CandidatePayload } from './type'
import { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

```ts
import { ref } from 'vue'
import type { CandidatePayload } from './type'
import type { CandidateQuery } from '@/type'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

```ts
import { ref } from 'vue'
import type { CandidatePayload } from '@/apis'
import { loadCandidates } from '@/apis'
import CandidateCard from '@/components/candidate-card'
```

**反例：**

```ts
import CandidateCard from '@/components/candidate-card'
import { loadCandidates, type CandidatePayload } from '@/apis'
import { ref } from 'vue'
```

## 场景 2：跨模块使用公开入口

跨模块消费者通过别名和拥有者公开入口导入：

不要跨越多个父目录、绕过组件入口或访问其他功能的私有实现：

同一拥有模块内部仍可使用不会跨越模块边界的相对导入；公开入口规则不要求所有局部兄弟导入都经过全局 barrel。

**正例：**

```ts
import { normalizeCandidate } from '@/features/candidate'
import CandidateCard from '@/components/candidate-card'
```

**反例：**

```ts
import CandidateCard from '../../components/candidate-card/index.vue'
import { normalizeCandidate } from '@/features/candidate/private/normalize-candidate'
```

## 场景 3：类型跟随真实拥有者

使用仓库既有目录的等价位置：

不要把弹窗私有类型过早放进全局兜底类型模块，不要把公开契约藏在私有组件内，也不要把环境声明放进任意实现文件。只有真实消费者跨越当前所有权边界后才提升类型。

**正例：**

```text
src/pages/candidate-list/component/candidate-dialog/type.ts   Private dialog type
src/features/candidate/type/index.ts                          Reusable or public feature contract
src/type/env.d.ts                                             Configured ambient declaration location
```

**反例：**

```text
src/type/dialog-form.ts                                      Dialog-only type promoted globally
src/pages/candidate-list/component/type.ts                   Public feature contract hidden privately
src/pages/candidate-list/index.ts                            Ambient declaration mixed into implementation
```
