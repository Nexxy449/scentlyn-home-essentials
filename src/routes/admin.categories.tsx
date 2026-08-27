import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderTree, ImageOff, Search } from "lucide-react";
import { getCatalogue } from "@/lib/catalogue";
import type { Category } from "@/lib/shop-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void getCatalogue().then((catalogue) => { if (!cancelled) setCategories(catalogue.categories); }).catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load categories."); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = categories.filter((category) => {
    const needle = query.trim().toLowerCase();
    return !needle || category.name.toLowerCase().includes(needle) || category.slug.toLowerCase().includes(needle);
  });

  return <div className="space-y-6"><div><p className="text-sm font-medium text-muted-foreground">Catalogue</p><h2 className="mt-1 text-3xl font-semibold tracking-tight">Categories</h2><p className="mt-2 text-muted-foreground">The same active categories and presentation mapping used by the storefront.</p></div><Card><CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>All categories</CardTitle><CardDescription>{loading ? "Loading categories..." : `${filtered.length} of ${categories.length} categories`}</CardDescription></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search categories" className="pl-9"/></div></CardHeader><CardContent>{error ? <p className="text-sm text-destructive">{error}</p> : loading ? <p className="py-8 text-sm text-muted-foreground">Loading categories…</p> : filtered.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No categories found.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((category) => <div key={category.slug} className="overflow-hidden rounded-xl border bg-background"><div className="aspect-[16/8] bg-muted">{category.image ? <img src={category.image} alt={category.name} className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="size-6"/></div>}</div><div className="p-4"><div className="flex items-center gap-2 font-medium"><FolderTree className="size-4 text-muted-foreground"/>{category.name}</div><p className="mt-1 text-sm text-muted-foreground">{category.blurb || "No description"}</p><p className="mt-3 text-xs text-muted-foreground">/{category.slug} · {category.subcategories.length} subcategories</p></div></div>)}</div>}</CardContent></Card></div>;
}
