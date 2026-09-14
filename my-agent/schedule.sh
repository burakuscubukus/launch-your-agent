#!/usr/bin/env bash
# Gunluk 08:30 (Europe/Istanbul) zamanlanmis calistirma.
# ILK RAPORU ONAYLADIKTAN SONRA calistirin — once cikti dogru olsun, sonra takvime baglayalim.
set -euo pipefail
cd "$(dirname "$0")"

set -a; source .env; source IDS.env; set +a
: "${AGENT_ID:?once ./launch.sh calistirin}"
: "${ENV_ID:?once ./launch.sh calistirin}"

BASE=https://api.anthropic.com/v1
H=(-H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" \
   -H "anthropic-beta: managed-agents-2026-04-01" -H "content-type: application/json")

# Takvime baglanan gorev metni HER calistirmada aynen tekrar oynatilir:
# icinde sabit tarih olmamali. first_prompt.txt "son 24 saat" diyor, sabit tarih yok.
if grep -nE '[0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4}|20[0-9]{2}-[0-9]{2}-[0-9]{2}' first_prompt.txt; then
  echo "DUR: first_prompt.txt icinde sabit tarih var. Goreli ifadeye cevirin (\"son 24 saat\")." >&2
  exit 1
fi

python3 -c "
import json
task=open('first_prompt.txt').read(); rubric=open('outcome.md').read()
json.dump({
 'name':'Gunluk fon ve yatirim raporu',
 'agent':'$AGENT_ID',
 'environment_id':'$ENV_ID',
 'vault_ids':['${VAULT_ID:-}'],
 'initial_events':[{'type':'user.define_outcome','description':task,
                    'rubric':{'type':'text','content':rubric},'max_iterations':3}],
 'schedule':{'type':'cron','expression':'30 8 * * *','timezone':'Europe/Istanbul'}
}, open('deployment.json','w'), ensure_ascii=False, indent=2)"

curl -sS --fail-with-body "$BASE/deployments?beta=true" "${H[@]}" -d @deployment.json -o /tmp/dep.json
DEPLOYMENT_ID=$(python3 -c "import json;print(json.JSONDecoder(strict=False).decode(open('/tmp/dep.json').read())['id'])")
echo "DEPLOYMENT_ID=$DEPLOYMENT_ID" >> IDS.env
echo "  ✅ 🗓️ deployment: $DEPLOYMENT_ID"

python3 -c "
import json;d=json.JSONDecoder(strict=False).decode(open('/tmp/dep.json').read())
print('  Sonraki calistirmalar:', d.get('schedule',{}).get('upcoming_runs_at'))"

echo
echo "Cron'a guvenmeden once elle bir kere tetikleyin:"
echo "  curl -sS -X POST -d '{}' \"$BASE/deployments/$DEPLOYMENT_ID/run?beta=true\" \\"
echo "       -H \"x-api-key: \$ANTHROPIC_API_KEY\" -H \"anthropic-version: 2023-06-01\" \\"
echo "       -H \"anthropic-beta: managed-agents-2026-04-01\" -H \"content-type: application/json\""
echo
echo "Console: https://platform.claude.com/workspaces/default/deployments/$DEPLOYMENT_ID"
