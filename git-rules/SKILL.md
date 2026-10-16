---
name: git-rules
description: "Apply Git commit message conventions when generating, editing, or reviewing commit messages, or performing a Git commit that requires a message. Follow Conventional Commits, prefer Chinese descriptions, and select types such as feat, fix, refactor, and docs based on the actual changes."
---

# Git Commit Rules

## Scope

Apply this skill when generating, editing, or reviewing Git commit messages, or performing a commit that requires a message. Read-only inspection of Git status, logs, or diffs alone does not require this skill. This skill governs commit messages; it does not authorize commits, pushes, or history rewrites.

Detailed examples live in references grouped by the same major rule sections as this file. Read only the matching reference before writing or reviewing an affected pattern. The references clarify these rules but do not override explicit user requirements or deliberate repository conventions.

## Working Process

1. When a repository is available, inspect its instructions, commit message validation configuration, and recent commits to identify existing scope, language, and format conventions. Explicit user requirements take precedence.

2. When writing a message for an upcoming commit, use the staged diff as the source of truth. When drafting from the user's description alone, do not claim to have inspected diffs or performed validation.

3. Keep each commit focused on one understandable purpose. Related implementation, tests, and documentation can share a commit whose title reflects the main purpose. Suggest splitting unrelated features and fixes without rearranging the user's staging area on your own.

4. Check that the type matches the actual behavior, the summary is accurate, the language follows the Chinese-first convention and its exceptions, and any breaking changes are identified. Do not describe new behavior as a pure refactor.

5. When asked only for a commit message, provide directly copyable text. When executing a commit, respect the user's authorization and repository requirements.

## Language and Format

Read [Language and Format Examples](references/language-and-format-examples.md) when deciding Chinese-first wording, English exceptions, summary clarity, or header syntax.

1. Use the Conventional Commits format:

   ```text
   <type>[optional scope][optional !]: <Chinese summary>

   [optional body]

   [optional footer]
   ```

2. Prefer Chinese for the summary and body. Use English only when explicitly requested by the user, required by the repository, established by a consistently English-only commit history, or necessary to preserve original technical terminology. Keep terms such as Git, API, OAuth, and TypeScript, and code identifiers, without forced translation. Keeping English terms within a Chinese message does not require writing the entire message in English.
3. Use lowercase English for `type`. For an optional `scope`, use a short, stable module name and prefer existing project conventions, such as `auth`, `user`, or `api`. Put one space after the colon.
4. Write a concise action-oriented summary of the actual change, such as `修复登录后跳转失败`. Avoid vague descriptions such as `修改代码` or `更新内容`, exaggerated claims, and a trailing period. Keep the summary short and on one line without sacrificing accuracy to meet an arbitrary length limit.
5. Add a body only when needed to explain the reason, behavioral impact, or migration. Separate it from the title with a blank line. Follow repository conventions for issue footers, such as `Refs: #123` or `Closes: #123`. Reference only known, real issues and use `Closes` only when the change actually resolves the issue.

## Commit Types

Read [Commit Type Examples](references/commit-type-examples.md) when selecting a type, distinguishing features from refactors, classifying CSS changes, or deciding whether unrelated changes need separate commits.

1. Select the type based on the main purpose of the actual change. Use `feat` for new user-facing functionality, `fix` for faulty behavior, `refactor` for restructuring that preserves behavior, and `docs` for documentation.

2. Use `perf`, `test`, `build`, `ci`, `style`, `chore`, or `revert` when their specific purpose applies. Do not classify every maintenance change as `chore`.

3. Reserve `style` for code formatting without behavior changes. CSS display fixes use `fix`; new interface functionality uses `feat`.

## Body and Breaking Changes

Read [Body and Breaking Change Examples](references/body-and-breaking-change-examples.md) when explaining reasons, documenting migration, marking incompatible changes, or linking known issues.

1. Keep body details grounded in the actual changes. Do not copy unsupported behavior claims from an example.

2. For an actual incompatible change, add `!` after the type or scope and use a `BREAKING CHANGE:` footer to explain the impact and migration. Preserve the marker in English and prefer Chinese for the explanation.

3. Do not mark ordinary internal refactoring as breaking when compatibility is preserved.
