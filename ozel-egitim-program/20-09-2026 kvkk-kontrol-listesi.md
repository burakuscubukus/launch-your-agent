# KVKK Kontrol Listesi — Özel Nitelikli Veri (Sağlık/Tanı)

Tarih: 20-09-2026

> **Ben hukukçu değilim, bu hukuki tavsiye değildir.** Aşağıdaki liste, uygulamayı kurarken teknik tarafta yapacaklarımızın ve senin hukuk tarafında bir avukat/danışmanla teyit etmen gereken başlıkların kontrol listesidir. Nihai metinleri (aydınlatma, açık rıza, sözleşme) bir hukukçuya hazırlatmanı öneririm.

**Özet: Öğrenci tanı ve RAM bilgisi KVKK'da "özel nitelikli kişisel veri"dir; bu yüzden hem yazılımda hem kurumda ek tedbir gerekir. Liste iki bölüm: (A) benim yazılımda yapacaklarım, (B) senin kurumda yapman/danışmana sorman gerekenler.**

---

## A. Yazılımda yapılacaklar (bende)

| # | Tedbir | Hangi adımda |
|---|---|---|
| A1 | Şifreli giriş; güçlü parola zorunluluğu; parolalar geri çevrilemez biçimde saklanır | Adım 7 |
| A2 | Rol bazlı yetki: yönetici (yetki verir) / memur (program düzenler) | Adım 7 |
| A3 | Denetim kaydı: kim, ne zaman, hangi kaydı nasıl değiştirdi — **silinemez** kayıt | Adım 6-7 |
| A4 | "Yine de uygula" ile geçilen her kural ihlali ayrıca denetim kaydına yazılır | Adım 6 |
| A5 | Veri tabanının diskte şifreli tutulması; tanı alanlarının ayrıca şifrelenmesi | Adım 10 |
| A6 | Yedekleme (şifreli) + geri yükleme provası | Adım 10 |
| A7 | İnternet üzerinden erişim seçilirse: HTTPS zorunlu, oturum zaman aşımı, başarısız giriş kilidi | Adım 11 (A1 kararına bağlı) |
| A8 | Dışa aktarılan Excel dosyalarının kim tarafından, ne zaman indirildiğinin kaydı | Adım 9 |
| A9 | Test/geliştirme ortamında **asla gerçek öğrenci verisi kullanılmaması** | Tüm adımlar |
| A10 | Öğrenci ayrıldığında veri silme / arşive alma işlemi (saklama süresi sonunda) | Adım 10 |
| A11 | Çok kurumlu yapıda kurum verilerinin birbirine sızmaması (`kurum_id` ile katı ayrım) | Adım 1 |

## B. Kurum tarafında yapılacaklar (sende — danışmanına sor)

| # | Başlık | Ne sorulmalı / ne gerekir |
|---|---|---|
| B1 | **VERBİS kaydı** | Kurumun VERBİS'e kayıtlı mı, kayıt güncel mi? |
| B2 | **Aydınlatma metni** | Veli/öğrenci için; hangi veri, ne amaçla, ne kadar süre, kimlerle paylaşılıyor |
| B3 | **Açık rıza** | Özel nitelikli veri için ayrı ve açık rıza gerekiyor mu, mevcut metinler kapsıyor mu |
| B4 | **Kişisel Veri Saklama ve İmha Politikası** | Saklama süreleri, periyodik imha takvimi |
| B5 | **Veri işleyen sözleşmesi** | Uygulamayı bir sunucuda barındırırsan, barındırma firmasıyla sözleşme gerekir |
| B6 | **Çalışan gizlilik taahhüdü** | Memur ve öğretmenler için yazılı taahhüt ve KVKK farkındalık eğitimi kaydı |
| B7 | **Erişim yetkisi matrisi** | Kim hangi veriye erişebilir — yazılı hale getirilmeli, uygulamadaki rollerle eşleşmeli |
| B8 | **İhlal bildirim prosedürü** | Veri sızıntısında 72 saat içinde Kurul'a bildirim; kim sorumlu, nasıl yapılır |
| B9 | **Fiziksel güvenlik** | Uygulamanın çalıştığı bilgisayar/odanın kilidi, ekran kilidi, yedek diskin saklandığı yer |
| B10 | **Yurt dışına aktarım** | Sunucu Türkiye dışında olursa ek yükümlülük doğar — **bu yüzden Türkiye'de barındırmayı öneriyorum** |
| B11 | **Ticari sürüm (diğer kurumlara satış)** | Sen "veri işleyen" konumuna geçersin; her kurumla ayrı sözleşme, ayrı yetki yapısı gerekir — bu başlığı satıştan **önce** danışmanla konuş |

---

## Üç pratik kural (bugünden geçerli)

1. **Gerçek öğrenci adı ve tanısı WhatsApp, e-posta veya sohbet ekranına yazılmaz.** Bana örnek dosya gönderirken adları değiştir.
2. **Yedek diski kurumda kilitli tut**, bulut kullanacaksan şifreli ve Türkiye'de olanı seç.
3. **Ayrılan personelin girişi aynı gün kapatılır** — bu, uygulamada tek tıkla yapılacak.
