-- Align the admin/storefront catalogue to the approved four top-level categories:
-- Laundry, Kitchen, Toiletries, Fragrance.
-- Existing product rows keep their category IDs; bathroom products are moved into Toiletries.

UPDATE public.products
SET category_id = (
  SELECT id FROM public.categories WHERE slug = 'home-care' LIMIT 1
)
WHERE category_id = (
  SELECT id FROM public.categories WHERE slug = 'bathroom' LIMIT 1
);

UPDATE public.categories
SET name = 'Toiletries',
    slug = 'toiletries',
    sort_order = 3,
    updated_at = now()
WHERE slug = 'home-care';

UPDATE public.categories
SET name = 'Fragrance',
    slug = 'fragrance',
    sort_order = 4,
    updated_at = now()
WHERE slug = 'scents';

UPDATE public.categories
SET sort_order = 2,
    updated_at = now()
WHERE slug = 'kitchen';

UPDATE public.categories
SET active = false,
    sort_order = 99,
    updated_at = now()
WHERE slug = 'bathroom';
