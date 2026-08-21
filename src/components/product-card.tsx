import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { formatPrice, fromPrice, waLink, type Product } from "@/lib/shop-data";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.variants.every((v) => !v.inStock);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-card">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-surface"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </span>
        )}
        <Link to="/product/$slug" params={{ slug: product.slug }} className="font-semibold leading-snug">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {product.variants.length} {product.variants.length === 1 ? "option" : "options"} ·{" "}
          {product.variants[0]?.label}
          {product.variants.length > 1 ? ` – ${product.variants[product.variants.length - 1]?.label}` : ""}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold text-brand">
            from {formatPrice(fromPrice(product))}
          </span>
          <a
            href={waLink(`Hi Scentlyn, I'm interested in ${product.name}. Is it available?`)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Order ${product.name} via WhatsApp`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-whatsapp text-whatsapp-foreground"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
