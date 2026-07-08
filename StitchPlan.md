# StitchPlan.md — SatışMetni AI Proje Yapısı ve Bileşen Haritası

---

## 1. Proje Özeti

**Proje:** SatışMetni AI — Türkiye'deki e-ticaret satıcıları için otomatik ürün içerik üretim servisi
**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
**DB:** Neon PostgreSQL + Drizzle ORM
**AI:** Google Gemini Flash (birincil) + xAI Grok (yedek fallback)
**E-posta:** Resend
**Ödeme:** Havale/EFT + PayTR (kredi kartı)

---

## 2. Dosya Yapısı (Tam Ağaç)

```
/
├── .env                              ← Ortam değişkenleri (DB, AI key, PayTR, admin şifresi)
├── .env.example                      ← Placeholder değerler
├── .gitignore                        ← .env listeli
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── components.json                   ← shadcn/ui yapılandırması (base-nova)
├── drizzle.config.ts                 ← Drizzle ORM yapılandırması
├── pnpm-lock.yaml
│
├── scripts/
│   └── 001_init_schema.sql           ← DB şeması (users, orders, products, generations, subscriptions)
│
├── lib/
│   ├── utils.ts                      ← cn() helper (mevcut, dokunulmaz)
│   ├── db.ts                         ← Neon connection (lazy pattern)
│   ├── db-schema.ts                  ← Drizzle schema + relations
│   ├── ai.ts                         ← AI pipeline (Gemini + Grok fallback)
│   ├── email.ts                      ← Resend e-posta fonksiyonları
│   ├── pricing.ts                    ← Paket tanımları ve fiyatlandırma
│   └── paytr.ts                      ← PayTR hash, token, callback doğrulama
│
├── components/
│   ├── ui/                           ← shadcn/ui bileşenleri
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   ├── table.tsx
│   │   └── dialog.tsx
│   ├── navbar.tsx                    ← Sticky responsive navbar
│   ├── footer.tsx                    ← 4 sütunlu footer
│   ├── trust-badges.tsx              ← SSL/KVKK/güvenlik rozetleri
│   └── step-indicator.tsx            ← Sipariş adım göstergesi
│
├── app/
│   ├── globals.css                   ← Tema renkleri (Emerald/Amber), typography
│   ├── layout.tsx                    ← Root layout (navbar + footer + toaster)
│   ├── page.tsx                      ← Ana sayfa (pazarlama + deneme)
│   │
│   ├── siparis/
│   │   └── page.tsx                  ← Paket seçimi + sipariş formu
│   │
│   ├── odeme/
│   │   ├── [orderId]/
│   │   │   ├── page.tsx              ← Ödeme sayfası (havale + PayTR)
│   │   │   ├── payment-notify-form.tsx ← Havale bildirim formu (client)
│   │   │   └── paytr-payment-button.tsx ← PayTR butonu (client)
│   │   ├── success/
│   │   │   └── page.tsx              ← Ödeme başarılı ekranı (Faz 2)
│   │   └── fail/
│   │       └── page.tsx              ← Ödeme başarısız ekranı (Faz 2)
│   │
│   ├── panel/
│   │   └── page.tsx                  ← Müşteri paneli (Faz 2, placeholder)
│   │
│   ├── admin/
│   │   ├── layout.tsx                ← Auth guard (cookie kontrolü)
│   │   ├── login/
│   │   │   └── page.tsx              ← Admin giriş ekranı
│   │   ├── page.tsx                  ← Admin dashboard
│   │   └── siparisler/
│   │       ├── page.tsx              ← Sipariş listesi
│   │       └── approve-button.tsx    ← Onay butonu (client)
│   │
│   └── api/
│       ├── trial/
│       │   └── route.ts              ← POST: Ücretsiz deneme içerik üretimi
│       ├── orders/
│       │   ├── route.ts              ← POST: Sipariş oluşturma
│       │   └── [orderId]/
│       │       ├── notify-payment/
│       │       │   └── route.ts      ← POST: Havale bildirimi
│       │       └── paytr/
│       │           └── route.ts      ← POST: PayTR iFrame token
│       ├── webhooks/
│       │   └── paytr/
│       │       └── route.ts          ← POST: PayTR webhook callback
│       └── admin/
│           ├── auth/
│           │   └── route.ts          ← POST: Admin giriş (cookie ayarla)
│           ├── orders/
│           │   └── route.ts          ← GET: Sipariş listesi
│           └── approve/
│               └── [orderId]/
│                   └── route.ts      ← POST: Sipariş onay + üretim + e-posta
│
└── .claude/
    └── skills/
        └── ui-ux-pro-max/            ← UI/UX Pro Max skill (design system)
```

---

## 3. Veritabanı Şeması

### Tablolar

| Tablo | Alanlar | Açıklama |
|---|---|---|
| **users** | id, email, name, phone, kvkk_consent_at, created_at | Müşteriler |
| **orders** | id, user_id, package_type, amount_try, status, payment_method, payment_notified_at, approved_at, created_at | Siparişler |
| **products** | id, order_id, input_title, input_description, input_category, image_url, created_at | Ürün girdileri |
| **generations** | id, product_id, seo_title, description_html, keywords (jsonb), social_posts (jsonb), model_used, status, created_at | Üretilen içerikler |
| **subscriptions** | id, user_id, status, monthly_quota, used_this_month, renews_at, created_at | Abonelikler |

### Durum Değerleri

**orders.status:** `pending_payment` → `paid` → `delivered` | `cancelled`
**orders.payment_method:** `bank_transfer` | `paytr`
**generations.status:** `queued` | `done` | `failed`
**subscriptions.status:** `active` | `cancelled`

### Relations

```
users 1──∞ orders
orders 1──∞ products
products 1──∞ generations
users 1──∞ subscriptions
```

---

## 4. Sayfa Yapısı ve Bileşen Haritası

### 4.1 — Ana Sayfa (`/`)

**Tip:** Client Component ('use client')
**Dosya:** `app/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Hero** | Badge, h1, p, Button x2, stats grid | Gradient arka plan, CTA butonları, istatistikler |
| **Trust Badges** | TrustBadges | SSL, KVKK, teslimat, güvenli ödeme |
| **Özellikler** | Card x4 (icon + başlık + açıklama) | 4 özellik kartı (SEO, açıklama, sosyal medya, hız) |
| **Nasıl Çalışır** | 3 adım (number circle + başlık + açıklama) | 3 adımlık süreç |
| **Fiyatlandırma** | Card x4 (fiyat + özellik listesi + buton) | 4 paket kartı |
| **Deneme Formu** | Card, Form (Input x3, Textarea, Button) | Ücretsiz deneme formu + sonuç gösterimi |

**API Kullanımı:** `POST /api/trial` → `{ productName, description, category, email }`

**State:**
- `trialForm` — form verileri
- `trialLoading` — yükleme durumu
- `trialResult` — üretilen içerik (null veya { seoTitle, descriptionHtml, keywords, socialPosts })

---

### 4.2 — Sipariş Sayfası (`/siparis`)

**Tip:** Client Component
**Dosya:** `app/siparis/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Step Indicator** | StepIndicator | 3 adım: Paket → Bilgiler → Ödeme |
| **Paket Seçimi** | Card x4 (seçilebilir) | Hover'da yükselen, seçili olan border+shadow |
| **Müşteri Formu** | Card, Input x3, Checkbox (KVKK), Button | Ad, e-posta, telefon |
| **Güven** | Shield, Lock ikonları | SSL + KVKK notları |
| **Trust Badges** | TrustBadges compact | Alt kısım |

**API Kullanımı:** `POST /api/orders` → `{ packageType, customerName, email, phone? }` → `{ orderId }`

**State:**
- `selectedPackage` — seçili paket (PackageType)
- `form` — { name, email, phone }
- `kvkkConsent` — boolean
- `loading` — boolean

**Yönlendirme:** Sipariş sonrası → `/odeme/[orderId]`

---

### 4.3 — Ödeme Sayfası (`/odeme/[orderId]`)

**Tip:** Server Component
**Dosya:** `app/odeme/[orderId]/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Sipariş Özeti** | Card (tutar + paket adı) | Üst kısım |
| **PayTR** | Card, PaytrPaymentButton | Kredi kartı seçeneği (eğer PAYTR_MERCHANT_ID varsa) |
| **Havale** | Card, IBAN kopyalama, banka adı, açıklama | Havale/EFT bilgileri |
| **Havale Bildirimi** | PaymentNotifyForm | "Havaleyi Yaptım" formu |
| **Trust Badges** | TrustBadges compact | Alt kısım |

**Env Okuma (sunucu tarafında):**
- `process.env.PROJECT_OWNER_NAME`
- `process.env.PAYMENT_IBAN`
- `process.env.PAYMENT_BANK_NAME`
- `process.env.PAYTR_MERCHANT_ID` (varsa PayTR gösterilir)

**API Kullanımı:**
- `POST /api/orders/[orderId]/paytr` → PayTR iframe URL
- `POST /api/orders/[orderId]/notify-payment` → `{ email }`

**Child Bileşenler:**
- `payment-notify-form.tsx` — Client, havale bildirim formu
- `paytr-payment-button.tsx` — Client, PayTR yönlendirme butonu

**URL Parametreleri:**
- `?status=success` → Ödeme başarılı ekranı
- `?status=fail` → Ödeme başarısız ekranı

---

### 4.4 — Ödeme Başarılı (`/odeme/success`)

**Tip:** Server Component (static)
**Dosya:** `app/odeme/success/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Onay** | CheckCircle ikonu, h1, açıklama | Büyük onay ikonu |
| **E-posta Notu** | Mail ikonu | E-posta ile bildirim |
| **Sonraki Adımlar** | 3 numaralı adım listesi | İçerik üretim süreci |
| **CTA** | Button → ana sayfa | Ana sayfaya dönüş |

---

### 4.5 — Ödeme Başarısız (`/odeme/fail`)

**Tip:** Server Component (static)
**Dosya:** `app/odeme/fail/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Hata** | XCircle ikonu, h1, açıklama | Büyük hata ikonu |
| **Eylemler** | Button x2 (tekrar dene + ana sayfa) | İki CTA |
| **Destek** | Mail ikonu | destek@satismetni.com |

---

### 4.6 — Admin Giriş (`/admin/login`)

**Tip:** Client Component
**Dosya:** `app/admin/login/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Login Card** | Sparkles ikonu, h1, Input (şifre), Button | Merkezi kart |

**API Kullanımı:** `POST /api/admin/auth` → `{ password }` → cookie ayarla → `/admin`

**State:** `password`, `loading`

---

### 4.7 — Admin Dashboard (`/admin`)

**Tip:** Server Component
**Dosya:** `app/admin/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Stats** | Card x5 (icon + başlık + değer) | Toplam sipariş, bekleyen, ödenen, teslim, gelir |
| **Son Siparişler** | Card, liste (10 sipariş) | İsim, paket, tutar, tarih, durum badge |

**API Kullanımı:** DB'den doğrudan sorgu (5 paralel query + 1 findMany)

**Hata Yönetimi:** DB bağlantı hatasında kırmızı uyarı kartı

---

### 4.8 — Admin Siparişler (`/admin/siparisler`)

**Tip:** Server Component
**Dosya:** `app/admin/siparisler/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Başlık** | Package ikonu, toplam sayı | Sipariş başlığı |
| **Liste** | Card, her sipariş için satır | İsim, e-posta, paket, tutar, tarih, durum, onay butonu |

**API Kullanımı:** DB'den doğrudan sorgu (findMany + with user)

**Child Bileşen:** `approve-button.tsx` — Client, "Ödemeyi Onayla" butonu
- `POST /api/admin/approve/[orderId]` → içerik üret + e-posta gönder

---

### 4.9 — Müşteri Paneli (`/panel`)

**Tip:** Client Component (placeholder)
**Dosya:** `app/panel/page.tsx`

| Bölüm | Bileşenler | Açıklama |
|---|---|---|
| **Başlık** | h1, açıklama | Panel başlığı |
| **Yakında** | Package ikonu, h2, açıklama, buton | "Yakında" mesajı |
| **Önizleme** | Card x3 (icon + başlık + açıklama) | Sipariş geçmişi, içerik indirme, durum takibi |

---

## 5. API Route'ları

### 5.1 — Ücretsiz Deneme (`POST /api/trial`)

**Girdi:**
```json
{ "productName": "string", "description": "string", "category": "string?", "email": "string" }
```

**Çıktı:**
```json
{
  "seoTitle": "string (≤100 kr)",
  "descriptionHtml": "string (HTML, ≥150 kelime)",
  "keywords": ["string"] (≥10 adet),
  "socialPosts": ["string"] (3 adet)
}
```

**Akış:** Validate → AI üret → E-posta gönder → Response

---

### 5.2 — Sipariş Oluşturma (`POST /api/orders`)

**Girdi:**
```json
{ "packageType": "trial|starter|growth|subscription", "customerName": "string", "email": "string", "phone": "string?", "paymentMethod": "bank_transfer|paytr?" }
```

**Çıktı:**
```json
{ "orderId": "string", "packageType": "string", "amount": 349 }
```

**Akış:** Validate → Kullanıcı oluştur/bul → Sipariş oluştur → Response

---

### 5.3 — Havale Bildirimi (`POST /api/orders/[orderId]/notify-payment`)

**Girdi:** `{ "email": "string" }`

**Akış:** Siparişi bul → payment_notified_at güncelle → Admin'e e-posta

---

### 5.4 — PayTR Token (`POST /api/orders/[orderId]/paytr`)

**Çıktı:** `{ "token": "string", "iframeUrl": "string" }`

**Akış:** Siparişi bul → PayTR token iste → iframe URL döndür

---

### 5.5 — PayTR Webhook (`POST /api/webhooks/paytr`)

**Girdi:** PayTR formData (merchant_oid, status, total_amount, hash)

**Akış:** Hash doğrula → Siparişi bul → status=='success' ise: paid yap → İçerik üret → E-posta gönder → delivered yap

---

### 5.6 — Admin Giriş (`POST /api/admin/auth`)

**Girdi:** `{ "password": "string" }`

**Akış:** Şifre kontrolü → Cookie ayarla (24 saat)

---

### 5.7 — Admin Siparişler (`GET /api/admin/orders`)

**Çıktı:** Sipariş listesi (user dahil)

---

### 5.8 — Admin Onay (`POST /api/admin/approve/[orderId]`)

**Akış:** Siparişi bul (products dahil) → status=='paid' kontrol → status='delivered' yap → Her ürün için AI üret → Generasyonları topla → E-posta gönder

---

## 6. Ortam Değişkenleri (.env)

| Değişken | Açıklama | Zorunlu |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | Evet |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | Evet |
| `XAI_API_KEY` | xAI Grok API key (yedek) | Evet |
| `RESEND_API_KEY` | Resend e-posta API key | Evet |
| `PROJECT_OWNER_NAME` | Havale hesap sahibi | Evet |
| `PAYMENT_IBAN` | Havale IBAN'ı | Evet |
| `PAYMENT_BANK_NAME` | Banka adı | Evet |
| `ADMIN_PASSWORD` | Admin paneli şifresi | Evet |
| `PAYTR_MERCHANT_ID` | PayTR mağaza ID | Hayır (Faz 1.5) |
| `PAYTR_MERCHANT_KEY` | PayTR anahtar | Hayır (Faz 1.5) |
| `PAYTR_MERCHANT_SALT` | PayTR salt | Hayır (Faz 1.5) |
| `PAYTR_SUCCESS_URL` | Ödeme başarılı URL | Hayır |
| `PAYTR_FAIL_URL` | Ödeme başarısız URL | Hayır |
| `PAYTR_TEST_MODE` | Test modu (1=aktif) | Hayır |

---

## 7. Mevcut Tema Yapısı

**Renk Paleti (Emerald/Amber):**
- Primary: #059669 (Emerald-600) — ana renk, butonlar, ikonlar
- Accent/CTA: #EA580C (Orange-600) — CTA butonları, vurgu
- Background: #ECFDF5 (Emerald-50) — açık yeşil tonlu arka plan
- Foreground: #064E3B (Emerald-900) — koyu metin
- Border: #A7F3D0 (Emerald-200) — kenarlıklar

**Typography:**
- Başlıklar: Rubik (bold)
- Gövde: Nunito Sans (regular)

**Efektler:**
- `transition-smooth`: 200ms cubic-bezier
- `hover-lift`: translateY(-2px) + shadow

---

## 8. Paket Tipleri ve Fiyatlar

| Paket | Tip | Ürün | Fiyat |
|---|---|---|---|
| Deneme | trial | 3 | 49 ₺ |
| Başlangıç | starter | 10 | 349 ₺ |
| Büyüme | growth | 30 | 799 ₺ |
| Abonelik | subscription | 50/ay | 1.499 ₺/ay |

---

## 9. AI Pipeline Akışı

```
Girdi (productName, description, category)
    ↓
generateProductContent()
    ↓
[1] Gemini Flash dene → Başarılı → Dön
    ↓ (Hata)
[2] xAI Grok 3 dene → Başarılı → Dön
    ↓ (Hata)
Hata fırlat
    ↓
Çıktı: { seoTitle, descriptionHtml, keywords, socialPosts }
```

**Model Kullanımı Kaydı:** `generations.model_used` alanına yazılır

---

## 10. Ödeme Akışları

### Havale/EFT
```
1. Müşteri paket seçer → orders tablosu (pending_payment)
2. /odeme/[orderId] → IBAN + hesap bilgileri göster
3. Müşteri havale yapar → "Havaleyi Yaptım" butonu
4. API: payment_notified_at güncelle → Admin'e e-posta
5. Admin /admin/siparisler → "Ödemeyi Onayla" butonu
6. API: status='paid' → AI üretim → e-posta → status='delivered'
```

### PayTR (Kredi Kartı)
```
1. Müşteri paket seçer → orders tablosu (pending_payment)
2. /odeme/[orderId] → "Kredi Kartı ile Öde" butonu
3. API: PayTR token iste → iframe URL al
4. Müşteri PayTR sayfasında kart bilgileri girer
5. PayTR webhook → /api/webhooks/paytr
6. Hash doğrula → status='paid' → AI üretim → e-posta → status='delivered'
```

---

## 11. E-posta Şablonları

| Şablon | Tetikleyici | İçerik |
|---|---|---|
| **Deneme** | Ücretsiz deneme başarılı | SEO başlık, açıklama, kelimeler, sosyal postlar |
| **Teslimat** | Sipariş onay + üretim tamam | Aynı içerik + paket bilgisi |
| **Ödeme Bildirimi** | Havale bildirimi | Sipariş no, müşteri, paket → Admin |

---

## 12. Güvenlik Kuralları

1. `.env` → `.gitignore`'da, asla commit edilmez
2. `PAYMENT_IBAN`, `PROJECT_OWNER_NAME` → yalnızca server-side (Server Component / Route Handler)
3. `NEXT_PUBLIC_` prefix KULLANILMAZ (client'a sızma yok)
4. Hiçbir log, console.log veya 3. parti API'ye gönderme
5. Admin auth → basit cookie (httpOnly, secure, sameSite: lax, 24 saat)
6. PayTR hash → HMAC-SHA256 ile doğrulama

---

## 13. Deploy Notları

- **Hosting:** Vercel (ücretsiz plan yeterli)
- **Build:** `pnpm build` → hatasız
- **Env:** Vercel dashboard'da ayarlanmalı
- **Domain:** Vercel'e bağlanmalı (PayTR callback URL için gerekli)
- **DB:** Neon serverless → connection pooling otomatik
