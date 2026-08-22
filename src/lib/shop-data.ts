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
import pDish from "@/assets/p-dish.jpg";
import pDiffuser from "@/assets/p-diffuser.jpg";
import pAir from "@/assets/p-air.jpg";
import pBathroom from "@/assets/p-bathroom.jpg";

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
  {
    slug: "scentlyn-dishwashing-liquid",
    name: "Scentlyn Dishwashing Liquid",
    brand: "Scentlyn",
    category: "kitchen",
    subcategory: "kitchen-cleaners",
    short: "Rich lather that cuts grease, gentle on hands.",
    description:
      "A concentrated dishwashing liquid with a rich, long-lasting lather. Cuts through oil and food residue while staying kind to your hands.",
    benefits: ["Long lasting lather", "Cuts grease fast", "Gentle on hands", "Fresh citrus scent"],
    image: pDish,
    variantLabel: "Size",
    variants: [
      { label: "500ml", price: 280, inStock: true },
      { label: "1L", price: 480, inStock: true },
      { label: "5L Refill", price: 1950, inStock: true },
    ],
    featured: true,
    collections: ["best-sellers"],
  },
  {
    slug: "dishwasher-tablets",
    name: "All-in-1 Dishwasher Tablets",
    brand: "Finish",
    category: "kitchen",
    subcategory: "dishwasher-products",
    short: "Sparkling dishes with no pre-rinsing.",
    description:
      "Powerful all-in-one tablets with built-in rinse aid and salt action for spotless, shining dishes every cycle.",
    benefits: ["Built-in rinse aid", "No pre-rinsing needed", "Removes tough tea stains"],
    image: pDish,
    variantLabel: "Pack",
    variants: [
      { label: "20 Tablets", price: 1150, inStock: true },
      { label: "40 Tablets", price: 2050, inStock: true },
      { label: "80 Tablets", price: 3750, inStock: false },
    ],
  },
  {
    slug: "scentlyn-reed-diffuser",
    name: "Scentlyn Reed Diffuser",
    brand: "Scentlyn",
    category: "scents",
    subcategory: "diffusers",
    short: "Quiet, continuous fragrance for any room.",
    description:
      "A glass reed diffuser with natural rattan sticks that release a steady, refined scent for up to three months.",
    benefits: ["Up to 3 months of scent", "Flame free", "Refillable glass bottle"],
    image: pDiffuser,
    variantLabel: "Scent",
    variants: [
      { label: "White Tea — 100ml", price: 1750, inStock: true },
      { label: "Amber Musk — 100ml", price: 1750, inStock: true },
      { label: "Fresh Linen — 200ml", price: 2650, inStock: true },
    ],
    featured: true,
    collections: ["new-arrivals"],
  },
  {
    slug: "room-linen-mist",
    name: "Room & Linen Mist",
    brand: "Scentlyn",
    category: "scents",
    subcategory: "linen-scents",
    short: "A light spritz for beds, sofas and curtains.",
    description:
      "A fine mist that refreshes fabrics between washes. Spray onto linen, upholstery and curtains for instant freshness.",
    benefits: ["Safe on fabrics", "Neutralises odours", "Fast drying", "Travel friendly"],
    image: pAir,
    variantLabel: "Size",
    variants: [
      { label: "150ml", price: 750, inStock: true },
      { label: "300ml", price: 1250, inStock: true },
    ],
    collections: ["new-arrivals"],
  },
  {
    slug: "air-freshener-spray",
    name: "Air Freshener Spray",
    category: "scents",
    subcategory: "air-fresheners",
    short: "Instant freshness, no heavy perfume.",
    description:
      "An odour-neutralising air freshener that clears cooking and pet smells instead of masking them.",
    benefits: ["Neutralises odours", "Light clean scent", "Works in any room"],
    image: pAir,
    variantLabel: "Scent",
    variants: [
      { label: "Cotton Fresh — 300ml", price: 480, inStock: true },
      { label: "Citrus Zest — 300ml", price: 480, inStock: true },
    ],
  },
  {
    slug: "bathroom-cleaner-spray",
    name: "Bathroom Cleaner Spray",
    category: "bathroom",
    subcategory: "bathroom-cleaners",
    short: "Removes limescale and soap scum fast.",
    description:
      "A spray-on bathroom cleaner for tiles, showers, taps and basins. Dissolves limescale and soap scum with a quick wipe.",
    benefits: ["Dissolves limescale", "Shine without scrubbing", "Safe on chrome and tiles"],
    image: pBathroom,
    variantLabel: "Size",
    variants: [
      { label: "500ml Spray", price: 460, inStock: true },
      { label: "750ml Spray", price: 620, inStock: true },
    ],
    featured: true,
  },
  {
    slug: "toilet-rim-blocks",
    name: "Toilet Rim Freshener Blocks",
    category: "bathroom",
    subcategory: "toilet-fresheners",
    short: "Fresh with every flush.",
    description:
      "Rim blocks that clean, protect against limescale and release fragrance with every flush.",
    benefits: ["Fresh after every flush", "Limescale protection", "Up to 4 weeks per block"],
    image: pToilet,
    variantLabel: "Pack",
    variants: [
      { label: "Single Block", price: 260, inStock: true },
      { label: "3 Pack", price: 690, inStock: true },
    ],
  },
  {
    slug: "microfibre-cloth-set",
    name: "Microfibre Cloth Set",
    category: "home-care",
    subcategory: "cleaning-aids",
    short: "Streak-free cleaning cloths that last.",
    description:
      "Durable microfibre cloths that lift dust and grime with just water. Machine washable and reusable hundreds of times.",
    benefits: ["Streak free", "Works with just water", "Machine washable"],
    image: pBathroom,
    variantLabel: "Pack",
    variants: [
      { label: "3 Cloths", price: 390, inStock: true },
      { label: "6 Cloths", price: 690, inStock: true },
    ],
  },
  {
    slug: "washing-machine-cleaner",
    name: "Washing Machine Cleaner",
    brand: "Dr. Beckmann",
    category: "laundry",
    subcategory: "machine-care",
    short: "Descales and deodorises your machine.",
    description:
      "A deep-clean treatment that removes limescale, detergent residue and odours from the drum, hoses and seals.",
    benefits: ["Removes odours", "Descales the drum", "Use monthly", "Extends machine life"],
    image: pLiquid,
    variantLabel: "Size",
    variants: [
      { label: "250ml", price: 690, inStock: true },
      { label: "3 x 250ml", price: 1850, inStock: true },
    ],
  },
  {
    slug: "whites-brightener-powder",
    name: "Whites Brightener Powder",
    brand: "Vanish",
    category: "laundry",
    subcategory: "whites-fabric-care",
    short: "Brings dull whites back to bright.",
    description:
      "Oxygen powder that lifts greying and yellowing from whites without chlorine bleach. Soak or add to the wash.",
    benefits: ["Chlorine free", "Restores bright whites", "Soak or in-wash"],
    image: pStain,
    variantLabel: "Size",
    variants: [
      { label: "470g", price: 890, inStock: true },
      { label: "1kg", price: 1690, inStock: true },
    ],
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
