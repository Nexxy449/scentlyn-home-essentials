import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { getCatalogue } from "@/lib/catalogue";

export const Route = createFileRoute("/shop")({
  loader: () => getCatalogue(),
  head: () => ({
    meta: [
      { title: "Shop All Home Essentials | Scentlyn Kenya" },
      { name: "description", content: "Browse Scentlyn laundry, kitchen, toiletries and fragrance essentials, delivered across Kenya." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { categories, products } = Route.useLoaderData();
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState("featured");

  const shown = useMemo(() => {
    const filtered = category === "all" ? products : products.filter((p) => p.category === category);
    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0);
      if (sort === "price-high") return (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0);
      return 0;
    });
  }, [category, products, sort]);

  return (
    <div className="bg-background">
      <section className="border-b border-border/60 bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <nav className="text-xs text-muted-foreground"><Link to="/" className="hover:text-foreground">Home</Link> <span className="mx-1">/</span> Shop</nav>
          <div className="mt-6 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">The Scentlyn shop</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Everything for a fresher home.</h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">Thoughtfully selected laundry, kitchen, toiletries and fragrance essentials — made easy to discover, choose and enjoy.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Shop by category">
            <button type="button" onClick={() => setCategory("all")} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${category === "all" ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}>All products</button>
            {categories.map((c) => <button key={c.slug} type="button" onClick={() => setCategory(c.slug)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${category === c.slug ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"}`}>{c.name}</button>)}
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="h-4 w-4" /><span className="sr-only">Sort products</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground outline-none"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        </div>

        <div className="flex items-center justify-between py-5"><p className="text-sm text-muted-foreground">{shown.length} {shown.length === 1 ? "product" : "products"}</p>{category !== "all" && <button type="button" onClick={() => setCategory("all")} className="text-sm font-semibold text-brand hover:underline">Clear filter</button>}</div>

        {shown.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">{shown.map((p) => <ProductCard key={p.slug} product={p} />)}</div> : <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center"><h2 className="font-display text-xl font-bold">More is coming</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">We are stocking this collection next. Check back soon or ask us what we can source for you.</p></div>}
      </section>
    </div>
  );
}
