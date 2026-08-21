import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productSlug: string;
  name: string;
  variant: string;
  unitPrice: number;
  quantity: number;
  image: string;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productSlug: string, variant: string) => void;
  setQuantity: (productSlug: string, variant: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "scentlyn-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const add = (item: CartItem) =>
      setItems((prev) => {
        const i = prev.findIndex(
          (x) => x.productSlug === item.productSlug && x.variant === item.variant,
        );
        if (i === -1) return [...prev, item];
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + item.quantity };
        return next;
      });

    const remove = (productSlug: string, variant: string) =>
      setItems((prev) =>
        prev.filter((x) => !(x.productSlug === productSlug && x.variant === variant)),
      );

    const setQuantity = (productSlug: string, variant: string, quantity: number) =>
      setItems((prev) =>
        prev
          .map((x) =>
            x.productSlug === productSlug && x.variant === variant
              ? { ...x, quantity: Math.max(0, quantity) }
              : x,
          )
          .filter((x) => x.quantity > 0),
      );

    return {
      items,
      add,
      remove,
      setQuantity,
      clear: () => setItems([]),
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.quantity * i.unitPrice, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

/** Delivery options — prototype pricing, easy to replace with real rates later. */
export const deliveryOptions = [
  { id: "nairobi-standard", name: "Nairobi Standard (1–2 days)", fee: 250 },
  { id: "nairobi-express", name: "Nairobi Same-Day Express", fee: 450 },
  { id: "countrywide", name: "Countrywide Courier (2–4 days)", fee: 550 },
  { id: "pickup", name: "Pickup at our Nairobi store", fee: 0 },
];
