import { vi } from "vitest";

import { clearSession } from "@/lib/session";

import { TEST_CREDENTIALS, TEST_USER } from "./fixtures";

const authMocks = vi.hoisted(() => ({
  signInCustomer: vi.fn(),
  signOutCustomer: vi.fn(),
  syncCustomerSessionFromSupabase: vi.fn(),
}));

vi.mock("@/lib/auth/customer-auth", () => ({
  signInCustomer: authMocks.signInCustomer,
  signOutCustomer: authMocks.signOutCustomer,
  syncCustomerSessionFromSupabase: authMocks.syncCustomerSessionFromSupabase,
}));

export function setupSuccessfulSignIn(): void {
  authMocks.signInCustomer.mockImplementation(async (email: string, password: string) => {
    if (email !== TEST_CREDENTIALS.email || password !== TEST_CREDENTIALS.password) {
      return { ok: false as const, error: "Credenciales inválidas." };
    }

    const { setSession } = await import("@/lib/session");
    setSession(TEST_USER);
    return { ok: true as const, session: TEST_USER, needsEmailConfirmation: false as const };
  });
}

export function setupSuccessfulSignOut(): void {
  authMocks.signOutCustomer.mockImplementation(async () => {
    clearSession();
  });
}

export function setupSessionSyncFromStorage(): void {
  authMocks.syncCustomerSessionFromSupabase.mockImplementation(async () => {
    const { getSession } = await import("@/lib/session");
    return getSession();
  });
}

export function resetAuthMocks(): void {
  authMocks.signInCustomer.mockReset();
  authMocks.signOutCustomer.mockReset();
  authMocks.syncCustomerSessionFromSupabase.mockReset();
  setupSuccessfulSignIn();
  setupSuccessfulSignOut();
  setupSessionSyncFromStorage();
}
