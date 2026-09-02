// @lovable.dev/vite-tanstack-config provides the TanStack Start/Vite integration.
// The deployment target is configured on TanStack Start's server so Nitro emits
// a Vercel-compatible server bundle.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
      preset: "vercel",
    },
  },
});
