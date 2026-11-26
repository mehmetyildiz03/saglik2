# Denge

Denge bir tahlil defteri. Raporundaki ölçümleri sistemlere göre düzenler ve zaman içindeki değişimlerini grafiklerde gösterir.

[GitHub Pages’te Denge’yi aç](https://mehmetyildiz03.github.io/saglik2/)

## Kullanım

1. **Tahlil ekle** ile bir PDF, JPG, PNG, WebP veya metin dosyası seç. Dilersen rapor metnini yapıştır veya ölçümü elle gir.
2. Kontrol ekranında her ölçümün tarihini, değerini, birimini ve referans aralığını raporla karşılaştır. Eksik bir ölçümü burada elle ekleyebilirsin. **Sonuçları kaydet** ile yeni kayıtları defterine ekle.
3. **Analiz sistemleri** ekranında bir ölçümü ara veya yıldızla favorilerine ekle. Geçmiş grafiğindeki bir noktaya dokunarak o günün sonucunu ve referans aralığını gör.
4. **Tahlil defterim** ekranında **Tarihleri karşılaştır** ile iki tarihteki ortak ölçümleri yan yana aç.
5. **Randevu özeti** ile bir tarih aralığı ve ölçümler seç. Önizlemeyi kontrol edip PDF’yi indir. Ölçüm notlarını eklemek için önizlemedeki seçeneği işaretle.

Metin raporlarında ölçüm adı ve sonuç aynı satırda olmalı. Tarihi bölüm başlığında veya ölçüm satırının başında belirtebilirsin. Noktalı virgülle ayrılmış metinde isteğe bağlı beşinci sütun ölçüm tarihidir. Birim ve referans isteğe bağlıdır.

```text
Tahlil tarihi: 21.08.2026
Hemoglobin 13,5 g/dL 12 - 16

Tahlil tarihi: 13.11.2026
Hemoglobin 13,8 g/dL 12 - 16
LDL kolesterol 136 mg/dL <130
Özel ölçüm;4,2;mg/L;2 - 6;2026-11-14
```

PDF için 12 sayfa, dosya başına 20 MB sınırı var. Okuma doğruluğu rapor düzenine ve görselin netliğine bağlıdır. Uygulama tanı koymaz.

Belirsiz tarihler kontrol ekranında boş bırakılır. Örneğin bir PDF sayfasında tarih belirtilmemişse o sayfanın ölçümlerine tarih ekleyebilirsin. Aynı ölçüm, tarih, sonuç, birim ve referansla kayıtlı satırlar zaten defterde olarak işaretlenir.

Raporlar tarayıcıda okunur. Kaydedilen ölçümler bu tarayıcının yerel depolama alanında durur. Tarayıcı verilerini silersen defter de silinir. Örnek veriler kişisel deftere eklenmez.

Ölçüm geçmişinde **Düzenle** ile kısa bir not ekleyebilirsin. Özet oluşturma, tarih karşılaştırma ve yedek indirme görevlerini **Tüm görevler** ekranında görebilirsin.

## Yedekleme ve çevrimdışı kullanım

- **Tahlil defterim → Yedekle → Yedeği indir** ile kişisel ölçümlerini, notlarını ve favorilerini bir JSON dosyasında saklayabilirsin. Dosya sağlık verisi içerir.
- Diğer cihazda veya tarayıcıda Denge’yi açıp **Yedekle** ekranından dosyanı seç. Kaç ölçüm ve favorinin ekleneceğini kontrol edip **Yedeği geri yükle**’ye dokun. Mevcut kayıtlarınla aynı ölçümler tekrar eklenmez.
- Mobil tarayıcının menüsünden Denge’yi ana ekranına ekleyebilirsin. iPhone ve iPad’de Safari’nin **Paylaş → Ana Ekrana Ekle** seçeneğini kullan.
- Denge’yi bir kez internete bağlıyken açtıktan sonra defter, grafikler, elle ölçüm ekleme, yedekleme ve randevu özeti çevrimdışı çalışır. PDF ve fotoğraf okumak için internet gerekir.

## Geliştirme

Statik siteyi çalıştırmak için deponun kök dizininde aşağıdaki komutu çalıştırıp `http://localhost:8000` adresini aç.

```sh
python3 -m http.server 8000
```

Sitenin bir derleme adımı yok. GitHub Actions içindeki **Publish Denge** akışı `main` güncellemelerinde siteyi yayımlar. Aynı akış **Run workflow** üzerinden elle de çalıştırılabilir.

Rapor okuma, karşılaştırma, randevu özeti ve yedekleme kontrollerini Node.js 24 veya üzeri ile çalıştırabilirsin.

```sh
node --test tests/*.test.mjs
```

PDF.js, Tesseract.js, jsPDF, Türkçe OCR modeli ve yazı tipleri siteyle birlikte sunulur. Kütüphane ve yazı tipi lisansları `vendor/` ve `assets/` dizinlerindedir.
