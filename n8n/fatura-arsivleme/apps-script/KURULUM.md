# Muhasebe Arşivi — Google Apps Script Kurulumu (ücretsiz, Mac gerekmez)

Gmail etiketi/filtresi, Drive klasörleri, Gönderen Listesi ve Fatura Listesi zaten hazır.

## Sürüm 2'ye geçiş (01.10.2026) — mevcut betiğin yerine
1. https://script.google.com → **Adsız proje** (Muhasebe Arşivi betiğin) → `Kod.gs`.
2. İçindeki her şeyi sil (⌘A → Sil), `muhasebe-arsivi.gs` içeriğini yapıştır → **⌘S**.
3. Üstteki fonksiyon menüsünden **gecmisiArsivle** seç → **Çalıştır**.
   - Yeni izin isterse (Kontrol sayfası için) → **İzin ver**.
   - Bir kez basman yeter: her turda ~1 aylık dilimi işler, sonra 1 dk içinde kendini yeniden başlatır, bugüne gelince durur.
   - 1 Ocak 2026'dan bugüne her şey taranır; daha önce arşivlenen dosyalar tekrar yüklenmez.
   - İlerlemeyi Kontrol sekmesinde tarihlerin ilerlemesinden izleyebilirsin.
4. Kontrol: Drive → Fatura Listesi → alttaki **Kontrol** sekmesi.
   - **ELLE İNDİR** satırları: eki olmayan, linkle gelen faturalar → linke tıkla, PDF'i indir, Fatura/ay klasörüne koy.
   - **KONTROL ET** satırları: banka maili ama ekstre/dekont gibi görünmüyor → bak, gerekiyorsa elle koy.
5. Zamanlayıcı aynen devam eder (her gün 09:00); `kurulum`u tekrar çalıştırmaya gerek yok.

## Sürüm 2'de ne değişti
- Etikete/Gmail filtresine bağımlı değil: bankalar alan adından tanınır (ör. halkbank.com.tr'nin her adresi).
- Aynı adlı farklı belgeler (aynı gün 3 kartın 3 ekstresi) artık birbirini ezmez.
- Her aday mail "Kontrol" sekmesine sonucuyla yazılır; hiçbir şey sessizce atlanmaz.
- Süre sınırına takılırsa kaldığı yeri kaydeder, ertesi çalışmada oradan devam eder.

## İlk kurulum (sıfırdan)
1. Mac'te https://script.google.com → **Yeni proje** → adı: `Muhasebe Arşivi`.
2. Editördeki hazır metni sil; `muhasebe-arsivi.gs` içeriğini yapıştır → **⌘S**.
3. Fonksiyon menüsünden **kurulum** → **Çalıştır** → izinleri ver
   ("Google bu uygulamayı doğrulamadı" → Gelişmiş → Muhasebe Arşivi'ne git → İzin ver).
4. Sonra yukarıdaki 3. ve 4. adımlar.

Durdurmak için: Apps Script → sol menü ⏰ **Tetikleyiciler** → zamanlayıcıyı sil.
