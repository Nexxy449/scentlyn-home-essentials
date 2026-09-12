import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { SafeImage } from "@/components/safe-image";
import { useCart } from "@/lib/cart";
import { formatPrice, fromPrice, waLink, type Product } from "@/lib/shop-data";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.variants.every((v) => !v.inStock);
  const first = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const isOwnBrand = product.brand === "Scentlyn";

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[1.25rem] border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-[4/4.5] overflow-hidden bg-surface">
          <SafeImage src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        </Link>
        <button type="button" aria-label={`Save ${product.name}`} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-105">
          <Heart className="h-4 w-4" />
        </button>
        {isOwnBrand && <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand backdrop-blur">Scentlyn</span>}
        {soldOut && <span className="absolute bottom-3 left-3 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Out of stock</span>}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {product.brand && !isOwnBrand && <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</span>}
        <h3 className="mt-1 text-sm font-semibold leading-snug sm:text-[15px]"><Link to="/product/$slug" params={{ slug: product.slug }} className="hover:underline">{product.name}</Link></h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{product.short}</p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{first?.label}{product.variants.length > 1 ? ` · ${product.variants.length} options` : ""}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-display text-base font-bold text-brand sm:text-lg">{product.variants.length > 1 ? "From " : ""}{formatPrice(fromPrice(product))}</span>
          <div className="flex items-center gap-1.5">
            <a href={waLink(`Hi Scentlyn, I'm interested in ${product.name}. Is it available?`)} target="_blank" rel="noreferrer" aria-label={`Order ${product.name} on WhatsApp`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-whatsapp transition-colors hover:bg-whatsapp hover:text-whatsapp-foreground"><MessageCircle className="h-4 w-4" /></a>
            <button type="button" disabled={soldOut || !first} aria-label={`Add ${product.name} to cart`} onClick={() => { if (!first) return; add({ productSlug: product.slug, name: product.name, variant: first.label, unitPrice: first.price, quantity: 1, image: first.image ?? product.image }); toast.success(`${product.name} added to cart`, { description: first.label }); }} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </article>
  );
}
