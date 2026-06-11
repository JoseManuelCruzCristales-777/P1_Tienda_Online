import { clearAdminToken } from "@/lib/auth/admin-session";

export function isUnauthorizedError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /unauthorized|not authenticated/i.test(message);
}

export function handleAdminAuthFailure(err: unknown, onSessionExpired: () => void): boolean {
  if (!isUnauthorizedError(err)) return false;
  clearAdminToken();
  onSessionExpired();
  return true;
}
