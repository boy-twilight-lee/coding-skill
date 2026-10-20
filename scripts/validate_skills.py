from __future__ import annotations

import argparse
import hashlib
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote


SKILL_NAMES = (
    "command-execution-rules",
    "ts-code-rules",
    "vue-code-rules",
    "css-code-rules",
)
RUNTIME_TEXT_SUFFIXES = {".md", ".py", ".svg", ".txt", ".yaml", ".yml"}
FORMATTED_TEXT_SUFFIXES = {".md", ".py", ".yaml", ".yml"}
HAN_PATTERN = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")
LINK_PATTERN = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
ZH_MARKER_PATTERN = re.compile(r"<zh: [^<>\r\n]+>")


class ValidationReport:
    """Collect validation failures and non-blocking environment warnings."""

    def __init__(self) -> None:
        self.failures: list[str] = []
        self.warnings: list[str] = []

    def fail(self, message: str) -> None:
        """Record a validation failure."""
        self.failures.append(message)

    def warn(self, message: str) -> None:
        """Record a non-blocking validation warning."""
        self.warnings.append(message)


def read_text(path: Path) -> str:
    """Read a controlled repository text file as UTF-8."""
    return path.read_text(encoding="utf-8")


def iter_runtime_files(skill_root: Path):
    """Yield runtime files while excluding human-only translations."""
    for path in skill_root.rglob("*"):
        if path.is_file() and "translation" not in path.relative_to(skill_root).parts:
            yield path


def iter_runtime_text_files(skill_root: Path):
    """Yield UTF-8 runtime files that can contain instructions."""
    for path in iter_runtime_files(skill_root):
        if path.suffix.lower() in RUNTIME_TEXT_SUFFIXES:
            yield path


def check_runtime_language(root: Path, report: ValidationReport) -> None:
    """Reject Chinese characters outside translation directories."""
    for skill_name in SKILL_NAMES:
        for path in iter_runtime_text_files(root / skill_name):
            for line_number, line in enumerate(read_text(path).splitlines(), start=1):
                if HAN_PATTERN.search(line):
                    report.fail(f"Chinese character outside translation: {path}:{line_number}")


def check_translation_pairs(root: Path, report: ValidationReport) -> None:
    """Require a one-to-one mapping between references and translations."""
    for skill_name in SKILL_NAMES:
        skill_root = root / skill_name
        reference_root = skill_root / "references"
        translation_root = root / "translation" / skill_name
        legacy_translation_root = skill_root / "translation"
        if legacy_translation_root.exists():
            report.fail(f"Translation directory must be outside the skill package: {legacy_translation_root}")
        references = {path.stem for path in reference_root.glob("*.md")}
        translations = {
            path.stem.removesuffix("-cn")
            for path in translation_root.glob("*-cn.md")
        }
        for missing in sorted(references - translations):
            report.fail(f"Missing translation: {translation_root / f'{missing}-cn.md'}")
        for extra in sorted(translations - references):
            report.fail(f"Translation has no reference: {translation_root / f'{extra}-cn.md'}")

        for reference_name in sorted(references & translations):
            reference_path = reference_root / f"{reference_name}.md"
            translation_path = translation_root / f"{reference_name}-cn.md"
            english_count = len(re.findall(r"^## Scenario ", read_text(reference_path), re.MULTILINE))
            chinese_count = len(re.findall(r"^## 场景 ", read_text(translation_path), re.MULTILINE))
            if english_count != chinese_count:
                report.fail(
                    "Scenario count mismatch: "
                    f"{reference_path} has {english_count}, {translation_path} has {chinese_count}"
                )


def check_markdown_links(root: Path, report: ValidationReport) -> None:
    """Verify every local Markdown link resolves from its owning file."""
    for path in root.rglob("*.md"):
        if ".git" in path.parts:
            continue
        for match in LINK_PATTERN.finditer(read_text(path)):
            raw_target = match.group(1).strip().strip("<>")
            if raw_target.startswith(("#", "http://", "https://", "mailto:", "codex:")):
                continue
            file_target = unquote(raw_target.split("#", 1)[0])
            if file_target and not (path.parent / file_target).exists():
                report.fail(f"Broken local link in {path}: {raw_target}")


def check_skill_reference_contracts(root: Path, report: ValidationReport) -> None:
    """Require each skill entrypoint to expose and require every reference."""
    for skill_name in SKILL_NAMES:
        skill_root = root / skill_name
        skill_path = skill_root / "SKILL.md"
        skill_text = read_text(skill_path)
        if skill_text.count("## Required Reference Loading") != 1:
            report.fail(f"Missing unique required-reference heading: {skill_path}")
        if skill_name != "command-execution-rules" and skill_text.count("## Core Rules") != 1:
            report.fail(f"Missing unique core-rules heading: {skill_path}")

        _, heading_found, loading_tail = skill_text.partition("## Required Reference Loading")
        loading_section = loading_tail.split("\n## ", 1)[0] if heading_found else ""
        if (
            skill_name != "command-execution-rules"
            and "Every task covered by this skill must open at least one reference." not in loading_section
        ):
            report.fail(f"Missing minimum reference-loading requirement: {skill_path}")
        actual_references = {
            path.relative_to(skill_root).as_posix()
            for path in (skill_root / "references").glob("*.md")
        }
        linked_references: set[str] = set()
        for match in LINK_PATTERN.finditer(loading_section):
            raw_target = unquote(match.group(1).strip().strip("<>").split("#", 1)[0])
            normalized_target = raw_target.replace("\\", "/").removeprefix("./")
            if normalized_target.startswith("references/"):
                linked_references.add(normalized_target)

        for missing in sorted(actual_references - linked_references):
            report.fail(f"Reference is not routed from {skill_path}: {missing}")
        for extra in sorted(linked_references - actual_references):
            report.fail(f"Entrypoint routes a missing reference from {skill_path}: {extra}")


def check_text_formatting(root: Path, report: ValidationReport) -> None:
    """Reject trailing whitespace and missing final newlines in repository text files."""
    for path in root.rglob("*"):
        if not path.is_file() or ".git" in path.parts:
            continue
        if path.suffix.lower() not in FORMATTED_TEXT_SUFFIXES and path.name != "README.md":
            continue
        text = read_text(path)
        for line_number, line in enumerate(text.splitlines(), start=1):
            if line.endswith((" ", "\t")):
                report.fail(f"Trailing whitespace: {path}:{line_number}")
        if text and not text.endswith(("\n", "\r")):
            report.fail(f"Missing final newline: {path}")


def check_runtime_boundaries(root: Path, report: ValidationReport) -> None:
    """Verify runtime docs do not load translations and zh markers are complete."""
    for skill_name in SKILL_NAMES:
        for path in iter_runtime_text_files(root / skill_name):
            text = read_text(path)
            if path.suffix.lower() == ".md" and "translation/" in text:
                report.fail(f"Runtime document references translation content: {path}")
            for line_number, line in enumerate(text.splitlines(), start=1):
                if "<zh:" not in line:
                    continue
                remainder = ZH_MARKER_PATTERN.sub("", line)
                if "<zh:" in remainder:
                    report.fail(f"Malformed zh marker: {path}:{line_number}")


def locate_quick_validator() -> Path | None:
    """Locate the installed skill-creator validator when available."""
    codex_root = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    validator = codex_root / "skills" / ".system" / "skill-creator" / "scripts" / "quick_validate.py"
    return validator if validator.is_file() else None


def run_quick_validators(root: Path, report: ValidationReport) -> None:
    """Run skill-creator validation with bounded subprocess execution."""
    validator = locate_quick_validator()
    if validator is None:
        report.warn("skill-creator quick_validate.py is unavailable; structural checks still ran.")
        return

    for skill_name in SKILL_NAMES:
        try:
            completed = subprocess.run(
                [sys.executable, str(validator), str(root / skill_name)],
                cwd=root,
                shell=False,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=30,
                check=False,
            )
        except subprocess.TimeoutExpired:
            report.fail(f"quick_validate.py timed out for {skill_name}")
            continue
        except OSError as error:
            report.fail(f"quick_validate.py could not start for {skill_name}: {error}")
            continue

        if completed.returncode != 0:
            details = completed.stderr.strip() or completed.stdout.strip() or "no diagnostic output"
            report.fail(f"quick_validate.py failed for {skill_name}: {details}")


def hash_runtime_files(skill_root: Path) -> dict[str, str]:
    """Hash runtime files by skill-relative path for installation comparison."""
    return {
        path.relative_to(skill_root).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in iter_runtime_files(skill_root)
    }


def check_installed_skills(root: Path, report: ValidationReport) -> None:
    """Compare repository runtime files with installed skill copies."""
    codex_root = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))
    installed_root = codex_root / "skills"
    for skill_name in SKILL_NAMES:
        installed_skill = installed_root / skill_name
        if not installed_skill.is_dir():
            report.fail(f"Installed skill is missing: {installed_skill}")
            continue
        source_hashes = hash_runtime_files(root / skill_name)
        installed_hashes = hash_runtime_files(installed_skill)
        if source_hashes != installed_hashes:
            changed_paths = sorted(
                path
                for path in source_hashes.keys() | installed_hashes.keys()
                if source_hashes.get(path) != installed_hashes.get(path)
            )
            report.fail(f"Installed skill differs from source: {skill_name}: {', '.join(changed_paths)}")


def parse_args() -> argparse.Namespace:
    """Parse repository validation options."""
    parser = argparse.ArgumentParser(description="Validate all coding-skill packages and translations.")
    parser.add_argument(
        "--check-installed",
        action="store_true",
        help="also compare runtime files with the installed Codex skill copies",
    )
    return parser.parse_args()


def main() -> int:
    """Run repository checks and return a process-friendly status code."""
    args = parse_args()
    root = Path(__file__).resolve().parent.parent
    report = ValidationReport()

    check_runtime_language(root, report)
    check_translation_pairs(root, report)
    check_markdown_links(root, report)
    check_skill_reference_contracts(root, report)
    check_text_formatting(root, report)
    check_runtime_boundaries(root, report)
    run_quick_validators(root, report)
    if args.check_installed:
        check_installed_skills(root, report)

    for warning in report.warnings:
        print(f"[WARN] {warning}")
    for failure in report.failures:
        print(f"[FAIL] {failure}")
    if report.failures:
        print(f"Validation failed with {len(report.failures)} issue(s).")
        return 1

    print("All skill repository checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
