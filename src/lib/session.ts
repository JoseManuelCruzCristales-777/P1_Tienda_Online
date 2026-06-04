// ---------------------------------------------------------------------------
// Customer session helpers — persisted in localStorage under "rousse-session".
// This is a mock session layer; replace with Supabase Auth when ready.
// ---------------------------------------------------------------------------

const SESSION_KEY = "rousse-session";

/** Data kept in the active customer session (no password stored). */
export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
}

/** Returns the active session, or null if the user is not logged in. */
export function getSession(): CustomerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CustomerSession) : null;
  } catch {
    return null;
  }
}

/** Persists a new session (call after successful login or registration). */
export function setSession(session: CustomerSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/** Removes the session (call on logout). */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Quick boolean check — use this inside components to guard cart actions. */
export function isLoggedIn(): boolean {
  return getSession() !== null;
}
