#!/usr/bin/env bash
set -euo pipefail

FILE="docs/wikipedia-rework-tasks.json"

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <task_id> <status> <date:YYYY-MM-DD>"
  exit 1
fi

TASK_ID="$1"
NEW_STATUS="$2"
DATE="$3"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required"
  exit 1
fi

python3 - "$FILE" "$TASK_ID" "$NEW_STATUS" "$DATE" <<'PY'
import json, sys

file, task_id, new_status, date = sys.argv[1:]
allowed = {"todo", "in_progress", "blocked", "review", "done"}
if new_status not in allowed:
    raise SystemExit(f"Invalid status: {new_status}. allowed={sorted(allowed)}")

with open(file, "r", encoding="utf-8") as f:
    data = json.load(f)

found = False
for t in data.get("tasks", []):
    if t.get("id") == task_id:
        t["status"] = new_status
        found = True
        break

if not found:
    raise SystemExit(f"Task not found: {task_id}")

data["last_updated"] = date

with open(file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(f"Updated {task_id} -> {new_status} ({date})")
PY
