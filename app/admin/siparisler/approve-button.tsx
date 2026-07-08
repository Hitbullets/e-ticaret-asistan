'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ApproveButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/approve/${orderId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Onay başarısız');
      }

      setApproved(true);
      toast.success('Sipariş onaylandı! İçerik üretiliyor...');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (approved) {
    return (
      <div className="flex items-center gap-1 text-sm text-green-600">
        <CheckCircle className="size-4" />
        Onaylandı
      </div>
    );
  }

  return (
    <Button size="sm" onClick={handleApprove} disabled={loading}>
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        'Ödemeyi Onayla'
      )}
    </Button>
  );
}
