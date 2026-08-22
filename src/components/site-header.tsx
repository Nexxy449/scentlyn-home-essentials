import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { categories, formatPrice, fromPrice, searchProducts } from "@/lib/shop-data";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={logoAsset.url}
            alt="Scentlyn Laundrymart"
            className="h-9 w-auto max-w-[140px] object-contain sm:h-10 sm:max-w-[170px]"
          />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$category"
              params={{ category: c.slug }}
              className="rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
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

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <span className="font-display text-lg font-bold">Shop by category</span>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col p-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$category"
            params={{ category: c.slug }}
            onClick={onClose}
            className="flex items-center justify-between rounded-xl px-3 py-4 text-base font-semibold uppercase tracking-wide hover:bg-secondary"
          >
            {c.name}
            <span className="text-xs font-normal normal-case text-muted-foreground">{c.blurb}</span>
          </Link>
        ))}
        <Link
          to="/cart"
          onClick={onClose}
          className="mt-4 rounded-xl bg-secondary px-3 py-4 text-base font-semibold"
        >
          View cart
        </Link>
      </nav>
    </div>
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
    <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur">
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            navigate({ to: "/search", search: { q: query } });
          }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 shadow-card"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
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
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 hover:shadow-card"
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
              <span className="text-sm font-bold text-brand">from {formatPrice(fromPrice(p))}</span>
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
  );
}
