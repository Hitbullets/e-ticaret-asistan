import { EditorialButton } from '@/components/editorial-button';
import { XCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';

export default function OdemeFailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--destructive)]/20 mx-auto">
          <XCircle className="size-10 text-[var(--destructive)]" />
        </div>
        <h1 className="mb-3 font-heading text-2xl font-bold">Ödeme Başarısız</h1>
        <p className="mb-6 text-[var(--muted-foreground)]">Ödeme işlenirken bir sorun oluştu.</p>
        <div className="mb-6 space-y-3">
          <EditorialButton href="/siparis" className="w-full"><RefreshCw className="mr-2 size-4" /> Tekrar Dene</EditorialButton>
          <EditorialButton variant="secondary" href="/" className="w-full">Ana Sayfa <ArrowRight className="ml-2 size-4" /></EditorialButton>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Mail className="size-4" /> destek@satismetni.com
        </div>
      </div>
    </div>
  );
}
