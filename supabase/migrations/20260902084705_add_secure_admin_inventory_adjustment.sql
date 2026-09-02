-- Applied to the connected Supabase project as migration 20260902084705.
-- Atomically updates a variant's stock and records the reason in inventory_movements.
create or replace function public.admin_adjust_inventory(
  p_variant_id uuid,
  p_quantity_change integer,
  p_reason text
)
returns public.product_variants
language plpgsql
security definer
set search_path = public
as $$
declare
  v_variant public.product_variants;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;

  if p_quantity_change = 0 then
    raise exception 'Quantity change must not be zero';
  end if;

  if coalesce(btrim(p_reason), '') = '' then
    raise exception 'An adjustment reason is required';
  end if;

  select *
  into v_variant
  from public.product_variants
  where id = p_variant_id
  for update;

  if not found then
    raise exception 'Product variant not found';
  end if;

  if v_variant.stock_quantity + p_quantity_change < 0 then
    raise exception 'Adjustment would make stock negative';
  end if;

  update public.product_variants
  set stock_quantity = stock_quantity + p_quantity_change,
      updated_at = now()
  where id = p_variant_id
  returning * into v_variant;

  insert into public.inventory_movements (variant_id, quantity_change, reason)
  values (p_variant_id, p_quantity_change, btrim(p_reason));

  return v_variant;
end;
$$;

revoke all on function public.admin_adjust_inventory(uuid, integer, text) from public;
grant execute on function public.admin_adjust_inventory(uuid, integer, text) to authenticated;
