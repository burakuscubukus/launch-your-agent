# Sonraki yönler — günlük fon & yatırım raporu

v0'a girmeyen her şey burada, numaralı sürümler hâlinde. "Şimdi değil" her zaman "işte tam olarak nasıl" ile birlikte.

---

## v1 — bir sonraki tur

### 1. Raporun WhatsApp'a kendiliğinden düşmesi
- **Ne:** `whatsapp.txt`'i kopyalamak yerine raporun doğrudan telefonunuza gelmesi.
- **Neden v0'da yok:** Kapsam dışı — dışarıya mesaj gönderen bir eylem, önce raporun kendisinin doğru olduğundan emin olalım.
- **Nasıl:** İki yol var. (a) WhatsApp Business API sağlayıcısı (Twilio / 360dialog) — vault'a `environment_variable` tipinde bir token, agent'a tek bir `curl` adımı, toolset'te `always_ask` kapısı. (b) Daha ucuz yol: e-posta sağlayıcısı (Resend/SMTP) üzerinden kendinize e-posta, telefonda bildirim olarak görürsünüz.

### 2. TEFAS ile sayısal doğrulama
- **Ne:** "Şu fon %X getirdi" gibi iddiaları TEFAS'ın kamuya açık verisiyle çapraz kontrol etmek.
- **Neden v0'da yok:** Kapsam dışı — önce X tarafı otursun.
- **Nasıl:** Agent'a TEFAS sorgusu ekle (`tefas.gov.tr` fon karşılaştırma uç noktası, ücretsiz), Outcome'a "sayısal iddialar TEFAS ile doğrulandı" ölçütü ekle, agent sürümünü bir artır.

### 3. Hesap listesini büyütmek / budamak
- **Ne:** Takip listesine hesap eklemek veya çıkarmak.
- **Neden v0'da yok:** Liste sistem talimatında sabit; değiştirmek agent güncellemesi demek.
- **Nasıl:** `agent.json` içindeki hesap listesini düzenle → `POST /v1/agents/$AGENT_ID` ile güncelle (mevcut `version` ile) → `IDS.env`'deki sürüm numarasını artır → deployment otomatik olarak yeni sürümü kullanır.

---

## v2 — sonrası

### 4. Hafıza deposu: "dünkü konunun devamı"
- **Ne:** Agent'ın dün ne raporladığını hatırlaması; aynı haberi iki gün üst üste yeni gibi sunmaması, gelişen konuları "bu, dünkü şu konunun devamı" diye işaretlemesi.
- **Neden v0'da yok:** Kapsam dışı — günlük 24 saatlik pencerede tekrar sorunu küçük; önce gerçek raporları görelim.
- **Nasıl:** `POST /v1/memory_stores` ile bir 🧠 Memory store aç, session/deployment `resources` dizisine `read_write` olarak bağla; agent her çalışma sonunda o günün başlıklarını yazsın, ertesi gün okusun.

### 5. Ağ erişimini kısmak
- **Ne:** Environment'ın internet erişimini sadece gerekli adreslere açmak.
- **Neden v0'da yok:** Sertleştirme — agent şu an sadece okuyor, `unrestricted` sorun değil.
- **Nasıl:** Environment'ı `networking: {"type":"limited","allowed_hosts":["api.twitterapi.io","x.com","*.x.com"]}` ile yeniden oluştur.

### 6. Haftalık toplu bakış
- **Ne:** Günlük raporların yanına haftada bir "bu hafta ne oldu" özeti.
- **Neden v0'da yok:** Kapsam dışı.
- **Nasıl:** İkinci bir 🗓️ Deployment (`0 9 * * 1`, Europe/Istanbul), aynı agent, farklı kickoff metni: son 7 günün raporlarını hafıza deposundan okuyup toparlasın.

---

## Süreç alışkanlığı

- **Yeni bir agent sürümünü deployment'a almadan önce `evals/` altındaki vakaları yeniden çalıştır.** Ölçütler hâlâ geçiyorsa deployment'ı güncelle; geçmiyorsa eski sürümde kal.
- Hesap listesi veya rapor biçimi değişince Outcome ölçütlerini de gözden geçir — ölçüt güncellenmezse notlama yanıltıcı olur.
