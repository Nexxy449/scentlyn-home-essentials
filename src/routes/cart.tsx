import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getDeliveryOptions, useCart } from "@/lib/cart";
import { formatPrice, waLink } from "@/lib/shop-data";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Scentlyn" },
      { name: "description", content: "Review your Scentlyn basket before checkout." },
      { property: "og:title", content: "Your cart — Scentlyn" },
      { property: "og:description", content: "Review your Scentlyn basket before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQuantity, remove, subtotal } = useCart();
  const [stock, setStock] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const [deliveryFrom, setDeliveryFrom] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    if (!items.length) return;
    setStockLoading(true);
    void (async () => {
      const pairs = items.map((item) => ({ slug: item.productSlug, variant: item.variant }));
      const { data: products } = await supabase.from("products").select("id,slug").in("slug", [...new Set(pairs.map((p) => p.slug))]);
      const ids = (products ?? []).map((p) => p.id);
      if (!ids.length) { if (active) setStockLoading(false); return; }
      const { data: variants } = await supabase.from("product_variants").select("product_id,name,stock_quantity,active").in("product_id", ids);
      if (!active) return;
      const productIdBySlug = new Map((products ?? []).map((p) => [p.slug, p.id]));
      const next: Record<string, number> = {};
      for (const item of items) {
        const productId = productIdBySlug.get(item.productSlug);
        const variant = (variants ?? []).find((v) => v.product_id === productId && v.name === item.variant);
        next[`${item.productSlug}::${item.variant}`] = variant?.active ? Math.max(0, Number(variant.stock_quantity)) : 0;
      }
      setStock(next);
      setStockLoading(false);
    })();
    return () => { active = false; };
  }, [items]);

  useEffect(() => {
    let active = true;
    void getDeliveryOptions().then((options) => {
      if (!active) return;
      const fees = options.map((o) => o.fee).filter((fee) => Number.isFinite(fee));
      setDeliveryFrom(fees.length ? Math.min(...fees) : null);
    });
    return () => { active = false; };
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse a category and add your household essentials.</p>
        <Button asChild variant="brand" size="xl" className="mt-6"><Link to="/">Start shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold md:text-3xl">Your cart</h1>
      {stockLoading && <p className="mt-2 text-xs text-muted-foreground">Checking current stock…</p>}
      <ul className="mt-6 space-y-3">
        {items.map((item) => {
          const key = `${item.productSlug}::${item.variant}`;
          const available = stock[key];
          const maxQuantity = available === undefined ? 100 : available;
          const unavailable = available === 0;
          return (
            <li key={`${item.productSlug}-${item.variant}`} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <Link to="/product/$slug" params={{ slug: item.productSlug }} className="shrink-0"><img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" /></Link>
              <div className="min-w-0 flex-1">
                <Link to="/product/$slug" params={{ slug: item.productSlug }} className="block truncate font-semibold">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{item.variant}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(item.unitPrice)} each</p>
                {available !== undefined && <p className={`mt-1 text-xs ${unavailable ? "text-destructive" : "text-muted-foreground"}`}>{unavailable ? "Currently out of stock" : `${available} available`}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-border">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(item.productSlug, item.variant, item.quantity - 1, maxQuantity)} className="flex h-9 w-9 items-center justify-center"><Minus className="h-4 w-4" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" disabled={unavailable || item.quantity >= maxQuantity} onClick={() => setQuantity(item.productSlug, item.variant, item.quantity + 1, maxQuantity)} className="flex h-9 w-9 items-center justify-center disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button type="button" onClick={() => remove(item.productSlug, item.variant)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /> Remove</button>
                </div>
              </div>
              <span className="font-display font-bold text-brand">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        <Row label="Delivery" value={deliveryFrom === null ? "Calculated at checkout" : `From ${formatPrice(deliveryFrom)}`} />
        <div className="mt-3 border-t border-border pt-3"><Row label="Total" value="Calculated at checkout" bold /></div>
        <p className="mt-2 text-xs text-muted-foreground">Choose your delivery option at checkout to see the exact total.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" size="xl" className="flex-1"><Link to="/checkout">Checkout</Link></Button>
          <Button asChild variant="whatsapp" size="xl" className="flex-1"><a href={waLink(`Hi Scentlyn, I'd like to order:\n${items.map((i) => `• ${i.name} – ${i.variant} x${i.quantity}`).join("\n")}`)} target="_blank" rel="noreferrer">Order via WhatsApp</a></Button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex items-center justify-between py-1 ${bold ? "text-base font-bold" : "text-sm"}`}><span className={bold ? "" : "text-muted-foreground"}>{label}</span><span>{value}</span></div>;
}
