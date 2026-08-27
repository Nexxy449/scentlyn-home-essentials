import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Boxes, CreditCard, FolderTree, LayoutDashboard, LogOut, Menu, Package, ReceiptText, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) throw redirect({ to: "/admin/login" });
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
    if (adminError || !isAdmin) {
      await supabase.auth.signOut({ scope: "local" });
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminDashboard,
});

type NavigationItem = { label: string; icon: typeof LayoutDashboard; description: string };
const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, description: "Store overview" },
  { label: "Products", icon: Package, description: "Catalogue management coming soon" },
  { label: "Categories", icon: FolderTree, description: "Category management coming soon" },
  { label: "Orders", icon: ReceiptText, description: "Order management coming soon" },
  { label: "Customers", icon: Users, description: "Customer management coming soon" },
  { label: "Payments", icon: CreditCard, description: "Payment records coming soon" },
];

type Overview = { products: number; categories: number; orders: number; revenue: number; loading: boolean; error: string };

function AdminDashboard() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [overview, setOverview] = useState<Overview>({ products: 0, categories: 0, orders: 0, revenue: 0, loading: true, error: "" });

  useEffect(() => {
    let cancelled = false;
    async function loadOverview() {
      const [products, categories, orders, payments] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount, status"),
      ]);
      const firstError = products.error || categories.error || orders.error || payments.error;
      if (cancelled) return;
      if (firstError) {
        setOverview((current) => ({ ...current, loading: false, error: "Unable to load dashboard data." }));
        return;
      }
      const revenue = (payments.data ?? [])
        .filter((payment) => payment.status === "paid")
        .reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
      setOverview({ products: products.count ?? 0, categories: categories.count ?? 0, orders: orders.count ?? 0, revenue, loading: false, error: "" });
    }
    loadOverview();
    return () => { cancelled = true; };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) { setLogoutError("Unable to sign out. Please try again."); setLoggingOut(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { setLogoutError("Unable to clear the session. Please try again."); setLoggingOut(false); return; }
    await navigate({ to: "/admin/login", replace: true });
  }

  function selectSection(label: string) { setActiveSection(label); setMobileMenuOpen(false); }

  const overviewCards = [
    { title: "Products", value: overview.products, description: "Products in catalogue", icon: Package },
    { title: "Categories", value: overview.categories, description: "Categories in catalogue", icon: FolderTree },
    { title: "Orders", value: overview.orders, description: "Orders recorded", icon: ReceiptText },
    { title: "Revenue", value: `KSh ${overview.revenue.toLocaleString()}`, description: "Paid payments recorded", icon: CreditCard },
  ];

  return <div className="min-h-screen bg-muted/30 text-foreground">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background lg:flex lg:flex-col"><SidebarContent activeSection={activeSection} onSelect={selectSection} /></aside>
    {mobileMenuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-foreground/20" onClick={() => setMobileMenuOpen(false)} /><aside className="relative flex h-full w-[min(20rem,85vw)] flex-col border-r bg-background shadow-xl"><div className="flex items-center justify-end p-3"><Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"><X className="size-5" /></Button></div><SidebarContent activeSection={activeSection} onSelect={selectSection} /></aside></div>}
    <div className="lg:pl-72"><header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur"><div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation"><Menu className="size-5" /></Button><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Scentlyn Laundrymart</p><h1 className="font-display text-lg font-semibold">Admin Dashboard</h1></div></div><div className="flex flex-col items-end gap-1"><Button variant="outline" onClick={handleLogout} disabled={loggingOut} className="gap-2"><LogOut className="size-4" /><span>{loggingOut ? "Signing out..." : "Logout"}</span></Button>{logoutError && <p className="text-xs text-destructive">{logoutError}</p>}</div></div></header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Badge variant="secondary">Phase 1 · Read-only</Badge><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Welcome back</h2><p className="mt-2 max-w-2xl text-muted-foreground">Live overview data from your Scentlyn Supabase project. Management actions remain disabled until the read-only connection is verified.</p></div><Button asChild variant="outline" className="w-full sm:w-auto"><Link to="/">View storefront</Link></Button></div>{overview.error && <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{overview.error}</div>}<section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{overviewCards.map((card) => { const Icon = card.icon; return <Card key={card.title} className="shadow-sm"><CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0"><div><CardTitle className="text-base">{card.title}</CardTitle><CardDescription className="mt-2">{card.description}</CardDescription></div><div className="rounded-lg border bg-muted/50 p-2 text-muted-foreground"><Icon className="size-5" /></div></CardHeader><CardContent><p className="text-2xl font-semibold">{overview.loading ? "—" : card.value}</p><Badge variant="outline" className="mt-2">Read only</Badge></CardContent></Card>; })}</section><section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]"><Card className="shadow-sm"><CardHeader><CardTitle>Admin workspace</CardTitle><CardDescription>Management modules will be connected only after this read-only layer is verified.</CardDescription></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{navigationItems.slice(1).map((item) => { const Icon = item.icon; const isActive = activeSection === item.label; return <button key={item.label} type="button" onClick={() => selectSection(item.label)} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/60 ${isActive ? "border-primary/40 bg-primary/5" : "bg-background"}`}><Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" /><span><span className="block font-medium">{item.label}</span><span className="mt-1 block text-sm text-muted-foreground">Read-only connection next</span></span></button>; })}</CardContent></Card><Card className="shadow-sm"><CardHeader><CardTitle>Current section</CardTitle><CardDescription>No write operations are enabled.</CardDescription></CardHeader><CardContent><div className="rounded-xl border border-dashed p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-muted p-2"><Boxes className="size-5" /></div><div><p className="font-medium">{activeSection}</p><p className="text-sm text-muted-foreground">Read-only phase</p></div></div><p className="mt-4 text-sm text-muted-foreground">This stage only reads approved dashboard data. Products, orders, customers and payments cannot be modified from here.</p></div></CardContent></Card></section></main></div>
  </div>;
}

function SidebarContent({ activeSection, onSelect }: { activeSection: string; onSelect: (label: string) => void }) {
  return <div className="flex min-h-0 flex-1 flex-col px-4 pb-6"><div className="flex items-center gap-3 px-2 py-6"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><span className="font-display text-sm font-bold">S</span></div><div><p className="font-display font-semibold tracking-tight">SCENTLYN</p><p className="text-xs text-muted-foreground">Laundrymart Admin</p></div></div><nav className="space-y-1" aria-label="Admin navigation">{navigationItems.map((item) => { const Icon = item.icon; const isActive = activeSection === item.label; return <button key={item.label} type="button" onClick={() => onSelect(item.label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-5" />{item.label}{item.label !== "Dashboard" && <Badge variant="secondary" className="ml-auto text-[10px]">Soon</Badge>}</button>; })}</nav><div className="mt-auto border-t px-2 pt-5"><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Phase 1</p><p className="mt-2 text-sm text-muted-foreground">Read-only dashboard connection. Management modules remain disabled.</p></div></div>;
}
