import importedProductData from '../data/surface-products.json';

// Edit src/data/surface-products.json to add products or update specifications and prices.
// Dimensions are optional until a product is used by a quantity estimator.

export type ProductKind =
  /** Rigid sheet or board. */
  | 'sheet'
  /** Narrow strip product. */
  | 'strip'
  /** Roll product. */
  | 'roll';

export interface Product {
  id: string;
  name: string;
  /** Human size label shown in the list, e.g. "8ft x 4ft". */
  size: string;
  /** Product width in metres, when known. */
  width: number | null;
  /** Product length in metres, when known. */
  length: number | null;
  kind: ProductKind;
  calculatorEnabled: boolean;
  /** Price per piece or roll in naira; null when the price isn't published. */
  price: number | null;
  unitName: string;
  material?: string | null;
  origin?: string | null;
  /** Thickness in millimetres. */
  thicknessMm?: number | null;
  /** Price guide for this product, if there is one. */
  guide?: string | null;
  description?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  galleryImages?: ProductGalleryImage[];
  installationVideos?: string[];
  specifications?: ProductSpecification[];
  featured?: boolean;
  sortOrder?: number;
}

export interface ProductGalleryImage {
  url: string;
  alt: string;
  category: 'product' | 'installation' | 'customer';
  caption: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export function describeProduct(product: Product): string {
  const details: string[] = [];
  if (product.thicknessMm != null) details.push(`${product.thicknessMm}mm`);
  if (product.origin) details.push(product.origin);
  if (product.material) details.push(product.material);
  return `${product.name}, ${product.size}${details.length ? ` · ${details.join(' · ')}` : ''}`;
}

const productData = importedProductData as Array<Omit<Product, 'calculatorEnabled'> & { calculatorEnabled?: boolean }>;

const isProductKind = (kind: string): kind is ProductKind =>
  kind === 'sheet' || kind === 'strip' || kind === 'roll';

export const PRODUCTS: Product[] = productData.map((product) => {
  const calculatorEnabled = product.calculatorEnabled ?? true;
  const width = product.width ?? null;
  const length = product.length ?? null;
  if (!isProductKind(product.kind)) {
    throw new Error(`Unknown product kind "${product.kind}" for calculator product "${product.id}".`);
  }
  if (
    !product.id ||
    !product.name ||
    !product.size ||
    !product.unitName ||
    (calculatorEnabled && (width === null || !Number.isFinite(width) || width <= 0)) ||
    (calculatorEnabled && (length === null || !Number.isFinite(length) || length <= 0)) ||
    (product.price !== null && (!Number.isFinite(product.price) || product.price < 0)) ||
    (product.thicknessMm != null &&
      (!Number.isFinite(product.thicknessMm) || product.thicknessMm <= 0))
  ) {
    throw new Error(`Invalid dimensions or price for calculator product "${product.id}".`);
  }

  return { ...product, width, length, calculatorEnabled, kind: product.kind };
});

export type Unit = 'm' | 'cm' | 'ft';

const FT = 0.3048;

export const UNIT_TO_M: Record<Unit, number> = { m: 1, cm: 0.01, ft: FT };

export const UNIT_LABEL: Record<Unit, string> = { m: 'metres', cm: 'centimetres', ft: 'feet' };
