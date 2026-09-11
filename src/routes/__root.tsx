import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext, useLocation, useRouter } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import "../scentlyn-typography.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { CartProvider } from "@/lib/cart";
import { reportLovableError } from "@/lib/lovable-error-reporting";

function NotFoundComponent() {
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Scentlyn</p><h1 className="mt-3 font-display text-6xl font-bold text-foreground">404</h1><h2 className="mt-3 font-display text-2xl font-bold text-foreground">We couldn't find that page</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">The page may have moved, but there is plenty of fresh home care to explore.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/shop" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Shop the range</Link><Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Back home</Link></div></div></div>;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error); const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Scentlyn</p><h1 className="mt-3 font-display text-2xl font-bold text-foreground">Something went wrong</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">We couldn't load this page. Please try again or return to the shop.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={() => { router.invalidate(); reset(); }} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Try again</button><Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Go home</Link></div></div></div>;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Scentlyn Home Essentials — Scent, Freshness & Home Care" },
      { name: "description", content: "Laundry, home-care and fragrance essentials for homes across Kenya. Shop Scentlyn's curated range online." },
      { name: "author", content: "Scentlyn Home Essentials" },
      { property: "og:type", content: "website" }, { property: "og:site_name", content: "Scentlyn Home Essentials" },
      { property: "og:title", content: "Scentlyn Home Essentials" }, { property: "og:description", content: "Laundry, home-care and fragrance essentials for homes across Kenya." },
      { property: "og:image", content: "/og-image.jpg" }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: "Scentlyn Home Essentials" }, { name: "twitter:description", content: "Laundry, home-care and fragrance essentials for homes across Kenya." }, { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600&family=Sora:wght@500;600;700;800&display=swap" },
      { rel: "icon", href: "/favicon.png", type: "image/png" }, { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell, component: RootComponent, notFoundComponent: NotFoundComponent, errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() {
  const { queryClient } = Route.useRouteContext(); const location = useLocation(); const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  return <QueryClientProvider client={queryClient}><CartProvider>{isAdminRoute ? <><main className="min-h-screen"><Outlet /></main><Toaster position="top-center" /></> : <div className="flex min-h-screen flex-col bg-background"><a href="#main-content" className="sr-only z-[100] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Skip to content</a><SiteHeader /><main id="main-content" className="flex-1"><Outlet /></main><SiteFooter /><WhatsappFab /><Toaster position="top-center" /></div>}</CartProvider></QueryClientProvider>;
}
