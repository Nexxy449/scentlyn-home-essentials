import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type CartItem = { productSlug: string; name: string; variant: string; unitPrice: number; quantity: number; image: string };
type CartContextValue = { items: CartItem[]; add: (item: CartItem, maxQuantity?: number) => void; remove: (productSlug: string, variant: string) => void; setQuantity: (productSlug: string, variant: string, quantity: number, maxQuantity?: number) => void; clear: () => void; count: number; subtotal: number };
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "scentlyn-cart-v1";
const MAX_CART_QUANTITY = 100;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { const raw = window.localStorage.getItem(STORAGE_KEY); if (raw) setItems(JSON.parse(raw) as CartItem[]); } catch { /* ignore malformed local cart */ } }, []);
  useEffect(() => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore storage failures */ } }, [items]);
  const value = useMemo<CartContextValue>(() => {
    const getLimit = (maxQuantity?: number) => maxQuantity === undefined ? MAX_CART_QUANTITY : Math.min(MAX_CART_QUANTITY, Math.max(0, Math.floor(maxQuantity)));
    const add = (item: CartItem, maxQuantity = MAX_CART_QUANTITY) => setItems(prev => {
      const i = prev.findIndex(x => x.productSlug === item.productSlug && x.variant === item.variant); const existing = prev[i]; const limit = getLimit(maxQuantity);
      if (limit === 0) return prev.filter(x => !(x.productSlug === item.productSlug && x.variant === item.variant));
      if (i === -1 || !existing) return [{ ...item, quantity: Math.min(item.quantity, limit) }, ...prev];
      const next = [...prev]; next[i] = { ...existing, quantity: Math.min(limit, existing.quantity + item.quantity) }; return next;
    });
    const remove = (productSlug: string, variant: string) => setItems(prev => prev.filter(x => !(x.productSlug === productSlug && x.variant === variant)));
    const setQuantity = (productSlug: string, variant: string, quantity: number, maxQuantity?: number) => setItems(prev => prev.map(x => x.productSlug === productSlug && x.variant === variant ? { ...x, quantity: Math.min(getLimit(maxQuantity), Math.max(0, Math.floor(quantity))) } : x).filter(x => x.quantity > 0));
    return { items, add, remove, setQuantity, clear: () => setItems([]), count: items.reduce((n, i) => n + i.quantity, 0), subtotal: items.reduce((n, i) => n + i.quantity * i.unitPrice, 0) };
  }, [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error("useCart must be used inside CartProvider"); return ctx; }

export type DeliveryOption = { id: string; name: string; fee: number; eta?: string | null };
export const deliveryOptions: DeliveryOption[] = [
  { id: "nairobi-standard", name: "Nairobi Standard (1–2 days)", fee: 250 },
  { id: "nairobi-express", name: "Nairobi Same-Day Express", fee: 450 },
  { id: "countrywide", name: "Countrywide Courier (2–4 days)", fee: 550 },
  { id: "pickup", name: "Pickup at Scentlyn", fee: 0 },
];

/** Loads the same active delivery options managed in Admin. Falls back only if the live query fails. */
export async function getDeliveryOptions(): Promise<DeliveryOption[]> {
  const { data, error } = await supabase.from("delivery_zones").select("id,name,fee,eta,active,sort_order").eq("active", true).order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (error) { console.error("Live delivery options failed to load; using checkout fallback.", error); return deliveryOptions; }
  const live = (data ?? []).map((zone) => ({ id: String(zone.id), name: String(zone.name), fee: Number(zone.fee), eta: zone.eta as string | null })).filter((zone) => zone.name && Number.isFinite(zone.fee) && zone.fee >= 0);
  return live.length ? live : deliveryOptions;
}
