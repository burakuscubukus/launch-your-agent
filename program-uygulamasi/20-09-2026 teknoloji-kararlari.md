# Teknoloji Kararları — Tutanak

Tarih: 20-09-2026 · Karar veren: Burak Çubuk · Kaydeden: Claude Code
İlgili belge: `20-09-2026 program-uygulamasi-plan.md`

---

## K-1 · Teknoloji yığını — ONAYLANDI

Python (FastAPI) + PostgreSQL + React. Gerekçeler plan belgesi Bölüm 1'de.

## K-2 · Veri kaynağı: Excel ana, PDF yardımcı — ONAYLANDI

| Yetenek | Sürüm | Not |
|---|---|---|
| Excel ile veri yükleme (4+1 şablon) | v1 | Tek doğru kaynak (source of truth) |
| PDF **saklama**: RAM raporunu öğrenci kartına ekleme/görüntüleme | v1 | Risksiz, sadece dosya saklama |
| PDF **okuma**: tanı/uzman bilgisini rapordan otomatik çıkarma | v2 | Her çıkarım kullanıcı onayından geçer, asla doğrudan kaydedilmez |

**Gerekçe:** PDF'den yanlış okunan tanı → yanlış yerleştirme → mevzuat ihlali. Excel'de girilen veri kesindir; taranmış PDF'den okunan veri olasılıktır. Kesin kuralların dayandığı veri olasılık olamaz.

## K-3 · Çok kurumlu mimari (`kurum_id`) — ONAYLANDI, KAPSAM GENİŞLEDİ

İlk sürüm **iki gerçek kurumla** çalışacak:

| kurum_id | Kurum |
|---|---|
| 1 | Osmangazi |
| 2 | Bayraklı |

Her tabloda `kurum_id`; veritabanı seviyesinde kurumlar arası satır sızıntısı engellenir (row-level security).

**Açık tasarım noktası:** Bir öğretmen iki kurumda birden ders veriyorsa, "aynı öğretmen aynı saatte iki yerde olamaz" kontrolü **kurumlar arası** çalışmak zorundadır. Bu, katı kurum izolasyonuna tek istisnadır ve ayrıca tasarlanmalıdır. Karar, açık soru ⑰'nin cevabına bağlı.

## K-4 · Kurulum yeri (yerel / sunucu) — ERTELENDİ

Karar **Adım 12'ye kadar bağlayıcı değil**; geliştirme boyunca uygulama yerel çalışır.

| Seçenek | Özet | Ana risk |
|---|---|---|
| A) İki ayrı yerel kurulum | Her bina kendi başına | İki kurum tek ekranda görülemez; ortak öğretmen çakışması yakalanamaz |
| B) Türkiye'de barındırılan tek sunucu | İki bina + evden erişim, otomatik yedek | Aylık ücret, KVKK yükümlülüğü artar (veri işleyen sözleşmesi) |
| C) Osmangazi'de sunucu + Bayraklı VPN | Veri binada kalır, ücretsiz | O binanın elektrik/internet kesintisi iki kurumu birden durdurur |

**Claude'un önerisi: B.** İki kurumu tek ekranda görmek ve kurumlar arası öğretmen çakışmasını yakalamak, verilerin bir arada olmasını gerektirir.
**Burak'ın ilk tercihi:** kurum içi başlangıç. Nihai karar Adım 12'de verilecek.

## K-5 · KVKK — YAKLAŞIM DEĞİŞTİ (onay bekliyor)

**Reddedilen yaklaşım:** Giriş ekranında tek kutucuk işaretlenince KVKK'nın karşılanmış sayılması.
**Gerekçe (hukuki tavsiye değildir):**
1. Rızayı veli verir, sisteme giren memur değil — memurun tıkladığı kutu öğrenci verisi için hüküm doğurmaz.
2. Aydınlatma ve açık rıza ayrı işlemlerdir; tek kutuda birleştirilirse rıza geçersiz sayılabilir. Özel nitelikli veride (tanı, RAM raporu) denetimin en sık takıldığı nokta.
3. Rıza kâğıtta/imzalı alınır; yazılımın görevi rızayı üretmek değil, **varlığını kanıtlamak**.

**Uygulanacak yaklaşım:** Öğrenciler şablonuna üç sütun eklenir —
`kvkk_aydinlatma_tarihi` · `kvkk_acik_riza_tarihi` · `riza_belge_no`
Biri boşsa öğrenci **kırmızı bayrak** listesine düşer. Denetimde "hepsinin izni var" ifadesi tek tuşla rapora dönüşür.

---

## Açık sorulara eklenen maddeler (iki kurum nedeniyle)

| # | Soru | Neyi belirler |
|---|---|---|
| ⑯ | Bayraklı ayrı MEB kurum kodlu bağımsız kurum mu, aynı kurumun şubesi mi? | Ruhsat/raporlama ayrımı, `kurum` tablosunun alanları |
| ⑰ | **Aynı öğretmen iki kurumda ders veriyor mu?** | Çakışma kuralının kurumlar arası çalışıp çalışmayacağı — en kritik madde |
| ⑱ | Memurlar iki kurumu da mı görecek, yoksa kendi binasını mı? | Yetki matrisi, K-3 izolasyon istisnası |
| ⑲ | Brifingdeki "8 bölge + Bayraklı" servis güzergâhı ile Bayraklı kurumu aynı şey mi? | Güzergâh tablosunun kurumla ilişkisi |

## Sıradaki adım

Açık soruların (①–⑲) cevapları beklenecek; ardından Adım 0 ve 1 için onay istenecek. **Kod yazılmadı.**

---

# EK-1 · 20-09-2026 tarihli güncelleme

Yukarıdaki hiçbir madde silinmedi; K-3 ve K-4'ün açık bırakılan noktaları aşağıda karara bağlandı.

## K-6 · Kurumlar tamamen ayrı işler — KARAR

Burak'ın beyanı: *"Her uzmanın veya öğretmenin girdiği kurum farklı. Girdiği dersler, girdiği öğrenciler farklı. İki ayrı kurum gibi düşün. Ayrı ayrı çalışıp ayrı ayrı onaylar oluyor."*

Buna göre:

| Konu | Karar |
|---|---|
| Öğretmen/uzman paylaşımı | **Yok.** Her personel tek kuruma bağlıdır |
| Öğrenci paylaşımı | **Yok** |
| Onay süreçleri | Kurum başına ayrı yürür |
| K-3'teki "kurumlar arası çakışma kontrolü" istisnası | **İPTAL.** İzolasyon baştan sona katıdır, istisna yoktur |
| Excel dosyaları | Kurum başına ayrı takım (Osmangazi seti / Bayraklı seti). Tek dosyada karıştırılmaz — yanlış kuruma yükleme riski sıfırlanır |

**Kazanç:** daha az kod, daha az hata yüzeyi, KVKK açısından daha savunulabilir bir yapı.

## K-4 güncellemesi · Kurulum yeri: **A seçeneği** — KARAR

Her binaya kendi kurulumu. Aylık sunucu ücreti yok, veri binadan çıkmaz.

**Kabul edilen bedel:** bakım ikiye katlanır — her güncelleme iki binaya ayrı kurulur, yedek iki yerde ayrı alınır. Unutulursa iki bina farklı sürümde kalır. **Çözüm:** Adım 12'de tek komutla çalışan kurulum/güncelleme betiği yazılacak, bu madde o adımın kabul kriterine eklendi.

**Not:** Bu karar Adım 12'ye kadar geri alınabilir. Başka kurumlara satışa geçildiğinde B seçeneği (tek sunucu, çok kurum) yeniden değerlendirilecektir; mimari buna hazır kurulduğu için geçiş kod değişikliği gerektirmez.

## Açık soru durumu

| # | Soru | Durum |
|---|---|---|
| ⑰ | Aynı öğretmen iki kurumda ders veriyor mu? | **CEVAPLANDI: Hayır** → K-6 |
| ⑱ | Memurlar iki kurumu da mı görecek? | **Kısmen:** memur yalnız kendi kurumunu görür. Yöneticinin (Burak) iki kurumu birden görme yetkisi Adım 2'de sorulacak |
| ⑯ | Bayraklı ayrı MEB kurum kodlu mu? | Bekliyor |
| ⑲ | "Bayraklı" güzergâhı ile Bayraklı kurumu aynı şey mi? | Bekliyor |
| ①–⑮ | Plan belgesindeki diğer sorular | Bekliyor |

---

# EK-2 · 20-09-2026 · K-5 revize

Burak'ın beyanı: *"Kurumlarda zaten KVKK ile ilgili imzalar alınmış oluyor. Bu imzaların arasında zaten bu bilgiler de yer alıyor. Kurumlar bu programı kurduğu zaman zaten bunun bilincinde olarak kuracaklar."*

## K-5 (revize) · Ayrı bir KVKK adımı YOK — KARAR

| Konu | Önceki öneri | Yürürlükteki karar |
|---|---|---|
| Yazılımda rıza toplama | Yok (zaten önerilmemişti) | Yok |
| `kvkk_aydinlatma_tarihi`, `kvkk_acik_riza_tarihi`, `riza_belge_no` sütunları | Zorunlu | **İsteğe bağlı**, boş bırakılabilir *(Burak'ın "çıkar" demesi hâlinde tamamen kaldırılır)* |
| Eksik rıza için kırmızı bayrak | Vardı | **İPTAL** |
| Plan belgesindeki KVKK hukuki kontrol listesi | Eylem maddesi | **Sadece referans.** Hiçbir geliştirme adımı buna bağlı değil |

**Gerekçe (Burak'ın kararı):** Rızalar veliden imzayla alınmış ve mevcut bilgiler bu imzaların kapsamında. Yazılımın yeni bir rıza süreci kurmasına gerek yok.

**Zaten yapılacak olanlar (brifingin Bölüm 3'ünden, KVKK adımı olarak değil, güvenlik gereği olarak):** şifreli giriş, rol bazlı yetki, denetim kaydı (Adım 2); veri şifreleme, yedekleme/geri yükleme (Adım 12); test verisinde gerçek öğrenci adı kullanılmaması (tüm adımlar).

**İleriye dönük tek not:** Başka kurumlara satışa geçildiğinde onların verisi açısından taraf sıfatı doğar ve sözleşme gereksinimi gündeme gelir. Bugünkü iki kurum (Osmangazi, Bayraklı) Burak'ın kendi kurumları olduğu için bu durum yoktur. *(Hukuki tavsiye değildir.)*

## Açık soru durumu — güncel

| # | Durum |
|---|---|
| ⑰ Öğretmen paylaşımı | CEVAPLANDI: Hayır (K-6) |
| ⑱ Memur görünürlüğü | Kısmen cevaplandı; yönetici yetkisi Adım 2'de sorulacak |
| ⑯, ⑲ ve ①–⑮ | Bekliyor |
