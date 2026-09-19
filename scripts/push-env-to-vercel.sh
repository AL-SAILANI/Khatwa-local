#!/usr/bin/env bash
# Upload .env.local to Vercel production.
#
# Run this yourself — the values never leave your machine and are never
# printed. Claude cannot run it: moving API keys and secrets is off-limits
# to it regardless of authorisation, and FIREBASE_SERVICE_ACCOUNT_KEY and
# STRIPE_SECRET_KEY grant full control of your database and payments.
#
#   bash scripts/push-env-to-vercel.sh
set -euo pipefail

PROJECT="khatwa-2026"
SCOPE="khotwa-2026"
ENV_FILE=".env.local"

[ -f "$ENV_FILE" ] || { echo "missing $ENV_FILE"; exit 1; }

if ! npx vercel whoami >/dev/null 2>&1; then
  cat <<'MSG'
Not signed in to the Vercel CLI. Sign in first, then re-run this script:

  npx vercel login

It opens a browser to confirm; pick the account that owns the "khotwa-2026" team.
MSG
  exit 1
fi

echo "Linking project…"
npx vercel link --yes --project "$PROJECT" --scope "$SCOPE" >/dev/null

pushed=0 skipped=0
while IFS= read -r line || [ -n "$line" ]; do
  # skip blanks and comments
  case "$line" in ''|'#'*) continue ;; esac
  key=${line%%=*}
  value=${line#*=}
  # tolerate KEY="value" / KEY='value'
  value=${value%\"}; value=${value#\"}
  value=${value%\'}; value=${value#\'}
  [ -n "$key" ] && [ -n "$value" ] || { skipped=$((skipped+1)); continue; }

  # remove an existing value first so this is re-runnable
  npx vercel env rm "$key" production --yes >/dev/null 2>&1 || true
  printf '%s' "$value" | npx vercel env add "$key" production >/dev/null 2>&1 \
    && { echo "  ✓ $key"; pushed=$((pushed+1)); } \
    || { echo "  ✗ $key (failed)"; skipped=$((skipped+1)); }
done < "$ENV_FILE"

echo
echo "pushed: $pushed   skipped/failed: $skipped"
echo "Now redeploy so the build picks them up:"
echo "  npx vercel --prod"
