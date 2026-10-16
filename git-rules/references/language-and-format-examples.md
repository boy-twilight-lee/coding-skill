# Language and Format Examples

## Scenario 1: Standard Chinese Commit Messages

```text
feat(user): 新增用户头像上传功能
fix(auth): 修复登录成功后未跳转首页的问题
refactor(order): 合并重复的订单状态判断逻辑
docs: 补充 Git 提交规范和使用示例
```

## Scenario 2: Necessary English Exceptions

When the repository explicitly requires English commit messages or has a consistently English-only commit history:

```text
fix(auth): handle expired OAuth tokens
```

When Chinese is the default and necessary technical terms are preserved:

```text
fix(auth): 修复 OAuth token 过期后的登录失败问题
```

## Scenario 3: Correct Vague or Malformed Messages

| Avoid | Prefer | Reason |
| --- | --- | --- |
| `update` | `docs: 补充接口调用示例` | State the type and purpose; this example assumes a documentation change |
| `fix: 修改代码` | `fix(user): 修复空头像地址导致图片加载失败` | Describe the specific defect |
| `refactor: 新增导出按钮` | `feat(report): 新增报表导出按钮` | New functionality is not a behavior-preserving refactor |
| `style: 修复移动端弹窗遮挡按钮` | `fix(dialog): 修复移动端弹窗遮挡确认按钮` | A display defect fix is not a code formatting change |
| `Feat(auth):新增登录功能。` | `feat(auth): 新增登录功能` | Use a lowercase type, a space after the colon, and no trailing period |
