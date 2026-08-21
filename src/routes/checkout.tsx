import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deliveryOptions, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/shop-data";
import { makeReference, paymentMethods, saveOrder, type PaymentMethodId } from "@/lib/order";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Scentlyn" },
      {
        name: "description",
        content: "Fast guest checkout. No account needed. Delivery across Kenya.",
      },
      { property: "og:title", content: "Checkout — Scentlyn" },
      { property: "og:description", content: "Fast guest checkout, no account needed." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryId, setDeliveryId] = useState(deliveryOptions[0]!.id);
  const [payment, setPayment] = useState<PaymentMethodId>("mpesa");

  const delivery = deliveryOptions.find((d) => d.id === deliveryId)!;
  const total = subtotal + delivery.fee;
  const valid = name.trim() && phone.trim() && (deliveryId === "pickup" || address.trim());

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <Button asChild variant="brand" size="xl" className="mt-6">
          <Link to="/">Start shopping</Link>
        </Button>
      </div>
    );
  }

  const placeOrder = () => {
    const method = paymentMethods.find((m) => m.id === payment)!;
    const reference = makeReference();
    saveOrder({
      reference,
      createdAt: new Date().toISOString(),
      customer: { name, phone, address, notes },
      deliveryOptionId: delivery.id,
      deliveryName: delivery.name,
      deliveryFee: delivery.fee,
      items,
      subtotal,
      total,
      paymentMethod: method.id,
      paymentMethodName: method.name,
      paymentStatus: method.id === "cod" ? "awaiting_cash" : "demo_paid",
    });
    clear();
    navigate({ to: "/order-confirmed" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold md:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Guest checkout — no account, no password.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Section title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wanjiru" />
              </Field>
              <Field label="Phone number">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="07xx xxx xxx"
                />
              </Field>
            </div>
          </Section>

          <Section title="Delivery">
            <Field label="Location / address">
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Estate, street, building, house or office number"
                rows={3}
              />
            </Field>
            <div className="mt-4 space-y-2">
              {deliveryOptions.map((d) => (
                <OptionRow
                  key={d.id}
                  selected={deliveryId === d.id}
                  onClick={() => setDeliveryId(d.id)}
                  title={d.name}
                  right={d.fee === 0 ? "Free" : formatPrice(d.fee)}
                />
              ))}
            </div>
          </Section>

          <Section title="Payment">
            <div className="space-y-2">
              {paymentMethods.map((m) => (
                <OptionRow
                  key={m.id}
                  selected={payment === m.id}
                  onClick={() => setPayment(m.id)}
                  title={m.name}
                  subtitle={m.description}
                  right={m.live ? undefined : "Demo"}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Online payments are not connected yet. M-Pesa and card orders are recorded as demo
              payments and our team will confirm with you directly.
            </p>
          </Section>

          <Field label="Order notes (optional)">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </Field>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-border bg-surface p-5 md:sticky md:top-20">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <ul className="mt-3 space-y-3">
            {items.map((i) => (
              <li key={`${i.productSlug}-${i.variant}`} className="flex gap-3 text-sm">
                <img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{i.name}</span>
                  <span className="block text-muted-foreground">
                    {i.variant} × {i.quantity}
                  </span>
                </span>
                <span className="font-semibold">{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{delivery.fee === 0 ? "Free" : formatPrice(delivery.fee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button
            variant="brand"
            size="xl"
            className="mt-5 w-full"
            disabled={!valid}
            onClick={placeOrder}
          >
            Place order
          </Button>
          {!valid && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Add your name, phone and delivery location.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
    </div>
  );
}

function OptionRow({
  selected,
  onClick,
  title,
  subtitle,
  right,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  right?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-secondary"
      }`}
    >
      <span
        className={`h-4 w-4 shrink-0 rounded-full border-2 ${
          selected ? "border-primary bg-primary" : "border-border"
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        {subtitle && <span className="block text-xs text-muted-foreground">{subtitle}</span>}
      </span>
      {right && <span className="text-sm font-medium">{right}</span>}
    </button>
  );
}
