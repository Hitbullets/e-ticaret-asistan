import { EditorialButton } from '@/components/editorial-button';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function OdemeSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--tertiary-container)]/20 mx-auto">
          <CheckCircle className="size-10 text-[var(--tertiary)]" />
        </div>
        <h1 className="mb-3 font-heading text-2xl font-bold">Ödeme Başarılı!</h1>
        <p className="mb-6 text-[var(--muted-foreground)]">İçerikleriniz hazırlanıyor ve e-posta ile gönderilecektir.</p>
        <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-[var(--surface-container)] p-4 text-sm text-[var(--muted-foreground)]">
          <Mail className="size-4 text-[var(--primary)]" /> Hazır olduğunda bilgilendirileceksiniz.
        </div>
        <EditorialButton href="/" className="w-full">Ana Sayfaya Dön <ArrowRight className="ml-2 size-4" /></EditorialButton>
      </div>
    </div>
  );
}
