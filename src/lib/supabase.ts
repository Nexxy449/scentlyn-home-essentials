import { createClient } from "@supabase/supabase-js";

function readEnvironment(name: string): string | undefined {
  const viteValue = import.meta.env[name];
  if (viteValue) return viteValue;

  // Route loaders run on the server, where deployment configuration is exposed
  // through process.env rather than Vite's client-side replacement.
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

const supabaseUrl = readEnvironment("VITE_SUPABASE_URL") ?? readEnvironment("SUPABASE_URL");
const supabasePublishableKey =
  readEnvironment("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  readEnvironment("VITE_SUPABASE_ANON_KEY") ??
  readEnvironment("SUPABASE_PUBLISHABLE_KEY");

// Do not crash the entire storefront during server rendering when a deployment
// is missing its Supabase variables. The catalogue layer can fall back to the
// bundled presentation catalogue while deployment configuration is repaired.
// Admin/authenticated database operations still require real Supabase config.
const fallbackUrl = "https://placeholder.supabase.co";
const fallbackKey = "sb_publishable_placeholder";

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = createClient(
  supabaseUrl ?? fallbackUrl,
  supabasePublishableKey ?? fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
