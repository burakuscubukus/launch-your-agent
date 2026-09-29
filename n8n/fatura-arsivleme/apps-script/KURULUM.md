# Muhasebe Arşivi — Google Apps Script Kurulumu (ücretsiz, Mac gerekmez)

Gmail etiketi/filtresi, Drive klasörleri, Gönderen Listesi ve Fatura Listesi zaten hazır.

1. Mac'te https://script.google.com → **Yeni proje**.
2. Sol üstteki "Adsız proje" → adı: `Muhasebe Arşivi`.
3. Editördeki hazır metni (`function myFunction() {...}`) tamamen sil; `muhasebe-arsivi.gs` içeriğini yapıştır → **⌘S** (kaydet).
4. Üstteki fonksiyon menüsünden **kurulum** seç → **Çalıştır**.
   - "Yetkilendirme gerekli" → **İzinleri incele** → hesabını seç.
   - "Google bu uygulamayı doğrulamadı" → **Gelişmiş** → **Muhasebe Arşivi'ne git (güvenli değil)** → **İzin ver**.
     (Uygulama senin kendi yazdığın betik olduğu için Google doğrulamamış; başkası erişemez.)
   - Altta "Zamanlayıcı kuruldu: her gün 9:00" yazısı görünür.
5. Fonksiyon menüsünden **muhasebeArsivle** seç → **Çalıştır** (ilk deneme: son 7 günün belgeleri arşivlenir).
   Altta "Bitti: X mail, Y dosya arşivlendi…" görünür.
6. Kontrol: Drive → Muhasebe Arşivi → Banka / Fatura klasörleri + Fatura Listesi tablosu.
7. Bir hafta sorunsuz çalışınca Claude'daki eski "Banka ve Fatura Arşivleme" rutinini kapat.

Durdurmak için: Apps Script → sol menü ⏰ **Tetikleyiciler** → zamanlayıcıyı sil.
