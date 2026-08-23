import { Link } from "@tanstack/react-router";
import { MessageCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { formatPrice, fromPrice, waLink, type Product } from "@/lib/shop-data";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const soldOut = product.variants.every((v) => !v.inStock);
  const first = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const isOwnBrand = product.brand === "Scentlyn";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {isOwnBrand && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand backdrop-blur">
            Scentlyn
          </span>
        )}
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && !isOwnBrand && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </span>
        )}
        <h3 className="mt-0.5 text-sm font-semibold leading-snug sm:text-base">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="after:absolute focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">{product.short}</p>
        <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          {first?.label}
          {product.variants.length > 1 ? ` · ${product.variants.length} sizes` : ""}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="font-display text-base font-bold text-brand sm:text-lg">
            {product.variants.length > 1 ? "from " : ""}
            {formatPrice(fromPrice(product))}
          </span>
          <div className="flex items-center gap-1.5">
            <a
              href={waLink(`Hi Scentlyn, I'm interested in ${product.name}. Is it available?`)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-whatsapp transition-colors hover:bg-whatsapp hover:text-whatsapp-foreground"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <button
              type="button"
              disabled={soldOut || !first}
              aria-label={`Add ${product.name} to cart`}
              onClick={() => {
                if (!first) return;
                add({
                  productSlug: product.slug,
                  name: product.name,
                  variant: first.label,
                  unitPrice: first.price,
                  quantity: 1,
                  image: product.image,
                });
                toast.success(`${product.name} added to cart`, { description: first.label });
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
