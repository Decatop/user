'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Check, Layers, MessageCircle, Search, SlidersHorizontal } from 'lucide-react';
import { describeProduct, type Product } from '@/lib/products';

type ProductGroup = 'stone-coated' | 'aluminium' | 'alu-zinc' | 'accessories' | 'other';
type CategoryFilter = 'all' | ProductGroup;
type SortOrder = 'featured' | 'price-low' | 'price-high';

const FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All products' },
  { id: 'stone-coated', label: 'Stone-coated tiles' },
  { id: 'aluminium', label: 'Aluminium roofing' },
  { id: 'alu-zinc', label: 'Alu-zinc roofing' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'other', label: 'Other' },
];

function groupFor(product: Product): ProductGroup {
  if (product.material === 'Stone-coated steel') return 'stone-coated';
  if (product.material === 'Aluminium') return 'aluminium';
  if (product.material === 'Aluminium-zinc') return 'alu-zinc';
  if (product.material === 'Roofing accessory') return 'accessories';
  return 'other';
}

function groupLabel(group: ProductGroup): string {
  if (group === 'stone-coated') return 'Stone-coated tile';
  if (group === 'aluminium') return 'Aluminium roofing';
  if (group === 'alu-zinc') return 'Alu-zinc roofing';
  if (group === 'accessories') return 'Roofing accessory';
  return 'Other product';
}

function ProductArtwork({ product }: { product: Product }) {
  if (product.imageUrl) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-bg">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt || `${product.name}, ${product.size}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-ink backdrop-blur">
          Representative finish
        </span>
      </div>
    );
  }

  const texture =
    product.kind === 'strip'
      ? 'repeating-linear-gradient(90deg, #7a5547 0px, #7a5547 12px, #976d5d 13px, #d0ad96 17px, #855f50 19px, #855f50 27px)'
      : product.kind === 'roll'
        ? 'radial-gradient(ellipse at 70% 25%, #f8ece1 0%, transparent 35%), repeating-linear-gradient(145deg, #b88774 0px, #b88774 2px, #d6b7a4 3px, #d6b7a4 14px)'
        : 'radial-gradient(ellipse at 20% 30%, #f0dfd2 0%, transparent 30%), radial-gradient(ellipse at 80% 75%, #a67c68 0%, transparent 35%), linear-gradient(135deg, #d9c2b2, #917263)';

  return (
    <div
      role="img"
      aria-label={`${product.name} product image coming soon`}
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
      style={{ backgroundImage: texture }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-brand-deep/5 to-white/10" />
      {product.kind === 'roll' ? (
        <div className="relative flex h-36 w-28 -rotate-6 items-center justify-center rounded-full border-[10px] border-white/70 bg-brand-bg/80 shadow-2xl sm:h-40 sm:w-32">
          <div className="h-20 w-20 rounded-full border-[12px] border-brand-gold/60 bg-white/70 sm:h-24 sm:w-24" />
        </div>
      ) : (
        <div
          className={`relative h-40 w-28 overflow-hidden rounded-sm border border-white/50 shadow-2xl sm:h-44 sm:w-32 ${
            product.kind === 'strip' ? 'w-20 sm:w-24' : ''
          }`}
          style={{ backgroundImage: texture }}
        >
          <div className="absolute inset-2 border border-white/25" />
          <div className="absolute -bottom-5 -right-4 h-20 w-20 rounded-full bg-white/15 blur-xl" />
        </div>
      )}
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
            Texture preview · photo coming soon
          </p>
          <p className="mt-1 font-serif text-lg font-semibold leading-tight">{product.size}</p>
        </div>
        <Layers size={19} className="mb-1 shrink-0 text-white/75" aria-hidden="true" />
      </div>
    </div>
  );
}

function ProductCard({ product, whatsapp }: { product: Product; whatsapp?: string }) {
  const digits = whatsapp?.replace(/\D/g, '');
  const orderMessage = [
    'Hello Deca Top Global Roofing System, I would like to order:',
    describeProduct(product),
    product.price === null
      ? 'Please confirm the current price.'
      : `Catalog price: ₦${Math.round(product.price).toLocaleString('en-NG')} per ${product.unitName}.`,
    product.description ? `Details: ${product.description}` : '',
    'Please confirm availability and delivery options.',
  ]
    .filter(Boolean)
    .join('\n');
  const orderHref = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(orderMessage)}`
    : '/about';

  const specifications = [
    { label: 'Listed size', value: product.size },
    product.material ? { label: 'Material', value: product.material } : null,
    product.origin ? { label: 'Origin', value: product.origin } : null,
    product.thicknessMm != null ? { label: 'Thickness', value: `${product.thicknessMm} mm` } : null,
  ].filter((specification): specification is { label: string; value: string } => specification !== null);
  return (
    <article
      id={`product-${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-ink/8 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative">
        <ProductArtwork product={product} />
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-ink shadow-soft">
            {groupLabel(groupFor(product))}
          </span>
        </div>
        {product.featured && (
          <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
            <Check size={12} aria-hidden="true" /> Popular
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="mt-3 font-serif text-xl font-semibold leading-snug text-brand-ink">
          <Link href={`/shop/${encodeURIComponent(product.id)}`} className="transition-colors hover:text-brand-primary">
            {product.name}
          </Link>
        </h2>
        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-muted">{product.description}</p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-brand-ink/8 pt-4">
          {specifications.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-brand-muted">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-brand-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-brand-ink/8 pt-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-muted">Catalog price</p>
              <p className="mt-1 font-serif text-2xl font-semibold text-brand-ink">
                {product.price === null
                  ? 'Ask for price'
                  : `₦${Math.round(product.price).toLocaleString('en-NG')}`}
              </p>
              {product.price !== null && <p className="text-xs text-brand-muted">per {product.unitName}</p>}
            </div>
            {product.guide && (
              <Link
                href={product.guide}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
              >
                Product guide <ArrowRight size={13} aria-hidden="true" />
              </Link>
            )}
          </div>

          <Link
            href={`/shop/${encodeURIComponent(product.id)}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
          >
            View product details <ArrowRight size={15} aria-hidden="true" />
          </Link>

          <div className="mt-5 grid gap-2">
            <a
              href={orderHref}
              target={digits ? '_blank' : undefined}
              rel={digits ? 'noopener noreferrer' : undefined}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#20c765] px-3 py-3 text-sm font-bold text-white transition-colors hover:bg-[#16ad55] focus:outline-none focus:ring-2 focus:ring-[#20c765] focus:ring-offset-2"
            >
              <MessageCircle size={17} aria-hidden="true" />
              {digits ? 'Chat to order' : 'Request details'}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ShopCatalog({ products, whatsapp }: { products: Product[]; whatsapp?: string }) {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || groupFor(product) === category;
      const searchable = [
        product.name,
        product.size,
        product.material,
        product.origin,
        product.description,
        product.thicknessMm ? `${product.thicknessMm}mm` : '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });

    if (sortOrder === 'featured') return filtered;
    return filtered.sort((a, b) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return sortOrder === 'price-low' ? a.price - b.price : b.price - a.price;
    });
  }, [products, category, query, sortOrder]);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(201,162,39,0.2),transparent_38%),linear-gradient(120deg,rgba(20,33,47,0.2),transparent)]" />
        <div className="relative mx-auto grid max-w-content gap-10 px-5 pb-14 pt-36 sm:pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pb-20">
          <div>
              <span className="eyebrow text-brand-gold">Deca Top roofing collection</span>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Roofing materials, <span className="text-brand-gold">priced clearly.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                Browse imported roofing profiles, gauges and accessories. Prices are per square metre unless the product unit says otherwise.
                Confirm availability and delivery with our team.
            </p>
            <a href="#shop-products" className="btn-gold mt-8 px-7 py-3.5">
              Explore {products.length} products <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="font-serif text-3xl font-semibold text-brand-gold">{products.length}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">finishes and sizes to explore</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="font-serif text-3xl font-semibold text-brand-gold">Direct</p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">WhatsApp ordering with our team</p>
            </div>
          </div>
        </div>
      </section>

      <section id="shop-products" className="bg-brand-bg py-12 sm:py-16">
        <div className="mx-auto max-w-content px-5">
          <div className="mb-8 flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="eyebrow">Shop by finish</span>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
                  Find your material
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-brand-muted">
                Prices are per square metre unless otherwise listed. Accessories and bundles are priced by their shown units.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter products by category">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={category === filter.id}
                    onClick={() => setCategory(filter.id)}
                    className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                      category === filter.id
                        ? 'border-brand-ink bg-brand-ink text-white'
                        : 'border-brand-ink/10 bg-white text-brand-muted hover:border-brand-primary/40 hover:text-brand-primary'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:w-[520px]">
                <label className="relative">
                  <span className="sr-only">Search products</span>
                  <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a product, size or material"
                    className="min-h-11 w-full rounded-full border border-brand-ink/10 bg-white py-2.5 pl-11 pr-4 text-sm text-brand-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  />
                </label>
                <label className="relative flex min-h-11 items-center gap-2 rounded-full border border-brand-ink/10 bg-white px-4 text-brand-muted">
                  <SlidersHorizontal size={15} aria-hidden="true" />
                  <span className="sr-only">Sort products</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="w-full appearance-none bg-transparent pr-1 text-sm font-medium text-brand-ink outline-none"
                  >
                    <option value="featured">Featured order</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
            </div>
            <p className="text-xs text-brand-muted" aria-live="polite">
              Showing {visibleProducts.length} of {products.length} products
            </p>
          </div>

          {visibleProducts.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} whatsapp={whatsapp} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-brand-ink/8 bg-white px-6 py-16 text-center">
              <Search size={28} className="mx-auto text-brand-primary" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold text-brand-ink">No matching products</h3>
              <p className="mt-2 text-sm text-brand-muted">Try another search or choose a different category.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
                className="btn-ghost mt-5"
              >
                Clear filters
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
