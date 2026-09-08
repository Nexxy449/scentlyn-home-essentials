import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Truck, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getCatalogue } from "@/lib/catalogue";
import { waLink } from "@/lib/shop-data";
import { deliveryInfo } from "@/lib/site-content";
import heroImg from "@/assets/hero-lifestyle.jpg";
import lifeLaundry from "@/assets/life-laundry.jpg";
import lifeBedroom from "@/assets/life-bedroom.jpg";
import lifeBathroom from "@/assets/life-bathroom.jpg";
import lifeKitchen from "@/assets/life-kitchen.jpg";

export const Route = createFileRoute("/")({
  loader: () => getCatalogue(),
  head: () => ({
    meta: [
      { title: "Scentlyn Laundrymart — Laundry, Home & Fragrance Essentials" },
      { name: "description", content: "Laundry, home and fragrance essentials for spaces that feel clean, fresh and beautifully yours. Shop Scentlyn Laundrymart in Kenya." },
      { property: "og:title", content: "Scentlyn Laundrymart — For homes that feel as good as they look." },
      { property: "og:description", content: "Carefully handpicked laundry, home and fragrance essentials for spaces that feel clean, fresh and beautifully yours." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://scentlyn-home-essentials.lovable.app/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Store",
        name: "Scentlyn Laundrymart",
        description: "Laundry, home and fragrance essentials for Kenyan homes.",
        url: "https://scentlyn-home-essentials.lovable.app/",
        areaServed: "Kenya",
      }),
    }],
  }),
  component: Home,
});

const categorySlugs = ["laundry", "kitchen", "bathroom", "scents"] as const;

const categoryCopy: Record<string, string> = {
  laundry: "Laundry essentials for softer fabrics and lasting freshness.",
  kitchen: "Smart everyday care for sparkling surfaces and spotless dishes.",
  bathroom: "Cleaners and freshness for a bathroom that feels beautifully cared for.",
  scents: "Candles, diffusers and scents that make your space feel like home.",
};

function Home() {
  const { categories, products } = Route.useLoaderData();
  const categoryCards = categorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean);
  const featured = products.filter((product) => product.featured).slice(0, 8);
  const own = products.filter((product) => product.brand === "Scentlyn").slice(0, 4);
  const brands = Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).filter((brand) => brand !== "Scentlyn").slice(0, 8);

  return (
    <div className="overflow-hidden">
      <section className="relative bg-surface">
        <div className="mx-auto grid max-w-7xl items-stretch lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative z-10 flex items-center px-5 py-14 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
            <div className="max-w-xl animate-rise">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                <span className="h-px w-8 bg-primary" /> Scentlyn Laundrymart
              </span>
              <h1 className="mt-6 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance-tight sm:text-6xl xl:text-[4.7rem]">
                For homes that feel as good as they look.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                A beautiful home begins with how it feels. Carefully handpicked laundry, home and fragrance essentials for spaces that feel clean, fresh and beautifully yours.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="brand" size="xl" className="rounded-full px-7">
                  <Link to="/shop">Shop the collection <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="rounded-full px-7">
                  <a href={waLink("Hi Scentlyn, I'd like some help choosing products for my home.")} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Chat with us
                  </a>
                </Button>
              </div>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
                <div><strong className="block text-sm font-semibold text-foreground">Original</strong>Trusted products</div>
                <div><strong className="block text-sm font-semibold text-foreground">Kenya-wide</strong>Delivery options</div>
                <div><strong className="block text-sm font-semibold text-foreground">Easy</strong>Online ordering</div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[430px] lg:min-h-0">
            <img src={heroImg} alt="A calm, beautifully styled home with fresh linen and fragrance" width={1200} height={900} loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent lg:w-1/3" />
            <div className="absolute bottom-6 left-5 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 shadow-card backdrop-blur sm:left-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">A fresher home</p>
              <p className="mt-1 text-sm font-medium">Clean. Calm. Beautifully yours.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {[
            [Truck, "Delivery across Kenya", "Convenient delivery options"],
            [ShieldCheck, "Quality you can trust", "Carefully selected products"],
            [Sparkles, "100% original products", "Shop with confidence"],
            [MessageCircle, "Need help?", "We're one message away"],
          ].map(([Icon, title, text]) => {
            const C = Icon as typeof Truck;
            return <div key={String(title)} className="flex items-center gap-3 px-4 py-5 sm:px-6"><C className="h-5 w-5 shrink-0 text-primary" /><div><p className="text-xs font-semibold sm:text-sm">{String(title)}</p><p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">{String(text)}</p></div></div>;
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Explore the essentials</span>
            <h2 className="mt-2 font-display text-2xl font-semibold md:text-4xl">Shop by category</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category, index) => category && (
            <Reveal key={category.slug} delay={index * 60}>
              <Link to="/category/$category" params={{ category: category.slug }} className="group relative block overflow-hidden rounded-[1.6rem] bg-surface">
                <div className="aspect-[0.9] overflow-hidden">
                  <img src={category.image} alt={category.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-5 pt-16 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div><h3 className="font-display text-xl font-semibold">{category.name === "Bathroom" ? "Toiletries" : category.name}</h3><p className="mt-1 text-xs leading-relaxed text-white/80">{categoryCopy[category.slug]}</p></div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 transition group-hover:bg-white group-hover:text-foreground"><ArrowRight className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">The everyday favourites</span><h2 className="mt-2 font-display text-2xl font-semibold md:text-4xl">Popular right now</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Well-loved essentials selected to make everyday home care feel a little better.</p></div>
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">Shop all products <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">{featured.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
        </div>
      </section>

      {brands.length > 0 && <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Trusted brands & everyday favourites</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">{brands.map((brand) => <span key={brand} className="font-display text-sm font-semibold tracking-tight text-foreground/65 sm:text-base">{brand}</span>)}</div>
        </div>
      </section>}

      {own.length > 0 && <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid overflow-hidden rounded-[2rem] bg-primary text-primary-foreground lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">Made for the Scentlyn home</span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">The Scentlyn collection.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-primary-foreground/75">Our own selection of home-care and fragrance essentials, chosen to bring a little more freshness and feeling into everyday spaces.</p>
            <Button asChild variant="secondary" size="lg" className="mt-7 w-fit rounded-full"><Link to="/shop">Discover Scentlyn <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-primary-foreground/10 p-1">{own.map((product) => <Link key={product.slug} to="/product/$slug" params={{ slug: product.slug }} className="group overflow-hidden"><img src={product.image} alt={product.name} loading="lazy" className="aspect-square h-full w-full object-cover transition duration-700 group-hover:scale-105" /></Link>)}</div>
        </div>
      </section>}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 md:pb-20">
        <div className="grid items-center gap-8 rounded-[2rem] bg-accent p-6 sm:p-10 md:grid-cols-[1.1fr_0.9fr] md:p-14">
          <Reveal><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">The feeling we're after</span><h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-5xl">A fresher way to live.</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Freshly washed linen. A beautifully scented room. A kitchen that shines. The little details are what make a house feel cared for.</p><Button asChild variant="brand" size="lg" className="mt-7 rounded-full"><Link to="/shop">Find your essentials <ArrowRight className="h-4 w-4" /></Link></Button></Reveal>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">{[[lifeLaundry,"Freshly washed linen"],[lifeBedroom,"A calm bedroom"],[lifeBathroom,"A cared-for bathroom"],[lifeKitchen,"A kitchen that shines"]].map(([src, alt]) => <div key={String(alt)} className="overflow-hidden rounded-2xl"><img src={src as string} alt={alt as string} loading="lazy" className="aspect-square w-full object-cover" /></div>)}</div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-[1fr_0.8fr] md:py-20">
          <Reveal><span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Simple & convenient</span><h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">From our shelves to your home.</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Shop online when you know what you need, or message us when you'd like a recommendation. We make it easy to get the right essentials.</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild variant="brand" size="lg" className="rounded-full"><Link to="/shop">Start shopping</Link></Button><Button asChild variant="whatsapp" size="lg" className="rounded-full"><a href={waLink("Hi Scentlyn, I need help choosing products for my home.")} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp us</a></Button></div></Reveal>
          <Reveal><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent"><Truck className="h-5 w-5 text-primary" /></span><div><p className="font-semibold">Delivery information</p><p className="text-xs text-muted-foreground">Clear details before you order</p></div></div><dl className="mt-6 space-y-4 text-sm">{[["Areas", deliveryInfo.areas], ["Timelines", deliveryInfo.timelines], ["Charges", deliveryInfo.charges]].map(([title, value]) => <div key={String(title)} className="border-b border-border pb-3 last:border-0"><dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{String(title)}</dt><dd className="mt-1 leading-5">{String(value)}</dd></div>)}</dl></div></Reveal>
        </div>
      </section>
    </div>
  );
}
