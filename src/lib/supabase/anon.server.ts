import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";

import type { Database } from "./database.types";
import { readServerEnv } from "./env.server";

let anonServerClient: SupabaseClient<Database> | undefined;

function getSupabaseUrl(): string {
  const url = readServerEnv("VITE_SUPABASE_URL") ?? readServerEnv("SUPABASE_URL");
  if (!url) {
    throw new Error("Missing VITE_SUPABASE_URL or SUPABASE_URL for server Supabase client.");
  }
  return url;
}

function getAnonKey(): string {
  const key = readServerEnv("VITE_SUPABASE_ANON_KEY") ?? readServerEnv("SUPABASE_ANON_KEY");
  if (!key) {
    throw new Error("Missing VITE_SUPABASE_ANON_KEY for server Supabase client.");
  }
  return key;
}

/** Cliente anon en servidor — solo para obtener sesión tras registro (sin persistir). */
export function getSupabaseAnonServer(): SupabaseClient<Database> {
  if (!anonServerClient) {
    anonServerClient = createClient<Database>(getSupabaseUrl(), getAnonKey(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: ws as unknown as typeof WebSocket,
      },
    });
  }

  return anonServerClient;
}
