import type { SiteSettings } from '@/lib/types';
import { formatAddress } from '@/lib/format';
import { googleMapsSearchUrl } from '@/lib/google';

/**
 * Showroom address, hours, contact links and an embedded Google map pinned to the
 * Google Business Profile: the local signals (NAP + map) search engines look for on a
 * store's homepage. The iframe is lazy so it costs nothing until the visitor scrolls near it.
 */
export default function Showroom({ settings }: { settings: SiteSettings }) {
  const address = formatAddress(settings);
  if (!address) return null;

  const mapQuery = [settings.business_name, address, settings.city, settings.state, settings.country]
    .filter(Boolean)
    .join(', ');
  const mapUrl = googleMapsSearchUrl(mapQuery);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const whatsapp = settings.whatsapp?.replace(/\D/g, '');
  const area = [settings.city, settings.state].filter(Boolean).join(', ');

  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Visit Us</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
            Find Us in {area}
          </h2>
          <p className="mt-4 leading-relaxed text-brand-muted">
            Explore imported stone-coated tiles, aluminium roofing profiles, alu-zinc sheets and
            accessories. Compare the listed gauges, grades and colors, then contact our team to
            confirm current availability and pricing.
          </p>
          <p className="mt-4 leading-relaxed text-brand-muted">
            For a project quotation, share the roof plan or measurements together with your preferred
            profile, gauge and color. The team can confirm the applicable price basis and next steps.
          </p>
          <dl className="mt-6 space-y-3 text-brand-ink">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider2 text-brand-muted">Address</dt>
              <dd className="mt-1">{address}</dd>
            </div>
            {settings.phone && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider2 text-brand-muted">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${settings.phone}`} className="font-semibold text-brand-primary hover:underline">
                    Call the showroom on {settings.phone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Get directions on Google Maps
            </a>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Send us your roofing requirements
              </a>
            )}
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-brand-ink/8 bg-brand-bg shadow-card">
          <iframe
            title={`Map showing ${settings.business_name} at ${address}`}
            src={mapEmbedUrl}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
