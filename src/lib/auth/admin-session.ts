const ADMIN_TOKEN_KEY = "rousse_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return Boolean(getAdminToken());
}
