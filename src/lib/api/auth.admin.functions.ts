import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const tokenSchema = z.object({
  adminToken: z.string().min(1),
});

export type AdminLoginResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

/** Credenciales admin → token de sesión (persistido en data/admin-sessions.json). */
export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(credentialsSchema)
  .handler(async ({ data }): Promise<AdminLoginResult> => {
    const { getAdminCredentials, issueAdminSession } = await import(
      "../auth/admin-sessions.server"
    );
    const creds = getAdminCredentials();
    if (data.username !== creds.username || data.password !== creds.password) {
      return { ok: false, error: "Invalid credentials" };
    }
    return { ok: true, token: issueAdminSession() };
  });

/** Invalida el token en servidor y en sessionStorage (vía clearAdminToken en cliente). */
export const logoutAdmin = createServerFn({ method: "POST" })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const { revokeAdminSession } = await import("../auth/admin-sessions.server");
    revokeAdminSession(data.adminToken);
    return { ok: true as const };
  });

/** Comprueba si el token sigue vigente (útil antes de mutaciones admin). */
export const validateAdminSession = createServerFn({ method: "POST" })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const { isAdminSessionValid } = await import("../auth/admin-sessions.server");
    return { ok: isAdminSessionValid(data.adminToken) };
  });
