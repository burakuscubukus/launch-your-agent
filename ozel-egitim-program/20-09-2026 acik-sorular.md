# Açık Sorular — Tek Liste

Tarih: 20-09-2026 · **A grubu cevaplanmadan geliştirme başlamaz. B grubu 2. adıma kadar, C grubu ilerleyen adımlara kadar cevaplanabilir.**

---

## A. Şimdi cevap lazım (3 soru)

| # | Soru | Neden kritik |
|---|---|---|
| A1 | **Memurlar programa sadece kurumdan mı, evden de mi girecek?** | Kurulumun yerel bilgisayar mı, internet sunucusu mu olacağını belirler. Seçenekler aşağıda. |
| A2 | **Kış programında ders saatleri tam olarak hangi saatler?** 1., 2., 3., 4., 5. ... ders kaçta başlar kaçta biter, aralarda teneffüs var mı? | "Tam gün öğrenci yalnızca 3. ve 4. ders saatine yazılır" kuralı bu tablo olmadan kodlanamaz. |
| A3 | **Cumartesi ve yaz dönemi saat aralıkları kış ile aynı mı?** Farklıysa o dönemlerin ders saati çizelgesi nedir? | Dönem profili ayarı bu bilgiyle kurulur. |

### A1 için seçenekler (sade anlatım)

| Seçenek | Nasıl çalışır | Artısı | Eksisi |
|---|---|---|---|
| **1. Kurum içi kurulum** | Uygulama kurumdaki bir bilgisayarda çalışır, aynı ağdaki bilgisayarlar tarayıcıdan bağlanır | Veri binadan çıkmaz, KVKK riski en düşük, internet kesilse de çalışır | Evden erişim yok; yedek ve bakım senin sorumluluğunda; o bilgisayar bozulursa program durur |
| **2. Türkiye'de güvenli sunucu** | Uygulama kiralık bir sunucuda çalışır, şifreyle her yerden girilir | Evden de girilir, yedek otomatik, ileride diğer kurumlara satış için zaten gerekli yapı | Aylık sunucu ücreti; KVKK yükümlülüğü artar (şifreleme, erişim kaydı, veri işleyen sözleşmesi) |
| **3. Önce 1, sonra 2** | Kurum içi başlar, ihtiyaç olunca sunucuya taşınır | Bugün en ucuz ve en güvenli; karar ertelenir | Taşıma günü yarım günlük kurulum işi çıkar |

**Benim önerim: 3. seçenek.** Kod ikisinde de aynı; şimdi kurum içinde başlayıp ticari sürüme geçerken sunucuya taşımak en az riskli yol. Ama memurların evden çalışması bugünden ihtiyaçsa doğrudan 2'yi seçeriz.

---

## B. 2. adıma (Excel yükleyici) kadar lazım

| # | Soru |
|---|---|
| B1 | Kurumda kaç öğrenci, kaç öğretmen var? Aynı saatte en fazla kaç ders paralel yapılabilir (derslik/oda sayısı sınırı var mı)? |
| B2 | Bir öğretmenin günlük ve haftalık en fazla kaç ders saati olabilir? Art arda en fazla kaç ders, zorunlu ara var mı? |
| B3 | **"Ayda en az 2 saat zorunlu personel" kuralının tam tanımı nedir?** Hangi branş, her öğrenci için mi, ay içinde herhangi iki saat mi? |
| B4 | **Telafi hakkı** Excel'de ne olarak gelecek: "kaç saat telafi hakkı var" sayısı mı, yoksa hangi tarihlerde ders kaçırdığı listesi mi? |
| B5 | Haftalık standart 2 saat bireysel dedin; **ayda toplam kaç bireysel saat** hedefleniyor (8 mi)? Rapora göre değişiyor mu? |
| B6 | **Çift tanılı öğrenci** haftada toplam kaç saat alır, tanı başına mı sayılır? |
| B7 | Elinde şu an kullandığın Excel dosyaları var mı? **Gerçek ad içermeyen** bir örnek paylaşabilir misin (sütun başlıkları görmek için)? |
| B8 | Servis: her bölge hangi gün/saat bloğuna denk geliyor, kaç araç var, araç kapasitesi programı kısıtlıyor mu (öğrenci sadece kendi bölgesinin bloğunda mı gelebilir)? |
| B9 | "Kırmızı işaretli ders özel/ücretli" bilgisi hangi tablodan gelecek — öğrenci satırında bir işaret mi, ayrı liste mi? |

---

## C. İlerleyen adımlarda lazım

| # | Soru |
|---|---|
| C1 | Kaç memur kullanıcı olacak? Öğretmenler için salt okunur bir görünüm istiyor musun? |
| C2 | Rapor bitiş tarihi yaklaşan öğrenci kaç gün önceden uyarılsın (30/45/60)? |
| C3 | Resmî tatiller ve kurum tatilleri uygulamaya girilecek mi, girilecekse nasıl (tablo mu, ekrandan mı)? |
| C4 | Dönem geçişinde (kış → yaz) program sıfırdan mı kurulur, yoksa öğretmen sürekliliği korunarak mı devredilir? |
| C5 | Program çıktısında **derslik/oda** bilgisi de yer alacak mı? |
| C6 | Yedek nereye alınacak (harici disk / kurum sunucusu / şifreli bulut), ne sıklıkta, kim sorumlu? |
| C7 | Ticari sürüm için: diğer kurumların verisi aynı veritabanında ayrı mı dursun, her kuruma ayrı veritabanı mı? (Bugün karar gerekmez, mimariyi etkiler.) |
| C8 | Grup dersi ilk sürümde kapsam dışı; grup **ders kayıtları** yine de programda görünsün mü (elle girilerek), yoksa hiç mi yer almasın? |

---

## Cevaplama kolaylığı

Bu dosyanın altına cevaplarını yazman yeterli, ya da bana konuşma içinde söyle — ben dosyayı güncellerim. A grubunu cevaplarsan 1. adıma başlayabilirim.
