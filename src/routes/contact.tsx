import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business, waLink } from "@/lib/shop-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Scentlyn — WhatsApp, Phone & Email | Kenya" },
      {
        name: "description",
        content:
          "Talk to Scentlyn about home-care products, orders or delivery. Reach us on WhatsApp, by phone or email.",
      },
      { property: "og:title", content: "Contact Scentlyn Home Essentials" },
      { property: "og:description", content: "WhatsApp, phone or email — we're happy to help." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://scentlyn-home-essentials.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://scentlyn-home-essentials.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const details = [
    { icon: Phone, label: "Phone", value: business.phone, href: `tel:${business.phone}` },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: business.phone,
      href: waLink("Hi Scentlyn, I'd like some help choosing home-care products."),
    },
    { icon: Mail, label: "Email", value: business.email, href: `mailto:${business.email}` },
    { icon: MapPin, label: "Location", value: business.location },
    { icon: Clock, label: "Hours", value: business.hours },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-20">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Say hello
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">We're here to help</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Questions about a product, an order or delivery? Message us and we'll get back to you.
      </p>

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {details.map((d) => {
          const inner = (
            <>
              <d.icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {d.label}
                </span>
                <span className="block break-words font-medium">{d.value}</span>
              </span>
            </>
          );
          return d.href ? (
            <a
              key={d.label}
              href={d.href}
              target={d.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-card"
            >
              {inner}
            </a>
          ) : (
            <div
              key={d.label}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5"
            >
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Button asChild variant="whatsapp" size="xl">
          <a
            href={waLink("Hi Scentlyn, I'd like some help choosing home-care products.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
