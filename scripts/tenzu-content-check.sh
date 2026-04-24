#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <pre|post> <file>" >&2
  exit 2
fi

mode="$1"
file="$2"

if [[ ! -f "$file" ]]; then
  echo "File not found: $file" >&2
  exit 2
fi

run_check() {
  local label="$1"
  local pattern="$2"
  local matched=0

  if grep -nE "$pattern" "$file"; then
    matched=1
  fi

  if [[ "$matched" -eq 1 ]]; then
    echo "[NG] $label" >&2
    return 1
  fi

  echo "[OK] $label"
  return 0
}

status=0

case "$mode" in
  pre)
    run_check "禁止語（世界観/設定/キャラクター等）" "世界観|キャラクター|作中での位置づけ|制作背景|^[[:space:]]*設定[[:space:]]*$|<h[1-6][^>]*>設定</h[1-6]>" || status=1
    ;;
  post)
    run_check "北側国家対等表現" "北側(国家|政府)|北(と|および)南(の)?(両国|両政府|二国)|南北(両国|二国)" || status=1
    run_check "国境断定" "国境(が|は)?(確定|確定した|固定|確定済み)|国境線(が|は)?(確定|固定)" || status=1
    run_check "未発生事件言及" "(発生前|未発生).*(事件|衝突|侵攻)|起きていない(事件|衝突|侵攻)" || status=1
    ;;
  *)
    echo "Unknown mode: $mode" >&2
    exit 2
    ;;
esac

if [[ "$status" -ne 0 ]]; then
  echo "Check failed: $mode" >&2
else
  echo "Check passed: $mode"
fi

exit "$status"
