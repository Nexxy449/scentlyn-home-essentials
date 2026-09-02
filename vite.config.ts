// @lovable.dev/vite-tanstack-config provides the TanStack Start/Vite integration.
// The project is deployed to Vercel, so Nitro must explicitly target Vercel
// instead of the wrapper's default Cloudflare target.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
