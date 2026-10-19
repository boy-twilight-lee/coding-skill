# Command Execution Examples

## Scenario 1: Execute a Fixed Command Directly

Use the execution tool directly for a single fixed command:

```text
git status --short
```

Set the working directory through the tool's `cwd` or `workdir` option. Do not introduce `python -c`, `cd`, a pipeline, or a command separator when the direct invocation already expresses the task.

## Scenario 2: Return Structured Results from Python

The following reusable runner requires Python 3.10 or newer. Adapt annotations for an older supported runtime. The caller supplies an argument sequence, not a shell string.

```python
import json
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Sequence


@dataclass(frozen=True)
class CommandResult:
    """Represent completion status and captured command output."""

    success: bool
    return_code: int | None
    output: str
    errors: str


def normalize_output(value: str | bytes | None, *, encoding: str) -> str:
    """Decode partial timeout output for diagnostic display."""
    if isinstance(value, bytes):
        return value.decode(encoding, errors="replace")
    return value or ""


def run_command(
    arguments: Sequence[str],
    *,
    cwd: Path | None = None,
    timeout_seconds: float = 60.0,
    encoding: str = "utf-8",
) -> CommandResult:
    """Execute an argument list without shell interpretation."""
    if isinstance(arguments, str):
        raise TypeError("arguments must be a sequence of individual strings")

    try:
        completed = subprocess.run(
            list(arguments),
            cwd=cwd,
            shell=False,
            capture_output=True,
            text=True,
            encoding=encoding,
            errors="replace",
            timeout=timeout_seconds,
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        stderr = normalize_output(error.stderr, encoding=encoding)
        message = f"Command timed out after {timeout_seconds} seconds."
        return CommandResult(
            success=False,
            return_code=None,
            output=normalize_output(error.stdout, encoding=encoding),
            errors=f"{stderr}\n{message}" if stderr else message,
        )
    except OSError as error:
        return CommandResult(False, None, "", str(error))

    return CommandResult(
        success=completed.returncode == 0,
        return_code=completed.returncode,
        output=completed.stdout,
        errors=completed.stderr,
    )


def main() -> int:
    """Run an example and expose its result to a caller."""
    result = run_command(
        [sys.executable, "--version"],
        cwd=Path.cwd(),
    )
    print(json.dumps(asdict(result), ensure_ascii=False))
    return 0 if result.success else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

Choose `encoding` from the invoked tool's documented output. `errors="replace"` is appropriate for readable diagnostics but can corrupt JSON, CSV, or another data protocol; use strict decoding and handle `UnicodeDecodeError` for structured data.

## Scenario 3: Search with Dynamic Arguments

Using the runner above:

```python
result = run_command(
    ["rg", "--files", "-g", "*.py"],
    cwd=Path.cwd(),
)
```

Keep executable names and arguments separate. Use a tool's `--` separator when a dynamic value might otherwise be parsed as an option. Interpret documented statuses at the caller: `rg` exit code 1 can mean no matches, while exit code 2 indicates an error.

## Scenario 4: Decide Between `python -c` and a Script

A short operation with fixed source can use:

```text
python -X utf8 -c "from pathlib import Path; print(Path.cwd())"
```

Use a `.py` file instead when the operation contains multiline logic, nested quoting, reusable behavior, several dynamic inputs, or detailed error handling. Pass dynamic values through `sys.argv` rather than interpolating them into Python source.

## Review Checklist

- Simple fixed commands are executed directly without unnecessary wrappers.
- Dynamic values remain arguments rather than becoming shell or Python source.
- Python subprocess calls use argument lists, an explicit working directory, and `shell=False` unless shell behavior is required.
- Encoding matches the invoked tool and structured data is not decoded with silent replacement.
- Nonzero exits, startup failures, and timeouts preserve useful output and context.
- Success depends on completion and return code rather than empty stderr.
