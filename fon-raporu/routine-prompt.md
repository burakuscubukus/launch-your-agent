Bugünün günlük fon & yatırım raporunu hazırla. Aşağıdaki tarifi olduğu gibi uygula.

## Veri kaynağı

Anahtar ortam değişkeninde hazır: `$TWITTERAPI_IO_KEY`. Değerini asla ekrana yazdırma.

Her hesap için:

    curl -sS "https://api.twitterapi.io/twitter/user/last_tweets?userName=<handle>" \
         -H "x-api-key: $TWITTERAPI_IO_KEY"

- Handle'ı `@` işareti OLMADAN yaz.
- Yanıt `data` ile sarmalanmış gelir. Gönderi dizisine dayanıklı eriş:
  `tweets = r.get("tweets") or r.get("data", {}).get("tweets", [])`
- Alanlar: `id`, `text`, `createdAt`. Tarih biçimini varsayma — ilk hesabın yanıtından
  bir örnek yazdır, ayrıştırıcını ona göre kur.
- Sonraki sayfa gerekirse: yanıtta `has_next_page` true ise `next_cursor` değerini
  `cursor` parametresiyle geri gönder. Son 24 saati kapsayınca dur — her gönderi para.
- Gönderi bağlantısı: yanıtta `url` veya `twitterUrl` varsa onu kullan, yoksa
  `https://x.com/<handle>/status/<id>` biçiminde kur.
- Başlamadan önce bakiyeyi kontrol et: `GET https://api.twitterapi.io/oapi/my/info`
  → `recharge_credits`. Sıfırsa 21 çağrı yapma; raporu "twitterapi.io bakiyesi bitti"
  notuyla yaz ve dur.
- Bir hesap hata verirse pes etme: diğerlerine devam et, raporun sonunda
  "Çekilemeyen hesaplar" başlığında @adıyla ve sebebiyle listele.

## Takip edilecek 21 hesap

@AtaPortfoy · @HedefPortfoy · @ProfDemirtas · @fonfiyat · @FoneriaApp · @Erollpolat83
@laplace2011 · @Yatirim101 · @yatirimfonlarim · @101_bes · @iyigelirnet · @FonTurkey
@infoyatirim · @EkonomistDergi · @TuncSatiroglu · @pardusportfoy · @terayatirim
@pusulaportfoy · @barissoydan · @fonvesting007 · @emrahlafcu

## Kapsam

Sadece **son 24 saatteki** paylaşımlar (bu çalışmanın başladığı andan geriye doğru
24 saat). Daha eskisini alma.

## Rapor biçimi

Kalanları dört başlığa ayır, bu sırayla:

1. **Mevzuat & vergi** — BES, fon vergilendirmesi, SPK/Bakanlık düzenlemeleri
2. **Fon & piyasa** — fon getirileri, portföy değişiklikleri, somut sayılar
3. **Yorum & analiz** — kim ne diyor, hangi tez öne çıkıyor, ayrışma var mı
4. **Diğer** — kalan kayda değer paylaşımlar

Her madde: tek cümle özet + `@hesap` + gönderinin X bağlantısı.

Sonra raporu **iki biçimde** ver:
- Sohbete, okunabilir biçimde (Burak burada okuyacak)
- Ayrıca sohbetin sonunda, tek bir kod bloğu içinde **WhatsApp'a olduğu gibi
  yapıştırılabilir düz metin** hâli: markdown başlık/tablo işareti yok, kabaca
  400 kelimeyi aşma, telefonda okunacak kısalıkta

## Bitti sayılma ölçütleri

Raporu vermeden önce bu altı maddeyi kendin kontrol et:

1. 21 hesabın tamamı tarandı; çekilemeyen varsa açıkça listelendi
2. Her maddede @hesap adı ve gönderinin X bağlantısı var — kaynaksız madde yok
3. Dört başlık ayrı ayrı var, mevzuat/vergi en üstte
4. Sadece son 24 saat; daha eski gönderi girmedi
5. WhatsApp metni düz, kısa, yapıştırılabilir
6. Kayda değer bir şey yoksa o başlıkta "Bugün kayda değer bir şey yok." yazıyor

## Asla

- Asla hiçbir yere mesaj gönderme, paylaşım yapma, kimseye yanıt verme — sadece oku ve yaz.
- Asla yatırım tavsiyesi verme, "al/sat" deme. Kimin ne dediğini aktar, kendi görüşünü ekleme.
- Asla kaynaksız iddia yazma; emin olmadığını "doğrulanmadı" diye işaretle.
- Asla boş günü doldurma.
- Asla `$TWITTERAPI_IO_KEY` değerini yazdırma veya bir dosyaya kaydetme.
