/**
 * Muhasebe Arşivi — Gmail'den Google Drive'a (Google Apps Script) · sürüm 2.3
 *
 * Her sabah 09:00'da Gmail'i tarar; banka ekstre/dekontlarını ve faturaları Drive'a koyar.
 *  - Bankalar: gönderen alan adına bakılır (halkbank.com.tr, isbank.com.tr …) — bankanın hangi
 *    adresten yazdığı önemli değil → Banka / Kurum / 2026-09 Eylül
 *  - Faturalar: Gönderen Listesi'ndeki firmalar + konusunda/metninde fatura geçen ekli mailler
 *    → Fatura / 2026-09 Eylül  + Fatura Listesi tablosuna bir satır
 *  - Gmail'de elle "Muhasebe-Arşiv" etiketi koyduğun her mail de alınır.
 *  - HİÇBİR ŞEY SESSİZCE ATLANMAZ: her aday mail, Fatura Listesi dosyasındaki "Kontrol" sayfasına
 *    sonucuyla yazılır. Eki olmayan (sadece link ile gelen) faturalar "ELLE İNDİR" diye işaretlenir.
 * Dosya adı: 2026-09-25_Firma_orijinalad.pdf — aynı adlı ama farklı bir belge gelirse sonuna mail
 * kimliği eklenir (ör. aynı gün 3 kart için 3 ayrı ekstre). Aynı belge iki kez yüklenmez.
 * Dışarıya hiçbir mesaj göndermez, maillere dokunmaz (silmez, taşımaz, etiket değiştirmez).
 *
 * Kurulum: bu metnin tamamını yapıştır → kaydet → "kurulum" fonksiyonunu bir kez çalıştır.
 * Geçmişi tamamlamak için: "gecmisiArsivle" fonksiyonunu çalıştır (bitene kadar tekrar çalıştır).
 */

const AYAR = {
  ETIKET: 'muhasebe-arşiv',
  GONDEREN_LISTESI_ID: '13aRMVtfvBn03NsOYtvQOFuLbGvtQUQGIbaFoNL9StyY',
  FATURA_LISTESI_ID: '1xtZVYBzYug25gdGftn_B89OujbZyJ4CPBbh9VPTFZWM',
  TUR_KLASORU: {
    'Banka': '1r7KXw1yXnMxvGWAQWojoGS9ALH50Fx3T',
    'Fatura': '1w88uJWXOnBjLAFaIB6vsjAMYxBvrZfA0',
  },
  // Gönderenin alan adı bunlardan biriyle bitiyorsa banka belgesidir (adres listede olmasa bile)
  BANKA_ALANLARI: {
    'halkbank.com.tr': 'Halkbank',
    'isbank.com.tr': 'İş Bankası',
    'ziraatbank.com.tr': 'Ziraat Bankası',
    'vakifbank.com.tr': 'VakıfBank',
    'garantibbva.com.tr': 'Garanti BBVA',
    'qnb.com.tr': 'QNB',
    'yapikredi.com.tr': 'Yapı Kredi',
    'halkyatirim.com.tr': 'Halk Yatırım',
    'akbank.com': 'Akbank',
    'denizbank.com': 'DenizBank',
    'teb.com.tr': 'TEB',
    'kuveytturk.com.tr': 'Kuveyt Türk',
    'enpara.com': 'Enpara',
    'vakifkatilim.com.tr': 'Vakıf Katılım',
    'ziraatkatilim.com.tr': 'Ziraat Katılım',
  },
  // Kurumun bilerek dışarıda bıraktığı gönderenler (ör. kişisel portföy raporları)
  HARIC_ALANLAR: ['foneriaportfoy.com.tr'],
  // Konusunda "fatura" geçse de belge olmayan bildirimler (otomatik ödeme talimatı, kampanya) → ELLE İNDİR'e yazılmaz
  BILDIRIM_ADRESLERI: ['bildirim@vakifbank.com.tr', 'kampanya@ileti.isbank.com.tr'],
  SAAT_DILIMI: 'Europe/Istanbul',
  CALISMA_SAATI: 9,
  // İlk çalışmada kaç gün geriye bakılsın (sonrasında her gün kaldığı yerden devam eder)
  ILK_CALISMA_GUN: 7,
  // gecmisiArsivle bu tarihten itibaren her şeyi tarar (yıl-ay-gün)
  GECMIS_BASLANGIC: '2026-01-01',
  // Geçmiş taranırken her turda kaç günlük dilim işlensin (arama hızlı kalsın diye)
  GECMIS_PENCERE_GUN: 31,
  // Bu boyuttan küçük resimler imza/logo sayılır ve atlanır (fatura fotoğrafları alınır)
  MIN_RESIM_BOYUTU: 30 * 1024,
  FATURA_KELIMELERI: /fatura|e-ar[sş]iv|earsiv|e-fatura|invoice|makbuz|receipt/i,
  BANKA_KELIMELERI: /ekstre|dekont|hesap [öo]zet|hareket|icmal|[öo]deme belge|makbuz/i,
  // Apps Script tek seferde 6 dk çalışabilir; 5 dk'da durup kaldığı yeri kaydeder
  SURE_SINIRI_MS: 5 * 60 * 1000,
};

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** Bir kez çalıştırılır: her sabah 09:00 zamanlayıcısını kurar. */
function kurulum() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'muhasebeArsivle')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('muhasebeArsivle')
    .timeBased().everyDays(1).atHour(AYAR.CALISMA_SAATI).inTimezone(AYAR.SAAT_DILIMI)
    .create();
  Logger.log('Zamanlayıcı kuruldu: her gün %s:00 (%s).', AYAR.CALISMA_SAATI, AYAR.SAAT_DILIMI);
}

/**
 * Geçmişi tamamlar: GECMIS_BASLANGIC'tan bugüne her şeyi tarar. Daha önce arşivlenen belgeler
 * tekrar yüklenmez. Bir kez çalıştırman yeter: süre dolarsa 1 dk sonra kendini yeniden başlatır,
 * bugüne gelince durur. İlerlemeyi Kontrol sekmesinden izleyebilirsin.
 */
function gecmisiArsivle() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'gecmisiArsivle')
    .forEach(t => ScriptApp.deleteTrigger(t));
  const ozellikler = PropertiesService.getScriptProperties();
  if (!ozellikler.getProperty('GECMIS_DEVAM')) {
    const [y, a, g] = AYAR.GECMIS_BASLANGIC.split('-').map(Number);
    ozellikler.setProperty('SON_CALISMA', String(new Date(y, a - 1, g).getTime()));
    ozellikler.setProperty('GECMIS_DEVAM', '1');
  }
  // Emniyet: bu tur beklenmedik şekilde yarıda kesilirse 7 dk sonra kaldığı yerden yeniden başlar
  const emniyet = ScriptApp.newTrigger('gecmisiArsivle').timeBased().after(7 * 60 * 1000).create();
  const bitti = muhasebeArsivle(AYAR.GECMIS_PENCERE_GUN);
  ScriptApp.deleteTrigger(emniyet);
  if (bitti) {
    ozellikler.deleteProperty('GECMIS_DEVAM');
    Logger.log('Geçmiş tamamlandı: bugüne kadar her şey tarandı.');
  } else {
    ScriptApp.newTrigger('gecmisiArsivle').timeBased().after(60 * 1000).create();
    Logger.log('Devam ediyor: 1 dk sonra kendiliğinden sürecek, bir şey yapmana gerek yok.');
  }
}

/**
 * Geçmişi baştan tarar ve Kontrol sekmesini sıfırdan yazar (sürüm 2.2 düzeltmeleri geçmişe de uygulansın diye).
 * Arşivdeki dosyalar tekrar yüklenmez; sadece önceden kaçanlar eklenir. Bir kez çalıştırman yeter.
 */
function gecmisiYenidenTara() {
  const sayfa = kontrolSayfasi_();
  if (sayfa.getLastRow() > 1) sayfa.deleteRows(2, sayfa.getLastRow() - 1);
  PropertiesService.getScriptProperties().deleteProperty('GECMIS_DEVAM');
  gecmisiArsivle();
}

/**
 * Asıl iş: yeni mailleri arşivler. Zamanlayıcı bunu her sabah çağırır. Bugüne kadar bitirdiyse true döner.
 * pencereGun verilirse (geçmiş taraması) yalnızca o kadar günlük dilimi işler.
 */
function muhasebeArsivle(pencereGun) {
  const ozellikler = PropertiesService.getScriptProperties();
  const baslangic = Date.now();
  const sonCalisma = Number(ozellikler.getProperty('SON_CALISMA')) ||
    baslangic - AYAR.ILK_CALISMA_GUN * 24 * 60 * 60 * 1000;
  // Zamanlayıcı bu fonksiyona bir olay nesnesi geçirir; yalnızca sayı ise dilim uygulanır
  const dilimSonu = typeof pencereGun === 'number'
    ? Math.min(baslangic, sonCalisma + pencereGun * 24 * 60 * 60 * 1000) : baslangic;

  const liste = gonderenListesiniOku_();
  const kontrol = kontrolSayfasi_();
  const sayac = { mail: 0, dosya: 0, fatura: 0, elle: 0, atlanan: 0, hata: 0 };

  // En eskiden en yeniye işle; süre biterse kaldığı yer kaydedilir, yarın oradan devam eder
  const mesajlar = adayMesajlar_(sonCalisma, dilimSonu, liste);
  let kaldigiYer = dilimSonu;
  let bitti = dilimSonu >= baslangic;
  for (const mesaj of mesajlar) {
    if (Date.now() - baslangic > AYAR.SURE_SINIRI_MS) {
      kaldigiYer = mesaj.getDate().getTime() - 1000;
      bitti = false;
      break;
    }
    try {
      mesajiIsle_(mesaj, liste, kontrol, sayac);
    } catch (hata) {
      // Tek bir sorunlu mail bütün çalışmayı durdurmasın: Kontrol'e yaz, devam et
      sayac.hata++;
      kontrol.appendRow([Utilities.formatDate(mesaj.getDate(), AYAR.SAAT_DILIMI, 'dd.MM.yyyy HH:mm'),
        mesaj.getFrom(), mesaj.getSubject(), 'HATA (elle bak): ' + hata.message, '',
        `https://mail.google.com/mail/u/0/#all/${mesaj.getId()}`]);
    }
  }

  ozellikler.setProperty('SON_CALISMA', String(kaldigiYer));
  Logger.log('%s: %s mail, %s dosya arşivlendi, %s fatura listeye yazıldı, %s fatura ELLE İNDİRİLMELİ, %s mail atlandı, %s hata.',
    bitti ? 'Bitti' : `${Utilities.formatDate(new Date(kaldigiYer), AYAR.SAAT_DILIMI, 'dd.MM.yyyy')} tarihine kadar tamam, devam edecek`,
    sayac.mail, sayac.dosya, sayac.fatura, sayac.elle, sayac.atlanan, sayac.hata);
  return bitti;
}

/** Etikete güvenmeden geniş arama: banka alan adları, listedeki göndericiler, fatura kelimeleri. */
function adayMesajlar_(sonCalisma, dilimSonu, liste) {
  const sonra = `after:${Math.floor(sonCalisma / 1000)} before:${Math.floor(dilimSonu / 1000) + 1}`;
  const gondericiler = Object.keys(AYAR.BANKA_ALANLARI).concat(Object.keys(liste));
  const sorgular = [
    `label:${AYAR.ETIKET} ${sonra}`,
    `from:(${gondericiler.join(' OR ')}) ${sonra}`,
    `has:attachment {fatura e-arşiv earşiv e-fatura makbuz invoice receipt ekstre dekont} ${sonra}`,
    // Eki olmayan fatura bildirimleri (link ile gelenler) → Kontrol sayfasına "ELLE İNDİR"
    `subject:{fatura e-arşiv e-fatura makbuz invoice receipt} -has:attachment ${sonra}`,
  ];
  const goruldu = {};
  const sonuc = [];
  for (const sorgu of sorgular) {
    for (let bas = 0; ; bas += 100) {
      const diziler = GmailApp.search(sorgu, bas, 100);
      if (diziler.length === 0) break;
      for (const dizi of diziler) {
        for (const mesaj of dizi.getMessages()) {
          const id = mesaj.getId();
          const zaman = mesaj.getDate().getTime();
          if (goruldu[id] || zaman <= sonCalisma || zaman > dilimSonu || mesaj.isInTrash()) continue;
          goruldu[id] = true;
          sonuc.push(mesaj);
        }
      }
    }
  }
  return sonuc.sort((a, b) => a.getDate() - b.getDate());
}

function mesajiIsle_(mesaj, liste, kontrol, sayac) {
  const kimden = kimdenAyir_(mesaj.getFrom());
  const konu = mesaj.getSubject() || '';
  const alan = kimden.adres.split('@')[1] || '';
  const tarih = mesaj.getDate();
  const bicim = k => Utilities.formatDate(tarih, AYAR.SAAT_DILIMI, k);
  const yaz = (sonuc, dosyalar) => kontrol.appendRow([
    bicim('dd.MM.yyyy HH:mm'), kimden.adres, konu, sonuc, dosyalar || '',
    `https://mail.google.com/mail/u/0/#all/${mesaj.getId()}`,
  ]);

  if (AYAR.HARIC_ALANLAR.some(h => alan.endsWith(h))) { sayac.atlanan++; return; }

  const bankaAlani = Object.keys(AYAR.BANKA_ALANLARI).find(d => alan === d || alan.endsWith('.' + d));
  const etiketli = mesaj.getThread().getLabels().some(l => l.getName().toLowerCase() === AYAR.ETIKET);
  const metin = konu + ' ' + mesaj.getPlainBody().slice(0, 5000);

  let kurum, tur;
  if (liste[kimden.adres]) {
    kurum = liste[kimden.adres].company;
    tur = liste[kimden.adres].tur;
  } else if (bankaAlani && AYAR.BANKA_KELIMELERI.test(metin)) {
    kurum = AYAR.BANKA_ALANLARI[bankaAlani];
    tur = 'Banka';
  } else if (AYAR.FATURA_KELIMELERI.test(metin) || etiketli) {
    kurum = kimden.ad || alan || 'Bilinmeyen';
    tur = 'Fatura';
  } else {
    // Ekli ama tanınmayan banka maili ya da ekstre/dekont gibi görünen yabancı gönderen → insan baksın
    const ekli = belgeleriAl_(mesaj).length > 0;
    if ((bankaAlani && ekli) || AYAR.BANKA_KELIMELERI.test(konu)) yaz('KONTROL ET: banka/ekstre olabilir, otomatik alınmadı');
    sayac.atlanan++;
    return;
  }
  const turKlasorId = AYAR.TUR_KLASORU[tur];
  if (!turKlasorId) throw new Error(`Gönderen listesinde bilinmeyen tür: "${tur}" (${kimden.adres})`);
  kurum = temizle_(kurum);

  // Satır içi resimler (logo, imza) hiç alınmaz; küçük ekli resimler de atlanır
  const belgeler = belgeleriAl_(mesaj);
  if (belgeler.length === 0) {
    // Ek yoksa: konusu fatura diyorsa linkle gelmiştir → ELLE İNDİR. Bildirim/kampanya/rezervasyon mesajları atlanır.
    const bildirim = AYAR.BILDIRIM_ADRESLERI.includes(kimden.adres) || kimden.adres.startsWith('kampanya@');
    if (tur === 'Fatura' && !bildirim && AYAR.FATURA_KELIMELERI.test(konu)) {
      yaz('ELLE İNDİR: fatura eki yok (link ile gelmiş olabilir)'); sayac.elle++;
    } else sayac.atlanan++;
    return;
  }

  const klasorAy = `${bicim('yyyy-MM')} ${AYLAR[Number(bicim('M')) - 1]}`;
  const turKlasoru = DriveApp.getFolderById(turKlasorId);
  const ayKlasoru = tur === 'Fatura' ? altKlasor_(turKlasoru, klasorAy) : altKlasor_(altKlasor_(turKlasoru, kurum), klasorAy);

  // Fatura listesine her mail için tek satır: varsa PDF, yoksa ilk belge
  const anaBelge = belgeler.find(e => e.getContentType().includes('pdf')) || belgeler[0];
  sayac.mail++;
  const yuklenen = [];
  for (const ek of belgeler) {
    const dosyaAdi = benzersizAd_(ayKlasoru, `${bicim('yyyy-MM-dd')}_${kurum}_${ek.getName()}`, ek, mesaj.getId());
    if (!dosyaAdi) continue; // bu belge daha önce arşivlenmiş
    const blob = ek.copyBlob().setName(dosyaAdi);
    if (/\.pdf$/i.test(dosyaAdi) && !/pdf/i.test(ek.getContentType())) blob.setContentType('application/pdf');
    const dosya = ayKlasoru.createFile(blob);
    yuklenen.push(dosyaAdi);
    sayac.dosya++;
    if (tur === 'Fatura' && ek === anaBelge) {
      SpreadsheetApp.openById(AYAR.FATURA_LISTESI_ID).getSheets()[0].appendRow([
        klasorAy, bicim('dd.MM.yyyy'), kurum, konu, dosyaAdi, dosya.getUrl(), kimden.adres,
      ]);
      sayac.fatura++;
    }
  }
  yaz(yuklenen.length ? `Arşivlendi (${tur})` : `Zaten arşivde (${tur})`, yuklenen.join(', '));
}

/**
 * Maildeki belgeler (PDF, büyük resim vb.). Küçük resimler imza/logo sayılır.
 * iPhone'dan gönderilen PDF'ler "satır içi" geldiği için GmailApp onları ek olarak göstermez;
 * o durumda mailin ham içeriğinden PDF/resim parçaları çıkarılır.
 */
function belgeleriAl_(mesaj) {
  const uygun = e => !/^image\//i.test(e.getContentType()) || e.getSize() >= AYAR.MIN_RESIM_BOYUTU;
  const ekler = mesaj.getAttachments({ includeInlineImages: false }).filter(uygun);
  return ekler.length ? ekler : hamEkler_(mesaj).filter(uygun);
}

function hamEkler_(mesaj) {
  try {
    return hamEklerOku_(mesaj.getRawContent());
  } catch (hata) {
    return []; // ham içerik okunamazsa ek yok say; Kontrol'de ELLE İNDİR olarak görünür
  }
}

function hamEklerOku_(ham) {
  const sinirlar = [...ham.matchAll(/boundary="?([^";\r\n]+)"?/gi)].map(m => m[1]);
  const goruldu = {};
  const ekler = [];
  for (const sinir of sinirlar) {
    for (const parca of ham.split('--' + sinir)) {
      const ayrim = parca.search(/\r?\n\r?\n/);
      if (ayrim < 0) continue;
      const baslik = parca.slice(0, ayrim);
      const tur = ((baslik.match(/Content-Type:\s*([^;\s]+)/i) || [])[1] || '').toLowerCase();
      if (!/^(application\/pdf|image\/)/.test(tur) || !/Content-Transfer-Encoding:\s*base64/i.test(baslik)) continue;
      let bayt;
      try {
        bayt = Utilities.base64Decode(parca.slice(ayrim).replace(/--\s*$/, '').replace(/\s/g, ''));
      } catch (hata) {
        continue; // bozuk/çözülemeyen parça
      }
      let ad = (baslik.match(/name="?([^";\r\n]+)"?/i) || [])[1] || '';
      if (!ad || ad.startsWith('=?')) ad = 'belge.' + (tur.split('/')[1] || 'bin');
      const anahtar = ad + bayt.length;
      if (goruldu[anahtar]) continue;
      goruldu[anahtar] = true;
      const blob = Utilities.newBlob(bayt, tur, ad);
      ekler.push({ getName: () => ad, getSize: () => bayt.length, getContentType: () => tur, copyBlob: () => blob });
    }
  }
  return ekler;
}

/**
 * Aynı adda dosya varsa: boyutu da aynıysa aynı belgedir → null (yükleme).
 * Boyutu farklıysa başka bir belgedir → adın sonuna mail kimliği eklenir.
 */
function benzersizAd_(klasor, ad, ek, mesajId) {
  const ayniBelge = isim => {
    const dosyalar = klasor.getFilesByName(isim);
    while (dosyalar.hasNext()) if (dosyalar.next().getSize() === ek.getSize()) return true;
    return false;
  };
  if (!klasor.getFilesByName(ad).hasNext()) return ad;
  if (ayniBelge(ad)) return null;
  const nokta = ad.lastIndexOf('.');
  const yeni = nokta > 0 ? `${ad.slice(0, nokta)}_${mesajId.slice(-6)}${ad.slice(nokta)}` : `${ad}_${mesajId.slice(-6)}`;
  return klasor.getFilesByName(yeni).hasNext() ? null : yeni;
}

/** Fatura Listesi dosyasındaki "Kontrol" sayfası: her aday mailin ne olduğu buraya yazılır. */
function kontrolSayfasi_() {
  const tablo = SpreadsheetApp.openById(AYAR.FATURA_LISTESI_ID);
  let sayfa = tablo.getSheetByName('Kontrol');
  if (!sayfa) {
    sayfa = tablo.insertSheet('Kontrol');
    sayfa.appendRow(['Mail Tarihi', 'Gönderen', 'Konu', 'Sonuç', 'Dosyalar', 'Mail Linki']);
    sayfa.setFrozenRows(1);
  }
  return sayfa;
}

function gonderenListesiniOku_() {
  const satirlar = SpreadsheetApp.openById(AYAR.GONDEREN_LISTESI_ID).getSheets()[0].getDataRange().getValues();
  const basliklar = satirlar.shift().map(b => String(b).trim().toLowerCase());
  const [iEmail, iKurum, iTur] = ['email', 'company', 'tur'].map(b => basliklar.indexOf(b));
  const liste = {};
  for (const s of satirlar) {
    const email = String(s[iEmail] || '').trim().toLowerCase();
    if (email) liste[email] = { company: String(s[iKurum]).trim(), tur: String(s[iTur]).trim() };
  }
  return liste;
}

function kimdenAyir_(kimden) {
  const m = String(kimden).match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  return m ? { ad: m[1].trim(), adres: m[2].trim().toLowerCase() }
           : { ad: '', adres: String(kimden).trim().toLowerCase() };
}

function altKlasor_(ust, ad) {
  const bulunan = ust.getFoldersByName(ad);
  return bulunan.hasNext() ? bulunan.next() : ust.createFolder(ad);
}

function temizle_(s) {
  return String(s || '').replace(/[\\/:*?"<>|']/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}
