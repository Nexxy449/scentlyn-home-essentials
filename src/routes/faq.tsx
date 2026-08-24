import { createFileRoute } from "@tanstack/react-router";

import { waLink } from "@/lib/shop-data";
import { faqs } from "@/lib/site-content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Ordering, Delivery & Payment | Scentlyn Kenya" },
      {
        name: "description",
        content:
          "Answers about ordering online or on WhatsApp, delivery in Kenya, payment methods and returns for Scentlyn home-care products.",
      },
      { property: "og:title", content: "Scentlyn FAQ" },
      {
        property: "og:description",
        content: "Ordering, delivery, payments and returns — answered.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://scentlyn-home-essentials.lovable.app/faq" },
    ],
    links: [{ rel: "canonical", href: "https://scentlyn-home-essentials.lovable.app/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Good to know
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Frequently asked</h1>
      <p className="mt-3 text-muted-foreground">
        Still unsure about something?{" "}
        <a
          href={waLink("Hi Scentlyn, I have a question.")}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Ask us on WhatsApp
        </a>
        .
      </p>

      <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-none focus-visible:underline">
              {f.q}
              <span
                aria-hidden
                className="shrink-0 text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
