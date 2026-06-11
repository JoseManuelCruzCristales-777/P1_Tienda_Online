import { registerCustomer } from "@/lib/api/auth.customer.functions";
import { mapAuthError } from "@/lib/auth/auth-errors";
import { getSupabase } from "@/lib/supabase/client";
import { clearSession, setSession, type CustomerSession } from "@/lib/session";

export type SignUpInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthResult =
  | { ok: true; session: CustomerSession; needsEmailConfirmation: false }
  | { ok: true; needsEmailConfirmation: true }
  | { ok: false; error: string };

async function fetchProfile(userId: string): Promise<CustomerSession | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    phone: data.phone,
  };
}

async function profileToSession(userId: string): Promise<CustomerSession | null> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const session = await fetchProfile(userId);
    if (session) return session;
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  return null;
}

/** Registra una clienta vía servidor (evita rate limit del signUp público). */
export async function signUpCustomer(input: SignUpInput): Promise<AuthResult> {
  try {
    const result = await registerCustomer({ data: input });

    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    const supabase = getSupabase();
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });

    if (sessionError) {
      return { ok: false, error: mapAuthError(sessionError.message) };
    }

    setSession(result.session);
    return { ok: true, session: result.session, needsEmailConfirmation: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de red al registrar.";
    return { ok: false, error: mapAuthError(message) };
  }
}

/** Inicia sesión y sincroniza la sesión local. */
export async function signInCustomer(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  if (!data.user) {
    return { ok: false, error: "No se pudo iniciar sesión." };
  }

  const session = await profileToSession(data.user.id);
  if (!session) {
    return { ok: false, error: "No se encontró el perfil de la cuenta." };
  }

  setSession(session);
  return { ok: true, session, needsEmailConfirmation: false };
}

/** Cierra sesión en Supabase y limpia la sesión local. */
export async function signOutCustomer(): Promise<void> {
  const supabase = getSupabase();
  await supabase.auth.signOut();
  clearSession();
}

/** Restaura la sesión local desde Supabase Auth (al recargar la página). */
export async function syncCustomerSessionFromSupabase(): Promise<CustomerSession | null> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (!user) {
    clearSession();
    return null;
  }

  const cached = await profileToSession(user.id);
  if (cached) {
    setSession(cached);
    return cached;
  }

  clearSession();
  return null;
}
