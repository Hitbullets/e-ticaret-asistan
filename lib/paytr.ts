import { createHmac } from 'crypto';

// PayTR API yapılandırması
// Varsayım: Tüm değerler yalnızca server-side kullanılır, asla client'a gönderilmez

interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

function getConfig(): PayTRConfig {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchantId || !merchantKey || !merchantSalt) {
    throw new Error('PayTR yapılandırması eksik. PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve PAYTR_MERCHANT_SALT tanımlı olmalı.');
  }

  return {
    merchantId,
    merchantKey,
    merchantSalt,
    testMode: process.env.PAYTR_TEST_MODE === '1',
  };
}

// PayTR iFrame token'ı için HMAC-SHA256 imzası oluştur
// Kaynak: PayTR API dokümantasyonu
export function generatePaytrToken(params: {
  orderId: string;
  amountInKurus: number;
  email: string;
  userIp: string;
  noInstallment: number;
  maxInstallment: number;
  currency: string;
}): string {
  const config = getConfig();
  const testFlag = config.testMode ? '1' : '0';

  // PayTR hash formatı: merchant_id + user_ip + merchant_oid + email + amount + currency + test_flag + user_name + user_address + user_phone + merchant_key
  // Not: user_name, user_address, user_phone boş string olarak eklenebilir
  const hashStr = [
    config.merchantId,
    params.userIp,
    params.orderId,
    params.email,
    params.amountInKurus.toString(),
    params.currency,
    testFlag,
    '', // user_name (boş bırakılabilir)
    '', // user_address (boş bırakılabilir)
    '', // user_phone (boş bırakılabilir)
    config.merchantKey,
  ].join('');

  return createHmac('sha256', config.merchantSalt).update(hashStr).digest('base64');
}

// PayTR webhook callback imzasını doğrula
export function verifyPaytrCallback(params: {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}): boolean {
  const config = getConfig();
  const testFlag = config.testMode ? '1' : '0';

  // Callback hash: merchant_oid + merchant_key + test_flag + status + total_amount
  const hashStr = [
    params.merchantOid,
    config.merchantKey,
    testFlag,
    params.status,
    params.totalAmount,
  ].join('');

  const expectedHash = createHmac('sha256', config.merchantSalt).update(hashStr).digest('base64');
  return expectedHash === params.hash;
}

// PayTR iframe token isteği
export async function requestPaytrToken(params: {
  orderId: string;
  amountInKurus: number;
  email: string;
  displayName: string;
  userIp: string;
  successUrl: string;
  failUrl: string;
  callbackUrl: string;
}): Promise<{ token: string; iframeUrl: string }> {
  const config = getConfig();

  const paytrToken = generatePaytrToken({
    orderId: params.orderId,
    amountInKurus: params.amountInKurus,
    email: params.email,
    userIp: params.userIp,
    noInstallment: 0, // Taksit yapılabilir
    maxInstallment: 0, // Sınırsız taksit
    currency: 'TL',
  });

  const formData = new URLSearchParams();
  formData.append('merchant_id', config.merchantId);
  formData.append('user_ip', params.userIp);
  formData.append('merchant_oid', params.orderId);
  formData.append('email', params.email);
  formData.append('user_name', params.displayName);
  formData.append('user_address', ''); // Boş bırakılabilir
  formData.append('user_phone', ''); // Boş bırakılabilir
  formData.append('merchant_amount', params.amountInKurus.toString());
  formData.append('user_amount', params.amountInKurus.toString());
  formData.append('currency', 'TL');
  formData.append('test_mode', config.testMode ? '1' : '0');
  formData.append('no_installment', '0');
  formData.append('max_installment', '0');
  formData.append('paytr_token', paytrToken);
  formData.append('success_url', params.successUrl);
  formData.append('fail_url', params.failUrl);
  formData.append('callback_url', params.callbackUrl);
  formData.append('timeout_period', '300'); // 5 dakika timeout
  formData.append('lang', 'tr');

  const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  const data = await response.json();

  if (data.status === 'success') {
    return {
      token: data.token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
    };
  }

  throw new Error(data.reason || 'PayTR token alınamadı');
}

// Tutarı TL'den kuruşa çevir
export function tlToKurus(amount: number): number {
  return Math.round(amount * 100);
}
