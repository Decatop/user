import Link from 'next/link';
import { ShieldCheck, Truck, Award, PhoneCall, LayoutGrid, Sparkles } from 'lucide-react';
import { getAbout, getArticles, getCarousel, getHero, getSiteSettings } from '@/lib/api';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ArticleCard from '@/components/ArticleCard';
import Reveal from '@/components/Reveal';
import Faq from '@/components/Faq';
import Showroom from '@/components/Showroom';
import GoogleReviews from '@/components/GoogleReviews';
import Team from '@/components/Team';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import { FAQS } from '@/lib/faq';

export const revalidate = 60;

const STATS = [
  { value: 'Imported', label: 'Roofing products' },
  { value: '0.45–0.55 mm', label: 'Stone-coated gauges' },
  { value: '0.40–0.75 mm', label: 'Long-span aluminium gauges' },
  { value: '0.16–0.30 mm', label: 'Alu-zinc gauges' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Roofing Profiles', text: 'Choose from stone-coated tiles, aluminium roofing, alu-zinc sheets and accessories.' },
  { icon: Truck, title: 'Gauge & Grade Options', text: 'Compare the listed thicknesses, A/B grades and color-dependent stone-coated rates.' },
  { icon: Award, title: 'Project Quotes', text: 'Share your roof plan, preferred profile and gauge to request current pricing.' },
];

const CATEGORIES = [
  { title: 'Stone-Coated Tiles', text: 'Classic, Bond, Shingle, Milano and Roman profiles in low, medium and hard gauges.' },
  { title: 'Aluminium Long Span', text: 'Long-span sheets listed by gauge, with A/B grade options where provided.' },
  { title: 'Step Tiles & Metcopo', text: 'Aluminium profiles with listed gauge and grade-specific prices.' },
  { title: 'Aluminium Caliper', text: 'Standard gauges from 0.35 mm to 1.20 mm; ask for the unlisted rates.' },
  { title: 'Alu-Zinc Roofing', text: 'Long-span gauges and 15-sheet bundles, priced by the listed unit.' },
  { title: 'Roofing Accessories', text: 'Sealant kits, nail packs and Sunbreaker products.' },
];

const STEPS = [
  { icon: PhoneCall, title: 'Share Your Requirements', text: 'Send your roof plan or measurements and project location.' },
  { icon: LayoutGrid, title: 'Choose a Profile', text: 'Select the roofing type, gauge, grade and color you need.' },
  { icon: Truck, title: 'Request a Quote', text: 'Ask us to confirm the applicable price and availability.' },
  { icon: Sparkles, title: 'Confirm Your Order', text: 'Check the sheet, bundle or accessory unit before ordering.' },
];

const PRICE_GUIDES = [
  { label: 'stone-coated tile profiles and gauges', slug: 'benefits-of-stone-coated-roofing-tiles-nigeria' },
  { label: 'aluminium roofing sheet options', slug: 'buying-aluminium-roofing-sheets-nigeria' },
  { label: 'aluminium vs stone-coated roofing', slug: 'aluminium-or-stone-coated-roofing-lagos' },
  { label: 'roof sheet quantity planning', slug: 'calculate-roofing-sheets-for-building' },
  { label: 'roofing quote cost factors', slug: 'why-roofing-quotes-differ-nigeria' },
];

export default async function HomePage() {
  const [hero, settings, carousel, latest, about] = await Promise.all([
    getHero(),
    getSiteSettings(),
    getCarousel(),
    getArticles(1, 6),
    getAbout(),
  ]);

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero hero={hero} settings={settings} />

      {/* Stats band */}
      <section className="bg-brand-ink">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center ${i ? 'md:border-l md:border-white/10' : ''}`}>
              <div className="font-serif text-3xl font-semibold text-brand-gold sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest articles */}
      {latest.items.length > 0 && (
        <section className="bg-brand-bg py-20">
          <div className="mx-auto max-w-content px-5">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">From the Blog</span>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
                  Latest Articles
                </h2>
                <p className="mt-2 text-brand-muted">Roofing material guides, profile comparisons and quotation planning.</p>
              </div>
              <Link href="/articles" className="btn-ghost">
                View all articles
              </Link>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {latest.items.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 90}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product categories */}
      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow justify-center">What We Supply</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
              Roofing Options for Your Project
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 90}>
                <div className="h-full border border-brand-ink/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <h3 className="font-serif text-xl font-semibold text-brand-ink">{c.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 90}>
                  <div className="group h-full rounded-2xl border border-brand-ink/8 bg-brand-bg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-gold group-hover:text-brand-ink">
                      <Icon size={26} />
                    </div>
                    <p className="font-serif text-xl font-semibold text-brand-ink">{f.title}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <GoogleReviews />

      <Carousel images={carousel} />

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow justify-center">How It Works</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
              From roofing requirements to quote
            </h2>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="relative h-full rounded-2xl border border-brand-ink/8 bg-brand-bg p-7">
                    <span className="absolute right-5 top-4 font-serif text-4xl font-semibold text-brand-primary/10">
                      {i + 1}
                    </span>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white">
                      <Icon size={22} />
                    </div>
                    <p className="font-serif text-lg font-semibold text-brand-ink">{s.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO intro copy */}
      <section className="bg-brand-bg py-24">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <span className="eyebrow justify-center">Why Deca Top Global Roofing System</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
            Roofing Materials for Homes and Projects
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            {settings.business_name} supplies imported stone-coated tiles, aluminium roofing,
            alu-zinc sheets and roofing accessories. The catalog lists products by profile, gauge,
            grade, color and price unit so you can compare the options for your project.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            Stone-coated tile rates vary by profile, gauge and color. Aluminium long-span, step tile,
            Metcopo and caliper options are listed by thickness, with A/B grades shown where supplied.
            Alu-zinc long span is listed by square metre and bundle sheets by a 15-sheet bundle.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            For a project quotation, share your roof plan or measurements, location and preferred
            roofing profile. These guides explain the product choices and quotation details:{' '}
            {PRICE_GUIDES.map((g, i) => (
              <span key={g.slug}>
                <Link href={`/articles/${g.slug}`} className="font-semibold text-brand-primary hover:underline">
                  {g.label}
                </Link>
                {i < PRICE_GUIDES.length - 2 ? ', ' : i === PRICE_GUIDES.length - 2 ? ' and ' : '.'}
              </span>
            ))}
          </p>
          <div className="mx-auto mt-8 h-px w-24 bg-brand-gold" />
        </Reveal>
      </section>

      <Showroom settings={settings} />

      <Team team={about.team} className="bg-brand-bg" />

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow justify-center">Questions</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-deep py-20 text-center text-white">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 120% at 50% 0%, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 55%)' }}
        />
        <Reveal className="relative mx-auto max-w-2xl px-5">
          <span className="eyebrow justify-center">Get Started</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Planning a roofing project?</h2>
          <p className="mt-3 text-white/80">Ask about profiles, gauges, colors and current product availability.</p>
          <Link href="/about" className="btn-gold mt-8 px-9 py-3.5">
            Contact Us
          </Link>
        </Reveal>
      </section>
    </>
  );
}
