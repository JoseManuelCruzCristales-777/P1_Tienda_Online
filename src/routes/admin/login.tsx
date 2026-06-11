import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { loginAdmin } from "@/lib/api/auth.admin.functions";
import { setAdminToken } from "@/lib/auth/admin-session";
import { homeSearch } from "@/lib/home-search";
import { useI18n } from "@/lib/i18n/I18nProvider";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedUser = username.trim();

    try {
      const result = await loginAdmin({
        data: { username: trimmedUser, password },
      });

      if (!result.ok) {
        setError(result.error ?? t("admin_login_invalid"));
        return;
      }

      setAdminToken(result.token);
      setIsSubmitting(false);
      void navigate({ to: "/admin", replace: true });
    } catch (err) {
      console.error(err);
      setError(t("admin_login_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-margin-mobile py-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md rounded-xl border border-surface-container-highest bg-surface-container-lowest p-8 shadow-[0_20px_60px_rgba(7,6,40,0.08)]">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Rousse Shopping"
            className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
          />
          <h1 className="font-headline-lg text-headline-lg-mobile text-primary">
            {t("admin_login_title")}
          </h1>
          <p className="mt-2 text-body-md text-on-surface-variant">{t("admin_login_desc")}</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          {error ? (
            <p className="rounded-lg border border-error/30 bg-error-container px-4 py-3 text-sm text-error">
              {error}
            </p>
          ) : null}

          <label className="flex flex-col gap-2">
            <span className="text-label-md uppercase text-on-surface-variant">
              {t("admin_login_user")}
            </span>
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="rounded-lg border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label-md uppercase text-on-surface-variant">
              {t("admin_login_password")}
            </span>
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
            {isSubmitting ? t("admin_login_loading") : t("admin_login_submit")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            search={homeSearch}
            className="inline-flex w-full items-center justify-center rounded-full border border-outline-variant px-6 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary hover:bg-surface-container hover:text-primary"
          >
            {t("admin_login_back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
