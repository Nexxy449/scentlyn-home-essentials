import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MessageCircle, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { getCatalogue } from "@/lib/catalogue";
import { formatPrice, subcategoryName, waLink } from "@/lib/shop-data";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const catalogue = await getCatalogue();
    const product = catalogue.products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product, category: catalogue.categories.find((c) => c.slug === product.category) ?? null, related: catalogue.products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product unavailable — Scentlyn" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.product.name} — Scentlyn`;
    return { meta: [{ title }, { name: "description", content: loaderData.product.short }, { property: "og:title", content: title }, { property: "og:description", content: loaderData.product.short }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, category, related } = Route.useLoaderData();
  const { add } = useCart();
  const firstAvailable = product.variants.findIndex((v) => v.inStock);
  const [variantIndex, setVariantIndex] = useState(firstAvailable === -1 ? 0 : firstAvailable);
  const [qty, setQty] = useState(1);
  const variant = product.variants[variantIndex];
  if (!variant || !category) return null;
  const waMessage = `Hi Scentlyn, I'd like to enquire about ${product.name} – ${variant.label}. Is it available?`;
  return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <nav className="text-xs text-muted-foreground"><Link to="/" className="hover:text-foreground">Home</Link>{" "}/{" "}<Link to="/category/$category" params={{ category: category.slug }} className="hover:text-foreground">{category.name}</Link>{" "}/ <span className="text-foreground">{subcategoryName(product.category, product.subcategory)}</span></nav>
    <div className="mt-4 grid gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface"><img src={product.image} alt={product.name} className="aspect-square w-full object-cover" /></div>
      <div>
        {product.brand && <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{product.brand}</span>}
        <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{product.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{product.short}</p>
        <p className="mt-5 font-display text-3xl font-bold text-brand">{formatPrice(variant.price)}</p>
        <p className="mt-1 text-sm">{variant.inStock ? <span className="inline-flex items-center gap-1 text-fresh-foreground"><Check className="h-4 w-4 text-primary" /> In stock — {variant.label}</span> : <span className="text-muted-foreground">Out of stock — {variant.label}</span>}</p>
        <div className="mt-6"><h2 className="text-sm font-semibold uppercase tracking-wide">{product.variantLabel}</h2><div className="mt-2 flex flex-wrap gap-2">{product.variants.map((v, i) => <button key={v.label} type="button" onClick={() => setVariantIndex(i)} disabled={!v.inStock} className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${i === variantIndex ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background hover:bg-secondary"}`}>{v.label}</button>)}</div></div>
        <div className="mt-6 flex items-center gap-4"><span className="text-sm font-semibold uppercase tracking-wide">Quantity</span><div className="flex items-center rounded-xl border border-border"><button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center"><Minus className="h-4 w-4" /></button><span className="w-10 text-center font-semibold">{qty}</span><button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center"><Plus className="h-4 w-4" /></button></div></div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button variant="brand" size="xl" className="flex-1" disabled={!variant.inStock} onClick={() => { add({ productSlug: product.slug, name: product.name, variant: variant.label, unitPrice: variant.price, quantity: qty, image: product.image }); toast.success(`${product.name} – ${variant.label} added to cart`); }}>Add to cart</Button><Button asChild variant="whatsapp" size="xl" className="flex-1"><a href={waLink(waMessage)} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Order via WhatsApp</a></Button></div>
        <div className="mt-8 space-y-4 rounded-2xl border border-border p-5"><div><h3 className="text-sm font-semibold uppercase tracking-wide">Product details</h3><p className="mt-2 text-sm text-muted-foreground">{product.description}</p><ul className="mt-3 space-y-1">{product.benefits.map((b) => <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}</li>)}</ul></div><div className="border-t border-border pt-4 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Nairobi delivery from KSh 250 · countrywide courier available</p><p className="mt-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Genuine products, sealed packaging</p></div></div>
      </div>
    </div>
    {related.length > 0 && <section className="mt-14"><h2 className="text-2xl font-bold">You may also like</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">{related.map((p) => <ProductCard key={p.slug} product={p} />)}</div></section>}
  </div>;
}
