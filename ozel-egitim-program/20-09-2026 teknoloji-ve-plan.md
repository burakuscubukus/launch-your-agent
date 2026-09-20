# Özel Eğitim Ders Programı Uygulaması — Teknoloji Önerisi ve Geliştirme Planı

Tarih: 20-09-2026 · Hazırlayan: Claude Code · Durum: **onayını bekliyor, kod yazılmadı**

---

## 1. Teknoloji önerisi

**Öneri: Tarayıcıdan açılan bir web uygulaması. Arka plan Python (FastAPI) + PostgreSQL veritabanı, ön yüz React. İlk sürüm kurumdaki tek bir bilgisayarda çalışır; aynı kod sonradan Türkiye'deki güvenli bir sunucuya taşınabilir.**

Üç gerekçe:

1. **Excel işi Python'da en güçlü.** Senin tüm veri girişin Excel ile olacak. Python'un hazır kütüphaneleri (openpyxl/pandas) tabloyu okur, hatalı satırı öğrenci adıyla raporlar, çıktı dosyalarını formüllü/biçimli üretir. Başka dilde bu iş daha zahmetli.
2. **PostgreSQL çok kurumlu yapıyı ve KVKK gereklerini baştan taşır.** Her satırda `kurum_id`, veritabanı düzeyinde satır bazlı erişim kilidi, denetim kaydı tablosu ve şifreli alan desteği hazır gelir. İlk sürümde tek kurum kullanırız ama mimariyi sonradan sökmemiz gerekmez.
3. **Web olduğu için kurulum kararı kodu değiştirmez.** Bölüm 2'deki açık soruya (memurlar evden girecek mi?) bugün cevap vermesen bile geliştirme başlayabilir: aynı uygulama kurumdaki bilgisayarda da, internet sunucusunda da çalışır. Karar sadece kurulum adımını etkiler.

### Parçalar tek tabloda

| Parça | Seçim | Neden |
|---|---|---|
| Veritabanı | PostgreSQL | Çok kurumlu ayrım, denetim kaydı, şifreleme, güvenilir yedek |
| Arka plan (sunucu) | Python + FastAPI | Excel + kural motoru aynı dilde; test yazmak kolay |
| Ön yüz (ekranlar) | React + TypeScript | Sürükle-bırak program tablosu ve anlık uyarılar için gerekli |
| Excel okuma/yazma | openpyxl + pandas | Şablon üretimi, hatalı satır raporu, biçimli çıktı |
| Yerleştirme motoru | Kural tabanlı, açıklanabilir algoritma | "Neden yerleşmedi" sorusuna cümleyle cevap verir |
| Kurulum paketi | Docker | Tek komutla kurulur; yerelden sunucuya taşımak kopyala-yapıştır olur |
| Giriş / roller | Şifreli giriş + rol (yönetici / memur) | Bölüm 2 gereği |

### Yerleştirme motoru hakkında önemli not

Programı yapan iki yöntem var:

- **Kural tabanlı (önerim):** Kurallar sırayla uygulanır, yer bulunamayan öğrenci "yerleştirilemedi" listesine **gerekçesiyle** düşer. Örn. "Ayşe Y. — Salı 3. ders uygun ama tanısına uygun uzmanın o saati dolu."
- **Matematiksel eniyileme (OR-Tools):** Daha "dolu" program çıkarır ama neden öyle dizdiğini anlatamaz.

Senin için **açıklanabilirlik doluluktan önemli**: boş saat, yanlış yerleştirmeden iyidir dedin. Bu yüzden kural tabanlı başlıyoruz. İleride istersen eniyileme ikinci bir seçenek olarak eklenir.

### Tercih etmediklerim (kısaca)

| Alternatif | Neden değil |
|---|---|
| Sadece Excel + makro | Çok kullanıcı, rol ayrımı ve denetim kaydı Excel'de güvenli kurulamaz |
| Microsoft Access | Tek makineye bağlı, çok kurumlu yapıya ve internete taşınmaz |
| Hazır okul programı yazılımı | TTKB tanı-uzman kuralı, telafi 2+2, RAM raporu mantığı yok |
| Mobil uygulama | İlk sürümde gereksiz; web zaten telefondan da açılır |

---

## 2. Geliştirme planı (adım adım)

Her adım küçük ve tek başına test edilebilir. **Her adımın sonunda sana ne yaptığımı gösterir, onayını alır, sonrakine geçerim.** Test verisi tamamen uydurmadır; gerçek öğrenci adı ancak son pilot adımında, senin kurulumunda kullanılır.

| # | Adım | Bittiğinde sen ne görürsün | Ön koşul |
|---|---|---|---|
| 0 | Açık soruların cevapları + bu planın onayı | — | **Sen** |
| 1 | Proje iskeleti ve veri modeli (her tabloda `kurum_id`) | Tabloların listesi ve ilişki şeması, sade anlatımla | Adım 0 |
| 2 | Excel şablonları + yükleyici | Uydurma veriyi yükleyip "12 satır alındı, 3 satır hatalı: ..." raporunu görürsün | Adım 1 |
| 3 | Kural motoru (sadece kontrol, yerleştirme yok) | Elle hazırlanmış bir programı yükleyip ihlal listesini öğrenci adıyla görürsün | Adım 2 |
| 4 | Otomatik yerleştirme motoru v1 | Uydurma veriden çıkan haftalık program + "yerleştirilemedi" listesi (gerekçeli) | Adım 3 |
| 5 | Program ekranı (öğretmen bazlı / öğrenci bazlı, salt okunur) | Haftalık tabloyu ekranda görürsün | Adım 4 |
| 6 | Elle taşıma: sürükle-bırak + anlık kural kontrolü + "yine de uygula" | Bir öğrenciyi taşırsın, uyarıyı görürsün, bilerek devam edebilirsin | Adım 5 |
| 7 | Şifreli giriş, roller, denetim kaydı ekranı | İki kullanıcıyla girer, kimin neyi değiştirdiğini listede görürsün | Adım 6 |
| 8 | "İzinli gün ekle" butonu (tek seferlik gün + saat aralığı) | Öğrenci kartına izin eklersin, sadece o aralık açılır, etiket görünür | Adım 7 |
| 9 | Excel çıktıları + kontrol raporu | `20-09-2026 kis-programi.xlsx` biçiminde dosyalar iner | Adım 8 |
| 10 | Yedekleme/geri yükleme, veri şifreleme, KVKK kontrol listesinin uygulanması | Yedek alma ve geri yükleme denemesini birlikte yaparız | Adım 9 |
| 11 | Kurulum + gerçek veriyle pilot dönem | Uygulama kurumda çalışır, bir dönem programını gerçekten üretirsin | Adım 10 + kurulum kararı |

### Planın mantığı (neden bu sıra)

1. **Önce veri, sonra kural, sonra yerleştirme.** Yükleyici çalışmadan kural yazmak, kural çalışmadan yerleştirme yazmak boşa emek olur.
2. **Ekranlar kuraldan sonra gelir.** Motor doğru çalışmadan güzel ekran yapmak, yanlışı güzel göstermek demektir.
3. **Giriş/roller 7. adımda.** Daha erken koyarsak her testte şifre girmekle uğraşırız; daha geç koyarsak gerçek veriye geçemeyiz. Gerçek veriden hemen önce doğru yer.

### Servis planlaması nerede?

Servis güzergâhları (8 bölge + Bayraklı) **veri olarak adım 2'de** girer, **telafi bloklarına dağıtım adım 4'te** kullanılır. Rota optimizasyonu ilk sürümde yok (senin Bölüm 8 kararın).

---

## 3. İlk sürümde yapılmayacaklar (senin kararın, teyit)

Ödeme/abonelik · mobil mağaza yayını · MEBBİS entegrasyonu · RAM raporu PDF okuma · grup dersi oluşturma · servis rota optimizasyonu · maaş/muhasebe.

Bunları "yapılmayacak" diye siliyorum değil; **sonraki sürüm listesine** yazıyorum, sırası geldiğinde konuşuruz.
