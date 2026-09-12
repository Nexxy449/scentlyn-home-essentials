import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { categories as presentationCategories, products as presentationProducts, type Category, type Product, type Variant } from "@/lib/shop-data";

type DbCategory = { id: string; name: string; slug: string; description: string | null; image_url?: string | null; active: boolean; sort_order?: number };
type DbVariant = { id: string; product_id: string; name: string; sku: string | null; price: number; compare_at_price: number | null; stock_quantity: number; image_url: string | null; active: boolean };
type DbProduct = { id: string; category_id: string; name: string; slug: string; brand: string | null; description: string | null; image_url: string | null; featured: boolean; active: boolean };

export type Catalogue = { categories: Category[]; products: Product[] };
const productMetadata = (slug: string) => presentationProducts.find((p) => p.slug === slug);
const categoryMetadata = (slug: string) => presentationCategories.find((c) => c.slug === slug);

function mapVariant(v: DbVariant, fallback?: Variant): Variant {
  return {
    label: v.name,
    price: Number(v.price),
    inStock: v.active && Number(v.stock_quantity) > 0,
    image: v.image_url ?? (fallback as Variant & { image?: string } | undefined)?.image,
    stockQuantity: Math.max(0, Number(v.stock_quantity)),
  } as Variant & { image?: string; stockQuantity: number };
}

function mapProduct(p: DbProduct, categorySlug: string, variants: DbVariant[]): Product {
  const m = productMetadata(p.slug);
  const fallbackVariants = m?.variants ?? [];
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand ?? "",
    category: categorySlug,
    subcategory: m?.subcategory ?? "",
    short: p.description ?? m?.short ?? p.name,
    description: p.description ?? m?.description ?? "",
    image: p.image_url || m?.image || "",
    benefits: m?.benefits ?? [],
    variants: variants.filter((v) => v.active).map((v) => {
      const fallback = fallbackVariants.find((fv) => fv.label === v.name);
      return mapVariant(v, fallback);
    }),
    variantLabel: m?.variantLabel ?? "Options",
    featured: p.featured,
    collections: m?.collections ?? [],
  };
}

function presentationCatalogue(): Catalogue {
  return { categories: presentationCategories, products: presentationProducts };
}

function mergeCategories(dbCategories: DbCategory[]): Category[] {
  const bySlug = new Map(dbCategories.map((c) => [c.slug, c]));
  const merged = presentationCategories.map((fallback) => {
    const c = bySlug.get(fallback.slug);
    const m = categoryMetadata(fallback.slug);
    return {
      slug: fallback.slug,
      name: c?.name || fallback.name,
      blurb: c?.description || m?.blurb || fallback.blurb,
      image: c?.image_url || fallback.image,
      subcategories: m?.subcategories ?? fallback.subcategories,
    };
  });

  // Preserve any additional active categories created by the admin instead of
  // dropping them just because they are not part of the original launch set.
  for (const c of dbCategories) {
    if (!merged.some((item) => item.slug === c.slug)) {
      const m = categoryMetadata(c.slug);
      merged.push({
        slug: c.slug,
        name: c.name,
        blurb: c.description ?? m?.blurb ?? "",
        image: c.image_url || m?.image || "",
        subcategories: m?.subcategories ?? [],
      });
    }
  }

  return merged;
}

export async function getCatalogue(): Promise<Catalogue> {
  if (!hasSupabaseConfig) return presentationCatalogue();

  try {
    const [{ data: cr, error: ce }, { data: pr, error: pe }] = await Promise.all([
      supabase.from("categories").select("id,name,slug,description,image_url,active,sort_order").eq("active", true).order("sort_order", { ascending: true }),
      supabase.from("products").select("id,category_id,name,slug,brand,description,image_url,featured,active").eq("active", true).order("name", { ascending: true }),
    ]);

    if (ce || pe) {
      console.error("Public catalogue query failed; using bundled storefront catalogue.", ce ?? pe);
      return presentationCatalogue();
    }

    const dbCategories = (cr ?? []) as DbCategory[];
    const dbProducts = (pr ?? []) as DbProduct[];
    const categorySlugById = new Map(dbCategories.map((c) => [c.id, c.slug]));
    const categories = mergeCategories(dbCategories);

    const productIds = dbProducts.map((p) => p.id);
    let variants: DbVariant[] = [];
    let variantsReadFailed = false;

    if (productIds.length) {
      const { data, error } = await supabase.from("product_variants").select("id,product_id,name,sku,price,compare_at_price,stock_quantity,image_url,active").in("product_id", productIds);
      if (error) {
        console.error("Public product variant query failed; using bundled variants where needed.", error);
        variantsReadFailed = true;
      } else {
        variants = (data ?? []) as DbVariant[];
      }
    }

    const variantsByProduct = new Map<string, DbVariant[]>();
    for (const v of variants) variantsByProduct.set(v.product_id, [...(variantsByProduct.get(v.product_id) ?? []), v]);

    const products = dbProducts.map((p) => {
      const metadata = productMetadata(p.slug);
      const slug = categorySlugById.get(p.category_id) ?? metadata?.category;
      if (!slug) return null;
      const dbVariants = variantsByProduct.get(p.id) ?? [];
      if (variantsReadFailed || dbVariants.length === 0) {
        return mapProduct(p, slug, (metadata?.variants ?? []).map((v, index) => ({
          id: `bundled-${p.id}-${index}`,
          product_id: p.id,
          name: v.label,
          sku: null,
          price: v.price,
          compare_at_price: null,
          stock_quantity: v.inStock ? 1 : 0,
          image_url: (v as Variant & { image?: string }).image ?? null,
          active: true,
        })));
      }
      return mapProduct(p, slug, dbVariants);
    }).filter((p): p is Product => p !== null);

    return { categories, products };
  } catch (error) {
    console.error("Public catalogue load failed; using bundled storefront catalogue.", error);
    return presentationCatalogue();
  }
}

export async function getProductCatalogueItem(slug: string) {
  const catalogue = await getCatalogue();
  return { product: catalogue.products.find((p) => p.slug === slug) ?? null, catalogue };
}
