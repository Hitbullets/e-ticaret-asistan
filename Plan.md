# Plan.md — SatışMetni AI: Türk E-Ticaret Satıcıları için Otomatik Ürün İçeriği Servisi

---

## 1. Project Overview

**Proje Adı:** SatışMetni AI

**Problem:** Türkiye'de Trendyol, Hepsiburada, N11 ve Instagram üzerinden satış yapan yüz binlerce küçük satıcı var. Bu satıcıların büyük çoğunluğu ürün başlığı, açıklaması, SEO anahtar kelimeleri ve sosyal medya tanıtım metinlerini kendileri yazıyor. Sonuç: düşük arama sıralaması, düşük dönüşüm, zaman kaybı. Profesyonel içerik ajansları ürün başına 300–800 ₺ istiyor; küçük satıcı bunu karşılayamıyor.

**Çözüm:** Satıcı, ürün fotoğrafını ve 1–2 cümlelik temel bilgiyi yükler; sistem AI ile şunları üretir:
- Pazaryeri kurallarına uygun, SEO-optimize ürün başlığı (Trendyol 100 karakter kuralı vb.)
- Zengin ürün açıklaması (özellik listesi + fayda odaklı metin)
- Arama anahtar kelimeleri listesi
- 3 adet Instagram/Reels tanıtım metni (hashtag'lerle)

Teslimat otomatik, dakikalar içinde. İnsan denetimi yalnızca kalite örneklemesi ve müşteri iletişiminde gerekir.

**Hedef Müşteri:** Türkiye'de pazaryerlerinde satış yapan, aylık 10–500 ürün listeleyen mikro ve küçük satıcılar (tek kişilik butikler, dropshipping yapanlar, el emeği üreticileri, Instagram butikleri).

**Değer Önerisi:** "Ajans kalitesinde ürün içeriğini, ajans fiyatının onda birine, 5 dakikada al." Ürün başına 300–800 ₺ yerine paket başına ürün maliyeti 15–40 ₺'ye düşer.

---

## 2. Market Reality Check

**İlk ödeme beklentisi:** Lansmandan itibaren **1–2 ay** içinde ilk ödeme. Gerekçe: hedef kitle Facebook grupları, Telegram satıcı grupları ve Instagram üzerinden doğrudan ulaşılabilir durumda; ürün anında değer üretiyor ve düşük fiyatlı deneme paketi ödeme kararını kolaylaştırıyor.

**Gerçekçi 6 aylık gelir aralığı:**
- **Alt sınır:** ~9.000 ₺ toplam (ilk 2 ay 0 ₺, sonrasında ayda 5–10 küçük paket satışı)
- **Üst sınır:** ~90.000 ₺ toplam (4. aydan itibaren ayda 40–60 paket + 10–15 aylık abone)

**Bu tahminlerin dayandığı varsayımlar:**
1. Haftada en az 10 saat aktif pazarlama/satış eforu harcanacak (tam pasif değil).
2. Deneme paketi (49–99 ₺) dönüşüm oranı, doğrudan ulaşılan satıcılarda %2–5 arasında.
3. Deneme yapan müşterilerin %20–30'u daha büyük pakete veya aboneliğe geçer.
4. Trendyol/Hepsiburada satıcı topluluklarına (Facebook/Telegram grupları, toplamda 100.000+ üye) organik erişim mümkün.
5. AI API maliyeti paket fiyatının %5'inin altında kalır (kâr marjı %85+).

---

## 3. Revenue Model

**Para kazanma yöntemi:** Kullandıkça öde (paket) + aylık abonelik hibrit modeli.

**Fiyatlandırma:**

| Paket | İçerik | Fiyat |
|---|---|---|
| Deneme | 3 ürün içeriği | 49 ₺ |
| Başlangıç | 10 ürün içeriği | 349 ₺ |
| Büyüme | 30 ürün içeriği | 799 ₺ |
| Abonelik | Ayda 50 ürün + öncelikli destek | 1.499 ₺/ay |

**Ödeme sağlayıcısı (somut seçim, aşamalı):**
- **Faz 1 (0–2. ay):** Havale/EFT (FAST) ile doğrudan IBAN'a ödeme. Şahıs adına, ödeme sağlayıcı sözleşmesi gerektirmeden en hızlı başlangıç. IBAN ve hesap sahibi bilgisi **yalnızca** `.env` içindeki `PAYMENT_IBAN`, `PROJECT_OWNER_NAME`, `PAYMENT_BANK_NAME` değişkenlerinden okunur ve ödeme sayfasında sunucu tarafında render edilir.
- **Faz 2 (3. aydan itibaren):** **PayTR** entegrasyonu (şahıs/şahıs şirketi başvurusu kabul eden, Türkiye odaklı, kredi kartı + taksit destekli). Alternatif: **Papara Checkout**. iyzico, şirket kurulumu sonrası değerlendirilir.

**İlk gelir mekanizması:** Satıcı gruplarında/DM'de birebir ulaşılan 100 satıcıya "ilk ürün içeriği ücretsiz" teklifi → ücretsiz örnek otomatik üretilir → beğenen satıcıya 49 ₺'lik deneme paketi linki gönderilir → havale bildirimi formu doldurulur → sistem içerikleri üretip e-posta ile teslim eder.

**Otomasyon seviyesi:**
- İçerik üretimi: **%100 otomatik** (AI pipeline)
- Teslimat (e-posta + panel): **%100 otomatik**
- Ödeme doğrulama (Faz 1 havale): **manuel onay gerekir** (günde ~10 dk; banka bildirimi kontrol edilip panelden "onayla" tıklanır). Faz 2'de PayTR webhook ile tam otomatik.
- Müşteri edinme: yarı otomatik (hazır DM şablonları + içerik takvimi; gönderim insan eliyle)
- Kalite kontrolü: haftalık örnekleme ile insan denetimi (~1 saat/hafta)

---

## 4. Legal & Compliance

**Şahıs olarak gelir alma (genel bilgilendirme — kesin oran/tutar iddiası değildir):**
- Türkiye'de düzenli ve süreklilik arz eden ticari kazanç, şahıs adına alınsa dahi gelir vergisine tabi olabilir. Belirli internet satışı/hizmet gelirleri için esnaf muaflığı ve genç girişimci istisnası gibi mekanizmalar mevcuttur ancak sınırları ve şartları yıla göre değişir.
- **Zorunlu not:** Uygulayıcı ve proje sahibi, ilk gelir elde edilmeden önce bir **mali müşavire danışmalıdır**. Bu plan vergi/hukuk tavsiyesi değildir. Gelir belli bir düzeye ulaştığında şahıs şirketi kurulumu (düşük maliyetli, e-Devlet üzerinden başlatılabilir) planlanmalıdır.
- **Fatura:** Şahıs olarak fatura kesilemez; müşteri fatura talep ederse şahıs şirketi kurulana kadar bu müşteri segmenti ertelenir veya gider pusulası/mali müşavir yönlendirmesi yapılır. Kurumsal müşteriler Faz 3'e bırakılır.

**KVKK uyumu (müşteri verisi toplandığı için zorunlu):**
- Toplanan veriler: ad, e-posta, telefon (opsiyonel), ürün bilgileri. Sitede **Aydınlatma Metni** ve **Açık Rıza** kutusu bulunacak.
- Veriler yalnızca hizmet sunumu için işlenecek; üçüncü taraflarla paylaşılmayacak (AI API'sine gönderilen ürün metinleri kişisel veri içermeyecek şekilde temizlenecek).
- Veri silme talebi için e-posta kanalı tanımlanacak.

**Ödeme bilgisi güvenliği (tekrar vurgu):**
- `PAYMENT_IBAN`, `PROJECT_OWNER_NAME`, `PAYMENT_BANK_NAME` değerleri **hiçbir aşamada** bu plan dosyasına, kod deposuna, log kayıtlarına veya üçüncü parti servislere (AI API'leri dahil) açık metin olarak yazılmayacak/gönderilmeyecek.
- Depoda yalnızca placeholder değerli `.env.example` bulunacak; gerçek `.env` dosyası `.gitignore`'da olacak ve **yalnızca kullanıcı tarafından elle** doldurulacak. Hiçbir AI modeli gerçek değerleri üretmeyecek, istemeyecek veya işlemeyecek.

---

## 5. Customer Acquisition

**İlk müşteri kaynağı (0–2. ay):**
1. Facebook'taki "Trendyol Satıcıları", "Hepsiburada Satıcı Destek", "E-ticaret Girişimcileri" grupları (her biri 20.000–100.000 üye)
2. Telegram satıcı grupları
3. Instagram'da küçük butik hesaplarına doğrudan DM (günde 20 hesap, kişiselleştirilmiş mesaj)

**Satış yöntemi:** "Önce değer" — bir ürününün içeriğini ücretsiz üret, farkı göster, sonra deneme paketi sat. DM şablonları ve ücretsiz örnek üretimi sistematikleştirilecek.

**Pazarlama kanalları (3. aydan itibaren):**
- Instagram/TikTok'ta "kötü ürün açıklaması → AI ile düzeltilmiş hali" öncesi/sonrası içerikleri (haftada 3 post, AI ile üretilir)
- Google'da "trendyol ürün açıklaması nasıl yazılır" tarzı aramalara yönelik SEO blog yazıları (AI ile üretilir, insan editöründen geçer)
- Memnun müşterilere %20 komisyonlu referans linki

**Otomatik kazanım mekanizması:** Sitedeki "1 ürün içeriğini ücretsiz dene" aracı → e-posta karşılığı ücretsiz üretim → 24 saat ve 72 saat sonra otomatik takip e-postası (deneme paketi indirimi) → dönüşüm. Bu huni tamamen otomatiktir.

---

## 6. Product Definition

**MVP (Faz 1'de teslim edilecek):**
1. Tek sayfalık pazarlama sitesi (değer önerisi + fiyatlar + ücretsiz deneme aracı)
2. Ücretsiz deneme aracı: ürün bilgisi gir → 1 içerik seti anında üret → e-posta ile gönder
3. Sipariş formu: paket seç → havale bilgileri sayfası (`.env`'den okunan IBAN) → havale bildirim formu
4. Basit admin paneli: bekleyen siparişler, "ödemeyi onayla" butonu, onayda otomatik üretim + e-posta teslimatı
5. AI üretim pipeline'ı: başlık + açıklama + anahtar kelimeler + 3 sosyal medya metni

**Temel özellikler (MVP sonrası sırayla):**
1. Müşteri paneli (geçmiş siparişler, içerik indirme, yeniden üretme hakkı)
2. Toplu yükleme (CSV/Excel ile 30 ürün birden)
3. PayTR entegrasyonu (kart ile otomatik ödeme)
4. Abonelik yönetimi ve aylık kota takibi
5. Trendyol API entegrasyonu (içeriği doğrudan mağazaya gönderme) — ölçekleme fazı

**Ölçekleme planı:** Abonelik ağırlıklı gelire geçiş → Trendyol entegrasyonu ile "tak-çalıştır" deneyim → ajanslara beyaz etiket (white-label) API satışı.

---

## 7. Technical Architecture

**Teknoloji yaklaşımı:** Next.js (App Router) tek uygulama — pazarlama sitesi, müşteri paneli, admin paneli ve API aynı projede. Hosting: **Vercel** (ücretsiz plan yeterli). Veritabanı: **Neon** (serverless PostgreSQL, ücretsiz plan). AI: **Vercel AI Gateway** üzerinden LLM çağrıları. E-posta: **Resend** (ücretsiz kota).

**Başlangıç maliyeti üst sınırı:** **2.500 ₺** (alan adı ~500 ₺/yıl + AI API kredisi ~1.000 ₺ + tampon ~1.000 ₺). Hosting ve DB ücretsiz planlarla başlar.

**Veri modeli (somut alanlar):**

```
users:        id, email, name, phone, kvkk_consent_at, created_at
orders:       id, user_id, package_type (trial|starter|growth|subscription),
              amount_try, status (pending_payment|paid|delivered|cancelled),
              payment_method (bank_transfer|paytr), payment_notified_at,
              approved_at, created_at
products:     id, order_id, input_title, input_description, input_category,
              image_url, created_at
generations:  id, product_id, seo_title, description_html, keywords (jsonb),
              social_posts (jsonb), model_used, status (queued|done|failed),
              created_at
subscriptions:id, user_id, status (active|cancelled), monthly_quota,
              used_this_month, renews_at, created_at
```

**Klasör yapısı:**

```
/app
  /page.tsx                 → pazarlama sitesi + ücretsiz deneme
  /siparis/page.tsx         → paket seçimi ve sipariş formu
  /odeme/[orderId]/page.tsx → havale bilgileri (env'den) + bildirim formu
  /panel/...                → müşteri paneli
  /admin/...                → sipariş onay paneli (basit auth ile korunur)
  /api/generate/route.ts    → AI üretim endpoint'i
  /api/orders/route.ts      → sipariş oluşturma
  /api/webhooks/paytr/route.ts → Faz 2 ödeme webhook'u
/lib
  /db.ts, /ai.ts, /email.ts, /pricing.ts
/scripts
  /001_init_schema.sql
.env.example
.gitignore                  → .env burada listeli OLMALI
```

**Ortam değişkenleri — `.env.example` (yalnızca placeholder, gerçek değer YOK):**

```
# Ödeme (gerçek değerleri KULLANICI elle girer, asla AI'ya verilmez)
PROJECT_OWNER_NAME=your_name_here
PAYMENT_IBAN=your_iban_here
PAYMENT_BANK_NAME=your_bank_here

# Servisler
DATABASE_URL=your_neon_connection_string
AI_GATEWAY_API_KEY=your_key_here
RESEND_API_KEY=your_key_here

# Faz 2
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_key
PAYTR_MERCHANT_SALT=your_salt

# Admin
ADMIN_PASSWORD=change_me
```

**Güvenlik kuralları (zorunlu):**
- `.env` dosyası `.gitignore`'a eklenir; asla commit edilmez, koda gömülmez, `console.log` ile yazdırılmaz.
- `PAYMENT_IBAN` ve `PROJECT_OWNER_NAME` yalnızca sunucu tarafında (Server Component / Route Handler) okunur; client bundle'a sızmaz (NEXT_PUBLIC_ öneki KULLANILMAZ).
- Bu değişkenler hiçbir log, hata raporu veya üçüncü parti API çağrısına dahil edilmez.

---

## 8. Development Roadmap

**Phase 1 — MVP ve İlk Satış (Hafta 1–4)**
- Görevler: Site + ücretsiz deneme aracı + AI pipeline + sipariş/havale akışı + admin onay paneli + KVKK metinleri
- Beklenen çıktı: Yayında, uçtan uca çalışan sistem
- **KPI:** 100 satıcıya doğrudan ulaşım, 30 ücretsiz deneme, **3 ödemeli sipariş (≥147 ₺ gelir)**

**Phase 2 — Dönüşüm Optimizasyonu (Ay 2–3)**
- Görevler: Otomatik takip e-postaları, müşteri paneli, toplu yükleme (CSV), öncesi/sonrası sosyal medya içerik üretimi
- Beklenen çıktı: Kendi kendine dönüştüren huni
- **KPI:** Ayda **15 ödemeli sipariş**, deneme→ücretli dönüşüm **≥%20**, aylık gelir **≥5.000 ₺**

**Phase 3 — Ödeme Otomasyonu ve Abonelik (Ay 3–4)**
- Görevler: PayTR entegrasyonu, abonelik ve kota sistemi, referans programı, mali müşavir görüşmesi + şahıs şirketi değerlendirmesi
- Beklenen çıktı: İnsan onayı gerektirmeyen ödeme akışı
- **KPI:** **5 aktif abone**, manuel ödeme onayı oranı **<%20**, aylık gelir **≥12.000 ₺**

**Phase 4 — Ölçekleme (Ay 5–6)**
- Görevler: SEO blog motoru (haftada 2 yazı), Trendyol API entegrasyonu araştırması/prototipi, ajans/white-label teklifi
- Beklenen çıktı: Organik trafikten gelen müşteri akışı
- **KPI:** Aylık **1.000 organik ziyaret**, **10+ aktif abone**, aylık gelir **≥20.000 ₺**

---

## 9. AI Developer Instructions

**Projeyi anlama:** Bu, tek kişinin işlettiği bir içerik-servisi SaaS'ıdır. Öncelik her zaman "ödeme alan, çalışan akış"tır; mükemmel mimari değil.

**İlk yapılacaklar (sırayla):**
1. `.env.example` dosyasını yukarıdaki placeholder içerikle oluştur. **Gerçek değer üretme, sorma, işleme.** `.gitignore`'a `.env` ekle.
2. Neon veritabanını bağla, `scripts/001_init_schema.sql` ile şemayı kur.
3. AI üretim pipeline'ını yaz ve tek bir ürünle uçtan uca test et.
4. Pazarlama sitesi + ücretsiz deneme aracını yap.
5. Sipariş → havale sayfası → bildirim formu → admin onayı → otomatik üretim + e-posta teslimat zincirini tamamla.

**Kodlama sırası kuralı:** Her zaman gelir akışına en yakın eksik parça önce yapılır.

**Karar verme kuralları:**
- Belirsizlikte en basit çözümü seç; soru sormadan ilerle, varsayımını kod yorumuna yaz.
- Türkçe arayüz metinleri kullan; para birimi her yerde ₺ ve `Intl.NumberFormat('tr-TR')`.
- Kişisel/finansal env değerlerini asla loglamaz, client'a göndermez, üçüncü parti API'ye iletmezsin.

**Test yaklaşımı:** Her fazda uçtan uca manuel senaryo: "yeni müşteri deneme yapar → sipariş verir → ödeme onaylanır → içerik e-postayla ulaşır." AI çıktıları için 5 örnek ürünle kalite kontrol listesi (başlık ≤100 karakter, açıklama ≥150 kelime, ≥10 anahtar kelime, 3 sosyal post).

**Kabul kriterleri (Faz 1):** Ücretsiz deneme 60 saniyede sonuç döner; sipariş akışı mobilde hatasız; admin onayı sonrası teslimat e-postası 2 dakika içinde gider; `.env` deposuz ve loglar temiz.

---

## 10. Monetization Execution

**Ödeme akışı (Faz 1):**
1. Müşteri paketi seçer → `orders` tablosuna `pending_payment` kaydı düşer.
2. Ödeme sayfası, **sunucu tarafında** `process.env.PAYMENT_IBAN`, `process.env.PROJECT_OWNER_NAME`, `process.env.PAYMENT_BANK_NAME` değerlerini okuyarak havale bilgilerini ve sipariş numaralı açıklamayı gösterir. (Bu değerler kodda, planda veya logda asla açık yazılmaz; yalnızca değişken adı ile referans verilir.)
3. Müşteri "Havaleyi yaptım" formunu doldurur → `payment_notified_at` işlenir, admin'e e-posta gider.
4. Admin panelden onaylar → durum `paid` → üretim kuyruğu tetiklenir → içerikler üretilir → teslimat e-postası → durum `delivered`.

**Ödeme akışı (Faz 2):** PayTR iFrame → webhook `paid` durumunu otomatik işler → insan onayı devreden çıkar.

**Gelir takibi:** Admin panelinde günlük/aylık gelir, paket dağılımı, dönüşüm oranı kartları (`orders` tablosundan sorgulanır). Haftalık otomatik özet e-postası.

**Otomasyon sistemi:** Sipariş onayı → üretim → teslimat → 7 gün sonra memnuniyet + tekrar satış e-postası → abonelik teklifi. Tüm zincir cron/queue ile otomatik.

---

## 11. Risk Analysis

| Risk | Açıklama | Alternatif Çözüm |
|---|---|---|
| **Teknik** | AI çıktı kalitesinin pazaryeri kurallarına uymaması | Kural tabanlı doğrulama katmanı (karakter limiti, yasaklı kelime filtresi) + haftalık insan örneklemesi |
| **Pazar** | Satıcıların ChatGPT'yi ücretsiz kullanması | Farklılaşma: pazaryeri kurallarına özel şablonlar, toplu üretim, panel + teslimat kolaylığı; "zaman tasarrufu" satılır, metin değil |
| **Satış** | DM/grup erişiminin yetersiz kalması | Referans komisyonunu %30'a çıkar; mikro-influencer satıcılarla ortaklık; ücretsiz araç viral döngüsü |
| **Yasal** | Şahıs geliri vergilendirme belirsizliği | İlk gelirden önce mali müşavir; eşik aşımında hızlı şahıs şirketi kurulumu |
| **Ödeme** | Havale sürtünmesinin dönüşümü düşürmesi | PayTR entegrasyonunu öne çek (Faz 2 → Faz 1.5); Papara alternatifi |
| **Platform** | Facebook gruplarında spam engeli | Kanal çeşitliliği: SEO içerik + Instagram organik + referans programı |

---

## 12. Final AI Execution Prompt

```
Bu depodaki Plan.md dosyasını oku ve talimatları eksiksiz uygula.

Kurallar:
1. "AI Developer Instructions" bölümündeki sırayla ilerle; gelir akışına en
   yakın eksik parçayı önce yap.
2. Yalnızca placeholder değerli .env.example oluştur. Gerçek IBAN, isim veya
   API anahtarı ÜRETME, SORMA, İŞLEME. .env dosyasını .gitignore'a ekle.
3. PAYMENT_IBAN, PROJECT_OWNER_NAME, PAYMENT_BANK_NAME değişkenlerini yalnızca
   sunucu tarafında oku; asla loglama, client'a veya üçüncü parti servise
   gönderme.
4. Belirsizlikte soru sorma: en basit çözümü uygula ve varsayımını kod
   yorumuna yaz.
5. Her fazın sonunda Plan.md'deki KPI ve kabul kriterlerine göre kendi
   çıktını doğrula; eksikse tamamlamadan sonraki faza geçme.

Hedef: Faz 1 MVP'yi uçtan uca çalışır ve yayınlanabilir hale getir.
```

---

## Son Kontrol Doğrulaması

- ✅ İlk gelir zaman çizelgesi somut: 1–2 ay (Bölüm 2)
- ✅ Her roadmap fazında sayısal KPI tanımlı (Bölüm 8)
- ✅ Yasal/KVKK bölümü dolduruldu, mali müşavir yönlendirmesi mevcut (Bölüm 4)
- ✅ Hiçbir gerçek kişisel/finansal veri yok; yalnızca `.env` değişken adları kullanıldı
- ✅ Uygulayıcı AI modeli, Bölüm 9 ve 12 ile soru sormadan ilerleyebilir
