import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const inputSchema = z.object({
  orderNumber: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(9),
  method: z.enum(["mpesa", "card"]),
});

const verifySchema = z.object({ reference: z.string().min(1) });

type PaystackResponse = {
  status?: boolean;
  message?: string;
  data?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
    status?: string;
    display_text?: string;
    amount?: number;
    currency?: string;
  };
};

function env(name: string) {
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

function normalizeKenyanPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  return `+254${digits}`;
}

function adminSupabase() {
  const url = env("SUPABASE_URL") ?? env("VITE_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Server payment configuration is incomplete.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function paystackRequest(path: string, body: Record<string, unknown>) {
  const secret = env("PAYSTACK_SECRET_KEY");
  if (!secret) throw new Error("Paystack is not configured yet. Add PAYSTACK_SECRET_KEY on the server.");
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as PaystackResponse;
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || "Paystack could not process the payment request.");
  }
  return payload;
}

async function paystackGet(path: string) {
  const secret = env("PAYSTACK_SECRET_KEY");
  if (!secret) throw new Error("Paystack is not configured yet. Add PAYSTACK_SECRET_KEY on the server.");
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${secret}` },
  });
  const payload = (await response.json()) as PaystackResponse;
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || "Paystack could not verify the payment.");
  }
  return payload;
}

export const initializePaystackPayment = createServerFn({ method: "POST" })
  .validator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const db = adminSupabase();
    const { data: order, error: orderError } = await db
      .from("orders")
      .select("id,order_number,total")
      .eq("order_number", data.orderNumber)
      .maybeSingle();
    if (orderError || !order) throw new Error("We could not find the order to start payment.");

    const amount = Math.round(Number(order.total ?? 0));
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("The order total is invalid.");

    const { data: payment, error: paymentError } = await db
      .from("payments")
      .select("id,method,status")
      .eq("order_id", order.id)
      .eq("method", data.method)
      .maybeSingle();
    if (paymentError || !payment) throw new Error("The payment record for this order is unavailable.");

    const reference = `${data.orderNumber}-${Date.now()}`;
    let payload: PaystackResponse;

    if (data.method === "mpesa") {
      payload = await paystackRequest("/charge", {
        email: data.email,
        amount: amount * 100,
        currency: "KES",
        reference,
        mobile_money: { phone: normalizeKenyanPhone(data.phone), provider: "mpesa" },
        metadata: { order_number: data.orderNumber },
      });
    } else {
      payload = await paystackRequest("/transaction/initialize", {
        email: data.email,
        amount: amount * 100,
        currency: "KES",
        reference,
        channels: ["card"],
        callback_url: `${new URL("/order-confirmed", env("APP_URL") ?? "http://localhost:3000").toString()}`,
        metadata: { order_number: data.orderNumber },
      });
    }

    const providerReference = payload.data?.reference;
    if (!providerReference) throw new Error("Paystack did not return a payment reference.");

    const { error: updateError } = await db
      .from("payments")
      .update({ provider: "paystack", provider_transaction_id: providerReference, status: "pending" })
      .eq("id", payment.id);
    if (updateError) throw new Error("Payment started but the order payment record could not be updated.");

    return {
      method: data.method,
      reference: providerReference,
      authorizationUrl: payload.data?.authorization_url ?? null,
      status: payload.data?.status ?? "pending",
      displayText: payload.data?.display_text ?? null,
    };
  });

export const verifyPaystackPayment = createServerFn({ method: "GET" })
  .validator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const db = adminSupabase();
    const { data: payment, error: paymentError } = await db
      .from("payments")
      .select("id,order_id,amount,status")
      .eq("provider", "paystack")
      .eq("provider_transaction_id", data.reference)
      .maybeSingle();
    if (paymentError || !payment) throw new Error("We could not find this payment record.");

    const payload = await paystackGet(`/transaction/verify/${encodeURIComponent(data.reference)}`);
    const provider = payload.data;
    const expectedAmount = Math.round(Number(payment.amount ?? 0)) * 100;
    const amountMatches = Number(provider?.amount) === expectedAmount;
    const currencyMatches = provider?.currency === "KES";
    const status = provider?.status;

    if (!amountMatches || !currencyMatches) {
      throw new Error("The payment details could not be verified.");
    }

    if (status === "success") {
      const { error } = await db
        .from("payments")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", payment.id);
      if (error) throw new Error("Payment was verified but the order could not be updated.");
      await db.from("orders").update({ status: "processing" }).eq("id", payment.order_id);
      return { status: "paid" as const, reference: data.reference };
    }

    if (status === "failed" || status === "abandoned") {
      await db.from("payments").update({ status: "failed" }).eq("id", payment.id);
      return { status: "failed" as const, reference: data.reference };
    }

    return { status: "pending" as const, reference: data.reference };
  });
