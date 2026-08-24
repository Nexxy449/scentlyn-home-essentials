import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { business, waLink } from "@/lib/shop-data";
import lifeBedroom from "@/assets/life-bedroom.jpg";
import lifeLaundry from "@/assets/life-laundry.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Scentlyn — Scent, Freshness & Home Care in Kenya" },
      {
        name: "description",
        content:
          "Scentlyn is a modern home-care brand built around scent, freshness and everyday care — laundry, cleaning and home fragrance essentials in Kenya.",
      },
      { property: "og:title", content: "About Scentlyn Home Essentials" },
      {
        property: "og:description",
        content: "A modern home-care brand built around scent, freshness and everyday care.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://scentlyn-home-essentials.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://scentlyn-home-essentials.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Scent • Freshness • Home Care
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">
              We care about how home feels.
            </h1>
            <p className="mt-5 text-muted-foreground md:text-lg">
              Scentlyn started with a simple belief: a home should feel as good as it looks. Clean
              fabrics, fresh rooms and a scent you're happy to come back to.
            </p>
            <p className="mt-4 text-muted-foreground">
              We bring together laundry, cleaning and home fragrance essentials — the trusted brands
              people already love, alongside our own growing Scentlyn collection — and we make them
              easy to order, whether that's online or over a quick WhatsApp chat.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-lift">
            <img
              src={lifeBedroom}
              alt="A calm, freshly made bed in soft morning light"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="order-2 overflow-hidden rounded-3xl md:order-1">
            <img
              src={lifeLaundry}
              alt="Freshly washed white linen folded in a basket"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-display text-2xl font-bold md:text-3xl">What we believe</h2>
            <ul className="mt-6 space-y-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Home care should be enjoyable.</strong> The
                right products turn a chore into something quietly satisfying.
              </li>
              <li>
                <strong className="text-foreground">Scent is part of clean.</strong> Freshness is
                something you notice the moment you walk through the door.
              </li>
              <li>
                <strong className="text-foreground">Ordering should be easy.</strong> Shop online or
                message us — whichever suits your day.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg">
                <Link to="/shop">Shop home essentials</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={waLink("Hi Scentlyn, I'd like some help choosing home-care products.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat with us
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {business.location} · {business.hours}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
