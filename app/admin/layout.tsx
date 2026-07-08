import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Basit cookie-based auth (MVP için yeterli)
// Varsayım: ADMIN_PASSWORD env'den okunur
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
