import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/shop-data";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search products — Scentlyn" },
      {
        name: "description",
        content: "Search Scentlyn for Ariel, Vanish, Lenor, candles, cleaners and more.",
      },
      { property: "og:title", content: "Search products — Scentlyn" },
      { property: "og:description", content: "Find any Scentlyn product in seconds." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q);
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold md:text-3xl">Search</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/search", search: { q: value } });
        }}
        className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 shadow-card"
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ariel, Vanish, Lenor, Elbow Grease, Colour Catcher…"
          className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </form>

      {q && (
        <p className="mt-4 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {q && results.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Nothing found. Try a brand name, a category or a size.
        </p>
      )}
    </div>
  );
}
