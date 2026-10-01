# Muhasebe Arşivi — n8n Kurulum Sırası

Hazır olanlar (Drive'da): Muhasebe Arşivi > Banka · Fatura klasörleri, Muhasebe Gönderen Listesi (21 adres), Fatura Listesi tablosu.

## A. Gmail (5 dk)
1. Gmail → sol menü → **+ Yeni etiket** → adı: `Muhasebe-Arşiv`
2. **Filtre 1 — bilinen göndericiler:** arama çubuğundaki ayar simgesi → **Kimden** kutusuna şunu yapıştır:
   `mobil.sube@halkbank.com.tr OR bilgilendirme@ileti.isbank.com.tr OR ziraat@ileti.ziraatbank.com.tr OR ziraatbankasi@ileti.ziraatbank.com.tr OR ekstre@vakifbank.com.tr OR dekont@garantibbva.com.tr OR email@email.qnb.com.tr OR ekstre@ekstre.yapikredi.com.tr OR halkyatirim@e.halkyatirim.com.tr OR bilgilendirme@akinturk.com OR bilgilendirme2@akinturk.com OR EARSIVFATURA@turkiyeshell.com OR no-reply@esarj.com OR uyumsoft@erp.uyumsoftmail.com OR noreply@booking.com OR noreply-payments@booking.com OR customer.service@booking.com OR customer.service-tr@cars.booking.com OR birfatura@ebelgebildirimi.com OR notification@m.zotlo.com OR noreply@gediz.com`
   → **Eki olan** ✓ → **Filtre oluştur** → **Etiketi uygula: Muhasebe-Arşiv** ✓ → Filtre oluştur.
3. **Filtre 2 — diğer tüm faturalar:** ayar simgesi → **Şu kelimeleri içeren** kutusuna:
   `fatura OR e-arşiv OR earşiv OR e-fatura OR makbuz OR invoice`
   → **Eki olan** ✓ → Filtre oluştur → **Etiketi uygula: Muhasebe-Arşiv** ✓ → Filtre oluştur.

## B. n8n (10 dk)
4. n8n hesabına gir (n8n Cloud ya da kendi sunucun) → **Create Workflow** (yeni boş akış).
5. `muhasebe-arsivi.json` dosyasının içeriğini kopyala → boş tuvale tıkla → **Ctrl+V / Cmd+V**. 16 kutu görünür.
   (Alternatif: sağ üstte **⋯ → Import from File** ile dosyayı seç.)
6. **Hesapları bağla** (kırmızı uyarılı kutular). Kendi Google hesabınla giriş yap; anahtar/şifre yazman gerekmez:
   - `Her Sabah 09:00 - Gmail` → Credential: **Gmail OAuth2** → Create new → Sign in with Google
   - `Gönderen Listesini Oku` ve `Fatura Listesine Ekle` → **Google Sheets OAuth2**
   - 5 Drive kutusu (Kurum/Ay Klasörünü Ara, Kurum/Ay Klasörünü Oluştur, Drive'a Yükle) → **Google Drive OAuth2** (ilk kutuda oluştur, diğerlerinde listeden seç)
7. İki tablo kutusunu aç, **Sheet** alanında sayfa adının göründüğünü kontrol et; boşsa listeden ilk sayfayı seç.

## C. Deneme (5 dk) — dışarıya hiçbir şey gönderilmez
8. Gmail'de bir Halkbank dekontuna ve bir Shell faturasına **elle** `Muhasebe-Arşiv` etiketi koy.
9. n8n'de `Her Sabah 09:00 - Gmail` kutusunu aç → **Fetch Test Event** → sonra **Test Workflow**.
10. Kontrol: Drive → Muhasebe Arşivi → Banka/Halkbank/2026-09 Eylül ve Fatura/Shell/… klasörlerinde dosya var mı? **Fatura Listesi** tablosuna Shell satırı düştü mü?

## D. Açma
11. Deneme doğruysa sağ üstte **Inactive → Active**. Bundan sonra her sabah 09:00'da kendi çalışır.
12. Bir hafta sorunsuz çalışınca Claude'daki eski **"Banka ve Fatura Arşivleme"** rutinini kapat (aynı belgeler iki kez arşivlenmesin).

## Bilinen sınırlar (sonraki sürüm fikirleri)
- Açılıştan **önceki** mailler otomatik arşivlenmez (istenirse tek seferlik geçmiş aktarımı yapılabilir).
- Link ile gelen faturalar (Migros, Hepsiburada, Apple) alınamaz.
- Tutar / fatura no tabloya yazılmaz (UBL-XML veya yapay zekâ adımı ile eklenebilir).
