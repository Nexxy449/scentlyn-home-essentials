import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, MessageCircle, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, products, waLink } from "@/lib/shop-data";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scentlyn — Laundry, Home Care & Scents Delivered in Kenya" },
      {
        name: "description",
        content:
          "Shop premium laundry pods, detergents, cleaners and home fragrance. Delivery across Kenya, guest checkout and instant WhatsApp ordering.",
      },
      { property: "og:title", content: "Scentlyn — A beautifully cared-for home" },
      {
        property: "og:description",
        content: "Laundry, Home Care, Scents, Bathroom and Kitchen essentials delivered in Kenya.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              <Leaf className="h-3.5 w-3.5" /> Scent • Freshness • Home Care
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] md:text-6xl">
              A beautifully cared-for home.
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
              Scentlyn brings together trusted laundry, cleaning and home fragrance products —
              delivered across Kenya, or ordered in seconds on WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/category/$category" params={{ category: "laundry" }}>
                  Shop laundry
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
          <div className="overflow-hidden rounded-3xl shadow-lift">
            <img
              src={heroImg}
              alt="Scentlyn laundry and home care products arranged on a bright surface"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Five simple sections. Everything your home needs.
            </p>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/category/$category"
              params={{ category: c.slug }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-card ${
                i === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold md:text-3xl">Best sellers</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The products our customers reorder most.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Genuine brands only",
              text: "Ariel, Lenor, Vanish and more — sourced from trusted suppliers.",
            },
            {
              icon: Truck,
              title: "Fast Kenyan delivery",
              text: "Same-day options in Nairobi and countrywide courier.",
            },
            {
              icon: MessageCircle,
              title: "Order how you like",
              text: "Guest checkout online, or a one-tap WhatsApp order.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-card p-6 shadow-card">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
