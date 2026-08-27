import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

type Product = { id: string; name: string; price: number | null; category_id: string | null; is_active?: boolean | null; created_at?: string | null };

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("id,name,price,category_id,is_active,created_at").order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) { setError(error.message || "Unable to load products."); setLoading(false); return; }
      setProducts(data ?? []); setLoading(false);
    }
    void loadProducts();
    return () => { cancelled = true; };
  }, []);

  const filtered = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  return <div className="space-y-6">
    <div><p className="text-sm font-medium text-muted-foreground">Catalogue</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Products</h2><p className="mt-2 text-muted-foreground">Read-only product catalogue. Editing will be enabled in a later phase.</p></div>
    <Card><CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>All products</CardTitle><CardDescription>{loading ? "Loading catalogue..." : `${filtered.length} of ${products.length} products`}</CardDescription></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="pl-9" /></div></CardHeader><CardContent>{error ? <p className="text-sm text-destructive">{error}</p> : loading ? <p className="py-8 text-sm text-muted-foreground">Loading products…</p> : filtered.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No products found.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead className="border-b text-left text-muted-foreground"><tr><th className="pb-3 font-medium">Product</th><th className="pb-3 font-medium">Price</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id} className="border-b last:border-0"><td className="py-4 font-medium"><span className="inline-flex items-center gap-2"><Package className="size-4 text-muted-foreground"/>{product.name}</span></td><td className="py-4">KSh {Number(product.price ?? 0).toLocaleString()}</td><td className="py-4"><span className="rounded-full border px-2 py-1 text-xs">{product.is_active === false ? "Inactive" : "Active"}</span></td></tr>)}</tbody></table></div>}</CardContent></Card>
  </div>;
}
