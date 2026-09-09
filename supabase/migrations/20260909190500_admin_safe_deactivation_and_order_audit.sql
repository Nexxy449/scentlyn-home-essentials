create or replace function public.admin_set_product_active(p_product_id uuid,p_active boolean)
returns void
language plpgsql
security definer
set search_path=public
as $function$
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if not exists(select 1 from public.products where id=p_product_id) then raise exception 'Product not found'; end if;
  update public.products set active=p_active,updated_at=now() where id=p_product_id;
  if not p_active then update public.product_variants set active=false,updated_at=now() where product_id=p_product_id; end if;
end;
$function$;
grant execute on function public.admin_set_product_active(uuid,boolean) to authenticated;
revoke execute on function public.admin_set_product_active(uuid,boolean) from anon,public;

create or replace function public.admin_update_order_status(p_order_id uuid,p_status public.order_status)
returns public.order_status
language plpgsql
security definer
set search_path=public
as $function$
declare v_old public.order_status;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  select status into v_old from public.orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_old=p_status then return p_status; end if;
  if v_old='cancelled' then raise exception 'Cancelled orders cannot be reopened'; end if;
  if v_old='delivered' then raise exception 'Delivered orders cannot be changed'; end if;
  if v_old='pending' and p_status not in ('processing','dispatched','delivered','cancelled') then raise exception 'Invalid status transition'; end if;
  if v_old='processing' and p_status not in ('dispatched','delivered','cancelled') then raise exception 'Invalid status transition'; end if;
  if v_old='dispatched' and p_status not in ('delivered','cancelled') then raise exception 'Invalid status transition'; end if;
  if v_old='pending' and p_status in ('processing','dispatched','delivered') then
    if exists(select 1 from public.order_items oi join public.product_variants pv on pv.id=oi.variant_id where oi.order_id=p_order_id and pv.stock_quantity<oi.quantity) then raise exception 'Insufficient stock to fulfil this order'; end if;
    update public.product_variants pv set stock_quantity=pv.stock_quantity-oi.quantity,updated_at=now() from public.order_items oi where oi.order_id=p_order_id and oi.variant_id=pv.id;
    insert into public.inventory_movements(variant_id,order_id,quantity_change,reason) select oi.variant_id,p_order_id,-oi.quantity,'Order fulfilment' from public.order_items oi where oi.order_id=p_order_id and oi.variant_id is not null;
  elsif v_old in ('processing','dispatched') and p_status='cancelled' then
    update public.product_variants pv set stock_quantity=pv.stock_quantity+oi.quantity,updated_at=now() from public.order_items oi where oi.order_id=p_order_id and oi.variant_id=pv.id;
    insert into public.inventory_movements(variant_id,order_id,quantity_change,reason) select oi.variant_id,p_order_id,oi.quantity,'Order cancellation' from public.order_items oi where oi.order_id=p_order_id and oi.variant_id is not null;
  end if;
  if p_status='cancelled' then update public.payments set status='failed'::public.payment_status,updated_at=now() where order_id=p_order_id and status='pending'; end if;
  update public.orders set status=p_status,updated_at=now() where id=p_order_id;
  return p_status;
end;
$function$;
grant execute on function public.admin_update_order_status(uuid,public.order_status) to authenticated;

create or replace function public.admin_delete_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path=public
as $function$
declare v_status public.order_status;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  select status into v_status from public.orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_status not in ('pending','cancelled') then raise exception 'Only pending or cancelled orders can be permanently deleted'; end if;
  delete from public.orders where id=p_order_id;
end;
$function$;
grant execute on function public.admin_delete_order(uuid) to authenticated;
