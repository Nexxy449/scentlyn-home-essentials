import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
  Wind,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { categories, products, waLink } from "@/lib/shop-data";
import { deliveryInfo, faqs, testimonials } from "@/lib/site-content";
import heroImg from "@/assets/hero-lifestyle.jpg";
import lifeLaundry from "@/assets/life-laundry.jpg";
import lifeBedroom from "@/assets/life-bedroom.jpg";
import lifeBathroom from "@/assets/life-bathroom.jpg";
import lifeKitchen from "@/assets/life-kitchen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scentlyn Home Essentials — Laundry, Cleaning & Home Fragrance Kenya" },
      {
        name: "description",
        content:
          "Thoughtfully selected laundry, cleaning and home fragrance essentials for Kenyan homes. Shop online or order on WhatsApp.",
      },
      { property: "og:title", content: "Scentlyn — Make Home Feel Beautiful" },
      {
        property: "og:description",
        content:
          "Laundry, home care, home fragrance, bathroom and kitchen essentials, delivered in Kenya.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://scentlyn-home-essentials.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://scentlyn-home-essentials.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Scentlyn Home Essentials",
          description:
            "Laundry, cleaning and home fragrance essentials for Kenyan homes.",
          url: "https://scentlyn-home-essentials.lovable.app/",
          areaServed: "Kenya",
        }),
      },
    ],
  }),
  component: Home,
});

const categoryCopy: Record<string, string> = {
  laundry: "Detergents, pods and softeners that leave fabrics soft and lasting fresh.",
  "home-care": "Everyday cleaners for floors, surfaces and the rooms you live in most.",
  scents: "Candles, scents and little details that make your space feel like home.",
  bathroom: "Keep the smallest room spotless, bright and quietly fresh.",
  kitchen: "Degreasers, dishwashing and surface care for a kitchen that shines.",
};

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const own = products.filter((p) => p.brand === "Scentlyn").slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-rise">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Scent • Freshness • Home Care
            </span>
            <h1 className="mt-5 font-display text-[2.1rem] font-bold leading-[1.06] text-balance-tight sm:text-5xl md:text-6xl">
              Make home feel beautiful.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Thoughtfully selected laundry, cleaning and home fragrance essentials designed to keep
              your home fresh, clean and beautifully scented.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="brand" size="xl">
                <Link to="/shop">
                  Shop home essentials <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a
                  href={waLink("Hi Scentlyn, I'd like to place an order.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" /> Order via WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src={heroImg}
              alt="A candle and reed diffuser beside folded towels in a sunlit living room"
              width={1280}
              height={1600}
              className="h-full max-h-[560px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Brand intro */}
      <Reveal as="section" className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24">
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Our philosophy
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-balance-tight md:text-4xl">
          More than clean. It's how home feels.
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground md:text-lg">
          Soft fabrics fresh off the line. A room that smells like it's been cared for. Scentlyn is
          about the whole feeling of a well-kept home — and the everyday essentials that get you
          there.
        </p>
      </Reveal>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Shop by category</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Five simple sections. Everything your home needs.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link
                to="/category/$category"
                params={{ category: c.slug }}
                className="group block h-full overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="aspect-[16/10] overflow-hidden bg-surface">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {categoryCopy[c.slug] ?? c.blurb}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <Reveal className="mb-8">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Loved in Kenyan homes</h2>
          <p className="mt-2 text-sm text-muted-foreground">The essentials customers reorder most.</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="soft" size="lg">
            <Link to="/shop">Browse all products</Link>
          </Button>
        </div>
      </section>

      {/* Scentlyn collection */}
      {own.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <Reveal className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Our own label
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold md:text-4xl">
                The Scentlyn Collection
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
                Our signature selection of scents and home-care essentials, created to make everyday
                spaces feel fresher, cleaner and more inviting.
              </p>
            </Reveal>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {own.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Scentlyn */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Why Scentlyn</h2>
          <p className="mt-2 text-muted-foreground">
            A calmer way to look after your home, from the first tap to the doorstep.
          </p>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Thoughtfully selected",
              text: "Products chosen with quality, freshness and everyday living in mind.",
            },
            {
              icon: Wind,
              title: "Beautifully scented",
              text: "Because a clean home should smell as good as it feels.",
            },
            {
              icon: MessageCircle,
              title: "Convenient ordering",
              text: "Shop online or place your order directly through WhatsApp.",
            },
            {
              icon: ShieldCheck,
              title: "Quality you can trust",
              text: "Reliable products for the spaces and routines that matter most.",
            },
            {
              icon: Heart,
              title: "Home care made simple",
              text: "Everything you need to keep your home fresh and cared for.",
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lifestyle */}
      <section className="bg-gradient-fresh text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <Reveal className="max-w-xl">
            <h2 className="font-display text-2xl font-bold md:text-4xl">A fresher way to live.</h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/85 md:text-lg">
              Clean laundry, calm rooms, a scent that lingers gently. Small things, every day.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {[
              { src: lifeLaundry, alt: "Freshly washed white linen folded in a basket" },
              { src: lifeBedroom, alt: "A neatly made bed with a candle on the nightstand" },
              { src: lifeBathroom, alt: "A calm bathroom with rolled towels and a diffuser" },
              { src: lifeKitchen, alt: "A tidy, sunlit kitchen counter" },
            ].map((img, i) => (
              <Reveal key={img.alt} delay={i * 70}>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-square w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-7 sm:p-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Truck className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">
              Delivered to your door
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We make getting your home-care essentials simple and convenient.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <dl className="space-y-4 text-sm">
              {[
                { t: "Delivery areas", d: deliveryInfo.areas },
                { t: "Timelines", d: deliveryInfo.timelines },
                { t: "Charges", d: deliveryInfo.charges },
              ].map((row) => (
                <div key={row.t} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {row.t}
                  </dt>
                  <dd className="mt-1">{row.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <Reveal className="max-w-xl">
            <h2 className="font-display text-2xl font-bold md:text-3xl">What customers say</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Placeholder reviews — these will be replaced with real customer feedback.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 70}>
                <figure className="h-full rounded-2xl border border-dashed border-border bg-card p-6">
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold">
                    {t.name}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {t.place}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <Reveal>
          <h2 className="font-display text-2xl font-bold md:text-3xl">Questions, answered</h2>
        </Reveal>
        <div className="mt-7 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {faqs.slice(0, 4).map((f) => (
            <details key={f.q} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base">
                {f.q}
                <span
                  aria-hidden
                  className="shrink-0 text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-7 flex justify-center">
          <Button asChild variant="soft">
            <Link to="/faq">See all FAQs</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
