# Body and Breaking Change Examples

## Scenario 1: Explain a Fix

```text
fix(upload): 修复大文件上传时进度停滞的问题

按已传输字节数计算进度，避免分片大小不一致时显示错误。
上传失败后保留已完成分片，允许继续重试。
```

The body must match the actual changes. Do not reuse the retry description from this example if retry behavior was not implemented.

## Scenario 2: Document an Incompatible API Change

For an actual incompatible change, add `!` after the type or scope and use a `BREAKING CHANGE:` footer to explain the impact and migration. Preserve the marker in English and prefer Chinese for the explanation.

```text
feat(api)!: 统一用户查询接口的返回结构

BREAKING CHANGE: 用户列表由直接返回数组改为返回包含 items 和 total 的对象，调用方需从 items 字段读取列表。
```

Do not use `!` or this footer for ordinary internal refactoring that preserves compatibility.

## Scenario 3: Link a Known Issue

Only when issue #123 is known to exist and this change resolves it:

```text
fix(auth): 修复登录成功后未跳转首页的问题

Closes: #123
```

Use `Refs` instead when the change relates to the issue without resolving it. Never invent an issue number.
