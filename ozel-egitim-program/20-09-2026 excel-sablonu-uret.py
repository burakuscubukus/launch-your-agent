# -*- coding: utf-8 -*-
"""
"20-09-2026 veri-sablonu.xlsx" dosyasını üretir.
Bu dosya uygulama kodu DEĞİLDİR; sadece boş Excel şablonunu oluşturur.
Şablon değişirse bu script güncellenip yeniden çalıştırılır:
    python3 "20-09-2026 excel-sablonu-uret.py"
Örnek satırlardaki tüm isimler uydurmadır (ÖRNEK- ön ekiyle işaretli).
Sütun başlıkları bilerek Türkçe karaktersiz ve boşluksuz yazılmıştır (ogrenci_no gibi);
uygulama sütunları bu adlarla tanır, başlıkları değiştirmeyin.
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
import os

BASLIK_FILL = PatternFill("solid", fgColor="1F4E78")
BASLIK_FONT = Font(bold=True, color="FFFFFF", size=11)
ZORUNLU_FILL = PatternFill("solid", fgColor="C55A11")
ORNEK_FONT = Font(italic=True, color="808080")
INCE = Side(style="thin", color="BFBFBF")
CERCEVE = Border(left=INCE, right=INCE, top=INCE, bottom=INCE)

# --- seçim listeleri (kurum kendi mevzuat çizelgesine göre düzenler) -------
L_OKUL = "sabahçı,öğlenci,tam gün,okula gitmiyor"
L_GUN_TERCIH = "serbest,sadece cumartesi"
L_OGRENCI_DURUM = "aktif,ayrıldı,rapor bekliyor,devamsız"
L_PERSONEL_DURUM = "aktif,ayrıldı"
L_EVET_HAYIR = "evet,hayır"
L_DERS_TURU = "bireysel,grup"
L_DONEM = "kış,yaz"
L_GUN = "Pazartesi,Salı,Çarşamba,Perşembe,Cuma,Cumartesi,Pazar"
L_TANI = ("Zihinsel Yetersizlik,Otizm Spektrum Bozukluğu,Dil ve Konuşma Güçlüğü,"
          "Özgül Öğrenme Güçlüğü,Bedensel Yetersizlik,İşitme Yetersizliği,"
          "Görme Yetersizliği,Dikkat Eksikliği ve Hiperaktivite,Serebral Palsi")
L_BRANS = ("Özel Eğitim Öğretmeni,Zihin Engelliler Öğretmeni,İşitme Engelliler Öğretmeni,"
           "Görme Engelliler Öğretmeni,Dil ve Konuşma Terapisti,Fizyoterapist,Ergoterapist,"
           "Odyolog,Psikolog,Çocuk Gelişimi Uzmanı,Okul Öncesi Öğretmeni")


def sayfa_kur(wb, ad, sutunlar, ornekler, dogrulamalar=None, aciklama=None):
    """sutunlar: [(baslik, genislik, zorunlu_mu)]"""
    ws = wb.create_sheet(ad)
    if aciklama:
        ws.cell(row=1, column=1, value=aciklama).font = Font(italic=True, color="808080")
    ws.cell(row=2, column=1,
            value="Turuncu başlıklar ZORUNLU alandır. 4. satırdan itibaren yazın; örnek satırları silebilirsiniz."
            ).font = Font(italic=True, color="808080")
    for i, (baslik, genislik, zorunlu) in enumerate(sutunlar, start=1):
        h = ws.cell(row=3, column=i, value=baslik)
        h.fill = ZORUNLU_FILL if zorunlu else BASLIK_FILL
        h.font = BASLIK_FONT
        h.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        h.border = CERCEVE
        ws.column_dimensions[get_column_letter(i)].width = genislik
    ws.row_dimensions[3].height = 30
    for r, satir in enumerate(ornekler, start=4):
        for c, deger in enumerate(satir, start=1):
            h = ws.cell(row=r, column=c, value=deger)
            h.font = ORNEK_FONT
            h.border = CERCEVE
    ws.freeze_panes = "A4"
    for sutun_harf, liste in (dogrulamalar or {}).items():
        dv = DataValidation(type="list", formula1='"%s"' % liste, allow_blank=True, showErrorMessage=True)
        dv.error = "Listeden bir değer seçin."
        dv.errorTitle = "Geçersiz değer"
        ws.add_data_validation(dv)
        dv.add("%s4:%s1000" % (sutun_harf, sutun_harf))
    return ws


wb = Workbook()

# ---------------------------------------------------------------- AÇIKLAMA
ws = wb.active
ws.title = "AÇIKLAMA"
ws.column_dimensions["A"].width = 115
metinler = [
    ("Özel Eğitim Ders Programı — Veri Şablonu", True),
    ("Tarih: 20-09-2026  |  Durum: TASLAK, onay bekliyor", False),
    ("", False),
    ("Nasıl kullanılır:", True),
    ("1) Her sayfayı kendi verinizle doldurun. Örnek satırlar gri ve italiktir, silin.", False),
    ("2) Turuncu başlıklı sütunlar zorunludur; boş bırakılırsa satır yüklenmez.", False),
    ("3) Tarih biçimi: GG.AA.YYYY (örnek 05.03.2019). Saat biçimi: SS:DD (örnek 12:30).", False),
    ("4) Bir hücreye birden çok değer yazarken ayraç noktalı virgüldür:  Psikolog; Fizyoterapist", False),
    ("5) ogrenci_no ve personel_no kurum içi kimliktir; aynı numarayı iki kişiye vermeyin.", False),
    ("6) Sütun başlıklarını DEĞİŞTİRMEYİN; uygulama sütunları bu adlarla tanır.", False),
    ("7) Dosyayı kaydedip uygulamaya yükleyin; hatalı satırlar adıyla listelenir, düzeltip tekrar yüklersiniz.", False),
    ("", False),
    ("ÖNEMLİ — gerçek öğrenci adıyla test yapmayın. Bu şablondaki tüm örnekler uydurmadır.", True),
    ("", False),
    ("Sayfalar:", True),
    ("ogrenciler             — öğrenci temel bilgileri, okul durumu, rapor ve telafi bilgisi", False),
    ("ogretmenler            — personel, branş, çalışma gün ve saatleri", False),
    ("tani_uzman_kurallari   — TTKB tablosu: hangi tanı hangi branşla ders alabilir (mevzuat değişirse SADECE bu sayfa güncellenir)", False),
    ("servis_guzergahlari    — 8 bölge + Bayraklı, gün ve saat blokları", False),
    ("ders_saatleri (ÖNERİ)  — dönemin ders saati çizelgesi; '3. ve 4. ders' kuralı bu sayfadan okunur", False),
    ("sabit_dersler (ÖNERİ)  — dokunulmayacak sabit programlar (ör. ergoterapist) ve kırmızı/ücretli dersler", False),
    ("", False),
    ("(ÖNERİ) işaretli iki sayfa tarafımdan önerilmiştir, onayınıza tabidir; onaylamazsanız çıkarılır.", False),
]
for i, (t, kalin) in enumerate(metinler, start=1):
    ws.cell(row=i, column=1, value=t).font = Font(bold=kalin, size=13 if i == 1 else 11)

# -------------------------------------------------------------- ÖĞRENCİLER
sayfa_kur(
    wb, "ogrenciler",
    [("ogrenci_no", 12, True), ("ad_soyad", 26, True), ("dogum_tarihi", 14, True),
     ("tani_1", 26, True), ("tani_2", 26, False), ("girecek_uzmanlar", 34, True),
     ("haftalik_bireysel_saat", 14, False), ("okul_durumu", 16, True),
     ("okul_cikis_saati", 14, False), ("gun_tercihi", 16, True),
     ("rapor_baslangic", 14, False), ("rapor_bitis", 14, True), ("durum", 14, True),
     ("telafi_hakki_saat", 14, False), ("servis_bolgesi", 18, False), ("notlar", 30, False)],
    [["OGR-001", "ÖRNEK-1 Ayşe Yılmaz", "05.03.2019", "Otizm Spektrum Bozukluğu", "",
      "Özel Eğitim Öğretmeni; Dil ve Konuşma Terapisti", 2, "tam gün", "15:20", "serbest",
      "01.09.2026", "31.08.2027", "aktif", 2, "Bölge 3", "Tam gün — sadece 3. ve 4. ders"],
     ["OGR-002", "ÖRNEK-2 Mert Demir", "18.11.2016", "Zihinsel Yetersizlik", "Dil ve Konuşma Güçlüğü",
      "Özel Eğitim Öğretmeni; Dil ve Konuşma Terapisti", 4, "sabahçı", "12:40", "serbest",
      "15.02.2026", "14.02.2027", "aktif", 0, "Bayraklı", "Çift tanı — iki ders çakışmamalı"],
     ["OGR-003", "ÖRNEK-3 Zeynep Kara", "22.07.2020", "Serebral Palsi", "",
      "Fizyoterapist; Ergoterapist", 2, "okula gitmiyor", "", "sadece cumartesi",
      "01.06.2026", "31.05.2027", "rapor bekliyor", 4, "Bölge 7", "Uzak semt — Cumartesi"]],
    {"D": L_TANI, "E": L_TANI, "H": L_OKUL, "J": L_GUN_TERCIH, "M": L_OGRENCI_DURUM},
    "ogrenciler — her satır bir öğrenci. Okul bilgisi eksik öğrenci kış programına yerleştirilmez, 'okul bilgisi eksik' listesine düşer.")

# ------------------------------------------------------------- ÖĞRETMENLER
sayfa_kur(
    wb, "ogretmenler",
    [("personel_no", 12, True), ("ad_soyad", 26, True), ("brans", 28, True),
     ("calisma_gunleri", 32, True), ("mesai_baslangic", 14, True), ("mesai_bitis", 14, True),
     ("gunluk_max_ders", 14, False), ("haftalik_max_ders", 14, False),
     ("sabit_programi_var", 16, False), ("durum", 12, True), ("notlar", 30, False)],
    [["PER-001", "ÖRNEK-A Elif Şahin", "Özel Eğitim Öğretmeni", "Salı; Çarşamba; Perşembe; Cuma; Cumartesi",
      "09:00", "18:00", 7, 30, "hayır", "aktif", ""],
     ["PER-002", "ÖRNEK-B Kaan Aydın", "Ergoterapist", "Salı; Perşembe",
      "10:00", "17:00", 6, 12, "evet", "aktif", "Sabit program — dokunulmaz"],
     ["PER-003", "ÖRNEK-C Deniz Ateş", "Dil ve Konuşma Terapisti", "Salı; Çarşamba; Cuma",
      "09:00", "16:00", 6, 18, "hayır", "aktif", ""]],
    {"C": L_BRANS, "I": L_EVET_HAYIR, "J": L_PERSONEL_DURUM},
    "ogretmenler — çalışma günleri noktalı virgülle ayrılır. 'sabit_programi_var = evet' olan personele otomatik yerleştirme dokunmaz.")

# ------------------------------------------------------ TANI-UZMAN (TTKB)
sayfa_kur(
    wb, "tani_uzman_kurallari",
    [("kural_no", 10, True), ("tani", 30, True), ("izinli_brans", 30, True),
     ("ders_turu", 12, True), ("zorunlu_personel_mu", 16, False),
     ("aylik_min_saat", 14, False), ("gecerlilik_baslangic", 16, False),
     ("mevzuat_dayanagi", 34, False), ("notlar", 26, False)],
    [[1, "Otizm Spektrum Bozukluğu", "Özel Eğitim Öğretmeni", "bireysel", "evet", 2, "01.09.2026", "TTKB çizelgesi", "ÖRNEK satır — kendi çizelgenizle değiştirin"],
     [2, "Otizm Spektrum Bozukluğu", "Dil ve Konuşma Terapisti", "bireysel", "hayır", 0, "01.09.2026", "TTKB çizelgesi", "ÖRNEK satır"],
     [3, "Serebral Palsi", "Fizyoterapist", "bireysel", "evet", 2, "01.09.2026", "TTKB çizelgesi", "ÖRNEK satır"]],
    {"B": L_TANI, "C": L_BRANS, "D": L_DERS_TURU, "E": L_EVET_HAYIR},
    "TTKB tablosu — mevzuat değişirse KOD DEĞİL bu sayfa güncellenir. Burada yazmayan tanı-branş eşleşmesi uygulamada YASAKTIR.")

# ------------------------------------------------------ SERVİS GÜZERGÂHLARI
sayfa_kur(
    wb, "servis_guzergahlari",
    [("guzergah_no", 12, True), ("bolge_adi", 22, True), ("gun", 14, True),
     ("blok_baslangic", 14, True), ("blok_bitis", 14, True),
     ("arac_kapasitesi", 14, False), ("notlar", 40, False)],
    [[1, "Bölge 1", "Salı", "13:00", "16:00", 14, "Bölge adlarını kendi güzergâh isimlerinizle değiştirin"],
     [2, "Bölge 2", "Çarşamba", "13:00", "16:00", 14, ""],
     [3, "Bayraklı", "Cumartesi", "09:00", "13:00", 14, ""]],
    {"C": L_GUN},
    "servis_guzergahlari — 8 bölge + Bayraklı. Telafi dersleri bu bloklara dağıtılır.")

# ---------------------------------------------------------- DERS SAATLERİ
sayfa_kur(
    wb, "ders_saatleri",
    [("donem", 10, True), ("ders_sirasi", 12, True), ("baslangic", 12, True),
     ("bitis", 12, True), ("gecerli_gunler", 38, True), ("notlar", 40, False)],
    [["kış", 1, "09:00", "09:50", "Salı; Çarşamba; Perşembe; Cuma; Cumartesi", "ÖRNEK — gerçek saatleri siz yazacaksınız (açık soru A2)"],
     ["kış", 2, "10:00", "10:50", "Salı; Çarşamba; Perşembe; Cuma; Cumartesi", "ÖRNEK"],
     ["kış", 3, "11:00", "11:50", "Salı; Çarşamba; Perşembe; Cuma; Cumartesi", "ÖRNEK — 'tam gün' öğrenci kuralı bu satıra bakar"],
     ["kış", 4, "12:00", "12:50", "Salı; Çarşamba; Perşembe; Cuma; Cumartesi", "ÖRNEK — 'tam gün' öğrenci kuralı bu satıra bakar"]],
    {"A": L_DONEM},
    "ders_saatleri (ÖNERİ SAYFA) — 'tam gün öğrenci yalnızca 3. ve 4. derse yazılır' kuralı buradan okunur.")

# ---------------------------------------------------------- SABİT DERSLER
sayfa_kur(
    wb, "sabit_dersler",
    [("kayit_no", 10, True), ("ogrenci_no", 12, True), ("personel_no", 12, True),
     ("gun", 12, True), ("ders_sirasi", 12, True), ("ders_turu", 12, False),
     ("kirmizi_ucretli_mi", 16, False), ("notlar", 34, False)],
    [[1, "OGR-001", "PER-002", "Salı", 3, "bireysel", "hayır", "Ergoterapi — sabit, dokunulmaz"],
     [2, "OGR-002", "PER-002", "Perşembe", 4, "bireysel", "evet", "Ücretli özel ders — kırmızı"]],
    {"D": L_GUN, "F": L_DERS_TURU, "G": L_EVET_HAYIR},
    "sabit_dersler (ÖNERİ SAYFA) — otomatik yerleştirmenin dokunmayacağı dersler ve kırmızı (ücretli) dersler.")

hedef = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sablonlar", "20-09-2026 veri-sablonu.xlsx")
wb.save(hedef)
print("oluşturuldu:", hedef)
