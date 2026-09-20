# Program Uygulaması — Başlangıç Planı (onayınıza sunulur)

Hazırlayan: Claude Code · Tarih: 20-09-2026 · Durum: **Kod yazılmadı, onay bekleniyor**

---

## 1. Önerilen teknoloji ve nedenleri

**Öneri: Tarayıcıdan açılan bir web uygulaması — Python (FastAPI) + PostgreSQL veritabanı + React ekran arayüzü.**

| Katman | Seçim | Ne işe yarar |
|---|---|---|
| Veritabanı | PostgreSQL | Tüm veri burada durur, `kurum_id` ile kurumlar ayrılır |
| Sunucu tarafı | Python + FastAPI | Kural motoru, Excel okuma/yazma, yetki, denetim kaydı |
| Ekran | React + TypeScript | Haftalık program tablosu, sürükle-bırak taşıma, anlık uyarı |
| Excel | openpyxl / pandas | Şablon üretme, yükleme, rapor çıkarma |

**Üç gerekçe:**

1. **Excel işi Python'da en sağlam yerde.** Tüm veri girişiniz Excel ile olacak; Python'un Excel kütüphaneleri olgun, hatalı satırı öğrenci adıyla raporlamak kolay.
2. **Çok kurumlu mimari ilk günden kurulabiliyor.** PostgreSQL'de her tabloya `kurum_id` konur ve veritabanı seviyesinde "bir kurum diğerinin satırını göremez" kuralı (row-level security) işletilir. İleride başka kurumlara açarken kod baştan yazılmaz.
3. **Yerel kurulum da internet sunucusu da aynı kodla çalışır.** Erişim kararınızı (Bölüm 2, soru 1) bugün vermek zorunda değilsiniz; karar değişirse kod değil kurulum değişir.

**Elenen alternatif:** Excel + makro (VBA) veya Access. Hızlı başlar ama rol ayrımı, denetim kaydı, veri şifreleme ve çok kurumluluk taşımaz; KVKK özel nitelikli veri için yeterli değil.

### Kurulum seçenekleri (Bölüm 2, soru 1 için sade karşılaştırma)

| | A) Kurumdaki bir bilgisayar | B) Türkiye'de barındırılan sunucu | C) Kurum + VPN |
|---|---|---|---|
| Evden erişim | Yok | Var | Var (kurulum gerektirir) |
| Veri nerede | Binada | Veri merkezinde (yurt içi) | Binada |
| Aylık maliyet | Yok | Var (düşük) | Yok / çok düşük |
| Sorumluluk | Yedeği siz alırsınız | Sunucu güvenliği sizin sorumluluğunuzda | Orta |
| KVKK yükü | En hafif | En ağır (ama yönetilebilir) | Orta |

**Önerim: A ile başlayın.** Mimari B'ye hazır kurulur; ticari sunuma geçtiğinizde taşınır.

---

## 2. Açık sorular (tek liste)

**Kritik — cevap gelmeden ilgili adım başlamaz**

1. **Erişim:** Memur arkadaşlar sadece kurumdan mı girecek, evden de mi? (A / B / C)
2. **Ders saatleri çizelgesi:** Kış döneminde 1., 2., 3., 4. ... ders saatleri hangi saat aralıklarına denk geliyor? Günde toplam kaç ders saati var?
3. **Cumartesi:** Aynı ders saati çizelgesi mi geçerli, yoksa farklı mı?
4. **Ölçek:** Yaklaşık kaç aktif öğrenci, kaç öğretmen, kaç branş var?
5. **Mevcut Excel dosyalarınız:** Şu an kullandığınız öğrenci/öğretmen/program tabloları var mı? Bir örnek (gerçek isimler silinmiş hâliyle) gönderirseniz şablonları ona uydururum, sizin için dosya hazırlama yükü azalır.

**Kural netleştirme**

6. **Telafi hakkı:** Excel'e sayı olarak mı gireceksiniz (ör. "4 saat"), yoksa uygulama devamsızlıktan kendi mi hesaplayacak? Devamsızlık kaydı uygulamaya girilecek mi?
7. **Ayda 2 saat zorunlu personel:** "Zorunlu personel" hangi branş(lar)? Tanıya göre değişiyor mu? TTKB tablosunda sütun olarak mı duracak?
8. **Sabit programlı öğretmenler (ergoterapist):** Sabit program nasıl gelecek — ayrı bir Excel sekmesinde gün + saat aralığı olarak mı?
9. **Kırmızı işaretli özel/ücretli ders:** Programda yer tutuyor mu (o saat dolu sayılır mı)? TTKB ve okul saati kuralına tabi mi?
10. **Servis güzergâhı:** Planlamada nasıl kullanılıyor — aynı güzergâhtaki telafi öğrencilerini aynı saat bloğuna toplamak mı? Güzergâhların sabit saatleri var mı?
11. **Rapor bitişi:** Bitiş tarihine kaç gün kala uyarı istersiniz? (ör. 30 gün)
12. **Dönem geçişi:** Yaz→kış programı sıfırdan mı kurulur, yoksa önceki dönem kopyalanıp güncellenir mi? (Öğretmen sürekliliği için geçmiş dönem verisi gerekiyor.)

**İşletme / güvenlik**

13. **Eşzamanlı kullanım:** Aynı programı aynı anda iki kişi düzenleyecek mi? (Kilitleme gerekip gerekmediğini belirler.)
14. **Yedekleme:** Yedekler nereye alınsın, kaç gün saklansın? Yedek dosyası kurum dışına (ör. bulut) çıkabilir mi?
15. **Proje klasörü:** Bu uygulamanın dosyaları hangi klasörde/depoda dursun? (Şu an planı geçici olarak `launch-your-agent` deposu içine koydum; doğru yeri söyleyin, taşırım.)

---

## 3. Adım adım geliştirme planı

Her adım küçük, tek başına test edilebilir ve sonunda onayınızı isterim. Hiçbir adımda gerçek öğrenci adı kullanılmaz.

| # | Adım | Bittiğinde nasıl test ederiz |
|---|---|---|
| 0 | Proje iskeleti: boş uygulama tek komutla ayağa kalkar | Tarayıcıda açılıyor, "çalışıyor" ekranı geliyor |
| 1 | Veri modeli + `kurum_id`: kurum, kullanıcı, öğrenci, öğretmen, TTKB kuralı, güzergâh, ders saati, ders, izin, denetim kaydı | Uydurma iki kurum kurulur; birinin verisi diğerinde görünmüyor |
| 2 | Şifreli giriş, rol ayrımı (yönetici / memur), denetim kaydı altyapısı | Memur yetkisiz sayfayı açamıyor; her değişiklik kim-ne-zaman olarak kaydediliyor |
| 3 | Excel şablonları indirilebilir + yükleme doğrulaması | Bilerek bozulmuş dosya yüklenince hatalar öğrenci adıyla listeleniyor, hiçbir satır kaydedilmiyor |
| 4 | Kural motoru (henüz yerleştirme yok, sadece kontrol): TTKB, okul saati, çakışma, 2 saat kuralı, rapor durumu | Elle hazırlanmış örnek programdaki bilinen ihlallerin hepsi yakalanıyor |
| 5 | Otomatik yerleştirme v1 + "yerleştirilemedi" listesi | 50 uydurma öğrenciyle çalışıyor; kesin kuralların hiçbiri çiğnenmemiş |
| 6 | Program ekranı: öğretmen bazlı ve öğrenci bazlı haftalık görünüm | Ekrandaki program ile veritabanı birebir aynı |
| 7 | Elle taşıma + anlık kural kontrolü + "yine de uygula" (denetim kaydına yazılır) | İhlalli taşıma öğrenci adıyla uyarıyor; zorlama seçimi loga düşüyor |
| 8 | "İzinli gün ekle" butonu: tek seferlik gün + saat aralığı, etiket, silme | İzin eklenince yalnız o aralık açılıyor; uygulama kendiliğinden taşımıyor, öneriyor |
| 9 | Kırmızı bayraklar paneli (en üstte, tıklayınca öğrenciye gider) | Her bayrak türü için bir senaryo üretilip yakalanıyor |
| 10 | Telafi planlama: bireysel 2+2, grup 1+1, güzergâh bloklarına dağıtım | Telafi hakkı olan herkes ya planlanmış ya da gerekçesiyle listede |
| 11 | Çıktılar: program, öğrenci dökümü, telafi raporu, kontrol raporu → Excel (`gg-aa-yyyy ad.xlsx`) | Dosyalar açılıyor, sayılar ekranla tutuyor |
| 12 | Yedekleme/geri yükleme, veri şifreleme, oturum süresi | Yedekten boş bir veritabanına tam geri dönülüyor |
| 13 | Gerçek veriyle pilot: kış dönemi programı, elde yapılanla yan yana karşılaştırma | Farklar tek tabloda, her biri açıklanabiliyor |

**Kapsam dışı (ilk sürümde yok):** ödeme/abonelik, mobil mağaza, MEBBİS entegrasyonu, RAM raporu PDF okuma, grup dersi oluşturma, servis rota optimizasyonu, maaş/muhasebe.

---

## 4. Excel şablonları — taslak

Ortak kurallar: başlık satırı 1. satırda, tarihler `gg.aa.yyyy`, saatler `SS:DD`, boş bırakılabilen alanlar "Zorunlu = Hayır". Her tabloda **kod sütunu** var; isim değişse bile kayıt izlenebilir ve isim benzerliğinden kaynaklı yanlış eşleşme önlenir.

### 4.1 Öğrenciler

| Sütun | Örnek | Zorunlu | Açıklama |
|---|---|---|---|
| ogrenci_kodu | O-001 | Evet | Benzersiz |
| ad_soyad | Deneme Öğrenci 1 | Evet | Test verisinde uydurma isim |
| dogum_tarihi | 14.03.2016 | Evet | Grup dersi yaş kuralı için |
| tani_1 | Otizm Spektrum Bozukluğu | Evet | TTKB tablosundaki yazımla aynı olmalı |
| tani_2 | Dil ve Konuşma Güçlüğü | Hayır | Çift tanı |
| girecegi_uzmanlar | Özel Eğitim Öğretmeni, Dil ve Konuşma | Evet | RAM raporundan; virgülle ayrılır |
| okul_durumu | sabahçı \| öğlenci \| tam gün \| okula gitmiyor | Evet | Boşsa "okul bilgisi eksik" listesine düşer |
| okul_cikis_saati | 12:30 | Koşullu | Sabahçı/öğlenci için zorunlu |
| gun_tercihi | serbest \| sadece cumartesi | Evet | |
| rapor_bitis_tarihi | 31.12.2026 | Evet | |
| durum | aktif \| ayrıldı \| rapor bekliyor \| devamsız | Evet | Sadece "aktif" yerleştirilir |
| telafi_hakki_saat | 4 | Hayır | Boş = 0 (soru 6'ya göre değişebilir) |
| guzergah_kodu | G-03 | Hayır | Servis tablosuyla eşleşir |
| notlar | | Hayır | |

### 4.2 Öğretmenler

**Sekme 1 — Öğretmen listesi**

| Sütun | Örnek | Zorunlu |
|---|---|---|
| ogretmen_kodu | P-007 | Evet |
| ad_soyad | Deneme Öğretmen 7 | Evet |
| brans | Özel Eğitim Öğretmeni | Evet |
| calisma_gunleri | Salı,Çarşamba,Perşembe,Cuma,Cumartesi | Evet |
| calisma_saat_baslangic | 09:00 | Evet |
| calisma_saat_bitis | 18:00 | Evet |
| durum | aktif \| ayrıldı | Evet |
| sabit_programi_var | evet \| hayır | Evet |
| notlar | | Hayır |

**Sekme 2 — Sabit program** (dokunulmaz bloklar)

| ogretmen_kodu | gun | baslangic | bitis | aciklama |
|---|---|---|---|---|
| P-012 | Çarşamba | 10:00 | 12:00 | Ergoterapi sabit |

### 4.3 Tanı–uzman kuralları (TTKB)

Her tanı–branş eşleşmesi için bir satır. Mevzuat değişince **kod değil bu tablo** güncellenir.

| Sütun | Örnek | Açıklama |
|---|---|---|
| tani | Otizm Spektrum Bozukluğu | Öğrenci tablosuyla birebir aynı yazım |
| uygun_brans | Özel Eğitim Öğretmeni | |
| ders_turu | bireysel \| grup | |
| aylik_min_saat | 2 | Ayda en az kaç saat |
| zorunlu_personel | evet \| hayır | "Ayda 2 saat zorunlu personel" kuralı bu sütundan işler |
| gecerlilik_baslangic | 01.09.2026 | Eski kural geçmiş programlarda bozulmaz |
| dayanak | TTKB çizelgesi / ilgili madde | Denetimde kaynak gösterimi |

### 4.4 Servis güzergâhları

| Sütun | Örnek | Açıklama |
|---|---|---|
| guzergah_kodu | G-03 | Benzersiz |
| guzergah_adi | Bayraklı | 8 bölge + Bayraklı |
| gun | Cumartesi | |
| blok_baslangic | 09:00 | Telafi bloğu |
| blok_bitis | 13:00 | |
| kapasite | 12 | Aynı blokta en fazla kaç öğrenci |
| notlar | | |

### 4.5 Ders saatleri / dönem profili (yeni öneri)

Soru 2 ve 3'ün cevabı koda gömülmesin diye ayrı tablo öneriyorum:

| donem | gun | ders_no | baslangic | bitis |
|---|---|---|---|---|
| kış | Salı | 1 | 09:00 | 10:00 |
| kış | Salı | 3 | 11:00 | 12:00 |
| yaz | Pazartesi | 1 | 09:00 | 10:00 |

Böylece "tam gün öğrenci yalnız 3. ve 4. derse yazılır" kuralı saatlere değil, **ders numarasına** bağlanır; saatler değişse kural bozulmaz.

---

## Ek: KVKK hukuki kontrol listesi

**Not: Ben hukukçu değilim, bu hukuki tavsiye değildir.** Aşağıdaki liste, avukatınıza/danışmanınıza götüreceğiniz başlıklardır.

| # | Başlık | Neden gerekli |
|---|---|---|
| 1 | VERBİS kaydı (yükümlülük kapsamınız kontrol edilmeli) | Veri sorumlusu sicili |
| 2 | Aydınlatma metni — veli/öğrenci | Tanı ve RAM verisi özel nitelikli kişisel veri |
| 3 | Açık rıza metni (özel nitelikli veri için ayrı ve açık) | Kanun ayrı rıza arıyor |
| 4 | Çalışan gizlilik taahhütnamesi (memur ve öğretmenler) | İç erişim sınırı |
| 5 | Kişisel Veri Saklama ve İmha Politikası + saklama süreleri | Süresi dolan veri silinmeli |
| 6 | Veri işleyen sözleşmesi (sunucu/barındırma sağlayıcısı, yazılım desteği) | B seçeneğinde zorunlu hâle gelir |
| 7 | Yurt dışına veri aktarımı değerlendirmesi | Sunucu/yedek yurt dışına çıkarsa ek yükümlülük |
| 8 | Veri ihlali müdahale prosedürü (72 saat bildirim) | Kanun süre veriyor |
| 9 | Erişim yetki matrisi (kim hangi veriyi görür) | Uygulamadaki rollerle birebir örtüşmeli |
| 10 | Ticari sunuma geçerken: diğer kurumlarla veri işleyen/ortak veri sorumlusu ilişkisinin tanımı | Çok kurumlu modelde rol netleşmeli |

---

## Sıradaki adım

Bölüm 2'deki soruları cevaplayın ve teknoloji seçimini onaylayın; ardından **Adım 0 ve 1** ile başlayıp sonunda tekrar onayınızı isterim.
