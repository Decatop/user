import type { Article, SiteSettings } from './types';
import type { Product } from './products';
import { googleMapsSearchUrl } from './google';

const DEFAULT_SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://dtoproofingsystem.com' : 'http://localhost:3000';

/** Canonical origin (no trailing slash) used for canonicals, sitemap and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

/** Branded roofing share card for pages without their own cover. */
export const DEFAULT_OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 675,
  alt: 'Deca Top Global Roofing System roofing materials in Lagos, Nigeria',
};

/** Local business schema based only on business details configured by the admin. */
export function localBusinessJsonLd(s: SiteSettings) {
  const mapQuery = [s.business_name, s.address, s.city, s.state, s.country]
    .filter(Boolean)
    .join(', ');
  return {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: s.business_name,
    description: s.default_meta_description,
    url: SITE_URL,
    ...(s.logo_url ? { logo: s.logo_url, image: s.logo_url } : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.email ? { email: s.email } : {}),
    ...(s.address || s.city || s.state
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(s.address ? { streetAddress: s.address } : {}),
            ...(s.city ? { addressLocality: s.city } : {}),
            ...(s.state ? { addressRegion: s.state } : {}),
            addressCountry: s.country || 'Nigeria',
          },
        }
      : {}),
    ...(s.lat !== null && s.lng !== null
      ? { geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } }
      : {}),
    ...(mapQuery ? { hasMap: googleMapsSearchUrl(mapQuery) } : {}),
    areaServed: [
      ...(s.city ? [{ '@type': 'City', name: s.city }] : []),
      { '@type': 'Country', name: s.country || 'Nigeria' },
    ],
    knowsAbout: [
      'Stone-coated roofing tiles',
      'Aluminium roofing sheets',
      'Aluminium long-span roofing',
      'Aluminium step tiles',
      'Metcopo roofing',
      'Alu-zinc roofing sheets',
      'Roofing accessories',
    ],
    sameAs: [s.facebook_url, s.instagram_url, s.youtube_url, s.tiktok_url].filter(
      Boolean,
    ),
  };
}

/** WebSite schema, helps Google show the correct site name in results. */
export function websiteJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: s.business_name,
    url: SITE_URL,
    inLanguage: 'en',
  };
}

export function organizationJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.business_name,
    url: SITE_URL,
    ...(s.logo_url ? { logo: s.logo_url } : {}),
    sameAs: [s.facebook_url, s.instagram_url, s.youtube_url, s.tiktok_url].filter(
      Boolean,
    ),
  };
}

export function articleJsonLd(article: Article, s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    ...(article.cover_image_url ? { image: article.cover_image_url } : {}),
    author: { '@type': 'Organization', name: article.author || s.business_name },
    publisher: {
      '@type': 'Organization',
      name: s.business_name,
      ...(s.logo_url ? { logo: { '@type': 'ImageObject', url: s.logo_url } } : {}),
    },
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${article.slug}` },
    keywords: (article.keywords || []).join(', '),
  };
}

export function productJsonLd(product: Product, businessName: string) {
  const galleryUrls = product.galleryImages?.map((image) => image.url) ?? [];
  const imageUrls = galleryUrls.length
    ? galleryUrls
    : product.imageUrl
      ? [product.imageUrl]
      : [];
  const additionalProperty = [
    { name: 'Listed size', value: product.size },
    { name: 'Calculator dimensions', value: `${product.width} m × ${product.length} m` },
    { name: 'Product type', value: product.kind },
    ...(product.material ? [{ name: 'Material', value: product.material }] : []),
    ...(product.origin ? [{ name: 'Origin', value: product.origin }] : []),
    ...(product.thicknessMm != null ? [{ name: 'Thickness', value: `${product.thicknessMm} mm` }] : []),
    ...(product.specifications ?? []),
  ].map(({ name, value }) => ({ '@type': 'PropertyValue', name, value }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name}, ${product.size}.`,
    ...(imageUrls.length ? { image: imageUrls } : {}),
    category: product.kind,
    additionalProperty,
    ...(product.price !== null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: product.price,
            url: `${SITE_URL}/shop/${encodeURIComponent(product.id)}`,
            seller: { '@type': 'Organization', name: businessName, url: SITE_URL },
          },
        }
      : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}
