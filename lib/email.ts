import { Resend } from 'resend';

// Lazy initialization: Resend yalnızca gerçekten çağrıldığında oluşturulur
// Build sırasında RESEND_API_KEY yoksa hata vermez

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY tanımlı değil. .env dosyasını oluşturun ve Resend API key girin.'
      );
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// Varsayım: Gönderen e-postası Resend'de doğrulanmış bir domain'e ait
const FROM_EMAIL = 'noreply@satismetni.com';

export async function sendDeliveryEmail(
  to: string,
  customerName: string,
  orderPackage: string,
  generatedContent: {
    seoTitle: string;
    descriptionHtml: string;
    keywords: string[];
    socialPosts: string[];
  }
): Promise<void> {
  const resend = getResend();
  const keywordList = generatedContent.keywords.join(', ');
  const socialPostsHtml = generatedContent.socialPosts
    .map((post, i) => `<div style="margin-bottom:16px;padding:12px;background:#f8f9fa;border-radius:8px;"><strong>Post ${i + 1}:</strong><br/>${post}</div>`)
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1 style="color:#1a1a1a;font-size:24px;">Ürün İçeriğiniz Hazır!</h1>
      <p>Merhaba ${customerName},</p>
      <p><strong>${orderPackage}</strong> paketiniz için ürün içerikleriniz hazırlanmıştır.</p>

      <div style="margin:20px 0;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #3b82f6;">
        <h2 style="margin:0 0 8px;font-size:18px;color:#1e40af;">SEO Başlık</h2>
        <p style="margin:0;font-size:16px;">${generatedContent.seoTitle}</p>
      </div>

      <div style="margin:20px 0;">
        <h2 style="font-size:18px;color:#1a1a1a;">Ürün Açıklaması</h2>
        ${generatedContent.descriptionHtml}
      </div>

      <div style="margin:20px 0;">
        <h2 style="font-size:18px;color:#1a1a1a;">SEO Anahtar Kelimeler</h2>
        <p style="color:#555;">${keywordList}</p>
      </div>

      <div style="margin:20px 0;">
        <h2 style="font-size:18px;color:#1a1a1a;">Sosyal Medya Postları</h2>
        ${socialPostsHtml}
      </div>

      <hr style="border:none;border-top:1px solid #eee;margin:30px 0;"/>

      <p style="color:#888;font-size:12px;">
        Bu e-posta SatışMetni AI tarafından otomatik olarak gönderilmiştir.<br/>
        Sorularınız için destek@satismetni.com adresine yazabilirsiniz.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `SatışMetni AI - ${orderPackage} Ürün İçeriğiniz Hazır`,
    html,
  });
}

export async function sendPaymentNotificationEmail(
  orderId: string,
  customerName: string,
  customerEmail: string,
  packageName: string
): Promise<void> {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@satismetni.com';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1 style="color:#1a1a1a;font-size:24px;">Yeni Ödeme Bildirimi</h1>
      <p>Bir müşteri havale bildirimi gönderdi:</p>

      <div style="margin:20px 0;padding:16px;background:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b;">
        <p><strong>Sipariş No:</strong> ${orderId}</p>
        <p><strong>Müşteri:</strong> ${customerName}</p>
        <p><strong>E-posta:</strong> ${customerEmail}</p>
        <p><strong>Paket:</strong> ${packageName}</p>
      </div>

      <p>Admin panelinden ödemeyi onaylayarak içerik üretimini başlatabilirsiniz.</p>

      <p style="color:#888;font-size:12px;">
        Bu e-posta SatışMetni AI tarafından otomatik olarak gönderilmiştir.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `[SatışMetni AI] Yeni Ödeme Bildirimi - Sipariş #${orderId}`,
    html,
  });
}

export async function sendTrialEmail(
  to: string,
  productName: string,
  generatedContent: {
    seoTitle: string;
    descriptionHtml: string;
    keywords: string[];
    socialPosts: string[];
  }
): Promise<void> {
  const resend = getResend();
  const keywordList = generatedContent.keywords.join(', ');
  const socialPostsHtml = generatedContent.socialPosts
    .map((post, i) => `<div style="margin-bottom:16px;padding:12px;background:#f8f9fa;border-radius:8px;"><strong>Post ${i + 1}:</strong><br/>${post}</div>`)
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1 style="color:#1a1a1a;font-size:24px;">Ücretsiz Deneme Sonucunuz</h1>
      <p>Merhaba,</p>
      <p><strong>${productName}</strong> ürününüz için ücretsiz deneme içeriğiniz hazırlanmıştır.</p>

      <div style="margin:20px 0;padding:16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #3b82f6;">
        <h2 style="margin:0 0 8px;font-size:18px;color:#1e40af;">SEO Başlık</h2>
        <p style="margin:0;font-size:16px;">${generatedContent.seoTitle}</p>
      </div>

      <div style="margin:20px 0;">
        <h2 style="font-size:18px;color:#1a1a1a;">Ürün Açıklaması</h2>
        ${generatedContent.descriptionHtml}
      </div>

      <div style="margin:20px 0;">
        <h2 style="font-size:18px;color:#1a1a1a;">SEO Anahtar Kelimeler</h2>
        <p style="color:#555;">${keywordList}</p>
      </div>

      <div style="margin:20px 0;">
        <h2 style="font-size:18px;color:#1a1a1a;">Sosyal Medya Postları</h2>
        ${socialPostsHtml}
      </div>

      <div style="margin:30px 0;padding:20px;background:#ecfdf5;border-radius:8px;text-align:center;">
        <h2 style="color:#065f46;margin:0 0 8px;">Daha fazla ürün için hazır mısınız?</h2>
        <p style="color:#047857;margin:0 0 16px;">Deneme paketimizle başlayın: 3 ürün içeriği sadece 49 ₺</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/siparis" style="display:inline-block;padding:12px 24px;background:#059669;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Hemen Başla</a>
      </div>

      <p style="color:#888;font-size:12px;">
        Bu e-posta SatışMetni AI tarafından otomatik olarak gönderilmiştir.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `SatışMetni AI - ${productName} Ürününüz İçin Ücretsiz Deneme İçeriği`,
    html,
  });
}
