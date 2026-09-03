import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deliveryOptions, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/shop-data";
import { makeReference, paymentMethods, saveOrder, type PaymentMethodId } from "@/lib/order";
import { initializePaystackPayment } from "@/lib/paystack";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState(""); const [address,setAddress]=useState(""); const [notes,setNotes]=useState("");
  const [deliveryId,setDeliveryId]=useState(deliveryOptions[0]!.id); const [payment,setPayment]=useState<PaymentMethodId>("mpesa");
  const [submitting,setSubmitting]=useState(false); const [error,setError]=useState("");
  const delivery=deliveryOptions.find(d=>d.id===deliveryId)!; const total=subtotal+delivery.fee;
  const valid=!!(name.trim()&&name.trim().length<=120&&email.trim().length<=254&&email.includes("@")&&phone.trim().length>=9&&phone.trim().length<=20&&(deliveryId==="pickup"||address.trim().length<=500&&address.trim()));
  if(!items.length)return <div className="mx-auto max-w-md px-4 py-24 text-center"><h1 className="text-2xl font-bold">Nothing to check out</h1><Button asChild variant="brand" size="xl" className="mt-6"><Link to="/">Start shopping</Link></Button></div>;
  const placeOrder=async()=>{if(!valid||submitting)return;setSubmitting(true);setError("");try{
    const method=paymentMethods.find(m=>m.id===payment)!;
    const {data,error}=await supabase.rpc("create_guest_order",{p_name:name.trim(),p_phone:phone.trim(),p_address:address.trim(),p_notes:notes.trim(),p_delivery_fee:delivery.fee,p_payment_method:method.id,p_items:items.map(i=>({product_slug:i.productSlug,variant_name:i.variant,quantity:i.quantity}))});
    if(error)throw error;
    const created=Array.isArray(data)?data[0]:data; const reference=created?.order_number||makeReference(); const orderTotal=Number(created?.total??total);
    saveOrder({reference,createdAt:new Date().toISOString(),customer:{name:name.trim(),phone:phone.trim(),address:address.trim(),notes:notes.trim()},deliveryOptionId:delivery.id,deliveryName:delivery.name,deliveryFee:delivery.fee,items,subtotal,total:orderTotal,paymentMethod:method.id,paymentMethodName:method.name,paymentStatus:method.id==="cod"?"awaiting_cash":"pending"});
    if(payment!=="cod"){
      const result=await initializePaystackPayment({data:{orderNumber:reference,email:email.trim(),phone:phone.trim(),method:payment}});
      if(result.authorizationUrl){clear();window.location.assign(result.authorizationUrl);return;}
      clear();navigate({to:"/order-confirmed",search:{reference:result.reference}} as never);return;
    }
    clear();navigate({to:"/order-confirmed"});
  }catch(err){setError(err instanceof Error?err.message:"We could not place your order. Please try again.");setSubmitting(false);}};
  return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6"><h1 className="text-2xl font-bold md:text-3xl">Checkout</h1><p className="mt-1 text-sm text-muted-foreground">Guest checkout — no account, no password.</p><div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]"><div className="space-y-6"><Section title="Contact"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name"><Input value={name} maxLength={120} onChange={e=>setName(e.target.value)} placeholder="Jane Wanjiru" autoComplete="name"/></Field><Field label="Email address"><Input value={email} maxLength={254} onChange={e=>setEmail(e.target.value)} placeholder="jane@example.com" type="email" autoComplete="email"/></Field><Field label="Phone number"><Input value={phone} maxLength={20} onChange={e=>setPhone(e.target.value)} inputMode="tel" placeholder="07xx xxx xxx" autoComplete="tel"/></Field></div></Section><Section title="Delivery"><Field label="Location / address"><Textarea value={address} maxLength={500} onChange={e=>setAddress(e.target.value)} placeholder="Estate, street, building, house or office number" rows={3}/></Field><div className="mt-4 space-y-2">{deliveryOptions.map(d=><OptionRow key={d.id} selected={deliveryId===d.id} onClick={()=>setDeliveryId(d.id)} title={d.name} right={d.fee===0?"Free":formatPrice(d.fee)}/>)}</div></Section><Section title="Payment"><div className="space-y-2">{paymentMethods.map(m=><OptionRow key={m.id} selected={payment===m.id} onClick={()=>setPayment(m.id)} title={m.name} subtitle={m.id==="mpesa"?"Secure M-Pesa payment via Paystack. You will receive an STK prompt on your phone.":m.id==="card"?"Secure Visa / Mastercard checkout via Paystack.":m.description}/>)}</div></Section><Field label="Order notes (optional)"><Textarea value={notes} maxLength={1000} onChange={e=>setNotes(e.target.value)} rows={2}/></Field></div><aside className="h-fit rounded-2xl border border-border bg-surface p-5 md:sticky md:top-20"><h2 className="font-display text-lg font-bold">Order summary</h2><ul className="mt-3 space-y-3">{items.map(i=><li key={`${i.productSlug}-${i.variant}`} className="flex gap-3 text-sm"><img src={i.image} alt={i.name} className="h-12 w-12 rounded-lg object-cover"/><span className="min-w-0 flex-1"><span className="block truncate font-medium">{i.name}</span><span className="block text-muted-foreground">{i.variant} × {i.quantity}</span></span><span className="font-semibold">{formatPrice(i.unitPrice*i.quantity)}</span></li>)}</ul><div className="mt-4 space-y-1 border-t border-border pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{delivery.fee===0?"Free":formatPrice(delivery.fee)}</span></div><div className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(total)}</span></div></div>{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}<Button variant="brand" size="xl" className="mt-5 w-full" disabled={!valid||submitting} onClick={()=>void placeOrder()}>{submitting?(payment==="cod"?"Placing order…":"Starting secure payment…"):(payment==="cod"?"Place order":"Continue to secure payment")}</Button>{!valid&&<p className="mt-2 text-center text-xs text-muted-foreground">Enter a valid name, email, phone and delivery location.</p>}{payment==="mpesa"&&<p className="mt-3 text-center text-xs text-muted-foreground">Keep your phone nearby. If M-Pesa prompts you, approve the payment and wait for confirmation.</p>}</aside></div></div>;
}
function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-2xl border border-border p-5"><h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">{title}</h2>{children}</section>}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div><Label className="mb-1.5 block text-sm">{label}</Label>{children}</div>}
function OptionRow({selected,onClick,title,subtitle,right}:{selected:boolean;onClick:()=>void;title:string;subtitle?:string;right?:string}){return <button type="button" onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${selected?"border-primary bg-accent text-accent-foreground":"border-border hover:bg-secondary"}`}><span className={`h-4 w-4 shrink-0 rounded-full border-2 ${selected?"border-primary bg-primary":"border-border"}`}/><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span>{subtitle&&<span className="block text-xs text-muted-foreground">{subtitle}</span>}</span>{right&&<span className="text-sm font-medium">{right}</span>}</button>}
