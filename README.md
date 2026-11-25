# Denge

Denge bir tahlil defteri. Raporundaki ölçümleri sistemlere göre düzenler ve zaman içindeki değişimlerini grafiklerde gösterir.

[GitHub Pages’te Denge’yi aç](https://mehmetyildiz03.github.io/saglik2/)

## Kullanım

1. **Tahlil ekle** ile bir PDF, JPG, PNG, WebP veya metin dosyası seç. Dilersen rapor metnini yapıştır veya ölçümü elle gir.
2. Ölçümleri, birimleri, referansları ve tarihi orijinal rapordan kontrol et. **Sonuçları kaydet** ile defterine ekle.
3. **Analiz sistemleri** ekranında ölçüm grafiklerine, **Tahlil defterim** ekranında ise kayıtların tamamına ulaş.

Metin raporlarında ölçüm adı ve sonuç aynı satırda olmalı. Tanınmayan bir ölçümü içe aktarmak için noktalı virgül kullanabilirsin. Birim ve referans isteğe bağlıdır.

```text
Rapor tarihi: 13.11.2026
Hemoglobin 13,8 g/dL 12 - 16
LDL kolesterol 136 mg/dL <130
Özel ölçüm;4,2;mg/L;2 - 6
```

PDF için 12 sayfa, dosya başına 20 MB sınırı var. Okuma doğruluğu rapor düzenine ve görselin netliğine bağlıdır. Uygulama tanı koymaz.

Raporlar tarayıcıda okunur. Kaydedilen ölçümler bu tarayıcının yerel depolama alanında durur. Tarayıcı verilerini silersen defter de silinir. Örnek veriler kişisel deftere eklenmez.

## Geliştirme

Statik siteyi çalıştırmak için deponun kök dizininde aşağıdaki komutu çalıştırıp `http://localhost:8000` adresini aç.

```sh
python3 -m http.server 8000
```

Sitenin bir derleme adımı yok. GitHub Actions içindeki **Publish Denge** akışı `main` güncellemelerinde siteyi yayımlar. Aynı akış **Run workflow** üzerinden elle de çalıştırılabilir.

PDF.js, Tesseract.js, Türkçe OCR modeli ve yazı tipleri siteyle birlikte sunulur. Kütüphane ve yazı tipi lisansları `vendor/` ve `assets/` dizinlerindedir.
