import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { readServerEnv } from "@/lib/supabase/env.server";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const SESSIONS_FILE = path.join(process.cwd(), "data", "admin-sessions.json");

const sessions = new Map<string, number>();

function persistSessions(): void {
  try {
    mkdirSync(path.dirname(SESSIONS_FILE), { recursive: true });
    const obj: Record<string, number> = {};
    for (const [token, expiresAt] of sessions) {
      obj[token] = expiresAt;
    }
    writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), "utf8");
  } catch {
    /* ignore */
  }
}

function loadSessions(): void {
  try {
    if (!existsSync(SESSIONS_FILE)) return;
    const raw = readFileSync(SESSIONS_FILE, "utf8");
    const obj = JSON.parse(raw) as Record<string, number>;
    const now = Date.now();
    for (const [token, expiresAt] of Object.entries(obj)) {
      if (typeof expiresAt === "number" && now <= expiresAt) {
        sessions.set(token, expiresAt);
      }
    }
  } catch {
    /* corrupt file */
  }
}

loadSessions();

export function issueAdminSession(): string {
  const token = crypto.randomUUID();
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  persistSessions();
  return token;
}

export function revokeAdminSession(token: string): void {
  sessions.delete(token);
  persistSessions();
}

export function isAdminSessionValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    sessions.delete(token);
    persistSessions();
    return false;
  }
  return true;
}

export function getAdminCredentials() {
  return {
    username: readServerEnv("ADMIN_USERNAME") ?? "admin",
    password: readServerEnv("ADMIN_PASSWORD") ?? "rousse-admin",
  };
}

export function assertAdminToken(adminToken: string | undefined): void {
  if (!isAdminSessionValid(adminToken)) {
    throw new Error("Unauthorized");
  }
}
