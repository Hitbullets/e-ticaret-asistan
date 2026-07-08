# Phase 2 — Dönüşüm Optimizasyonu Planı

**Tarih:** 8 Temmuz 2026
**Hedef:** Kendi kendine dönüştüren huni, aylık ≥15 ödemeli sipariş

---

## Görev 1: Panel API + Müşteri Paneli
**Öncelik:** 🔴 Yüksek | **Tahmini:** 30 dk

### Yapılacaklar:
1. `app/api/panel/route.ts` — E-posta + sipariş no ile giriş API'si
2. `app/panel/page.tsx` — Placeholder'ı tam fonksiyonel panale çevir
   - E-posta formu ile giriş
   - Sipariş listesi (durum badge'leri ile)
   - İçerik indirme butonu
3. `app/api/panel/[orderId]/route.ts` — Sipariş detayı + içerik getir

### API Sözleşmesi:
```
POST /api/panel { email: string }
  → { orders: [{ id, packageType, status, createdAt, products[] }] }

GET /api/panel/[orderId]?email=...
  → { order, products, generations[] }
```

---

## Görev 2: Otomatik Takip E-postaları
**Öncelik:** 🔴 Yüksek | **Tahmini:** 30 dk

### Yapılacaklar:
1. `lib/email-sequences.ts` — Takip e-postası dizisi mantığı
   - Teslimattan 7 gün sonra: "Nasıl gitti? Memnun musun?"
   - 14 gün sonra: "Yeni ürün ekle, %10 indirim"
   - 30 gün sonra: "Abonelik ile sınırsız içerik"
2. `app/api/cron/follow-up/route.ts` — Vercel Cron endpoint
   - Günde 1 kez çalışır
   - Teslimatı 7/14/30 gün önce olan siparişleri bulur
   - Uygun e-postayı gönderir

### Vercel Cron Config:
```json
// vercel.json
{ "crons": [{ "path": "/api/cron/follow-up", "schedule": "0 9 * * *" }] }
```

---

## Görev 3: Abonelik Sistemi
**Öncelik:** 🟡 Orta | **Tahmini:** 45 dk

### Yapılacaklar:
1. `lib/subscription.ts` — Abonelik mantığı
   - `checkQuota(userId)` — Kota kontrolü
   - `incrementUsage(userId)` — Kullanım artır
   - `createSubscription(userId, plan)` — Abonelik oluştur
   - `renewSubscription(userId)` — Yenileme
2. `app/api/subscription/route.ts` — CRUD API
   - GET: Kullanıcının aboneliğini getir
   - POST: Yeni abonelik oluştur
3. `app/api/cron/renewal/route.ts` — Günlük yenileme kontrolü

### Paketler:
| Paket | Aylık Kota | Fiyat |
|-------|-----------|-------|
| Starter | 50 ürün | 349 ₺ |
| Growth | 200 ürün | 799 ₺ |
| Enterprise | Sınırsız | 1,999 ₺ |

---

## Görev 4: CSV Toplu Yükleme
**Öncelik:** 🟡 Orta | **Tahmini:** 45 dk

### Yapılacaklar:
1. `components/bulk-upload.tsx` — CSV yükleme bileşeni
   - Drag & drop + dosya seçici
   - CSV önizleme tablosu
   - "Üret" butonu
2. `app/api/bulk/route.ts` — Toplu işleme API'si
   - CSV parse (papaparse)
   - Her satır için AI çağrısı
   - Toplu kaydetme
3. Admin paneline "Toplu Yükleme" sekmesi ekle

### CSV Formatı:
```csv
ürün_adı,açıklama,kategori
"Kablosuz Kulaklik","Bluetooth 5.0, 20 saat pil...","Elektronik"
```

---

## Görev 5: Referans Programı
**Öncelik:** 🟢 Düşük | **Tahmini:** 45 dk

### Yapılacaklar:
1. DB: `referrals` tablosu ekle
   ```sql
   CREATE TABLE referrals (
     id TEXT PRIMARY KEY,
     referrer_user_id TEXT REFERENCES users(id),
     referral_code TEXT UNIQUE NOT NULL,
     referred_user_id TEXT REFERENCES users(id),
     commission_pct INTEGER DEFAULT 20,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
2. `lib/referral.ts` — Referans mantığı
   - `generateCode(userId)` — Kod üret
   - `applyReferral(code, newUserId)` — Referansı uygula
   - `getCommissions(userId)` — Komisyonları getir
3. `app/api/referral/route.ts` — API
4. E-postalar: Davet + komisyon bildirimi

---

## Dosya Yapısı

```
lib/
  email-sequences.ts    ← YENİ
  subscription.ts       ← YENİ
  referral.ts           ← YENİ

app/
  api/
    panel/
      route.ts          ← YENİ
      [orderId]/
        route.ts        ← YENİ
    cron/
      follow-up/
        route.ts        ← YENİ
      renewal/
        route.ts        ← YENİ
    subscription/
      route.ts          ← YENİ
    referral/
      route.ts          ← YENİ
    bulk/
      route.ts          ← YENİ
  panel/
    page.tsx            ← GÜNCELLE

components/
  bulk-upload.tsx       ← YENİ

vercel.json             ← GÜNCELLE (cron ekle)
```

---

## Çalışma Sırası

```
Görev 1 (Panel) → bağımsız başla
Görev 2 (E-posta) → bağımsız başla (paralel)
Görev 3 (Abonelik) → Görev 1 bitince
Görev 4 (CSV) → Görev 3 bitince
Görev 5 (Referans) → Görev 3 bitince (paralel)
```

---

## Notlar
- Resend domain doğrulanana kadar e-postalar çalışmaz
- OpenRouter free model: 20 RPM, 50/gün limiti var
- Cron'lar Vercel'de `vercel.json` ile yapılandırılır
- Tüm API'ler auth gerektirir (panel除外 — email+orderID ile giriş)
