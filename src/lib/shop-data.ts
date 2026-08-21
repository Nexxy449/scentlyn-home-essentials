import laundryImg from "@/assets/cat-laundry.jpg";
import homeCareImg from "@/assets/cat-home-care.jpg";
import scentsImg from "@/assets/cat-scents.jpg";
import bathroomImg from "@/assets/cat-bathroom.jpg";
import kitchenImg from "@/assets/cat-kitchen.jpg";
import pPods from "@/assets/p-pods.jpg";
import pLiquid from "@/assets/p-liquid.jpg";
import pSoftener from "@/assets/p-softener.jpg";
import pStain from "@/assets/p-stain.jpg";
import pBooster from "@/assets/p-booster.jpg";
import pSurface from "@/assets/p-surface.jpg";
import pCandle from "@/assets/p-candle.jpg";
import pToilet from "@/assets/p-toilet.jpg";
import pDegreaser from "@/assets/p-degreaser.jpg";

/**
 * Structured shop data.
 * Category -> Subcategory -> Product -> Variant.
 * Adding a product = adding an object here. No new route files needed.
 */

export const business = {
  name: "Scentlyn",
  tagline: "Scent • Freshness • Home Care",
  phone: "+254 712 345 678",
  whatsapp: "254712345678",
  email: "orders@scentlyn.co.ke",
  location: "Nairobi, Kenya",
  hours: "Mon – Sat: 8:00am – 7:00pm • Sun: 10:00am – 4:00pm",
};

export const formatPrice = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export const waLink = (message: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

export type Subcategory = { slug: string; name: string };

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  subcategories: Subcategory[];
};

export type Variant = {
  /** e.g. "33 Pods", "1L", "500ml", "2 x 750g" */
  label: string;
  price: number;
  inStock: boolean;
};

export type Product = {
  slug: string;
  name: string;
  brand?: string;
  category: string;
  subcategory: string;
  short: string;
  description: string;
  benefits: string[];
  image: string;
  /** the label shown above the variant selector: Size / Pack / Scent */
  variantLabel: string;
  variants: Variant[];
  featured?: boolean;
  collections?: string[];
};

export const categories: Category[] = [
  {
    slug: "laundry",
    name: "Laundry",
    blurb: "Detergents, pods, softeners & fabric care",
    image: laundryImg,
    subcategories: [
      { slug: "laundry-pods", name: "Laundry Pods" },
      { slug: "liquid-detergent", name: "Liquid Detergent" },
      { slug: "scent-boosters", name: "Scent Boosters" },
      { slug: "fabric-softeners", name: "Fabric Softeners" },
      { slug: "stain-removers", name: "Stain Removers" },
      { slug: "whites-fabric-care", name: "Whites & Fabric Care" },
      { slug: "colour-catchers", name: "Colour Catchers" },
      { slug: "machine-care", name: "Machine Care" },
      { slug: "laundry-accessories", name: "Laundry Accessories" },
    ],
  },
  {
    slug: "home-care",
    name: "Home Care",
    blurb: "Everyday cleaners for the whole home",
    image: homeCareImg,
    subcategories: [
      { slug: "household-cleaners", name: "Household Cleaners" },
      { slug: "surface-cleaners", name: "Surface Cleaners" },
      { slug: "cleaning-aids", name: "Cleaning Aids" },
      { slug: "home-maintenance", name: "Household Maintenance" },
    ],
  },
  {
    slug: "scents",
    name: "Scents",
    blurb: "Candles, diffusers & home fragrance",
    image: scentsImg,
    subcategories: [
      { slug: "scented-candles", name: "Scented Candles" },
      { slug: "air-fresheners", name: "Air Fresheners" },
      { slug: "diffusers", name: "Diffusers" },
      { slug: "linen-scents", name: "Linen Scents" },
      { slug: "wardrobe-scents", name: "Wardrobe Scents" },
    ],
  },
  {
    slug: "bathroom",
    name: "Bathroom",
    blurb: "Toilet care, cleaners & freshness",
    image: bathroomImg,
    subcategories: [
      { slug: "toilet-cleaners", name: "Toilet Cleaners" },
      { slug: "toilet-bleach", name: "Toilet Bleach" },
      { slug: "toilet-fresheners", name: "Toilet Fresheners" },
      { slug: "bathroom-cleaners", name: "Bathroom Cleaners" },
      { slug: "bathroom-scents", name: "Bathroom Scents" },
    ],
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    blurb: "Degreasers, dishwashing & surfaces",
    image: kitchenImg,
    subcategories: [
      { slug: "kitchen-cleaners", name: "Kitchen Cleaners" },
      { slug: "degreasers", name: "Degreasers" },
      { slug: "kitchen-surface-cleaners", name: "Surface Cleaners" },
      { slug: "dishwasher-products", name: "Dishwasher Products" },
      { slug: "kitchen-aids", name: "Kitchen Cleaning Aids" },
    ],
  },
];

export const products: Product[] = [
  {
    slug: "ariel-pods",
    name: "Ariel All-in-1 Pods",
    brand: "Ariel",
    category: "laundry",
    subcategory: "laundry-pods",
    short: "One pod. Deep clean, brilliant freshness.",
    description:
      "Ariel All-in-1 PODS dissolve fast in any temperature and deliver a deep clean in a single dose. No measuring, no mess — just drop a pod into the drum before your laundry.",
    benefits: [
      "Pre-measured, no spills",
      "Works in cold and hot washes",
      "Removes tough everyday stains",
      "Long lasting freshness",
    ],
    image: pPods,
    variantLabel: "Pack",
    variants: [
      { label: "22 Pods", price: 1650, inStock: true },
      { label: "33 Pods", price: 2350, inStock: true },
      { label: "50 Pods", price: 3400, inStock: true },
      { label: "58 Pods", price: 3900, inStock: false },
    ],
    featured: true,
    collections: ["best-sellers"],
  },
  {
    slug: "ariel-liquid-detergent",
    name: "Ariel Liquid Detergent",
    brand: "Ariel",
    category: "laundry",
    subcategory: "liquid-detergent",
    short: "Concentrated liquid for machine and hand wash.",
    description:
      "A concentrated liquid detergent that penetrates deep into fabric fibres to lift dirt and odours, while staying gentle on colours.",
    benefits: ["Concentrated formula", "Rinses out easily", "Colour safe", "Great for delicates"],
    image: pLiquid,
    variantLabel: "Size",
    variants: [
      { label: "1L", price: 950, inStock: true },
      { label: "2L", price: 1750, inStock: true },
      { label: "5L", price: 3900, inStock: true },
    ],
    featured: true,
    collections: ["best-sellers"],
  },
  {
    slug: "lenor-fabric-softener",
    name: "Lenor Fabric Softener",
    brand: "Lenor",
    category: "laundry",
    subcategory: "fabric-softeners",
    short: "Softer clothes, longer lasting freshness.",
    description:
      "Lenor leaves fabrics soft, easy to iron and beautifully scented. Add to the final rinse or the softener drawer.",
    benefits: ["Reduces static", "Easier ironing", "Long lasting fragrance", "Safe on all fabrics"],
    image: pSoftener,
    variantLabel: "Size",
    variants: [
      { label: "500ml", price: 620, inStock: true },
      { label: "1L", price: 1100, inStock: true },
      { label: "2L", price: 1950, inStock: true },
    ],
    featured: true,
    collections: ["best-sellers"],
  },
  {
    slug: "lenor-unstoppables",
    name: "Lenor Unstoppables Scent Booster",
    brand: "Lenor",
    category: "laundry",
    subcategory: "scent-boosters",
    short: "In-wash beads for weeks of freshness.",
    description:
      "Scent booster beads that go into the drum before laundry, layering freshness that lasts long after the wash.",
    benefits: ["Up to 12 weeks freshness", "Use with any detergent", "Small dose goes far"],
    image: pBooster,
    variantLabel: "Size",
    variants: [
      { label: "210g", price: 1250, inStock: true },
      { label: "570g", price: 2600, inStock: true },
    ],
    featured: true,
    collections: ["new-arrivals"],
  },
  {
    slug: "vanish-oxi-action",
    name: "Vanish Oxi Action Stain Remover",
    brand: "Vanish",
    category: "laundry",
    subcategory: "stain-removers",
    short: "Targets tough stains before and during the wash.",
    description:
      "Vanish Oxi Action lifts set-in stains from colours and whites. Pre-treat, soak or add a scoop to every wash.",
    benefits: ["Works on set-in stains", "Colour safe", "No harsh bleaching", "Pre-treat or in-wash"],
    image: pStain,
    variantLabel: "Size",
    variants: [
      { label: "500ml Spray", price: 890, inStock: true },
      { label: "800g Powder", price: 1450, inStock: true },
      { label: "1.5kg Powder", price: 2450, inStock: true },
    ],
    featured: true,
    collections: ["best-sellers"],
  },
  {
    slug: "colour-catcher-sheets",
    name: "Colour Catcher Sheets",
    category: "laundry",
    subcategory: "colour-catchers",
    short: "Wash colours and whites together, safely.",
    description:
      "Absorbent sheets that trap loose dye in the wash so colours don't run onto other garments. One sheet per load.",
    benefits: ["Prevents colour runs", "One sheet per load", "Saves separate washes"],
    image: pStain,
    variantLabel: "Pack",
    variants: [
      { label: "10 Sheets", price: 480, inStock: true },
      { label: "24 Sheets", price: 980, inStock: true },
    ],
  },
  {
    slug: "elbow-grease-degreaser",
    name: "Elbow Grease All Purpose Degreaser",
    brand: "Elbow Grease",
    category: "kitchen",
    subcategory: "degreasers",
    short: "Cuts through baked-on kitchen grease.",
    description:
      "A powerful all purpose degreaser for hobs, ovens, extractor hoods and worktops. Spray, wipe, done.",
    benefits: ["Removes baked-on grease", "No heavy scrubbing", "Kitchen safe", "Fast acting"],
    image: pDegreaser,
    variantLabel: "Size",
    variants: [
      { label: "500ml", price: 550, inStock: true },
      { label: "1L", price: 950, inStock: true },
    ],
    featured: true,
    collections: ["best-sellers"],
  },
  {
    slug: "multi-surface-cleaner",
    name: "Multi-Surface Cleaner",
    category: "home-care",
    subcategory: "surface-cleaners",
    short: "One cleaner for counters, tiles and appliances.",
    description:
      "Cuts through grease and soap scum on counters, sinks, tiles and appliances without leaving streaks.",
    benefits: ["Streak-free finish", "Fresh lemon scent", "Safe on most surfaces", "Everyday use"],
    image: pSurface,
    variantLabel: "Size",
    variants: [
      { label: "750ml", price: 420, inStock: true },
      { label: "5L Refill", price: 2200, inStock: true },
    ],
    featured: true,
  },
  {
    slug: "thick-bleach-toilet",
    name: "Thick Bleach Toilet Cleaner",
    category: "bathroom",
    subcategory: "toilet-bleach",
    short: "Clings, whitens and disinfects.",
    description:
      "Thick bleach that clings under the rim for effective whitening and disinfecting of toilets and sinks.",
    benefits: ["Clings to surfaces", "Kills 99.9% of germs", "Removes odours", "Economical"],
    image: pToilet,
    variantLabel: "Size",
    variants: [
      { label: "750ml", price: 320, inStock: true },
      { label: "5L", price: 1600, inStock: true },
    ],
  },
  {
    slug: "scented-candle-fresh-linen",
    name: "Scentlyn Scented Candle",
    category: "scents",
    subcategory: "scented-candles",
    short: "Hand-poured candles for a calm, fresh home.",
    description:
      "A clean-burning soy blend candle in a reusable glass jar. Choose your scent and fill a room with quiet freshness.",
    benefits: ["Up to 40 hours burn", "Soy blend wax", "Reusable glass jar"],
    image: pCandle,
    variantLabel: "Scent",
    variants: [
      { label: "Fresh Linen — 200g", price: 1450, inStock: true },
      { label: "Vanilla Bloom — 200g", price: 1450, inStock: true },
      { label: "Ocean Breeze — 350g", price: 2100, inStock: true },
    ],
    featured: true,
    collections: ["new-arrivals"],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsInCategory = (slug: string) => products.filter((p) => p.category === slug);
export const productsInSubcategory = (cat: string, sub: string) =>
  products.filter((p) => p.category === cat && p.subcategory === sub);

export const subcategoryName = (cat: string, sub: string) =>
  getCategory(cat)?.subcategories.find((s) => s.slug === sub)?.name ?? sub;

export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((p) => {
      const haystack = [
        p.name,
        p.brand ?? "",
        p.short,
        p.description,
        p.category,
        p.subcategory,
        subcategoryName(p.category, p.subcategory),
        ...p.variants.map((v) => v.label),
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((acc, t) => (haystack.includes(t) ? acc + 1 : acc), 0);
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}
