import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  getAdminCredentials,
  isAdminSessionValid,
  issueAdminSession,
  revokeAdminSession,
} from "../auth/admin-sessions.server";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const tokenSchema = z.object({
  adminToken: z.string().min(1),
});

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(credentialsSchema)
  .handler(async ({ data }) => {
    const expected = getAdminCredentials();
    if (data.username !== expected.username || data.password !== expected.password) {
      return { ok: false as const, error: "Invalid credentials" };
    }
    const token = issueAdminSession();
    return { ok: true as const, token };
  });

export const logoutAdmin = createServerFn({ method: "POST" })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    revokeAdminSession(data.adminToken);
    return { ok: true as const };
  });

export const validateAdminSession = createServerFn({ method: "POST" })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => ({
    valid: isAdminSessionValid(data.adminToken),
  }));

function assertAdmin(token: string | undefined) {
  if (!isAdminSessionValid(token)) {
    throw new Error("Unauthorized");
  }
}

export function requireAdminToken(adminToken: string | undefined) {
  assertAdmin(adminToken);
}
