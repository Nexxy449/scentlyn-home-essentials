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

        const event = JSON.parse(raw) as {
          event?: string;
          data?: { reference?: string; status?: string; amount?: number; metadata?: { order_number?: string } };
        };
        const reference = event.data?.reference;
        if (!reference) return new Response("ok", { status: 200 });

        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) return new Response("Server configuration error", { status: 500 });
        const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

        const { data: payment } = await db
          .from("payments")
          .select("id,order_id,amount,status")
          .eq("provider", "paystack")
          .eq("provider_transaction_id", reference)
          .maybeSingle();
        if (!payment) return new Response("ok", { status: 200 });

        if (event.event === "charge.success" || event.event === "charge.failed" || event.event === "transaction.failed") {
          const nextStatus = event.event === "charge.success" ? "paid" : "failed";
          const paidAt = nextStatus === "paid" ? new Date().toISOString() : null;
          const { error } = await db
            .from("payments")
            .update({ status: nextStatus, paid_at: paidAt })
            .eq("id", payment.id);
          if (error) return new Response("Database update failed", { status: 500 });

          if (nextStatus === "paid") {
            await db.from("orders").update({ status: "processing" }).eq("id", payment.order_id);
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
