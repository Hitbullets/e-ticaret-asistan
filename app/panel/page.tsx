'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Clock, CheckCircle, Download, ArrowRight, Loader2, Mail, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Order {
  id: string;
  packageType: string;
  amountTry: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  approvedAt: string | null;
}

interface OrderDetail {
  order: Order;
  products: Array<{
    id: string;
    inputTitle: string;
    inputDescription: string;
    inputCategory: string | null;
  }>;
  generations: Array<{
    id: string;
    seoTitle: string;
    descriptionHtml: string;
    keywords: string[];
    socialPosts: string[];
    modelUsed: string;
    status: string;
  }>;
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_payment: { label: 'Ödeme Bekleniyor', variant: 'outline' },
  payment_notified: { label: 'Ödeme Bildirildi', variant: 'secondary' },
  approved: { label: 'Onaylandı', variant: 'default' },
  generating: { label: 'İçerik Üretiliyor', variant: 'secondary' },
  completed: { label: 'Tamamlandı', variant: 'default' },
  delivered: { label: 'Teslim Edildi', variant: 'default' },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PanelPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Check localStorage for saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem('panel_email');
    if (savedEmail) {
      setEmail(savedEmail);
      handleLogin(savedEmail);
    }
  }, []);

  async function handleLogin(loginEmail?: string) {
    const emailToUse = loginEmail || email;
    if (!emailToUse.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu');
        return;
      }

      setOrders(data.orders);
      setUserName(data.user.name);
      setLoggedIn(true);
      localStorage.setItem('panel_email', emailToUse.trim());
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderDetail(orderId: string) {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      setOrderDetail(null);
      return;
    }

    setDetailLoading(true);
    setExpandedOrder(orderId);

    try {
      const res = await fetch(`/api/panel/${orderId}?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (res.ok) {
        setOrderDetail(data);
      }
    } catch {
      console.error('Sipariş detayı alınamadı');
    } finally {
      setDetailLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('panel_email');
    setLoggedIn(false);
    setOrders([]);
    setEmail('');
    setUserName('');
  }

  // Login form
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-muted/20 px-4 py-12">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold">Müşteri Paneli</h1>
            <p className="mt-2 text-muted-foreground">
              Siparişlerinizi görüntülemek için e-posta adresinizi girin.
            </p>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">E-posta Adresiniz</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-muted/20 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Hoş Geldin, {userName}</h1>
            <p className="mt-2 text-muted-foreground">
              Siparişlerinizi ve içeriklerinizi buradan yönetin.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="size-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="text-sm text-muted-foreground">Toplam Sipariş</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === 'completed' || o.status === 'delivered').length}
                </div>
                <div className="text-sm text-muted-foreground">Tamamlanan</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="size-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === 'pending_payment' || o.status === 'payment_notified').length}
                </div>
                <div className="text-sm text-muted-foreground">Bekleyen</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Siparişlerim</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Henüz siparişiniz yok.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const status = statusMap[order.status] || { label: order.status, variant: 'outline' as const };
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div key={order.id} className="rounded-lg border border-border/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="size-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{order.packageType} Paketi</div>
                            <div className="text-sm text-muted-foreground">
                              #{order.id.slice(0, 8)} · {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold">{formatPrice(order.amountTry)}</div>
                          </div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOrderDetail(order.id)}
                          >
                            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="mt-4 border-t border-border/50 pt-4">
                          {detailLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="size-6 animate-spin text-muted-foreground" />
                            </div>
                          ) : orderDetail ? (
                            <div className="space-y-4">
                              {orderDetail.products.map((product) => {
                                const gen = orderDetail.generations.find((g) => g.status === 'completed' || g.status === 'delivered');
                                return (
                                  <div key={product.id} className="rounded-lg bg-muted/50 p-4">
                                    <div className="mb-2 font-medium">{product.inputTitle}</div>
                                    {gen ? (
                                      <div className="space-y-2">
                                        <div className="text-sm">
                                          <span className="font-medium">SEO Başlık:</span> {gen.seoTitle}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {gen.keywords.slice(0, 5).map((kw, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                              {kw}
                                            </Badge>
                                          ))}
                                        </div>
                                        <Button size="sm" variant="outline">
                                          <Download className="mr-2 size-4" />
                                          İçeriği İndir
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground">
                                        İçerik henüz üretilmedi veya bekliyor.
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
