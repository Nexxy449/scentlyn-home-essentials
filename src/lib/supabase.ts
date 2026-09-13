import { createClient } from "@supabase/supabase-js";

function readEnvironment(name: string): string | undefined {
  const viteValue = import.meta.env[name];
  if (viteValue) return viteValue;
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

const supabaseUrl = readEnvironment("VITE_SUPABASE_URL") ?? readEnvironment("SUPABASE_URL");
const supabasePublishableKey =
  readEnvironment("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  readEnvironment("VITE_SUPABASE_ANON_KEY") ??
  readEnvironment("SUPABASE_PUBLISHABLE_KEY");

const fallbackUrl = "https://placeholder.supabase.co";
const fallbackKey = "sb_publishable_placeholder";

export const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // Supabase's new publishable keys are API keys, not JWTs. They must be sent
    // as `apikey`; sending the publishable key as a Bearer token can make an
    // authenticated browser request look anonymous and produce misleading RLS
    // failures. A real user access token, when present, is left untouched.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient(
  supabaseUrl ?? fallbackUrl,
  supabasePublishableKey ?? fallbackKey,
  {
    global: {
      fetch: supabasePublishableKey ? createSupabaseFetch(supabasePublishableKey) : fetch,
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
