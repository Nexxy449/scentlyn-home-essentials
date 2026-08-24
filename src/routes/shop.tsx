import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/shop-data";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Home Care & Laundry Products | Scentlyn Kenya" },
      {
        name: "description",
        content:
          "Browse every Scentlyn home essential — laundry, home care, home fragrance, bathroom and kitchen products, delivered in Kenya.",
      },
      { property: "og:title", content: "Shop Home Essentials — Scentlyn" },
      {
        property: "og:description",
        content: "Laundry, cleaning and home fragrance essentials for a fresher home.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://scentlyn-home-essentials.lovable.app/shop" },
    ],
    links: [{ rel: "canonical", href: "https://scentlyn-home-essentials.lovable.app/shop" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-16">
      <header className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          The shop
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Home essentials</h1>
        <p className="mt-3 text-muted-foreground">
          Everything you need to keep your home clean, fresh and beautifully cared for.
        </p>
      </header>

      <nav className="mt-7 flex flex-wrap gap-2" aria-label="Shop by category">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$category"
            params={{ category: c.slug }}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
