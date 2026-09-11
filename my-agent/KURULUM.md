# Kendi bilgisayarınızda kurulum

Bu klasör (`my-agent/`) agent'ın tüm tasarımını taşıyor. Anahtarlar burada **yok** —
onları kendi bilgisayarınızda `.env` dosyasına yazacaksınız, hiçbir yere gönderilmeyecek.

> Ön koşul: bilgisayarınızda **git** kurulu olmalı. Yoksa: macOS'te `xcode-select --install`,
> Windows'ta [git-scm.com/downloads/win](https://git-scm.com/downloads/win) (Windows'ta ayrıca
> Claude Code'un düzgün çalışması için Git for Windows önerilir).

## 1. Claude Code'u kurun

**macOS / Linux** — Terminal'i açıp:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows** — PowerShell'i açıp:
```powershell
irm https://claude.ai/install.ps1 | iex
```

Sonra bir kere giriş yapın:
```bash
claude
```
Tarayıcı açılır, claude.ai hesabınızla giriş yaparsınız. (Aynı hesap.)

## 2. Depoyu bilgisayarınıza çekin

```bash
git clone https://github.com/burakuscubukus/launch-your-agent.git
cd launch-your-agent
git checkout claude/launch-your-agent-review-u4zpqq
```

## 3. Anahtarları yazın

`my-agent/` klasöründe `.env.example` diye bir dosya var. Kopyasını `.env` adıyla oluşturun:

```bash
cd my-agent
cp .env.example .env
chmod 600 .env
```

Şimdi `.env` dosyasını herhangi bir metin düzenleyiciyle açın:

- **macOS:** `open -t .env`
- **Windows:** `notepad .env`
- **Linux:** `nano .env`

İçini şöyle doldurun (tırnak yok, eşittir işaretinin etrafında boşluk yok):

```
ANTHROPIC_API_KEY=sk-ant-buraya-kendi-anahtariniz
TWITTERAPI_IO_KEY=buraya-twitterapi-io-anahtariniz
```

Kaydedip kapatın.

| Anahtar | Nereden alınır |
|---|---|
| `ANTHROPIC_API_KEY` | platform.claude.com → API keys → Create key. Hangi workspace'te oluşturduğunuzu not edin. |
| `TWITTERAPI_IO_KEY` | twitterapi.io → e-postayla kayıt (kart istemiyor) → Dashboard → API Key |

## 4. Canlıya alın

```bash
./launch.sh
```

Adım adım ilerler, her ID'yi `IDS.env`'e yazar. Yarıda kalırsa tekrar çalıştırın —
zaten oluşmuş nesneleri atlar.

## 5. Devam etmek için

Klasörün içinden Claude Code'u açıp kaldığımız yerden devam edebilirsiniz:

```bash
cd ..          # launch-your-agent klasörüne
claude
```

Sonra:
```
/launch-your-agent
```
ve "my-agent klasörü hazır, canlıya alıp ilk raporu değerlendirelim" deyin.

Detaylı komutlar (çalışmayı izleme, raporu indirme, hesap listesini değiştirme): `LAUNCH.md`
