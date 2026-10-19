# 命令执行示例

> 本文件仅翻译 `command-execution-rules/references/command-execution-examples.md`，代码示例与英文 reference 保持一致。

## 场景 1：直接执行固定命令

单个固定命令直接交给执行工具：

工作目录通过工具的 `cwd` 或 `workdir` 选项传递。直接调用已经足够表达任务时，不要额外引入 `python -c`、`cd`、管道或命令分隔符。

**正例：**

```text
git status --short
```

**反例：**

```text
cd project && git status --short
```

## 场景 2：用 Python 返回结构化结果

以下可复用执行器要求 Python 3.10 或更高版本；旧版运行时需要调整类型标注。调用方传入参数序列，而不是 Shell 字符串。

`encoding` 应根据被调用工具承诺的输出编码选择。`errors="replace"` 适合面向人工的诊断信息，但可能破坏 JSON、CSV 等数据协议；结构化数据应严格解码并显式处理 `UnicodeDecodeError`。

**正例：**

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

**反例：**

```python
def run_command(command: str) -> bool:
    completed = subprocess.run(command, shell=True, capture_output=True, text=True)
    return not completed.stderr
```

## 场景 3：安全传递动态参数

使用上面的执行器：

程序名和每个参数保持分离。动态值可能被误判为选项时，使用工具提供的 `--` 分隔符。调用方负责解释工具定义的状态，例如 `rg` 返回 1 可以表示没有匹配，返回 2 才表示错误。

**正例：**

```python
pattern = "*.py"
result = run_command(
    ["rg", "--files", "-g", pattern],
    cwd=Path.cwd(),
)
```

**反例：**

```python
result = run_command(f'rg --files -g "{pattern}"')
```

## 场景 4：选择 `python -c` 或脚本文件

固定源码的短操作可以使用：

操作包含多行逻辑、嵌套引用、复用行为、多个动态输入或详细错误处理时，应使用 `.py` 文件。动态值通过 `sys.argv` 传递，不插入 Python 源码。

**正例：**

```text
python -X utf8 -c "from pathlib import Path; print(Path.cwd())"
```

```python
from pathlib import Path
import sys


target = Path(sys.argv[1])
print(target.resolve())
```

```text
python resolve_path.py D:\dynamic\path
```

**反例：**

```text
python -c "from pathlib import Path; target = Path('D:\dynamic\path'); print(f'{target.resolve()}')"
```

## 复核清单

- 简单固定命令直接执行，不增加无意义的包装层。
- 动态值保持为参数，不进入 Shell 或 Python 源码。
- Python 子进程使用参数列表、明确工作目录和 `shell=False`，除非确实需要 Shell 行为。
- 编码匹配被调用工具，结构化数据不使用静默替换解码。
- 非零退出、启动失败和超时都保留有用输出与上下文。
- 成功由完成状态和退出码决定，不以 stderr 是否为空判断。
