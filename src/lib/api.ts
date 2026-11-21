import type {
  AboutContent,
  Article,
  ArticleSummary,
  CarouselImage,
  Category,
  HeroSettings,
  Paginated,
  SiteSettings,
} from './types';
import { PRODUCTS, type Product } from './products';

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Revalidate public content every 60s (ISR). Admin edits show up within a minute.
const REVALIDATE = 60;

async function get<T>(path: string, fallback: T, revalidate = REVALIDATE): Promise<T> {
  try {
    const res = await fetch(`${BASE}/api/public${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    // Network/backend down, degrade gracefully so the site still renders.
    return fallback;
  }
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  business_name: 'Deca Top Global Roofing System',
  tagline: 'Your trusted roofing company in Lagos, Nigeria.',
  logo_url: null,
  primary_color: '#2F5D8C',
  secondary_color: '#FFFFFF',
  default_hero_color: '#2F5D8C',
  phone: '',
  whatsapp: '',
  whatsapp_greeting:
    'Welcome to Deca Top Global Roofing System. Tell us your roofing profile, gauge and color, and we will help with pricing and availability.',
  email: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  lat: null,
  lng: null,
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  tiktok_url: '',
  default_meta_title: 'Stone-Coated Tiles & Roofing Sheets in Nigeria | Deca Top',
  default_meta_description:
    'Shop stone-coated tiles, aluminium long-span, step tiles, Metcopo, alu-zinc roofing sheets and accessories in Nigeria. Compare gauges, colors and prices. Contact Deca Top Global Roofing System for a quotation.',
  copyright_text: '',
};

const DEFAULT_HERO: HeroSettings = {
  heading: 'Deca Top Global Roofing System',
  subheading: 'Stone-coated tiles, aluminium roofing, alu-zinc sheets and accessories for homes and projects.',
  cta_label: 'Request a Roofing Quote',
  cta_href: '/about',
  secondary_cta_label: 'Browse Roofing Products',
  secondary_cta_href: '/shop',
  background_type: 'color',
  background_color: '#2F5D8C',
  text_color: '#FFFFFF',
  overlay_opacity: 0.45,
  image_url: null,
};

export const getSiteSettings = () =>
  get<SiteSettings>('/site-settings', DEFAULT_SITE_SETTINGS);

export const getHero = () => get<HeroSettings>('/hero', DEFAULT_HERO);

export const getCarousel = () => get<CarouselImage[]>('/carousel', []);

export const getAbout = () =>
  get<AboutContent>('/about', {
    headline: 'About {business_name}',
    subheading: 'Imported roofing products for homes and projects across Nigeria.',
    body_html:
      '<p><strong>{business_name}</strong> supplies imported stone-coated tiles, aluminium roofing, alu-zinc sheets and roofing accessories. The catalog is organized by profile, gauge, grade, color and price unit.</p><h3>Roofing Products</h3><ul><li>Stone-coated tile profiles: Classic, Bond, Shingle, Milano and Roman.</li><li>Aluminium long-span, step tiles, Metcopo and standard-gauge caliper roofing.</li><li>Alu-zinc long-span sheets and 15-sheet bundles.</li><li>Roofing accessories including sealant kits, nail packs and Sunbreaker products.</li></ul><h3>Request a Quote</h3><p>Share your roof plan or measurements, project location, preferred profile, gauge and color to request current pricing and availability. Confirm price units and bundle quantities before ordering.</p>',
    image_url: null,
    stats: [],
    team: [],
  });
export const getCategories = () => get<Category[]>('/categories', []);

export const getProducts = async () => {
  const products = await get<Product[]>('/products', PRODUCTS);
  return products.length ? products : PRODUCTS;
};

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE}/api/public/products/${encodeURIComponent(id)}`, {
      next: { revalidate: REVALIDATE },
    });
    if (res.ok) return (await res.json()) as Product;
    if (res.status === 404) return null;
  } catch {
    // Fall back to the local catalogue when the public API is unavailable.
  }
  return PRODUCTS.find((product) => product.id === id) ?? null;
}

export const getArticles = (page = 1, limit = 9, featured = false, category?: string) =>
  get<Paginated<ArticleSummary>>(
    `/articles?page=${page}&limit=${limit}${featured ? '&featured=true' : ''}${
      category ? `&category=${encodeURIComponent(category)}` : ''
    }`,
    { items: [], page, limit, total: 0, totalPages: 0 },
  );

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE}/api/public/articles/${slug}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as Article;
  } catch {
    return null;
  }
}

export const getRelated = (slug: string) =>
  get<ArticleSummary[]>(`/articles/${slug}/related`, []);

export const getSitemapArticles = () =>
  get<{ slug: string; updated_at: string; published_at: string | null }[]>(
    '/sitemap-articles',
    [],
    300,
  );
