import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingBag, CreditCard, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const stats = [
    {
      label: "Products",
      value: "0",
      icon: Package,
    },
    {
      label: "Orders",
      value: "0",
      icon: ShoppingBag,
    },
    {
      label: "Payments",
      value: "KES 0",
      icon: CreditCard,
    },
    {
      label: "Low stock",
      value: "0",
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">SCENTLYN ADMIN</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your store, orders and payments from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Icon size={19} className="text-slate-700" />
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent orders
        </h2>

        <div className="mt-6 flex min-h-32 items-center justify-center rounded-xl border border-dashed">
          <p className="text-sm text-slate-500">
            No orders yet.
          </p>
        </div>
      </div>
    </div>
  );
}
