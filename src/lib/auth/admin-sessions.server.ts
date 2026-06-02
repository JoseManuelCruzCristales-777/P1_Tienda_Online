const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const sessions = new Map<string, number>();

export function issueAdminSession(): string {
  const token = crypto.randomUUID();
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

export function revokeAdminSession(token: string): void {
  sessions.delete(token);
}

export function isAdminSessionValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function getAdminCredentials() {
  console.log("ENV USER:", process.env.ADMIN_USERNAME);
  console.log("ENV PASS:", process.env.ADMIN_PASSWORD);
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "rousse-admin",
  };
}

