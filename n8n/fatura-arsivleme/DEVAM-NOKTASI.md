# n8n Fatura/Dekont Arşivleme — Devam Noktası

**Son durum (26.09.2026):** Adım 3, Soru 1/9'da kalındı — cevap bekleniyor.

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
| 1 | Gmail Trigger | Etiket `Label_2` (Burak'ta bu = "[Imap]/Sent" — YANLIŞ) | ❓ Seçenekler: A) "Muhasebe-Arşiv" etiketi + Gmail filtresi (öneri) · B) etiket yok, ekli tüm mailler · C) başka ad |
| 2 | Gmail Trigger | 15 dk'da bir | ❓ |
| 3 | Lookup in Sheets | "Contacts Whitelist" tablosu | ❓ |
| 4 | Lookup in Sheets | e-posta → kurum satırları | ❓ (bilinenler: mobil.sube@halkbank.com.tr, ekstre@ekstre.yapikredi.com.tr, İş/Ziraat/Vakıf/Garanti/QNB, Akıntürk Petrol, Shell, esarj, Uyumsoft, Birfatura) |
| 5 | Create Company Folder | Ana klasör "Invoices" | ❓ |
| 6 | YYYY/MM | "2026/09" (UTC) | ❓ (mevcut düzen: Türkçe ay adı "Eylül") |
| 7 | Upload To Folder | `zaman-dosyaadı` | ❓ (mevcut düzen: `Halkbank_Dekont_2026-09-25.pdf`) |
| 8 | Upload To Folder | OCR `en`, `YOUR_CREDENTIAL_HERE` etiketleri | ❓ |
| 9 | Ayarlar | Saat dilimi UTC | ❓ (öneri: Europe/Istanbul) |
| 🔒 | Credentials | Gmail/Drive/Sheets | Boş bırakılacak |

## Sıradaki adımlar
4. Gereksiz adımları çıkar, listele.
5. Yapıştırılacak son JSON + kurulum sırası.
