import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageOff, Package, Search } from "lucide-react";
import { getCatalogue } from "@/lib/catalogue";
import type { Product } from "@/lib/shop-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const catalogue = await getCatalogue();
        if (!cancelled) setProducts(catalogue.products);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load products.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const filtered = products.filter((p) => {
    const needle = query.trim().toLowerCase();
    return !needle || p.name.toLowerCase().includes(needle) || p.slug.toLowerCase().includes(needle);
  });

  const priceLabel = (p: Product) => {
    const prices = p.variants.filter((v) => v.inStock).map((v) => v.price);
    const source = prices.length ? prices : p.variants.map((v) => v.price);
    if (!source.length) return "No variants";
    const min = Math.min(...source);
    const max = Math.max(...source);
    return min === max ? `KSh ${min.toLocaleString()}` : `KSh ${min.toLocaleString()} – ${max.toLocaleString()}`;
  };

  return <div className="space-y-6">
    <div>
      <p className="text-sm font-medium text-muted-foreground">Catalogue</p>
      <h2 className="mt-1 text-3xl font-semibold tracking-tight">Products</h2>
      <p className="mt-2 text-muted-foreground">The same catalogue service used by the storefront, combining live Supabase commerce data with the verified product image mapping.</p>
    </div>
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>All products</CardTitle><CardDescription>{loading ? "Loading catalogue..." : `${filtered.length} of ${products.length} products`}</CardDescription></div>
        <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="pl-9"/></div>
      </CardHeader>
      <CardContent>
        {error ? <p className="text-sm text-destructive">{error}</p> : loading ? <p className="py-8 text-sm text-muted-foreground">Loading products…</p> : filtered.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No products found.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b text-left text-muted-foreground"><tr><th className="pb-3 font-medium">Image</th><th className="pb-3 font-medium">Product</th><th className="pb-3 font-medium">Variants</th><th className="pb-3 font-medium">Price</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody>{filtered.map((p) => <tr key={p.slug} className="border-b last:border-0"><td className="py-3">{p.image ? <img src={p.image} alt={p.name} className="size-14 rounded-md border object-cover"/> : <span className="flex size-14 items-center justify-center rounded-md border bg-muted text-muted-foreground"><ImageOff className="size-5"/></span>}</td><td className="py-4 font-medium"><span className="inline-flex items-center gap-2"><Package className="size-4 text-muted-foreground"/>{p.name}</span><p className="mt-1 text-xs font-normal text-muted-foreground">/{p.slug}</p></td><td className="py-4">{p.variants.length}</td><td className="py-4">{priceLabel(p)}</td><td className="py-4"><span className="rounded-full border px-2 py-1 text-xs">{p.variants.some((v) => v.inStock) ? "Active" : "Out of stock"}</span></td></tr>)}</tbody></table></div>}
      </CardContent>
    </Card>
  </div>;
}
