# Canlıya alma — gunluk-fon-raporu

## Bir kerelik hazırlık
1. `.env` dosyasını doldurun (bu klasörde, `chmod 600`, git'e girmez):
   ```
   ANTHROPIC_API_KEY=sk-ant-...      # platform.claude.com → API keys
   TWITTERAPI_IO_KEY=...             # twitterapi.io → Dashboard → API Key
   ```
2. Çalıştırın:
   ```bash
   ./launch.sh
   ```

`launch.sh` adım adım ilerler ve her ID'yi `IDS.env`'e yazar. Yarıda kalırsa tekrar çalıştırın —
zaten oluşmuş nesneleri atlar, baştan kurmaz.

## Ne oluşturuyor
| Adım | Ne | Nereye kaydediliyor |
|---|---|---|
| 0 | Model seçimi (en yeni Opus sınıfı) | `MODEL_ID` |
| 1 | 📦 Environment — bulut kum havuzu | `ENV_ID` |
| 2 | 🔐 Vault + `TWITTERAPI_IO_KEY` kimlik bilgisi | `VAULT_ID` |
| 3 | 🤖 Agent (v1) | `AGENT_ID`, `AGENT_VERSION` |
| 4 | ▶️ Session — tek çalışma | `SESSION_ID` |
| 5 | 🎯 Outcome kickoff — görev + kontrol listesi | — |

## Çalışmayı izlemek
```bash
set -a; source .env; source IDS.env; set +a
BASE=https://api.anthropic.com/v1
H=(-H "x-api-key: $ANTHROPIC_API_KEY" -H "anthropic-version: 2023-06-01" \
   -H "anthropic-beta: managed-agents-2026-04-01" -H "content-type: application/json")

curl -sS "$BASE/sessions/$SESSION_ID" "${H[@]}" -o /tmp/sess.json
python3 -c "import json;d=json.JSONDecoder(strict=False).decode(open('/tmp/sess.json').read());print(d['status'],[e.get('result') for e in d.get('outcome_evaluations',[])])"
```

## Raporu almak (çalışma `idle` olduktan sonra)
```bash
curl -sS "$BASE/files?scope_id=$SESSION_ID" "${H[@]}" | python3 -c "import json,sys;[print(f['id'],f['filename']) for f in json.load(sys.stdin)['data']]"
curl -sS "$BASE/files/<FILE_ID>/content" "${H[@]}" -o whatsapp.txt
```

## Yeniden çalıştırmak (aynı agent, yeni rapor)
`launch.sh`'ı tekrar çalıştırmak yeni bir session açar ve aynı görevi yeniden verir.
Environment, vault ve agent yeniden oluşturulmaz.

## Hesap listesini değiştirmek
`agent.json` içindeki listeyi düzenleyin, sonra:
```bash
python3 -c "
import json;a=json.load(open('agent.json'))
json.dump({'version':int('$AGENT_VERSION'),'system':a['system']},open('/tmp/upd.json','w'),ensure_ascii=False)"
curl -sS --fail-with-body "$BASE/agents/$AGENT_ID" "${H[@]}" -d @/tmp/upd.json
```
Dönen yeni `version` değerini `IDS.env` içindeki `AGENT_VERSION` ile değiştirin.
