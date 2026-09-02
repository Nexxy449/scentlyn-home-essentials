import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        const signature = request.headers.get("x-paystack-signature");
        const raw = await request.text();
        if (!secret || !signature) return new Response("Unauthorized", { status: 401 });

        const expected = createHmac("sha512", secret).update(raw).digest("hex");
        const provided = Buffer.from(signature, "utf8");
        const calculated = Buffer.from(expected, "utf8");
        if (provided.length !== calculated.length || !timingSafeEqual(provided, calculated)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: {
          event?: string;
          data?: { reference?: string; status?: string; amount?: number; currency?: string };
        };
        try {
          event = JSON.parse(raw) as typeof event;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const reference = event.data?.reference;
        if (!reference) return new Response("ok", { status: 200 });

        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) return new Response("Server configuration error", { status: 500 });
        const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

        const { data: payment, error: lookupError } = await db
          .from("payments")
          .select("id,order_id,amount,status")
          .eq("provider", "paystack")
          .eq("provider_transaction_id", reference)
          .maybeSingle();
        if (lookupError) return new Response("Database lookup failed", { status: 500 });
        if (!payment) return new Response("ok", { status: 200 });

        if (event.event === "charge.success" || event.event === "transaction.success") {
          const expectedAmount = Math.round(Number(payment.amount ?? 0)) * 100;
          if (Number(event.data?.amount) !== expectedAmount || event.data?.currency !== "KES") {
            return new Response("Payment details mismatch", { status: 400 });
          }
          if (payment.status !== "paid") {
            const { error } = await db
              .from("payments")
              .update({ status: "paid", paid_at: new Date().toISOString() })
              .eq("id", payment.id);
            if (error) return new Response("Database update failed", { status: 500 });
            await db.from("orders").update({ status: "processing" }).eq("id", payment.order_id);
          }
        }

        if (event.event === "charge.failed" || event.event === "transaction.failed") {
          if (payment.status !== "paid") {
            const { error } = await db.from("payments").update({ status: "failed" }).eq("id", payment.id);
            if (error) return new Response("Database update failed", { status: 500 });
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
