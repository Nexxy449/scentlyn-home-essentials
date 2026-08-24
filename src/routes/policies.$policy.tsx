import { createFileRoute, notFound } from "@tanstack/react-router";

import { policies } from "@/lib/site-content";

export const Route = createFileRoute("/policies/$policy")({
  loader: ({ params }) => {
    const policy = policies[params.policy];
    if (!policy) throw notFound();
    return { policy };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Scentlyn" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.policy.title} — Scentlyn Home Essentials`;
    const url = `https://scentlyn-home-essentials.lovable.app/policies/${params.policy}`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.policy.intro },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.policy.intro },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PolicyPage,
});

function PolicyPage() {
  const { policy } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{policy.title}</h1>
      <p className="mt-3 text-muted-foreground">{policy.intro}</p>
      <div className="mt-9 space-y-8">
        {policy.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
