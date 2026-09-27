# n8n Fatura/Dekont Arşivleme — Devam Noktası

**Son durum (27.09.2026):** Adım 3, Soru 5/9'da kalındı (ana klasör) — cevap bekleniyor.

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
| 3 | Lookup in Sheets | "Contacts Whitelist" tablosu | ✅ Drive'da oluşturuldu: "Muhasebe Gönderen Listesi" (ID 1NnHUIBy3FT_hu1gygynud-RkqBHyg3j2b1VKT61y1Pw (eskisi çöpe atıldı)), sütunlar email/company/tur |
| 4 | Lookup in Sheets | e-posta → kurum satırları | ✅ 14 satır onaylandı (Foneria çıkarıldı). Liste tam adres eşleşmesi: bankaların kampanya adresleri (ör. kkm@vakifbank.com.tr) listede yok → reklamlar girmez. QNB 'Para transferi bildirimi' ve Eşarj 'aylık kullanım raporu' da gelir. |
| 5 | Create Company Folder | Ana klasör "Invoices" | ❓ Seçenekler: A) Drive'da "Muhasebe Arşivi" > Banka / Fatura alt klasörleri (öneri) · B) tek klasör "Muhasebe Arşivi" · C) başka ad |
| 6 | YYYY/MM | "2026/09" (UTC) | ❓ (mevcut düzen: Türkçe ay adı "Eylül") |
| 7 | Upload To Folder | `zaman-dosyaadı` | ❓ (mevcut düzen: `Halkbank_Dekont_2026-09-25.pdf`) |
| 8 | Upload To Folder | OCR `en`, `YOUR_CREDENTIAL_HERE` etiketleri | ❓ |
| 9 | Ayarlar | Saat dilimi UTC | ❓ (öneri: Europe/Istanbul) |
| 🔒 | Credentials | Gmail/Drive/Sheets | Boş bırakılacak |

## Sıradaki adımlar
4. Gereksiz adımları çıkar, listele.
5. Yapıştırılacak son JSON + kurulum sırası.

## Notlar
- Mac kontrolü (Google Drive for Desktop) bu bulut oturumundan yapılamadı — bilgisayar kontrol aracı bağlı değil. Burak kendisi bakacak.
