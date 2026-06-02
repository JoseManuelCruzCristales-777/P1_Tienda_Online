import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { loginAdmin } from "@/lib/api/auth.admin.functions";
import { setAdminToken } from "@/lib/auth/admin-session";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await loginAdmin({ data: { username, password } });
      if (!result.ok) {
        setError(result.error ?? "Invalid credentials");
        return;
      }
      setAdminToken(result.token);
      await navigate({ to: "/admin" });
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-margin-mobile py-12">
      <div className="w-full max-w-md rounded-xl border border-surface-container-highest bg-surface-container-lowest p-8 shadow-[0_20px_60px_rgba(7,6,40,0.08)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-on-primary">
            R
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile text-primary">Admin access</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Manage the Rousse Shopping catalog.
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          {error ? (
            <p className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-error">
              {error}
            </p>
          ) : null}

          <label className="flex flex-col gap-2">
            <span className="text-label-md uppercase text-on-surface-variant">Username</span>
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label-md uppercase text-on-surface-variant">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full bg-primary py-3.5 font-semibold tracking-wide text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          <Link to="/" className="text-primary hover:underline">
            Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
