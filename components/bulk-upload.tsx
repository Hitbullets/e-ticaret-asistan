'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface CsvRow {
  title: string;
  description: string;
  category: string;
}

interface BulkResult {
  success: boolean;
  orderId?: string;
  generated: number;
  failed: number;
  errors: string[];
}

export function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const parseCSV = useCallback((text: string) => {
    const lines = text.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const titleIdx = headers.findIndex((h) => h.includes('ad') || h.includes('title') || h.includes('isim'));
    const descIdx = headers.findIndex((h) => h.includes('açıklama') || h.includes('desc'));
    const catIdx = headers.findIndex((h) => h.includes('kategori') || h.includes('category'));

    if (titleIdx === -1 || descIdx === -1) return [];

    return lines.slice(1).map((line) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      return {
        title: cols[titleIdx] || '',
        description: cols[descIdx] || '',
        category: catIdx !== -1 ? (cols[catIdx] || '') : '',
      };
    }).filter((row) => row.title && row.description);
  }, []);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseCSV(text);
      setParsedData(data);
    };
    reader.readAsText(f, 'utf-8');
  }, [parseCSV]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.type === 'text/csv')) {
      handleFile(f);
    }
  }, [handleFile]);

  const handleUpload = async () => {
    if (!parsedData.length) return;

    setLoading(true);
    try {
      const res = await fetch('/api/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: parsedData }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, generated: 0, failed: parsedData.length, errors: ['Bağlantı hatası'] });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setParsedData([]);
    setResult(null);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-5" />
          Toplu İçerik Yükleme
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <Upload className="mb-4 size-10 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">CSV dosyasını sürükleyip bırakın</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Format: ürün_adı, açıklama, kategori
            </p>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('csv-input')?.click()}>
              Dosya Seç
            </Button>
            <input
              id="csv-input"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{parsedData.length} ürün bulundu</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>
                <X className="size-4" />
              </Button>
            </div>

            {/* Preview Table */}
            {parsedData.length > 0 && (
              <div className="max-h-64 overflow-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80">
                    <tr>
                      <th className="p-2 text-left">Ürün Adı</th>
                      <th className="p-2 text-left">Açıklama</th>
                      <th className="p-2 text-left">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="p-2 font-medium">{row.title}</td>
                        <td className="p-2 text-muted-foreground line-clamp-1">{row.description}</td>
                        <td className="p-2">
                          {row.category && <Badge variant="secondary">{row.category}</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedData.length > 10 && (
                  <div className="p-2 text-center text-xs text-muted-foreground">
                    ...ve {parsedData.length - 10} ürün daha
                  </div>
                )}
              </div>
            )}

            {/* Upload Button */}
            <Button onClick={handleUpload} disabled={loading || parsedData.length === 0} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Üretiliyor...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  {parsedData.length} Ürün İçin İçerik Üret
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <div className={`rounded-lg p-4 ${result.success ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="size-5 text-green-600" />
                  ) : (
                    <AlertCircle className="size-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {result.success ? 'Başarılı!' : 'Hata oluştu'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.generated} ürün üretildi, {result.failed} ürün başarısız.
                </div>
                {result.orderId && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Sipariş No: #{result.orderId.slice(0, 8)}
                  </div>
                )}
                {result.errors.length > 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    {result.errors.map((e, i) => <div key={i}>{e}</div>)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
