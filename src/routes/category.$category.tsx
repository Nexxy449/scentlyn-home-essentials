import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { getCatalogue } from "@/lib/catalogue";
import { waLink } from "@/lib/shop-data";

export const Route = createFileRoute("/category/$category")({
  loader: async ({ params }) => { const catalogue = await getCatalogue(); const category = catalogue.categories.find((c) => c.slug === params.category); if (!category) throw notFound(); return { category, products: catalogue.products.filter((p) => p.category === params.category) }; },
  head: ({ loaderData }) => { if (!loaderData) return { meta: [{ title: "Category unavailable — Scentlyn" }, { name: "robots", content: "noindex" }] }; const title = `${loaderData.category.name} — Scentlyn Kenya`; return { meta: [{ title }, { name: "description", content: `Shop ${loaderData.category.name.toLowerCase()} essentials from Scentlyn with delivery across Kenya.` }] }; },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-surface/70">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-muted-foreground"><Link to="/" className="transition-colors hover:text-brand">Home</Link><span className="mx-2 text-border">/</span><span className="text-foreground">{category.name}</span></nav>
          <div className="mt-7"><p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">Shop {category.name}</p><h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{category.name}</h1></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-border/60 pb-5"><p className="text-sm text-muted-foreground">{products.length} {products.length === 1 ? "product" : "products"}</p><Link to="/shop" className="text-sm font-semibold text-brand transition-colors hover:text-primary hover:underline">View all</Link></div>
        {products.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 pt-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">{products.map((p) => <ProductCard key={p.slug} product={p} />)}</div> : <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface p-12 text-center"><h2 className="font-display text-xl font-bold text-foreground">Coming soon to Scentlyn</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">We are stocking this collection next. Tell us what you need and we can help source it for you.</p><a href={waLink(`Hi Scentlyn, do you stock anything in ${category.name}?`)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">Ask on WhatsApp</a></div>}
      </section>
    </div>
  );
}
