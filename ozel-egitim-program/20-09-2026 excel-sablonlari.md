# Excel Şablonları — Taslak

Tarih: 20-09-2026 · Dosya: `sablonlar/20-09-2026 veri-sablonu.xlsx` (hazır, açıp inceleyebilirsin)

**Özet: Tek bir Excel dosyası, içinde 6 sayfa. Senin istediğin 4 sayfa + benim önerdiğim 2 sayfa (onayına tabi).** Dosyayı açtığında zorunlu sütunlar turuncu, seçenekli sütunlar açılır listeli, her sayfada 2-3 uydurma örnek satır var.

Üç tasarım kararı:

1. **Sütun başlıkları Türkçe karaktersiz** (`ogrenci_no`, `dogum_tarihi`). Uygulama sütunları bu adlarla tanır; başlık değişirse yükleme bozulur. İçerik elbette Türkçe.
2. **İsim değil numara anahtar.** `ogrenci_no` / `personel_no` kurum içi kimliktir. Aynı isimde iki öğrenci olursa veya isim değişirse (evlilik, düzeltme) program bozulmaz.
3. **Mevzuat tabloda, kodda değil.** TTKB eşleşmeleri ve ders saatleri ayrı sayfalarda; kural değişirse tabloyu güncellersin, bana ihtiyacın olmaz.

---

## Sayfa 1 — `ogrenciler`

| Sütun | Zorunlu | Biçim / seçenekler |
|---|---|---|
| `ogrenci_no` | ✅ | Serbest metin, tekil. Örn. OGR-001 |
| `ad_soyad` | ✅ | Metin |
| `dogum_tarihi` | ✅ | GG.AA.YYYY |
| `tani_1` | ✅ | Açılır liste (TTKB tanıları) |
| `tani_2` | — | Açılır liste. Doluysa çift tanılı sayılır: tek uzmandan ders alamaz, iki ders çakışamaz |
| `girecek_uzmanlar` | ✅ | RAM raporundan çıkan branşlar; noktalı virgülle: `Özel Eğitim Öğretmeni; Fizyoterapist` |
| `haftalik_bireysel_saat` | — | Sayı, boşsa 2 kabul edilir |
| `okul_durumu` | ✅ | sabahçı / öğlenci / tam gün / okula gitmiyor |
| `okul_cikis_saati` | — | SS:DD. Sabahçı ve tam gün için **gerekli**; boşsa öğrenci "okul bilgisi eksik" listesine düşer |
| `gun_tercihi` | ✅ | serbest / sadece cumartesi |
| `rapor_baslangic` | — | GG.AA.YYYY |
| `rapor_bitis` | ✅ | GG.AA.YYYY. Geçmişse kırmızı bayrak |
| `durum` | ✅ | aktif / ayrıldı / rapor bekliyor / devamsız |
| `telafi_hakki_saat` | — | Sayı (açık soru B4'e göre değişebilir) |
| `servis_bolgesi` | — | `servis_guzergahlari` sayfasındaki bölge adı |
| `notlar` | — | Serbest metin |

## Sayfa 2 — `ogretmenler`

| Sütun | Zorunlu | Biçim / seçenekler |
|---|---|---|
| `personel_no` | ✅ | Tekil. Örn. PER-001 |
| `ad_soyad` | ✅ | Metin |
| `brans` | ✅ | Açılır liste (branşlar) |
| `calisma_gunleri` | ✅ | `Salı; Çarşamba; Cuma` |
| `mesai_baslangic` / `mesai_bitis` | ✅ | SS:DD |
| `gunluk_max_ders` / `haftalik_max_ders` | — | Sayı (açık soru B2) |
| `sabit_programi_var` | — | evet / hayır. **evet** ise otomatik yerleştirme o kişiye dokunmaz |
| `durum` | ✅ | aktif / ayrıldı |
| `notlar` | — | Serbest metin |

## Sayfa 3 — `tani_uzman_kurallari` (TTKB tablosu)

| Sütun | Zorunlu | Biçim / seçenekler |
|---|---|---|
| `kural_no` | ✅ | Sayı |
| `tani` | ✅ | Açılır liste |
| `izinli_brans` | ✅ | Açılır liste |
| `ders_turu` | ✅ | bireysel / grup |
| `zorunlu_personel_mu` | — | evet / hayır |
| `aylik_min_saat` | — | Sayı (ayda 2 saat zorunlu personel kuralı buraya yazılır) |
| `gecerlilik_baslangic` | — | GG.AA.YYYY — mevzuat değişiminde eski kuralı silmeden yenisini eklersin |
| `mevzuat_dayanagi` | — | Metin (hangi çizelge/genelge) |
| `notlar` | — | Serbest metin |

> **Kural:** Bu sayfada yazmayan tanı-branş eşleşmesi uygulamada **yasaktır**. Motor asla "listede yok ama olsun" demez.
> Şablondaki 3 satır sadece biçimi göstermek içindir; gerçek çizelgeyi sen yükleyeceksin. Mevzuat listesini ben tahmin etmedim.

## Sayfa 4 — `servis_guzergahlari`

| Sütun | Zorunlu | Biçim |
|---|---|---|
| `guzergah_no` | ✅ | Sayı |
| `bolge_adi` | ✅ | Metin — 8 bölge + Bayraklı (adlarını sen yazacaksın) |
| `gun` | ✅ | Açılır liste |
| `blok_baslangic` / `blok_bitis` | ✅ | SS:DD |
| `arac_kapasitesi` | — | Sayı |
| `notlar` | — | Serbest metin |

---

## Önerdiğim iki ek sayfa (onayını bekliyor)

### Sayfa 5 — `ders_saatleri` *(öneri)*
`donem` (kış/yaz) · `ders_sirasi` (1,2,3…) · `baslangic` · `bitis` · `gecerli_gunler` · `notlar`

**Neden gerekli:** "Tam gün öğrenci yalnızca 3. ve 4. ders saatine yazılır" kuralı, 3. ve 4. dersin kaçta olduğunu bilmeden çalışamaz. Bu sayfa açık soru A2'nin cevabının yaşayacağı yer. Kış/yaz dönem farkı da buradan yönetilir.

### Sayfa 6 — `sabit_dersler` *(öneri)*
`kayit_no` · `ogrenci_no` · `personel_no` · `gun` · `ders_sirasi` · `ders_turu` · `kirmizi_ucretli_mi` · `notlar`

**Neden gerekli:** Ergoterapist gibi sabit programlılara ve kırmızı (ücretli) derslere motorun dokunmaması için bu derslerin nerede olduğunu bilmesi gerekir. Aksi halde "sabit" bilgisi kişide durur ama dersin hangi saatte olduğu bilinmez.

Bu iki sayfayı onaylamazsan çıkarırım; o zaman ders saatlerini ve sabit dersleri ekrandan elle girmen gerekir.

---

## Yükleme davranışı (adım 2'de böyle çalışacak)

1. Dosyayı yüklersin, uygulama **hiçbir şeyi hemen kaydetmez**; önce kontrol raporu çıkarır.
2. Rapor üç bölümdür: **alınan satırlar**, **hatalı satırlar** (öğrenci/personel adıyla ve hata sebebiyle), **şüpheli eşleşmeler** (ör. "Mert Demir" ile "Mert Demirr" aynı kişi mi?) — şüphelileri tek tabloda toplar, sana sorar, **kendi başına isim uydurmaz veya birleştirmez**.
3. Onaylarsan kaydeder; onaylamazsan hiçbir değişiklik olmaz.
4. Her yükleme denetim kaydına yazılır: kim, ne zaman, kaç satır, hangi dosya.
