import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { categories, products, waLink } from "@/lib/shop-data";
import { faqs } from "@/lib/site-content";
import heroImg from "@/assets/hero-lifestyle.jpg";
import lifeLaundry from "@/assets/life-laundry.jpg";
import lifeBedroom from "@/assets/life-bedroom.jpg";
import lifeBathroom from "@/assets/life-bathroom.jpg";
import lifeKitchen from "@/assets/life-kitchen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scentlyn — Home Essentials, Scent & Freshness in Kenya" },
      {
        name: "description",
        content:
          "Scentlyn brings together laundry, cleaning and home fragrance essentials for homes that feel as good as they look. Delivery across Kenya.",
      },
      { property: "og:title", content: "Scentlyn — For homes that feel as good as they look" },
      {
        property: "og:description",
        content:
          "Laundry, kitchen, bathroom and home fragrance essentials, thoughtfully selected and delivered across Kenya.",
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
          alternateName: "Scentlyn",
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
  laundry: "Soft fabrics, lasting freshness.",
  "home-care": "Calm, cared-for rooms.",
  scents: "The scent that says home.",
  bathroom: "Quietly spotless.",
  kitchen: "A kitchen that shines.",
};

const promises = [
  { t: "Delivery across Kenya", d: "Nairobi and countrywide courier." },
  { t: "100% original products", d: "Brands you already trust." },
  { t: "Secure payments", d: "Pay the way that suits you." },
  { t: "Quality you can trust", d: "Chosen for everyday living." },
];

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const own = products.filter((p) => p.brand === "Scentlyn").slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="A candle and reed diffuser beside folded towels in a sunlit living room"
          width={1100}
          height={1375}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div className="bg-gradient-ivory md-bg-gradient-ivory absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[78svh] max-w-6xl items-end px-4 pb-14 pt-40 sm:px-6 md:min-h-[86svh] md:items-center md:py-32">
          <div className="max-w-xl animate-rise">
            <span aria-hidden className="gold-rule" />
            <p className="eyebrow mt-5">Scentlyn Home Essentials</p>
            <h1 className="mt-4 font-display text-[2.6rem] font-normal leading-[1.02] text-balance-tight text-brand sm:text-6xl md:text-7xl">
              For homes that feel <em className="italic">as good</em> as they look.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              A beautiful home begins with how it feels. Laundry, cleaning and fragrance essentials,
              thoughtfully chosen for the spaces you live in.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Button asChild variant="brand" size="xl" className="rounded-none px-8">
                <Link to="/shop">
                  Shop our collection <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <a
                href={waLink("Hi Scentlyn, I'd like some help choosing home-care products.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> Need help choosing?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-4 md:py-16">
          {promises.map((p, i) => (
            <Reveal
              key={p.t}
              delay={i * 70}
              className="px-1 text-center md:border-r md:border-border md:px-6 md:last:border-r-0"
            >
              <span aria-hidden className="gold-rule mx-auto" />
              <h2 className="mt-4 font-display text-lg tracking-wide md:text-xl">{p.t}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
                {p.d}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal className="max-w-lg">
          <p className="eyebrow">Explore</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-balance-tight md:text-5xl">
            Shop by category
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Every room, quietly taken care of.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 70} className={i === 0 ? "col-span-2 md:col-span-2" : ""}>
              <Link
                to="/category/$category"
                params={{ category: c.slug }}
                className="group relative block h-full overflow-hidden bg-surface"
              >
                <div
                  className={
                    i === 0
                      ? "aspect-[16/10] overflow-hidden md:aspect-[16/9]"
                      : "aspect-[4/5] overflow-hidden md:aspect-[4/5]"
                  }
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <h3 className="font-display text-xl text-ink-foreground md:text-2xl">{c.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-foreground/80 md:text-sm">
                    {categoryCopy[c.slug] ?? c.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <Reveal>
              <span aria-hidden className="gold-rule" />
              <h2 className="mt-6 font-display text-3xl leading-[1.1] text-balance-tight md:text-5xl">
                More than clean. <em className="italic">It's home.</em>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground md:text-lg">
                The little details are what make a home feel cared for. Linen that smells of sunshine,
                a kitchen that gleams, a candle lit in the evening.
              </p>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                Scentlyn is built around those quiet moments — and the everyday essentials that make
                them possible.
              </p>
            </Reveal>
            <Reveal delay={90} className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { src: lifeLaundry, alt: "Freshly washed white linen folded in a basket" },
                { src: lifeBedroom, alt: "A neatly made bed with a candle on the nightstand" },
                { src: lifeBathroom, alt: "A calm bathroom with rolled towels and a diffuser" },
                { src: lifeKitchen, alt: "A tidy, sunlit kitchen counter" },
              ].map((img, i) => (
                <div
                  key={img.alt}
                  className={`overflow-hidden ${i % 3 === 0 ? "mt-0" : ""} ${i === 1 ? "md:mt-8" : ""} ${i === 3 ? "md:mt-8" : ""}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal className="max-w-lg">
          <p className="eyebrow">The edit</p>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
            Loved in Kenyan homes
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            The essentials our customers reach for again and again.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="soft" size="lg" className="rounded-none px-8">
            <Link to="/shop">Browse all products</Link>
          </Button>
        </div>
      </section>

      {/* Scentlyn collection */}
      {own.length > 0 && (
        <section className="border-y border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <Reveal className="max-w-xl">
              <span aria-hidden className="gold-rule" />
              <h2 className="mt-6 font-display text-3xl leading-tight md:text-5xl">
                The Scentlyn Collection
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground md:text-lg">
                Our own signature scents and home-care essentials, made to make everyday spaces feel
                fresher and more inviting.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {own.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <Reveal>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">Questions, answered</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {faqs.slice(0, 4).map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium sm:text-base">
                {f.q}
                <span
                  aria-hidden
                  className="shrink-0 text-xl leading-none text-gold transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-9 flex justify-center">
          <Button asChild variant="soft" className="rounded-none px-6">
            <Link to="/faq">See all FAQs</Link>
          </Button>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gradient-fresh text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 md:py-28">
          <Reveal>
            <span aria-hidden className="gold-rule mx-auto" />
            <h2 className="mt-6 font-display text-3xl leading-[1.1] text-balance-tight md:text-5xl">
              Come home to something beautiful.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-primary-foreground/80 md:text-lg">
              Start with one small thing — a softer wash, a brighter kitchen, a scent you love.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
              <Button asChild size="xl" variant="soft" className="rounded-none px-8">
                <Link to="/shop">Shop our collection</Link>
              </Button>
              <a
                href={waLink("Hi Scentlyn, I'd like some help choosing home-care products.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> Chat with us
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
