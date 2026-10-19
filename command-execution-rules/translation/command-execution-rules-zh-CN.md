# command-execution-rules 中文阅读版

> 本文件仅供人工阅读。Codex 执行时以 `SKILL.md` 和按需加载的 `references` 为准。

## 目标与边界

执行 Shell/系统命令，或者编写、修改、审查和调试命令执行器与自动化脚本时，选择最简单且安全的执行方式。始终遵守用户授权边界、仓库说明、工作目录和项目原有实现语言。

普通 Python 应用代码如果不执行外部命令，不应触发本 Skill。

## 工作流程

1. 执行或修改命令相关代码前，检查仓库说明、可用程序、工作目录、运行目标和检查配置。
2. 根据任务特点选择直接命令、Python 编排或 Shell 专用脚本；简单固定命令不应为了“Python 优先”额外包装。
3. 将路径、模式、分支名、URL 和用户输入作为参数传递，不插入 Shell 或 Python 源码。
4. 检查完成状态与退出码，保留有用的标准输出和标准错误；不能运行的检查必须如实报告。
5. 对可复用命令执行器验证相关的成功、非零退出、启动失败和超时路径。

## 执行方式

### 直接执行命令

`git status`、`rg --files`、项目已有测试或构建命令等单个固定调用应直接执行：

- 通过执行工具的 `cwd` 或 `workdir` 传递工作目录，不在复合命令里先 `cd`。
- 工具支持参数列表时优先使用参数列表；只能接收命令字符串时，按实际 Shell 正确引用，且不要插入不可信值。
- 不要仅为了满足 Python 优先偏好而套用 `python -c`。额外解析层会增加转义和编码风险，尤其是在 Windows 和非 ASCII 路径中。
- 只有确实需要管道、重定向、通配符展开、环境变量赋值等 Shell 语义时才使用它们。

### Python 编排

多命令、分支、输出解析、文件处理、动态参数、可复用自动化或跨平台一致性场景优先使用 Python 标准库：

- 路径使用 `pathlib`，外部命令使用 `subprocess`。
- 只对短小、可安全引用的操作使用 `python -X utf8 -c`；多行、可复用或失败敏感逻辑使用 `.py` 文件。
- 外部程序使用参数列表和 `shell=False`，除非明确需要 Shell 语义。
- 启动当前 Python 解释器时使用 `sys.executable`。
- Python 只是命令编排手段，不能替换项目本身选定的实现语言。

### Shell 专用脚本

任务确实依赖 PowerShell、Bash、Batch 或其他 Shell 的内建命令和语义时可以使用对应 Shell。脚本必须限定于所选 Shell，正确引用动态值，并在通常预期 Python 时说明采用 Shell 的原因。

## 结果和失败处理

普通交互式命令只需检查工具返回的完成状态、退出码、标准输出和标准错误，无须额外构造统一结果对象。

可复用命令执行器或机器消费的自动化应统一返回：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `success` | `bool` | 仅当命令完成且退出码为 0 时为真 |
| `return_code` | `int \| None` | 实际退出码；没有退出码时为 `None` |
| `output` | `str` | 标准输出，包括可用的部分输出 |
| `errors` | `str` | 标准错误与必要的异常上下文 |

实现 Python 命令执行器时：

1. 优先使用参数列表、`shell=False`、明确的 `cwd`、与任务相称的超时；由调用方解释结果时使用 `check=False`。
2. 仅在调用方需要时捕获输出。编码必须匹配被调用工具；受控工具和协议优先 UTF-8，但不能假定所有 Windows 程序都输出 UTF-8。
3. 处理 `OSError` 和 `subprocess.TimeoutExpired`；使用 `check=True` 时还需处理 `subprocess.CalledProcessError`。
4. 根据完成状态和退出码判断成功，不能仅因 stderr 有内容就判定失败。调用方应解释工具定义的特殊退出状态。

## 自动化脚本质量

以下规则只适用于命令执行辅助程序和自动化脚本，不扩展到无关 Python 应用代码：

- 非简单脚本应拆成职责明确、具有必要类型标注和文档的函数。
- 使用 `main()` 和 `if __name__ == "__main__":`，避免导入模块时执行命令。
- 在负责报告或恢复的层处理错误，保留上下文，不使用空异常处理。
- 避免固定盘符、硬编码解释器路径、静默失败、无条件成功提示和无关调试输出。
- 匹配仓库支持的 Python 版本，并在修改后运行聚焦检查。

## 对应示例：`references/command-execution-examples.md`

### 场景 1：直接执行固定命令

单个固定命令直接交给执行工具：

```text
git status --short
```

工作目录通过工具的 `cwd` 或 `workdir` 选项传递。直接调用已经足够表达任务时，不要额外引入 `python -c`、`cd`、管道或命令分隔符。

### 场景 2：用 Python 返回结构化结果

以下可复用执行器要求 Python 3.10 或更高版本；旧版运行时需要调整类型标注。调用方传入参数序列，而不是 Shell 字符串。

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

`encoding` 应根据被调用工具承诺的输出编码选择。`errors="replace"` 适合面向人工的诊断信息，但可能破坏 JSON、CSV 等数据协议；结构化数据应严格解码并显式处理 `UnicodeDecodeError`。

### 场景 3：安全传递动态参数

使用上面的执行器：

```python
result = run_command(
    ["rg", "--files", "-g", "*.py"],
    cwd=Path.cwd(),
)
```

程序名和每个参数保持分离。动态值可能被误判为选项时，使用工具提供的 `--` 分隔符。调用方负责解释工具定义的状态，例如 `rg` 返回 1 可以表示没有匹配，返回 2 才表示错误。

### 场景 4：选择 `python -c` 或脚本文件

固定源码的短操作可以使用：

```text
python -X utf8 -c "from pathlib import Path; print(Path.cwd())"
```

操作包含多行逻辑、嵌套引用、复用行为、多个动态输入或详细错误处理时，应使用 `.py` 文件。动态值通过 `sys.argv` 传递，不插入 Python 源码。

### 复核清单

- 简单固定命令直接执行，不增加无意义的包装层。
- 动态值保持为参数，不进入 Shell 或 Python 源码。
- Python 子进程使用参数列表、明确工作目录和 `shell=False`，除非确实需要 Shell 行为。
- 编码匹配被调用工具，结构化数据不使用静默替换解码。
- 非零退出、启动失败和超时都保留有用输出与上下文。
- 成功由完成状态和退出码决定，不以 stderr 是否为空判断。
