-- Launch hardening: server-owned delivery fees and atomic Paystack inventory audit.
-- Applied to the connected Supabase project as the matching production migration.

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee numeric(12,2) not null check (fee >= 0),
  eta text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.delivery_zones enable row level security;
drop policy if exists "public can view active delivery zones" on public.delivery_zones;
create policy "public can view active delivery zones" on public.delivery_zones for select to anon,authenticated using (active=true);
drop policy if exists "admins manage delivery zones" on public.delivery_zones;
create policy "admins manage delivery zones" on public.delivery_zones for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.delivery_zones to anon,authenticated;
grant all on public.delivery_zones to authenticated;

insert into public.delivery_zones(name,fee,eta,sort_order) values
('Nairobi Standard',250,'1–2 days',1),('Nairobi Same-Day Express',450,'Same day',2),('Countrywide Courier',550,'2–4 days',3),('Pickup at Scentlyn',0,'Pickup',4)
on conflict (name) do nothing;

create or replace function public.finalize_paystack_payment(p_reference text)
returns table(payment_id uuid, order_id uuid, payment_status public.payment_status, order_status public.order_status)
language plpgsql security definer set search_path = public
as $$
declare v_payment public.payments; v_order public.orders; v_item record;
begin
  select * into v_payment from public.payments where provider='paystack' and provider_transaction_id=p_reference for update;
  if not found then raise exception 'Payment not found'; end if;
  select * into v_order from public.orders where id=v_payment.order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_payment.status='paid' and v_order.status='processing' then return query select v_payment.id,v_order.id,v_payment.status,v_order.status; return; end if;
  if v_payment.status='paid' and v_order.status<>'pending' then return query select v_payment.id,v_order.id,v_payment.status,v_order.status; return; end if;
  if v_order.status<>'pending' then raise exception 'Order is not awaiting payment'; end if;
  for v_item in select oi.variant_id,oi.quantity,pv.stock_quantity from public.order_items oi join public.product_variants pv on pv.id=oi.variant_id where oi.order_id=v_order.id order by oi.variant_id for update of pv loop
    if coalesce(v_item.stock_quantity,0)<v_item.quantity then raise exception 'Insufficient stock to fulfil this order'; end if;
  end loop;
  update public.product_variants pv set stock_quantity=pv.stock_quantity-oi.quantity,updated_at=now() from public.order_items oi where oi.order_id=v_order.id and oi.variant_id=pv.id;
  insert into public.inventory_movements(variant_id,quantity_change,reason) select oi.variant_id,-oi.quantity,'Order '||v_order.order_number||' paid via Paystack' from public.order_items oi where oi.order_id=v_order.id;
  update public.payments set status='paid',paid_at=now(),updated_at=now() where id=v_payment.id;
  update public.orders set status='processing',updated_at=now() where id=v_order.id;
  return query select v_payment.id,v_order.id,'paid'::public.payment_status,'processing'::public.order_status;
end;
$$;
revoke all on function public.finalize_paystack_payment(text) from public,anon,authenticated;
grant execute on function public.finalize_paystack_payment(text) to service_role;
