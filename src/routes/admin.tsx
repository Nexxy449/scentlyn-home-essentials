import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    await navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">SCENTLYN</h1>
            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Welcome to the Admin Dashboard</h2>
          <p className="mt-1 text-slate-500">
            Manage your Scentlyn store from here.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Products"
            description="Manage products, prices and stock."
          />

          <DashboardCard
            title="Orders"
            description="View and manage customer orders."
          />

          <DashboardCard
            title="Categories"
            description="Manage your store categories."
          />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Quick access</h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              View Store
            </Link>

            <Link
              to="/admin/login"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>

      <div className="mt-5">
        <span className="text-sm font-medium text-slate-400">
          Coming next
        </span>
      </div>
    </div>
  );
}
