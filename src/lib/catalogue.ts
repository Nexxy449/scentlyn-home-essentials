import { supabase } from "@/lib/supabase";
import {
  categories as presentationCategories,
  products as presentationProducts,
  type Category,
  type Product,
  type Variant,
} from "@/lib/shop-data";

type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
};

type DbVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  active: boolean;
};

type DbProduct = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  product_variants: DbVariant[] | null;
};

export type Catalogue = {
  categories: Category[];
  products: Product[];
};

function productMetadata(slug: string) {
  return presentationProducts.find((product) => product.slug === slug);
}

function categoryMetadata(slug: string) {
  return presentationCategories.find((category) => category.slug === slug);
}

function mapVariant(variant: DbVariant): Variant {
  return {
    label: variant.name,
    price: Number(variant.price),
    inStock: variant.active && variant.stock_quantity > 0,
  };
}

function mapProduct(product: DbProduct, categorySlug: string): Product {
  const metadata = productMetadata(product.slug);

  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand ?? metadata?.brand ?? "",
    category: categorySlug,
    subcategory: metadata?.subcategory ?? "",
    short: metadata?.short ?? product.description ?? product.name,
    description: product.description ?? metadata?.description ?? "",
    image: metadata?.image ?? product.image_url ?? "",
    benefits: metadata?.benefits ?? [],
    variants: (product.product_variants ?? [])
      .filter((variant) => variant.active)
      .map(mapVariant),
    variantLabel: metadata?.variantLabel ?? "Options",
    featured: product.featured,
    collections: metadata?.collections ?? [],
  };
}

/**
 * Fetches the storefront catalogue from Supabase. Commerce fields come from
 * Supabase; shop-data.ts only supplies presentation metadata that has no
 * equivalent column in the current schema.
 */
export async function getCatalogue(): Promise<Catalogue> {
  const [{ data: categoryRows, error: categoryError }, { data: productRows, error: productError }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, description, active, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(
          "id, category_id, name, slug, brand, description, image_url, featured, active, product_variants(id, name, sku, price, compare_at_price, stock_quantity, active)",
        )
        .eq("active", true)
        .order("name", { ascending: true }),
    ]);

  if (categoryError) throw categoryError;
  if (productError) throw productError;

  const dbCategories = (categoryRows ?? []) as DbCategory[];
  const categorySlugById = new Map(dbCategories.map((category) => [category.id, category.slug]));

  const categories = dbCategories.map((category) => {
    const metadata = categoryMetadata(category.slug);
    return {
      slug: category.slug,
      name: category.name,
      blurb: category.description ?? metadata?.blurb ?? "",
      image: metadata?.image ?? "",
      subcategories: metadata?.subcategories ?? [],
    };
  });

  const products = ((productRows ?? []) as DbProduct[])
    .map((product) => {
      const categorySlug = categorySlugById.get(product.category_id);
      return categorySlug ? mapProduct(product, categorySlug) : null;
    })
    .filter((product): product is Product => product !== null);

  return { categories, products };
}

export async function getProductCatalogueItem(slug: string) {
  const catalogue = await getCatalogue();
  return {
    product: catalogue.products.find((product) => product.slug === slug) ?? null,
    catalogue,
  };
}
