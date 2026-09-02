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

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
