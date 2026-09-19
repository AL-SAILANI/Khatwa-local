#!/usr/bin/env bash
# Diagnose where the env upload stopped. Prints names and status only —
# never values.
#
#   bash scripts/check-vercel-env.sh
set -uo pipefail

echo "1) Signed in to Vercel CLI?"
if who=$(npx vercel whoami 2>&1); then
  echo "   yes: $who"
else
  echo "   NO — run: npx vercel login"
  echo "   (everything below will fail until then)"
  exit 1
fi

echo
echo "2) Is this folder linked to the project?"
if [ -f .vercel/project.json ]; then
  echo "   yes: $(python3 -c 'import json;d=json.load(open(".vercel/project.json"));print(d.get("projectId","?"))' 2>/dev/null)"
else
  echo "   NO — run: npx vercel link --yes --project khatwa-2026 --scope khotwa-2026"
fi

echo
echo "3) Environment variables Vercel currently has (names only):"
npx vercel env ls production 2>&1 | sed 's/^/   /'

echo
echo "4) Local .env.local has $(grep -cE '^[A-Z]' .env.local 2>/dev/null || echo 0) variables."
