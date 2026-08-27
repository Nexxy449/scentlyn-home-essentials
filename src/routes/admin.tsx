import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
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
  component: AdminRoute,
});

function AdminRoute() {
  const location = useLocation();
  if (location.pathname === "/admin/login") return <Outlet />;
  return <AdminDashboard />;
}

type NavigationItem = { label: string; icon: typeof LayoutDashboard; description: string };
const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, description: "Store overview" },
  { label: "Products", icon: Package, description: "Catalogue management coming soon" },
  { label: "Categories", icon: FolderTree, description: "Category management coming soon" },
  { label: "Orders", icon: ReceiptText, description: "Order management coming soon" },
  { label: "Customers", icon: Users, description: "Customer management coming soon" },
  { label: "Payments", icon: CreditCard, description: "Payment records coming soon" },
];
type Overview = { products:number; categories:number; orders:number; revenue:number; loading:boolean; error:string };

function AdminDashboard() {
  const navigate = useNavigate(); const [loggingOut,setLoggingOut]=useState(false); const [logoutError,setLogoutError]=useState(""); const [mobileMenuOpen,setMobileMenuOpen]=useState(false); const [activeSection,setActiveSection]=useState("Dashboard"); const [overview,setOverview]=useState<Overview>({products:0,categories:0,orders:0,revenue:0,loading:true,error:""});
  useEffect(()=>{let cancelled=false; async function load(){const {data:{session},error}=await supabase.auth.getSession();if(cancelled)return;if(error||!session){setOverview(c=>({...c,loading:false,error:"Your admin session could not be loaded. Please sign in again."}));return} const [products,categories,orders,payments]=await Promise.all([supabase.from("products").select("id",{count:"exact",head:true}),supabase.from("categories").select("id",{count:"exact",head:true}),supabase.from("orders").select("id",{count:"exact",head:true}),supabase.from("payments").select("amount,status")]);if(cancelled)return;const failed=[products.error,categories.error,orders.error,payments.error].find(Boolean);if(failed){setOverview(c=>({...c,loading:false,error:"Unable to load dashboard data."}));return}const revenue=(payments.data??[]).filter(p=>p.status==="paid").reduce((s,p)=>s+Number(p.amount??0),0);setOverview({products:products.count??0,categories:categories.count??0,orders:orders.count??0,revenue,loading:false,error:""})}void load();return()=>{cancelled=true}},[]);
  useEffect(()=>{const {data}=supabase.auth.onAuthStateChange(event=>{if(event==="SIGNED_OUT")void navigate({to:"/admin/login",replace:true})});return()=>data.subscription.unsubscribe()},[navigate]);
  async function handleLogout(){if(loggingOut)return;setLoggingOut(true);setLogoutError("");try{const {error}=await supabase.auth.signOut({scope:"local"});if(error)throw error;const {data:{session}}=await supabase.auth.getSession();if(session)throw new Error("Session still active");await navigate({to:"/admin/login",replace:true})}catch{setLogoutError("Unable to sign out. Please try again.")}finally{setLoggingOut(false)}}
  const cards=[{title:"Products",value:overview.products,description:"Products in catalogue",icon:Package},{title:"Categories",value:overview.categories,description:"Categories in catalogue",icon:FolderTree},{title:"Orders",value:overview.orders,description:"Orders recorded",icon:ReceiptText},{title:"Revenue",value:`KSh ${overview.revenue.toLocaleString()}`,description:"Paid payments recorded",icon:CreditCard}];
  return <div className="min-h-screen bg-muted/30 text-foreground"><aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background lg:flex lg:flex-col"><SidebarContent activeSection={activeSection} onSelect={l=>{setActiveSection(l);setMobileMenuOpen(false)}} /></aside>{mobileMenuOpen&&<div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-foreground/20" onClick={()=>setMobileMenuOpen(false)}/><aside className="relative flex h-full w-[min(20rem,85vw)] flex-col border-r bg-background"><SidebarContent activeSection={activeSection} onSelect={l=>{setActiveSection(l);setMobileMenuOpen(false)}}/></aside></div>}<div className="lg:pl-72"><header className="sticky top-0 z-30 border-b bg-background"><div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setMobileMenuOpen(true)} aria-label="Open navigation"><Menu className="size-5"/></Button><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Scentlyn Laundrymart</p><h1 className="font-display text-lg font-semibold">Admin Dashboard</h1></div></div><div><Button variant="outline" onClick={handleLogout} disabled={loggingOut} className="gap-2"><LogOut className="size-4"/>{loggingOut?"Signing out...":"Logout"}</Button>{logoutError&&<p className="mt-1 text-xs text-destructive">{logoutError}</p>}</div></div></header><main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><Badge variant="secondary">Phase 1 · Read-only</Badge><h2 className="mt-3 font-display text-3xl font-semibold">Welcome back</h2><p className="mt-2 text-muted-foreground">Live overview data from your Scentlyn Supabase project.</p>{overview.error&&<div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{overview.error}</div>}<section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card=>{const Icon=card.icon;return <Card key={card.title}><CardHeader className="flex flex-row justify-between"><div><CardTitle>{card.title}</CardTitle><CardDescription>{card.description}</CardDescription></div><Icon className="size-5"/></CardHeader><CardContent><p className="text-2xl font-semibold">{overview.loading?"—":card.value}</p></CardContent></Card>})}</section><Button asChild variant="outline" className="mt-8"><Link to="/">View storefront</Link></Button></main></div></div>;
}
function SidebarContent({activeSection,onSelect}:{activeSection:string;onSelect:(label:string)=>void}){return <div className="flex flex-1 flex-col px-4 pb-6"><div className="px-2 py-6"><p className="font-display font-semibold">SCENTLYN</p><p className="text-xs text-muted-foreground">Laundrymart Admin</p></div><nav className="space-y-1">{navigationItems.map(item=>{const Icon=item.icon;return <button key={item.label} onClick={()=>onSelect(item.label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${activeSection===item.label?"bg-primary text-primary-foreground":"hover:bg-muted"}`}><Icon className="size-5"/>{item.label}</button>})}</nav></div>}
