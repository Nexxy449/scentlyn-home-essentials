import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FolderTree, ImageOff, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

type CategoryRow = { id: string; name: string; slug: string; description: string | null; image_url: string | null; sort_order: number | null; active: boolean };
type ProductRow = { id: string; category_id: string | null; active: boolean };

const categoryPresentation: Record<string, { name: string; description: string; order: number }> = {
  laundry: { name: "Laundry", description: "Detergents, pods, softeners & fabric care", order: 1 },
  kitchen: { name: "Kitchen", description: "Degreasers, dishwashing & surfaces", order: 2 },
  bathroom: { name: "Toiletries", description: "Bathroom cleaners, toilet care & freshness", order: 3 },
  scents: { name: "Fragrance", description: "Candles, diffusers & beautiful scents", order: 4 },
};

function AdminCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      supabase.from("categories").select("id,name,slug,description,image_url,sort_order,active").order("sort_order"),
      supabase.from("products").select("id,category_id,active"),
    ]).then(([c, p]) => {
      if (cancelled) return;
      const failure = c.error || p.error;
      if (failure) setError(failure.message || "Unable to load categories.");
      else { setCategories((c.data ?? []) as CategoryRow[]); setProducts((p.data ?? []) as ProductRow[]); }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => categories.map((category) => {
    const presentation = categoryPresentation[category.slug];
    const linkedProducts = products.filter((product) => product.category_id === category.id);
    return {
      ...category,
      displayName: presentation?.name ?? category.name,
      displayDescription: presentation?.description ?? category.description ?? "No description",
      displayOrder: presentation?.order ?? category.sort_order ?? 99,
      productCount: linkedProducts.length,
      activeProductCount: linkedProducts.filter((product) => product.active).length,
    };
  }).filter((category) => Boolean(categoryPresentation[category.slug])).sort((a, b) => a.displayOrder - b.displayOrder), [categories, products]);

  const filtered = rows.filter((category) => {
    const q = query.trim().toLowerCase();
    return !q || category.displayName.toLowerCase().includes(q) || category.slug.toLowerCase().includes(q) || category.displayDescription.toLowerCase().includes(q);
  });

  return <div className="space-y-6">
    <div>
      <p className="text-sm font-medium text-muted-foreground">Catalogue</p>
      <h2 className="mt-1 text-3xl font-semibold tracking-tight">Categories</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">Live categories linked directly to the same catalogue used by the storefront. Names and ordering follow the current Scentlyn shopping structure.</p>
    </div>
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>Current catalogue categories</CardTitle><CardDescription>{loading ? "Loading categories…" : `${filtered.length} of ${rows.length} categories`}</CardDescription></div>
        <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" className="pl-9" aria-label="Search categories"/></div>
      </CardHeader>
      <CardContent>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : loading ? <p className="py-8 text-sm text-muted-foreground">Loading categories…</p> : filtered.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No categories found.</p> :
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((category) => <div key={category.id} className="overflow-hidden rounded-xl border bg-background">
            <div className="aspect-[16/8] bg-muted">{category.image_url ? <img src={category.image_url} alt={category.displayName} className="h-full w-full object-cover" width="640" height="320" loading="lazy"/> : <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="size-6"/></div>}</div>
            <div className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2 font-medium"><FolderTree className="size-4 text-muted-foreground"/>{category.displayName}</div><span className="rounded-full border px-2 py-1 text-xs">{category.active ? "Active" : "Inactive"}</span></div>
              <p className="text-sm text-muted-foreground">{category.displayDescription}</p>
              <div className="border-t pt-3 text-xs text-muted-foreground"><p>/{category.slug}</p><p className="mt-1">{category.productCount} products · {category.activeProductCount} active</p></div>
            </div>
          </div>)}</div>}
      </CardContent>
    </Card>
  </div>;
}
