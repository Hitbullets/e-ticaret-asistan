'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PaytrPaymentButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/paytr`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'PayTR bağlantısı kurulamadı');
      }

      const data = await res.json();

      // PayTR iframe URL'ine yönlendir
      if (data.iframeUrl) {
        window.location.href = data.iframeUrl;
      } else {
        throw new Error('PayTR iframe URL alınamadı');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} className="w-full" size="lg">
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Yönlendiriliyor...
        </>
      ) : (
        'Kredi Kartı ile Öde'
      )}
    </Button>
  );
}
