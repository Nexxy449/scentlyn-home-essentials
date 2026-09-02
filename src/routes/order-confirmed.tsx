import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, MessageCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice, waLink } from "@/lib/shop-data";
import { readOrder, type Order } from "@/lib/order";
import { verifyPaystackPayment } from "@/lib/paystack";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (search: Record<string, unknown>) => ({ reference: typeof search.reference === "string" ? search.reference : undefined }),
  head: () => ({ meta: [{ title: "Order confirmation — Scentlyn" }, { name: "description", content: "Your Scentlyn order has been received." }, { name: "robots", content: "noindex" }] }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [checking, setChecking] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const { reference: paymentReference } = Route.useSearch();

  useEffect(() => {
    const saved = readOrder();
    setOrder(saved);
    setLoaded(true);

    if (!saved || saved.paymentMethod === "cod") return;
    const reference = paymentReference;
    if (!reference) return;

    let cancelled = false;
    let attempts = 0;
    const check = async () => {
      if (cancelled || attempts >= 10) return;
      attempts += 1;
      setChecking(true);
      try {
        const result = await verifyPaystackPayment({ data: { reference } });
        if (cancelled) return;
        if (result.status === "paid") {
          const next = { ...saved, paymentStatus: "paid" as const };
          setOrder(next);
          try { window.sessionStorage.setItem("scentlyn-last-order", JSON.stringify(next)); } catch {}
          setPaymentError("");
          setChecking(false);
          return;
        }
        if (result.status === "failed") {
          const next = { ...saved, paymentStatus: "failed" as const };
          setOrder(next);
          try { window.sessionStorage.setItem("scentlyn-last-order", JSON.stringify(next)); } catch {}
          setPaymentError("Paystack did not confirm the payment. If you were charged, please contact Scentlyn before trying again.");
          setChecking(false);
          return;
        }
      } catch (error) {
        if (!cancelled) setPaymentError(error instanceof Error ? error.message : "We could not verify the payment yet.");
      }
      if (!cancelled) {
        setChecking(false);
        window.setTimeout(check, 3000);
      }
    };

    void check();
    return () => { cancelled = true; };
  }, [paymentReference]);

  if (!loaded) return <div className="min-h-[50vh]" />;
  if (!order) return <div className="mx-auto max-w-md px-4 py-24 text-center"><h1 className="text-2xl font-bold">No recent order</h1><Button asChild variant="brand" size="xl" className="mt-6"><Link to="/">Back to shop</Link></Button></div>;

  const paid = order.paymentStatus === "paid";
  const failed = order.paymentStatus === "failed";
  const pendingPayment = order.paymentMethod !== "cod" && !paid && !failed;
  const title = paid ? "Payment confirmed" : failed ? "Payment not confirmed" : pendingPayment ? "Order received — payment pending" : "Order confirmed";
  const Icon = paid || order.paymentMethod === "cod" ? CheckCircle2 : failed ? XCircle : Clock3;

  return <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6"><div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card"><Icon className="mx-auto h-12 w-12 text-primary"/><h1 className="mt-4 text-2xl font-bold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">Thank you {order.customer.name.split(" ")[0]}. Your reference is <span className="font-semibold text-foreground">{order.reference}</span>.{pendingPayment?" We are checking with Paystack for payment confirmation.":failed?" Please contact Scentlyn if you believe you were charged.":" We'll call "+order.customer.phone+" to confirm delivery."}</p>{checking&&<p className="mt-2 text-xs text-muted-foreground">Checking payment status…</p>}{paymentReference&&<p className="mt-2 text-xs text-muted-foreground">Payment reference: {paymentReference}</p>}{paymentError&&<p className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{paymentError}</p>}<div className="mt-6 rounded-2xl bg-surface p-5 text-left text-sm">{order.items.map(i=><div key={`${i.productSlug}-${i.variant}`} className="flex justify-between py-1"><span className="text-muted-foreground">{i.name} – {i.variant} × {i.quantity}</span><span>{formatPrice(i.unitPrice*i.quantity)}</span></div>)}<div className="mt-2 flex justify-between border-t border-border pt-2"><span className="text-muted-foreground">{order.deliveryName}</span><span>{order.deliveryFee===0?"Free":formatPrice(order.deliveryFee)}</span></div><div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div><p className="mt-3 text-xs text-muted-foreground">Payment: {order.paymentMethodName} — {order.paymentMethod==="cod"?"pay the rider on delivery":paid?"payment confirmed":failed?"payment failed":"payment pending confirmation"}.</p></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button asChild variant="whatsapp" size="xl" className="flex-1"><a href={waLink(`Hi Scentlyn, I've just placed order ${order.reference}. Could you confirm it?`)} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4"/> Confirm on WhatsApp</a></Button><Button asChild variant="soft" size="xl" className="flex-1"><Link to="/">Continue shopping</Link></Button></div></div></div>;
}
