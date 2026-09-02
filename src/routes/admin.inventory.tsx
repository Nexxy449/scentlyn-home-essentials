import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, PackageSearch, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

type Variant = {
  id: string;
  name: string;
  sku: string | null;
  stock_quantity: number;
  active: boolean;
  products: { name: string; slug: string } | null;
};

type Movement = {
  id: string;
  quantity_change: number;
  reason: string;
  created_at: string;
  product_variants: Variant | null;
};

function AdminInventory() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Variant | null>(null);
  const [quantityChange, setQuantityChange] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const [variantResult, movementResult] = await Promise.all([
      supabase
        .from("product_variants")
        .select("id,name,sku,stock_quantity,active,products(name,slug)")
        .order("stock_quantity", { ascending: true }),
      supabase
        .from("inventory_movements")
        .select("id,quantity_change,reason,created_at,product_variants(id,name,sku,stock_quantity,active,products(name,slug))")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const failure = variantResult.error ?? movementResult.error;
    if (failure) {
      setError(failure.message || "Unable to load inventory.");
    } else {
      setVariants((variantResult.data ?? []) as Variant[]);
      setMovements((movementResult.data ?? []) as Movement[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return variants;
    return variants.filter((variant) =>
      `${variant.products?.name ?? ""} ${variant.name} ${variant.sku ?? ""}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, variants]);

  const submitAdjustment = async () => {
    if (!selected || saving) return;

    const change = Number(quantityChange);
    if (!Number.isInteger(change) || change === 0) {
      setError("Enter a whole-number stock change other than zero.");
      return;
    }
    if (!reason.trim()) {
      setError("Provide an adjustment reason.");
      return;
    }

    setSaving(true);
    setError("");
    const { error: adjustmentError } = await supabase.rpc("admin_adjust_inventory", {
      p_variant_id: selected.id,
      p_quantity_change: change,
      p_reason: reason.trim(),
    });

    if (adjustmentError) {
      setError(adjustmentError.message || "Inventory adjustment failed.");
    } else {
      toast.success("Inventory adjusted and movement recorded.");
      setSelected(null);
      setQuantityChange("");
      setReason("");
      await load();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Catalogue</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Inventory</h2>
        <p className="mt-2 text-muted-foreground">
          Adjust stock through the audited inventory workflow. Every adjustment requires a reason.
        </p>
      </div>

      {error && <p className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Variant stock</CardTitle>
            <CardDescription>
              {loading ? "Loading inventory..." : `${filtered.length} of ${variants.length} variants`}
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product or SKU" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-sm text-muted-foreground">Loading inventory…</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-sm text-muted-foreground">No variants found.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((variant) => {
                const low = variant.stock_quantity <= 5;
                return (
                  <div key={variant.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{variant.products?.name ?? "Product"}</p>
                      <p className="text-sm text-muted-foreground">
                        {variant.name}{variant.sku ? ` · ${variant.sku}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className={low ? "inline-flex items-center gap-1 text-sm font-medium text-amber-700" : "text-sm font-medium"}>
                        {low && <AlertTriangle className="size-4" />}
                        {variant.stock_quantity <= 0 ? "Out of stock" : `${variant.stock_quantity} in stock`}
                      </span>
                      <Button type="button" size="sm" variant="outline" onClick={() => { setSelected(variant); setError(""); }}>
                        <Plus className="mr-1 size-4" /> Adjust
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Adjust {selected.products?.name ?? "variant"}</CardTitle>
            <CardDescription>{selected.name} currently has {selected.stock_quantity} units.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quantity-change">Stock change</Label>
              <Input id="quantity-change" className="mt-2" type="number" step="1" value={quantityChange} onChange={(event) => setQuantityChange(event.target.value)} placeholder="Use + for stock in, − for stock out" />
            </div>
            <div>
              <Label htmlFor="adjustment-reason">Reason</Label>
              <Textarea id="adjustment-reason" className="mt-2" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="e.g. Stock count correction or damaged units" />
            </div>
            <div className="flex gap-2">
              <Button type="button" disabled={saving} onClick={() => void submitAdjustment()}>
                {saving ? "Saving…" : "Record adjustment"}
              </Button>
              <Button type="button" variant="outline" disabled={saving} onClick={() => setSelected(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PackageSearch className="size-5" /> Recent movements</CardTitle>
          <CardDescription>Latest recorded stock adjustments and order-related movements.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading movement history…</p>
          ) : movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No inventory movements recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{movement.product_variants?.products?.name ?? "Product"} · {movement.product_variants?.name ?? "Variant"}</p>
                    <p className="text-xs text-muted-foreground">{movement.reason}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className={movement.quantity_change > 0 ? "font-medium text-emerald-700" : "font-medium text-destructive"}>
                      {movement.quantity_change > 0 ? "+" : ""}{movement.quantity_change}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(movement.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
