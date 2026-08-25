import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import logoUrl from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { categories, formatPrice, fromPrice, searchProducts } from "@/lib/shop-data";

const pages = [
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <p className="bg-brand py-2 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-brand-foreground">
        Scent • Freshness • Home Care
      </p>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex shrink-0 items-center" aria-label="Scentlyn home">
          <img
            src={logoUrl}
            alt="Scentlyn Home Essentials"
            width={360}
            height={360}
            fetchPriority="high"
            decoding="async"
            className="h-9 w-auto max-w-[132px] object-contain sm:h-11 sm:max-w-[170px]"
          />

        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="Main">
          <Link
            to="/shop"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "bg-secondary text-foreground" }}
          >
            Shop
          </Link>
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-haspopup="true"
            >
              Categories <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-0 top-full w-60 translate-y-1 rounded-2xl border border-border bg-popover p-2 opacity-0 shadow-lift transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$category"
                  params={{ category: c.slug }}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {c.name}
                  <span className="block text-xs font-normal text-muted-foreground">{c.blurb}</span>
                </Link>
              ))}
            </div>
          </div>
          {pages.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <Portal>
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background md:hidden">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <span className="font-display text-lg font-bold">Menu</span>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col p-4 pb-12">
        <Link
          to="/shop"
          onClick={onClose}
          className="rounded-xl px-3 py-4 text-base font-semibold hover:bg-secondary"
        >
          Shop all
        </Link>
        <span className="mt-4 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Categories
        </span>
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$category"
            params={{ category: c.slug }}
            onClick={onClose}
            className="rounded-xl px-3 py-3.5 text-base font-semibold hover:bg-secondary"
          >
            {c.name}
            <span className="block text-xs font-normal text-muted-foreground">{c.blurb}</span>
          </Link>
        ))}
        <span className="mt-4 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          More
        </span>
        {pages.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            onClick={onClose}
            className="rounded-xl px-3 py-3.5 text-base font-semibold hover:bg-secondary"
          >
            {p.label}
          </Link>
        ))}
        <Link
          to="/cart"
          onClick={onClose}
          className="mt-5 rounded-xl bg-secondary px-3 py-4 text-center text-base font-semibold"
        >
          View cart
        </Link>
      </nav>
    </div>
    </Portal>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = searchProducts(query).slice(0, 6);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Portal>
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            navigate({ to: "/search", search: { q: query } });
          }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 shadow-card"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ariel, Vanish, Lenor, candles…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {query && results.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No products match “{query}”. Try a brand name or a category.
            </p>
          )}
          {results.map((p) => (
            <Link
              key={p.slug}
              to="/product/$slug"
              params={{ slug: p.slug }}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 transition-shadow hover:shadow-card"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-14 w-14 rounded-lg object-cover"
                loading="lazy"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{p.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {p.variants.map((v) => v.label).join(" • ")}
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold text-brand">
                from {formatPrice(fromPrice(p))}
              </span>
            </Link>
          ))}
          {query && results.length > 0 && (
            <Button
              variant="soft"
              className="w-full"
              onClick={() => {
                onClose();
                navigate({ to: "/search", search: { q: query } });
              }}
            >
              See all results
            </Button>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
