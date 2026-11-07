#!/bin/bash
# Turns one Matterport phone-capture ZIP (one scan point) into a sharp 2:1 panorama.
# usage: scripts/matterport-pano/run.sh "<capture.zip>" <out.png|out.jpg> [width=8192] [exclude.json]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
zip="$1"; out="$2"; width="${3:-8192}"; exclude="${4:-}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
unzip -q "$zip" -d "$work"
swl="$(ls "$work"/*/*.swl | head -1)"
[ -n "$exclude" ] && cp "$exclude" "$work/exclude.json"
python3 "$here/extract-shots.py" "$swl" "$work/hires"
node "$here/reference.mjs" "$work" "$work/ref.jpg"
node "$here/align.mjs" "$work" | tail -1
node "$here/stitch.mjs" "$work" "$out" "$width"
