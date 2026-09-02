// @lovable.dev/vite-tanstack-config already provides the TanStack Start/Vite
// integration and Nitro plugin. Keep the Lovable preview target intact, but
// explicitly switch Nitro to Vercel when this repository is built by Vercel.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(process.env.VERCEL);

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
  nitro: isVercel ? { preset: "vercel" } : true,
});
