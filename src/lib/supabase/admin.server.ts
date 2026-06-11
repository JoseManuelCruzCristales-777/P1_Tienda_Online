import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import ws from "ws";

import type { Database } from "./database.types";
import { readServerEnv } from "./env.server";

let adminClient: SupabaseClient<Database> | undefined;

function getSupabaseUrl(): string {
  const url = readServerEnv("VITE_SUPABASE_URL") ?? readServerEnv("SUPABASE_URL");
  if (!url) {
    throw new Error("Missing VITE_SUPABASE_URL or SUPABASE_URL for server Supabase client.");
  }
  return url;
}

function getServiceRoleKey(): string {
  const serviceKey = readServerEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env (Supabase → Settings → API → service_role).",
    );
  }
  return serviceKey;
}

/** Cliente con service_role — solo en servidor, omite RLS. */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!adminClient) {
    adminClient = createClient<Database>(getSupabaseUrl(), getServiceRoleKey(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      // Node.js < 22 no trae WebSocket nativo; Supabase Realtime lo requiere al instanciar el cliente.
      realtime: {
        transport: ws as unknown as typeof WebSocket,
      },
    });
  }

  return adminClient;
}
