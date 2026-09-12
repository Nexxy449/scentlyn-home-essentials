import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { getCatalogue } from "@/lib/catalogue";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({ q: typeof search["q"] === "string" ? search["q"] : "" }),
  loader: async () => getCatalogue(),
  head: () => ({ meta: [
    { title: "Search products — Scentlyn" },
    { name: "description", content: "Search Scentlyn for laundry, kitchen, toiletries and fragrance products." },
    { property: "og:title", content: "Search products — Scentlyn" },
    { property: "og:description", content: "Find Scentlyn products in seconds." },
  ] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { products } = Route.useLoaderData();
  const navigate = useNavigate();
  const [value, setValue] = useState(q);
  const query = q.trim().toLowerCase();
  const results = query ? products.filter((p) => [p.name, p.brand, p.category, p.subcategory, p.short, p.description, ...p.variants.map((v) => v.label)].filter(Boolean).some((field) => String(field).toLowerCase().includes(query))) : [];

  return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <h1 className="text-2xl font-bold md:text-3xl">Search</h1>
    <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/search", search: { q: value.trim() } }); }} className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 shadow-card">
      <SearchIcon className="h-5 w-5 text-muted-foreground" />
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ariel, Vanish, Lenor, Elbow Grease…" className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" />
    </form>
    {q && <p className="mt-4 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"} for “{q}”</p>}
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">{results.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
    {q && results.length === 0 && <div className="mt-10 text-center"><p className="text-sm text-muted-foreground">Nothing found. Try a brand name, a category or a size.</p><Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">Browse all products</Link></div>}
  </div>;
}
