from __future__ import annotations

import pathlib
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "README.md",
    ".env.example",
    ".gitignore",
    "docs/architecture.md",
    "docs/roadmap.md",
    "docs/publication_audit.md",
    "docs/publication_checklist.md",
    "docs/publication_summary.md",
    "docs/demo_fixtures.md",
    "docs/assets/README.md",
    "fixtures/briefs/demo_brief.json",
    "fixtures/sources/demo_sources.json",
    "fixtures/payloads/demo_board_payload.json",
    "shared/schemas/run-request.schema.json",
    "shared/schemas/board-payload.schema.json",
]

FORBIDDEN_PATH_PARTS = [
    ".sisyphus",
    "logs",
    ".env.local",
    ".next",
    "node_modules",
]

FORBIDDEN_STRINGS = [
    "-".join(["gemini", "creative", "agent", "490117"]),
    ".".join(["creative-agent-api-xjctrjpajq-uc", "a", "run", "app"]),
    "-".join(["x", "backend", "access", "key"]),
    "_".join(["BACKEND", "ACCESS", "KEY"]) + "=tp42H",
    "_".join(["APP", "SESSION", "SECRET"]) + "=dC_",
    "-".join(["judge", "access", "password"]),
    "-".join(["colleague", "access", "password"]),
    "gs://" + "-".join(["gemini", "creative", "agent"]),
]


def iter_text_files() -> list[pathlib.Path]:
    paths: list[pathlib.Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if ".git" in path.parts:
            continue
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp3", ".aiff", ".woff", ".woff2"}:
            continue
        paths.append(path)
    return paths


def main() -> int:
    errors: list[str] = []

    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            errors.append(f"missing required file: {rel}")

    for path in ROOT.rglob("*"):
        if ".git" in path.parts:
            continue
        if any(part in FORBIDDEN_PATH_PARTS for part in path.parts):
            errors.append(f"forbidden path present: {path.relative_to(ROOT)}")

    for path in iter_text_files():
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for forbidden in FORBIDDEN_STRINGS:
            if forbidden in text:
                errors.append(f"forbidden string found in {path.relative_to(ROOT)}: {forbidden}")

    if errors:
        print("Publication readiness audit: FAILED")
        for item in errors:
            print(f"- {item}")
        return 1

    print("Publication readiness audit: PASS")
    print(f"Checked {len(iter_text_files())} text files under {ROOT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
