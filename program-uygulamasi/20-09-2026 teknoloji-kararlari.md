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
