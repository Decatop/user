import type { Metadata } from 'next';
import { getProducts, getSiteSettings } from '@/lib/api';
import ShopCatalog from '@/components/ShopCatalog';
import JsonLd from '@/components/JsonLd';
import { DEFAULT_OG_IMAGE, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Roofing Sheets, Stone-Coated Tiles & Roofing Accessories',
  description:
    'Browse imported stone-coated tiles, aluminium roofing and alu-zinc sheets. Compare profiles, gauges and square-metre prices, then order by WhatsApp.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Roofing Sheets, Stone-Coated Tiles & Roofing Accessories',
    description:
      'Explore stone-coated tiles, aluminium roofing, alu-zinc sheets and accessories with listed prices. Chat with Deca Top Global Roofing System to order.',
    url: '/shop',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function ShopPage() {
  const [settings, products] = await Promise.all([getSiteSettings(), getProducts()]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
        ])}
      />
      <ShopCatalog products={products} whatsapp={settings.whatsapp} />
    </>
  );
}
