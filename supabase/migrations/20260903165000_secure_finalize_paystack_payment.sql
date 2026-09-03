create or replace function public.finalize_paystack_payment(p_reference text)
returns table(payment_id uuid, order_id uuid, payment_status public.payment_status, order_status public.order_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.payments;
  v_order public.orders;
  v_item record;
begin
  select * into v_payment
  from public.payments
  where provider = 'paystack' and provider_transaction_id = p_reference
  for update;

  if not found then
    raise exception 'Payment not found';
  end if;

  select * into v_order from public.orders where id = v_payment.order_id for update;
  if not found then
    raise exception 'Order not found';
  end if;

  if v_payment.status = 'paid' and v_order.status = 'processing' then
    return query select v_payment.id, v_order.id, v_payment.status, v_order.status;
    return;
  end if;

  if v_payment.status = 'paid' and v_order.status <> 'pending' then
    return query select v_payment.id, v_order.id, v_payment.status, v_order.status;
    return;
  end if;

  if v_order.status <> 'pending' then
    raise exception 'Order is not awaiting payment';
  end if;

  for v_item in
    select oi.variant_id, oi.quantity, pv.stock_quantity
    from public.order_items oi
    join public.product_variants pv on pv.id = oi.variant_id
    where oi.order_id = v_order.id
    for update of pv
  loop
    if coalesce(v_item.stock_quantity, 0) < v_item.quantity then
      raise exception 'Insufficient stock to fulfil this order';
    end if;
  end loop;

  update public.product_variants pv
  set stock_quantity = pv.stock_quantity - oi.quantity,
      updated_at = now()
  from public.order_items oi
  where oi.order_id = v_order.id and oi.variant_id = pv.id;

  update public.payments
  set status = 'paid', paid_at = now(), updated_at = now()
  where id = v_payment.id;

  update public.orders
  set status = 'processing', updated_at = now()
  where id = v_order.id;

  select * into v_payment from public.payments where id = v_payment.id;
  select * into v_order from public.orders where id = v_order.id;

  return query select v_payment.id, v_order.id, v_payment.status, v_order.status;
end;
$$;

revoke execute on function public.finalize_paystack_payment(text) from public, anon, authenticated;
grant execute on function public.finalize_paystack_payment(text) to service_role;
