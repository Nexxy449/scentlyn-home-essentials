import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import logoUrl from "@/assets/logo.jpg";
import { business, waLink } from "@/lib/shop-data";
import { policyLinks } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Link to="/" className="inline-block" aria-label="Scentlyn home">
            <img src={logoUrl} alt="Scentlyn" loading="eager" width="220" height="72" className="h-16 w-auto max-w-[220px] object-contain object-left" />
          </Link>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Scent. Freshness. Home Care.</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Everything you need to keep your home clean, fresh and beautifully cared for.</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground"><li><Link to="/" className="transition-colors hover:text-foreground">Home</Link></li><li><Link to="/about" className="transition-colors hover:text-foreground">About</Link></li><li><Link to="/faq" className="transition-colors hover:text-foreground">FAQ</Link></li><li><Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link></li></ul>
          <h3 className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Policies</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">{policyLinks.map((p) => <li key={p.slug}><Link to="/policies/$policy" params={{ policy: p.slug }} className="transition-colors hover:text-foreground">{p.label}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Customer care</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground"><li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0" /><a href={`tel:${business.phone}`} className="hover:text-foreground">{business.phone}</a></li><li className="flex items-start gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0" /><a href={waLink("Hi Scentlyn, I'd like some help choosing home-care products.")} target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp us</a></li><li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0" /><a href={`mailto:${business.email}`} className="break-all hover:text-foreground">{business.email}</a></li><li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /><span>{business.location}</span></li><li className="pl-6.5 text-xs">{business.hours}</li></ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Scentlyn. All rights reserved.</div>
    </footer>
  );
}
