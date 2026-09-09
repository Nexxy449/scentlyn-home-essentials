create or replace function public.admin_save_product(p_product jsonb, p_variants jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_product_id uuid;
  v_variant jsonb;
  v_variant_id uuid;
  v_old_stock integer;
  v_new_stock integer;
begin
  if not public.is_admin() then raise exception 'Administrator access required'; end if;
  if jsonb_typeof(p_product) <> 'object' then raise exception 'Invalid product payload'; end if;
  if jsonb_typeof(p_variants) <> 'array' or jsonb_array_length(p_variants) = 0 or jsonb_array_length(p_variants) > 100 then raise exception 'At least one variant is required'; end if;

  v_product_id := nullif(p_product->>'id','')::uuid;
  if v_product_id is null then v_product_id := gen_random_uuid(); end if;
  if coalesce(length(trim(p_product->>'name')),0) = 0 or length(trim(p_product->>'name')) > 200 then raise exception 'Product name is required'; end if;
  if coalesce(length(trim(p_product->>'slug')),0) = 0 or length(trim(p_product->>'slug')) > 200 then raise exception 'Product slug is required'; end if;

  insert into public.products(id,category_id,name,slug,brand,description,image_url,featured,active,updated_at)
  values(v_product_id,nullif(p_product->>'category_id','')::uuid,trim(p_product->>'name'),lower(trim(p_product->>'slug')),nullif(trim(p_product->>'brand'),''),nullif(trim(p_product->>'description'),''),nullif(trim(p_product->>'image_url'),''),coalesce((p_product->>'featured')::boolean,false),coalesce((p_product->>'active')::boolean,true),now())
  on conflict (id) do update set category_id=excluded.category_id,name=excluded.name,slug=excluded.slug,brand=excluded.brand,description=excluded.description,image_url=excluded.image_url,featured=excluded.featured,active=excluded.active,updated_at=now();

  for v_variant in select * from jsonb_array_elements(p_variants) loop
    v_variant_id := nullif(v_variant->>'id','')::uuid;
    if v_variant_id is null then v_variant_id := gen_random_uuid(); end if;
    if coalesce(length(trim(v_variant->>'name')),0) = 0 or length(trim(v_variant->>'name')) > 200 then raise exception 'Each variant needs a valid name'; end if;
    if (v_variant->>'price') is null or not ((v_variant->>'price') ~ '^([0-9]+(\.[0-9]+)?)$') or (v_variant->>'price')::numeric < 0 then raise exception 'Each variant needs a valid non-negative price'; end if;
    if (v_variant->>'stock_quantity') is null or not ((v_variant->>'stock_quantity') ~ '^[0-9]+$') then raise exception 'Each variant needs a valid non-negative stock quantity'; end if;
    if nullif(trim(v_variant->>'compare_at_price'),'') is not null and (not ((v_variant->>'compare_at_price') ~ '^([0-9]+(\.[0-9]+)?)$') or (v_variant->>'compare_at_price')::numeric < (v_variant->>'price')::numeric) then raise exception 'Compare-at price must be greater than or equal to the selling price'; end if;
    select stock_quantity into v_old_stock from public.product_variants where id=v_variant_id and product_id=v_product_id for update;
    v_new_stock := (v_variant->>'stock_quantity')::integer;
    insert into public.product_variants(id,product_id,name,sku,price,compare_at_price,stock_quantity,image_url,active,updated_at)
    values(v_variant_id,v_product_id,trim(v_variant->>'name'),nullif(trim(v_variant->>'sku'),''),(v_variant->>'price')::numeric,nullif(trim(v_variant->>'compare_at_price'),'')::numeric,v_new_stock,nullif(trim(v_variant->>'image_url'),''),coalesce((v_variant->>'active')::boolean,true),now())
    on conflict (id) do update set product_id=excluded.product_id,name=excluded.name,sku=excluded.sku,price=excluded.price,compare_at_price=excluded.compare_at_price,stock_quantity=excluded.stock_quantity,image_url=excluded.image_url,active=excluded.active,updated_at=now();
    if v_old_stock is not null and v_old_stock <> v_new_stock then insert into public.inventory_movements(variant_id,quantity_change,reason) values(v_variant_id,v_new_stock-v_old_stock,'Stock updated from product editor'); end if;
  end loop;

  update public.product_variants set active=false,updated_at=now() where product_id=v_product_id and id not in (select (value->>'id')::uuid from jsonb_array_elements(p_variants) value where nullif(value->>'id','') is not null);
  if not exists(select 1 from public.product_variants where product_id=v_product_id and active=true) then raise exception 'At least one active variant is required'; end if;
  return v_product_id;
exception when unique_violation then raise exception 'A product slug or SKU is already in use';
end;
$function$;

grant execute on function public.admin_save_product(jsonb,jsonb) to authenticated;
revoke execute on function public.admin_save_product(jsonb,jsonb) from anon, public;
