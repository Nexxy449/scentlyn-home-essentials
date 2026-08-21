import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getCategory, productsInCategory, waLink } from "@/lib/shop-data";

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { name: category.name, blurb: category.blurb };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category unavailable — Scentlyn" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Scentlyn Kenya`;
    const description = `${loaderData.blurb}. Shop ${loaderData.name.toLowerCase()} products from Scentlyn with delivery across Kenya.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category: slug } = Route.useParams();
  const category = getCategory(slug)!;
  const all = productsInCategory(slug);
  const [sub, setSub] = useState<string | null>(null);
  const shown = sub ? all.filter((p) => p.subcategory === sub) : all;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mt-3">
        <h1 className="text-3xl font-extrabold md:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{category.blurb}</p>
      </header>

      {/* Subcategory filters */}
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterChip active={sub === null} onClick={() => setSub(null)} label={`All ${category.name}`} />
        {category.subcategories.map((s) => {
          const count = all.filter((p) => p.subcategory === s.slug).length;
          return (
            <FilterChip
              key={s.slug}
              active={sub === s.slug}
              onClick={() => setSub(s.slug)}
              label={count ? `${s.name} (${count})` : `${s.name} · soon`}
              muted={count === 0}
            />
          );
        })}
      </div>

      {shown.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <h2 className="font-display text-lg font-bold">Coming soon to Scentlyn</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            We're stocking this section next. Tell us what you need and we'll source it for you.
          </p>
          <Button asChild variant="whatsapp" className="mt-5">
            <a
              href={waLink(
                `Hi Scentlyn, do you stock anything in ${category.name}${sub ? ` – ${category.subcategories.find((s) => s.slug === sub)?.name}` : ""}?`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  muted,
  onClick,
}: {
  label: string;
  active: boolean;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : muted
            ? "border-border bg-background text-muted-foreground"
            : "border-border bg-background hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}
