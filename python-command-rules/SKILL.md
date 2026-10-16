---
name: python-command-rules
description: "Apply the user's mandatory Python-first scripting, automation, command-execution, structured-result, and code-quality standards. Use whenever writing, modifying, refactoring, reviewing, debugging, or completing Python code, scripts, automation, or command-execution helpers, or executing shell or system commands."
---

# Python Command Rules

Apply all relevant rules below when working on Python code, scripts, automation, command-execution helpers, or shell and system command execution. Keep changes scoped to the request and preserve its authorization boundaries.

Detailed examples live in references grouped by the same major rule sections as this file. Read only the matching reference before writing or reviewing an affected pattern.

## Working Process

1. Read repository instructions and inspect the affected code, available Python interpreter, runtime targets, and relevant check configuration before acting.

2. Determine which rule sections apply and read the matching references. Apply `vue-code-rules`, `ts-code-rules`, or `css-code-rules` as well when the task touches their respective languages; Python is the preferred automation language, not a reason to replace the project's implementation language.

3. Prefer Python standard-library operations for files and automation. Invoke external tools through Python's `subprocess` module when their capabilities are needed.

4. Inspect the resulting changes and run focused checks. For command helpers, verify successful execution and relevant failure paths. Report checks that could not be run rather than implying they passed.

## Language and Tool Selection

Read [Command Execution Examples](references/command-execution-examples.md) when choosing a Python entry point, invoking external tools, or handling command results.

1. Prefer Python for scripting, automation, file processing, and command orchestration. Avoid PowerShell, Batch, and shell scripts whenever Python can perform the operation.

2. Use `pathlib` and standard-library APIs for file operations. Execute Git, rg, build tools, and other necessary system commands through `subprocess`.

3. If an execution tool requires a shell command string, use the shell only to launch Python. Use `python -c` for simple operations and a `.py` script for complex, multiline, or reusable logic. Do not interpolate untrusted text into either shell strings or Python source.

4. Use a necessary fallback when Python is unavailable or a shell-specific capability is essential, and briefly explain the reason. Do not create an unrelated runtime installation or permission workaround.

## Command Execution and Results

Read [Command Execution Examples](references/command-execution-examples.md) before implementing subprocess invocation, UTF-8 handling, timeouts, or structured failure results.

1. Prefer `subprocess.run` with an argument list and `shell=False`. Pass working directories through `cwd` and construct paths with `pathlib.Path` rather than platform-specific string concatenation.

2. Capture stdout and stderr with `capture_output=True`, `text=True`, and `encoding="utf-8"`. Explicitly adapt a tool that genuinely emits another encoding; do not silently corrupt its output. Ensure the output sink also supports UTF-8, including Windows consoles and JSON output.

3. Check return codes, set an appropriate timeout, and handle `OSError` and `subprocess.TimeoutExpired`. If using `check=True`, also handle `subprocess.CalledProcessError`.

4. Return the same structured fields for success, nonzero exit, startup failure, and timeout. Preserve available output and useful error context. Do not swallow failures or print only a success message.

| Field | Type | Meaning |
| --- | --- | --- |
| `success` | `bool` | True only when the command completed with exit code zero |
| `return_code` | `int \| None` | Actual exit code, or `None` when no exit code is available |
| `output` | `str` | Captured stdout, including partial output when available |
| `errors` | `str` | Captured stderr and any necessary exception context |

5. Stderr content alone does not make an otherwise successful command fail. Use the completion state and return code to determine success. Use `sys.executable` when launching the current Python interpreter.

## Code Quality and File Handling

Read [Code Quality Examples](references/code-quality-examples.md) when organizing scripts, handling files, naming Python symbols, or defining executable entry points.

1. Organize code into clear functions and classes with appropriate type hints and documentation. Extract abstractions for real reuse, complexity, or responsibility boundaries.

2. Use `snake_case` for variables and functions and `UpperCamelCase` for classes. Apply these conventions to Python helpers; apply the relevant language skill to project-language code.

3. Handle file-operation, command-execution, and external-call errors at the layer responsible for reporting or recovery. Catch relevant exceptions, retain useful context, and avoid empty exception handlers.

4. Use a `main()` entry point and `if __name__ == "__main__":` in executable scripts. Importing a reusable module must not launch its task.

5. Keep code readable and free of unnecessary debug output. Match the supported Python version and avoid fixed drive letters, hard-coded interpreter paths, or shell-only syntax in cross-platform helpers.

