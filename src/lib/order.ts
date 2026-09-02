import type { CartItem } from "@/lib/cart";

export type PaymentMethodId = "mpesa" | "card" | "cod";

export type PaymentMethod = {
  id: PaymentMethodId;
  name: string;
  description: string;
  live: boolean;
};

export const paymentMethods: PaymentMethod[] = [
  { id: "mpesa", name: "M-Pesa", description: "Secure M-Pesa payment via Paystack.", live: true },
  { id: "card", name: "Visa / Card", description: "Secure card checkout via Paystack.", live: true },
  { id: "cod", name: "Cash on Delivery", description: "Pay the rider when your order arrives.", live: true },
];

export type OrderStatus = "pending" | "awaiting_cash" | "paid" | "failed";

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
  try { window.sessionStorage.setItem(KEY, JSON.stringify(order)); } catch { /* ignore */ }
}

export function readOrder(): Order | null {
  try { const raw = window.sessionStorage.getItem(KEY); return raw ? (JSON.parse(raw) as Order) : null; } catch { return null; }
}
