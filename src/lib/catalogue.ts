import { supabase } from "@/lib/supabase";
import {
  categories as presentationCategories,
  products as presentationProducts,
  type Category,
  type Product,
  type Variant,
} from "@/lib/shop-data";

type DbCategory={id:string;name:string;slug:string;description:string|null;active:boolean};
type DbVariant={id:string;name:string;sku:string;price:number;compare_at_price:number|null;stock_quantity:number;active:boolean};
type DbProduct={id:string;category_id:string;name:string;slug:string;brand:string|null;description:string|null;image_url:string|null;featured:boolean;active:boolean;product_variants:DbVariant[]|null};
export type Catalogue={categories:Category[];products:Product[]};
function productMetadata(slug:string){return presentationProducts.find(p=>p.slug===slug)}
function categoryMetadata(slug:string){return presentationCategories.find(c=>c.slug===slug)}
function mapVariant(v:DbVariant):Variant{return{label:v.name,price:Number(v.price),inStock:v.active&&v.stock_quantity>0}}
function mapProduct(p:DbProduct,categorySlug:string):Product{const m=productMetadata(p.slug);return{slug:p.slug,name:p.name,brand:p.brand??"",category:categorySlug,subcategory:m?.subcategory??"",short:p.description??m?.short??p.name,description:p.description??m?.description??"",image:p.image_url||m?.image||"",benefits:m?.benefits??[],variants:(p.product_variants??[]).filter(v=>v.active).map(mapVariant),variantLabel:m?.variantLabel??"Options",featured:p.featured,collections:m?.collections??[]}}
export async function getCatalogue():Promise<Catalogue>{const[{data:cr,error:ce},{data:pr,error:pe}]=await Promise.all([supabase.from("categories").select("id,name,slug,description,active,sort_order").eq("active",true).order("sort_order",{ascending:true}),supabase.from("products").select("id,category_id,name,slug,brand,description,image_url,featured,active,product_variants(id,name,sku,price,compare_at_price,stock_quantity,active)").eq("active",true).order("name",{ascending:true})]);if(ce)throw ce;if(pe)throw pe;const dbCategories=(cr??[])as DbCategory[];const categorySlugById=new Map(dbCategories.map(c=>[c.id,c.slug]));const categories=dbCategories.map(c=>{const m=categoryMetadata(c.slug);return{slug:c.slug,name:c.name,blurb:c.description??m?.blurb??"",image:m?.image??"",subcategories:m?.subcategories??[]}});const products=((pr??[])as DbProduct[]).map(p=>{const slug=categorySlugById.get(p.category_id);return slug?mapProduct(p,slug):null}).filter((p):p is Product=>p!==null);return{categories,products}}
export async function getProductCatalogueItem(slug:string){const catalogue=await getCatalogue();return{product:catalogue.products.find(p=>p.slug===slug)??null,catalogue}}
