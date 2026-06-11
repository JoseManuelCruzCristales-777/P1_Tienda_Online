import { mapAuthError } from "@/lib/auth/auth-errors";
import type { CustomerSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin.server";
import { getSupabaseAnonServer } from "@/lib/supabase/anon.server";

export type SignUpInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type ServerRegisterResult =
  | {
      ok: true;
      session: CustomerSession;
      accessToken: string;
      refreshToken: string;
    }
  | { ok: false; error: string };

async function fetchProfileWithRetry(userId: string, attempts = 4): Promise<CustomerSession | null> {
  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        phone: data.phone,
      };
    }

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  return null;
}

/**
 * Registro vía Admin API: evita el rate limit del endpoint público signUp
 * y confirma el correo automáticamente (sin email de verificación).
 */
export async function registerCustomerOnServer(input: SignUpInput): Promise<ServerRegisterResult> {
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.replace(/\D/g, "");
  const fullName = input.fullName.trim();
  const admin = getSupabaseAdmin();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone,
    },
  });

  if (createError) {
    return { ok: false, error: mapAuthError(createError.message) };
  }

  const userId = created.user?.id;
  if (!userId) {
    return { ok: false, error: "No se pudo crear la cuenta. Intenta de nuevo." };
  }

  let session = await fetchProfileWithRetry(userId);
  if (!session) {
    session = {
      id: userId,
      name: fullName,
      email,
      phone,
    };
  }

  const anon = getSupabaseAnonServer();
  const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (signInError || !signInData.session) {
    return {
      ok: false,
      error: mapAuthError(signInError?.message ?? "No se pudo iniciar la sesión tras el registro."),
    };
  }

  return {
    ok: true,
    session,
    accessToken: signInData.session.access_token,
    refreshToken: signInData.session.refresh_token,
  };
}
