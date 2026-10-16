# Command Execution Examples

## Scenario 1: Return Structured Results from an External Command

The following executable example requires Python 3.10 or newer. Adapt annotations for an older supported runtime. It treats nonzero exits, startup errors, and timeouts consistently and preserves partial output.

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


def normalize_output(value: str | bytes | None) -> str:
    """Decode partial timeout output, which can be bytes in text mode."""
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    return value or ""


def run_command(
    arguments: Sequence[str],
    *,
    cwd: Path | None = None,
    timeout_seconds: float = 60.0,
) -> CommandResult:
    """Execute an argument list without shell interpretation."""
    try:
        completed = subprocess.run(
            list(arguments),
            cwd=cwd,
            shell=False,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout_seconds,
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        stderr = normalize_output(error.stderr)
        message = f"Command timed out after {timeout_seconds} seconds."
        return CommandResult(
            False, None, normalize_output(error.stdout),
            f"{stderr}\n{message}" if stderr else message,
        )
    except OSError as error:
        return CommandResult(False, None, "", str(error))
    return CommandResult(
        completed.returncode == 0,
        completed.returncode,
        completed.stdout,
        completed.stderr,
    )


def main() -> int:
    """Print a UTF-8 result and return a meaningful script exit code."""
    sys.stdout.reconfigure(encoding="utf-8")
    result = run_command([sys.executable, "--version"], cwd=Path.cwd())
    print(json.dumps(asdict(result), ensure_ascii=False))
    return 0 if result.success else 1


if __name__ == "__main__":
    raise SystemExit(main())
```

Here `errors="replace"` preserves readable diagnostics when bytes are malformed. For output used as a data protocol, use strict decoding and explicitly handle decoding errors instead. Adapt a known non-UTF-8 tool at its boundary rather than guessing from the operating system.

## Scenario 2: Search with rg Through Python

Using the helper above:

```python
result = run_command(["rg", "--files", "-g", "*.py"], cwd=Path.cwd())
```

Keep executable names and each argument separate. If a command has a meaningful nonzero status, interpret it at the caller: for example, rg exit code 1 means no matches, while exit code 2 indicates an error. Preserve the raw command result.

Avoid shell strings such as `subprocess.run(f"rg {user_pattern}", shell=True)`. Pass dynamic values as arguments and use the tool's `--` separator when a value might otherwise be interpreted as an option.

## Scenario 3: Launch Python from a Shell-Based Execution Tool

```text
python -X utf8 path/to/task.py
```

This is only the launch boundary. Put file operations, branching, command orchestration, and structured reporting inside the Python script. Resolve quoting according to the actual launch shell; JSON encoding is not shell escaping.

## Review Checklist

- Commands use argument lists and capture both output streams.
- The subprocess encoding and final output sink support UTF-8.
- Return codes and exceptions produce the same result fields.
- Timeouts preserve available output, including byte-valued partial output.
- Nonzero exits and successful commands with stderr are distinguished.
- No shell interpolation or hard-coded interpreter path is introduced.
