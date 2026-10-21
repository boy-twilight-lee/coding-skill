"""Package the built local plugin without development dependencies."""

import json
from pathlib import Path
import zipfile


def main() -> int:
    plugin = Path(__file__).resolve().parents[1]
    manifest = json.loads((plugin / "plugin.json").read_text(encoding="utf-8"))
    sources = [plugin / name for name in ["plugin.json", "mcp.json", ".mcp.json", ".codex-plugin/plugin.json", "README.md"]]
    for folder in ["dist", "skills"]:
        sources.extend(item for item in (plugin / folder).rglob("*") if item.is_file())
    required = [plugin / "dist/server.mjs", plugin / "dist/app.html", plugin / "skills/ui-reuse-annotation/SKILL.md"]
    if any(not item.is_file() for item in required):
        raise FileNotFoundError("Run npm run build before packaging the plugin.")
    output_directory = plugin / "artifacts"
    output_directory.mkdir(exist_ok=True)
    archive = output_directory / f"{manifest['name']}-{manifest['version']}.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as package:
        for source in sources:
            package.write(source, source.relative_to(plugin).as_posix())
    with zipfile.ZipFile(archive) as package:
        if package.testzip() is not None:
            raise ValueError("Archive CRC verification failed.")
        names = package.namelist()
        assert "plugin.json" in names and "dist/server.mjs" in names
        assert all("node_modules" not in name.split("/") for name in names)
        assert all(not name.startswith("artifacts/") for name in names)
        json.loads(package.read("plugin.json"))
        json.loads(package.read("mcp.json"))
    print(f"Created and verified {archive} ({len(names)} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
