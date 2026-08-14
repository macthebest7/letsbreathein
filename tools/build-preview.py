#!/usr/bin/env python3
"""
Builds preview.html — a single self-contained file that runs the real engine.

It inlines src/app/globals.css and the compiled versions of the same
techniques/engine/audio modules the Next.js app uses, so what you see in the
preview is what the app does. Handy for testing on a phone or sending to
someone without running npm.

Usage:
    npx tsc src/lib/techniques.ts src/lib/engine.ts src/lib/audio.ts \
        --target ES2020 --module esnext --outDir /tmp/dist --strict --skipLibCheck
    python3 tools/build-preview.py /tmp/dist preview.html
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/dist")
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else ROOT / "preview.html")


def strip_module(js: str) -> str:
    js = re.sub(r"^\s*import .*?;\s*$", "", js, flags=re.M)
    js = re.sub(r"^export ", "", js, flags=re.M)
    js = re.sub(r"^\s*export \{[^}]*\};\s*$", "", js, flags=re.M)
    return js


css = (ROOT / "src/app/globals.css").read_text()
lib = "\n".join(strip_module((DIST / f).read_text()) for f in ("techniques.js", "engine.js", "audio.js"))
player = (ROOT / "tools/preview-player.js").read_text()

html = f"""<!doctype html>
<html lang="en" data-theme="system" data-motion="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Breathe — preview</title>
<meta name="description" content="Standalone preview of the Breathe guided breathing player.">
<style>{css}</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div id="app"></div>
<script>
{lib}
{player}
</script>
</body>
</html>
"""

OUT.write_text(html)
print(f"wrote {OUT} ({len(html) / 1024:.0f} KB)")
