# Günlük fon & yatırım raporu — Routine sürümü

Her sabah 08:30'da (Türkiye saati) 21 X hesabının son 24 saatini okuyup
dört başlıkta, her maddesi kaynaklı bir rapor üreten zamanlanmış görev.

| Dosya | Ne |
|---|---|
| `routine-prompt.md` | Görevin tam tarifi. Routine her sabah bu metni yeni bir oturuma verir. |

## Kurulum (bir kerelik)

1. **twitterapi.io anahtarı** — twitterapi.io → Sign up (kart istemiyor) → Dashboard → API Key
2. **claude.ai/code** → mesaj kutusunun üstündeki bulut simgesi → ortamın üzerine gel →
   dişli simgesi:
   - **Environment variables** kutusuna: `TWITTERAPI_IO_KEY=...`
   - **Network access** → **Custom** → varsayılanları koru + `api.twitterapi.io` ekle
3. Kaydet. (Ayarlar sadece yeni oturumlarda geçerli olur.)

## Maliyet

Ek fatura yok — Claude aboneliğinizin kullanım limitinden işler.
twitterapi.io: kayıtta 1 $ hediye kredi, sonrası 1000 gönderi = 0,15 $
(bu kullanımda ayda ~0,40 $).

## Managed Agents sürümü

`../my-agent/` klasöründe aynı agent'ın Claude Managed Agents sürümü duruyor
(ayrı faturalanır, Console'da izlenir). İhtiyaç olursa oradan canlıya alınabilir;
tasarım, ölçütler ve hesap listesi ikisinde de aynı.
