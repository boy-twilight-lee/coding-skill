# Commit Type Examples


Select the type based on the main purpose of the change, rather than mechanically classifying it by file extension.

| Type | Applicable changes | Example |
| --- | --- | --- |
| `feat` | Add user-facing functionality | `feat(auth): 支持短信验证码登录` |
| `fix` | Correct faulty behavior | `fix(cart): 修复重复点击导致商品重复添加` |
| `refactor` | Restructure code while preserving existing functionality and behavior | `refactor(api): 提取公共请求参数处理逻辑` |
| `docs` | Change documentation, instructions, or documentation examples | `docs: 补充本地开发和部署说明` |
| `perf` | Improve performance | `perf(list): 减少长列表滚动时的重复计算` |
| `test` | Add or adjust tests | `test(auth): 补充登录失败的边界用例` |
| `build` | Change build processes or dependency management | `build: 升级 Vite 至项目要求的版本` |
| `ci` | Change continuous integration configuration or workflows | `ci: 为合并请求增加类型检查` |
| `style` | Adjust code formatting without affecting behavior | `style: 统一缩进和空格格式` |
| `chore` | Maintenance without a more suitable type | `chore: 更新 Git 忽略规则` |
| `revert` | Revert an existing commit | `revert: 撤销短信验证码登录功能` |

Use `feat`, `fix`, `refactor`, and `docs` for their common purposes; select other types when their specific purpose applies. Do not classify every maintenance change as `chore`. CSS visual changes are not automatically `style`: use `feat` for new interface functionality, `fix` for display defects, and `style` only for code formatting.

## Scenario 1: A Feature with Related Tests and Documentation

When one staged change adds avatar uploads, their tests, and usage documentation, describe the main purpose:

```text
feat(user): 新增用户头像上传功能
```

Do not select `test` or `docs` merely because those files are included in the feature commit.

## Scenario 2: Separate Unrelated Purposes

If avatar uploads and an unrelated checkout fix are both present, suggest separate commits:

```text
feat(user): 新增用户头像上传功能
fix(checkout): 修复优惠券重复抵扣的问题
```

Do not rearrange the staging area without authorization.
