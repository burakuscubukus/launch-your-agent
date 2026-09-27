# n8n Fatura/Dekont Arşivleme — Devam Noktası

**Son durum (27.09.2026):** ✅ 5 adım tamamlandı. Son akış: `muhasebe-arsivi.json` (16 kutu), kurulum: `KURULUM.md`. Fatura Listesi tablosu: 1xtZVYBzYug25gdGftn_B89OujbZyJ4CPBbh9VPTFZWM. Sırada: Burak'ın kurulumu ve deneme sonucu.

## Kurallar (Burak)
- Her adımdan sonra dur, onay al.
- Hesap anahtarları hiçbir yere yazılmaz; credential alanları boş kalır.
- Dışarıya mesaj gönderen adım ilk turda kapalı (bu akışta mesaj gönderen adım yok).
- Depoda olmayan akış anlatılmaz.

## Tamamlanan adımlar
1. **İş:** Gmail'e gelen banka dekontu + faturaları her gün klasörlere arşivlemek (bugün Mac'e bağlı "Banka ve Fatura Arşivleme" rutini yapıyor, Mac kapalıyken çalışmıyor).
2. **Seçilen akış:** `Zie619/n8n-workflows` → `workflows/Googlesheets/0837_GoogleSheets_Gmail_Create_Triggered.json` (kopyası: `0837-orijinal.json`).
   Diğer adaylar: 1764 (OpenAI gerekiyor), 0544 (ayrım yok).
   ⚠️ Depodaki dosyada bağlantılar (connections) kopuk — 5. adımda yeniden kurulacak.

## Adım 3 — doldurulacak 9 değer
| # | Kutu | Şablon değeri | Cevap |
|---|---|---|---|
| 1 | Gmail Trigger | Etiket `Label_2` (Burak'ta bu = "[Imap]/Sent" — YANLIŞ) | ✅ **A** — "Muhasebe-Arşiv" etiketi + Gmail filtresi (kurulumda birlikte açılacak) |
| 2 | Gmail Trigger | 15 dk'da bir | ✅ Günde bir kez, her sabah 09:00 (Europe/Istanbul) |
| 3 | Lookup in Sheets | "Contacts Whitelist" tablosu | ✅ Drive'da oluşturuldu: "Muhasebe Gönderen Listesi" (ID 13aRMVtfvBn03NsOYtvQOFuLbGvtQUQGIbaFoNL9StyY (eskisi çöpe atıldı)), sütunlar email/company/tur |
| 4 | Lookup in Sheets | e-posta → kurum satırları | ✅ 14 satır onaylandı (Foneria çıkarıldı). Liste tam adres eşleşmesi: bankaların kampanya adresleri (ör. kkm@vakifbank.com.tr) listede yok → reklamlar girmez. QNB 'Para transferi bildirimi' ve Eşarj 'aylık kullanım raporu' da gelir. |
| 5 | Create Company Folder | Ana klasör "Invoices" | ✅ Drive'da oluşturuldu: "Muhasebe Arşivi" (1DoEm3V1euB_RShC2_tHuiz0L4u77-C99) > "Banka" (1r7KXw1yXnMxvGWAQWojoGS9ALH50Fx3T) + "Fatura" (1w88uJWXOnBjLAFaIB6vsjAMYxBvrZfA0). Tablodaki 'tur' sütunu hangisine gideceğini seçer. |
| 6 | YYYY/MM | "2026/09" (UTC) | ✅ A — Banka|Fatura / Kurum / "2026-09 Eylül" (mail tarihi, İstanbul saatiyle) |
| 7 | Upload To Folder | `zaman-dosyaadı` | ✅ A — `2026-09-25_Halkbank_orijinalad.pdf` |
| 8 | Upload To Folder | OCR `en`, `YOUR_CREDENTIAL_HERE` etiketleri | ✅ A — ikisi de kaldırılacak |
| 9 | Ayarlar | Saat dilimi UTC | ✅ Europe/Istanbul |
| 🔒 | Credentials | Gmail/Drive/Sheets | Boş bırakılacak |

## Adım 4 — çıkarılanlar (✅ onaylandı)
- Error Handler (stopAndError): hiçbir yere bağlı değil; depo otomatiğinin eklediği bozuk bağlantılar da siliniyor.
- Gmail (get message) kutusu: tetikleyici ekleri zaten indirebiliyor (downloadAttachments) → gereksiz.
- 6 İngilizce not (sticky note) → yerine 1 kısa Türkçe not.
- Sahte meta bilgiler (tags 'production-ready/excellent', '25 nodes' açıklaması, owner/priority vb.).
- Dışarıya mesaj gönderen adım: YOK (şablonda hiç yok).
Adım 5'te eklenecek/düzeltilecek: bağlantıları yeniden kur; listede olmayan göndericide dur (filtre); kurum klasörünü sadece Banka/Fatura içinde ara; eski 'function' kutusunu 'Code' ile değiştir; ay adı + dosya adı + saat dilimi.

## Sıradaki adımlar
5. Yapıştırılacak son JSON + kurulum sırası.

## Notlar
- Mac kontrolü (Google Drive for Desktop) bu bulut oturumundan yapılamadı — bilgisayar kontrol aracı bağlı değil. Burak kendisi bakacak.
- Sonraki sürüm fikri (v1): PDF içinden 'Alış/Satış', tutar gibi bilgiyi okuyup dosya adına/tabloya yazmak (yapay zekâ adımı gerekir).

## Yeni gönderici araştırması (27.09)
Ekli fatura gelenler (akış alabilir): Booking (noreply@booking.com, noreply-payments@booking.com, customer.service@booking.com, customer.service-tr@cars.booking.com), Birfatura (birfatura@ebelgebildirimi.com), Zotlo (notification@m.zotlo.com), Gediz Elektrik (noreply@gediz.com — bazen ekli, bazen sadece link), Gourme Coffee (mail@gourmecoffee.com — sipariş onayı, ek fatura mı belirsiz).
Sadece link/gövde (akış ALAMAZ): Migros (duyuru@email.migros.com.tr — sadece sipariş onayı), Hepsiburada (link), Apple (makbuz mail gövdesinde), KKB/visionplus (bilgi), Gediz çoğu ay.
Soru: Kişisel harcamalar (Booking tatil, Apple, eSIM) için ayrı 'Kişisel' türü/klasörü?
v1 fikri: link/gövde faturalarını PDF'e çevirip arşivlemek.

## 27.09 — Karar B + yeni istek
- B: 7 yeni adres eklendi (Booking x4, Birfatura, Zotlo, Gediz) → hepsi Fatura. Tablo yeniden oluşturuldu: 13aRMVtfvBn03NsOYtvQOFuLbGvtQUQGIbaFoNL9StyY (önceki çöpte).
- Burak'ın asıl isteği: (1) gelen her e-fatura/e-arşiv o ayın FATURA LİSTESİ tablosuna satır olarak eklensin (faturaları bu maile yönlendiriyor → anlık "hangi faturalar geldi" görünümü); (2) banka özetleri/ekstreleri arşivlensin.
- Önerilen tasarım (onay bekliyor): Gmail filtresi = banka adresleri + "has:attachment (fatura OR e-arşiv OR e-fatura)"; listede olmayan gönderen → tur=Fatura, kurum=gönderen adı; Fatura türü için "Fatura Listesi" tablosuna satır (Ay, Tarih, Firma, Konu, Dosya, Drive linki). Tablo ekleme adımı depodaki 1764 akışının "Append to Reconciliation Sheet" kutusundan uyarlanacak. Tutar/Fatura No → v1 (UBL-XML veya yapay zekâ).

## 27.09 — Gmail kurulumu
- ✅ Etiket oluşturuldu: "Muhasebe-Arşiv" (Label_10, yeşil).
- Filtreler: Gmail bağlantısında filtre aracı yok. Composio üzerinden (GMAIL_CREATE_FILTER) kurulabilir ama Burak'ın Gmail'i Composio'ya bağlaması gerekiyor — karar bekleniyor.
- Composio Gmail bağlandı (gmail_albian-county) ama filtre oluşturma 403 ACCESS_TOKEN_SCOPE_INSUFFICIENT verdi (varsayılan Composio Gmail izninde filtre yetkisi yok). Yerine `gmail-filtreleri.xml` hazırlandı → Gmail Ayarlar > Filtreler > Filtreleri içe aktar.
