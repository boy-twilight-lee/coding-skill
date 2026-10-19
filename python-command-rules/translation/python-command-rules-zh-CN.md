# python-command-rules 中文翻译

> 本文件仅供人工阅读。它没有被 `SKILL.md`、`agents/openai.yaml` 或任何 `references` 路由引用，因此不会自动进入 skill 上下文。每组示例紧跟对应规则，所有原始 fenced code 示例均原样保留。

## 适用范围与工作流程

处理 Python 代码、脚本、自动化、命令执行辅助程序或 Shell/系统命令时，应用全部相关规则，并严格保留用户授权边界。

1. 开始前阅读仓库说明，检查受影响代码、解释器、运行目标和检查配置。
2. 判断适用章节并阅读对应示例；涉及 Vue、TypeScript 或 CSS 时也应用相应 skill，Python 优先不等于替换项目语言。
3. 文件和自动化优先使用 Python 标准库；外部工具通过 `subprocess` 调用。
4. 检查修改并验证成功与失败路径，无法运行的检查必须如实报告。

## 语言选择与命令执行

1. 脚本、文件处理和命令编排优先 Python；Shell 只作为启动 Python 的边界。
2. 路径使用 `pathlib`，外部命令使用参数列表、`shell=False`、明确 `cwd`、超时和 UTF-8 捕获。
3. 成功、非零退出、启动失败和超时统一返回 `success`、`return_code`、`output`、`errors`；保留已有输出。
4. 标准错误有内容不等于失败，以完成状态和返回码判断；启动当前解释器使用 `sys.executable`。
5. 不把不可信文本插入 Shell 或 Python 源码，不为绕过权限安装无关运行时。

### 对应完整示例：`references/command-execution-examples.md`

#### 场景 1：返回外部命令的结构化结果

对子进程成功、非零退出、启动失败和超时返回相同字段，并保留标准输出、标准错误和部分输出。

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

#### 场景 2：通过 Python 使用 rg 搜索

把命令和每个参数分开传给 `subprocess`，由调用方解释工具特有返回码，不使用 Shell 插值。

```python
result = run_command(["rg", "--files", "-g", "*.py"], cwd=Path.cwd())
```

#### 场景 3：从 Shell 执行工具启动 Python

Shell 只负责启动 Python；文件处理、分支和结果报告全部留在 Python 中。

```text
python -X utf8 path/to/task.py
```

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。

## 代码质量与文件处理

1. 代码按真实职责组织成带类型标注和文档的函数或类，只为真实复用、复杂度或边界抽象。
2. 变量和函数使用 `snake_case`，类使用 `UpperCamelCase`。
3. 在负责报告或恢复的层处理文件、命令和外部调用错误，保留上下文，不写空异常处理。
4. 可执行脚本使用 `main()` 和 `if __name__ == "__main__":`，导入模块不应启动任务。
5. 匹配项目 Python 版本，避免无用调试输出、固定盘符、固定解释器路径和跨平台代码中的 Shell 专有语法。

### 对应完整示例：`references/code-quality-examples.md`

#### 场景 1：使用 pathlib 和明确编码处理文件

文件路径使用 `pathlib`，文本 I/O 明确指定 UTF-8，并在负责的层保留错误上下文。

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

#### 场景 2：保持可执行脚本可导入

脚本使用受保护的 `main()` 入口，导入模块不得自动执行任务。

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

#### 场景 3：保持命名和错误处理有意义

命名反映真实职责，捕获具体异常，不使用空处理、无条件成功或仅改名的包装。

#### 复核清单

按本节规则逐项复核：所有权、命名、结构、兼容性、修改范围和示例所展示的正反模式都必须满足。
