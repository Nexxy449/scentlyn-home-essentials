import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice, waLink } from "@/lib/shop-data";
import { readOrder, type Order } from "@/lib/order";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Order confirmed — Scentlyn" },
      { name: "description", content: "Your Scentlyn order has been received." },
      { property: "og:title", content: "Order confirmed — Scentlyn" },
      { property: "og:description", content: "Your Scentlyn order has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(readOrder());
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="min-h-[50vh]" />;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">No recent order</h1>
        <Button asChild variant="brand" size="xl" className="mt-6">
          <Link to="/">Back to shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Order received</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you {order.customer.name.split(" ")[0]}. Your reference is{" "}
          <span className="font-semibold text-foreground">{order.reference}</span>. We'll call{" "}
          {order.customer.phone} to confirm delivery.
        </p>

        <div className="mt-6 rounded-2xl bg-surface p-5 text-left text-sm">
          {order.items.map((i) => (
            <div key={`${i.productSlug}-${i.variant}`} className="flex justify-between py-1">
              <span className="text-muted-foreground">
                {i.name} – {i.variant} × {i.quantity}
              </span>
              <span>{formatPrice(i.unitPrice * i.quantity)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-border pt-2">
            <span className="text-muted-foreground">{order.deliveryName}</span>
            <span>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Payment: {order.paymentMethodName} —{" "}
            {order.paymentStatus === "awaiting_cash"
              ? "pay the rider on delivery"
              : "demo payment recorded (no money was taken)"}
            .
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="whatsapp" size="xl" className="flex-1">
            <a
              href={waLink(
                `Hi Scentlyn, I've just placed order ${order.reference}. Could you confirm it?`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
            </a>
          </Button>
          <Button asChild variant="soft" size="xl" className="flex-1">
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
