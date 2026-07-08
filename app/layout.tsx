import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { GlassNavbar } from '@/components/glass-navbar';
import { EditorialFooter } from '@/components/editorial-footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'SatışMetni - E-Ticaret Ürün İçeriği Servisi',
  description:
    'Ajans kalitesinde ürün içeriğini, ajans fiyatının onda birine, 5 dakikada al.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#10141a' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-body">
        <GlassNavbar />
        <main className="min-h-screen">{children}</main>
        <EditorialFooter />
        <Toaster position="top-right" richColors theme="dark" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
