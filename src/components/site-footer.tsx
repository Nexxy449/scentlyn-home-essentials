import { Link } from "@tanstack/react-router";
import { MessageCircle, Sparkles } from "lucide-react";

import { business, categories, waLink } from "@/lib/shop-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-fresh text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">Scentlyn</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {business.tagline}. Premium laundry, cleaning and home fragrance products delivered
            across Kenya.
          </p>
          <a
            href={waLink("Hi Scentlyn, I'd like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-sm font-semibold text-whatsapp-foreground"
          >
            <MessageCircle className="h-4 w-4" /> Order via WhatsApp
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$category"
                  params={{ category: c.slug }}
                  className="hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{business.phone}</li>
            <li>{business.email}</li>
            <li>{business.location}</li>
            <li>{business.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Scentlyn. Prototype store — online payments are demo only.
      </div>
    </footer>
  );
}
