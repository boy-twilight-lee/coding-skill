# Code Quality Examples

## Scenario 1: Handle Files with pathlib and Explicit Encoding

```python
from pathlib import Path


def write_report(destination: Path, content: str) -> None:
    """Write a UTF-8 report and retain its destination in failure context."""
    try:
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content, encoding="utf-8")
    except OSError as error:
        raise RuntimeError(f"Unable to write report to {destination}") from error
```

Use this helper only for an authorized destination. Construct a child path with `workspace / "reports" / "result.json"`, rather than concatenating separators or assuming a Windows drive letter. Handle `UnicodeError` as well when reading external text that may violate the expected encoding.

## Scenario 2: Keep Executable Scripts Importable

```python
import sys
from pathlib import Path


def main() -> int:
    """Create the report and communicate failure to the caller."""
    try:
        write_report(Path.cwd() / "reports" / "result.json", '{"success": true}\n')
    except RuntimeError as error:
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

This example uses `write_report` from Scenario 1. Combine the snippets in the same script. Importing that script defines helpers without creating files.

## Scenario 3: Keep Naming and Error Handling Meaningful

Use `run_command`, `timeout_seconds`, and `CommandResult` for Python function, variable, and class names. Keep the project's implementation language and its applicable code rules when editing Vue or TypeScript.

Avoid `except Exception: pass`, unconditional success results, and raw debug dumps. Catch specific failures where the code can report, translate, or recover from them; let the caller handle errors it owns. Do not add a class or wrapper solely to rename a single standard-library call.

## Review Checklist

- Functions and classes reflect actual responsibilities and carry useful type hints.
- Python names follow snake_case and UpperCamelCase conventions.
- File paths use pathlib and text I/O specifies an encoding.
- Exceptions preserve useful context and are not silently discarded.
- Executable scripts have a guarded main entry point.
- Runtime assumptions match the project's supported Python version.
