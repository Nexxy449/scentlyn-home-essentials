import type { CartItem } from "@/lib/cart";

/**
 * Prototype order layer.
 * Cart -> Order -> Payment method -> Payment status -> Confirmation are kept
 * separate so a real payment provider (M-Pesa, card) can be plugged in later
 * by replacing `createOrder` with a server call. No credentials live here.
 */

export type PaymentMethodId = "mpesa" | "card" | "cod";

export type PaymentMethod = {
  id: PaymentMethodId;
  name: string;
  description: string;
  /** false = interface exists, integration comes later */
  live: boolean;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "mpesa",
    name: "M-Pesa",
    description: "Pay by STK push. Demo only in this prototype.",
    live: false,
  },
  {
    id: "card",
    name: "Visa / Card",
    description: "Card payments. Demo only in this prototype.",
    live: false,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay the rider when your order arrives.",
    live: true,
  },
];

export type OrderStatus = "pending_payment" | "awaiting_cash" | "demo_paid";

export type Order = {
  reference: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; notes?: string };
  deliveryOptionId: string;
  deliveryName: string;
  deliveryFee: number;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethodId;
  paymentMethodName: string;
  paymentStatus: OrderStatus;
};

const KEY = "scentlyn-last-order";

export function makeReference() {
  return `SCN-${Date.now().toString().slice(-6)}`;
}

export function saveOrder(order: Order) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function readOrder(): Order | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
