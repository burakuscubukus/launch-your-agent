/**
 * Muhasebe Arşivi — Gmail'den Google Drive'a (Google Apps Script)
 *
 * Her sabah 09:00'da Gmail'de "Muhasebe-Arşiv" etiketli yeni mailleri alır.
 *  - Bankalar: yalnızca Muhasebe Gönderen Listesi'ndeki adresler → Banka / Kurum / 2026-09 Eylül
 *  - Faturalar: listede olsun olmasın fatura mailleri → Fatura / Firma / 2026-09 Eylül
 *    + Fatura Listesi tablosuna bir satır
 * Dosya adı: 2026-09-25_Firma_orijinalad.pdf  ·  Klasör yoksa kendisi açar.
 * Dışarıya hiçbir mesaj göndermez, maillere dokunmaz (silmez, taşımaz, etiket değiştirmez).
 *
 * Kurulum: bu metnin tamamını yapıştır → kaydet → "kurulum" fonksiyonunu bir kez çalıştır.
 */

const AYAR = {
  ETIKET: 'muhasebe-arşiv',
  GONDEREN_LISTESI_ID: '13aRMVtfvBn03NsOYtvQOFuLbGvtQUQGIbaFoNL9StyY',
  FATURA_LISTESI_ID: '1xtZVYBzYug25gdGftn_B89OujbZyJ4CPBbh9VPTFZWM',
  TUR_KLASORU: {
    'Banka': '1r7KXw1yXnMxvGWAQWojoGS9ALH50Fx3T',
    'Fatura': '1w88uJWXOnBjLAFaIB6vsjAMYxBvrZfA0',
  },
  SAAT_DILIMI: 'Europe/Istanbul',
  CALISMA_SAATI: 9,
  // İlk çalışmada kaç gün geriye bakılsın (sonrasında her gün kaldığı yerden devam eder)
  ILK_CALISMA_GUN: 7,
  // Bu boyuttan küçük resimler imza/logo sayılır ve atlanır (fatura fotoğrafları alınır)
  MIN_RESIM_BOYUTU: 30 * 1024,
  FATURA_KELIMELERI: /fatura|e-ar[sş]iv|earsiv|e-fatura|invoice|makbuz|receipt/i,
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

/** Asıl iş: yeni etiketli mailleri arşivler. Zamanlayıcı bunu her sabah çağırır. */
function muhasebeArsivle() {
  const ozellikler = PropertiesService.getScriptProperties();
  const baslangic = Date.now();
  const sonCalisma = Number(ozellikler.getProperty('SON_CALISMA')) ||
    baslangic - AYAR.ILK_CALISMA_GUN * 24 * 60 * 60 * 1000;

  const liste = gonderenListesiniOku_();
  const sorgu = `label:${AYAR.ETIKET} has:attachment after:${Math.floor(sonCalisma / 1000)}`;
  const sayac = { mail: 0, dosya: 0, fatura: 0, atlanan: 0 };

  for (let bas = 0; ; bas += 100) {
    const diziler = GmailApp.search(sorgu, bas, 100);
    if (diziler.length === 0) break;
    for (const dizi of diziler) {
      for (const mesaj of dizi.getMessages()) {
        if (mesaj.getDate().getTime() <= sonCalisma) continue;
        mesajiIsle_(mesaj, liste, sayac);
      }
    }
  }

  ozellikler.setProperty('SON_CALISMA', String(baslangic));
  Logger.log('Bitti: %s mail, %s dosya arşivlendi, %s fatura listeye yazıldı, %s mail atlandı.',
    sayac.mail, sayac.dosya, sayac.fatura, sayac.atlanan);
}

function mesajiIsle_(mesaj, liste, sayac) {
  const kimden = kimdenAyir_(mesaj.getFrom());
  const konu = mesaj.getSubject() || '';

  let kurum, tur;
  if (liste[kimden.adres]) {
    kurum = liste[kimden.adres].company;
    tur = liste[kimden.adres].tur;
  } else if (AYAR.FATURA_KELIMELERI.test(konu + ' ' + mesaj.getPlainBody().slice(0, 5000))) {
    kurum = kimden.ad || kimden.adres.split('@')[1] || 'Bilinmeyen';
    tur = 'Fatura';
  } else {
    sayac.atlanan++; // listede yok ve fatura değil
    return;
  }
  const turKlasorId = AYAR.TUR_KLASORU[tur];
  if (!turKlasorId) throw new Error(`Gönderen listesinde bilinmeyen tür: "${tur}" (${kimden.adres})`);
  kurum = temizle_(kurum);

  // Satır içi resimler (logo, imza) hiç alınmaz; küçük ekli resimler de atlanır
  const belgeler = mesaj.getAttachments({ includeInlineImages: false })
    .filter(e => !e.getContentType().startsWith('image/') || e.getSize() >= AYAR.MIN_RESIM_BOYUTU);
  if (belgeler.length === 0) { sayac.atlanan++; return; }

  const tarih = mesaj.getDate();
  const bicim = k => Utilities.formatDate(tarih, AYAR.SAAT_DILIMI, k);
  const klasorAy = `${bicim('yyyy-MM')} ${AYLAR[Number(bicim('M')) - 1]}`;

  const kurumKlasoru = altKlasor_(DriveApp.getFolderById(turKlasorId), kurum);
  const ayKlasoru = altKlasor_(kurumKlasoru, klasorAy);

  // Fatura listesine her mail için tek satır: varsa PDF, yoksa ilk belge
  const anaBelge = belgeler.find(e => e.getContentType().includes('pdf')) || belgeler[0];
  sayac.mail++;
  for (const ek of belgeler) {
    const dosyaAdi = `${bicim('yyyy-MM-dd')}_${kurum}_${ek.getName()}`;
    if (ayKlasoru.getFilesByName(dosyaAdi).hasNext()) continue; // daha önce arşivlenmiş
    const dosya = ayKlasoru.createFile(ek.copyBlob().setName(dosyaAdi));
    sayac.dosya++;
    if (tur === 'Fatura' && ek === anaBelge) {
      SpreadsheetApp.openById(AYAR.FATURA_LISTESI_ID).getSheets()[0].appendRow([
        klasorAy, bicim('dd.MM.yyyy'), kurum, konu, dosyaAdi, dosya.getUrl(), kimden.adres,
      ]);
      sayac.fatura++;
    }
  }
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
