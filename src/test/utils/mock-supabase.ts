import { vi } from "vitest";

const unsubscribe = vi.fn();

export const supabaseAuthMocks = {
  signOut: vi.fn().mockResolvedValue({ error: null }),
  getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  onAuthStateChange: vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe } },
  }),
};

export function resetSupabaseAuthMocks(): void {
  supabaseAuthMocks.signOut.mockClear();
  supabaseAuthMocks.getSession.mockClear();
  supabaseAuthMocks.onAuthStateChange.mockClear();
  supabaseAuthMocks.signOut.mockResolvedValue({ error: null });
  supabaseAuthMocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  supabaseAuthMocks.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe } },
  });
}

vi.mock("@/lib/supabase/client", () => ({
  getSupabase: () => ({
    auth: supabaseAuthMocks,
  }),
}));
