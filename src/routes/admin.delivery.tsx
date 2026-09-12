import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, Truck, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/delivery")({ component: AdminDelivery });

type Zone = { id: string; name: string; fee: number; eta: string | null; active: boolean; sort_order: number };
type Draft = Omit<Zone, "id"> & { id?: string };
const empty = (): Draft => ({ name: "", fee: 0, eta: "", active: true, sort_order: 1 });

function AdminDelivery() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const { data, error: e } = await supabase.from("delivery_zones").select("id,name,fee,eta,active,sort_order").order("sort_order").order("name");
    if (e) setError(e.message); else setZones((data ?? []) as Zone[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const openNew = () => {
    setError("");
    setEditing({ ...empty(), sort_order: Math.max(0, ...zones.map(z => z.sort_order)) + 1 });
  };
  const openEdit = (zone: Zone) => {
    setError("");
    setEditing({ id: zone.id, name: zone.name, fee: Number(zone.fee), eta: zone.eta ?? "", active: zone.active, sort_order: zone.sort_order });
  };
  const save = async () => {
    if (!editing || busy) return;
    setBusy(true); setError("");
    try {
      const name = editing.name.trim();
      const fee = Number(editing.fee);
      const sortOrder = Number(editing.sort_order);
      if (!name) throw new Error("Delivery option name is required.");
      if (!Number.isFinite(fee) || fee < 0) throw new Error("Delivery fee must be 0 or more.");
      if (!Number.isInteger(sortOrder) || sortOrder < 0) throw new Error("Sort order must be a whole number of 0 or more.");
      const payload = { name, fee, eta: editing.eta?.trim() || null, active: editing.active, sort_order: sortOrder, updated_at: new Date().toISOString() };
      const result = editing.id
        ? await supabase.from("delivery_zones").update(payload).eq("id", editing.id).select("id").single()
        : await supabase.from("delivery_zones").insert(payload).select("id").single();
      if (result.error) throw result.error;
      setEditing(null); await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save delivery option.");
    } finally { setBusy(false); }
  };
  const toggle = async (zone: Zone) => {
    if (busy) return;
    setBusy(true); setError("");
    const { error: e } = await supabase.from("delivery_zones").update({ active: !zone.active, updated_at: new Date().toISOString() }).eq("id", zone.id);
    if (e) setError(e.message); else await load();
    setBusy(false);
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-medium text-muted-foreground">Commerce</p><h2 className="mt-1 text-3xl font-semibold">Delivery</h2><p className="mt-2 max-w-2xl text-muted-foreground">Control the delivery options customers can choose at checkout. Deactivation keeps historical orders intact.</p></div>
      <Button onClick={openNew}><Plus className="mr-2 size-4" />Add delivery option</Button>
    </div>
    {error && <p role="alert" className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{error}</p>}
    <Card><CardHeader><CardTitle>Delivery options</CardTitle><CardDescription>{loading ? "Loading…" : `${zones.length} configured options`}</CardDescription></CardHeader><CardContent>{loading ? <p className="py-8 text-sm text-muted-foreground">Loading delivery options…</p> : zones.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No delivery options configured.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{zones.map(zone => <div key={zone.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2 font-medium"><Truck className="size-4 text-muted-foreground" />{zone.name}</div><span className="rounded-full border px-2 py-1 text-xs">{zone.active ? "Active" : "Inactive"}</span></div><p className="mt-4 text-2xl font-semibold">KSh {Number(zone.fee).toLocaleString()}</p><p className="mt-1 text-sm text-muted-foreground">{zone.eta || "ETA not set"}</p><p className="mt-3 text-xs text-muted-foreground">Checkout order: {zone.sort_order}</p><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => openEdit(zone)}><Pencil className="mr-1 size-4" />Edit</Button><Button size="sm" variant="outline" disabled={busy} onClick={() => void toggle(zone)}>{zone.active ? "Deactivate" : "Activate"}</Button></div></div>)}</div>}</CardContent></Card>
    {editing && <Card><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{editing.id ? "Edit delivery option" : "Add delivery option"}</CardTitle><CardDescription>These values are used by checkout when calculating the delivery fee.</CardDescription></div><Button size="icon" variant="ghost" onClick={() => setEditing(null)} aria-label="Close delivery editor"><X className="size-4" /></Button></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Input aria-label="Delivery option name" placeholder="e.g. Nairobi Standard" value={editing.name} onChange={e => setEditing(d => d ? { ...d, name: e.target.value } : d)} /><Input aria-label="Delivery fee" type="number" min="0" step="1" placeholder="Fee" value={editing.fee} onChange={e => setEditing(d => d ? { ...d, fee: Number(e.target.value) } : d)} /><Input aria-label="Delivery ETA" placeholder="e.g. 1–2 days" value={editing.eta ?? ""} onChange={e => setEditing(d => d ? { ...d, eta: e.target.value } : d)} /><Input aria-label="Delivery sort order" type="number" min="0" step="1" placeholder="Sort order" value={editing.sort_order} onChange={e => setEditing(d => d ? { ...d, sort_order: Number(e.target.value) } : d)} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing(d => d ? { ...d, active: e.target.checked } : d)} /> Active at checkout</label></div><div className="flex gap-2"><Button disabled={busy} onClick={() => void save()}>{busy ? "Saving…" : "Save delivery option"}</Button><Button variant="outline" disabled={busy} onClick={() => setEditing(null)}>Cancel</Button></div></CardContent></Card>}
  </div>;
}
