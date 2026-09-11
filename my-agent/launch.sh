#!/usr/bin/env bash
# gunluk-fon-raporu — adım adım, yeniden çalıştırılabilir canlıya alma.
# Her adım IDS.env'i okur; zaten oluşmuş nesneyi atlar. Yarıda kalırsa tekrar çalıştırın.
set -euo pipefail
cd "$(dirname "$0")"

set -a; source .env; set +a
[ -f IDS.env ] && { set -a; source IDS.env; set +a; }

: "${ANTHROPIC_API_KEY:?.env icinde ANTHROPIC_API_KEY bos}"
: "${TWITTERAPI_IO_KEY:?.env icinde TWITTERAPI_IO_KEY bos}"

BASE=https://api.anthropic.com/v1
H=(-H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" \
   -H "anthropic-beta: managed-agents-2026-04-01" -H "content-type: application/json")

jget() { python3 -c "import json,sys;d=json.JSONDecoder(strict=False).decode(open(sys.argv[1]).read());print(d$2)" "$1"; }
save() { echo "$1=$2" >> IDS.env; export "$1=$2"; echo "  ✅ $1=$2"; }

# ── 0. model ────────────────────────────────────────────────────────────────
if [ -z "${MODEL_ID:-}" ]; then
  curl -sS "$BASE/models" "${H[@]:0:4}" -o /tmp/models.json
  MODEL_ID=$(python3 -c "
import json
d=json.load(open('/tmp/models.json'))
ids=[m['id'] for m in d['data']]
opus=[i for i in ids if 'opus' in i]
print(sorted(opus)[-1] if opus else ids[0])")
  save MODEL_ID "$MODEL_ID"
fi

# ── 1. environment ──────────────────────────────────────────────────────────
if [ -z "${ENV_ID:-}" ]; then
  curl -sS --fail-with-body "$BASE/environments" "${H[@]}" -d @environment.json -o /tmp/env.json
  save ENV_ID "$(jget /tmp/env.json "['id']")"
fi

# ── 2. vault + twitterapi.io anahtari ───────────────────────────────────────
if [ -z "${VAULT_ID:-}" ]; then
  curl -sS --fail-with-body "$BASE/vaults" "${H[@]}" \
    -d '{"display_name":"Burak Cubuk"}' -o /tmp/vault.json
  save VAULT_ID "$(jget /tmp/vault.json "['id']")"

  python3 -c "
import json,os
json.dump({'display_name':'twitterapi.io okuma anahtari',
 'auth':{'type':'environment_variable','secret_name':'TWITTERAPI_IO_KEY',
         'secret_value':os.environ['TWITTERAPI_IO_KEY'],
         'networking':{'type':'limited','allowed_hosts':['api.twitterapi.io']}}},
 open('/tmp/cred.json','w'))"
  curl -sS --fail-with-body "$BASE/vaults/$VAULT_ID/credentials" "${H[@]}" -d @/tmp/cred.json -o /tmp/credresp.json
  rm -f /tmp/cred.json
  echo "  ✅ vault credential: TWITTERAPI_IO_KEY"
fi

# ── 3. agent ────────────────────────────────────────────────────────────────
if [ -z "${AGENT_ID:-}" ]; then
  python3 -c "
import json
a=json.load(open('agent.json')); a['model']='$MODEL_ID'
json.dump(a,open('/tmp/agent.json','w'),ensure_ascii=False)"
  curl -sS --fail-with-body "$BASE/agents" "${H[@]}" -d @/tmp/agent.json -o /tmp/agentresp.json
  save AGENT_ID "$(jget /tmp/agentresp.json "['id']")"
  save AGENT_VERSION "$(jget /tmp/agentresp.json "['version']")"
fi

# ── 4. session ──────────────────────────────────────────────────────────────
python3 -c "
import json
json.dump({'agent':'$AGENT_ID','environment_id':'$ENV_ID',
           'title':'gunluk fon raporu - ilk calisma','vault_ids':['$VAULT_ID']},
          open('/tmp/session.json','w'))"
curl -sS --fail-with-body "$BASE/sessions" "${H[@]}" -d @/tmp/session.json -o /tmp/sessresp.json
SESSION_ID=$(jget /tmp/sessresp.json "['id']")
save SESSION_ID "$SESSION_ID"

# ── 5. kickoff (outcome) ────────────────────────────────────────────────────
python3 -c "
import json
task=open('first_prompt.txt').read(); rubric=open('outcome.md').read()
json.dump({'events':[{'type':'user.define_outcome','description':task,
  'rubric':{'type':'text','content':rubric},'max_iterations':3}]},
  open('/tmp/kickoff.json','w'),ensure_ascii=False)"
curl -sS --fail-with-body "$BASE/sessions/$SESSION_ID/events" "${H[@]}" -d @/tmp/kickoff.json -o /tmp/kick.json
echo "  ✅ ▶️ calisma basladi: $SESSION_ID"
echo
echo "Console: https://platform.claude.com/workspaces/default/sessions/$SESSION_ID"
