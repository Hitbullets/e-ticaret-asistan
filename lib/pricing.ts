export type PackageType = 'trial' | 'starter' | 'growth' | 'subscription';

export interface PackageDetails {
  type: PackageType;
  name: string;
  description: string;
  productCount: number;
  price: number;
  priceFormatted: string;
  features: string[];
}

const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const packages: Record<PackageType, PackageDetails> = {
  trial: {
    type: 'trial',
    name: 'Deneme',
    description: 'Hizmetimizi test edin',
    productCount: 3,
    price: 49,
    priceFormatted: formatter.format(49),
    features: [
      '3 ürün içeriği',
      'SEO başlık + açıklama',
      'Anahtar kelime listesi',
      '3 sosyal medya postu',
      'E-posta ile teslimat',
    ],
  },
  starter: {
    type: 'starter',
    name: 'Başlangıç',
    description: 'Yeni başlayan satıcılar için',
    productCount: 10,
    price: 349,
    priceFormatted: formatter.format(349),
    features: [
      '10 ürün içeriği',
      'SEO başlık + açıklama',
      'Anahtar kelime listesi',
      '3 sosyal medya postu / ürün',
      'E-posta ile teslimat',
      'Öncelikli destek',
    ],
  },
  growth: {
    type: 'growth',
    name: 'Büyüme',
    description: 'Büyüyen mağazalar için',
    productCount: 30,
    price: 799,
    priceFormatted: formatter.format(799),
    features: [
      '30 ürün içeriği',
      'SEO başlık + açıklama',
      'Anahtar kelime listesi',
      '3 sosyal medya postu / ürün',
      'E-posta ile teslimat',
      'Öncelikli destek',
      'Toplu yükleme desteği',
    ],
  },
  subscription: {
    type: 'subscription',
    name: 'Abonelik',
    description: 'Profesyonel satıcılar için',
    productCount: 50,
    price: 1499,
    priceFormatted: formatter.format(1499),
    features: [
      'Aylık 50 ürün içeriği',
      'SEO başlık + açıklama',
      'Anahtar kelime listesi',
      '3 sosyal medya postu / ürün',
      'E-posta ile teslimat',
      'Öncelikli destek',
      'Toplu yükleme desteği',
      'Özel API erişimi',
    ],
  },
};

export function getPackageDetails(type: PackageType): PackageDetails {
  return packages[type];
}

export function getAllPackages(): PackageDetails[] {
  return Object.values(packages);
}

export function formatPrice(price: number): string {
  return formatter.format(price);
}

export function getPackageName(type: PackageType): string {
  return packages[type].name;
}
