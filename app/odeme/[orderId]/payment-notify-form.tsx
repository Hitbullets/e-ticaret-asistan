'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentNotifyForm({
  orderId,
  customerEmail,
}: {
  orderId: string;
  customerEmail: string;
}) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/notify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Bildirim gönderilemedi');
      }

      setSubmitted(true);
      toast.success('Bildiriminiz alındı! Ödeme onaylandıktan sonra içerikleriniz üretilecek.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle className="size-12 text-green-500" />
        <div>
          <h3 className="text-lg font-semibold">Bildiriminiz Alındı!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ödeme onaylandıktan sonra içerikleriniz otomatik üretilecek ve e-posta ile
            gönderilecektir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Havaleyi yaptıktan sonra «Havaleyi Yaptım» butonuna tıklayın. Ödeme kontrolü yapıldıktan
        sonra siparişiniz onaylanacaktır.
      </p>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          'Havaleyi Yaptım'
        )}
      </Button>
    </form>
  );
}
