import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

let browserClient: SupabaseClient<Database> | null = null;

function getSupabaseUrl(): string {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url) {
    throw new Error("Missing VITE_SUPABASE_URL. Add it to your .env file.");
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!key) {
    throw new Error("Missing VITE_SUPABASE_ANON_KEY. Add it to your .env file.");
  }
  return key;
}

/** Singleton del cliente Supabase en el navegador. */
export function getSupabase() {
  if (typeof window === "undefined") {
    throw new Error("getSupabase() is only available in the browser.");
  }

  if (!browserClient) {
    browserClient = createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
