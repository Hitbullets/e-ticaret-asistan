import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY tanımlı değil');
    _resend = new Resend(apiKey);
  }
  return _resend;
}

const FROM_EMAIL = 'noreply@satismetni.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://e-ticaret-asistan.vercel.app';

// 7 gün sonra: Memnuniyet kontrolü + Upsell
export async function sendFollowUp7Days(
  to: string,
  customerName: string,
  orderId: string
): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1 style="color:#1a1a1a;font-size:24px;">Nasıl Gitti? Memnun Musunuz?</h1>
      <p>Merhaba ${customerName},</p>
      <p>Siparişinizin (#${orderId.slice(0, 8)}) üzerinden 7 gün geçti. Ürün içerikleriniz nasıl oldu?</p>

      <div style="margin:20px 0;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #3b82f6;">
        <h2 style="margin:0 0 8px;font-size:18px;color:#1e40af;">Geri Bildiriminiz Önemli</h2>
        <p style="margin:0;">İçeriklerimizi kullandıktan sonra deneyiminizi bizimle paylaşır mısınız? Geri bildiriminiz hizmetimizi geliştirmemize yardımcı oluyor.</p>
      </div>

      <div style="margin:20px 0;padding:20px;background:#ecfdf5;border-radius:8px;text-align:center;">
        <h2 style="color:#065f46;margin:0 0 8px;">Yeni Ürünleriniz mi Var?</h2>
        <p style="color:#047857;margin:0 0 16px;">Aynı kalitede içeriklerle yeni ürünlerinizi de pazaryerine hazır hale getirelim.</p>
        <a href="${SITE_URL}/siparis" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Yeni Sipariş Ver</a>
      </div>

      <p style="color:#888;font-size:12px;">
        Bu e-posta SatışMetni AI tarafından otomatik olarak gönderilmiştir.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `SatışMetni AI - Siparişiniz Hakkında Geri Bildiriminiz`,
    html,
  });
}

// 14 gün sonra: %10 indirim teklifi
export async function sendFollowUp14Days(
  to: string,
  customerName: string,
  orderId: string
): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1 style="color:#1a1a1a;font-size:24px;">Özel Teklif: %10 İndirim</h1>
      <p>Merhaba ${customerName},</p>
      <p>Siparişinizin (#${orderId.slice(0, 8)}) üzerinden 14 gün geçti. Yeni ürünleriniz için özel bir indirimimiz var!</p>

      <div style="margin:20px 0;padding:20px;background:#fef3c7;border-radius:8px;text-align:center;border:2px dashed #f59e0b;">
        <div style="font-size:48px;font-weight:bold;color:#d97706;">%10</div>
        <div style="font-size:18px;color:#92400e;margin-bottom:16px;">İndirim</div>
        <p style="color:#92400e;margin:0 0 16px;">Sonraki siparişinizde geçerli</p>
        <a href="${SITE_URL}/siparis" style="display:inline-block;padding:12px 24px;background:#d97706;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Hemen Kullan</a>
      </div>

      <p style="color:#888;font-size:12px;">
        Bu e-posta SatışMetni AI tarafından otomatik olarak gönderilmiştir.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `SatışMetni AI - %10 İndirim Teklifiniz Hazır`,
    html,
  });
}

// 30 gün sonra: Abonelik teklifi
export async function sendFollowUp30Days(
  to: string,
  customerName: string
): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1 style="color:#1a1a1a;font-size:24px;">Sınırsız İçerik İçin Hazır mısınız?</h1>
      <p>Merhaba ${customerName},</p>
      <p>SatışMetni AI'ı kullanmaya başlayalı bir ay oldu. Abonelik planlarımızla çok daha fazla ürün içeriği üretebilirsiniz!</p>

      <div style="margin:20px 0;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #3b82f6;">
        <h2 style="margin:0 0 8px;font-size:18px;color:#1e40af;">Abonelik Avantajları</h2>
        <ul style="margin:0;padding-left:20px;color:#555;">
          <li>Aylık 50+ ürün içeriği</li>
          <li>Toplu yükleme desteği</li>
          <li>Öncelikli destek</li>
          <li>Özel API erişimi</li>
        </ul>
      </div>

      <div style="margin:20px 0;padding:20px;background:#ecfdf5;border-radius:8px;text-align:center;">
        <h2 style="color:#065f46;margin:0 0 8px;">349 ₺/ay'dan başlayan fiyatlarla</h2>
        <p style="color:#047857;margin:0 0 16px;">İhtiyacınıza göre plan seçin, istediğiniz zaman iptal edin.</p>
        <a href="${SITE_URL}/siparis" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Aboneliği Keşfet</a>
      </div>

      <p style="color:#888;font-size:12px;">
        Bu e-posta SatışMetni AI tarafından otomatik olarak gönderilmiştir.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `SatışMetni AI - Abonelik Planlarımızı Keşfedin`,
    html,
  });
}
